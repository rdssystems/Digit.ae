import './index.css'
import TypingEngine from './components/TypingEngine'
import AuthScreen from './components/AuthScreen'
import ProfileSelection from './components/ProfileSelection'
import { AdminDashboard } from './components/AdminDashboard'
import { useUserStore } from './store/useUserStore'
import { APP_CONFIG } from './config'

function App() {
  const { currentUser, selectedProfile, showAdminDashboard, setShowAdminDashboard } = useUserStore();

  if (showAdminDashboard) {
    return <AdminDashboard onBack={() => setShowAdminDashboard(false)} />;
  }

  // Se não estiver logado no PocketBase, mostra a tela de login
  if (!APP_CONFIG.IS_OFFLINE && !currentUser) {
    return <AuthScreen />;
  }

  // Se não houver conta PocketBase ou perfil selecionado, vai para a seleção
  // No modo offline, o ProfileSelection cuidará de logar na conta local automaticamente
  if (!currentUser || !selectedProfile) {
    return <ProfileSelection />;
  }

  return <TypingEngine />
}

export default App
