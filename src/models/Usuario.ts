export type TipoPerfil = 'PACIENTE' | 'CUIDADOR';

export interface Usuario {
  id: number;
  nome: string;
  email: string;
  fotoUrl?: string;
  tipoPerfil: TipoPerfil;
  codigoVinculo?: string;
}

export interface VinculoFamiliar {
  id: number;
  cuidador: Usuario;
  paciente: Usuario;
  ativo: boolean;
  dataCriacao: string;
}