const checkNative = () => {
  try {
    return window.Capacitor?.isNativePlatform?.() || false;
  } catch {
    return false;
  }
};

export const isNative = checkNative();
export const platform = window.Capacitor?.getPlatform?.() || 'web';
export const isAndroid = platform === 'android';
export const isIOS = platform === 'ios';
export const isWeb = !isNative;

export function usePlatform() {
  return { isNative, isWeb, platform, isAndroid, isIOS };
}