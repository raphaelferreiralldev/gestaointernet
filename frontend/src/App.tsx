import { useState } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Clients from './pages/Clients';
import Plans from './pages/Plans';
import Financial from './pages/Financial';
import Network from './pages/Network';
import Tickets from './pages/Tickets';

interface User {
  name: string;
  role: string;
}

export default function App() {
  const [user, setUser] = useState<User | null>(null);

  if (!user) {
    return <Login onLogin={setUser} />;
  }

  return (
    <HashRouter>
      <Routes>
        <Route element={<Layout user={user} onLogout={() => setUser(null)} />}>
          <Route path="/" element={<Dashboard user={user} />} />
          <Route path="/clientes" element={<Clients user={user} />} />
          <Route path="/planos" element={<Plans user={user} />} />
          <Route path="/financeiro" element={<Financial user={user} />} />
          <Route path="/rede" element={<Network user={user} />} />
          <Route path="/chamados" element={<Tickets user={user} />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </HashRouter>
  );
}
