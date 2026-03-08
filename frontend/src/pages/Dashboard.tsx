import {
  Users, Wifi, DollarSign, AlertTriangle, TrendingUp,
  CheckCircle, Clock, XCircle, Activity
} from 'lucide-react';
import {
  LineChart, Line, AreaChart, Area, BarChart, Bar,
  PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import Header from '../components/Header';
import StatCard from '../components/StatCard';
import Badge from '../components/Badge';
import {
  clients, invoices, tickets, revenueData,
  clientGrowthData, networkUsageData, planDistributionData, PLAN_COLORS
} from '../data/mockData';

interface DashboardProps {
  user: { name: string; role: string };
}

export default function Dashboard({ user }: DashboardProps) {
  const activeClients = clients.filter(c => c.status === 'active').length;
  const onlineClients = clients.filter(c => c.connectionStatus === 'online').length;
  const totalClients = clients.length;
  const pendingInvoices = invoices.filter(i => i.status === 'pending').length;
  const overdueInvoices = invoices.filter(i => i.status === 'overdue').length;
  const totalRevenue = invoices.filter(i => i.status === 'paid').reduce((s, i) => s + i.amount, 0);
  const openTickets = tickets.filter(t => t.status === 'open' || t.status === 'in_progress').length;
  const criticalTickets = tickets.filter(t => t.priority === 'critical').length;

  const recentTickets = tickets
    .filter(t => t.status === 'open' || t.status === 'in_progress')
    .slice(0, 5);

  const recentInvoices = invoices.slice(0, 5);

  const priorityBadge: Record<string, { label: string; variant: 'danger' | 'warning' | 'info' | 'neutral' }> = {
    critical: { label: 'Critico', variant: 'danger' },
    high: { label: 'Alto', variant: 'warning' },
    medium: { label: 'Medio', variant: 'info' },
    low: { label: 'Baixo', variant: 'neutral' },
  };

  const invoiceStatusBadge: Record<string, { label: string; variant: 'success' | 'warning' | 'danger' }> = {
    paid: { label: 'Pago', variant: 'success' },
    pending: { label: 'Pendente', variant: 'warning' },
    overdue: { label: 'Vencido', variant: 'danger' },
  };

  return (
    <div className="flex flex-col h-full">
      <Header
        title="Dashboard"
        subtitle="Visao geral do sistema"
        user={user}
      />
      <div className="flex-1 overflow-auto p-6 space-y-6">
        {/* KPI Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Clientes Ativos"
            value={activeClients}
            icon={Users}
            change="+12 este mes"
            changeType="positive"
            color="blue"
            subtitle={`${totalClients} total`}
          />
          <StatCard
            title="Online Agora"
            value={onlineClients}
            icon={Wifi}
            change={`${Math.round((onlineClients / activeClients) * 100)}% disponibilidade`}
            changeType="positive"
            color="green"
            subtitle={`${activeClients - onlineClients} offline`}
          />
          <StatCard
            title="Receita (Dez)"
            value={`R$ ${totalRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}
            icon={DollarSign}
            change={`${pendingInvoices + overdueInvoices} a receber`}
            changeType={overdueInvoices > 0 ? 'negative' : 'neutral'}
            color="yellow"
            subtitle={`${overdueInvoices} vencidas`}
          />
          <StatCard
            title="Chamados Abertos"
            value={openTickets}
            icon={AlertTriangle}
            change={criticalTickets > 0 ? `${criticalTickets} critico(s)` : 'Sem criticos'}
            changeType={criticalTickets > 0 ? 'negative' : 'positive'}
            color="red"
            subtitle="Aguardando atendimento"
          />
        </div>

        {/* Charts Row 1 */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Revenue Chart */}
          <div className="lg:col-span-2 bg-white rounded-xl p-5 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-semibold text-gray-900">Receita vs Despesas</h3>
                <p className="text-xs text-gray-500">Ultimos 6 meses (R$)</p>
              </div>
              <TrendingUp size={18} className="text-emerald-500" />
            </div>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} />
                <Tooltip formatter={(v: number) => [`R$ ${v.toLocaleString('pt-BR')}`, '']} />
                <Legend />
                <Bar dataKey="receita" name="Receita" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                <Bar dataKey="despesas" name="Despesas" fill="#ef4444" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Plan Distribution */}
          <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
            <h3 className="font-semibold text-gray-900 mb-1">Distribuicao de Planos</h3>
            <p className="text-xs text-gray-500 mb-4">Por numero de clientes</p>
            <ResponsiveContainer width="100%" height={180}>
              <PieChart>
                <Pie
                  data={planDistributionData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {planDistributionData.map((_, index) => (
                    <Cell key={index} fill={PLAN_COLORS[index % PLAN_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-1.5 mt-2">
              {planDistributionData.slice(0, 3).map((item, i) => (
                <div key={item.name} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: PLAN_COLORS[i] }} />
                    <span className="text-gray-600">{item.name}</span>
                  </div>
                  <span className="font-medium text-gray-800">{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Charts Row 2 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Client Growth */}
          <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-semibold text-gray-900">Crescimento de Clientes</h3>
                <p className="text-xs text-gray-500">Total acumulado</p>
              </div>
              <Users size={18} className="text-blue-500" />
            </div>
            <ResponsiveContainer width="100%" height={180}>
              <AreaChart data={clientGrowthData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} domain={[600, 900]} />
                <Tooltip />
                <Area type="monotone" dataKey="clientes" name="Clientes" stroke="#3b82f6" fill="#dbeafe" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Network Usage */}
          <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-semibold text-gray-900">Consumo de Rede (Hoje)</h3>
                <p className="text-xs text-gray-500">Download e Upload em Mbps</p>
              </div>
              <Activity size={18} className="text-emerald-500" />
            </div>
            <ResponsiveContainer width="100%" height={180}>
              <LineChart data={networkUsageData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip formatter={(v: number) => [`${v} Mbps`, '']} />
                <Legend />
                <Line type="monotone" dataKey="download" name="Download" stroke="#3b82f6" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="upload" name="Upload" stroke="#10b981" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Tables Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Recent Tickets */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
              <h3 className="font-semibold text-gray-900">Chamados em Aberto</h3>
              <span className="text-xs bg-red-50 text-red-600 font-medium px-2 py-0.5 rounded-full">{openTickets}</span>
            </div>
            <div className="divide-y divide-gray-50">
              {recentTickets.map(ticket => {
                const p = priorityBadge[ticket.priority];
                return (
                  <div key={ticket.id} className="px-5 py-3 flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">{ticket.subject}</p>
                      <p className="text-xs text-gray-500">{ticket.clientName}</p>
                    </div>
                    <Badge label={p.label} variant={p.variant} dot />
                  </div>
                );
              })}
              {recentTickets.length === 0 && (
                <div className="px-5 py-8 text-center">
                  <CheckCircle size={32} className="mx-auto text-emerald-400 mb-2" />
                  <p className="text-sm text-gray-500">Nenhum chamado aberto</p>
                </div>
              )}
            </div>
          </div>

          {/* Recent Invoices */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
              <h3 className="font-semibold text-gray-900">Faturas Recentes</h3>
              <div className="flex gap-2">
                <span className="text-xs bg-amber-50 text-amber-600 font-medium px-2 py-0.5 rounded-full">{pendingInvoices} pendentes</span>
                {overdueInvoices > 0 && <span className="text-xs bg-red-50 text-red-600 font-medium px-2 py-0.5 rounded-full">{overdueInvoices} vencidas</span>}
              </div>
            </div>
            <div className="divide-y divide-gray-50">
              {recentInvoices.map(inv => {
                const s = invoiceStatusBadge[inv.status];
                return (
                  <div key={inv.id} className="px-5 py-3 flex items-center justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">{inv.clientName}</p>
                      <p className="text-xs text-gray-500">Vence: {new Date(inv.dueDate).toLocaleDateString('pt-BR')}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-gray-900">R$ {inv.amount.toFixed(2)}</p>
                      <Badge label={s.label} variant={s.variant} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Status Summary */}
        <div className="grid grid-cols-3 gap-4">
          {[
            { icon: CheckCircle, label: 'Clientes Pagando em Dia', value: `${invoices.filter(i => i.status === 'paid').length}`, color: 'text-emerald-500', bg: 'bg-emerald-50' },
            { icon: Clock, label: 'Aguardando Pagamento', value: `${pendingInvoices}`, color: 'text-amber-500', bg: 'bg-amber-50' },
            { icon: XCircle, label: 'Faturas Vencidas', value: `${overdueInvoices}`, color: 'text-red-500', bg: 'bg-red-50' },
          ].map(item => (
            <div key={item.label} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 flex items-center gap-4">
              <div className={`p-2.5 rounded-lg ${item.bg}`}>
                <item.icon size={20} className={item.color} />
              </div>
              <div>
                <p className="text-xl font-bold text-gray-900">{item.value}</p>
                <p className="text-xs text-gray-500">{item.label}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
