import { useEffect, useCallback } from 'react';
import { usePremium } from './usePremium';
import { isNative } from './usePlatform';

/* ============================================================================
 *  ADS_CONFIG — EL ÚNICO LUGAR PARA AJUSTAR LOS ANUNCIOS
 *  ----------------------------------------------------------------------------
 *  Para mostrar MÁS ads: poné banner/interstitial en true, o subí el tope.
 *  Para mostrar MENOS: al revés. No hace falta tocar la lógica de abajo.
 *
 *    masterEnabled ............ interruptor global. false = CERO ads para todos
 *                               (útil como "kill switch" si algo sale mal).
 *    interstitialMaxPerSessionPerScreen .. cuántos interstitials como máximo
 *                               por pantalla en una misma sesión de la app.
 *    screens[key] ............. qué formatos habilitar en cada pantalla.
 * ========================================================================== */
export const ADS_CONFIG = {
  masterEnabled: true,
  interstitialMaxPerSessionPerScreen: 1,
  screens: {
    prediction:     { banner: false, interstitial: true  },
    races:          { banner: true,  interstitial: false },
    raceDetail:     { banner: true,  interstitial: false },
    statsDeep:      { banner: true,  interstitial: false },
    statsAnalysis:  { banner: true,  interstitial: false },
    statsHistogram: { banner: true,  interstitial: false },
    bannerExcludedPaths: ['/upgrade'],
  },
};

/* Poné en false para silenciar los logs de diagnóstico en consola. */
const DEBUG_ADS = true;

/* ----------------------------------------------------------------------------
 *  decideShowAds — decisión PURA, sin React ni AdMob.
 *  Separada a propósito: es trivial de leer, testear y diagnosticar.
 *
 *  Regla: se muestran ads SOLO si...
 *    - la config global está encendida (masterEnabled), y
 *    - estamos en la app nativa (nunca en la web), y
 *    - ya terminó de cargar el estado premium (nunca durante loading), y
 *    - el usuario NO es premium.
 *
 *  Usamos isPremium (no canAccess): un usuario free debe ver ads tenga el
 *  paywall encendido o apagado. canAccess devuelve true con el paywall off,
 *  lo que ocultaría los ads a los free — exactamente lo que NO queremos.
 * -------------------------------------------------------------------------- */
export function decideShowAds({ masterEnabled, isNative, loading, isPremium }) {
  return Boolean(masterEnabled && isNative && !loading && !isPremium);
}

/* Registro EN MEMORIA de interstitials ya mostrados en esta sesión.
 * Vive a nivel de módulo: dura mientras la app está abierta y se resetea
 * solo al cerrar/reabrir la app. Eso es justamente "1 por sesión". */
const interstitialCounts = new Map(); // screenKey -> veces mostrado esta sesión

/* ----------------------------------------------------------------------------
 *  useAds — única fuente de verdad para decidir CUÁNDO mostrar anuncios.
 *  (En esta fase solo DECIDE; todavía no llama a AdMob. Eso llega en Fase 3/4.)
 *
 *  Devuelve:
 *    showAds ......................... boolean global de "mostrar ads o no"
 *    isBannerEnabled(screenKey) ...... si corresponde banner en esa pantalla
 *    canShowInterstitial(screenKey) .. si se puede mostrar un interstitial ahí
 *                                       (respeta el tope por sesión)
 *    markInterstitialShown(screenKey)  registrar que se mostró uno
 * -------------------------------------------------------------------------- */
export function useAds() {
  // Reusamos usePremium(): una sola fuente de verdad para el estado premium.
  // Tomamos solo los dos primitivos que necesitamos para minimizar renders.
  const { isPremium, loading } = usePremium();

  const showAds = decideShowAds({
    masterEnabled: ADS_CONFIG.masterEnabled,
    isNative,
    loading,
    isPremium,
  });

  // Log de diagnóstico: se dispara solo cuando cambian las entradas de la
  // decisión (no en cada render), así se ven las transiciones sin spam.
  useEffect(() => {
    if (!DEBUG_ADS) return;
    console.log(
      `[useAds] masterEnabled=${ADS_CONFIG.masterEnabled} isNative=${isNative} ` +
      `loading=${loading} isPremium=${isPremium} -> showAds=${showAds}`
    );
  }, [loading, isPremium, showAds]);

  const isBannerEnabled = useCallback(
    (screenKey) => showAds && Boolean(ADS_CONFIG.screens[screenKey]?.banner),
    [showAds]
  );

  const canShowInterstitial = useCallback(
    (screenKey) => {
      if (!showAds) return false;
      const screenCfg = ADS_CONFIG.screens[screenKey];
      if (!screenCfg?.interstitial) return false;
      const shown = interstitialCounts.get(screenKey) || 0;
      return shown < ADS_CONFIG.interstitialMaxPerSessionPerScreen;
    },
    [showAds]
  );

  const markInterstitialShown = useCallback((screenKey) => {
    interstitialCounts.set(screenKey, (interstitialCounts.get(screenKey) || 0) + 1);
  }, []);

  return { showAds, isBannerEnabled, canShowInterstitial, markInterstitialShown };
}