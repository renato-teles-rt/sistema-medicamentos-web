import { useAuthController } from './controllers/useAuthController';
import { LoginView } from './views/LoginView';
import { PainelVinculoView } from './views/PainelVinculoView';

export function App() {
  const {
    usuario,
    vinculos,
    carregando,
    erro,
    mensagemSucesso,
    entrar,
    recuperarConta,
    vincularPorCodigo,
    sair,
  } = useAuthController();

  if (!usuario) {
    return (
      <LoginView
        carregando={carregando}
        erro={erro}
        onEntrar={entrar}
        onRecuperar={recuperarConta}
      />
    );
  }

  return (
    <PainelVinculoView
      usuario={usuario}
      vinculos={vinculos}
      carregando={carregando}
      erro={erro}
      mensagemSucesso={mensagemSucesso}
      onVincular={vincularPorCodigo}
      onSair={sair}
    />
  );
}

export default App;