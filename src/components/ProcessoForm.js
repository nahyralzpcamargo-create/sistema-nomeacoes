import React, { useState } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

function ProcessoForm({ user, setPage }) {
  const [formData, setFormData] = useState({
    numero_processo: '',
    comarca: '',
    estado: '',
    tipo: 'AJG',
    status: 'Recebido',
    data_recebimento: '',
    descricao: '',
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase
        .from('processos')
        .insert([
          {
            ...formData,
            usuario_id: user.id,
          }
        ]);

      if (error) throw error;
      alert('Processo cadastrado com sucesso!');
      setFormData({
        numero_processo: '',
        comarca: '',
        estado: '',
        tipo: 'AJG',
        status: 'Recebido',
        data_recebimento: '',
        descricao: '',
      });
      setPage('dashboard');
    } catch (error) {
      alert('Erro ao cadastrar: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-container">
      <h2>Novo Processo</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Número do Processo *</label>
          <input
            type="text"
            name="numero_processo"
            value={formData.numero_processo}
            onChange={handleChange}
            placeholder="Ex: 0000001-00.0000.0.00.0000"
            required
          />
        </div>

        <div className="form-group">
          <label>Comarca *</label>
          <input
            type="text"
            name="comarca"
            value={formData.comarca}
            onChange={handleChange}
            placeholder="Ex: São Paulo"
            required
          />
        </div>

        <div className="form-group">
          <label>Estado *</label>
          <input
            type="text"
            name="estado"
            value={formData.estado}
            onChange={handleChange}
            placeholder="Ex: SP"
            maxLength="2"
            required
          />
        </div>

        <div className="form-group">
          <label>Tipo *</label>
          <select name="tipo" value={formData.tipo} onChange={handleChange}>
            <option value="AJG">AJG</option>
            <option value="JUSTICA_PAGA">Justiça Paga</option>
          </select>
        </div>

        <div className="form-group">
          <label>Status *</label>
          <select name="status" value={formData.status} onChange={handleChange}>
            <option value="Recebido">Recebido</option>
            <option value="Em Análise">Em Análise</option>
            <option value="Concluído">Concluído</option>
            <option value="Arquivado">Arquivado</option>
          </select>
        </div>

        <div className="form-group">
          <label>Data de Recebimento *</label>
          <input
            type="date"
            name="data_recebimento"
            value={formData.data_recebimento}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Descrição</label>
          <textarea
            name="descricao"
            value={formData.descricao}
            onChange={handleChange}
            placeholder="Detalhes do processo..."
            rows="4"
          />
        </div>

        <button type="submit" disabled={loading}>
          {loading ? 'Salvando...' : 'Cadastrar Processo'}
        </button>
      </form>
    </div>
  );
}

export default ProcessoForm;
