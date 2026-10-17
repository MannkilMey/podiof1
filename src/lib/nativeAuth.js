// src/lib/nativeAuth.js
import { SocialLogin } from '@capgo/capacitor-social-login';
import { supabase } from './supabase';
import { isNative } from '../hooks/usePlatform';

const GOOGLE_WEB_CLIENT_ID =
  '501533970409-sen05eclqff9gv05t6e8p8i5phkfanuk.apps.googleusercontent.com';
const GOOGLE_IOS_CLIENT_ID =
  '501533970409-lqhtd7jss77hnb5k56tc88bv68nnpkj0.apps.googleusercontent.com';
const APPLE_SERVICE_ID = 'com.podiof1.app.signin';

const DEBUG_AUTH = true; // poner en false antes de publicar

let initialized = false;
let initPromise = null;

/** Inicializa el plugin nativo. Idempotente. En web no hace nada. */
export async function initSocialLogin() {
  if (!isNative) return false;
  if (initialized) return true;
  if (initPromise) return initPromise;

  initPromise = (async () => {
    try {
      await SocialLogin.initialize({
        google: {
          webClientId: GOOGLE_WEB_CLIENT_ID,
          iOSClientId: GOOGLE_IOS_CLIENT_ID,
          iOSServerClientId: GOOGLE_WEB_CLIENT_ID,
          mode: 'online',
        },
        apple: {
          clientId: APPLE_SERVICE_ID,
          useProperTokenExchange: false,
        },
      });
      initialized = true;
      if (DEBUG_AUTH) console.log('[SocialLogin] initialize ✅');
      return true;
    } catch (e) {
      console.error('[SocialLogin] initialize ❌', e);
      initPromise = null;
      return false;
    }
  })();

  return initPromise;
}

/** Extrae el idToken de forma defensiva y loguea las keys para diagnosticar en device. */
function extractTokens(loginResult, provider) {
  const r = loginResult?.result ?? loginResult ?? {};
  if (DEBUG_AUTH) console.log(`[SocialLogin] ${provider} keys:`, Object.keys(r));

  const idToken = r.idToken ?? r.identityToken ?? r.id_token ?? null;
  const nonce = r.nonce ?? r.rawNonce ?? undefined;

  if (!idToken) {
    throw new Error(
      `[${provider}] No llegó idToken del plugin. Keys: ${Object.keys(r).join(', ') || '(ninguna)'}`
    );
  }
  return { idToken, nonce, profile: r.profile ?? null };
}

/** true si el usuario solo cerró el diálogo (no es un error real que mostrar) */
export function isUserCancelled(error) {
  const msg = String(error?.message ?? error ?? '').toLowerCase();
  return (
    msg.includes('cancel') ||
    msg.includes('1001') ||
    msg.includes('the user closed') ||
    msg.includes('user cancelled')
  );
}

// ───────────────────────── NATIVO (iOS) ─────────────────────────

export async function nativeGoogleLogin() {
  await initSocialLogin();

  const result = await SocialLogin.login({
    provider: 'google',
    options: { scopes: ['profile', 'email'] },
  });

  const { idToken, nonce } = extractTokens(result, 'google');

  const { data, error } = await supabase.auth.signInWithIdToken({
    provider: 'google',
    token: idToken,
    ...(nonce ? { nonce } : {}),
  });
  if (error) throw error;

  if (DEBUG_AUTH) console.log('[SocialLogin] google → Supabase ✅', data?.user?.email);
  return data;
}

export async function nativeAppleLogin() {
  await initSocialLogin();

  const result = await SocialLogin.login({ provider: 'apple', options: {} });

  const { idToken, nonce, profile } = extractTokens(result, 'apple');

  const { data, error } = await supabase.auth.signInWithIdToken({
    provider: 'apple',
    token: idToken,
    ...(nonce ? { nonce } : {}),
  });
  if (error) throw error;

  // Apple manda el nombre SOLO en el primer login de por vida.
  const fullName = [profile?.givenName, profile?.familyName].filter(Boolean).join(' ').trim();
  if (fullName && data?.user && !data.user.user_metadata?.full_name) {
    try {
      await supabase.auth.updateUser({ data: { full_name: fullName } });
    } catch (e) {
      console.warn('[SocialLogin] no se pudo guardar el nombre de Apple', e);
    }
  }

  if (DEBUG_AUTH) console.log('[SocialLogin] apple → Supabase ✅', data?.user?.email);
  return data;
}

// ───────────────────────── WEB (navegador) ─────────────────────────

export async function webGoogleLogin() {
  // Si tu llamada en Login.jsx:292 tiene options (redirectTo, queryParams), copialas acá.
  const { error } = await supabase.auth.signInWithOAuth({ provider: 'google' });
  if (error) throw error;
}

// ─────────────────── API unificada (la que usan las pantallas) ───────────────────

export async function loginWithGoogle() {
  return isNative ? nativeGoogleLogin() : webGoogleLogin();
}

export async function loginWithApple() {
  if (!isNative) throw new Error('Sign in with Apple solo está disponible en la app iOS.');
  return nativeAppleLogin();
}