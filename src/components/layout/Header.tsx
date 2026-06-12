import { Link, useLocation } from 'react-router-dom';
import { Bell, User, LogOut, Settings } from 'lucide-react';
import { useAuthStore } from '../../stores/authStore';
import { useMonitorStore } from '../../stores/monitorStore';
import { Badge } from '../common/Badge';

export function Header() {
  const { user, company, logout } = useAuthStore();
  const { alerts } = useMonitorStore();
  const location = useLocation();
  const openAlerts = alerts.filter((a) => a.status === 'open').length;

  return (
    <header className="h-16 bg-white border-b border-dark-100 px-6 flex items-center justify-between sticky top-0 z-40">
      <div className="flex items-center gap-3">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">AI</span>
          </div>
          <span className="text-xl font-bold text-primary hidden md:block">人格市场</span>
        </Link>
      </div>

      <div className="flex items-center gap-4">
        <Link
          to="/monitor"
          className={`relative p-2 text-dark-500 hover:text-primary hover:bg-primary/5 rounded-lg transition-colors ${
            location.pathname === '/monitor' ? 'text-primary bg-primary/5' : ''
          }`}
        >
          <Bell className="w-5 h-5" />
          {openAlerts > 0 && (
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
              {openAlerts}
            </span>
          )}
        </Link>

        <div className="flex items-center gap-3 pl-4 border-l border-dark-100">
          {company && (
            <div className="hidden md:block text-right">
              <p className="text-sm font-medium text-dark-900">{company.name}</p>
              <p className="text-xs text-dark-500">{company.industry}</p>
            </div>
          )}
          <div className="dropdown relative">
            <button className="flex items-center gap-2">
              {user?.avatar ? (
                <img src={user.avatar} alt={user.name} className="w-9 h-9 rounded-full" />
              ) : (
                <div className="w-9 h-9 bg-primary/10 rounded-full flex items-center justify-center">
                  <User className="w-5 h-5 text-primary" />
                </div>
              )}
            </button>
            <div className="dropdown-menu absolute right-0 mt-2 w-56 bg-white rounded-card shadow-card-hover border border-dark-100 hidden group-hover:block">
              <div className="p-4 border-b border-dark-100">
                <p className="font-medium text-dark-900">{user?.name}</p>
                <p className="text-sm text-dark-500">{user?.email}</p>
                <Badge variant="primary" className="mt-2">
                  {user?.role === 'admin' ? '管理员' : '采购员'}
                </Badge>
              </div>
              <div className="p-2">
                <Link
                  to="/admin"
                  className="flex items-center gap-2 px-3 py-2 text-dark-600 hover:bg-dark-50 rounded-lg transition-colors"
                >
                  <Settings className="w-4 h-4" />
                  <span>管理后台</span>
                </Link>
                <button
                  onClick={logout}
                  className="w-full flex items-center gap-2 px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  <span>退出登录</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
