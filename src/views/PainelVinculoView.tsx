import { useState } from 'react';
import type { Usuario, VinculoFamiliar } from '../models/Usuario';

const LIMITE_MAXIMO_CUIDADORES = 2;

interface PainelVinculoViewProps {
  usuario: Usuario;
  vinculos: VinculoFamiliar[];
  carregando: boolean;
  erro: string | null;
  mensagemSucesso: string | null;
  onVincular: (codigo: string) => Promise<void>;
  onDesvincular: (vinculoId: number) => Promise<void>;
  onSair: () => void;
}

export function PainelVinculoView({
  usuario,
  vinculos,
  carregando,
  erro,
  mensagemSucesso,
  onVincular,
  onDesvincular,
  onSair,
}: PainelVinculoViewProps) {
  const [codigoInput, setCodigoInput] = useState('');
  const isPaciente = usuario.tipoPerfil === 'PACIENTE';
  const limiteAtingido =
    isPaciente && vinculos.length >= LIMITE_MAXIMO_CUIDADORES;

  async function handleVincular(e: React.FormEvent) {
    e.preventDefault();
    if (!codigoInput.trim()) return;
    await onVincular(codigoInput);
    setCodigoInput('');
  }

  async function handleDesvincular(vinculo: VinculoFamiliar) {
    const alvo = isPaciente ? vinculo.cuidador.nome : vinculo.paciente.nome;
    const confirmado = window.confirm(
      `Deseja realmente remover o vínculo com ${alvo}?`
    );
    if (!confirmado) return;
    await onDesvincular(vinculo.id);
  }

  return (
    <div className="container">
      {/* Cabeçalho do Perfil */}
      <div className="card">
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '12px',
            flexWrap: 'wrap',
          }}
        >
          <div>
            <h1>Olá, {usuario.nome}</h1>
            <span className="badge">
              Perfil: {isPaciente ? 'Paciente 50+' : 'Cuidador / Familiar'}
            </span>
          </div>

          <button type="button" className="btn-secundario" onClick={onSair}>
            <span>🚪 Sair</span>
          </button>
        </div>

        {/* Se for PACIENTE, exibe o Código de 6 dígitos */}
        {isPaciente && (
          <div className="codigo-destaque">
            <p style={{ fontWeight: 600 }}>
              Seu Código de Vínculo Familiar (compartilhe com seu cuidador — até{' '}
              {LIMITE_MAXIMO_CUIDADORES} cuidadores ativos):
            </p>
            <span className="codigo-letras">{usuario.codigoVinculo}</span>
          </div>
        )}
      </div>

      {/* Se for CUIDADOR, exibe o formulário para digitar o código */}
      {!isPaciente && (
        <div className="card">
          <h2>🔗 Conectar a um Paciente</h2>
          <p className="subtitulo">
            Peça o código de 6 dígitos que aparece na tela do paciente e digite abaixo.
          </p>

          {erro && <div className="alerta-erro">{erro}</div>}
          {mensagemSucesso && <div className="alerta-sucesso">{mensagemSucesso}</div>}

          <form onSubmit={handleVincular}>
            <div className="campo-grupo">
              <label htmlFor="codigo">Código do Paciente (6 letras/números)</label>
              <input
                id="codigo"
                type="text"
                maxLength={6}
                placeholder="Ex: A1B2C3"
                style={{ textTransform: 'uppercase', letterSpacing: '4px', fontWeight: 700 }}
                value={codigoInput}
                onChange={(e) => setCodigoInput(e.target.value.toUpperCase())}
                required
              />
            </div>

            <button type="submit" className="btn-primario" disabled={carregando}>
              <span>{carregando ? 'Conectando...' : '✅ Confirmar Vínculo Familiar'}</span>
            </button>
          </form>
        </div>
      )}

      {/* Lista de Vínculos Ativos */}
      <div className="card">
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '12px',
            flexWrap: 'wrap',
          }}
        >
          <h2 style={{ margin: 0 }}>
            👥{' '}
            {isPaciente
              ? 'Cuidadores Conectados ao Seu Perfil'
              : 'Pacientes Acompanhados por Você'}
          </h2>

          {isPaciente && (
            <span className="badge">
              {vinculos.length} de {LIMITE_MAXIMO_CUIDADORES} ativos
            </span>
          )}
        </div>

        {isPaciente && (
          <p className="subtitulo" style={{ marginTop: '8px' }}>
            {limiteAtingido
              ? `Limite máximo de ${LIMITE_MAXIMO_CUIDADORES} cuidadores ativos atingido. Desvincule um para liberar vaga.`
              : `Você pode ter de 0 até ${LIMITE_MAXIMO_CUIDADORES} cuidadores ativos simultaneamente.`}
          </p>
        )}

        {isPaciente && erro && <div className="alerta-erro">{erro}</div>}
        {isPaciente && mensagemSucesso && (
          <div className="alerta-sucesso">{mensagemSucesso}</div>
        )}

        {vinculos.length === 0 ? (
          <p style={{ color: '#486581', marginTop: '10px' }}>
            {isPaciente
              ? `Nenhum cuidador vinculado no momento (0 de ${LIMITE_MAXIMO_CUIDADORES}).`
              : 'Nenhum vínculo familiar ativo no momento.'}
          </p>
        ) : (
          vinculos.map((v) => {
            const pessoa = isPaciente ? v.cuidador : v.paciente;
            return (
              <div key={v.id} className="item-vinculo">
                <div>
                  <strong style={{ display: 'block', fontSize: '19px' }}>
                    {pessoa.nome}
                  </strong>
                  <span style={{ color: '#486581', fontSize: '16px' }}>
                    {pessoa.email}
                  </span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span className="badge">Vínculo Ativo</span>
                  <button
                    type="button"
                    className="btn-secundario"
                    disabled={carregando}
                    onClick={() => handleDesvincular(v)}
                  >
                    <span>Desvincular</span>
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}