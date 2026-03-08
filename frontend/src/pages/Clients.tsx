import { useState } from 'react';
import { Search, Plus, Eye, Edit2, Pause, Play, X, Wifi, WifiOff, Filter } from 'lucide-react';
import Header from '../components/Header';
import Badge from '../components/Badge';
import { clients as initialClients } from '../data/mockData';
import type { Client, ClientStatus } from '../types';

interface ClientsProps {
  user: { name: string; role: string };
}

const statusConfig: Record<ClientStatus, { label: string; variant: 'success' | 'warning' | 'danger' }> = {
  active: { label: 'Ativo', variant: 'success' },
  suspended: { label: 'Suspenso', variant: 'warning' },
  cancelled: { label: 'Cancelado', variant: 'danger' },
};

type ModalType = 'view' | 'add' | 'edit' | null;

const emptyClient: Omit<Client, 'id'> = {
  name: '', cpf: '', email: '', phone: '', address: '', city: '',
  planId: 'p2', planName: 'Essencial 100MB', status: 'active',
  connectionStatus: 'offline', joinDate: new Date().toISOString().split('T')[0],
  ip: '', downloadUsage: 0, uploadUsage: 0, mac: '',
};

export default function Clients({ user }: ClientsProps) {
  const [clients, setClients] = useState<Client[]>(initialClients);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState<ClientStatus | 'all'>('all');
  const [modal, setModal] = useState<ModalType>(null);
  const [selected, setSelected] = useState<Client | null>(null);
  const [form, setForm] = useState<Omit<Client, 'id'>>(emptyClient);

  const filtered = clients.filter(c => {
    const matchSearch = c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.cpf.includes(search) || c.email.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === 'all' || c.status === filterStatus;
    return matchSearch && matchStatus;
  });

  function openView(client: Client) {
    setSelected(client);
    setModal('view');
  }

  function openEdit(client: Client) {
    setSelected(client);
    setForm({ ...client });
    setModal('edit');
  }

  function openAdd() {
    setForm({ ...emptyClient });
    setSelected(null);
    setModal('add');
  }

  function closeModal() {
    setModal(null);
    setSelected(null);
  }

  function handleSave() {
    if (modal === 'add') {
      const newClient: Client = { ...form, id: `c${Date.now()}` };
      setClients(prev => [newClient, ...prev]);
    } else if (modal === 'edit' && selected) {
      setClients(prev => prev.map(c => c.id === selected.id ? { ...form, id: selected.id } : c));
    }
    closeModal();
  }

  function toggleStatus(client: Client) {
    setClients(prev => prev.map(c => {
      if (c.id !== client.id) return c;
      const newStatus: ClientStatus = c.status === 'active' ? 'suspended' : 'active';
      return { ...c, status: newStatus, connectionStatus: newStatus === 'suspended' ? 'offline' : c.connectionStatus };
    }));
  }

  return (
    <div className="flex flex-col h-full">
      <Header title="Clientes" subtitle="Gestao de assinantes" user={user} />

      <div className="flex-1 overflow-auto p-6 space-y-4">
        {/* Toolbar */}
        <div className="flex flex-wrap gap-3 items-center justify-between">
          <div className="flex gap-3 flex-wrap">
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar por nome, CPF ou email..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-72"
              />
            </div>
            <div className="flex items-center gap-1 border border-gray-200 rounded-lg p-1 bg-white">
              <Filter size={14} className="text-gray-400 ml-1" />
              {(['all', 'active', 'suspended', 'cancelled'] as const).map(s => (
                <button
                  key={s}
                  onClick={() => setFilterStatus(s)}
                  className={`px-3 py-1 text-xs rounded-md font-medium transition-colors ${
                    filterStatus === s ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  {s === 'all' ? 'Todos' : statusConfig[s].label}
                </button>
              ))}
            </div>
          </div>
          <button
            onClick={openAdd}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus size={16} />
            Novo Cliente
          </button>
        </div>

        {/* Summary */}
        <div className="flex gap-3 text-sm text-gray-500">
          <span>{filtered.length} cliente(s) encontrado(s)</span>
          <span>•</span>
          <span className="text-emerald-600 font-medium">{clients.filter(c => c.status === 'active').length} ativos</span>
          <span>•</span>
          <span className="text-amber-600 font-medium">{clients.filter(c => c.status === 'suspended').length} suspensos</span>
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="text-left px-5 py-3 font-semibold text-gray-600">Cliente</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600 hidden md:table-cell">Plano</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600">Status</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600 hidden lg:table-cell">Conexao</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600 hidden xl:table-cell">IP</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600 hidden xl:table-cell">Uso (Mes)</th>
                  <th className="text-right px-5 py-3 font-semibold text-gray-600">Acoes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map(client => (
                  <tr key={client.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-4">
                      <p className="font-medium text-gray-900">{client.name}</p>
                      <p className="text-xs text-gray-500">{client.cpf} · {client.phone}</p>
                    </td>
                    <td className="px-4 py-4 hidden md:table-cell">
                      <span className="text-gray-700">{client.planName}</span>
                    </td>
                    <td className="px-4 py-4">
                      <Badge
                        label={statusConfig[client.status].label}
                        variant={statusConfig[client.status].variant}
                        dot
                      />
                    </td>
                    <td className="px-4 py-4 hidden lg:table-cell">
                      <div className="flex items-center gap-1.5">
                        {client.connectionStatus === 'online' ? (
                          <><Wifi size={14} className="text-emerald-500" /><span className="text-emerald-600 text-xs font-medium">Online</span></>
                        ) : (
                          <><WifiOff size={14} className="text-gray-400" /><span className="text-gray-400 text-xs">Offline</span></>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-4 hidden xl:table-cell text-gray-600 text-xs font-mono">
                      {client.ip || '—'}
                    </td>
                    <td className="px-4 py-4 hidden xl:table-cell">
                      {client.downloadUsage > 0 ? (
                        <div className="text-xs text-gray-600">
                          <span>↓ {client.downloadUsage.toFixed(1)} GB</span>
                          <span className="mx-1 text-gray-300">|</span>
                          <span>↑ {client.uploadUsage.toFixed(1)} GB</span>
                        </div>
                      ) : <span className="text-gray-400 text-xs">—</span>}
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => openView(client)}
                          className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Visualizar"
                        >
                          <Eye size={15} />
                        </button>
                        <button
                          onClick={() => openEdit(client)}
                          className="p-1.5 text-gray-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
                          title="Editar"
                        >
                          <Edit2 size={15} />
                        </button>
                        {client.status !== 'cancelled' && (
                          <button
                            onClick={() => toggleStatus(client)}
                            className={`p-1.5 rounded-lg transition-colors ${
                              client.status === 'active'
                                ? 'text-gray-400 hover:text-amber-600 hover:bg-amber-50'
                                : 'text-gray-400 hover:text-emerald-600 hover:bg-emerald-50'
                            }`}
                            title={client.status === 'active' ? 'Suspender' : 'Reativar'}
                          >
                            {client.status === 'active' ? <Pause size={15} /> : <Play size={15} />}
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
                <Search size={32} className="mx-auto mb-2" />
                <p>Nenhum cliente encontrado</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal View */}
      {modal === 'view' && selected && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h2 className="text-lg font-bold text-gray-900">Detalhes do Cliente</h2>
              <button onClick={closeModal} className="p-1 hover:bg-gray-100 rounded-lg"><X size={20} /></button>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-lg text-gray-900">{selected.name}</h3>
                  <p className="text-gray-500 text-sm">{selected.cpf}</p>
                </div>
                <Badge label={statusConfig[selected.status].label} variant={statusConfig[selected.status].variant} dot />
              </div>
              <div className="grid grid-cols-2 gap-3 text-sm">
                {[
                  ['Email', selected.email],
                  ['Telefone', selected.phone],
                  ['Endereco', selected.address],
                  ['Cidade', selected.city],
                  ['Plano', selected.planName],
                  ['IP', selected.ip || '—'],
                  ['MAC', selected.mac || '—'],
                  ['Cliente desde', new Date(selected.joinDate).toLocaleDateString('pt-BR')],
                ].map(([k, v]) => (
                  <div key={k} className="bg-gray-50 rounded-lg p-3">
                    <p className="text-xs text-gray-500 mb-0.5">{k}</p>
                    <p className="font-medium text-gray-800 text-xs break-all">{v}</p>
                  </div>
                ))}
              </div>
              {selected.downloadUsage > 0 && (
                <div className="bg-blue-50 rounded-lg p-3">
                  <p className="text-xs text-blue-600 font-medium mb-1">Consumo do Mes</p>
                  <div className="flex gap-4 text-sm">
                    <span className="text-gray-700">Download: <strong>{selected.downloadUsage.toFixed(1)} GB</strong></span>
                    <span className="text-gray-700">Upload: <strong>{selected.uploadUsage.toFixed(1)} GB</strong></span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Modal Add/Edit */}
      {(modal === 'add' || modal === 'edit') && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-100 sticky top-0 bg-white">
              <h2 className="text-lg font-bold text-gray-900">{modal === 'add' ? 'Novo Cliente' : 'Editar Cliente'}</h2>
              <button onClick={closeModal} className="p-1 hover:bg-gray-100 rounded-lg"><X size={20} /></button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-1 gap-4">
                {[
                  { label: 'Nome Completo', key: 'name', type: 'text' },
                  { label: 'CPF', key: 'cpf', type: 'text' },
                  { label: 'Email', key: 'email', type: 'email' },
                  { label: 'Telefone', key: 'phone', type: 'text' },
                  { label: 'Endereco', key: 'address', type: 'text' },
                  { label: 'Cidade', key: 'city', type: 'text' },
                  { label: 'IP', key: 'ip', type: 'text' },
                  { label: 'MAC Address', key: 'mac', type: 'text' },
                ].map(({ label, key, type }) => (
                  <div key={key}>
                    <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
                    <input
                      type={type}
                      value={(form as Record<string, unknown>)[key] as string}
                      onChange={e => setForm(prev => ({ ...prev, [key]: e.target.value }))}
                      className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                ))}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <select
                    value={form.status}
                    onChange={e => setForm(prev => ({ ...prev, status: e.target.value as ClientStatus }))}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="active">Ativo</option>
                    <option value="suspended">Suspenso</option>
                    <option value="cancelled">Cancelado</option>
                  </select>
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  onClick={closeModal}
                  className="flex-1 border border-gray-200 text-gray-700 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleSave}
                  className="flex-1 bg-blue-600 text-white py-2.5 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                >
                  {modal === 'add' ? 'Cadastrar' : 'Salvar'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
