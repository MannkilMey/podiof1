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
  }, [user?.id]); // depende de user.id, no del objeto completo
}

// En usePushNotifications.js — reemplazar initPush completo
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

    // Esperar 3 segundos para que Firebase entregue el token a UserDefaults
    setTimeout(async () => {
      const { value: fcmToken } = await Preferences.get({ key: 'FCMToken' });
      if (fcmToken) {
        console.log('Push token from Preferences:', fcmToken);
        await saveToken(fcmToken);
      }
    }, 3000);

    PushNotifications.addListener('registration', async (token) => {
      console.log('Push token (Capacitor):', token.value);
      await saveToken(token.value);
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

async function saveToken(token) {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

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