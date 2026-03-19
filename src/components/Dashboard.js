import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

function Dashboard({ user }) {
  const [processos, setProcessos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtro, setFiltro] = useState('');

  useEffect(() => {
    fetchProcessos();
  }, [user]);

  const fetchProcessos = async () => {
    try {
      const { data, error } = await supabase
        .from('processos')
        .select('*')
        .eq('usuario_id', user.id);

      if (error) throw error;
      setProcessos(data || []);
    } catch (error) {
      console.error('Erro ao buscar processos:', error);
    } finally {
      setLoading(false);
    }
  };

  const processosFiltrados = processos.filter(p =>
    p.numero_processo.includes(filtro) ||
    p.comarca.toLowerCase().includes(filtro.toLowerCase())
  );

  if (loading) return <div className="loading">Carregando processos...</div>;

  return (
    <div className="dashboard">
      <h2>Meus Processos</h2>
      
      <div className="filtro">
        <input
          type="text"
          placeholder="Filtrar por número ou comarca..."
          value={filtro}
          onChange={(e) => setFiltro(e.target.value)}
        />
      </div>

      {processosFiltrados.length === 0 ? (
        <p className="empty">Nenhum processo cadastrado ainda.</p>
      ) : (
        <table className="tabela">
          <thead>
            <tr>
              <th>Número</th>
              <th>Comarca</th>
              <th>Estado</th>
              <th>Tipo</th>
              <th>Status</th>
              <th>Data Recebimento</th>
            </tr>
          </thead>
          <tbody>
            {processosFiltrados.map(processo => (
              <tr key={processo.id}>
                <td>{processo.numero_processo}</td>
                <td>{processo.comarca}</td>
                <td>{processo.estado}</td>
                <td>{processo.tipo}</td>
                <td><span className={`status ${processo.status}`}>{processo.status}</span></td>
                <td>{new Date(processo.data_recebimento).toLocaleDateString('pt-BR')}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default Dashboard;
