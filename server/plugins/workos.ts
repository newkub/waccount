import { initWorkOS } from '../lib/workos';

export default defineNitroPlugin((_nitroApp) => {
  const runtimeConfig = useRuntimeConfig();
  try {
    initWorkOS(runtimeConfig);
  } catch (error) {
    console.error('Failed to initialize WorkOS during server startup:', error);
  }
});
