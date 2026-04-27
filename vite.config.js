import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  return {
    plugins: [react()],
    define: {
      // This maps the Vercel/System variables to the globals used in your code
      // so you don't have to change the React code at all.
      __firebase_config: JSON.stringify(env.VITE_FIREBASE_CONFIG || '{}'),
      __app_id: JSON.stringify(env.VITE_APP_ID || 'adhd-client-tracker'),
      __initial_auth_token: 'undefined'
    }
  };
});
