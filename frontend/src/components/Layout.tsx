import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';

interface LayoutProps {
  user: { name: string; role: string };
  onLogout: () => void;
}

export default function Layout({ user: _user, onLogout }: LayoutProps) {
  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <Sidebar onLogout={onLogout} />
      <main className="flex-1 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
}
