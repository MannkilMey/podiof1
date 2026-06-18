import { useState, useEffect, useMemo } from 'react';
import { useAuthStore } from '../stores/authStore';
import { supabase } from '../lib/supabase';

/**
 * usePremium - Hook para verificar acceso premium
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
  const [paywallEnabled, setPaywallEnabled] = useState(false);
  const [subscription, setSubscription] = useState('free');
  const [expiresAt, setExpiresAt] = useState(null);
  const [premiumFeatures, setPremiumFeatures] = useState([]);
  const [prices, setPrices] = useState({ monthly: 2.99, seasonal: 9.99, currency: 'USD' });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    // Cache key to avoid refetching every render
    const cacheKey = `premium_${user.id}`;
    const cached = sessionStorage.getItem(cacheKey);
    
    if (cached) {
      try {
        const data = JSON.parse(cached);
        setPaywallEnabled(data.paywallEnabled);
        setSubscription(data.subscription);
        setExpiresAt(data.expiresAt);
        setPremiumFeatures(data.premiumFeatures);
        setPrices(data.prices);
        setLoading(false);
        return;
      } catch (e) {
        sessionStorage.removeItem(cacheKey);
      }
    }

    fetchPremiumStatus();
  }, [user]);

  async function fetchPremiumStatus() {
    try {
      const [settingsRes, userRes] = await Promise.all([
        supabase.from('app_settings').select('key, value').in('key', ['paywall_enabled', 'premium_features', 'premium_price']),
        supabase.from('users').select('subscription_status, subscription_expires_at').eq('id', user.id).single()
      ]);

      const settings = {};
      (settingsRes.data || []).forEach(s => { settings[s.key] = s.value; });

      const pwEnabled = settings.paywall_enabled === true;
      const features = Array.isArray(settings.premium_features) ? settings.premium_features : [];
      const priceData = settings.premium_price || { monthly: 2.99, seasonal: 9.99, currency: 'USD' };
      
      const userData = userRes.data || {};
      const sub = userData.subscription_status || 'free';
      const expires = userData.subscription_expires_at;

      // Check if subscription is expired
      const isExpired = expires && new Date(expires) < new Date();
      const effectiveSub = isExpired ? 'free' : sub;

      setPaywallEnabled(pwEnabled);
      setSubscription(effectiveSub);
      setExpiresAt(expires);
      setPremiumFeatures(features);
      setPrices(priceData);

      // Cache for this session
      const cacheData = {
        paywallEnabled: pwEnabled,
        subscription: effectiveSub,
        expiresAt: expires,
        premiumFeatures: features,
        prices: priceData
      };
      sessionStorage.setItem(`premium_${user.id}`, JSON.stringify(cacheData));
    } catch (err) {
      console.error('Error fetching premium status:', err);
    } finally {
      setLoading(false);
    }
  }

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