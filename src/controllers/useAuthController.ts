import { useState, useEffect } from 'react';
import type { TipoPerfil, Usuario, VinculoFamiliar } from '../models/Usuario';
import { authService } from '../services/authService';

const STORAGE_KEY = '@gestao_medicamentos:usuario';

export function useAuthController() {
  const [usuario, setUsuario] = useState<Usuario | null>(() => {
    const salvo = localStorage.getItem(STORAGE_KEY);
    return salvo ? JSON.parse(salvo) : null;
  });

  const [vinculos, setVinculos] = useState<VinculoFamiliar[]>([]);
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const [mensagemSucesso, setMensagemSucesso] = useState<string | null>(null);

  // Carrega automaticamente os vínculos sempre que o usuário entrar no painel
  useEffect(() => {
    if (usuario) {
      atualizarVinculos(usuario);
    }
  }, [usuario]);

  async function atualizarVinculos(user: Usuario) {
    try {
      const lista =
        user.tipoPerfil === 'CUIDADOR'
          ? await authService.listarPacientesDoCuidador(user.id)
          : await authService.listarCuidadoresDoPaciente(user.id);
      setVinculos(lista);
    } catch {
      // Silencia falha inicial caso ainda não haja vínculos
    }
  }

  async function entrar(nome: string, email: string, tipoPerfil: TipoPerfil) {
    setCarregando(true);
    setErro(null);
    setMensagemSucesso(null);

    try {
      const user = await authService.loginGoogle(nome, email, tipoPerfil);
      setUsuario(user);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    } catch (err: any) {
      setErro(
        err?.response?.data?.erro ||
          'Não foi possível conectar ao servidor. Verifique se o Back-end está rodando.'
      );
    } finally {
      setCarregando(false);
    }
  }

  async function recuperarConta(email: string) {
    setCarregando(true);
    setErro(null);
    setMensagemSucesso(null);

    try {
      const user = await authService.recuperarPerfil(email);
      setUsuario(user);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
      setMensagemSucesso(`Bem-vindo(a) de volta, ${user.nome}!`);
    } catch (err: any) {
      setErro(
        err?.response?.data?.erro || 'Nenhuma conta encontrada com este e-mail.'
      );
    } finally {
      setCarregando(false);
    }
  }

  async function vincularPorCodigo(codigoVinculo: string) {
    if (!usuario) return;
    setCarregando(true);
    setErro(null);
    setMensagemSucesso(null);

    try {
      await authService.vincularFamiliar(usuario.id, codigoVinculo);
      await atualizarVinculos(usuario);
      setMensagemSucesso('Vínculo familiar conectado com sucesso!');
    } catch (err: any) {
      setErro(
        err?.response?.data?.erro ||
          'Código inválido. Confira as 6 letras com o paciente.'
      );
    } finally {
      setCarregando(false);
    }
  }

  function sair() {
    localStorage.removeItem(STORAGE_KEY);
    setUsuario(null);
    setVinculos([]);
    setErro(null);
    setMensagemSucesso(null);
  }

  return {
    usuario,
    vinculos,
    carregando,
    erro,
    mensagemSucesso,
    entrar,
    recuperarConta,
    vincularPorCodigo,
    sair,
  };
}