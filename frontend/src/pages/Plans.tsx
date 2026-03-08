import { useState } from 'react';
import { Plus, Edit2, ToggleLeft, ToggleRight, Wifi, X, Users, TrendingUp } from 'lucide-react';
import Header from '../components/Header';
import { plans as initialPlans } from '../data/mockData';
import type { Plan, Technology } from '../types';

interface PlansProps {
  user: { name: string; role: string };
}

type ModalType = 'add' | 'edit' | null;

const emptyPlan: Omit<Plan, 'id' | 'clientCount'> = {
  name: '',
  download: 100,
  upload: 50,
  price: 99.90,
  technology: 'Fibra',
  active: true,
};

const techColors: Record<Technology, string> = {
  Fibra: 'bg-blue-50 text-blue-700',
  Radio: 'bg-purple-50 text-purple-700',
  Cabo: 'bg-amber-50 text-amber-700',
};

export default function Plans({ user }: PlansProps) {
  const [plans, setPlans] = useState<Plan[]>(initialPlans);
  const [modal, setModal] = useState<ModalType>(null);
  const [selected, setSelected] = useState<Plan | null>(null);
  const [form, setForm] = useState<Omit<Plan, 'id' | 'clientCount'>>(emptyPlan);

  const totalClients = plans.reduce((s, p) => s + p.clientCount, 0);
  const totalRevenue = plans.reduce((s, p) => s + p.clientCount * p.price, 0);

  function openAdd() {
    setForm({ ...emptyPlan });
    setSelected(null);
    setModal('add');
  }

  function openEdit(plan: Plan) {
    setSelected(plan);
    setForm({ name: plan.name, download: plan.download, upload: plan.upload, price: plan.price, technology: plan.technology, active: plan.active });
    setModal('edit');
  }

  function closeModal() {
    setModal(null);
    setSelected(null);
  }

  function handleSave() {
    if (modal === 'add') {
      const newPlan: Plan = { ...form, id: `p${Date.now()}`, clientCount: 0 };
      setPlans(prev => [...prev, newPlan]);
    } else if (modal === 'edit' && selected) {
      setPlans(prev => prev.map(p => p.id === selected.id ? { ...p, ...form } : p));
    }
    closeModal();
  }

  function toggleActive(plan: Plan) {
    setPlans(prev => prev.map(p => p.id === plan.id ? { ...p, active: !p.active } : p));
  }

  return (
    <div className="flex flex-col h-full">
      <Header title="Planos" subtitle="Gestao de planos de internet" user={user} />

      <div className="flex-1 overflow-auto p-6 space-y-6">
        {/* Summary Cards */}
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
            <p className="text-sm text-gray-500 mb-1">Total de Planos</p>
            <p className="text-2xl font-bold text-gray-900">{plans.filter(p => p.active).length}</p>
            <p className="text-xs text-gray-400">{plans.length} cadastrados</p>
          </div>
          <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
            <p className="text-sm text-gray-500 mb-1">Clientes nos Planos</p>
            <p className="text-2xl font-bold text-gray-900">{totalClients}</p>
            <p className="text-xs text-gray-400">Total de assinantes</p>
          </div>
          <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
            <p className="text-sm text-gray-500 mb-1">Receita Potencial/Mes</p>
            <p className="text-2xl font-bold text-gray-900">R$ {totalRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 0 })}</p>
            <p className="text-xs text-gray-400">Baseado nos assinantes</p>
          </div>
        </div>

        {/* Toolbar */}
        <div className="flex justify-between items-center">
          <h2 className="text-base font-semibold text-gray-800">{plans.length} plano(s) cadastrado(s)</h2>
          <button
            onClick={openAdd}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus size={16} />
            Novo Plano
          </button>
        </div>

        {/* Plans Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {plans.map(plan => {
            const monthlyRevenue = plan.clientCount * plan.price;
            const sharePercent = totalClients > 0 ? Math.round((plan.clientCount / totalClients) * 100) : 0;

            return (
              <div key={plan.id} className={`bg-white rounded-xl shadow-sm border ${plan.active ? 'border-gray-100' : 'border-gray-200 opacity-60'} p-5`}>
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <Wifi size={16} className={plan.active ? 'text-blue-500' : 'text-gray-400'} />
                      <h3 className="font-bold text-gray-900">{plan.name}</h3>
                    </div>
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${techColors[plan.technology]}`}>
                      {plan.technology}
                    </span>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-bold text-blue-600">R$ {plan.price.toFixed(2)}</p>
                    <p className="text-xs text-gray-400">/mes</p>
                  </div>
                </div>

                {/* Speed */}
                <div className="grid grid-cols-2 gap-2 mb-4">
                  <div className="bg-blue-50 rounded-lg p-2.5 text-center">
                    <p className="text-xs text-gray-500 mb-0.5">Download</p>
                    <p className="font-bold text-blue-700">{plan.download >= 1000 ? `${plan.download / 1000}G` : `${plan.download}M`}</p>
                  </div>
                  <div className="bg-emerald-50 rounded-lg p-2.5 text-center">
                    <p className="text-xs text-gray-500 mb-0.5">Upload</p>
                    <p className="font-bold text-emerald-700">{plan.upload >= 1000 ? `${plan.upload / 1000}G` : `${plan.upload}M`}</p>
                  </div>
                </div>

                {/* Stats */}
                <div className="space-y-2 mb-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-1.5 text-gray-600"><Users size={13} /> Clientes</span>
                    <span className="font-semibold text-gray-900">{plan.clientCount} ({sharePercent}%)</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-1.5">
                    <div className="bg-blue-500 h-1.5 rounded-full" style={{ width: `${sharePercent}%` }} />
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-1.5 text-gray-600"><TrendingUp size={13} /> Receita/Mes</span>
                    <span className="font-semibold text-gray-900">R$ {monthlyRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-3 border-t border-gray-100">
                  <button
                    onClick={() => openEdit(plan)}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2 text-sm font-medium text-gray-700 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <Edit2 size={14} /> Editar
                  </button>
                  <button
                    onClick={() => toggleActive(plan)}
                    className={`flex-1 flex items-center justify-center gap-1.5 py-2 text-sm font-medium rounded-lg transition-colors ${
                      plan.active
                        ? 'text-amber-700 border border-amber-200 bg-amber-50 hover:bg-amber-100'
                        : 'text-emerald-700 border border-emerald-200 bg-emerald-50 hover:bg-emerald-100'
                    }`}
                  >
                    {plan.active ? <><ToggleRight size={14} /> Desativar</> : <><ToggleLeft size={14} /> Ativar</>}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Modal */}
      {modal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h2 className="text-lg font-bold text-gray-900">{modal === 'add' ? 'Novo Plano' : 'Editar Plano'}</h2>
              <button onClick={closeModal} className="p-1 hover:bg-gray-100 rounded-lg"><X size={20} /></button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nome do Plano</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                  placeholder="Ex: Ultra 500MB"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Download (Mbps)</label>
                  <input
                    type="number"
                    value={form.download}
                    onChange={e => setForm(p => ({ ...p, download: Number(e.target.value) }))}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Upload (Mbps)</label>
                  <input
                    type="number"
                    value={form.upload}
                    onChange={e => setForm(p => ({ ...p, upload: Number(e.target.value) }))}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Preco (R$)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={form.price}
                    onChange={e => setForm(p => ({ ...p, price: Number(e.target.value) }))}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tecnologia</label>
                  <select
                    value={form.technology}
                    onChange={e => setForm(p => ({ ...p, technology: e.target.value as Technology }))}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Fibra">Fibra</option>
                    <option value="Radio">Radio</option>
                    <option value="Cabo">Cabo</option>
                  </select>
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <button onClick={closeModal} className="flex-1 border border-gray-200 text-gray-700 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors">
                  Cancelar
                </button>
                <button onClick={handleSave} className="flex-1 bg-blue-600 text-white py-2.5 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
                  {modal === 'add' ? 'Criar Plano' : 'Salvar'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
