/**
 * Configurações globais do sistema.
 * IS_OFFLINE: Define se o app está rodando no modo .exe (Local) ou Online.
 */
export const APP_CONFIG = {
  IS_OFFLINE: false,
  PB_URL: 'http://127.0.0.1:8090', 
  API_URL: 'http://127.0.0.1:3001', // URL do servidor Node (server.js)
  DEFAULT_LOCAL_USER: 'local@digit.ae',
  DEFAULT_LOCAL_PASS: '12345678'
};
