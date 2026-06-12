import { PageContainer } from '../components/layout/PageContainer';
import { Card, CardTitle } from '../components/common/Card';
import { Badge } from '../components/common/Badge';
import { StatsCard } from '../components/monitor/StatsCard';
import { UsageChart } from '../components/monitor/UsageChart';
import { AlertList } from '../components/monitor/AlertList';
import { useMonitorStore } from '../stores/monitorStore';
import { Phone, Users, Star, AlertTriangle } from 'lucide-react';

export function MonitorPage() {
  const { usageStats, employeeUsage, alerts, resolveAlert } = useMonitorStore();

  const openAlerts = alerts.filter((a) => a.status === 'open');

  return (
    <PageContainer>
      <div className="space-y-6 animate-fade-in">
        <div>
          <h1 className="text-3xl font-bold text-dark-900 mb-2">使用监控</h1>
          <p className="text-dark-500">实时监控 AI 人格的使用情况和系统健康状态</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatsCard
            title="今日调用量"
            value={usageStats.trends[usageStats.trends.length - 1]?.calls || 0}
            change="实时数据"
            changeType="neutral"
            icon={Phone}
            color="primary"
          />
          <StatsCard
            title="活跃人格数"
            value={usageStats.activePersonas}
            change="正在使用"
            changeType="neutral"
            icon={Users}
            color="accent"
          />
          <StatsCard
            title="平均满意度"
            value={usageStats.avgSatisfaction.toFixed(1)}
            change="持续监控"
            changeType="positive"
            icon={Star}
            color="warning"
          />
          <StatsCard
            title="待处理告警"
            value={openAlerts.length}
            change={openAlerts.length > 0 ? '需要关注' : '全部正常'}
            changeType={openAlerts.length > 0 ? 'negative' : 'positive'}
            icon={AlertTriangle}
            color="info"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <UsageChart data={usageStats} />
          </div>

          <Card>
            <CardTitle className="mb-4">异常告警</CardTitle>
            <AlertList alerts={openAlerts.slice(0, 3)} onResolve={resolveAlert} />
          </Card>
        </div>

        <Card>
          <CardTitle className="mb-4">员工使用明细</CardTitle>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-dark-100">
                  <th className="text-left py-3 px-4 text-sm font-semibold text-dark-700">员工</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-dark-700">使用人格</th>
                  <th className="text-right py-3 px-4 text-sm font-semibold text-dark-700">调用次数</th>
                  <th className="text-right py-3 px-4 text-sm font-semibold text-dark-700">满意度</th>
                </tr>
              </thead>
              <tbody>
                {employeeUsage.map((employee) => (
                  <tr key={employee.id} className="border-b border-dark-50 hover:bg-dark-50 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <img src={employee.avatar} alt={employee.name} className="w-8 h-8 rounded-full" />
                        <span className="font-medium text-dark-900">{employee.name}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex flex-wrap gap-1">
                        {employee.assignedPersonas.map((p) => (
                          <Badge key={p.id} variant="primary" className="text-xs">
                            {p.name}
                          </Badge>
                        ))}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-right font-mono text-dark-900">
                      {employee.callCount.toLocaleString()}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                        <span className="font-medium text-dark-900">{employee.satisfaction}</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {openAlerts.length > 3 && (
          <Card>
            <CardTitle className="mb-4">全部告警</CardTitle>
            <AlertList alerts={alerts} onResolve={resolveAlert} />
          </Card>
        )}
      </div>
    </PageContainer>
  );
}
