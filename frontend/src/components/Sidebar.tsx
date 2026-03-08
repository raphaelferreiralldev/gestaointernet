import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard, Users, Wifi, DollarSign, Activity,
  TicketCheck, LogOut, Zap, ChevronLeft, ChevronRight
} from 'lucide-react';
import { useState } from 'react';
import clsx from 'clsx';

const navItems = [
  { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/clientes', icon: Users, label: 'Clientes' },
  { to: '/planos', icon: Wifi, label: 'Planos' },
  { to: '/financeiro', icon: DollarSign, label: 'Financeiro' },
  { to: '/rede', icon: Activity, label: 'Rede' },
  { to: '/chamados', icon: TicketCheck, label: 'Chamados' },
];

export default function Sidebar({ onLogout }: { onLogout: () => void }) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={clsx(
        'flex flex-col bg-gray-900 text-white transition-all duration-300 shrink-0',
        collapsed ? 'w-16' : 'w-64'
      )}
    >
      {/* Logo */}
      <div className={clsx('flex items-center gap-3 px-4 py-5 border-b border-gray-700', collapsed && 'justify-center px-2')}>
        <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-blue-600 shrink-0">
          <Zap size={20} className="text-white" />
        </div>
        {!collapsed && (
          <div>
            <p className="font-bold text-lg leading-tight">GestaoNet</p>
            <p className="text-xs text-gray-400">Sistema ISP</p>
          </div>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 py-4 space-y-1 px-2">
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) =>
              clsx(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                isActive
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-400 hover:bg-gray-800 hover:text-white',
                collapsed && 'justify-center px-0'
              )
            }
            title={collapsed ? label : undefined}
          >
            <Icon size={18} className="shrink-0" />
            {!collapsed && label}
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div className="border-t border-gray-700 p-2 space-y-1">
        <button
          onClick={() => setCollapsed(!collapsed)}
          className={clsx(
            'flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm text-gray-400 hover:bg-gray-800 hover:text-white transition-colors',
            collapsed && 'justify-center px-0'
          )}
        >
          {collapsed ? <ChevronRight size={18} /> : <><ChevronLeft size={18} /><span>Recolher</span></>}
        </button>
        <button
          onClick={onLogout}
          className={clsx(
            'flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm text-red-400 hover:bg-red-900/30 hover:text-red-300 transition-colors',
            collapsed && 'justify-center px-0'
          )}
          title={collapsed ? 'Sair' : undefined}
        >
          <LogOut size={18} className="shrink-0" />
          {!collapsed && 'Sair'}
        </button>
      </div>
    </aside>
  );
}
