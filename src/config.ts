/**
 * Configurações globais do sistema.
 * IS_OFFLINE: Define se o app está rodando no modo .exe (Local) ou Online.
 */
const HOSTNAME = typeof window !== 'undefined' ? window.location.hostname : '127.0.0.1';

// Se estiver rodando dentro do aplicativo desktop (tauri.localhost / localhost), conecta na VPS de produção
const isLocalhostOrTauri = HOSTNAME === 'localhost' || HOSTNAME === 'tauri.localhost' || HOSTNAME === '127.0.0.1';
const PB_SERVER_URL = isLocalhostOrTauri ? 'http://129.121.45.7:8090' : `http://${HOSTNAME}:8090`;
const API_SERVER_URL = isLocalhostOrTauri ? 'http://129.121.45.7:3001' : `http://${HOSTNAME}:3001`;

export const APP_CONFIG = {
  IS_OFFLINE: false,
  PB_URL: PB_SERVER_URL, 
  API_URL: API_SERVER_URL,
  DEFAULT_LOCAL_USER: 'local@digit.ae',
  DEFAULT_LOCAL_PASS: '12345678'
};
