import { useState } from 'react';
import { PageContainer } from '../components/layout/PageContainer';
import { Card, CardTitle } from '../components/common/Card';
import { Badge, Button } from '../components/common/Badge';
import { Modal } from '../components/common/Modal';
import { Input } from '../components/common/Input';
import { usePersonalityStore } from '../stores/personalityStore';
import { useMonitorStore } from '../stores/monitorStore';
import {
  Users,
  DollarSign,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
  Calendar,
  UserPlus,
  Power,
  PowerOff,
  AlertCircle,
} from 'lucide-react';
import type { Application, Personality } from '../types';

export function AdminPage() {
  const {
    applications,
    approveApplication,
    rejectApplication,
    assignEmployeesToApplication,
    togglePersonalityActive,
    personalities,
    employees,
  } = usePersonalityStore();
  const { quotas, currentQuota, updateQuota, alerts, resolveAlert, resolveQuotaAlert } = useMonitorStore();

  const [activeTab, setActiveTab] = useState<'applications' | 'quota' | 'alerts' | 'personalities'>('applications');
  const [rejectModal, setRejectModal] = useState<{ open: boolean; applicationId: string }>({
    open: false,
    applicationId: '',
  });
  const [rejectReason, setRejectReason] = useState('');
  const [quotaModal, setQuotaModal] = useState(false);
  const [newTotalCalls, setNewTotalCalls] = useState('');
  const [newWarningThreshold, setNewWarningThreshold] = useState('');
  const [assignModal, setAssignModal] = useState<{ open: boolean; applicationId: string }>({
    open: false,
    applicationId: '',
  });
  const [selectedEmployees, setSelectedEmployees] = useState<string[]>([]);

  const tabs = [
    { key: 'applications', label: '采购审批', icon: Users, count: applications.filter((a) => a.status === 'pending').length },
    { key: 'quota', label: '额度管理', icon: DollarSign },
    { key: 'alerts', label: '告警处理', icon: AlertTriangle, count: alerts.filter((a) => a.status === 'open').length },
    { key: 'personalities', label: '人格管理', icon: Power },
  ];

  const handleApprove = (id: string) => {
    approveApplication(id);
  };

  const handleReject = () => {
    if (rejectReason.trim()) {
      rejectApplication(rejectModal.applicationId, rejectReason);
      setRejectModal({ open: false, applicationId: '' });
      setRejectReason('');
    }
  };

  const handleOpenAssign = (applicationId: string, currentEmployees?: string[]) => {
    setSelectedEmployees(currentEmployees || []);
    setAssignModal({ open: true, applicationId });
  };

  const handleAssign = () => {
    if (selectedEmployees.length > 0) {
      assignEmployeesToApplication(assignModal.applicationId, selectedEmployees);
      setAssignModal({ open: false, applicationId: '' });
      setSelectedEmployees([]);
    }
  };

  const handleToggleEmployee = (employeeId: string) => {
    setSelectedEmployees((prev) =>
      prev.includes(employeeId) ? prev.filter((id) => id !== employeeId) : [...prev, employeeId]
    );
  };

  const handleUpdateQuota = () => {
    if (currentQuota && newTotalCalls && newWarningThreshold) {
      updateQuota(currentQuota.id, parseInt(newTotalCalls), parseInt(newWarningThreshold));
      setQuotaModal(false);
      setNewTotalCalls('');
      setNewWarningThreshold('');
    }
  };

  const getStatusBadge = (status: Application['status']) => {
    const configs = {
      pending: { variant: 'warning' as const, label: '待审批' },
      approved: { variant: 'success' as const, label: '已通过' },
      rejected: { variant: 'danger' as const, label: '已驳回' },
    };
    const config = configs[status];
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const activePersonalities = personalities.filter((p) => p.isActive);
  const inactivePersonalities = personalities.filter((p) => !p.isActive);

  return (
    <PageContainer>
      <div className="space-y-6 animate-fade-in">
        <div>
          <h1 className="text-3xl font-bold text-dark-900 mb-2">管理后台</h1>
          <p className="text-dark-500">管理企业额度、审批采购申请、处理异常告警</p>
        </div>

        <div className="flex gap-2 border-b border-dark-100">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-colors ${
                activeTab === tab.key
                  ? 'border-primary text-primary'
                  : 'border-transparent text-dark-500 hover:text-dark-700'
              }`}
            >
              <tab.icon className="w-5 h-5" />
              <span className="font-medium">{tab.label}</span>
              {tab.count !== undefined && tab.count > 0 && (
                <Badge variant="danger" className="ml-1">
                  {tab.count}
                </Badge>
              )}
            </button>
          ))}
        </div>

        {activeTab === 'applications' && (
          <div className="space-y-4">
            {applications.length === 0 ? (
              <Card className="text-center py-12">
                <Users className="w-12 h-12 text-dark-300 mx-auto mb-4" />
                <p className="text-dark-500">暂无采购申请</p>
              </Card>
            ) : (
              applications.map((application, index) => (
                <Card
                  key={application.id}
                  className="animate-slide-up"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-lg font-semibold text-dark-900">
                          {application.userName} 的采购申请
                        </h3>
                        {getStatusBadge(application.status)}
                      </div>
                      <p className="text-sm text-dark-500">
                        提交于 {new Date(application.createdAt).toLocaleDateString('zh-CN')}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-primary">
                        ¥{application.budget.toLocaleString()}
                      </p>
                      <p className="text-sm text-dark-400">预算</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 p-4 bg-dark-50 rounded-xl">
                    {application.items.map((item) => (
                      <div key={item.id} className="text-center">
                        <img
                          src={item.personality.avatar}
                          alt={item.personality.name}
                          className="w-12 h-12 rounded-lg mx-auto mb-2 object-cover bg-white"
                        />
                        <p className="text-sm font-medium text-dark-900">{item.personality.name}</p>
                        <p className="text-xs text-dark-400">× {item.quantity}</p>
                      </div>
                    ))}
                  </div>

                  <div className="mb-4">
                    <p className="text-sm font-medium text-dark-700 mb-1">用途说明</p>
                    <p className="text-dark-600">{application.usage}</p>
                  </div>

                  <div className="flex items-center gap-4 text-sm text-dark-500 mb-4">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      期望上线：{application.expectedDate}
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      {application.items.length} 个人格
                    </div>
                  </div>

                  {application.assignedEmployees && application.assignedEmployees.length > 0 && (
                    <div className="mb-4 p-3 bg-accent/10 border border-accent/20 rounded-xl">
                      <p className="text-sm font-medium text-accent mb-2 flex items-center gap-1">
                        <CheckCircle className="w-4 h-4" />
                        已分配员工
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {application.assignedEmployees.map((empId) => {
                          const emp = employees.find((e) => e.id === empId);
                          return emp ? (
                            <Badge key={empId} variant="success">
                              {emp.name} ({emp.department})
                            </Badge>
                          ) : null;
                        })}
                      </div>
                    </div>
                  )}

                  {application.rejectionReason && (
                    <div className="mb-4 p-3 bg-red-50 border border-red-100 rounded-lg">
                      <p className="text-sm font-medium text-red-600 mb-1">驳回原因</p>
                      <p className="text-sm text-red-700">{application.rejectionReason}</p>
                    </div>
                  )}

                  {application.status === 'pending' && (
                    <div className="flex gap-3 pt-4 border-t border-dark-100">
                      <Button
                        variant="primary"
                        className="flex-1"
                        onClick={() => handleApprove(application.id)}
                      >
                        <CheckCircle className="w-4 h-4 mr-2" />
                        批准
                      </Button>
                      <Button
                        variant="outline"
                        className="flex-1"
                        onClick={() => setRejectModal({ open: true, applicationId: application.id })}
                      >
                        <XCircle className="w-4 h-4 mr-2" />
                        驳回
                      </Button>
                    </div>
                  )}

                  {application.status === 'approved' && !application.assignedEmployees && (
                    <div className="flex gap-3 pt-4 border-t border-dark-100">
                      <Button
                        variant="primary"
                        className="flex-1"
                        onClick={() => handleOpenAssign(application.id)}
                      >
                        <UserPlus className="w-4 h-4 mr-2" />
                        分配给员工
                      </Button>
                    </div>
                  )}
                </Card>
              ))
            )}
          </div>
        )}

        {activeTab === 'quota' && currentQuota && (
          <div className="space-y-6">
            <Card>
              <div className="flex items-center justify-between mb-6">
                <CardTitle>当前额度</CardTitle>
                <Button
                  variant="outline"
                  onClick={() => {
                    setNewTotalCalls(currentQuota.totalCalls.toString());
                    setNewWarningThreshold(currentQuota.warningThreshold.toString());
                    setQuotaModal(true);
                  }}
                >
                  修改额度
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
                <div>
                  <p className="text-sm text-dark-500 mb-1">总调用额度</p>
                  <p className="text-3xl font-bold text-primary">
                    {(currentQuota.totalCalls / 1000).toFixed(0)}K
                  </p>
                </div>
                <div>
                  <p className="text-sm text-dark-500 mb-1">已使用</p>
                  <p className="text-3xl font-bold text-dark-900">
                    {(currentQuota.usedCalls / 1000).toFixed(1)}K
                  </p>
                </div>
                <div>
                  <p className="text-sm text-dark-500 mb-1">剩余额度</p>
                  <p className="text-3xl font-bold text-accent">
                    {((currentQuota.totalCalls - currentQuota.usedCalls) / 1000).toFixed(1)}K
                  </p>
                </div>
                <div>
                  <p className="text-sm text-dark-500 mb-1">服务到期</p>
                  <p className="text-3xl font-bold text-warning">
                    {currentQuota.expiresAt}
                  </p>
                </div>
              </div>

              <div className="mt-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-dark-700">使用进度</span>
                  <span className="text-sm font-medium text-dark-900">
                    {((currentQuota.usedCalls / currentQuota.totalCalls) * 100).toFixed(1)}%
                  </span>
                </div>
                <div className="h-3 bg-dark-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${
                      currentQuota.usedCalls >= currentQuota.warningThreshold
                        ? 'bg-red-500'
                        : currentQuota.usedCalls >= currentQuota.totalCalls * 0.8
                        ? 'bg-warning'
                        : 'bg-accent'
                    }`}
                    style={{ width: `${(currentQuota.usedCalls / currentQuota.totalCalls) * 100}%` }}
                  />
                </div>
                <p className="text-xs text-dark-400 mt-2">
                  预警阈值：{currentQuota.warningThreshold.toLocaleString()} (
                  {((currentQuota.warningThreshold / currentQuota.totalCalls) * 100).toFixed(0)}%)
                </p>
              </div>
            </Card>

            <Card>
              <CardTitle className="mb-4">所有企业额度</CardTitle>
              <div className="space-y-3">
                {quotas.map((quota) => {
                  const companyName =
                    quota.companyId === 'c1'
                      ? '科技创新集团'
                      : quota.companyId === 'c2'
                      ? '环球贸易有限公司'
                      : quota.companyId === 'c3'
                      ? '金融服务中心'
                      : quota.companyId === 'c4'
                      ? '教育培训学院'
                      : quota.companyId === 'c5'
                      ? '医疗健康集团'
                      : `企业 ${quota.companyId}`;

                  const daysUntilExpiry = Math.ceil(
                    (new Date(quota.expiresAt).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
                  );
                  const isExpiringSoon = daysUntilExpiry <= 30 && daysUntilExpiry > 0;

                  return (
                    <div key={quota.id} className="flex items-center justify-between p-4 bg-dark-50 rounded-xl">
                      <div>
                        <p className="font-medium text-dark-900">{companyName}</p>
                        <div className="flex items-center gap-4 mt-1">
                          <p className="text-sm text-dark-500">
                            {quota.usedCalls.toLocaleString()} / {quota.totalCalls.toLocaleString()}
                          </p>
                          <p className="text-sm text-dark-500">到期：{quota.expiresAt}</p>
                          {isExpiringSoon && quota.renewalNotice && (
                            <Badge variant="warning">即将到期</Badge>
                          )}
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-primary">
                          {((quota.usedCalls / quota.totalCalls) * 100).toFixed(0)}%
                        </p>
                        <p className="text-xs text-dark-400">使用率</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>
          </div>
        )}

        {activeTab === 'alerts' && (
          <div className="space-y-4">
            <Card>
              <CardTitle className="mb-4">告警统计</CardTitle>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="p-4 bg-red-50 rounded-xl">
                  <AlertTriangle className="w-8 h-8 text-red-500 mb-2" />
                  <p className="text-2xl font-bold text-red-600">
                    {alerts.filter((a) => a.type === 'anomaly' && a.status === 'open').length}
                  </p>
                  <p className="text-sm text-red-500">异常告警</p>
                </div>
                <div className="p-4 bg-warning/10 rounded-xl">
                  <AlertCircle className="w-8 h-8 text-warning mb-2" />
                  <p className="text-2xl font-bold text-warning">
                    {alerts.filter((a) => a.type === 'quota_warning' && a.status === 'open').length}
                  </p>
                  <p className="text-sm text-warning">额度预警</p>
                </div>
                <div className="p-4 bg-blue-50 rounded-xl">
                  <Clock className="w-8 h-8 text-blue-600 mb-2" />
                  <p className="text-2xl font-bold text-blue-600">
                    {alerts.filter((a) => a.type === 'expiring_soon' && a.status === 'open').length}
                  </p>
                  <p className="text-sm text-blue-500">续约提醒</p>
                </div>
                <div className="p-4 bg-dark-100 rounded-xl">
                  <CheckCircle className="w-8 h-8 text-dark-400 mb-2" />
                  <p className="text-2xl font-bold text-dark-600">
                    {alerts.filter((a) => a.status === 'resolved').length}
                  </p>
                  <p className="text-sm text-dark-500">已解决</p>
                </div>
              </div>
            </Card>

            <Card>
              <CardTitle className="mb-4">告警列表</CardTitle>
              <div className="space-y-3">
                {alerts
                  .filter((a) => a.status === 'open')
                  .map((alert) => (
                    <div key={alert.id} className="p-4 bg-dark-50 rounded-xl">
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <Badge
                              variant={
                                alert.type === 'anomaly'
                                  ? 'danger'
                                  : alert.type === 'quota_warning'
                                  ? 'warning'
                                  : alert.type === 'expiring_soon'
                                  ? 'info'
                                  : 'default'
                              }
                            >
                              {alert.type === 'anomaly'
                                ? '异常'
                                : alert.type === 'quota_warning'
                                ? '额度'
                                : alert.type === 'expiring_soon'
                                ? '续约'
                                : '合规'}
                            </Badge>
                          </div>
                          <p className="text-dark-700">{alert.description}</p>
                          <p className="text-xs text-dark-400 mt-1">
                            {new Date(alert.createdAt).toLocaleDateString('zh-CN')}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          {alert.type === 'expiring_soon' && alert.relatedCompanyId && (
                            <Button
                              variant="primary"
                              size="sm"
                              onClick={() => resolveQuotaAlert(alert.relatedCompanyId!)}
                            >
                              <CheckCircle className="w-4 h-4 mr-1" />
                              已续约
                            </Button>
                          )}
                          <Button variant="outline" size="sm" onClick={() => resolveAlert(alert.id)}>
                            标记已解决
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                {alerts.filter((a) => a.status === 'open').length === 0 && (
                  <div className="text-center py-8 text-dark-400">
                    <CheckCircle className="w-12 h-12 mx-auto mb-2 text-accent" />
                    <p>暂无待处理告警</p>
                  </div>
                )}
              </div>
            </Card>
          </div>
        )}

        {activeTab === 'personalities' && (
          <div className="space-y-6">
            <Card>
              <CardTitle className="mb-4">活跃人格</CardTitle>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {activePersonalities.map((personality) => (
                  <div
                    key={personality.id}
                    className="p-4 bg-accent/5 border border-accent/20 rounded-xl"
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <img
                        src={personality.avatar}
                        alt={personality.name}
                        className="w-12 h-12 rounded-lg object-cover bg-white"
                      />
                      <div className="flex-1">
                        <p className="font-medium text-dark-900">{personality.name}</p>
                        <Badge variant="success" className="mt-1">
                          活跃
                        </Badge>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full"
                      onClick={() => togglePersonalityActive(personality.id)}
                    >
                      <PowerOff className="w-4 h-4 mr-1" />
                      停用人格
                    </Button>
                  </div>
                ))}
              </div>
            </Card>

            <Card>
              <CardTitle className="mb-4">已停用人格</CardTitle>
              {inactivePersonalities.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {inactivePersonalities.map((personality) => (
                    <div
                      key={personality.id}
                      className="p-4 bg-dark-100 border border-dark-200 rounded-xl opacity-75"
                    >
                      <div className="flex items-center gap-3 mb-3">
                        <img
                          src={personality.avatar}
                          alt={personality.name}
                          className="w-12 h-12 rounded-lg object-cover bg-white"
                        />
                        <div className="flex-1">
                          <p className="font-medium text-dark-700">{personality.name}</p>
                          <Badge variant="default" className="mt-1">
                            已停用
                          </Badge>
                        </div>
                      </div>
                      <Button
                        variant="primary"
                        size="sm"
                        className="w-full"
                        onClick={() => togglePersonalityActive(personality.id)}
                      >
                        <Power className="w-4 h-4 mr-1" />
                        重新启用
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-dark-400">
                  <Power className="w-12 h-12 mx-auto mb-2 text-dark-300" />
                  <p>暂无已停用的人格</p>
                </div>
              )}
            </Card>
          </div>
        )}

        <Modal
          isOpen={rejectModal.open}
          onClose={() => setRejectModal({ open: false, applicationId: '' })}
          title="驳回申请"
          size="md"
        >
          <div className="space-y-4">
            <p className="text-dark-600">请输入驳回原因：</p>
            <Input
              placeholder="请输入驳回原因..."
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
            />
            <div className="flex gap-3 pt-4">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => setRejectModal({ open: false, applicationId: '' })}
              >
                取消
              </Button>
              <Button variant="danger" className="flex-1" onClick={handleReject}>
                确认驳回
              </Button>
            </div>
          </div>
        </Modal>

        <Modal isOpen={quotaModal} onClose={() => setQuotaModal(false)} title="修改额度" size="md">
          <div className="space-y-4">
            <Input
              label="总调用额度"
              type="number"
              placeholder="请输入总调用额度"
              value={newTotalCalls}
              onChange={(e) => setNewTotalCalls(e.target.value)}
            />
            <Input
              label="预警阈值"
              type="number"
              placeholder="请输入预警阈值"
              value={newWarningThreshold}
              onChange={(e) => setNewWarningThreshold(e.target.value)}
            />
            <div className="flex gap-3 pt-4">
              <Button variant="outline" className="flex-1" onClick={() => setQuotaModal(false)}>
                取消
              </Button>
              <Button variant="primary" className="flex-1" onClick={handleUpdateQuota}>
                保存
              </Button>
            </div>
          </div>
        </Modal>

        <Modal
          isOpen={assignModal.open}
          onClose={() => setAssignModal({ open: false, applicationId: '' })}
          title="分配给员工"
          size="lg"
        >
          <div className="space-y-4">
            <p className="text-dark-600">请选择要分配的员工（可多选）：</p>
            <div className="max-h-80 overflow-y-auto space-y-2">
              {employees.map((employee) => (
                <button
                  key={employee.id}
                  onClick={() => handleToggleEmployee(employee.id)}
                  className={`w-full flex items-center gap-3 p-3 rounded-xl border-2 transition-all text-left ${
                    selectedEmployees.includes(employee.id)
                      ? 'border-primary bg-primary/5'
                      : 'border-dark-100 hover:border-dark-200'
                  }`}
                >
                  <img
                    src={employee.avatar}
                    alt={employee.name}
                    className="w-10 h-10 rounded-full object-cover bg-dark-50"
                  />
                  <div className="flex-1">
                    <p className="font-medium text-dark-900">{employee.name}</p>
                    <p className="text-sm text-dark-500">{employee.department}</p>
                  </div>
                  <div
                    className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                      selectedEmployees.includes(employee.id)
                        ? 'border-primary bg-primary'
                        : 'border-dark-200'
                    }`}
                  >
                    {selectedEmployees.includes(employee.id) && (
                      <CheckCircle className="w-4 h-4 text-white" />
                    )}
                  </div>
                </button>
              ))}
            </div>
            <div className="flex gap-3 pt-4 border-t border-dark-100">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => setAssignModal({ open: false, applicationId: '' })}
              >
                取消
              </Button>
              <Button
                variant="primary"
                className="flex-1"
                onClick={handleAssign}
                disabled={selectedEmployees.length === 0}
              >
                <UserPlus className="w-4 h-4 mr-1" />
                确认分配 ({selectedEmployees.length})
              </Button>
            </div>
          </div>
        </Modal>
      </div>
    </PageContainer>
  );
}
