import React, {
  useState, useEffect, useRef, useCallback, useMemo
} from 'react';
import { useUserStore, type Fase, type Licao } from '../store/useUserStore';
import { LogOut, User as UserIcon, Volume2, VolumeX, Maximize2, Minimize2, ShieldCheck } from 'lucide-react';
import { useAppSounds } from '../hooks/useAppSounds';

const MSG_APROVADO = [
  "Fantástico! Seus dedos estão voando pelo teclado! 🚀",
  "Excelente! Você está dominando a arte da digitação! 🏆",
  "Perfeito! Velocidade e precisão trabalhando em harmonia! ⭐",
  "Incrível! Quase não dá para ver seus dedos se movendo de tão rápido! 🔥",
  "Maravilhoso! Continue nesse ritmo, você está imbatível! 🎯",
  "Que show! Você está a um passo de virar um mestre do teclado! 💻"
];

const MSG_REPROVADO = [
  "Quase lá! Respire fundo e tente focar mais na precisão desta vez. 💪",
  "Não desista! Todo mestre começou devagar. Vamos mais uma vez! 🐢",
  "Foi por pouco! Concentre-se em acertar as teclas, a velocidade vem com o tempo. 🎯",
  "Calma! Reduza um pouquinho o ritmo e preste atenção na posição dos dedos. 👐",
  "Um pequeno tropeço no caminho do sucesso. Dê uma pausa e retorne com tudo! 🚧",
  "Você consegue! Tente novamente mantendo os olhos na tela e a mente limpa. 🧘‍♂️"
];

const MSG_START = [
  { h: "Preparar...", m: "VAI! 🚀" },
  { h: "Atenção...", m: "FOCO! 🔥" },
  { h: "Posicionando...", m: "DIGITE! ⌨️" },
  { h: "Respire fundo...", m: "COMEÇOU! 🏁" },
  { h: "Dedos no lugar...", m: "VOE! 🦅" },
  { h: "Tudo pronto?", m: "VELOCIDADE MÁXIMA! ⚡" },
  { h: "Concentração...", m: "AGORA! 🎯" }
];

const TUTORIAL_SLIDES = [
  {
    title: "Posicionamento das Mãos",
    description: "Mantenha os dedos nas teclas ASDF e JKLÇ. Os polegares ficam sobre a barra de espaço.",
    tip: "A base de tudo: Sinta as saliências nas teclas F e J para guiar seus indicadores sem olhar.",
    img: "/assets/tutorial_fingers.png"
  },
  {
    title: "Linha Superior",
    description: "Alcance a linha de cima estendendo os dedos suavemente. Mantenha os pulsos parados.",
    tip: "MOVIMENTO SEGURO: Retorne sempre para a base (Home Row) após cada toque na linha superior.",
    img: "/assets/tutorial_top.png"
  },
  {
    title: "Linha Inferior",
    description: "Flexione os dedos para baixo com precisão. Mantenha as mãos relaxadas.",
    tip: "PONTAS DOS DEDOS: Digite com as pontas e não com as unhas para maior controle e silêncio.",
    img: "/assets/tutorial_bottom.png"
  }
];

// ─── GERADOR DE EXERCÍCIO ─────────────────────────────────────────────────────
// 7 colunas × 4 linhas = 28 repetições
/*
function gerarGrade(seq: string): string[] {
  const linha = Array(7).fill(seq).join(' ');
  return [linha, linha, linha, linha]; // 4 linhas
}
*/

// ─── TECLADO ABNT2 ────────────────────────────────────────────────────────────

// ─── TECLADO ABNT2 ────────────────────────────────────────────────────────────
const ABNT2_ROWS: { key: string; label?: string; flex?: number }[][] = [
  [
    {key:"'"},{key:'1'},{key:'2'},{key:'3'},{key:'4'},{key:'5'},{key:'6'},
    {key:'7'},{key:'8'},{key:'9'},{key:'0'},{key:'-'},{key:'='},
    {key:'BS', label:'⌫', flex:1.6},
  ],
  [
    {key:'TAB', label:'Tab', flex:1.3},
    {key:'q'},{key:'w'},{key:'e'},{key:'r'},{key:'t'},{key:'y'},
    {key:'u'},{key:'i'},{key:'o'},{key:'p'},{key:'´'},{key:'['},
    {key:'ENTER', label:'↵', flex:1.3},
  ],
  [
    {key:'CAPS', label:'Caps', flex:1.5},
    {key:'a'},{key:'s'},{key:'d'},{key:'f'},{key:'g'},{key:'h'},
    {key:'j'},{key:'k'},{key:'l'},{key:'ç'},{key:'~'},{key:']'},
    {key:'BARRA', label:'\\', flex:1.1},
  ],
  [
    {key:'SHIFL', label:'⇧', flex:1.3},
    {key:'z'},{key:'x'},{key:'c'},{key:'v'},{key:'b'},{key:'n'},
    {key:'m'},{key:','},{key:'.'},{key:';'},{key:'/'},
    {key:'SHIFR', label:'⇧', flex:1.9},
  ],
  [
    {key:'CTRL', label:'Ctrl', flex:1.3},
    {key:'WIN', label:'⊞', flex:1.1},
    {key:'ALT', label:'Alt', flex:1.1},
    {key:'SPC', label:'', flex:5.5},
    {key:'ALTGR', label:'AltGr', flex:1.1},
    {key:'WIN2', label:'⊞', flex:1.1},
    {key:'MENU', label:'☰', flex:1.1},
    {key:'CTRL2', label:'Ctrl', flex:1.3},
  ],
];

// ─── TIPOS ────────────────────────────────────────────────────────────────────

// Texto plano sem separadores — o input HTML não captura \n, então nunca usamos \n no alvo
function flatten(linhas: string[]): string {
  // Se for mais de uma linha, inserimos o enter (\n) entre elas.
  return linhas.join('\n');
}

// ─── COMPONENTE PRINCIPAL ────────────────────────────────────────────────────
const TypingEngine: React.FC = () => {
  const { selectedProfile, logout, updateProgress, updateConfig, selectProfile } = useUserStore();
  const { playKey, playError, playStart, playSuccess, playFailure } = useAppSounds();
  
  // Helpers para lidar com dados do Pocketbase que podem vir stringificados


  const config = useMemo(() => selectedProfile?.config || { velocidade: 130, minAcerto: 80, soundEnabled: true }, [selectedProfile]);
  const userProgress = useMemo(() => selectedProfile?.progress || {
    faseIdx: 0, licaoIdx: 0, maxUnlocked: 0, starsByLesson: {}
  }, [selectedProfile]);

  const [faseIdx, setFaseIdx]   = useState(userProgress.faseIdx ?? 0);
  const [licaoIdx, setLicaoIdx] = useState(userProgress.licaoIdx ?? 0);
  const [maxUnlocked, setMaxUnlocked] = useState(userProgress.maxUnlocked ?? 0);

  // Sincroniza estado local se o progresso do usuário mudar (ex: login ou refresh)
  useEffect(() => {
    setFaseIdx(userProgress.faseIdx ?? 0);
    setLicaoIdx(userProgress.licaoIdx ?? 0);
    setMaxUnlocked(userProgress.maxUnlocked ?? 0);
  }, [userProgress.faseIdx, userProgress.licaoIdx, userProgress.maxUnlocked]);

  const [cursorPos, setCursorPos]   = useState(0);
  const [totalErrors, setTotalErrors] = useState(0);
  const [inError, setInError]       = useState(false);
  const [startTime, setStartTime]   = useState<number | null>(null);
  const [elapsed, setElapsed]       = useState(0);
  const [isPaused, setIsPaused]     = useState(false);
  const [accumulatedTime, setAccumulatedTime] = useState(0);

  const [pressedKey, setPressedKey] = useState('');
  const [lastKeyPressStatus, setLastKeyPressStatus] = useState<'correct' | 'wrong' | null>(null);
  const [finished, setFinished]     = useState(false);
  const [showFinalModal, setShowFinalModal] = useState(false);
  const [isCalculating, setIsCalculating] = useState(false);
  const [animatedStars, setAnimatedStars] = useState(0);

  const [isLost, setIsLost]         = useState(false);
  const [extraScrollOffset, setExtraScrollOffset] = useState(0);
  const [focused, setFocused]       = useState(false);
  const [finalElapsed, setFinalElapsed] = useState(0);
  const [isCapsLockOn, setIsCapsLockOn] = useState(false);
  const [showStartMsg, setShowStartMsg] = useState(false);
  const [showTutorial, setShowTutorial] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showFullscreenPrompt, setShowFullscreenPrompt] = useState(false);
  const [tutorialSeen, setTutorialSeen] = useState(false);
  const [m2TutorialSeen, setM2TutorialSeen] = useState(false);
  const [m3TutorialSeen, setM3TutorialSeen] = useState(false);
  const [tutorialStep, setTutorialStep] = useState(0);
  const [currentStartMsg, setCurrentStartMsg] = useState(MSG_START[0]);

  // Exibe tutorial ao entrar no perfil (somente no início da sessão)
  useEffect(() => {
    // Tutorial do Módulo 1 (Início)
    if (selectedProfile && faseIdx === 0 && licaoIdx < 5 && !tutorialSeen) {
      setTutorialStep(0);
      setShowTutorial(true);
      setTutorialSeen(true);
    }
    // Tutorial do Módulo 2 (Linha Superior)
    if (selectedProfile && faseIdx === 1 && licaoIdx === 0 && !m2TutorialSeen) {
      setTutorialStep(1); // Slide da Linha Superior
      setShowTutorial(true);
      setM2TutorialSeen(true);
    }
    // Tutorial do Módulo 3 (Linha Inferior)
    if (selectedProfile && faseIdx === 2 && licaoIdx === 0 && !m3TutorialSeen) {
      setTutorialStep(2); // Slide da Linha Inferior
      setShowTutorial(true);
      setM3TutorialSeen(true);
    }
  }, [selectedProfile, faseIdx, licaoIdx, tutorialSeen, m2TutorialSeen, m3TutorialSeen]);

  // Sincroniza estado de tela cheia e checa prompt inicial
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);

    const hasPrompted = sessionStorage.getItem('digit_ae_fullscreen_prompted');
    if (!document.fullscreenElement && !hasPrompted) {
      const timer = setTimeout(() => {
        setShowFullscreenPrompt(true);
      }, 800);
      return () => {
        clearTimeout(timer);
        document.removeEventListener('fullscreenchange', handleFullscreenChange);
      };
    }

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch((err) => {
        console.error(`Erro ao ativar tela cheia: ${err.message}`);
      });
    } else {
      document.exitFullscreen().catch((err) => {
        console.error(`Erro ao sair da tela cheia: ${err.message}`);
      });
    }
  }, []);

  // ── Sincronização de fase e lição segura ───────────────────────────────────
  const fases = useUserStore(state => state.fases);
  const fase  = fases[faseIdx] || fases[0] || { titulo: 'Carregando...', descricao: '', licoes: [] };
  const licao = fase.licoes ? (fase.licoes[licaoIdx] || fase.licoes[0]) : { id: 1, key: 'm1-l1', titulo: 'Carregando...', subtitulo: '', linhas: [''], teclasFoco: [] };

  const inputRef   = useRef<HTMLInputElement>(null);
  const timerRef   = useRef<ReturnType<typeof setInterval> | null>(null);
  const releaseRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const startRef   = useRef<number | null>(null); // ref para startTime (evita stale em keydown)

  // ── Timer de Alta Precisão (60 FPS para Scrolling) ─────────────────────
  useEffect(() => {
    let requestFrame: number;
    const intervalStart = Date.now();

    const tick = () => {
      const now = Date.now();
      // Cálculo de tempo em segundos com precisão decimal
      const currentSessionSeconds = (now - intervalStart) / 1000;
      setElapsed(accumulatedTime + currentSessionSeconds);
      requestFrame = requestAnimationFrame(tick);
    };

    if (startTime && !finished && !isPaused) {
      if (licao?.isScrolling) {
        requestFrame = requestAnimationFrame(tick);
      } else {
        // Para lições normais, 100ms de intervalo é suficiente e poupa CPU
        timerRef.current = setInterval(() => {
          const now = Date.now();
          const currentSessionSeconds = Math.floor((now - intervalStart) / 1000);
          setElapsed(accumulatedTime + currentSessionSeconds);
        }, 100);
      }
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (requestFrame) cancelAnimationFrame(requestFrame);
    };
  }, [startTime, finished, isPaused, accumulatedTime, licao?.isScrolling]);

  const togglePause = useCallback(() => {
    if (!startTime || finished) return;
    if (isPaused) {
      // Retomando
      setIsPaused(false);
      setTimeout(() => inputRef.current?.focus(), 10);
    } else {
      // Pausando
      setIsPaused(true);
      setAccumulatedTime(elapsed);
    }
  }, [isPaused, startTime, finished, elapsed]);

  // ── Estatísticas ─────────────────────────────────────────────────────────
  const elapsedParaCalc = finished ? finalElapsed : elapsed;
  const { tpm, accuracy, errors } = useMemo(() => {
    const totalAttempts = cursorPos + totalErrors;
    const mins = Math.max(elapsedParaCalc / 60, 1 / 60);
    return {
      tpm:      isLost ? 0 : Math.round(cursorPos / mins),
      accuracy: totalAttempts > 0 ? Math.round((cursorPos / totalAttempts) * 100) : 100,
      errors:   totalErrors,
    };
  }, [cursorPos, totalErrors, elapsedParaCalc, isLost]);

  const totalStars = useMemo(() => {
    if (!userProgress.starsByLesson) return 0;
    return Object.values(userProgress.starsByLesson).reduce((sum: number, val: any) => sum + (Number(val) || 0), 0);
  }, [userProgress.starsByLesson]);

  const starsCalculated = useMemo(() => {
    if (!finished) return 0;
    let accStars = 0;
    if (accuracy === 100) accStars = 5;
    else if (accuracy >= 98) accStars = 4;
    else if (accuracy >= 95) accStars = 3;
    else if (accuracy >= 90) accStars = 2;
    else accStars = 1;

    let spdStars = 0;
    const ratio = tpm / (config.velocidade || 130);
    if (ratio >= 1.0) spdStars = 5;
    else if (ratio >= 0.85) spdStars = 4;
    else if (ratio >= 0.70) spdStars = 3;
    else if (ratio >= 0.50) spdStars = 2;
    else spdStars = 1;

    return Math.min(10, accStars + spdStars);
  }, [finished, accuracy, tpm, config.velocidade]);

  // ── Sincronização de texto e caracteres ───────────────────────────────────

  // Texto plano e chars sem \n para comparação correta
  const textoTotal = useMemo(() => flatten(licao.linhas), [licao]);
  const chars      = useMemo(() => textoTotal.split(''), [textoTotal]);
  // Offsets acumulados de cada linha para mapeamento de índice global
  const lineOffsets = useMemo(() =>
    licao.linhas.reduce<number[]>((acc, l, i) => {
      const isLast = i === licao.linhas.length - 1;
      const len = l.length + (isLast ? 0 : 1);
      return [...acc, (acc[acc.length-1] ?? 0) + len];
    }, []),
  [licao.linhas]);

  const [endMessage, setEndMessage] = useState('');
  const effectFiredRef = useRef(false);

  useEffect(() => {
    if (!finished) {
      effectFiredRef.current = false;
      return;
    }

    if (finished && !effectFiredRef.current) {
      effectFiredRef.current = true; // Marca como executado para evitar loops

      if (isLost) {
         setEndMessage("Modo scrolling: O tempo acabou!");
         setShowFinalModal(true);
         playFailure();
         return;
      }

      const isPassed = accuracy >= config.minAcerto;
      
      // Simulação de cálculo de pontos
      setIsCalculating(true);
      
      setTimeout(() => {
        setIsCalculating(false);
        setShowFinalModal(true);

        if (isPassed) {
          setEndMessage(MSG_APROVADO[Math.floor(Math.random() * MSG_APROVADO.length)]);
          playSuccess();
          
          // AUTO-SAVE: Salva o progresso imediatamente após a vitória
          const nextL = licaoIdx + 1;
          let newFaseIdx = faseIdx;
          let newLicaoIdx = licaoIdx;
          let newMaxUnlocked = maxUnlocked;

          if (nextL < fase.licoes.length) {
            newMaxUnlocked = Math.max(maxUnlocked, nextL);
            newLicaoIdx = nextL;
          } else if (faseIdx < fases.length - 1) {
            newMaxUnlocked = 0; 
            newFaseIdx = faseIdx + 1;
            newLicaoIdx = 0;
          } else {
            newLicaoIdx = 0;
          }

          // Dispara salvamento em segundo plano
          updateProgress(newFaseIdx, newLicaoIdx, newMaxUnlocked, tpm, accuracy, licao.key, starsCalculated);
          setMaxUnlocked(newMaxUnlocked);

          // Animação das estrelas em sequência
          let count = 0;
          const interval = setInterval(() => {
            count++;
            setAnimatedStars(count);
            if (count >= starsCalculated) clearInterval(interval);
          }, 100);
        } else {
          setEndMessage(MSG_REPROVADO[Math.floor(Math.random() * MSG_REPROVADO.length)]);
          playFailure();
        }
      }, 1200); // 1.2s de "processamento"
    }
  }, [finished, accuracy, config.minAcerto, playSuccess, playFailure, isLost, starsCalculated, licaoIdx, fase.licoes.length, faseIdx, updateProgress, maxUnlocked, tpm, licao.key]);


  // ── Handler único (modelo bloqueante) ─────────────────────────────────────────────
  const handleKey = useCallback((e: React.KeyboardEvent) => {
    if (typeof e.getModifierState === 'function') {
      setIsCapsLockOn(e.getModifierState('CapsLock'));
    }
    if (finished || isPaused) return;
    
    const keyMap: Record<string, string> = {
      Backspace:'BACK', Tab:'TAB', CapsLock:'CAPS', Enter:'ENTER',
      Shift:'SHIFT', Control:'CTRL', Alt:'ALT', ' ':'SPC', Meta:'WIN',
    };
    
    const k = keyMap[e.key] ?? e.key.toLowerCase();
    setPressedKey(k);
    if (releaseRef.current) clearTimeout(releaseRef.current);
    releaseRef.current = setTimeout(() => setPressedKey(''), 200);

    if (e.key.length !== 1 && e.key !== 'Enter') {
       // Just visual reaction for special keys
       setLastKeyPressStatus(null);
       return;
    }
    e.preventDefault();

    const expected = chars[cursorPos];
    const isMatch = (e.key === expected) || (e.key === 'Enter' && expected === '\n');

    if (!startRef.current) {
      const now = Date.now();
      startRef.current = now;
      setStartTime(now);
    }

    if (isMatch) {
      playKey();
      setInError(false);
      setLastKeyPressStatus('correct');
      const next = cursorPos + 1;
      setCursorPos(next);
      if (next === chars.length) {
        setFinalElapsed(elapsed);
        setFinished(true);
        if (timerRef.current) clearInterval(timerRef.current);
      }
      
      // Recompensa: se o usuário digitar muito rápido e chegar perto da borda direita, pula o scroll
      if (licao.isScrolling) {
         // Se a distância entre o cursor e o scroll for maior que 480px (quase na borda direita)
         if (cursorDist - scrollOffset > 480) {
            setExtraScrollOffset(prev => prev + 300); // Salta 300px pra frente
         }
      }
    } else {
      playError();
      setInError(true);
      setTotalErrors(prev => prev + 1);
      setLastKeyPressStatus('wrong');
      // Penalidade: Se for modo scrolling, cada erro empurra o texto 48px (aprox 2 letras) à frente
      if (licao.isScrolling) {
        setExtraScrollOffset(prev => prev + 48);
      }
    }
    
    setTimeout(() => {
      setLastKeyPressStatus(null);
    }, 150);
  }, [finished, isLost, isPaused, cursorPos, chars, elapsed]);

  // ── Reset ────────────────────────────────────────────────────────────────
  const resetSession = useCallback((nf?: number, nl?: number) => {
    setCursorPos(0); setTotalErrors(0); setInError(false);
    setStartTime(null); setElapsed(0); setFinalElapsed(0);
    setFinished(false); setIsLost(false); setExtraScrollOffset(0); setPressedKey(''); setIsPaused(false);
    setShowFinalModal(false); setIsCalculating(false); setAnimatedStars(0);
    setAccumulatedTime(0);
    startRef.current = null;
    

    
    if (nf !== undefined) setFaseIdx(nf);
    if (nl !== undefined) setLicaoIdx(nl);
    
    // Tutorial não aparece mais aqui (foi movido para o início da sessão)
    playStart();
    const rand = Math.floor(Math.random() * MSG_START.length);
    setCurrentStartMsg(MSG_START[rand]);
    setShowStartMsg(true);
    setTimeout(() => setShowStartMsg(false), 2000);
    
    setTimeout(() => inputRef.current?.focus(), 60);
  }, [playStart, tutorialSeen, faseIdx]);

  const calcAccuracy = useCallback(() => {
    const total = cursorPos + totalErrors;
    return total > 0 ? Math.round((cursorPos / total) * 100) : 100;
  }, [cursorPos, totalErrors]);



  const avancar = useCallback(() => {
    const acc = calcAccuracy();
    // Salva o progresso sempre local, especialmente as estrelas ganhas!
    if (acc < config.minAcerto) {
      updateProgress(faseIdx, licaoIdx, maxUnlocked, tpm, acc, licao.key, starsCalculated); // saves stars even on fail
      resetSession(faseIdx, licaoIdx);
      return;
    }

    // Agora o salvamento é automático no useEffect de fim de lição
    const nextL = licaoIdx + 1;
    let newFaseIdx = faseIdx;
    let newLicaoIdx = licaoIdx;

    if (nextL < fase.licoes.length) {
      newLicaoIdx = nextL;
    } else if (faseIdx < fases.length - 1) {
      newFaseIdx = faseIdx + 1;
      newLicaoIdx = 0;
    } else {
      newLicaoIdx = 0;
    }

    resetSession(newFaseIdx, newLicaoIdx);

  }, [licaoIdx, fase.licoes.length, faseIdx, config.minAcerto, resetSession, calcAccuracy, maxUnlocked, updateProgress, tpm, starsCalculated]);

  const irParaLicao = useCallback((idx: number) => {
    if (idx < 0 || idx >= fase.licoes.length) return;
    const isUnlocked = faseIdx < userProgress.faseIdx || (faseIdx === userProgress.faseIdx && idx <= userProgress.maxUnlocked);
    if (!isUnlocked) return;
    resetSession(faseIdx, idx);
  }, [faseIdx, resetSession, fase.licoes.length, userProgress.faseIdx, userProgress.maxUnlocked]);

  const nextCh  = !finished && cursorPos < chars.length ? chars[cursorPos] : '';
  const nextKey = nextCh === ' ' ? 'SPC' : nextCh.toLowerCase();
  // Linha atual pelo offset acumulado
  const linhaAtual = useMemo(() => {
    for (let li = 0; li < lineOffsets.length; li++) {
      if (cursorPos < lineOffsets[li]) return li;
    }
    return licao.linhas.length - 1;
  }, [cursorPos, lineOffsets, licao.linhas.length]);

  // Lógica de Rolagem: Calcula o offset X baseado no tempo (forçada) ou no cursor
  const scrollOffset = useMemo(() => {
    if (!licao.isScrolling) return 0;
    if (!startTime) return 12;

    // Se é modo scrolling, a rolagem é forçada pelo tempo e velocidade mínima
    const timeBasedCharPos = (elapsed / 60) * config.velocidade;
    
    // Calcula o offset real somando a largura de cada caractere + margens (baseado no tempo)
    let offset = 0;
    const charsToSum = Math.floor(timeBasedCharPos);
    for (let i = 0; i < charsToSum; i++) {
       if (i >= chars.length) break;
       offset += 24; 
       if (chars[i] === '.') offset += 100; 
    }
    // Interpola o resto decimal da posição do caractere (para movimento fluido)
    const remainder = timeBasedCharPos - charsToSum;
    if (charsToSum < chars.length) {
       let charWidth = 24 + (chars[charsToSum] === '.' ? 100 : 0);
       offset += remainder * charWidth;
    }

    return offset + 12 + extraScrollOffset;
  }, [elapsed, config.velocidade, licao.isScrolling, startTime, chars, extraScrollOffset]);

  // Distância real percorrida pelo cursor do usuário
  const cursorDist = useMemo(() => {
    let d = 0;
    for (let i = 0; i < cursorPos; i++) {
        if (i >= chars.length) break;
        d += 24;
        if (chars[i] === '.') d += 100;
    }
    return d + 12;
  }, [cursorPos, chars]);

  // Condição de Derrota: Se o caractere atual sair da tela pela esquerda (scroll > cursor + limite)
  useEffect(() => {
    if (licao.isScrolling && startTime && !finished && !isLost && !isPaused) {
       // Se o caractere que o usuário deve digitar está a mais de 500px para trás do centro (scrollOffset), ele perde.
       if (scrollOffset - cursorDist > 500) {
          setIsLost(true);
          setFinished(true);
          setFinalElapsed(elapsed);
       }
    }
  }, [licao.isScrolling, startTime, finished, isLost, isPaused, scrollOffset, cursorDist, elapsed]);

  // Timeline Progress: Quão longe o usuário deveria estar baseado na velocidade mínima
  const targetCursorPos = useMemo(() => {
    if (!startTime || finished || isPaused || !licao.isScrolling) return 0;
    const mins = elapsed / 60;
    return mins * config.velocidade;
  }, [elapsed, config.velocidade, startTime, finished, isPaused, licao.isScrolling]);

  // ─── RENDER ──────────────────────────────────────────────────────────────
  return (
    <div style={S.page}>
      {/* ── TOPO ──────────────────────────────────────────── */}
      <div style={S.topBar}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div>
            <div style={S.logo}>Digit.ae</div>
            <div style={S.logoSub}>Tão simples quanto falar</div>
          </div>
          
          <div style={{ width: 1, height: 32, background: 'rgba(255,255,255,0.1)' }} />
          
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ width: 32, height: 32, borderRadius: 8, background: 'rgba(139,92,246,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(139,92,246,0.3)' }}>
              <UserIcon size={16} className="text-violet-400" color="#a78bfa" />
            </div>
            <div>
              <div style={{ fontSize: 13, fontWeight: 700, color: '#fff', display: 'flex', alignItems: 'center', gap: 6 }}>
                {selectedProfile?.name}
                <span style={{ fontSize: 10, color: '#fbbf24', background: 'rgba(251,191,36,0.1)', padding: '2px 6px', borderRadius: 12, border: '1px solid rgba(251,191,36,0.2)' }}>
                  {totalStars} ⭐
                </span>
              </div>
              <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Praticando agora</div>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {startTime && !finished && (
            <button 
              style={{ ...S.iconBtn, color: isPaused ? '#34d399' : '#fbbf24', width: 'auto', padding: '7px 16px', gap: 8, fontSize: 11, fontWeight: 800 }}
              onClick={togglePause}
            >
              {isPaused ? '▶ RETOMAR' : '⏸ PAUSAR'}
            </button>
          )}

          <div style={{...S.modeToggle, display: 'flex', alignItems: 'center', gap: 12}}>
            <button 
              onClick={() => resetSession(faseIdx - 1, 0)} 
              disabled={faseIdx === 0} 
              style={{ background: 'transparent', border: 'none', color: faseIdx === 0 ? 'rgba(255,255,255,0.1)' : '#a78bfa', cursor: faseIdx === 0 ? 'not-allowed' : 'pointer', fontSize: 16, padding: '0 4px' }}
              title="Módulo Anterior"
            >
              ←
            </button>
            <span style={{ color:'rgba(255,255,255,0.8)', fontSize:12, fontWeight: 700 }}>
              {fase.titulo}
            </span>
            <button 
              onClick={() => resetSession(faseIdx + 1, 0)} 
              disabled={faseIdx >= fases.length - 1 || faseIdx >= userProgress.faseIdx} 
              style={{ background: 'transparent', border: 'none', color: (faseIdx >= fases.length - 1 || faseIdx >= userProgress.faseIdx) ? 'rgba(255,255,255,0.1)' : '#a78bfa', cursor: (faseIdx >= fases.length - 1 || faseIdx >= userProgress.faseIdx) ? 'not-allowed' : 'pointer', fontSize: 16, padding: '0 4px' }}
              title="Próximo Módulo"
            >
              →
            </button>
          </div>

          <button 
            style={{ ...S.iconBtn, color: config.soundEnabled ? '#a78bfa' : '#6b7280' }} 
            onClick={() => updateConfig({ soundEnabled: !config.soundEnabled })}
            title={config.soundEnabled ? "Mudar para Mudo" : "Ativar Som"}
          >
            {config.soundEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
          </button>

          <button 
            style={{ ...S.iconBtn, color: '#34d399' }} 
            onClick={toggleFullscreen}
            title={isFullscreen ? "Sair da Tela Cheia (F11)" : "Modo Tela Cheia (F11)"}
          >
            {isFullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
          </button>

          {currentUser && (currentUser.email === 'klismanrds@gmail.com' || currentUser.isAdmin) && (
            <button 
              style={{ ...S.iconBtn, color: '#c084fc', background: 'rgba(192,132,252,0.1)', border: '1px solid rgba(192,132,252,0.3)' }} 
              onClick={() => useUserStore.getState().setShowAdminDashboard(true)}
              title="Painel de Administração"
            >
              <ShieldCheck size={16} />
            </button>
          )}

          <button style={{ ...S.iconBtn, color: '#f87171' }} onClick={logout} title="Sair da Conta">
            <LogOut size={16} />
          </button>

          <button 
            style={{ ...S.iconBtn, color: '#60a5fa' }} 
            onClick={() => selectProfile(null)}
            title="Trocar Aluno"
          >
            <UserIcon size={16} />
          </button>

          <button 
            style={{ ...S.iconBtn, color: '#a78bfa', background: 'rgba(139,92,246,0.1)', border: '1px solid rgba(139,92,246,0.3)' }} 
            onClick={() => setShowTutorial(true)}
            title="Tutorial de Posição"
          >
            <span style={{ fontSize: 10, fontWeight: 900 }}>DEDOS</span>
          </button>
        </div>
      </div>

      {/* ── PROGRESSO DE LIÇÕES ──────────────────────────── */}
      <div style={S.licaoBar}>
        {fase.licoes.map((l, li) => {
          const lessonStars = (userProgress.starsByLesson as Record<string, number>)?.[l.key];
          const isUnlocked = faseIdx < userProgress.faseIdx || (faseIdx === userProgress.faseIdx && li <= userProgress.maxUnlocked);
          
          return (
            <div key={li} style={S.licaoDot(li === licaoIdx, li < licaoIdx)}>
              <div 
                className={li === licaoIdx ? 'active-lesson-pulse' : ''}
                style={{ ...S.licaoDotCircle(li === licaoIdx, li < licaoIdx), cursor: isUnlocked ? 'pointer' : 'not-allowed' }}
                onClick={() => isUnlocked && irParaLicao(li)}
              >
                {li < licaoIdx ? '✓' : li + 1}
              </div>
              <span style={{ fontSize:9, marginTop:4, color: li===licaoIdx?'#a78bfa': li < licaoIdx ? 'rgba(167, 139, 250, 0.5)' : 'rgba(255,255,255,0.15)', whiteSpace:'nowrap', fontWeight: li === licaoIdx ? 700 : 400 }}>
                L{li+1}
              </span>
              {lessonStars !== undefined && (
                <span style={{ fontSize:10, fontWeight:800, color:'#fbbf24', marginTop: 2 }}>{lessonStars}⭐</span>
              )}
            </div>
          );
        })}
      </div>

      {/* ── CABEÇALHO DA LIÇÃO + NAVEGAÇÃO ──────────────────────────────────── */}
      <div style={{ width:'100%', maxWidth: 1400, display:'flex', flexDirection:'row',
        alignItems:'center', justifyContent:'space-between', gap:12 }}>

        <button
          onClick={() => irParaLicao(licaoIdx - 1)}
          disabled={licaoIdx === 0}
          style={{
            padding:'10px 20px', borderRadius:14, border:'1px solid rgba(255,255,255,0.08)',
            background: licaoIdx === 0 ? 'rgba(255,255,255,0.02)' : 'rgba(255,255,255,0.05)',
            color: licaoIdx === 0 ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.5)',
            cursor: licaoIdx === 0 ? 'not-allowed' : 'pointer',
            fontSize:11, fontWeight:800, fontFamily:"'Outfit',sans-serif",
            textTransform: 'uppercase', letterSpacing: '0.05em',
            transition:'all 0.15s', whiteSpace:'nowrap',
          }}
        >
          ← Anterior
        </button>

        <div style={{ textAlign:'center', flex:1 }}>
          <div style={S.licaoTitulo}>{licao.titulo}</div>
          <div style={S.licaoSub}>{licao.subtitulo}</div>
        </div>

        {(() => {
          const proximoIdx = licaoIdx + 1;
          const isProximaUnlocked = faseIdx < userProgress.faseIdx || (faseIdx === userProgress.faseIdx && proximoIdx <= userProgress.maxUnlocked);
          const podeProxima = proximoIdx < fase.licoes.length && isProximaUnlocked;
          return (
            <button
              onClick={() => irParaLicao(licaoIdx + 1)}
              disabled={!podeProxima}
              style={{
                padding:'10px 20px', borderRadius:14,
                border: podeProxima ? '1px solid rgba(139,92,246,0.3)' : '1px solid rgba(255,255,255,0.08)',
                background: podeProxima ? 'rgba(139,92,246,0.08)' : 'rgba(255,255,255,0.02)',
                color: podeProxima ? '#c4b5fd' : 'rgba(255,255,255,0.1)',
                cursor: podeProxima ? 'pointer' : 'not-allowed',
                fontSize:11, fontWeight:800, fontFamily:"'Outfit',sans-serif",
                textTransform: 'uppercase', letterSpacing: '0.05em',
                transition:'all 0.15s', whiteSpace:'nowrap',
              }}
            >
              Próxima →
            </button>
          );
        })()}
      </div>


      {/* ── STATS ────────────────────────────────────────── */}
      <div style={S.statsRow}>
        {[
          {l:'TPM', v:tpm, c:'#a78bfa'},
          {l:'Precisão', v:`${accuracy}%`, c:'#34d399'},
          {l:'Erros', v:errors, c:'#f87171'},
          {l:'Tempo', v:`${licao.isScrolling ? elapsed.toFixed(1) : Math.floor(elapsed)}s`, c:'#60a5fa'},
        ].map(s => (
          <div key={s.l} style={S.statCard}>
            <div style={{fontSize:9,fontWeight:700,letterSpacing:'0.2em',textTransform:'uppercase',color:s.c}}>{s.l}</div>
            <div style={{fontSize:22,fontWeight:900,color:'#fff',fontFamily:"'JetBrains Mono',monospace"}}>{s.v}</div>
          </div>
        ))}
        <div style={S.progressWrap}>
          <div style={{fontSize:10,color:'rgba(255,255,255,0.3)',marginBottom:4, display: 'flex', justifyContent: 'space-between'}}>
            <span>Progresso — {Math.round((cursorPos / textoTotal.length) * 100)}%</span>
            {licao.isScrolling && (
              <span style={{color: cursorPos >= targetCursorPos ? '#34d399' : '#f87171'}}>
                {cursorPos >= targetCursorPos ? 'No ritmo ✓' : 'Acelere! ⚡'}
              </span>
            )}
          </div>
          <div style={S.progressBar}>
            <div style={{...S.progressFill,
              width:`${(cursorPos / textoTotal.length) * 100}%`}}/>
          </div>
        </div>
        <button style={S.resetBtn} onClick={() => resetSession(faseIdx, licaoIdx)}>↺ Reiniciar</button>
      </div>

      {/* ── GRADE DE EXERCÍCIO / MODO SCROLLING ───────────────────────────── */}
      <div
        style={{...S.grade, height: licao.isScrolling ? 180 : 'auto', justifyContent: licao.isScrolling ? 'center' : 'flex-start'}}
        onClick={() => inputRef.current?.focus()}
      >
        <input
          ref={inputRef}
          onKeyDown={handleKey}
          onKeyUp={(e) => { if (e.getModifierState) setIsCapsLockOn(e.getModifierState('CapsLock')); }}
          onClick={(e) => { if (e.getModifierState) setIsCapsLockOn(e.getModifierState('CapsLock')); }}
          onFocus={() => { setFocused(true); }}
          onBlur={() => setFocused(false)}
          readOnly
          spellCheck={false} autoComplete="off" autoCorrect="off" autoCapitalize="off"
          style={{ position:'absolute', opacity:0, width:'100%', height:'100%', cursor:'text', zIndex:1 }}
        />

        {licao.isScrolling ? (
          <div style={{ position: 'relative', width: '100%', overflow: 'hidden', height: 120, display: 'flex', alignItems: 'center', background: 'rgba(0,0,0,0.2)', borderRadius: 12 }}>
            
            {/* Linhas de trilha estilo Guitar Hero */}
            <div style={{ position: 'absolute', top: '40%', left: 0, right: 0, height: 1, background: 'rgba(255,255,255,0.05)' }} />
            <div style={{ position: 'absolute', top: '60%', left: 0, right: 0, height: 1, background: 'rgba(255,255,255,0.05)' }} />

            <div style={{ 
              display:'flex', 
              alignItems:'center', 
              whiteSpace: 'nowrap',
              position: 'relative',
              left: '50%',
              // Centralizamos o marcador em 50% da largura do container do pai
              transform: `translateX(-${scrollOffset}px)`,
              transition: 'none', // Desativado para permitir animação fluida de 60fps via rAF
            }}>
              {chars.map((ch, gi) => {
                const isCorrecto = gi < cursorPos;
                const isCur      = gi === cursorPos;
                const isCurErr   = isCur && inError;

                return (
                  <span key={gi} style={{
                    display:'inline-block',
                    width: 24,
                    height: 60,
                    lineHeight:'60px',
                    textAlign:'center',
                    fontFamily:"'JetBrains Mono',monospace",
                    fontSize: isCur ? 36 : 28,
                    fontWeight: 800,
                    position:'relative',
                    color:  isCorrecto ? '#34d399'
                          : isCurErr   ? '#f87171'
                          : isCur      ? '#fff'
                          : 'rgba(255,255,255,0.15)',
                    background: isCurErr ? 'rgba(239,68,68,0.3)' : 'transparent',
                    transform: isCur ? 'scale(1.2)' : 'scale(1)',
                    textShadow: isCur ? '0 0 15px rgba(255,255,255,0.5)' : isCorrecto ? '0 0 8px rgba(52,211,153,0.4)' : 'none',
                    transition: 'all 0.1s',
                    filter: isCur ? 'brightness(1.5)' : 'none',
                    // Adiciona um espaço visual extra após o ponto final (que separa as frases)
                    marginRight: ch === '.' ? 100 : 0, 
                  }}>
                    {ch === ' ' ? '\u00A0' : ch}
                  </span>
                );
              })}
            </div>
            
            {/* Marcador "Strike Zone" (Guitar Hero Style) */}
            <div style={{
              position: 'absolute',
              left: '50%',
              top: '10%',
              bottom: '10%',
              width: 40,
              marginLeft: -20,
              border: '2px solid #a78bfa',
              borderRadius: 8,
              background: 'rgba(167,139,250,0.1)',
              boxShadow: '0 0 20px rgba(167,139,250,0.4), inset 0 0 10px rgba(167,139,250,0.2)',
              zIndex: 2,
              pointerEvents: 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              {/* Brilho pulsante no centro do marcador */}
              <div style={{ 
                width: 4, 
                height: '100%', 
                background: '#a78bfa', 
                opacity: 0.3,
                boxShadow: '0 0 10px #a78bfa'
              }} />
            </div>

            {/* Labels de Ritmo */}
            <div style={{ position: 'absolute', bottom: 10, left: '50%', transform: 'translateX(-50%)', fontSize: 10, fontWeight: 900, color: '#a78bfa', opacity: 0.6, letterSpacing: '0.1em' }}>
               ZONA DE IMPACTO
            </div>
          </div>
        ) : (
          licao.linhas.map((linha, li) => {
            const startOfLine = lineOffsets[li - 1] ?? 0;
            const isLineAtiva = li === linhaAtual;
            const isLineDone  = li < linhaAtual;
            const isLastLine  = li === licao.linhas.length - 1;
            const charsInLine = isLastLine ? linha.split('') : [...linha.split(''), '\n'];

            return (
              <div key={li} style={S.gradeRow(isLineAtiva, isLineDone)}>
                <div style={S.gradeLineNum(isLineAtiva, isLineDone)}>{li+1}</div>
                <div style={{ display:'flex', flexWrap:'wrap' as const, alignItems:'center', gap:0 }}>
                  {charsInLine.map((ch, ci) => {
                    const gi = startOfLine + ci;
                    const isCorrecto = gi < cursorPos;
                    const isCur      = gi === cursorPos;
                    const isCurErr   = isCur && inError;

                    return (
                      <span key={ci} style={{
                        display:'inline-block',
                        width: ch === ' ' ? 12 : 'auto',
                        minWidth: ch === ' ' ? 12 : 20,
                        height: 40,
                        lineHeight:'40px',
                        textAlign:'center',
                        fontFamily:"'JetBrains Mono',monospace",
                        fontSize: 24,
                        fontWeight: 700,
                        borderRadius: 4,
                        position:'relative',
                        color:  isCorrecto ? '#34d399'
                              : isCurErr   ? '#f87171'
                              : isCur      ? '#fff'
                              : isLineDone ? 'rgba(255,255,255,0.1)'
                              : isLineAtiva ? 'rgba(255,255,255,0.5)'
                              : 'rgba(255,255,255,0.1)',
                        background: isCurErr ? 'rgba(239,68,68,0.2)' : isCur ? 'rgba(139,92,246,0.15)' : 'transparent',
                        borderBottom: isCurErr
                          ? '2px solid #f87171'
                          : isCur ? '2px solid #a78bfa'
                          : '2px solid transparent',
                        textShadow: isCorrecto ? '0 0 10px rgba(52,211,153,0.35)' : isCurErr ? '0 0 8px rgba(248,113,113,0.5)' : 'none',
                        transition: 'color 0.08s, background 0.08s',
                        animation: isCurErr ? 'shake 0.15s ease' : 'none',
                      }}>
                        {ch === ' ' ? '\u00A0' : ch === '\n' ? '↵' : ch}
                      </span>
                    );
                  })}
                </div>
              </div>
            );
          })
        )}

        {isPaused && (
          <div style={S.overlay}>
             <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 48, marginBottom: 16 }}>⏸</div>
                <div style={{ fontSize: 24, fontWeight: 900, color: '#fff', marginBottom: 8 }}>ATIVIDADE PAUSADA</div>
                <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.5)', marginBottom: 24 }}>O tempo e a timeline estão congelados.</div>
                <button 
                  style={{ ...S.cfgClose, margin: '0 auto', width: 'auto', padding: '12px 32px', background: 'linear-gradient(135deg,#7c3aed,#4f46e5)', border: 'none', color: '#fff' }}
                  onClick={togglePause}
                >
                  RETOMAR AGORA
                </button>
             </div>
          </div>
        )}

        {showStartMsg && (
          <div style={{ ...S.overlay, background: 'rgba(8,8,15,0.85)', backdropFilter: 'blur(4px)' }}>
             <div style={{ textAlign: 'center', animation: 'scaleIn 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)' }}>
                <div style={{ fontSize: 10, fontWeight: 900, color: '#a78bfa', letterSpacing: '0.4em', marginBottom: 4, textTransform: 'uppercase' }}>
                  {currentStartMsg.h}
                </div>
                <div style={{ fontSize: 48, fontWeight: 900, color: '#fff', letterSpacing: '-0.02em' }}>
                  {currentStartMsg.m}
                </div>
             </div>
          </div>
        )}

        {!focused && !finished && !isPaused && (
          <div style={S.overlay}>
            <span style={{fontSize:18}}>⌨️</span>
            <span style={{color:'rgba(167,139,250,0.9)',fontSize:14,fontWeight:600}}>
              Clique aqui · Digite a primeira tecla para começar
            </span>
          </div>
        )}


      </div>

      {!finished && !isPaused && (
        <div style={{ display:'flex', alignItems:'center', gap:12 }}>
          <span style={{ color:'rgba(255,255,255,0.25)', fontSize:12 }}>Próxima tecla:</span>
          {nextCh && (
            <kbd style={{
              padding:'4px 16px', borderRadius:10,
              background:'rgba(99,102,241,0.18)', border:'1px solid rgba(139,92,246,0.45)',
              color:'#c4b5fd', fontFamily:"'JetBrains Mono',monospace",
              fontWeight:700, fontSize:18,
            }}>
              {nextCh === ' ' ? 'Espaço' : nextCh === '\n' ? 'Enter' : nextCh.toUpperCase()}
            </kbd>
          )}
          {licao.teclasFoco.length > 0 && (
            <span style={{color:'rgba(255,255,255,0.2)',fontSize:11}}>
              Teclas desta lição: [{licao.teclasFoco.join(' ')}]
            </span>
          )}
          {isCapsLockOn && (
            <span style={{ marginLeft: 'auto', background: '#ef4444', color: '#fff', padding: '6px 12px', borderRadius: 8, fontSize: 12, fontWeight: 800, animation: 'blink 1.5s infinite', display: 'flex', alignItems: 'center', gap: 6, boxShadow: '0 0 12px rgba(239,68,68,0.5)' }}>
               ⚠️ CAPS LOCK ATIVADO
            </span>
          )}
        </div>
      )}

      {/* ── TECLADO ABNT2 ────────────────────────────────── */}
      <div style={S.keyboard}>
        <div style={{textAlign:'center',fontSize:9,color:'rgba(255,255,255,0.15)',
          letterSpacing:'0.2em',textTransform:'uppercase',marginBottom:8}}>
          Teclado ABNT2
        </div>

        {ABNT2_ROWS.map((row, ri) => (
          <div key={ri} style={{ display:'flex', flexDirection:'row', gap:4, justifyContent:'center', width:'100%' }}>
            {row.map(({key, label, flex}) => {
              const displayLabel = label !== undefined ? label : key;
              const match  = key.toLowerCase();
              const isPressed = pressedKey === match || pressedKey === key;
              const isFoco = licao.teclasFoco.includes(match);
              const isNext = match === nextKey || key === nextKey;
              const isCapsActive = key === 'CAPS' && isCapsLockOn;

              return (
                <div key={key} style={{
                  display:'flex', alignItems:'center', justifyContent:'center',
                  borderRadius:7, height:38,
                  flex: flex ?? 1,
                  minWidth: 0,
                  fontSize: displayLabel.length > 3 ? 9 : 11,
                  fontWeight:800, letterSpacing:'0.05em',
                  textTransform:'uppercase',
                  cursor:'default', transition:'all 0.07s',
                  userSelect:'none', whiteSpace:'nowrap',
                  overflow:'hidden',
                  ...(isCapsActive ? {
                    background:'#ef4444',
                    border:'1px solid #f87171',
                    color:'#fff',
                    boxShadow:'0 0 16px rgba(239,68,68,0.7)',
                  } : isPressed ? {
                    background: lastKeyPressStatus === 'wrong' ? '#ef4444' : 'linear-gradient(135deg,#7c3aed,#4f46e5)',
                    border: '1px solid ' + (lastKeyPressStatus === 'wrong' ? '#f87171' : '#a78bfa'),
                    color: '#fff',
                    transform: 'translateY(2px) scale(0.91)',
                    boxShadow: lastKeyPressStatus === 'wrong' ? '0 0 16px rgba(239,68,68,0.7)' : '0 0 16px rgba(139,92,246,0.7)',
                  } : isNext ? {
                    background:'rgba(59,130,246,0.2)',
                    border:'1px solid rgba(96,165,250,0.7)',
                    color:'#93c5fd',
                    boxShadow:'0 0 10px rgba(59,130,246,0.3)',
                    transform:'translateY(-1px)',
                  } : isFoco ? {
                    background:'rgba(167,139,250,0.1)',
                    border:'1px solid rgba(167,139,250,0.35)',
                    color:'rgba(196,181,253,0.8)',
                    boxShadow:'inset 0 0 8px rgba(139,92,246,0.1)',
                  } : {
                    background:'rgba(255,255,255,0.05)',
                    border:'1px solid rgba(255,255,255,0.09)',
                    color:'rgba(255,255,255,0.35)',
                    boxShadow:'0 2px 0 rgba(0,0,0,0.3)',
                  }),
                }}>
                  {displayLabel}
                </div>
              );
            })}
          </div>
        ))}
      </div>

      {/* ── TUTORIAL OVERLAY ──────────────────────────── */}
      {showTutorial && (
        <div style={{...S.overlay, position: 'fixed', backdropFilter: 'blur(35px)', background: 'rgba(5,3,15,0.95)', zIndex: 2000 }}>
           <div style={{ 
             width: '90%', maxWidth: 640, padding: '24px 32px', background: 'rgba(15,10,40,0.6)', 
             border: '1px solid rgba(139,92,246,0.3)', borderRadius: 32, textAlign: 'center',
             boxShadow: '0 30px 100px rgba(0,0,0,0.8)', animation: 'scaleIn 0.3s ease'
           }}>
              <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginBottom: 16 }}>
                {TUTORIAL_SLIDES.map((_, i) => (
                  <div key={i} style={{ 
                    width: i === tutorialStep ? 32 : 8, height: 6, borderRadius: 3, 
                    background: i === tutorialStep ? '#a78bfa' : 'rgba(167,139,250,0.2)',
                    transition: 'all 0.3s'
                  }} />
                ))}
              </div>

              <div style={{ fontSize: 10, fontWeight: 900, color: '#a78bfa', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: 6 }}>
                Passo {tutorialStep + 1} de 3
              </div>
              <div style={{ fontSize: 24, fontWeight: 900, color: '#fff', marginBottom: 16, letterSpacing: '-0.02em' }}>
                {TUTORIAL_SLIDES[tutorialStep].title}
              </div>
              
              <div style={{ position: 'relative', borderRadius: 20, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)', background: '#000', marginBottom: 16, boxShadow: '0 15px 30px rgba(0,0,0,0.4)' }}>
                 <img 
                   src={TUTORIAL_SLIDES[tutorialStep].img} 
                   alt={TUTORIAL_SLIDES[tutorialStep].title} 
                   style={{ width: '100%', display: 'block', height: 260, objectFit: 'cover' }} 
                 />
                 <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '16px 24px', background: 'linear-gradient(to top, rgba(0,0,0,0.95), transparent)', fontSize: 13, color: 'rgba(255,255,255,0.9)', lineHeight: 1.4 }}>
                    {TUTORIAL_SLIDES[tutorialStep].description}
                 </div>
              </div>

              <div style={{ padding: '12px 20px', borderRadius: 16, background: 'rgba(139,92,246,0.06)', border: '1px solid rgba(139,92,246,0.2)', marginBottom: 24, textAlign: 'left' }}>
                <div style={{ fontSize: 10, fontWeight: 900, color: '#a78bfa', marginBottom: 4, letterSpacing: '0.1em' }}>DICA DE OURO</div>
                <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.7)', lineHeight: 1.4 }}>
                  {TUTORIAL_SLIDES[tutorialStep].tip}
                </div>
              </div>

              <div style={{ display: 'flex', gap: 16, justifyContent: 'center' }}>
                {tutorialStep > 0 && (
                  <button 
                    style={{ ...S.cfgClose, margin: 0, width: 'auto', padding: '10px 24px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff' }}
                    onClick={() => setTutorialStep(s => s - 1)}
                  >
                    ANTERIOR
                  </button>
                )}

                {tutorialStep < TUTORIAL_SLIDES.length - 1 ? (
                  <button 
                    style={{ ...S.cfgClose, margin: 0, width: 'auto', padding: '10px 48px', background: 'linear-gradient(135deg,#7c3aed,#4f46e5)', border: 'none', color: '#fff' }}
                    onClick={() => setTutorialStep(s => s + 1)}
                  >
                    PRÓXIMO
                  </button>
                ) : (
                  <button 
                    style={{ ...S.cfgClose, margin: 0, width: 'auto', padding: '10px 48px', background: 'linear-gradient(135deg,#34d399,#10b981)', border: 'none', color: '#fff', fontSize: 13 }}
                    onClick={() => {
                      setShowTutorial(false);
                      setTutorialSeen(true);
                      setTutorialStep(0);
                      // Inicia sequence de largada
                      playStart();
                      const rand = Math.floor(Math.random() * MSG_START.length);
                      setCurrentStartMsg(MSG_START[rand]);
                      setShowStartMsg(true);
                      setTimeout(() => setShowStartMsg(false), 2000);
                    }}
                  >
                    ENTENDI, VAMOS COMEÇAR!
                  </button>
                )}
              </div>
           </div>
        </div>
      )}

      {/* ── PROMPT DE MODO TELA CHEIA ──────────────────────────── */}
      {showFullscreenPrompt && (
        <div style={{...S.overlay, position: 'fixed', backdropFilter: 'blur(30px)', background: 'rgba(5,3,15,0.95)', zIndex: 3000 }}>
           <div style={{ 
             width: '90%', maxWidth: 440, padding: 32, background: 'rgba(15,10,40,0.6)', 
             border: '1px solid rgba(139,92,246,0.3)', borderRadius: 28, textAlign: 'center',
             boxShadow: '0 30px 100px rgba(0,0,0,0.8)', animation: 'scaleIn 0.3s ease'
           }}>
              <div style={{ fontSize: 48, marginBottom: 16 }}>📺</div>
              <div style={{ fontSize: 22, fontWeight: 900, color: '#fff', marginBottom: 12, letterSpacing: '-0.02em' }}>
                Modo Tela Cheia
              </div>
              <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.65)', lineHeight: 1.5, marginBottom: 28 }}>
                Deseja ativar a Tela Cheia? Isso expande a área de digitação e ajuda a focar nas lições sem distrações.
              </div>
              <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
                <button 
                  style={{ ...S.cfgClose, margin: 0, flex: 1, padding: '12px 20px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff' }}
                  onClick={() => {
                    setShowFullscreenPrompt(false);
                    sessionStorage.setItem('digit_ae_fullscreen_prompted', 'true');
                  }}
                >
                  AGORA NÃO
                </button>
                <button 
                  style={{ ...S.cfgClose, margin: 0, flex: 1, padding: '12px 20px', background: 'linear-gradient(135deg,#7c3aed,#4f46e5)', border: 'none', color: '#fff' }}
                  onClick={() => {
                    setShowFullscreenPrompt(false);
                    sessionStorage.setItem('digit_ae_fullscreen_prompted', 'true');
                    toggleFullscreen();
                  }}
                >
                  SIM, ATIVAR!
                </button>
              </div>
           </div>
        </div>
      )}

      {/* ── OVERLAY DE CÁLCULO ──────────────────────────── */}
      {isCalculating && (
        <div style={{...S.overlay, position: 'fixed', backdropFilter: 'blur(30px)', background: 'rgba(8,8,15,0.7)', zIndex: 1000 }}>
           <div style={{ textAlign: 'center' }}>
             <div className="calculation-pulse" style={{ fontSize: 64, marginBottom: 24 }}>✨</div>
             <div style={{ fontSize: 24, fontWeight: 900, color: '#fff', letterSpacing: '0.1em' }}>CALCULANDO DESEMPENHO...</div>
             <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.4)', marginTop: 8 }}>Analisando velocidade e precisão</div>
           </div>
        </div>
      )}

      {/* ── MODAL GLOBAL DE SUCESSO ──────────────────────────── */}
      {showFinalModal && (
        <div style={{...S.overlay, position: 'fixed', backdropFilter: 'blur(40px)', background: 'rgba(10,5,30,0.85)', zIndex: 1001 }}>
          <div style={{
            textAlign:'center', width:'90%', maxWidth: 640, padding: 48, 
            background: 'linear-gradient(135deg, rgba(30,20,80,0.6), rgba(15,10,40,0.8))', 
            border: '2px solid rgba(139,92,246,0.4)', borderRadius: 40, 
            boxShadow: '0 40px 100px rgba(0,0,0,0.8), inset 0 0 40px rgba(139,92,246,0.2)',
            position: 'relative', overflow: 'hidden'
          }}>
            {/* Efeito de brilho no topo do modal */}
            <div style={{ position: 'absolute', top: -100, left: '50%', transform: 'translateX(-50%)', width: 400, height: 200, background: 'radial-gradient(ellipse at center, rgba(139,92,246,0.3) 0%, transparent 70%)', filter: 'blur(40px)', pointerEvents: 'none' }} />

            {!isLost && (
               <div style={{ display: 'flex', gap: 10, justifyContent: 'center', marginBottom: 32 }}>
                 {Array.from({ length: 10 }).map((_, i) => (
                   <span key={i} className="star-burst" style={{ 
                     fontSize: 52, 
                     color: i < animatedStars ? '#fbbf24' : 'rgba(255,255,255,0.03)', 
                     filter: i < animatedStars ? 'drop-shadow(0 0 15px rgba(251,191,36,0.6))' : 'none',
                     opacity: i < animatedStars ? 1 : 0.3,
                     transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
                   }}>
                     ★
                   </span>
                 ))}
               </div>
            )}

            <div style={{fontSize:22, color: (isLost ? '#ef4444' : '#fbbf24'), fontWeight: 900, marginBottom: 20, letterSpacing: '0.1em' }}>
              {isLost ? 'MISSÃO FRACASSOU' : `${starsCalculated} ESTRELAS CONQUISTADAS`}
            </div>

            <div style={{fontSize:48, fontWeight:900, color: (isLost ? '#ef4444' : accuracy>=config.minAcerto?'#fff':'#f59e0b'), marginBottom: 12, lineHeight: 1 }}>
              {isLost ? 'FIM DE JOGO' : accuracy >= config.minAcerto ? 'LIÇÃO CONCLUÍDA!' : 'NÃO FOI DESTA VEZ'}
            </div>

            <div style={{fontSize:18, color:'rgba(255,255,255,0.6)', marginBottom: 40 }}>
              {accuracy >= config.minAcerto ? 'Excelente progresso! Você está evoluindo rápido.' : 'A precisão foi menor do que o necessário. Vamos tentar de novo?'}
            </div>

            <div style={{fontSize:18, color:'rgba(255,255,255,1)', lineHeight: 1.6, fontStyle: 'italic', background: 'rgba(255,255,255,0.03)', padding: '24px 32px', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.08)', marginBottom: 40}}>
              "{isLost ? 'O ritmo do texto superou sua velocidade. Mantenha o foco e acelere!' : endMessage}"
            </div>
            
            <div style={{ display: 'flex', gap: 16, justifyContent: 'center' }}>
              {(isLost || accuracy < config.minAcerto) && (
                <button style={{ ...S.cfgClose, margin: 0, width: 'auto', padding: '16px 40px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', fontSize: 14 }} onClick={() => resetSession(faseIdx, licaoIdx)}>
                  ↺ TENTAR NOVAMENTE
                </button>
              )}
              {accuracy >= config.minAcerto && (
                <button style={{...S.cfgClose, margin: 0, width:'auto', padding:'16px 48px', background: 'linear-gradient(135deg,#7c3aed,#4f46e5)', border: 'none', color: '#fff', boxShadow: '0 8px 30px rgba(124,58,237,0.4)', fontSize: 14 }} onClick={avancar}>
                  {licaoIdx < fase.licoes.length-1
                    ? 'PRÓXIMA LIÇÃO →'
                    : faseIdx < fases.length - 1
                    ? '🎉 AVANÇAR DE FASE'
                    : 'REINICIAR CURSO'}
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@700&family=Outfit:wght@400;600;700;900&display=swap');
        * { box-sizing: border-box; }
        body { margin:0; background:#08080f; height: 100vh; overflow: hidden; }
        #root { min-height:100vh; }
        @keyframes blink { from,to{opacity:1} 50%{opacity:0} }
        
        @keyframes starPop {
          0% { transform: scale(0) rotate(-30deg); opacity: 0; }
          60% { transform: scale(1.4) rotate(10deg); }
          100% { transform: scale(1) rotate(0); opacity: 1; }
        }
        .star-burst {
          animation: starPop 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
        }

        @keyframes calcPulse {
          0%, 100% { transform: scale(1); opacity: 0.8; }
          50% { transform: scale(1.2); opacity: 1; filter: drop-shadow(0 0 20px rgba(139,92,246,0.6)); }
        }
        .calculation-pulse {
          animation: calcPulse 1s ease-in-out infinite;
          display: inline-block;
        }

        @keyframes activePulse {
          0% { box-shadow: 0 0 0 0 rgba(167, 139, 250, 0.7), 0 0 10px rgba(139,92,246,0.6); transform: scale(1); }
          50% { box-shadow: 0 0 0 10px rgba(167, 139, 250, 0), 0 0 25px rgba(139,92,246,1); transform: scale(1.15); }
          100% { box-shadow: 0 0 0 0 rgba(167, 139, 250, 0), 0 0 10px rgba(139,92,246,0.6); transform: scale(1); }
        }
        .active-lesson-pulse {
          animation: activePulse 1.8s cubic-bezier(0.25, 1, 0.5, 1) infinite;
          background: linear-gradient(135deg, #a78bfa, #7c3aed) !important;
          border: 2px solid #fff !important;
          color: #fff !important;
          z-index: 10;
        }

        @keyframes scaleIn {
          from { transform: scale(0.8); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }

        input[type=range]{-webkit-appearance:none;width:100%;height:4px;border-radius:2px;background:rgba(255,255,255,0.1);outline:none;}
        input[type=range]::-webkit-slider-thumb{-webkit-appearance:none;width:16px;height:16px;border-radius:50%;background:#a78bfa;cursor:pointer;}
      `}</style>
    </div>
  );
};

// ─── ESTILOS ─────────────────────────────────────────────────────────────────
const S = {
  page: {
    minHeight:'100vh',
    background:'radial-gradient(ellipse at top,#120d2e 0%,#08080f 65%)',
    display:'flex', flexDirection:'column' as const,
    alignItems:'center', gap:14,
    padding:'20px 16px 32px',
    fontFamily:"'Outfit','Inter',system-ui,sans-serif",
    userSelect:'none' as const,
    overflowX:'hidden' as const,
  },
  topBar: {
    width:'100%', maxWidth: 1400,
    display:'flex', flexDirection:'row' as const,
    alignItems:'center', justifyContent:'space-between', gap:12,
  },
  logo: {
    fontSize:30, fontWeight:900, lineHeight:1,
    background:'linear-gradient(135deg,#a78bfa,#60a5fa,#34d399)',
    WebkitBackgroundClip:'text' as const, WebkitTextFillColor:'transparent' as const,
    letterSpacing:'-0.03em',
  },
  logoSub: {
    fontSize:9, color:'rgba(255,255,255,0.2)',
    letterSpacing:'0.2em', textTransform:'uppercase' as const, marginTop:2,
  },
  modeToggle: {
    padding:'8px 16px', borderRadius:12,
    background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.07)',
  },
  iconBtn: {
    background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.08)',
    borderRadius:10, padding:'7px 12px', cursor:'pointer', fontSize:16,
    display: 'flex', alignItems: 'center', justifyContent: 'center'
  },
  configPanel: {
    width:'100%', maxWidth: 1400,
    background:'rgba(15,10,40,0.97)', border:'1px solid rgba(139,92,246,0.3)',
    borderRadius:18, padding:'22px 26px', boxShadow:'0 8px 40px rgba(0,0,0,0.5)',
  },
  cfgTitle: { fontSize:15, fontWeight:900, color:'#fff', marginBottom:16 },
  cfgLabel: {
    display:'flex' as const, justifyContent:'space-between', alignItems:'center',
    fontSize:12, color:'rgba(255,255,255,0.55)', marginBottom:8,
  },
  sliderRow: {
    display:'flex', flexDirection:'row' as const, alignItems:'center', gap:10,
  },
  hint: { fontSize:10, color:'rgba(255,255,255,0.3)', minWidth:26 },
  slider: { flex:1 },
  speedTags: {
    display:'flex', flexDirection:'row' as const, gap:6, marginTop:12, flexWrap:'wrap' as const,
  },
  tag: (active: boolean): React.CSSProperties => ({
    padding:'7px 12px', borderRadius:8, cursor:'pointer', border:'none',
    background: active ? 'rgba(139,92,246,0.25)' : 'rgba(255,255,255,0.05)',
    color: active ? '#c4b5fd' : 'rgba(255,255,255,0.4)',
    fontWeight:700, fontSize:10, textAlign:'center',
    fontFamily:"'Outfit',sans-serif",
    outline: active ? '1px solid rgba(139,92,246,0.5)' : 'none',
    transition:'all 0.15s',
  }),
  cfgClose: {
    display:'block', width:'100%', padding:'9px 0', borderRadius:10,
    background:'rgba(139,92,246,0.15)', border:'1px solid rgba(139,92,246,0.3)',
    color:'#a78bfa', cursor:'pointer', fontSize:12, fontWeight:700,
    fontFamily:"'Outfit',sans-serif", marginTop:16, transition:'all 0.15s',
  },
  licaoBar: {
    width:'100%', maxWidth: 1400,
    display:'flex', flexDirection:'row' as const,
    alignItems:'flex-start', gap:0,
  },
  licaoDot: (_a: boolean, _d: boolean): React.CSSProperties => ({
    display:'flex', flexDirection:'column', alignItems:'center', flex:1, cursor:'default',
  }),
  licaoDotCircle: (active: boolean, done: boolean): React.CSSProperties => ({
    width:26, height:26, borderRadius:'50%',
    display:'flex', alignItems:'center', justifyContent:'center',
    fontSize:10, fontWeight:900,
    background: done ? '#7c3aed' : active ? 'linear-gradient(135deg,#7c3aed,#4f46e5)' : 'rgba(255,255,255,0.07)',
    border: active ? '2px solid #a78bfa' : '2px solid rgba(255,255,255,0.1)',
    color: done || active ? '#fff' : 'rgba(255,255,255,0.25)',
    boxShadow: active ? '0 0 10px rgba(139,92,246,0.45)' : 'none',
  }),
  licaoHeader: {
    width:'100%', maxWidth: 1400, textAlign:'center' as const,
  },
  licaoTitulo: {
    fontSize:20, fontWeight:900, color:'#fff',letterSpacing:'-0.02em',
  },
  licaoSub: {
    fontSize:12, color:'rgba(255,255,255,0.4)', marginTop:2,
  },
  statsRow: {
    width:'100%', maxWidth: 1400,
    display:'flex', flexDirection:'row' as const,
    alignItems:'center', gap:8, flexWrap:'wrap' as const,
  },
  statCard: {
    display:'flex', flexDirection:'column' as const, alignItems:'center', gap:1,
    padding:'8px 16px', borderRadius:12,
    background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.07)',
    minWidth:68,
  },
  progressWrap: {
    flex:1, display:'flex', flexDirection:'column' as const, minWidth:120,
  },
  progressBar: {
    width:'100%', height:4, borderRadius:999, background:'rgba(255,255,255,0.06)', overflow:'hidden',
  },
  progressFill: {
    height:'100%', borderRadius:999,
    background:'linear-gradient(to right,#7c3aed,#3b82f6,#06b6d4)',
    transition:'width 0.2s',
  },
  resetBtn: {
    padding:'8px 16px', borderRadius:10, border:'1px solid rgba(255,255,255,0.1)',
    background:'rgba(255,255,255,0.04)', color:'rgba(255,255,255,0.5)',
    cursor:'pointer', fontSize:12, fontWeight:700,
    fontFamily:"'Outfit',sans-serif", transition:'all 0.15s',
  },
  grade: {
    position:'relative' as const,
    width:'100%', maxWidth: 1400,
    borderRadius:18, padding:'20px 28px',
    background:'rgba(255,255,255,0.025)',
    border:'1px solid rgba(255,255,255,0.07)',
    display:'flex', flexDirection:'column' as const, gap:6,
    cursor:'text',
    boxShadow:'inset 0 1px 0 rgba(255,255,255,0.04)',
    overflow:'hidden',
  },
  gradeRow: (active: boolean, done: boolean): React.CSSProperties => ({
    display:'flex', flexDirection:'row', alignItems:'center', gap:8,
    padding:'4px 0',
    borderLeft: active ? '3px solid #a78bfa' : '3px solid transparent',
    paddingLeft: 8,
    opacity: done ? 0.4 : 1,
    transition:'opacity 0.3s',
  }),
  gradeLineNum: (active: boolean, _done: boolean): React.CSSProperties => ({
    fontSize:10, fontWeight:700, color: active ? '#a78bfa' : 'rgba(255,255,255,0.2)',
    width:14, textAlign:'right', flexShrink:0,
  }),
  overlay: {
    position:'absolute' as const, inset:0, zIndex:10,
    display:'flex', alignItems:'center', justifyContent:'center', gap:10,
    background:'rgba(8,8,15,0.9)', backdropFilter:'blur(8px)', borderRadius:18,
  },
  keyboard: {
    width:'100%', maxWidth: 1400, borderRadius:18,
    background:'rgba(255,255,255,0.02)',
    border:'1px solid rgba(255,255,255,0.07)',
    padding:'14px 10px 12px',
    display:'flex', flexDirection:'column' as const, gap:4,
    boxShadow:'inset 0 -2px 0 rgba(0,0,0,0.3)',
  },
};

export default TypingEngine;
