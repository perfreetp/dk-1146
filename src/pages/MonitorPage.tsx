import { PageContainer } from '../components/layout/PageContainer';
import { Card, CardTitle } from '../components/common/Card';
import { Badge, Button } from '../components/common/Badge';
import { StatsCard } from '../components/monitor/StatsCard';
import { UsageChart } from '../components/monitor/UsageChart';
import { AlertList } from '../components/monitor/AlertList';
import { useMonitorStore } from '../stores/monitorStore';
import { usePersonalityStore } from '../stores/personalityStore';
import { Phone, Users, Star, AlertTriangle, Calendar } from 'lucide-react';

export function MonitorPage() {
  const { usageStats, alerts, resolveAlert } = useMonitorStore();
  const { assignments, employees } = usePersonalityStore();

  const openAlerts = alerts.filter((a) => a.status === 'open');
  const renewalAlerts = alerts.filter((a) => a.type === 'expiring_soon' && a.status === 'open');
  const otherAlerts = alerts.filter((a) => a.type !== 'expiring_soon' && a.status === 'open');

  const getEmployeeUsage = () => {
    const employeeMap = new Map<string, {
      name: string;
      avatar: string;
      personas: { id: string; name: string; assignedAt: string }[];
      callCount: number;
      satisfaction: number;
    }>();

    assignments.forEach((assignment) => {
      const existing = employeeMap.get(assignment.userId);
      if (existing) {
        if (!existing.personas.find((p) => p.id === assignment.personalityId)) {
          existing.personas.push({
            id: assignment.personalityId,
            name: assignment.personality.name,
            assignedAt: assignment.assignedAt
          });
        }
        existing.callCount += Math.floor(Math.random() * 500) + 100;
      } else {
        employeeMap.set(assignment.userId, {
          name: assignment.userName,
          avatar: employees.find((e) => e.id === assignment.userId)?.avatar ||
            `https://api.dicebear.com/7.x/avataaars/svg?seed=${assignment.userName}`,
          personas: [{
            id: assignment.personalityId,
            name: assignment.personality.name,
            assignedAt: assignment.assignedAt
          }],
          callCount: Math.floor(Math.random() * 500) + 100,
          satisfaction: 4 + Math.random(),
        });
      }
    });

    return Array.from(employeeMap.values());
  };

  const employeeUsage = getEmployeeUsage();

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
            <AlertList alerts={otherAlerts} onResolve={resolveAlert} />
          </Card>
        </div>

        {renewalAlerts.length > 0 && (
          <Card className="border-blue-200 bg-blue-50/50">
            <CardTitle className="text-blue-700 flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              服务续约提醒
            </CardTitle>
            <div className="space-y-3 mt-4">
              {renewalAlerts.map((alert) => (
                <div key={alert.id} className="flex items-center justify-between p-3 bg-white rounded-xl border border-blue-100">
                  <div>
                    <p className="text-dark-700">{alert.description}</p>
                    <p className="text-xs text-dark-400 mt-1">
                      {new Date(alert.createdAt).toLocaleDateString('zh-CN')}
                    </p>
                  </div>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => resolveAlert(alert.id)}
                  >
                    已续约
                  </Button>
                </div>
              ))}
            </div>
          </Card>
        )}

        <Card>
          <CardTitle className="mb-4">员工使用明细</CardTitle>
          {employeeUsage.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-dark-100">
                    <th className="text-left py-3 px-4 text-sm font-semibold text-dark-700">员工</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-dark-700">使用人格</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-dark-700">分配时间</th>
                    <th className="text-right py-3 px-4 text-sm font-semibold text-dark-700">调用次数</th>
                    <th className="text-right py-3 px-4 text-sm font-semibold text-dark-700">满意度</th>
                  </tr>
                </thead>
                <tbody>
                  {employeeUsage.map((employee, index) => (
                    <tr key={index} className="border-b border-dark-50 hover:bg-dark-50 transition-colors">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <img src={employee.avatar} alt={employee.name} className="w-8 h-8 rounded-full" />
                          <span className="font-medium text-dark-900">{employee.name}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex flex-col gap-1">
                          {employee.personas.map((p) => (
                            <div key={p.id} className="flex items-center gap-2">
                              <Badge variant="primary" className="text-xs">
                                {p.name}
                              </Badge>
                              <span className="text-xs text-dark-400">
                                {new Date(p.assignedAt).toLocaleDateString('zh-CN')}
                              </span>
                            </div>
                          ))}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-1 text-sm text-dark-500">
                          <Calendar className="w-4 h-4" />
                          {employee.personas[0]?.assignedAt
                            ? new Date(employee.personas[0].assignedAt).toLocaleDateString('zh-CN')
                            : '-'}
                        </div>
                      </td>
                      <td className="py-3 px-4 text-right font-mono text-dark-900">
                        {employee.callCount.toLocaleString()}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Star className="w-4 h-4 text-yellow-400 fill-current" />
                          <span className="font-medium text-dark-900">{employee.satisfaction.toFixed(1)}</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-8 text-dark-400">
              <Users className="w-12 h-12 mx-auto mb-2 text-dark-300" />
              <p>暂无分配记录</p>
              <p className="text-sm mt-1">批准采购申请后分配给员工即可查看</p>
            </div>
          )}
        </Card>
      </div>
    </PageContainer>
  );
}
