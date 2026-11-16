import { useState } from 'react';
import type { TipoPerfil } from '../models/Usuario';

interface LoginViewProps {
  carregando: boolean;
  erro: string | null;
  onEntrar: (nome: string, email: string, tipoPerfil: TipoPerfil) => Promise<void>;
  onRecuperar: (email: string) => Promise<void>;
}

export function LoginView({
  carregando,
  erro,
  onEntrar,
  onRecuperar,
}: LoginViewProps) {
  const [modoRecuperar, setModoRecuperar] = useState(false);
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [tipoPerfil, setTipoPerfil] = useState<TipoPerfil>('PACIENTE');
  const [erroValidacao, setErroValidacao] = useState<string | null>(null);

  // Impede digitação de números e caracteres especiais no Nome (permite apenas letras e espaços)
  function handleNomeChange(valor: string) {
    const apenasLetras = valor.replace(/[^A-Za-zÀ-ÖØ-öø-ÿ\s]/g, '');
    setNome(apenasLetras);
  }

  // Valida Nome + Sobrenome obrigatórios e formato de E-mail
  function validarCampos(): boolean {
    setErroValidacao(null);

    if (!modoRecuperar) {
      const nomeLimpo = nome.trim();
      // Exige Nome (mín. 2 letras) + espaço + Sobrenome (mín. 2 letras), apenas letras
      const regexNomeCompleto =
        /^[A-Za-zÀ-ÖØ-öø-ÿ]{2,}(?:\s+[A-Za-zÀ-ÖØ-öø-ÿ]{2,})+$/;

      if (!regexNomeCompleto.test(nomeLimpo)) {
        setErroValidacao(
          'Por favor, informe seu Nome e Sobrenome completos usando apenas letras (ex: Maria Silva).'
        );
        return false;
      }
    }

    const emailLimpo = email.trim().toLowerCase();
    // Exige pelo menos uma letra antes do @, seguido de @dominio.extensao
    const regexEmail = /^(?=.*[a-z])[a-z0-9._-]+@[a-z0-9.-]+\.[a-z]{2,}$/;

    if (!regexEmail.test(emailLimpo)) {
      setErroValidacao(
        'Digite um e-mail válido contendo letras (ex: nome@gmail.com).'
      );
      return false;
    }

    return true;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validarCampos()) return;

    if (modoRecuperar) {
      await onRecuperar(email.trim().toLowerCase());
    } else {
      await onEntrar(nome.trim(), email.trim().toLowerCase(), tipoPerfil);
    }
  }

  return (
    <div className="container">
      <div className="card">
        <h1>CuidaMed 50+</h1>
        <p className="subtitulo">
          {modoRecuperar
            ? 'Digite o seu e-mail cadastrado para recuperar seu acesso.'
            : 'Gestão simples de medicamentos e acompanhamento familiar.'}
        </p>

        {(erroValidacao || erro) && (
          <div className="alerta-erro">{erroValidacao || erro}</div>
        )}

        <form onSubmit={handleSubmit}>
          {!modoRecuperar && (
            <>
              <label>Quem vai usar este acesso?</label>
              <div className="grupo-perfil">
                <button
                  type="button"
                  className={`btn-perfil ${tipoPerfil === 'PACIENTE' ? 'ativo' : ''}`}
                  onClick={() => setTipoPerfil('PACIENTE')}
                >
                  <span style={{ fontSize: '28px' }}>👤</span>
                  <span>Sou Paciente</span>
                </button>

                <button
                  type="button"
                  className={`btn-perfil ${tipoPerfil === 'CUIDADOR' ? 'ativo' : ''}`}
                  onClick={() => setTipoPerfil('CUIDADOR')}
                >
                  <span style={{ fontSize: '28px' }}>🤝</span>
                  <span>Sou Cuidador(a)</span>
                </button>
              </div>

              <div className="campo-grupo">
                <label htmlFor="nome">Nome e Sobrenome (apenas letras)</label>
                <input
                  id="nome"
                  type="text"
                  placeholder="Ex: Maria Silva"
                  value={nome}
                  onChange={(e) => handleNomeChange(e.target.value)}
                  required
                />
              </div>
            </>
          )}

          <div className="campo-grupo">
            <label htmlFor="email">Seu E-mail (Conta Google)</label>
            <input
              id="email"
              type="email"
              placeholder="exemplo@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="btn-primario" disabled={carregando}>
            <span>
              {carregando
                ? 'Conectando...'
                : modoRecuperar
                ? '🔄 Recuperar Meu Perfil'
                : '🔑 Entrar com Google'}
            </span>
          </button>
        </form>

        <div style={{ marginTop: '20px', textAlign: 'center' }}>
          <button
            type="button"
            className="btn-secundario"
            onClick={() => {
              setErroValidacao(null);
              setModoRecuperar(!modoRecuperar);
            }}
          >
            {modoRecuperar
              ? 'Voltar para o Cadastro / Login'
              : 'Já tenho conta (Recuperar Perfil)'}
          </button>
        </div>
      </div>
    </div>
  );
}