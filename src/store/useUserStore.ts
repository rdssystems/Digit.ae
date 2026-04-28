import { create } from 'zustand';
import PocketBase from 'pocketbase';

import { APP_CONFIG } from '../config';
// Instância única do Pocketbase (apontando para o IP local para acesso em rede)
export const pb = new PocketBase(APP_CONFIG.PB_URL);

export interface UserProgress {
  faseIdx: number;
  licaoIdx: number;
  maxUnlocked: number;
  wpm: number;
  accuracy: number;
  totalLessonsCompleted: number;
  starsByLesson: Record<string, number>;
}

export interface UserConfig {
  velocidade: number;
  minAcerto: number;
  soundEnabled: boolean;
}

// O tipo do usuário agora vem do modelo do Pocketbase
export interface Profile {
  id: string;
  name: string;
  password?: string; // Senha opcional do perfil (aluno)
  config: UserConfig;
  progress: UserProgress;
  createdAt: number;
}

interface UserStore {
  currentUser: any | null; // A conta logada no PocketBase
  selectedProfile: Profile | null; // O aluno selecionado no momento
  isValid: boolean;
  
  // Ações
  login: (email: string, pass: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  register: (email: string, pass: string, name: string) => Promise<void>;
  logout: () => void;
  
  // Ações de Perfil
  selectProfile: (id: string | null) => void;
  createProfile: (name: string, velocidade: number, minAcerto: number, password?: string) => Promise<void>;
  verifyProfilePassword: (profileId: string, password: string) => boolean;
  
  updateProgress: (faseIdx: number, licaoIdx: number, maxUnlocked: number, wpm: number, accuracy: number, lessonKey: string, stars?: number) => Promise<void>;
  updateConfig: (newConfig: Partial<UserConfig>) => Promise<void>;
  refreshAuth: () => void;
}

const DEFAULT_CONFIG: UserConfig = { velocidade: 130, minAcerto: 80, soundEnabled: true };
const DEFAULT_PROGRESS: UserProgress = {
  faseIdx: 0,
  licaoIdx: 0,
  maxUnlocked: 0,
  wpm: 0,
  accuracy: 0,
  totalLessonsCompleted: 0,
  starsByLesson: {},
};

export const useUserStore = create<UserStore>((set, get) => ({
  currentUser: pb.authStore.model,
  selectedProfile: null,
  isValid: pb.authStore.isValid,

  refreshAuth: () => {
    const model = pb.authStore.model;
    const currentSelected = get().selectedProfile;
    
    // Se perdemos a conta, limpamos o perfil
    if (!model) {
      set({ currentUser: null, selectedProfile: null, isValid: false });
      return;
    }

    // Tenta manter o perfil selecionado atualizado com os dados vindos do banco
    let updatedProfile = currentSelected;
    
    // Recuperação Híbrida: Tentar Banco, se vazio tentar LocalStorage
    const rawProfiles = model.profiles || [];
    let profiles = typeof rawProfiles === 'string' ? JSON.parse(rawProfiles) : rawProfiles;
    
    // Se o banco estiver vazio, tenta o backup local do navegador
    if ((!profiles || profiles.length === 0) && model.email) {
      const backup = localStorage.getItem(`digit_ae_backup_${model.email}`);
      if (backup) {
        try { profiles = JSON.parse(backup); } catch {}
      }
    }

    if (currentSelected && profiles) {
      updatedProfile = profiles.find((p: Profile) => p.id === currentSelected.id) || null;
      
      // Fallback de segurança para não perder o objeto local do estado atual
      if (!updatedProfile && currentSelected) {
          updatedProfile = currentSelected;
      }
    }

    set({ currentUser: model, selectedProfile: updatedProfile, isValid: pb.authStore.isValid });
  },

  login: async (email, pass) => {
    try {
      console.log("Tentando login em:", APP_CONFIG.PB_URL);
      await pb.collection('users').authWithPassword(email, pass);
      get().refreshAuth();
    } catch (err: any) {
      console.error("Erro de conexão com PocketBase:", err);
      throw new Error(`Erro ao conectar no servidor: ${err.message || 'Verifique se o PocketBase está rodando em ' + APP_CONFIG.PB_URL}`);
    }
  },

  loginWithGoogle: async () => {
    await pb.collection('users').authWithOAuth2({ provider: 'google' });
    get().refreshAuth();
  },

  register: async (email, pass, name) => {
    try {
      const firstProfile: Profile = {
        id: Math.random().toString(36).substring(2, 11),
        name,
        config: DEFAULT_CONFIG,
        progress: DEFAULT_PROGRESS,
        createdAt: Date.now()
      };

      const data = {
        email,
        password: pass,
        passwordConfirm: pass,
        name,
        profiles: [firstProfile]
      };
      await pb.collection('users').create(data);
      await get().login(email, pass);
      
      // Backup local imediato
      localStorage.setItem(`digit_ae_backup_${email}`, JSON.stringify([firstProfile]));
      
      set({ selectedProfile: firstProfile });
    } catch (err: any) {
      alert("Erro ao registrar: " + (err.message || JSON.stringify(err)));
      throw err;
    }
  },

  logout: () => {
    pb.authStore.clear();
    get().refreshAuth();
  },

  selectProfile: (id) => {
    if (!id) {
      set({ selectedProfile: null });
      return;
    }
    const user = get().currentUser;
    if (!user) return;
    
    const rawProfiles = user.profiles || [];
    let profiles = typeof rawProfiles === 'string' ? JSON.parse(rawProfiles) : rawProfiles;
    
    if ((!profiles || profiles.length === 0) && user.email) {
       const backup = localStorage.getItem(`digit_ae_backup_${user.email}`);
       if (backup) profiles = JSON.parse(backup);
    }
    
    const profile = profiles.find((p: Profile) => p.id === id);
    if (profile) set({ selectedProfile: profile });
  },

  verifyProfilePassword: (profileId, password) => {
    const user = get().currentUser;
    if (!user) return false;
    const rawProfiles = user.profiles || [];
    const profiles = typeof rawProfiles === 'string' ? JSON.parse(rawProfiles) : rawProfiles;
    const profile = profiles.find((p: Profile) => p.id === profileId);
    
    if (!profile) return false;
    if (!profile.password) return true; // Se não tem senha, entra direto
    return profile.password === password;
  },

  createProfile: async (name, velocidade, minAcerto, password) => {
    try {
      const user = get().currentUser;
      if (!user) return;

      const newProfile: Profile = {
        id: Math.random().toString(36).substring(2, 11), // Gerador de ID simples compatível com HTTP
        name,
        password: password || undefined,
        config: { ...DEFAULT_CONFIG, velocidade, minAcerto },
        progress: DEFAULT_PROGRESS,
        createdAt: Date.now()
      };

      const rawProfiles = user.profiles || [];
      const currentProfiles = (typeof rawProfiles === 'string' ? (rawProfiles ? JSON.parse(rawProfiles) : []) : rawProfiles) || [];
      const updatedProfiles = [...currentProfiles, newProfile];

      // Backup Local (Antes de tentar o banco)
      if (user.email) {
        localStorage.setItem(`digit_ae_backup_${user.email}`, JSON.stringify(updatedProfiles));
      }

      const record = await pb.collection('users').update(user.id, {
        profiles: updatedProfiles
      });

      pb.authStore.save(pb.authStore.token, record);
      set({ currentUser: record, selectedProfile: newProfile });
    } catch (err: any) {
      console.error("Erro detalhado ao criar perfil:", err);
      const msg = err.response?.data?.message || err.message || "Erro desconhecido";
      alert(`Erro no servidor (${msg}). O perfil foi salvo apenas localmente neste navegador.`);
    }
  },

  updateProgress: async (faseIdx, licaoIdx, maxUnlocked, wpm, accuracy, lessonKey, stars) => {
    try {
      const user = get().currentUser;
      const profile = get().selectedProfile;
      if (!user || !profile) return;

      const currentProgress = profile.progress;
      const currentStarsMap = currentProgress.starsByLesson || {};
      
      const newStarsMap = { ...currentStarsMap };
      if (lessonKey && stars !== undefined) {
        newStarsMap[lessonKey] = Math.max(currentStarsMap[lessonKey] || 0, stars);
      }

      const updatedProfile: Profile = {
        ...profile,
        progress: {
          ...currentProgress, faseIdx, licaoIdx, maxUnlocked,
          wpm: Math.max(currentProgress.wpm, wpm),
          accuracy: Math.max(currentProgress.accuracy, accuracy),
          totalLessonsCompleted: (currentProgress.totalLessonsCompleted || 0) + 1,
          starsByLesson: newStarsMap,
        }
      };

      const rawProfiles = user.profiles || [];
      const profiles = (typeof rawProfiles === 'string' ? JSON.parse(rawProfiles) : rawProfiles) || [];
      const updatedProfiles = profiles.map((p: Profile) => p.id === profile.id ? updatedProfile : p);

      // Backup Local
      if (user.email) {
        localStorage.setItem(`digit_ae_backup_${user.email}`, JSON.stringify(updatedProfiles));
      }

      const record = await pb.collection('users').update(user.id, {
        profiles: updatedProfiles
      });

      pb.authStore.save(pb.authStore.token, record);
      set({ currentUser: record, selectedProfile: updatedProfile });
    } catch (err: any) {
      console.error("Erro no auto-save:", err);
    }
  },

  updateConfig: async (newConfig) => {
    try {
      const user = get().currentUser;
      const profile = get().selectedProfile;
      if (!user || !profile) return;

      const updatedProfile: Profile = { ...profile, config: { ...profile.config, ...newConfig } };
      const rawProfiles = user.profiles || [];
      const profiles = typeof rawProfiles === 'string' ? JSON.parse(rawProfiles) : rawProfiles;
      const updatedProfiles = profiles.map((p: Profile) => p.id === profile.id ? updatedProfile : p);

      if (user.email) {
        localStorage.setItem(`digit_ae_backup_${user.email}`, JSON.stringify(updatedProfiles));
      }

      const record = await pb.collection('users').update(user.id, { profiles: updatedProfiles });
      pb.authStore.save(pb.authStore.token, record);
      set({ currentUser: record, selectedProfile: updatedProfile });
    } catch (err: any) {
      console.error("Erro ao salvar config:", err);
    }
  },
}));

pb.authStore.onChange(() => {
    useUserStore.getState().refreshAuth();
});

