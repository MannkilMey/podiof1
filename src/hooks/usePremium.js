import { useEffect, useMemo } from 'react';
import { useAuthStore } from '../stores/authStore';
import { usePremiumStore } from '../stores/premiumStore';

/**
 * usePremium - Hook para verificar acceso premium
 * 
 * El estado real vive en usePremiumStore (Zustand), compartido globalmente
 * entre todos los componentes durante la sesión de la app. Esto evita que
 * cada componente que se monta (ej. cada PaywallGate) vuelva a pedirle
 * el estado premium a Supabase — solo se consulta una vez por sesión.
 * 
 * Returns:
 *   isPremium      - true si el usuario tiene suscripción activa
 *   paywallEnabled - true si el paywall está activado globalmente
 *   canAccess      - true si puede acceder (premium OR paywall desactivado)
 *   loading        - true mientras carga
 *   subscription   - 'free' | 'premium' | 'pro'
 *   expiresAt      - fecha de expiración
 *   checkFeature   - función: checkFeature('stats_advanced') => boolean
 *   prices         - { monthly, seasonal, currency }
 */
export function usePremium() {
  const user = useAuthStore((state) => state.user);
  const paywallEnabled = usePremiumStore((state) => state.paywallEnabled);
  const subscription = usePremiumStore((state) => state.subscription);
  const expiresAt = usePremiumStore((state) => state.expiresAt);
  const premiumFeatures = usePremiumStore((state) => state.premiumFeatures);
  const prices = usePremiumStore((state) => state.prices);
  const loading = usePremiumStore((state) => state.loading);
  const fetchPremiumStatus = usePremiumStore((state) => state.fetchPremiumStatus);

  useEffect(() => {
    if (user?.id) {
      fetchPremiumStatus(user.id);
    }
  }, [user?.id, fetchPremiumStatus]);

  const isPremium = useMemo(() => {
    return subscription === 'premium' || subscription === 'pro';
  }, [subscription]);

  const canAccess = useMemo(() => {
    if (!paywallEnabled) return true; // Paywall off = everything free
    return isPremium;
  }, [paywallEnabled, isPremium]);

  const checkFeature = (featureKey) => {
    if (!paywallEnabled) return true; // Paywall off = all features available
    if (isPremium) return true; // Premium users get everything
    return !premiumFeatures.includes(featureKey); // Free users can't access premium features
  };

  return {
    isPremium,
    paywallEnabled,
    canAccess,
    loading,
    subscription,
    expiresAt,
    checkFeature,
    prices
  };
}