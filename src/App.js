import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import './App.css';
import Dashboard from './components/Dashboard';
import ProcessoForm from './components/ProcessoForm';
import Login from './components/Login';

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState('dashboard');

  useEffect(() => {
    const checkUser = async () => {
      const { data } = await supabase.auth.getSession();
      setUser(data?.session?.user || null);
      setLoading(false);
    };
    checkUser();
  }, []);

  if (loading) {
    return <div className="loading">Carregando...</div>;
  }

  if (!user) {
    return <Login setUser={setUser} />;
  }

  return (
    <div className="app">
      <header className="header">
        <h1>📋 Sistema de Nomeações Judiciais</h1>
        <button onClick={() => supabase.auth.signOut()}>Sair</button>
      </header>

      <nav className="nav">
        <button 
          className={currentPage === 'dashboard' ? 'active' : ''}
          onClick={() => setCurrentPage('dashboard')}
        >
          Dashboard
        </button>
        <button 
          className={currentPage === 'novo' ? 'active' : ''}
          onClick={() => setCurrentPage('novo')}
        >
          Novo Processo
        </button>
      </nav>

      <main className="main">
        {currentPage === 'dashboard' && <Dashboard user={user} />}
        {currentPage === 'novo' && <ProcessoForm user={user} setPage={setCurrentPage} />}
      </main>
    </div>
  );
}

export default App;
