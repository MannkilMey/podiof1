import {
  AdMob,
  AdmobConsentStatus,
  AdmobConsentDebugGeography,
} from '@capacitor-community/admob';
import { isNative } from './usePlatform';

/* ============================================================================
 *  CONSENTIMIENTO (UMP) — control central
 *  ----------------------------------------------------------------------------
 *  DEBUG_EEA: poné true SOLO para probar en tu iPhone desde Paraguay. Simula
 *  que estás en Europa para que aparezca el formulario. ANTES DE PUBLICAR
 *  tiene que quedar en false.
 * ========================================================================== */
const DEBUG_EEA = false;
const TEST_DEVICE_IDS = []; // ej: ['54997B75-1E52-4ED8-AA38-0C33B6208A55']

/* ----------------------------------------------------------------------------
 *  Estado del consentimiento, observable desde React.
 *  Arranca en false: NO se piden anuncios hasta que el consentimiento resuelva.
 * -------------------------------------------------------------------------- */
let canRequestAds = false;
let privacyOptionsRequired = false;
const listeners = new Set();

function emit() {
  listeners.forEach((fn) => fn());
}

export function subscribeConsent(callback) {
  listeners.add(callback);
  return () => listeners.delete(callback);
}

export function getCanRequestAds() {
  return canRequestAds;
}

export function getPrivacyOptionsRequired() {
  return privacyOptionsRequired;
}

/**
 * initConsent()
 * Corre el flujo de consentimiento al arrancar. Actualiza el estado observable
 * y devuelve si se pueden pedir anuncios. Nunca lanza excepción: ante error,
 * habilita los anuncios para no romper la app (igual siguen gateados por
 * premium / isNative en useAds).
 */
export async function initConsent() {
  if (!isNative) return false;

  try {
    const options = DEBUG_EEA
      ? {
          debugGeography: AdmobConsentDebugGeography.EEA,
          testDeviceIdentifiers: TEST_DEVICE_IDS,
        }
      : undefined;

    let info = await AdMob.requestConsentInfo(options);
    console.log('[Consent] estado:', info.status, '| puede pedir ads:', info.canRequestAds);

    if (
      info.isConsentFormAvailable &&
      info.status === AdmobConsentStatus.REQUIRED
    ) {
      console.log('[Consent] mostrando formulario...');
      info = await AdMob.showConsentForm();
      console.log('[Consent] tras formulario | puede pedir ads:', info.canRequestAds);
    }

    canRequestAds = info.canRequestAds !== false;
    privacyOptionsRequired = info.privacyOptionsRequirementStatus === 'REQUIRED';
    emit();
    return canRequestAds;
  } catch (e) {
    console.error('[Consent] error (se habilitan ads igual):', e);
    canRequestAds = true;
    emit();
    return true;
  }
}

/**
 * openPrivacyOptions()
 * Abre el formulario para que el usuario cambie o revoque su consentimiento.
 * Es el "vínculo de revocación" que exige AdMob (paso 6.3).
 */
export async function openPrivacyOptions() {
  if (!isNative) return false;
  try {
    await AdMob.showPrivacyOptionsForm();
    return true;
  } catch (e) {
    console.error('[Consent] error al abrir opciones de privacidad:', e);
    return false;
  }
}