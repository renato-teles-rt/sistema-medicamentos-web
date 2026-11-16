import { useState } from 'react';
import type { Usuario, VinculoFamiliar } from '../models/Usuario';

interface PainelVinculoViewProps {
  usuario: Usuario;
  vinculos: VinculoFamiliar[];
  carregando: boolean;
  erro: string | null;
  mensagemSucesso: string | null;
  onVincular: (codigo: string) => Promise<void>;
  onSair: () => void;
}

export function PainelVinculoView({
  usuario,
  vinculos,
  carregando,
  erro,
  mensagemSucesso,
  onVincular,
  onSair,
}: PainelVinculoViewProps) {
  const [codigoInput, setCodigoInput] = useState('');

  async function handleVincular(e: React.FormEvent) {
    e.preventDefault();
    if (!codigoInput.trim()) return;
    await onVincular(codigoInput);
    setCodigoInput('');
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
              Perfil: {usuario.tipoPerfil === 'PACIENTE' ? 'Paciente 50+' : 'Cuidador / Familiar'}
            </span>
          </div>

          <button type="button" className="btn-secundario" onClick={onSair}>
            <span>🚪 Sair</span>
          </button>
        </div>

        {/* Se for PACIENTE, exibe o Código de 6 dígitos */}
        {usuario.tipoPerfil === 'PACIENTE' && (
          <div className="codigo-destaque">
            <p style={{ fontWeight: 600 }}>
              Seu Código de Vínculo Familiar (compartilhe com seu cuidador):
            </p>
            <span className="codigo-letras">{usuario.codigoVinculo}</span>
          </div>
        )}
      </div>

      {/* Se for CUIDADOR, exibe o formulário para digitar o código */}
      {usuario.tipoPerfil === 'CUIDADOR' && (
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
        <h2>
          👥{' '}
          {usuario.tipoPerfil === 'CUIDADOR'
            ? 'Pacientes Acompanhados por Você'
            : 'Cuidadores Conectados ao Seu Perfil'}
        </h2>

        {vinculos.length === 0 ? (
          <p style={{ color: '#486581', marginTop: '10px' }}>
            Nenhum vínculo familiar ativo no momento.
          </p>
        ) : (
          vinculos.map((v) => {
            const pessoa =
              usuario.tipoPerfil === 'CUIDADOR' ? v.paciente : v.cuidador;
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
                <span className="badge">Vínculo Ativo</span>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}