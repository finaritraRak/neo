// src/components/layout/Layout.tsx
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Menu,
  X,
  Home,
  Settings,
  LogOut,
  AlertCircle,
  BarChart2,
  Users,
  Plus,
  ChevronDown,
  Globe,
  ClipboardList,
  MessageCircle
} from 'lucide-react';
import { useStore } from '../../store/useStore';
import ChatModal from '../chat/ChatModal';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);       // ← état du modal IA
  const location = useLocation();
  const businessProfile = useStore((state) => state.businessProfile);

  const isActive = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(`${path}/`);
  };

  return (
    <div className="flex h-screen bg-gray-100 relative">
      {/* ===== SIDEBAR ===== */}
      <aside
        className={`
          fixed top-0 left-0 z-40 h-screen w-64 bg-[#131635] shadow-lg
          transform transition-transform duration-300 ease-in-out
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          md:relative md:translate-x-0
        `}
      >
        <div className="flex h-16 items-center justify-between border-b border-gray-700 px-4">
          <Link to="/" className="flex items-center space-x-2 text-white" onClick={() => setSidebarOpen(false)}>
            <img src="/images/neo logo.png" alt="Neo Logo" className="h-10 w-auto object-contain" />
          </Link>
          <button className="md:hidden p-1 text-gray-400 hover:bg-gray-700 rounded" onClick={() => setSidebarOpen(false)}>
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="mt-4 space-y-1 px-2">
          <SidebarLink to="/" icon={Home} label="Tableau de bord" active={isActive('/')} onClick={() => setSidebarOpen(false)} />
          <SidebarLink to="/sites" icon={Globe} label="Sites & Installations" active={isActive('/sites')} onClick={() => setSidebarOpen(false)} />
          <SidebarLink to="/alertes" icon={AlertCircle} label="Alertes & Diagnostics" active={isActive('/alertes')} onClick={() => setSidebarOpen(false)} />
          <SidebarLink to="/analyse" icon={BarChart2} label="Analyse & Performance" active={isActive('/analyse')} onClick={() => setSidebarOpen(false)} />
          <SidebarLink to="/rapports" icon={ClipboardList} label="Rapports" active={isActive('/rapports')} onClick={() => setSidebarOpen(false)} />
          <SidebarLink to="/utilisateurs" icon={Users} label="Utilisateurs & Accès" active={isActive('/utilisateurs')} onClick={() => setSidebarOpen(false)} />
          <SidebarLink to="/settings" icon={Settings} label="Paramètres" active={isActive('/settings')} onClick={() => setSidebarOpen(false)} />
        </nav>

        <div className="absolute bottom-0 left-0 right-0 border-t border-gray-700 p-4">
          <div className="flex items-center space-x-3">
            <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center text-white">
              {businessProfile.name.charAt(0)}
            </div>
            <div className="flex-1">
              <p className="text-white text-sm truncate">{businessProfile.name}</p>
              <p className="text-gray-400 text-xs truncate">{businessProfile.email}</p>
            </div>
            <button className="text-gray-400 hover:text-white">
              <LogOut className="h-5 w-5" />
            </button>
          </div>
        </div>
      </aside>

      {/* ===== MAIN ===== */}
      <div className="flex-1 flex flex-col overflow-hidden">
      <header className="bg-white shadow z-10">
  <div className="flex h-16 items-center justify-between px-4">
    {/* Gauche : bouton menu */}
    <div className="flex items-center">
      <button
        className="md:hidden p-1 text-gray-500 hover:bg-gray-100 rounded"
        onClick={() => setSidebarOpen(o => !o)}
      >
        <Menu className="h-6 w-6" />
      </button>
    </div>

    {/* Droite : actions */}
    <div className="ml-auto flex items-center space-x-4">
      <Link to="/rapports/generer" className="btn btn-primary inline-flex items-center">
        <Plus className="h-4 w-4 mr-1" /> Nouveau rapport
      </Link>
      <button className="flex items-center space-x-1 text-gray-700 hover:text-gray-900">
        <span>Aide</span>
        <ChevronDown className="h-4 w-4" />
      </button>
    </div>
  </div>
</header>


        <main className="flex-1 overflow-y-auto p-4 md:p-6">{children}</main>
      </div>

      {/* ===== BOUTON IA FLOTTANT ===== */}
      <button
        onClick={() => setChatOpen(true)}
        className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-full bg-blue-600 px-4 py-3 text-white shadow-lg hover:bg-blue-700 transition"
      >
        <MessageCircle className="h-5 w-5" />
        Assistant IA
      </button>

      {/* ===== MODAL CHAT ===== */}
      <ChatModal open={chatOpen} setOpen={setChatOpen} />
    </div>
  );
};

interface SidebarLinkProps {
  to: string;
  icon: React.ElementType;
  label: string;
  active: boolean;
  onClick: () => void;
}
const SidebarLink = ({ to, icon: Icon, label, active, onClick }: SidebarLinkProps) => (
  <Link
    to={to}
    onClick={onClick}
    className={`flex items-center px-3 py-2 text-sm font-medium rounded-md ${
      active ? 'bg-blue-600 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white'
    }`}
  >
    <Icon className="h-5 w-5 mr-3" />
    {label}
  </Link>
);

export default Layout;
