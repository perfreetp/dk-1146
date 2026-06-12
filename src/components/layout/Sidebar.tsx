import { Link, useLocation } from 'react-router-dom';
import {
  Home,
  Users,
  GitCompare,
  Bookmark,
  ClipboardList,
  BarChart3,
  Settings,
  Shield,
} from 'lucide-react';
import { useAuthStore } from '../../stores/authStore';
import { usePersonalityStore } from '../../stores/personalityStore';
import { Badge } from '../common/Badge';

interface NavItem {
  path: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: number;
}

export function Sidebar() {
  const location = useLocation();
  const { user } = useAuthStore();
  const { applications } = usePersonalityStore();
  const pendingCount = applications.filter((a) => a.status === 'pending').length;

  const navItems: NavItem[] = [
    { path: '/', label: '首页概览', icon: Home },
    { path: '/personalities', label: '人格库', icon: Users },
    { path: '/compare', label: '评测对比', icon: GitCompare },
    { path: '/shortlist', label: '候选清单', icon: Bookmark },
  ];

  const adminItems: NavItem[] = [
    { path: '/monitor', label: '使用监控', icon: BarChart3 },
    { path: '/admin', label: '管理后台', icon: Settings, badge: pendingCount },
  ];

  const isActive = (path: string) => location.pathname === path;
  const isAdmin = user?.role === 'admin' || user?.role === 'super_admin';

  return (
    <aside className="w-64 bg-white border-r border-dark-100 min-h-[calc(100vh-4rem)] flex flex-col">
      <nav className="flex-1 p-4 space-y-1">
        <div className="mb-6">
          <p className="px-3 text-xs font-semibold text-dark-400 uppercase tracking-wider mb-2">
            导航菜单
          </p>
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 mb-1 ${
                isActive(item.path)
                  ? 'bg-primary text-white shadow-sm'
                  : 'text-dark-600 hover:bg-dark-50 hover:text-primary'
              }`}
            >
              <item.icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
              {item.badge && item.badge > 0 && (
                <Badge variant="danger" className="ml-auto">
                  {item.badge}
                </Badge>
              )}
            </Link>
          ))}
        </div>

        {isAdmin && (
          <div>
            <p className="px-3 text-xs font-semibold text-dark-400 uppercase tracking-wider mb-2 flex items-center gap-2">
              <Shield className="w-3 h-3" />
              管理
            </p>
            {adminItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 mb-1 ${
                  isActive(item.path)
                    ? 'bg-primary text-white shadow-sm'
                    : 'text-dark-600 hover:bg-dark-50 hover:text-primary'
                }`}
              >
                <item.icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
                {item.badge && item.badge > 0 && (
                  <Badge variant="warning" className="ml-auto">
                    {item.badge}
                  </Badge>
                )}
              </Link>
            ))}
          </div>
        )}
      </nav>

      <div className="p-4 border-t border-dark-100">
        <div className="bg-gradient-to-br from-primary/5 to-accent/5 rounded-card p-4">
          <p className="text-sm font-medium text-dark-900 mb-1">需要帮助？</p>
          <p className="text-xs text-dark-500 mb-3">查看使用文档或联系技术支持</p>
          <button className="text-xs text-primary hover:text-primary-600 font-medium">
            查看文档 →
          </button>
        </div>
      </div>
    </aside>
  );
}
