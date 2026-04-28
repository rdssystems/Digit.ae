/**
 * Configurações globais do sistema.
 * IS_OFFLINE: Define se o app está rodando no modo .exe (Local) ou Online.
 */
const HOSTNAME = typeof window !== 'undefined' ? window.location.hostname : '127.0.0.1';

export const APP_CONFIG = {
  IS_OFFLINE: false,
  PB_URL: `http://${HOSTNAME}:8090`, 
  API_URL: `http://${HOSTNAME}`,
  DEFAULT_LOCAL_USER: 'local@digit.ae',
  DEFAULT_LOCAL_PASS: '12345678'
};
