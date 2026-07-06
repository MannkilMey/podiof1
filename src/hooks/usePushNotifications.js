import { useEffect } from 'react';
import { useAuthStore } from '../stores/authStore';
import { supabase } from '../lib/supabase';
import { isNative, platform } from './usePlatform';

// Variable de módulo — sobrevive re-renders, garantiza 1 sola inicialización
let pushInitialized = false;

export function usePushNotifications() {
  const user = useAuthStore((state) => state.user);

  useEffect(() => {
    if (!user || !isNative || pushInitialized) return;
    pushInitialized = true;
    initPush();
  }, [user?.id]);
}

async function initPush() {
  try {
    const { PushNotifications } = await import('@capacitor/push-notifications');
    const { Preferences } = await import('@capacitor/preferences');

    const permResult = await PushNotifications.requestPermissions();
    if (permResult.receive !== 'granted') {
      console.log('Push permission denied');
      return;
    }

    await PushNotifications.register();

    // El FCM token lo entrega Firebase (lado Swift) y queda persistido en
    // UserDefaults con la key "CapacitorStorage.FCMToken". Como es persistente,
    // no dependemos de timing: reintentamos unas pocas veces hasta encontrarlo.
    readFcmTokenWithRetry(Preferences);

    // NOTA: en iOS, el evento 'registration' de Capacitor devuelve el token de
    // APNs, NO el FCM token. Solo lo logueamos para confirmar que el registro
    // APNs funcionó; NO lo guardamos porque nuestro envío es vía FCM.
    PushNotifications.addListener('registration', (token) => {
      console.log('APNs registration OK (Capacitor):', token.value);
    });

    PushNotifications.addListener('registrationError', (err) => {
      console.error('Push registration error:', err);
    });

    PushNotifications.addListener('pushNotificationReceived', (notification) => {
      console.log('Push received (foreground):', notification);
    });

    PushNotifications.addListener('pushNotificationActionPerformed', (action) => {
      console.log('Push tapped:', action);
      const url = action.notification?.data?.url;
      if (url) window.location.href = url;
    });

  } catch (err) {
    console.error('Push init error:', err);
  }
}

// Lee el FCM token de Preferences reintentando hasta ~10s.
// En el primer arranque, Firebase puede tardar un instante en entregar el token;
// en arranques siguientes ya está persistido y se resuelve en el primer intento.
async function readFcmTokenWithRetry(Preferences, attempt = 0) {
  const MAX_ATTEMPTS = 10;
  const DELAY_MS = 1000;

  const { value: fcmToken } = await Preferences.get({ key: 'FCMToken' });

  if (fcmToken) {
    console.log('FCM token leído desde Preferences:', fcmToken);
    await saveToken(fcmToken);
    return;
  }

  if (attempt < MAX_ATTEMPTS) {
    setTimeout(() => readFcmTokenWithRetry(Preferences, attempt + 1), DELAY_MS);
  } else {
    console.warn('No se encontró el FCM token tras varios intentos. Se reintentará en el próximo arranque.');
  }
}

async function saveToken(token) {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      console.warn('saveToken: no hay usuario autenticado');
      return;
    }

    const { error } = await supabase
      .from('device_tokens')
      .upsert({
        usuario_id: user.id,
        token: token,
        platform: platform,
        active: true,
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'usuario_id,token'
      });

    if (error) {
      console.error('Error saving push token:', error);
    } else {
      console.log('✅ Push token saved successfully');
    }
  } catch (err) {
    console.error('Error in saveToken:', err);
  }
}