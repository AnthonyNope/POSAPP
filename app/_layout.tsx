import { Stack } from 'expo-router';

export default function Layout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false, // 👈 oculta el header en todas las pantallas
      }}
    />
  );
}
