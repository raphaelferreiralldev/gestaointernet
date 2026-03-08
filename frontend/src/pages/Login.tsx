import { useState } from 'react';
import { Zap, Eye, EyeOff, Wifi } from 'lucide-react';

interface LoginProps {
  onLogin: (user: { name: string; role: string }) => void;
}

export default function Login({ onLogin }: LoginProps) {
  const [email, setEmail] = useState('admin@gestaonet.com');
  const [password, setPassword] = useState('admin123');
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');

    setTimeout(() => {
      if (email === 'admin@gestaonet.com' && password === 'admin123') {
        onLogin({ name: 'Administrador', role: 'admin' });
      } else if (email === 'suporte@gestaonet.com' && password === 'suporte123') {
        onLogin({ name: 'Equipe Suporte', role: 'support' });
      } else if (email === 'financeiro@gestaonet.com' && password === 'fin123') {
        onLogin({ name: 'Setor Financeiro', role: 'financial' });
      } else {
        setError('Email ou senha incorretos. Use as credenciais de demonstracao abaixo.');
      }
      setLoading(false);
    }, 800);
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-950 to-gray-900 flex items-center justify-center p-4">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-600/10 rounded-full blur-3xl" />
      </div>

      <div className="w-full max-w-md relative">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-blue-600 mb-4 shadow-lg">
            <Zap size={32} className="text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white">GestaoNet</h1>
          <p className="text-blue-300 mt-1">Sistema de Gestao para Provedores de Internet</p>
        </div>

        {/* Form */}
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 shadow-2xl">
          <h2 className="text-xl font-semibold text-white mb-6">Entrar no sistema</h2>

          {error && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-300 text-sm rounded-lg px-4 py-3 mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-blue-200 mb-1.5">Email</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full bg-white/10 border border-white/20 text-white placeholder-white/40 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="seu@email.com"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-blue-200 mb-1.5">Senha</label>
              <div className="relative">
                <input
                  type={showPass ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full bg-white/10 border border-white/20 text-white placeholder-white/40 rounded-lg px-4 py-3 pr-11 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/70"
                >
                  {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-2"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Entrando...
                </span>
              ) : 'Entrar'}
            </button>
          </form>

          {/* Demo credentials */}
          <div className="mt-6 p-4 bg-white/5 rounded-xl border border-white/10">
            <p className="text-xs font-semibold text-blue-300 mb-2 flex items-center gap-1.5">
              <Wifi size={12} /> Credenciais de demonstracao
            </p>
            <div className="space-y-1 text-xs text-white/60">
              <p><span className="text-white/80">Admin:</span> admin@gestaonet.com / admin123</p>
              <p><span className="text-white/80">Suporte:</span> suporte@gestaonet.com / suporte123</p>
              <p><span className="text-white/80">Financeiro:</span> financeiro@gestaonet.com / fin123</p>
            </div>
          </div>
        </div>

        <p className="text-center text-white/30 text-xs mt-6">
          GestaoNet v1.0 - Sistema ISP © 2024
        </p>
      </div>
    </div>
  );
}
