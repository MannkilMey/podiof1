import { create } from 'zustand';
import { supabase } from '../lib/supabase';

const DEFAULT_PRICES = { monthly: 2.99, seasonal: 9.99, currency: 'USD' };

export const usePremiumStore = create((set, get) => ({
  paywallEnabled: false,
  subscription: 'free',
  expiresAt: null,
  premiumFeatures: [],
  prices: DEFAULT_PRICES,
  loading: true,
  initialized: false,
  userId: null,

  fetchPremiumStatus: async (userId) => {
    if (!userId) {
      set({ loading: false });
      return;
    }

    const state = get();
    // Ya está en memoria para este usuario en esta sesión — no repetir el fetch
    if (state.initialized && state.userId === userId) {
      return;
    }

    // Fallback: cache de sessionStorage (sobrevive a un F5, no a cerrar la pestaña)
    const cacheKey = `premium_${userId}`;
    const cached = sessionStorage.getItem(cacheKey);
    if (cached) {
      try {
        const data = JSON.parse(cached);
        set({
          paywallEnabled: data.paywallEnabled,
          subscription: data.subscription,
          expiresAt: data.expiresAt,
          premiumFeatures: data.premiumFeatures,
          prices: data.prices,
          loading: false,
          initialized: true,
          userId
        });
        return;
      } catch (e) {
        sessionStorage.removeItem(cacheKey);
      }
    }

    set({ loading: true });

    try {
      const [settingsRes, userRes] = await Promise.all([
        supabase.from('app_settings').select('key, value').in('key', ['paywall_enabled', 'premium_features', 'premium_price']),
        supabase.from('users').select('subscription_status, subscription_expires_at').eq('id', userId).single()
      ]);

      const settings = {};
      (settingsRes.data || []).forEach(s => { settings[s.key] = s.value; });

      const pwEnabled = settings.paywall_enabled === true;
      const features = Array.isArray(settings.premium_features) ? settings.premium_features : [];
      const priceData = settings.premium_price || DEFAULT_PRICES;

      const userData = userRes.data || {};
      const sub = userData.subscription_status || 'free';
      const expires = userData.subscription_expires_at;

      const isExpired = expires && new Date(expires) < new Date();
      const effectiveSub = isExpired ? 'free' : sub;

      set({
        paywallEnabled: pwEnabled,
        subscription: effectiveSub,
        expiresAt: expires,
        premiumFeatures: features,
        prices: priceData,
        loading: false,
        initialized: true,
        userId
      });

      sessionStorage.setItem(cacheKey, JSON.stringify({
        paywallEnabled: pwEnabled,
        subscription: effectiveSub,
        expiresAt: expires,
        premiumFeatures: features,
        prices: priceData
      }));
    } catch (err) {
      console.error('Error fetching premium status:', err);
      set({ loading: false });
    }
  },

  // Llamar al cerrar sesión, o para forzar un refetch (ej. justo después de pagar)
  reset: () => set({
    paywallEnabled: false,
    subscription: 'free',
    expiresAt: null,
    premiumFeatures: [],
    prices: DEFAULT_PRICES,
    loading: true,
    initialized: false,
    userId: null
  })
}));