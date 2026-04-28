import useSound from 'use-sound';
import { useUserStore } from '../store/useUserStore';
import { useMemo, useCallback } from 'react';

export const useAppSounds = () => {
  const { currentUser } = useUserStore();

  const safeParse = (data: any, fallback: any) => {
    if (!data) return fallback;
    if (typeof data === 'object') return data;
    try { return JSON.parse(data); } catch { return fallback; }
  };

  const config = useMemo(() => safeParse(currentUser?.config, { soundEnabled: true }), [currentUser]);
  const soundEnabled = config.soundEnabled;

  // Opções básicas
  const options = {
    volume: 0.5,
    soundEnabled: soundEnabled,
  };

  // Som de tecla com Sprite para evitar repetições
  const [playKeyRaw] = useSound('/sounds/key.mp3', { 
    ...options, 
    volume: 0.4,
    sprite: { click: [400, 200] }
  });
  const playKey = useCallback(() => playKeyRaw({ id: 'click' }), [playKeyRaw]);

  // Sons de erro variados (Random entre 1 e 4)
  const [playE1] = useSound('/sounds/error1.wav', options);
  const [playE2] = useSound('/sounds/error2.wav', options);
  const [playE3] = useSound('/sounds/error3.wav', options);
  const [playE4] = useSound('/sounds/error4.wav', options);

  const playError = useCallback(() => {
    const sounds = [playE1, playE2, playE3, playE4];
    const randomIdx = Math.floor(Math.random() * sounds.length);
    sounds[randomIdx]();
  }, [playE1, playE2, playE3, playE4]);

  const [playStart] = useSound('/sounds/start.wav', options);
  // Sons de conclusão
  const [playS1] = useSound('/sounds/success1.wav', options);
  const [playS2] = useSound('/sounds/success2.wav', options);

  const playSuccess = useCallback(() => {
    const r = Math.random() > 0.5 ? playS1 : playS2;
    r();
  }, [playS1, playS2]);

  // Sons de fracasso variados
  const [playF1] = useSound('/sounds/fail1.wav', options);
  const [playF2] = useSound('/sounds/fail2.wav', options);
  const [playF3] = useSound('/sounds/fail3.wav', options);

  const playFailure = useCallback(() => {
    const sounds = [playF1, playF2, playF3];
    const randomIdx = Math.floor(Math.random() * sounds.length);
    sounds[randomIdx]();
  }, [playF1, playF2, playF3]);

  return {
    playKey,
    playError,
    playStart,
    playSuccess,
    playFailure,
    soundEnabled
  };
};
