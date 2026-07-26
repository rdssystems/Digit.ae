import React, { useState, useEffect } from 'react';
import { useUserStore, pb, type Profile } from '../store/useUserStore';
import { Mail, Lock, User as UserCircle, Plus, ChevronLeft, ShieldCheck } from 'lucide-react';
import { APP_CONFIG } from '../config';

const S = {
  page: {
    minHeight:'100vh', background:'#08080f', color:'#fff',
    fontFamily:"'Outfit',sans-serif", display:'flex', flexDirection:'column' as const,
    alignItems:'center', justifyContent: 'center', padding:'40px 20px', overflowX:'hidden' as const
  },
  logo: {
    fontSize:64, fontWeight:900, lineHeight:1,
    background:'linear-gradient(135deg,#a78bfa,#60a5fa,#34d399)',
    WebkitBackgroundClip:'text' as const, WebkitTextFillColor:'transparent' as const,
    letterSpacing:'-0.03em',
  },
  logoSub: {
    fontSize:14, color:'rgba(255,255,255,0.2)',
    letterSpacing:'0.3em', textTransform:'uppercase' as const, marginTop:4, marginBottom: 40
  },
  mainCard: {
    width:'100%', maxWidth:500, display:'flex', flexDirection: 'column' as const, gap:24,
    background:'rgba(15,10,40,0.4)', backdropFilter:'blur(24px)',
    border:'1px solid rgba(139,92,246,0.15)', borderRadius:32, padding:40,
    boxShadow:'0 20px 50px rgba(0,0,0,0.5), inset 0 0 0 1px rgba(255,255,255,0.05)'
  },
  title: {
    fontSize:28, fontWeight:900, color:'#fff', textAlign: 'center' as const, marginBottom: 8
  },
  subTitle: {
    fontSize:14, color: 'rgba(255,255,255,0.5)', textAlign: 'center' as const, marginBottom: 16
  },
  profileGrid: {
    display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: 24, marginTop: 24
  },
  profileCard: {
    display: 'flex', flexDirection: 'column' as const, alignItems: 'center', gap: 12, cursor: 'pointer', transition: 'all 0.2s'
  },
  avatar: {
    width: 100, height: 100, borderRadius: 24, background: 'rgba(255,255,255,0.05)',
    display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(255,255,255,0.1)',
    transition: 'all 0.3s', overflow: 'hidden'
  },
  inputGroup: {
    display: 'flex', flexDirection: 'column' as const, gap: 8
  },
  label: {
    fontSize: 12, fontWeight: 700, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase' as const, letterSpacing: '0.05em'
  },
  input: {
    width:'100%', background:'rgba(0,0,0,0.3)', border:'1px solid rgba(255,255,255,0.1)',
    borderRadius:12, padding:'14px 16px 14px 44px', color:'#fff', outline:'none', fontSize:14,
    fontFamily:"'Outfit',sans-serif", boxSizing: 'border-box' as const
  },
  inputIcon: {
    position: 'absolute' as const, left: 16, color: 'rgba(255,255,255,0.2)'
  },
  btn: {
    padding:'14px 24px', borderRadius:12, fontWeight:800, fontSize:14,
    border:'none', background:'linear-gradient(135deg,#7c3aed,#4f46e5)',
    color:'#fff', cursor:'pointer', display:'flex', alignItems:'center', gap:10,
    justifyContent:'center', transition:'all 0.2s', textTransform:'uppercase' as const, 
    letterSpacing:'0.05em', boxShadow:'0 4px 15px rgba(124,58,237,0.3)'
  },
  secondaryBtn: {
    background: 'transparent', border: '1px solid rgba(255,255,255,0.1)',
    boxShadow: 'none', color: 'rgba(255,255,255,0.6)', marginTop: 8
  },
  error: {
    background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)',
    color: '#f87171', padding: '12px', borderRadius: 12, fontSize: 13, textAlign: 'center' as const
  }
};

const ProfileSelection: React.FC = () => {
  const { currentUser, login, createProfile, selectProfile, profiles } = useUserStore();
  const [view, setView] = useState<'list' | 'login' | 'register'>('list');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [profilePassword, setProfilePassword] = useState(''); // Senha para o novo perfil
  const [verifyPassword, setVerifyPassword] = useState('');  // Senha digitada ao entrar no perfil
  const [targetProfile, setTargetProfile] = useState<any>(null); // Perfil sendo acessado
  const [name, setName] = useState('');
  const [velocidade, setVelocidade] = useState(130);
  const [minAcerto, setMinAcerto] = useState(80);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPasswordPrompt, setShowPasswordPrompt] = useState(false);

  // Se o usuário já estiver logado na conta PB, mostra a lista, senão mostra login
  useEffect(() => {
    if (currentUser) setView('list');
    else {
      // No modo offline, tenta auto-login
      if (APP_CONFIG.IS_OFFLINE) {
        handleAutoLogin();
      } else {
        setView('login');
      }
    }
  }, [currentUser]);

  const handleAutoLogin = async () => {
    try {
      setLoading(true);
      await login(APP_CONFIG.DEFAULT_LOCAL_USER, APP_CONFIG.DEFAULT_LOCAL_PASS);
    } catch (err) {
      // Se a conta local não existir, tenta criar
      try {
        await pb.collection('users').create({
          email: APP_CONFIG.DEFAULT_LOCAL_USER,
          password: APP_CONFIG.DEFAULT_LOCAL_PASS,
          passwordConfirm: APP_CONFIG.DEFAULT_LOCAL_PASS,
          name: 'Usuário Local'
        });
        await login(APP_CONFIG.DEFAULT_LOCAL_USER, APP_CONFIG.DEFAULT_LOCAL_PASS);
        if (profiles.length === 0) {
          await createProfile('Usuário Local', 130, 80);
        }
      } catch (e) {
        setError('Erro ao iniciar banco de dados local.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleAccountLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
    } catch (err: any) {
      setError(err.message || 'Falha no login da conta principal');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return setError('Nome é obrigatório');
    setLoading(true);
    try {
      await createProfile(name, velocidade, minAcerto, profilePassword);
      setName('');
      setProfilePassword('');
      setView('list');
    } catch (err: any) {
      setError('Erro ao criar perfil');
    } finally {
      setLoading(false);
    }
  };

  const handleProfileClick = (p: Profile) => {
    if (p.password) {
      setTargetProfile(p);
      setShowPasswordPrompt(true);
      setVerifyPassword('');
      setError('');
    } else {
      selectProfile(p.id);
    }
  };

  const handleVerifyPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const isCorrect = await useUserStore.getState().verifyProfilePassword(targetProfile.id, verifyPassword);
    setLoading(false);
    if (isCorrect) {
      selectProfile(targetProfile.id);
    } else {
      setError('Senha incorreta!');
    }
  };

  return (
    <div style={S.page}>
      <div style={{ textAlign: 'center' }}>
        <div style={S.logo}>Digit.ae</div>
        <div style={S.logoSub}>Tão simples quanto falar</div>
      </div>

      <div style={S.mainCard}>
        {view === 'list' && currentUser ? (
          <>
            <div>
              <div style={S.title}>Quem está digitando?</div>
              <div style={S.subTitle}>Sua conta: {currentUser.email}</div>
            </div>

            <div style={S.profileGrid}>
              {profiles.map((p: Profile) => (
                <div key={p.id} style={S.profileCard} onClick={() => handleProfileClick(p)}>
                  <div style={S.avatar} className="profile-hero">
                    {p.password ? <Lock size={40} color="rgba(167,139,250,0.4)" /> : <UserCircle size={48} color="rgba(255,255,255,0.3)" />}
                  </div>
                  <div style={{ fontWeight: 700, fontSize: 14 }}>{p.name}</div>
                  {p.password && <div style={{ fontSize: 10, color: 'rgba(167,139,250,0.5)', textTransform: 'uppercase' }}>Protegido</div>}
                </div>
              ))}
              
              <div style={S.profileCard} onClick={() => setView('register')}>
                <div style={{ ...S.avatar, borderStyle: 'dashed', background: 'transparent' }}>
                  <Plus size={32} color="#a78bfa" />
                </div>
                <div style={{ fontWeight: 700, fontSize: 14, color: '#a78bfa' }}>Novo Perfil</div>
              </div>
            </div>
            
            {!APP_CONFIG.IS_OFFLINE && (
              <button 
                onClick={() => useUserStore.getState().logout()} 
                style={{ ...S.btn, ...S.secondaryBtn, marginTop: 40, border: 'none' }}
              >
                Sair desta Conta
              </button>
            )}
          </>
        ) : loading && APP_CONFIG.IS_OFFLINE ? (
          <div style={{ textAlign: 'center', padding: 40 }}>
            <div className="pulse" style={{ fontSize: 16, color: '#a78bfa' }}>Iniciando Sistema Local...</div>
          </div>
        ) : view === 'login' ? (
          <>
            <div>
              <div style={S.title}>Acessar Conta</div>
              <div style={S.subTitle}>Entre com o e-mail da sua assinatura Digit.ae</div>
            </div>

            {error && <div style={S.error}>{error}</div>}

            <form onSubmit={handleAccountLogin} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              <div style={S.inputGroup}>
                <label style={S.label}>E-mail</label>
                <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                  <Mail size={18} style={S.inputIcon} />
                  <input 
                    type="email" placeholder="seu@email.com" required 
                    value={email} onChange={e => setEmail(e.target.value)}
                    style={S.input} 
                  />
                </div>
              </div>

              <div style={S.inputGroup}>
                <label style={S.label}>Senha da Conta</label>
                <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                  <Lock size={18} style={S.inputIcon} />
                  <input 
                    type="password" placeholder="••••••••" required 
                    value={password} onChange={e => setPassword(e.target.value)}
                    style={S.input} 
                  />
                </div>
              </div>

              <button type="submit" disabled={loading} style={S.btn}>
                {loading ? 'Entrando...' : 'Entrar na Conta'}
              </button>
            </form>
          </>
        ) : (
          <>
            <button onClick={() => setView('list')} style={{ ...S.btn, ...S.secondaryBtn, width: 'fit-content', padding: 8, marginTop: -20, marginLeft: -20 }}>
              <ChevronLeft size={20} />
            </button>

            <div>
              <div style={S.title}>Novo Aluno</div>
              <div style={S.subTitle}>Configure o perfil do novo digitador.</div>
            </div>

            {error && <div style={S.error}>{error}</div>}

            <form onSubmit={handleCreateProfile} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              <div style={S.inputGroup}>
                <label style={S.label}>Nome do Aluno</label>
                <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                  <UserCircle size={18} style={S.inputIcon} />
                  <input 
                    type="text" placeholder="Ex: Maria Souza" required 
                    value={name} onChange={e => setName(e.target.value)}
                    style={S.input} 
                  />
                </div>
              </div>

              <div style={S.inputGroup}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <label style={S.label}>Meta de Velocidade</label>
                  <span style={{ fontSize: 13, color: '#a78bfa', fontWeight: 900 }}>{velocidade} TPM</span>
                </div>
                <input 
                  type="range" min="30" max="600" step="5"
                  value={velocidade} onChange={e => setVelocidade(parseInt(e.target.value))}
                  style={{ ...S.input, padding: 0, height: 4, background: 'rgba(255,255,255,0.1)' }} 
                />
              </div>

              <div style={S.inputGroup}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <label style={S.label}>Precisão Mínima</label>
                  <span style={{ fontSize: 13, color: '#34d399', fontWeight: 900 }}>{minAcerto}%</span>
                </div>
                <input 
                  type="range" min="50" max="100" step="1"
                  value={minAcerto} onChange={e => setMinAcerto(parseInt(e.target.value))}
                  style={{ ...S.input, padding: 0, height: 4, background: 'rgba(255,255,255,0.1)' }} 
                />
              </div>

              <div style={S.inputGroup}>
                <label style={S.label}>Senha do Perfil (Opcional)</label>
                <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                  <ShieldCheck size={18} style={S.inputIcon} />
                  <input 
                    type="password" placeholder="••••••••"
                    value={profilePassword} onChange={e => setProfilePassword(e.target.value)}
                    style={S.input} 
                  />
                </div>
              </div>

              <button type="submit" disabled={loading} style={S.btn}>
                {loading ? 'Criando...' : 'Criar Perfil'}
              </button>
            </form>
          </>
        )}
      </div>

      {/* Modal de Senha */}
      {showPasswordPrompt && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, 
          background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(10px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
        }}>
          <div style={{ ...S.mainCard, maxWidth: 400 }}>
            <div style={{ textAlign: 'center' }}>
              <div style={S.title}>Acessar Perfil</div>
              <div style={S.subTitle}>Digite a senha para acessar {targetProfile?.name}</div>
            </div>

            {error && <div style={S.error}>{error}</div>}

            <form onSubmit={handleVerifyPassword} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              <div style={S.inputGroup}>
                <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                  <Lock size={18} style={S.inputIcon} />
                  <input 
                    type="password" placeholder="Senha do aluno" autoFocus required
                    value={verifyPassword} onChange={e => setVerifyPassword(e.target.value)}
                    style={S.input} 
                  />
                </div>
              </div>

              <div style={{ display: 'flex', gap: 12 }}>
                <button type="button" onClick={() => setShowPasswordPrompt(false)} style={{ ...S.btn, ...S.secondaryBtn, flex: 1 }}>
                  Cancelar
                </button>
                <button type="submit" style={{ ...S.btn, flex: 1 }}>
                  Entrar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style>{`
        .pulse { animation: pulse 2s infinite; }
        @keyframes pulse { 0% { opacity: 0.5; } 50% { opacity: 1; } 100% { opacity: 0.5; } }
        .profile-hero:hover {
          border-color: #a78bfa !important;
          transform: translateY(-5px);
          box-shadow: 0 10px 30px rgba(167,139,250,0.2);
          background: rgba(167,139,250,0.1) !important;
        }
        input[type=range]{-webkit-appearance:none;width:100%;height:4px;border-radius:2px;background:rgba(255,255,255,0.1);outline:none;}
        input[type=range]::-webkit-slider-thumb{-webkit-appearance:none;width:16px;height:16px;border-radius:50%;background:#a78bfa;cursor:pointer;}
      `}</style>
    </div>
  );
};

export default ProfileSelection;
