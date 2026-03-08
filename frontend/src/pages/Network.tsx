import { useState } from 'react';
import { Activity, Wifi, WifiOff, AlertTriangle, CheckCircle, Clock, RefreshCw } from 'lucide-react';
import {
  AreaChart, Area, LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import Header from '../components/Header';
import Badge from '../components/Badge';
import { clients, networkEvents, networkUsageData } from '../data/mockData';

interface NetworkProps {
  user: { name: string; role: string };
}

const eventTypeConfig = {
  outage: { label: 'Queda', variant: 'danger' as const, icon: WifiOff },
  degraded: { label: 'Degradado', variant: 'warning' as const, icon: AlertTriangle },
  maintenance: { label: 'Manutencao', variant: 'info' as const, icon: Clock },
  resolved: { label: 'Resolvido', variant: 'success' as const, icon: CheckCircle },
};

const hourlyPeakData = [
  { name: '00h', latencia: 8, perda: 0.1 },
  { name: '03h', latencia: 5, perda: 0.0 },
  { name: '06h', latencia: 7, perda: 0.2 },
  { name: '09h', latencia: 12, perda: 0.5 },
  { name: '12h', latencia: 18, perda: 0.8 },
  { name: '15h', latencia: 15, perda: 0.6 },
  { name: '18h', latencia: 28, perda: 1.2 },
  { name: '21h', latencia: 35, perda: 1.8 },
  { name: '24h', latencia: 14, perda: 0.4 },
];

const uptimeWeek = [
  { name: 'Seg', uptime: 99.8 },
  { name: 'Ter', uptime: 100 },
  { name: 'Qua', uptime: 97.2 },
  { name: 'Qui', uptime: 99.5 },
  { name: 'Sex', uptime: 100 },
  { name: 'Sab', uptime: 98.9 },
  { name: 'Dom', uptime: 99.1 },
];

export default function Network({ user }: NetworkProps) {
  const [lastRefresh, setLastRefresh] = useState(new Date());

  const onlineCount = clients.filter(c => c.connectionStatus === 'online').length;
  const offlineCount = clients.filter(c => c.connectionStatus === 'offline').length;
  const totalActive = clients.filter(c => c.status === 'active').length;
  const availability = totalActive > 0 ? ((onlineCount / totalActive) * 100).toFixed(1) : '0';

  const offlineClients = clients.filter(c => c.connectionStatus === 'offline' && c.status === 'active');

  function refresh() {
    setLastRefresh(new Date());
  }

  return (
    <div className="flex flex-col h-full">
      <Header title="Monitoramento de Rede" subtitle="Status e consumo em tempo real" user={user} />

      <div className="flex-1 overflow-auto p-6 space-y-6">
        {/* Status Banner */}
        <div className={`rounded-xl p-4 flex items-center justify-between ${onlineCount / totalActive > 0.95 ? 'bg-emerald-50 border border-emerald-200' : 'bg-amber-50 border border-amber-200'}`}>
          <div className="flex items-center gap-3">
            <div className={`w-3 h-3 rounded-full animate-pulse ${onlineCount / totalActive > 0.95 ? 'bg-emerald-500' : 'bg-amber-500'}`} />
            <div>
              <p className={`font-semibold ${onlineCount / totalActive > 0.95 ? 'text-emerald-800' : 'text-amber-800'}`}>
                {onlineCount / totalActive > 0.95 ? 'Rede Operacional' : 'Atencao: Rede com Instabilidades'}
              </p>
              <p className={`text-xs ${onlineCount / totalActive > 0.95 ? 'text-emerald-600' : 'text-amber-600'}`}>
                Ultima atualizacao: {lastRefresh.toLocaleTimeString('pt-BR')}
              </p>
            </div>
          </div>
          <button
            onClick={refresh}
            className="flex items-center gap-1.5 text-sm font-medium text-gray-600 hover:text-gray-900 bg-white border border-gray-200 px-3 py-1.5 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <RefreshCw size={14} /> Atualizar
          </button>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
              <p className="text-sm text-gray-500">Online</p>
            </div>
            <p className="text-3xl font-bold text-emerald-600">{onlineCount}</p>
            <p className="text-xs text-gray-400 mt-1">{availability}% disponibilidade</p>
          </div>
          <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 bg-red-400 rounded-full" />
              <p className="text-sm text-gray-500">Offline</p>
            </div>
            <p className="text-3xl font-bold text-red-500">{offlineCount}</p>
            <p className="text-xs text-gray-400 mt-1">Clientes sem conexao</p>
          </div>
          <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
            <div className="flex items-center gap-2 mb-2">
              <Activity size={14} className="text-blue-500" />
              <p className="text-sm text-gray-500">Latencia Media</p>
            </div>
            <p className="text-3xl font-bold text-blue-600">28ms</p>
            <p className="text-xs text-gray-400 mt-1">Hora de pico</p>
          </div>
          <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
            <div className="flex items-center gap-2 mb-2">
              <Wifi size={14} className="text-purple-500" />
              <p className="text-sm text-gray-500">Uptime (7 dias)</p>
            </div>
            <p className="text-3xl font-bold text-purple-600">99.2%</p>
            <p className="text-xs text-gray-400 mt-1">SLA: 99.0%</p>
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Bandwidth Usage */}
          <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
            <h3 className="font-semibold text-gray-900 mb-1">Consumo de Banda</h3>
            <p className="text-xs text-gray-500 mb-4">Hoje - Download e Upload (Mbps)</p>
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={networkUsageData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip formatter={(v: number) => [`${v} Mbps`, '']} />
                <Legend />
                <Area type="monotone" dataKey="download" name="Download" stroke="#3b82f6" fill="#dbeafe" strokeWidth={2} />
                <Area type="monotone" dataKey="upload" name="Upload" stroke="#10b981" fill="#d1fae5" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Latency & Packet Loss */}
          <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
            <h3 className="font-semibold text-gray-900 mb-1">Latencia e Perda de Pacotes</h3>
            <p className="text-xs text-gray-500 mb-4">Hoje (ms / %)</p>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={hourlyPeakData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                <YAxis yAxisId="left" tick={{ fontSize: 11 }} />
                <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 11 }} />
                <Tooltip />
                <Legend />
                <Line yAxisId="left" type="monotone" dataKey="latencia" name="Latencia (ms)" stroke="#8b5cf6" strokeWidth={2} dot={false} />
                <Line yAxisId="right" type="monotone" dataKey="perda" name="Perda (%)" stroke="#ef4444" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Uptime Week */}
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <h3 className="font-semibold text-gray-900 mb-1">Uptime Semanal (%)</h3>
          <p className="text-xs text-gray-500 mb-4">Disponibilidade da rede por dia</p>
          <ResponsiveContainer width="100%" height={120}>
            <AreaChart data={uptimeWeek}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="name" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} domain={[95, 100]} />
              <Tooltip formatter={(v: number) => [`${v}%`, 'Uptime']} />
              <Area type="monotone" dataKey="uptime" stroke="#10b981" fill="#d1fae5" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Offline Clients */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
              <h3 className="font-semibold text-gray-900">Clientes Offline</h3>
              <Badge label={`${offlineClients.length} offline`} variant={offlineClients.length > 0 ? 'danger' : 'success'} dot />
            </div>
            <div className="divide-y divide-gray-50">
              {offlineClients.length === 0 ? (
                <div className="py-8 text-center">
                  <CheckCircle size={28} className="mx-auto text-emerald-400 mb-2" />
                  <p className="text-sm text-gray-500">Todos os clientes ativos estao online</p>
                </div>
              ) : offlineClients.map(c => (
                <div key={c.id} className="px-5 py-3 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{c.name}</p>
                    <p className="text-xs text-gray-500">{c.planName} · IP: {c.ip || '—'}</p>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <WifiOff size={14} className="text-red-400" />
                    <span className="text-xs text-red-500 font-medium">Offline</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Network Events */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
              <h3 className="font-semibold text-gray-900">Historico de Eventos</h3>
            </div>
            <div className="divide-y divide-gray-50">
              {networkEvents.map(event => {
                const cfg = eventTypeConfig[event.type];
                const Icon = cfg.icon;
                return (
                  <div key={event.id} className="px-5 py-3">
                    <div className="flex items-start justify-between gap-3 mb-1">
                      <div className="flex items-center gap-2">
                        <Icon size={14} className={
                          event.type === 'outage' ? 'text-red-500' :
                          event.type === 'degraded' ? 'text-amber-500' :
                          event.type === 'maintenance' ? 'text-blue-500' : 'text-emerald-500'
                        } />
                        <p className="text-sm font-medium text-gray-900">{event.description}</p>
                      </div>
                      <Badge label={cfg.label} variant={cfg.variant} />
                    </div>
                    <div className="flex gap-3 text-xs text-gray-500 ml-5">
                      <span>{event.region}</span>
                      {event.affectedClients > 0 && <span>· {event.affectedClients} clientes afetados</span>}
                      <span>· {new Date(event.startTime).toLocaleDateString('pt-BR')}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
