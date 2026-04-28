import './index.css'
import TypingEngine from './components/TypingEngine'
import AuthScreen from './components/AuthScreen'
import ProfileSelection from './components/ProfileSelection'
import { useAuthStore } from './store/useAuthStore'
import { useUserStore } from './store/useUserStore'
import { APP_CONFIG } from './config'

function App() {
  const { currentAccount } = useAuthStore();
  const { currentUser, selectedProfile } = useUserStore();

  // No modo offline (.exe), pulamos a tela de login inicial
  if (!APP_CONFIG.IS_OFFLINE && !currentAccount) {
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
