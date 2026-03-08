import { useState } from 'react';
import { Search, Plus, X, Filter, MessageSquare, Clock, AlertTriangle, CheckCircle } from 'lucide-react';
import Header from '../components/Header';
import Badge from '../components/Badge';
import { tickets as initialTickets, clients } from '../data/mockData';
import type { Ticket, TicketStatus, TicketPriority, TicketCategory } from '../types';

interface TicketsProps {
  user: { name: string; role: string };
}

const statusConfig: Record<TicketStatus, { label: string; variant: 'info' | 'warning' | 'success' | 'neutral' }> = {
  open: { label: 'Aberto', variant: 'info' },
  in_progress: { label: 'Em Andamento', variant: 'warning' },
  resolved: { label: 'Resolvido', variant: 'success' },
  closed: { label: 'Fechado', variant: 'neutral' },
};

const priorityConfig: Record<TicketPriority, { label: string; variant: 'danger' | 'warning' | 'info' | 'neutral' }> = {
  critical: { label: 'Critico', variant: 'danger' },
  high: { label: 'Alto', variant: 'warning' },
  medium: { label: 'Medio', variant: 'info' },
  low: { label: 'Baixo', variant: 'neutral' },
};

const categoryConfig: Record<TicketCategory, string> = {
  connection: 'Conexao',
  billing: 'Financeiro',
  equipment: 'Equipamento',
  other: 'Outro',
};

const emptyTicket: Omit<Ticket, 'id' | 'createdAt' | 'updatedAt'> = {
  clientId: 'c1',
  clientName: 'Joao Carlos Silva',
  subject: '',
  description: '',
  status: 'open',
  priority: 'medium',
  category: 'connection',
};

export default function Tickets({ user }: TicketsProps) {
  const [tickets, setTickets] = useState<Ticket[]>(initialTickets);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState<TicketStatus | 'all'>('all');
  const [filterPriority, setFilterPriority] = useState<TicketPriority | 'all'>('all');
  const [selected, setSelected] = useState<Ticket | null>(null);
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState<Omit<Ticket, 'id' | 'createdAt' | 'updatedAt'>>(emptyTicket);

  const filtered = tickets.filter(t => {
    const matchSearch = t.subject.toLowerCase().includes(search.toLowerCase()) ||
      t.clientName.toLowerCase().includes(search.toLowerCase()) ||
      t.id.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === 'all' || t.status === filterStatus;
    const matchPriority = filterPriority === 'all' || t.priority === filterPriority;
    return matchSearch && matchStatus && matchPriority;
  });

  const openCount = tickets.filter(t => t.status === 'open').length;
  const inProgressCount = tickets.filter(t => t.status === 'in_progress').length;
  const resolvedCount = tickets.filter(t => t.status === 'resolved' || t.status === 'closed').length;
  const criticalCount = tickets.filter(t => t.priority === 'critical' && (t.status === 'open' || t.status === 'in_progress')).length;

  function handleAddTicket() {
    const now = new Date().toISOString();
    const client = clients.find(c => c.id === form.clientId);
    const newTicket: Ticket = {
      ...form,
      clientName: client?.name ?? form.clientName,
      id: `t${Date.now()}`,
      createdAt: now,
      updatedAt: now,
    };
    setTickets(prev => [newTicket, ...prev]);
    setShowAdd(false);
    setForm({ ...emptyTicket });
  }

  function updateStatus(ticket: Ticket, status: TicketStatus) {
    const updated = { ...ticket, status, updatedAt: new Date().toISOString() };
    setTickets(prev => prev.map(t => t.id === ticket.id ? updated : t));
    setSelected(updated);
  }

  const priorityOrder: Record<TicketPriority, number> = { critical: 0, high: 1, medium: 2, low: 3 };

  const sortedFiltered = [...filtered].sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);

  return (
    <div className="flex flex-col h-full">
      <Header title="Chamados" subtitle="Gestao de suporte e ocorrencias" user={user} />

      <div className="flex-1 overflow-auto p-6 space-y-4">
        {/* Summary */}
        <div className="grid grid-cols-4 gap-4">
          {[
            { label: 'Abertos', value: openCount, color: 'text-blue-600', bg: 'bg-blue-50', icon: MessageSquare },
            { label: 'Em Andamento', value: inProgressCount, color: 'text-amber-600', bg: 'bg-amber-50', icon: Clock },
            { label: 'Resolvidos', value: resolvedCount, color: 'text-emerald-600', bg: 'bg-emerald-50', icon: CheckCircle },
            { label: 'Criticos Abertos', value: criticalCount, color: 'text-red-600', bg: 'bg-red-50', icon: AlertTriangle },
          ].map(item => (
            <div key={item.label} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 flex items-center gap-3">
              <div className={`p-2.5 rounded-lg ${item.bg}`}>
                <item.icon size={18} className={item.color} />
              </div>
              <div>
                <p className="text-xl font-bold text-gray-900">{item.value}</p>
                <p className="text-xs text-gray-500">{item.label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Toolbar */}
        <div className="flex flex-wrap gap-3 items-center justify-between">
          <div className="flex gap-3 flex-wrap items-center">
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar chamado..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-60"
              />
            </div>
            <div className="flex items-center gap-1 border border-gray-200 rounded-lg p-1 bg-white">
              <Filter size={14} className="text-gray-400 ml-1" />
              {(['all', 'open', 'in_progress', 'resolved', 'closed'] as const).map(s => (
                <button
                  key={s}
                  onClick={() => setFilterStatus(s)}
                  className={`px-2.5 py-1 text-xs rounded-md font-medium transition-colors ${
                    filterStatus === s ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  {s === 'all' ? 'Todos' : statusConfig[s].label}
                </button>
              ))}
            </div>
            <select
              value={filterPriority}
              onChange={e => setFilterPriority(e.target.value as TicketPriority | 'all')}
              className="border border-gray-200 rounded-lg px-3 py-2 text-xs text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            >
              <option value="all">Todas prioridades</option>
              <option value="critical">Critico</option>
              <option value="high">Alto</option>
              <option value="medium">Medio</option>
              <option value="low">Baixo</option>
            </select>
          </div>
          <button
            onClick={() => setShowAdd(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus size={16} />
            Novo Chamado
          </button>
        </div>

        {/* Tickets Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="text-left px-5 py-3 font-semibold text-gray-600">ID</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600">Assunto</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600">Cliente</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600 hidden md:table-cell">Categoria</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600">Prioridade</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600">Status</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600 hidden lg:table-cell">Abertura</th>
                  <th className="text-right px-5 py-3 font-semibold text-gray-600">Acoes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {sortedFiltered.map(ticket => (
                  <tr
                    key={ticket.id}
                    className={`hover:bg-gray-50 transition-colors ${ticket.priority === 'critical' ? 'border-l-2 border-l-red-400' : ''}`}
                  >
                    <td className="px-5 py-4 font-mono text-xs text-gray-500">#{ticket.id.toUpperCase()}</td>
                    <td className="px-4 py-4">
                      <p className="font-medium text-gray-900 max-w-xs truncate">{ticket.subject}</p>
                    </td>
                    <td className="px-4 py-4 text-gray-600">{ticket.clientName}</td>
                    <td className="px-4 py-4 hidden md:table-cell">
                      <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                        {categoryConfig[ticket.category]}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <Badge label={priorityConfig[ticket.priority].label} variant={priorityConfig[ticket.priority].variant} dot />
                    </td>
                    <td className="px-4 py-4">
                      <Badge label={statusConfig[ticket.status].label} variant={statusConfig[ticket.status].variant} />
                    </td>
                    <td className="px-4 py-4 text-xs text-gray-500 hidden lg:table-cell">
                      {new Date(ticket.createdAt).toLocaleDateString('pt-BR')}
                    </td>
                    <td className="px-5 py-4 text-right">
                      <button
                        onClick={() => setSelected(ticket)}
                        className="text-xs px-3 py-1.5 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors font-medium"
                      >
                        Abrir
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {sortedFiltered.length === 0 && (
              <div className="py-12 text-center text-gray-400">
                <MessageSquare size={32} className="mx-auto mb-2" />
                <p>Nenhum chamado encontrado</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Ticket Detail Modal */}
      {selected && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-100 sticky top-0 bg-white">
              <div>
                <h2 className="text-lg font-bold text-gray-900">{selected.subject}</h2>
                <p className="text-xs text-gray-500">#{selected.id.toUpperCase()}</p>
              </div>
              <button onClick={() => setSelected(null)} className="p-1 hover:bg-gray-100 rounded-lg"><X size={20} /></button>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex gap-2 flex-wrap">
                <Badge label={priorityConfig[selected.priority].label} variant={priorityConfig[selected.priority].variant} dot />
                <Badge label={statusConfig[selected.status].label} variant={statusConfig[selected.status].variant} />
                <span className="text-xs bg-gray-100 text-gray-600 px-2.5 py-0.5 rounded-full">{categoryConfig[selected.category]}</span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-xs text-gray-500 mb-0.5">Cliente</p>
                  <p className="font-medium text-gray-800 text-sm">{selected.clientName}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-xs text-gray-500 mb-0.5">Abertura</p>
                  <p className="font-medium text-gray-800 text-sm">{new Date(selected.createdAt).toLocaleString('pt-BR')}</p>
                </div>
              </div>

              <div>
                <p className="text-sm font-medium text-gray-700 mb-2">Descricao</p>
                <div className="bg-gray-50 rounded-lg p-4 text-sm text-gray-700 leading-relaxed">
                  {selected.description}
                </div>
              </div>

              {/* Status Actions */}
              <div>
                <p className="text-sm font-medium text-gray-700 mb-2">Alterar Status</p>
                <div className="flex gap-2 flex-wrap">
                  {(['open', 'in_progress', 'resolved', 'closed'] as TicketStatus[]).map(s => (
                    <button
                      key={s}
                      onClick={() => updateStatus(selected, s)}
                      disabled={selected.status === s}
                      className={`px-3 py-1.5 text-xs rounded-lg font-medium transition-colors ${
                        selected.status === s
                          ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                          : 'bg-blue-50 text-blue-700 hover:bg-blue-100'
                      }`}
                    >
                      {statusConfig[s].label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* New Ticket Modal */}
      {showAdd && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-100 sticky top-0 bg-white">
              <h2 className="text-lg font-bold text-gray-900">Abrir Chamado</h2>
              <button onClick={() => setShowAdd(false)} className="p-1 hover:bg-gray-100 rounded-lg"><X size={20} /></button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Cliente</label>
                <select
                  value={form.clientId}
                  onChange={e => {
                    const client = clients.find(c => c.id === e.target.value);
                    setForm(p => ({ ...p, clientId: e.target.value, clientName: client?.name ?? '' }));
                  }}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {clients.filter(c => c.status !== 'cancelled').map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Assunto</label>
                <input
                  type="text"
                  value={form.subject}
                  onChange={e => setForm(p => ({ ...p, subject: e.target.value }))}
                  placeholder="Descreva o problema em poucas palavras"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Descricao Detalhada</label>
                <textarea
                  value={form.description}
                  onChange={e => setForm(p => ({ ...p, description: e.target.value }))}
                  rows={3}
                  placeholder="Descreva o problema com detalhes..."
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Categoria</label>
                  <select
                    value={form.category}
                    onChange={e => setForm(p => ({ ...p, category: e.target.value as TicketCategory }))}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="connection">Conexao</option>
                    <option value="billing">Financeiro</option>
                    <option value="equipment">Equipamento</option>
                    <option value="other">Outro</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Prioridade</label>
                  <select
                    value={form.priority}
                    onChange={e => setForm(p => ({ ...p, priority: e.target.value as TicketPriority }))}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="low">Baixa</option>
                    <option value="medium">Media</option>
                    <option value="high">Alta</option>
                    <option value="critical">Critica</option>
                  </select>
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <button onClick={() => setShowAdd(false)} className="flex-1 border border-gray-200 text-gray-700 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors">
                  Cancelar
                </button>
                <button
                  onClick={handleAddTicket}
                  disabled={!form.subject.trim()}
                  className="flex-1 bg-blue-600 text-white py-2.5 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Abrir Chamado
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
