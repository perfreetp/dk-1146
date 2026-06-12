import type { Alert } from '../../types';
import { Card } from '../common/Card';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';
import { AlertTriangle, Bell, Shield, CheckCircle } from 'lucide-react';

interface AlertListProps {
  alerts: Alert[];
  onResolve?: (id: string) => void;
  showActions?: boolean;
}

export function AlertList({ alerts, onResolve, showActions = true }: AlertListProps) {
  const typeIcons = {
    anomaly: AlertTriangle,
    quota_warning: Bell,
    compliance: Shield,
  };

  const typeLabels = {
    anomaly: '异常告警',
    quota_warning: '额度预警',
    compliance: '合规通知',
  };

  const typeBadgeVariants = {
    anomaly: 'danger' as const,
    quota_warning: 'warning' as const,
    compliance: 'info' as const,
  };

  return (
    <div className="space-y-4">
      {alerts.length === 0 ? (
        <Card>
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <CheckCircle className="w-12 h-12 text-accent mb-3" />
            <p className="text-dark-600">暂无告警信息</p>
            <p className="text-sm text-dark-400 mt-1">所有系统运行正常</p>
          </div>
        </Card>
      ) : (
        alerts.map((alert) => {
          const Icon = typeIcons[alert.type];
          return (
            <Card key={alert.id} className="hover:shadow-card-hover transition-shadow">
              <div className="flex items-start gap-4">
                <div
                  className={`p-3 rounded-xl ${
                    alert.type === 'anomaly'
                      ? 'bg-red-100 text-red-600'
                      : alert.type === 'quota_warning'
                      ? 'bg-warning/10 text-warning'
                      : 'bg-blue-100 text-blue-600'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <Badge variant={typeBadgeVariants[alert.type]}>{typeLabels[alert.type]}</Badge>
                    <Badge variant={alert.status === 'open' ? 'danger' : 'success'}>
                      {alert.status === 'open' ? '待处理' : '已解决'}
                    </Badge>
                  </div>
                  <p className="text-dark-700 mb-2">{alert.description}</p>
                  <p className="text-sm text-dark-400">
                    {new Date(alert.createdAt).toLocaleDateString('zh-CN', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>

                {showActions && alert.status === 'open' && onResolve && (
                  <Button variant="outline" size="sm" onClick={() => onResolve(alert.id)}>
                    标记已解决
                  </Button>
                )}
              </div>
            </Card>
          );
        })
      )}
    </div>
  );
}
