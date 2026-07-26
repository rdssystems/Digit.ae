import { create } from 'zustand';
import PocketBase from 'pocketbase';
import { hashPassword } from '../utils/crypto';

import { APP_CONFIG } from '../config';
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

export interface Profile {
  id: string;
  name: string;
  password?: string;
  config: UserConfig;
  progress: UserProgress;
  createdAt: number;
}

interface UserStore {
  currentUser: any | null;
  selectedProfile: Profile | null;
  profiles: Profile[];
  isValid: boolean;

  login: (email: string, pass: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  register: (email: string, pass: string, name: string) => Promise<void>;
  logout: () => void;

  selectProfile: (id: string | null) => void;
  createProfile: (name: string, velocidade: number, minAcerto: number, password?: string) => Promise<void>;
  verifyProfilePassword: (profileId: string, password: string) => Promise<boolean>;
  loadProfiles: () => Promise<void>;

  updateProgress: (faseIdx: number, licaoIdx: number, maxUnlocked: number, wpm: number, accuracy: number, lessonKey: string, stars?: number) => Promise<void>;
  updateConfig: (newConfig: Partial<UserConfig>) => Promise<void>;
  editProfile: (profileId: string, name: string, config: Partial<UserConfig>, password?: string) => Promise<void>;
  deleteProfile: (profileId: string) => Promise<void>;
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

function backupProfiles(email: string, profiles: Profile[]) {
  try {
    localStorage.setItem(`digit_ae_backup_${email}`, JSON.stringify(profiles));
  } catch {}
}

function safeParse(val: any, fallback: any) {
  if (!val) return fallback;
  if (typeof val === 'object') return val;
  try { return JSON.parse(val); } catch { return fallback; }
}

export const useUserStore = create<UserStore>((set, get) => ({
  currentUser: pb.authStore.model,
  selectedProfile: null,
  profiles: [],
  isValid: pb.authStore.isValid,

  refreshAuth: () => {
    const model = pb.authStore.model;
    const currentSelected = get().selectedProfile;

    if (!model) {
      set({ currentUser: null, selectedProfile: null, profiles: [], isValid: false });
      return;
    }

    set({ currentUser: model, isValid: pb.authStore.isValid });

    if (currentSelected) {
      const updated = get().profiles.find(p => p.id === currentSelected.id) || currentSelected;
      set({ selectedProfile: updated });
    }
  },

  loadProfiles: async () => {
    const user = get().currentUser;
    if (!user) { set({ profiles: [] }); return; }

    try {
      const records = await pb.collection('profiles').getFullList({
        filter: `user = "${user.id}"`,
        sort: '-created',
      });

      if (records.length > 0) {
        const profiles: Profile[] = records.map((r: any) => ({
          id: r.id,
          name: r.name,
          password: r.password || undefined,
          config: safeParse(r.config, DEFAULT_CONFIG),
          progress: safeParse(r.progress, DEFAULT_PROGRESS),
          createdAt: r.created,
        }));
        set({ profiles });
        backupProfiles(user.email, profiles);
        return;
      }
    } catch {}

    // Fallback: migrar do campo JSON legado (users.profiles) se existir
    if (user.profiles) {
      const rawProfiles = typeof user.profiles === 'string' ? JSON.parse(user.profiles) : user.profiles;
      if (Array.isArray(rawProfiles) && rawProfiles.length > 0) {
        try {
          const migrated: Profile[] = [];
          for (const p of rawProfiles) {
            const record = await pb.collection('profiles').create({
              user: user.id,
              name: p.name || 'Aluno',
              password: p.password || '',
              config: p.config || DEFAULT_CONFIG,
              progress: p.progress || DEFAULT_PROGRESS,
            });
            migrated.push({
              id: record.id,
              name: record.name,
              password: record.password || undefined,
              config: safeParse(record.config, DEFAULT_CONFIG),
              progress: safeParse(record.progress, DEFAULT_PROGRESS),
              createdAt: record.created,
            });
          }
          await pb.collection('users').update(user.id, { profiles: [] });
          pb.authStore.save(pb.authStore.token, pb.authStore.model);
          set({ profiles: migrated });
          backupProfiles(user.email, migrated);
          return;
        } catch (err) {
          console.error("Erro ao migrar perfis legados:", err);
        }
      }
    }

    // Fallback: localStorage
    if (user.email) {
      const backup = localStorage.getItem(`digit_ae_backup_${user.email}`);
      if (backup) {
        try {
          const saved: Profile[] = JSON.parse(backup);
          set({ profiles: saved.map((p: any) => ({
            ...p,
            config: { ...DEFAULT_CONFIG, ...safeParse(p.config, {}) },
            progress: { ...DEFAULT_PROGRESS, ...safeParse(p.progress, {}) },
          })) });
          return;
        } catch {}
      }
    }

    set({ profiles: [] });
  },

  login: async (email, pass) => {
    try {
      await pb.collection('users').authWithPassword(email, pass);
      get().refreshAuth();
      await get().loadProfiles();
    } catch (err: any) {
      throw new Error(`Erro ao conectar no servidor: ${err.message || 'Verifique se o PocketBase está rodando em ' + APP_CONFIG.PB_URL}`);
    }
  },

  loginWithGoogle: async () => {
    await pb.collection('users').authWithOAuth2({ provider: 'google' });
    get().refreshAuth();
    await get().loadProfiles();
  },

  register: async (email, pass, name) => {
    try {
      await pb.collection('users').create({
        email,
        password: pass,
        passwordConfirm: pass,
        name,
      });
      await get().login(email, pass);
      await get().createProfile(name, DEFAULT_CONFIG.velocidade, DEFAULT_CONFIG.minAcerto);
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
    if (!id) { set({ selectedProfile: null }); return; }
    const profile = get().profiles.find(p => p.id === id);
    if (profile) set({ selectedProfile: profile });
  },

  verifyProfilePassword: async (profileId, password) => {
    try {
      const record = await pb.collection('profiles').getOne(profileId);
      if (!record.password) return true;
      const hashed = await hashPassword(password);
      return record.password === hashed;
    } catch {
      return false;
    }
  },

  createProfile: async (name, velocidade, minAcerto, password) => {
    const user = get().currentUser;
    if (!user) return;

    try {
      const data: Record<string, any> = {
        user: user.id,
        name,
        config: { ...DEFAULT_CONFIG, velocidade, minAcerto },
        progress: DEFAULT_PROGRESS,
      };
      if (password) {
        data.password = await hashPassword(password);
      }

      const record = await pb.collection('profiles').create(data);

      const newProfile: Profile = {
        id: record.id,
        name: record.name,
        password: record.password || undefined,
        config: safeParse(record.config, DEFAULT_CONFIG),
        progress: safeParse(record.progress, DEFAULT_PROGRESS),
        createdAt: record.created,
      };

      const updatedProfiles = [...get().profiles, newProfile];
      backupProfiles(user.email, updatedProfiles);
      set({ profiles: updatedProfiles, selectedProfile: newProfile });
    } catch (err: any) {
      console.error("Erro ao criar perfil:", err);
      const msg = err.response?.data?.message || err.message || "Erro desconhecido";
      alert(`Erro no servidor (${msg}).`);
    }
  },

  updateProgress: async (faseIdx, licaoIdx, maxUnlocked, wpm, accuracy, lessonKey, stars) => {
    const user = get().currentUser;
    const profile = get().selectedProfile;
    if (!user || !profile) return;

    const currentProgress = profile.progress || DEFAULT_PROGRESS;
    const currentStarsMap = currentProgress.starsByLesson || {};

    const newStarsMap = { ...currentStarsMap };
    if (lessonKey && stars !== undefined) {
      newStarsMap[lessonKey] = Math.max(currentStarsMap[lessonKey] || 0, stars);
    }

    const updatedProgress: UserProgress = {
      ...currentProgress,
      faseIdx, licaoIdx, maxUnlocked,
      wpm: Math.max(currentProgress.wpm || 0, wpm),
      accuracy: Math.max(currentProgress.accuracy || 0, accuracy),
      totalLessonsCompleted: (currentProgress.totalLessonsCompleted || 0) + 1,
      starsByLesson: newStarsMap,
    };

    try {
      await pb.collection('profiles').update(profile.id, { progress: updatedProgress });

      const updatedProfile: Profile = { ...profile, progress: updatedProgress };
      const updatedProfiles = get().profiles.map(p => p.id === profile.id ? updatedProfile : p);
      backupProfiles(user.email, updatedProfiles);
      set({ selectedProfile: updatedProfile, profiles: updatedProfiles });
    } catch (err) {
      console.error("Erro no auto-save:", err);
    }
  },

  updateConfig: async (newConfig) => {
    const user = get().currentUser;
    const profile = get().selectedProfile;
    if (!user || !profile) return;

    const updatedConfig: UserConfig = { ...profile.config, ...newConfig };

    try {
      await pb.collection('profiles').update(profile.id, { config: updatedConfig });

      const updatedProfile: Profile = { ...profile, config: updatedConfig };
      const updatedProfiles = get().profiles.map(p => p.id === profile.id ? updatedProfile : p);
      backupProfiles(user.email, updatedProfiles);
      set({ selectedProfile: updatedProfile, profiles: updatedProfiles });
    } catch (err) {
      console.error("Erro ao salvar config:", err);
    }
  },

  editProfile: async (profileId, name, config, password) => {
    const user = get().currentUser;
    if (!user) return;

    try {
      const data: Record<string, any> = {
        name,
        config: { ...DEFAULT_CONFIG, ...config },
      };
      if (password !== undefined) {
        data.password = password ? await hashPassword(password) : "";
      }

      await pb.collection('profiles').update(profileId, data);

      const updatedProfiles = get().profiles.map(p => {
        if (p.id === profileId) {
          return {
            ...p,
            name,
            password: password || undefined,
            config: { ...p.config, ...config },
          };
        }
        return p;
      });

      backupProfiles(user.email, updatedProfiles);
      set({ profiles: updatedProfiles });

      if (get().selectedProfile?.id === profileId) {
        const updatedSelected = updatedProfiles.find(p => p.id === profileId) || null;
        set({ selectedProfile: updatedSelected });
      }
    } catch (err: any) {
      console.error("Erro ao editar perfil:", err);
      alert("Erro ao salvar alterações do perfil.");
    }
  },

  deleteProfile: async (profileId) => {
    const user = get().currentUser;
    if (!user) return;

    try {
      await pb.collection('profiles').delete(profileId);

      const updatedProfiles = get().profiles.filter(p => p.id !== profileId);
      backupProfiles(user.email, updatedProfiles);
      set({ profiles: updatedProfiles });

      if (get().selectedProfile?.id === profileId) {
        set({ selectedProfile: null });
      }
    } catch (err: any) {
      console.error("Erro ao excluir perfil:", err);
      alert("Erro ao excluir perfil no servidor.");
    }
  },
}));

pb.authStore.onChange(() => {
  useUserStore.getState().refreshAuth();
});
