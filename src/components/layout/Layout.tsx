import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Menu,
  X,
  Home,
  Settings,
  LogOut,
  FileText,
  AlertCircle,
  BarChart2,
  Users,
  Plus,
  ChevronDown,
  Globe,
  ClipboardList
} from 'lucide-react';
import { useStore } from '../../store/useStore';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const businessProfile = useStore((state) => state.businessProfile);

  const isActive = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(`${path}/`);
  };

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const closeSidebar = () => setSidebarOpen(false);

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside
        className={`
        fixed top-0 left-0 z-40 h-screen w-64 transform bg-[#131635] shadow-lg transition-transform duration-300 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        md:relative md:translate-x-0
      `}
      >
        <div className="flex h-16 items-center justify-between border-b border-gray-700 px-4">
          <Link to="/" className="flex items-center space-x-2 font-semibold text-white" onClick={closeSidebar}>
            {/* Remplacement texte par logo image */}
            <img
  src="public/images/neo logo.png"
  alt="Neo Logo"
  className="h-10 w-auto object-contain"
/>

            {/* Si tu souhaites laisser un petit texte à côté, décommente ci-dessous */}
            {/* <span>Neo</span> */}
          </Link>
          <button className="rounded-md p-1 text-gray-400 hover:bg-gray-700 md:hidden" onClick={closeSidebar}>
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="mt-4 space-y-1 px-2">
          <Link
            to="/"
            className={`flex items-center rounded-md px-3 py-2 text-sm font-medium ${
              isActive('/') ? 'bg-blue-600 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white'
            }`}
            onClick={closeSidebar}
          >
            <Home className="mr-3 h-5 w-5" />
            Tableau de bord
          </Link>

          <Link
            to="/sites"
            className={`flex items-center rounded-md px-3 py-2 text-sm font-medium ${
              isActive('/sites') ? 'bg-blue-600 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white'
            }`}
            onClick={closeSidebar}
          >
            <Globe className="mr-3 h-5 w-5" />
            Sites & Installations
          </Link>

          <Link
            to="/alertes"
            className={`flex items-center rounded-md px-3 py-2 text-sm font-medium ${
              isActive('/alertes') ? 'bg-blue-600 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white'
            }`}
            onClick={closeSidebar}
          >
            <AlertCircle className="mr-3 h-5 w-5" />
            Alertes & Diagnostics
          </Link>

          <Link
            to="/analyse"
            className={`flex items-center rounded-md px-3 py-2 text-sm font-medium ${
              isActive('/analyse') ? 'bg-blue-600 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white'
            }`}
            onClick={closeSidebar}
          >
            <BarChart2 className="mr-3 h-5 w-5" />
            Analyse & Performance
          </Link>

          <Link
            to="/rapports"
            className={`flex items-center rounded-md px-3 py-2 text-sm font-medium ${
              isActive('/rapports') ? 'bg-blue-600 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white'
            }`}
            onClick={closeSidebar}
          >
            <ClipboardList className="mr-3 h-5 w-5" />
            Rapports
          </Link>

          <Link
            to="/utilisateurs"
            className={`flex items-center rounded-md px-3 py-2 text-sm font-medium ${
              isActive('/utilisateurs') ? 'bg-blue-600 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white'
            }`}
            onClick={closeSidebar}
          >
            <Users className="mr-3 h-5 w-5" />
            Utilisateurs & Accès
          </Link>

          <Link
            to="/settings"
            className={`flex items-center rounded-md px-3 py-2 text-sm font-medium ${
              isActive('/settings') ? 'bg-blue-600 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white'
            }`}
            onClick={closeSidebar}
          >
            <Settings className="mr-3 h-5 w-5" />
            Paramètres
          </Link>
        </nav>

        <div className="absolute bottom-0 left-0 right-0 border-t border-gray-700 p-4">
          <div className="flex items-center space-x-3">
            <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-medium">
              {businessProfile.name.charAt(0)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">{businessProfile.name}</p>
              <p className="text-xs text-gray-400 truncate">{businessProfile.email}</p>
            </div>
            <button className="text-gray-400 hover:text-white">
              <LogOut className="h-5 w-5" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white shadow-sm z-10">
          <div className="flex h-16 items-center justify-between px-4">
            <div className="flex items-center">
              <button className="rounded-md p-1 text-gray-500 hover:bg-gray-100 md:hidden" onClick={toggleSidebar}>
                <Menu className="h-6 w-6" />
              </button>
            </div>

            <div className="flex items-center space-x-4">
              <Link to="/rapports/generer" className="btn btn-primary inline-flex items-center">
                <Plus className="mr-1 h-4 w-4" />
                Nouveau rapport
              </Link>
              <button className="flex items-center space-x-1 text-sm text-gray-700 hover:text-gray-900">
                <span>Aide</span>
                <ChevronDown className="h-4 w-4" />
              </button>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 md:p-6">{children}</main>
      </div>
    </div>
  );
};

export default Layout;
