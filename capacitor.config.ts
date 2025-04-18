import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.dynamics.app',
  appName: 'Dynamics',
  webDir: 'dist/dynamics/browser',
  plugins: {
    'KeyBoard': {
      resize: "body"
    },
    App: {
      handleDeeplinks: true,
    }
  }
};

export default config;
