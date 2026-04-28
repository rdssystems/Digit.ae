import React, { useState } from 'react';
import { useUserStore } from '../store/useUserStore';
import { Mail, Key, User as UserIcon, AlertCircle } from 'lucide-react';

const S = {
  page: {
    minHeight: '100vh', background: '#08080f', color: '#fff',
    fontFamily: "'Outfit',sans-serif", display: 'flex', flexDirection: 'column' as const,
    alignItems: 'center', justifyContent: 'center', padding: '40px 20px', overflowX: 'hidden' as const
  },
  logoContainer: {
    textAlign: 'center' as const, marginBottom: 0
  },
  logo: {
    fontSize: 56, fontWeight: 900, lineHeight: 1.1,
    background: 'linear-gradient(135deg,#a78bfa,#60a5fa,#34d399)',
    WebkitBackgroundClip: 'text' as const, WebkitTextFillColor: 'transparent' as const,
    letterSpacing: '-0.03em',
  },
  logoSub: {
    fontSize: 13, color: 'rgba(255,255,255,0.3)',
    letterSpacing: '0.25em', textTransform: 'uppercase' as const, marginTop: 4,
  },
  card: {
    width: '100%', maxWidth: 440,
    background: 'rgba(15,10,40,0.6)', backdropFilter: 'blur(16px)',
    border: '1px solid rgba(139,92,246,0.15)', borderRadius: 24, padding: '40px 32px',
    boxShadow: '0 20px 50px rgba(0,0,0,0.5), inset 0 0 0 1px rgba(255,255,255,0.05)',
    display: 'flex', flexDirection: 'column' as const, gap: 20, marginTop: 32
  },
  title: {
    fontSize: 24, fontWeight: 800, color: '#fff', textAlign: 'center' as const, marginBottom: 8
  },
  inputGroup: {
    display: 'flex', flexDirection: 'column' as const, gap: 6
  },
  label: {
    fontSize: 13, color: 'rgba(255,255,255,0.6)', fontWeight: 600, marginLeft: 4
  },
  inputWrapper: {
    position: 'relative' as const, display: 'flex', alignItems: 'center'
  },
  inputIcon: {
    position: 'absolute' as const, left: 16, color: 'rgba(255,255,255,0.4)', pointerEvents: 'none' as const
  },
  input: {
    width: '100%', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: 14, padding: '14px 16px 14px 46px', color: '#fff', outline: 'none', fontSize: 15,
    fontFamily: "'Outfit',sans-serif", transition: 'border-color 0.2s', boxSizing: 'border-box' as const
  },
  btnPrimary: {
    width: '100%', padding: '16px 24px', borderRadius: 14, fontWeight: 800, fontSize: 15,
    background: 'linear-gradient(135deg,#7c3aed,#4f46e5)', border: 'none',
    boxShadow: '0 4px 15px rgba(124,58,237,0.3)', color: '#fff', cursor: 'pointer',
    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
    transition: 'all 0.2s', textTransform: 'uppercase' as const, letterSpacing: '0.05em', marginTop: 12
  },
  btnGoogle: {
    width: '100%', padding: '14px 24px', borderRadius: 14, fontWeight: 700, fontSize: 14,
    background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)',
    color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12,
    transition: 'all 0.2s', marginTop: 4, backdropFilter: 'blur(4px)'
  },
  divider: {
    display: 'flex', alignItems: 'center', gap: 12, margin: '10px 0',
    color: 'rgba(255,255,255,0.2)', fontSize: 11, fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: '0.1em'
  },
  dividerLine: {
    flex: 1, height: 1, background: 'rgba(255,255,255,0.05)'
  },
  linkBtn: {
    background: 'transparent', border: 'none', color: '#a78bfa', fontSize: 14,
    fontWeight: 600, cursor: 'pointer', outline: 'none', transition: 'color 0.2s',
  },
  error: {
    background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)',
    padding: '12px 16px', borderRadius: 12, color: '#fca5a5', fontSize: 13,
    display: 'flex', alignItems: 'center', gap: 8, fontWeight: 500
  }
};

const AuthScreen: React.FC = () => {
  const { login, register, loginWithGoogle } = useUserStore();
  const [view, setView] = useState<'login' | 'register'>('login');
  const [loading, setLoading] = useState(false);
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  const [focusedInput, setFocusedInput] = useState<string | null>(null);

  const switchView = (newView: 'login' | 'register') => {
    setView(newView);
    setError('');
    setName('');
    setEmail('');
    setPassword('');
    setConfirmPassword('');
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (view === 'login') {
        if (!email.trim() || !password.trim()) {
          throw new Error('Preencha email e a senha.');
        }
        await login(email.trim(), password);
      } else {
        if (!name.trim() || !email.trim() || !password.trim()) {
          throw new Error('Preencha todos os campos obrigatórios.');
        }
        if (password !== confirmPassword) {
          throw new Error('As senhas não coincidem.');
        }
        await register(email.trim(), password, name.trim());
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Ocorreu um erro ao processar sua solicitação.');
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError('');
    setLoading(true);
    try {
      await loginWithGoogle();
    } catch (err: any) {
      console.error(err);
      setError('Falha ao autenticar com Google.');
      setLoading(false);
    }
  };

  const getInputStyle = (inputId: string) => ({
    ...S.input,
    borderColor: focusedInput === inputId ? '#a78bfa' : 'rgba(255,255,255,0.1)'
  });

  return (
    <div style={S.page}>
      
      <div style={S.logoContainer}>
        <div style={S.logo}>Digit.ae</div>
        <div style={S.logoSub}>Tão simples quanto falar</div>
      </div>

      <div style={S.card}>
        <div style={S.title}>{view === 'login' ? 'Acessar Conta' : 'Criar nova assinatura'}</div>
        
        <div style={{ textAlign: 'center', marginTop: -10, marginBottom: 10, fontSize: 14, color: 'rgba(255,255,255,0.4)' }}>
          {view === 'login' ? 'Entre com o e-mail da sua assinatura Digit.ae' : 'Comece sua jornada hoje mesmo'}
        </div>

        {error && (
          <div style={S.error}>
            <AlertCircle size={18} /> {error}
          </div>
        )}

        <form onSubmit={handleAuth} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {view === 'register' && (
            <div style={S.inputGroup}>
              <label style={S.label}>Nome completo</label>
              <div style={S.inputWrapper}>
                <UserIcon size={18} style={S.inputIcon} />
                <input
                  type="text"
                  placeholder="Seu nome"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  onFocus={() => setFocusedInput('name')}
                  onBlur={() => setFocusedInput(null)}
                  style={getInputStyle('name')}
                  disabled={loading}
                />
              </div>
            </div>
          )}

          <div style={S.inputGroup}>
            <label style={S.label}>Email da Conta</label>
            <div style={S.inputWrapper}>
              <Mail size={18} style={S.inputIcon} />
              <input
                type="email"
                placeholder="seu@email.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                onFocus={() => setFocusedInput('email')}
                onBlur={() => setFocusedInput(null)}
                style={getInputStyle('email')}
                disabled={loading}
              />
            </div>
          </div>

          <div style={S.inputGroup}>
            <label style={S.label}>Senha da Conta</label>
            <div style={S.inputWrapper}>
              <Key size={18} style={S.inputIcon} />
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
                onFocus={() => setFocusedInput('password')}
                onBlur={() => setFocusedInput(null)}
                style={getInputStyle('password')}
                disabled={loading}
              />
            </div>
          </div>

          {view === 'register' && (
            <div style={S.inputGroup}>
              <label style={S.label}>Confirme a senha</label>
              <div style={S.inputWrapper}>
                <Key size={18} style={S.inputIcon} />
                <input
                  type="password"
                  placeholder="Repita sua senha"
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  onFocus={() => setFocusedInput('confirm')}
                  onBlur={() => setFocusedInput(null)}
                  style={getInputStyle('confirm')}
                  disabled={loading}
                />
              </div>
            </div>
          )}

          <button 
            type="submit" 
            style={{ ...S.btnPrimary, opacity: loading ? 0.7 : 1, cursor: loading ? 'not-allowed' : 'pointer' }}
            disabled={loading}
          >
            {loading ? 'Processando...' : (view === 'login' ? 'ENTRAR NA CONTA' : 'CRIAR ASSINATURA')}
          </button>
        </form>

        <div style={S.divider}>
          <div style={S.dividerLine} />
          Ou acesse com
          <div style={S.dividerLine} />
        </div>

        <button 
          onClick={handleGoogleLogin} 
          style={S.btnGoogle}
          disabled={loading}
          onMouseEnter={e => (e.target as HTMLElement).style.background = 'rgba(255,255,255,0.08)'}
          onMouseLeave={e => (e.target as HTMLElement).style.background = 'rgba(255,255,255,0.03)'}
        >
          <img src="https://www.google.com/favicon.ico" alt="Google" style={{ width: 18, height: 18 }} />
          Continuar com Google
        </button>

        <div style={{ textAlign: 'center', marginTop: 12, fontSize: 14, color: 'rgba(255,255,255,0.5)' }}>
          {view === 'login' ? (
            <>
              Novo por aqui?{' '}
              <button 
                type="button"
                onClick={() => switchView('register')} 
                style={S.linkBtn} 
                onMouseEnter={e => (e.target as HTMLElement).style.color = '#c4b5fd'} 
                onMouseLeave={e => (e.target as HTMLElement).style.color = '#a78bfa'}
              >
                Crie um plano grátis
              </button>
            </>
          ) : (
            <>
              Já possui uma conta?{' '}
              <button 
                type="button"
                onClick={() => switchView('login')} 
                style={S.linkBtn} 
                onMouseEnter={e => (e.target as HTMLElement).style.color = '#c4b5fd'} 
                onMouseLeave={e => (e.target as HTMLElement).style.color = '#a78bfa'}
              >
                Voltar para o login
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthScreen;
