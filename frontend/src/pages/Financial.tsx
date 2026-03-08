import { useState } from 'react';
import { Search, DollarSign, TrendingUp, Clock, AlertCircle, CheckCircle, X, Printer, Filter } from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import Header from '../components/Header';
import Badge from '../components/Badge';
import StatCard from '../components/StatCard';
import { invoices as initialInvoices, revenueData } from '../data/mockData';
import type { Invoice, InvoiceStatus } from '../types';

interface FinancialProps {
  user: { name: string; role: string };
}

const statusConfig: Record<InvoiceStatus, { label: string; variant: 'success' | 'warning' | 'danger' }> = {
  paid: { label: 'Pago', variant: 'success' },
  pending: { label: 'Pendente', variant: 'warning' },
  overdue: { label: 'Vencido', variant: 'danger' },
};

export default function Financial({ user }: FinancialProps) {
  const [invoices, setInvoices] = useState<Invoice[]>(initialInvoices);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState<InvoiceStatus | 'all'>('all');
  const [selected, setSelected] = useState<Invoice | null>(null);

  const filtered = invoices.filter(inv => {
    const matchSearch = inv.clientName.toLowerCase().includes(search.toLowerCase()) ||
      inv.id.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === 'all' || inv.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const totalPaid = invoices.filter(i => i.status === 'paid').reduce((s, i) => s + i.amount, 0);
  const totalPending = invoices.filter(i => i.status === 'pending').reduce((s, i) => s + i.amount, 0);
  const totalOverdue = invoices.filter(i => i.status === 'overdue').reduce((s, i) => s + i.amount, 0);

  function markAsPaid(invoice: Invoice) {
    setInvoices(prev => prev.map(i =>
      i.id === invoice.id
        ? { ...i, status: 'paid', paidDate: new Date().toISOString().split('T')[0] }
        : i
    ));
    if (selected?.id === invoice.id) {
      setSelected({ ...invoice, status: 'paid', paidDate: new Date().toISOString().split('T')[0] });
    }
  }

  return (
    <div className="flex flex-col h-full">
      <Header title="Financeiro" subtitle="Controle de faturas e pagamentos" user={user} />

      <div className="flex-1 overflow-auto p-6 space-y-6">
        {/* KPI Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard title="Recebido (Dez)" value={`R$ ${totalPaid.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`} icon={CheckCircle} color="green" change={`${invoices.filter(i => i.status === 'paid').length} faturas`} changeType="positive" />
          <StatCard title="A Receber" value={`R$ ${totalPending.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`} icon={Clock} color="yellow" change={`${invoices.filter(i => i.status === 'pending').length} faturas`} changeType="neutral" />
          <StatCard title="Em Atraso" value={`R$ ${totalOverdue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`} icon={AlertCircle} color="red" change={`${invoices.filter(i => i.status === 'overdue').length} faturas`} changeType="negative" />
          <StatCard title="Total Esperado" value={`R$ ${(totalPaid + totalPending + totalOverdue).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`} icon={DollarSign} color="blue" change={`${invoices.length} faturas`} changeType="neutral" />
        </div>

        {/* Revenue Chart */}
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-semibold text-gray-900">Evolucao Financeira</h3>
              <p className="text-xs text-gray-500">Receita vs Despesas - Ultimos 6 meses</p>
            </div>
            <TrendingUp size={18} className="text-blue-500" />
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} tickFormatter={v => `R$${(v / 1000).toFixed(0)}k`} />
              <Tooltip formatter={(v: number) => [`R$ ${v.toLocaleString('pt-BR')}`, '']} />
              <Legend />
              <Bar dataKey="receita" name="Receita" fill="#10b981" radius={[4, 4, 0, 0]} />
              <Bar dataKey="despesas" name="Despesas" fill="#ef4444" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-3 items-center justify-between">
          <div className="flex gap-3 flex-wrap">
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar por cliente ou ID..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-64"
              />
            </div>
            <div className="flex items-center gap-1 border border-gray-200 rounded-lg p-1 bg-white">
              <Filter size={14} className="text-gray-400 ml-1" />
              {(['all', 'paid', 'pending', 'overdue'] as const).map(s => (
                <button
                  key={s}
                  onClick={() => setFilterStatus(s)}
                  className={`px-3 py-1 text-xs rounded-md font-medium transition-colors ${
                    filterStatus === s ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  {s === 'all' ? 'Todas' : statusConfig[s].label}
                </button>
              ))}
            </div>
          </div>
          <p className="text-sm text-gray-500">{filtered.length} fatura(s)</p>
        </div>

        {/* Invoices Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="text-left px-5 py-3 font-semibold text-gray-600">ID</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600">Cliente</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600 hidden md:table-cell">Descricao</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600 hidden lg:table-cell">Vencimento</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600 hidden lg:table-cell">Pagamento</th>
                  <th className="text-right px-4 py-3 font-semibold text-gray-600">Valor</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600">Status</th>
                  <th className="text-right px-5 py-3 font-semibold text-gray-600">Acoes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map(inv => (
                  <tr key={inv.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-4 font-mono text-xs text-gray-500">#{inv.id.toUpperCase()}</td>
                    <td className="px-4 py-4 font-medium text-gray-900">{inv.clientName}</td>
                    <td className="px-4 py-4 text-gray-600 hidden md:table-cell text-xs">{inv.description}</td>
                    <td className="px-4 py-4 text-gray-600 hidden lg:table-cell">
                      {new Date(inv.dueDate).toLocaleDateString('pt-BR')}
                    </td>
                    <td className="px-4 py-4 text-gray-600 hidden lg:table-cell">
                      {inv.paidDate ? new Date(inv.paidDate).toLocaleDateString('pt-BR') : '—'}
                    </td>
                    <td className="px-4 py-4 text-right font-semibold text-gray-900">
                      R$ {inv.amount.toFixed(2)}
                    </td>
                    <td className="px-4 py-4">
                      <Badge label={statusConfig[inv.status].label} variant={statusConfig[inv.status].variant} dot />
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => setSelected(inv)}
                          className="text-xs px-2.5 py-1.5 border border-gray-200 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                          Ver
                        </button>
                        {inv.status !== 'paid' && (
                          <button
                            onClick={() => markAsPaid(inv)}
                            className="text-xs px-2.5 py-1.5 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
                          >
                            Receber
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filtered.length === 0 && (
              <div className="py-12 text-center text-gray-400">
                <DollarSign size={32} className="mx-auto mb-2" />
                <p>Nenhuma fatura encontrada</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal Invoice Detail */}
      {selected && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h2 className="text-lg font-bold text-gray-900">Fatura #{selected.id.toUpperCase()}</h2>
              <button onClick={() => setSelected(null)} className="p-1 hover:bg-gray-100 rounded-lg">
                <X size={20} />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-xs text-gray-500">Cliente</p>
                  <p className="font-semibold text-gray-900">{selected.clientName}</p>
                </div>
                <Badge label={statusConfig[selected.status].label} variant={statusConfig[selected.status].variant} dot />
              </div>
              <div className="bg-gray-50 rounded-xl p-4 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Descricao</span>
                  <span className="font-medium text-gray-800 text-right max-w-48">{selected.description}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Competencia</span>
                  <span className="font-medium text-gray-800">{selected.month}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Vencimento</span>
                  <span className="font-medium text-gray-800">{new Date(selected.dueDate).toLocaleDateString('pt-BR')}</span>
                </div>
                {selected.paidDate && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Pago em</span>
                    <span className="font-medium text-emerald-700">{new Date(selected.paidDate).toLocaleDateString('pt-BR')}</span>
                  </div>
                )}
                <div className="border-t border-gray-200 pt-3 flex justify-between">
                  <span className="font-semibold text-gray-900">Total</span>
                  <span className="font-bold text-xl text-gray-900">R$ {selected.amount.toFixed(2)}</span>
                </div>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setSelected(null)}
                  className="flex-1 flex items-center justify-center gap-2 border border-gray-200 text-gray-700 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
                >
                  <Printer size={16} /> Imprimir
                </button>
                {selected.status !== 'paid' && (
                  <button
                    onClick={() => { markAsPaid(selected); }}
                    className="flex-1 bg-emerald-600 text-white py-2.5 rounded-lg text-sm font-medium hover:bg-emerald-700 transition-colors"
                  >
                    Registrar Pagamento
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
