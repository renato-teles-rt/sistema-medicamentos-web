import axios from 'axios';
import type { TipoPerfil, Usuario, VinculoFamiliar } from '../models/Usuario';

const api = axios.create({
  baseURL: 'http://localhost:8080/api/auth',
});

export const authService = {
  // 1. Login ou cadastro simplificado (POST /api/auth/google)
  async loginGoogle(
    nome: string,
    email: string,
    tipoPerfil: TipoPerfil,
    fotoUrl?: string
  ): Promise<Usuario> {
    const response = await api.post<Usuario>('/google', {
      nome,
      email,
      fotoUrl: fotoUrl || '',
      tipoPerfil,
    });
    return response.data;
  },

  // 2. Recuperar perfil pelo e-mail (GET /api/auth/recuperar)
  async recuperarPerfil(email: string): Promise<Usuario> {
    const response = await api.get<Usuario>('/recuperar', {
      params: { email },
    });
    return response.data;
  },

  // 3. Vincular Cuidador ao Paciente pelo código de 6 dígitos (POST /api/auth/vincular)
  async vincularFamiliar(
    cuidadorId: number,
    codigoVinculo: string
  ): Promise<VinculoFamiliar> {
    const response = await api.post<VinculoFamiliar>('/vincular', {
      cuidadorId,
      codigoVinculo,
    });
    return response.data;
  },

  // 4. Listar pacientes vinculados a um cuidador (GET /api/auth/cuidador/{id}/pacientes)
  async listarPacientesDoCuidador(cuidadorId: number): Promise<VinculoFamiliar[]> {
    const response = await api.get<VinculoFamiliar[]>(
      `/cuidador/${cuidadorId}/pacientes`
    );
    return response.data;
  },

  // 5. Listar cuidadores vinculados a um paciente (GET /api/auth/paciente/{id}/cuidadores)
  async listarCuidadoresDoPaciente(pacienteId: number): Promise<VinculoFamiliar[]> {
    const response = await api.get<VinculoFamiliar[]>(
      `/paciente/${pacienteId}/cuidadores`
    );
    return response.data;
  },

  // 6. Desvincular cuidador/paciente (DELETE /api/auth/vincular/{vinculoId}) - RN01
  async desvincularFamiliar(vinculoId: number): Promise<void> {
    await api.delete(`/vincular/${vinculoId}`);
  },
};