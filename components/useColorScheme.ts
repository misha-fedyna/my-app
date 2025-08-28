// Always return light on native as well to avoid dark mode usage.
export function useColorScheme() {
  return 'light' as const;
}
