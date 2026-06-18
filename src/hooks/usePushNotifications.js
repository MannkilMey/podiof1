import { useEffect, useRef } from 'react';
import { useAuthStore } from '../stores/authStore';
import { supabase } from '../lib/supabase';
import { isNative, platform } from './usePlatform';

/**
 * usePushNotifications - Registra push notifications en la app nativa
 * 
 * Solo funciona en Android/iOS (Capacitor).
 * En web no hace nada.
 * 
 * Usage:
 *   function App() {
 *     usePushNotifications();
 *     return <...>;
 *   }
 */
export function usePushNotifications() {
  const user = useAuthStore((state) => state.user);
  const registered = useRef(false);

  useEffect(() => {
    if (!user || !isNative || registered.current) return;
    
    initPush();
    registered.current = true;

    return () => {
      registered.current = false;
    };
  }, [user]);
}

async function initPush() {
  try {
    // Dynamic import to avoid breaking web builds
    const { PushNotifications } = await import('@capacitor/push-notifications');

    // Request permission
    const permResult = await PushNotifications.requestPermissions();
    
    if (permResult.receive !== 'granted') {
      console.log('Push permission denied');
      return;
    }

    // Register with FCM/APNs
    await PushNotifications.register();

    // Listen for registration success
    PushNotifications.addListener('registration', async (token) => {
      console.log('Push token:', token.value);
      await saveToken(token.value);
    });

    // Listen for registration errors
    PushNotifications.addListener('registrationError', (err) => {
      console.error('Push registration error:', err);
    });

    // Listen for incoming notifications (foreground)
    PushNotifications.addListener('pushNotificationReceived', (notification) => {
      console.log('Push received (foreground):', notification);
      // Could show an in-app toast here
    });

    // Listen for notification taps (background/closed)
    PushNotifications.addListener('pushNotificationActionPerformed', (action) => {
      console.log('Push tapped:', action);
      const url = action.notification?.data?.url;
      if (url) {
        window.location.href = url;
      }
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
      console.log('Push token saved');
      
      // Also update user preference
      await supabase
        .from('users')
        .update({ push_enabled: true })
        .eq('id', user.id);
    }
  } catch (err) {
    console.error('Error in saveToken:', err);
  }
}