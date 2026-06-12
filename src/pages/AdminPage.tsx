import { useState } from 'react';
import { PageContainer } from '../components/layout/PageContainer';
import { Card, CardTitle } from '../components/common/Card';
import { Badge } from '../components/common/Badge';
import { Button } from '../components/common/Button';
import { ComplianceBadge } from '../components/common/Badge';
import { Modal } from '../components/common/Modal';
import { Input } from '../components/common/Input';
import { usePersonalityStore } from '../stores/personalityStore';
import { useMonitorStore } from '../stores/monitorStore';
import {
  Users,
  DollarSign,
  AlertTriangle,
  BarChart3,
  Calendar,
  CheckCircle,
  XCircle,
  Clock,
  TrendingUp,
} from 'lucide-react';
import type { Application } from '../types';

export function AdminPage() {
  const { applications, approveApplication, rejectApplication } = usePersonalityStore();
  const { quotas, currentQuota, updateQuota, resolveAlert, alerts } = useMonitorStore();
  const [activeTab, setActiveTab] = useState<'applications' | 'quota' | 'alerts'>('applications');
  const [rejectModal, setRejectModal] = useState<{ open: boolean; applicationId: string }>({
    open: false,
    applicationId: '',
  });
  const [rejectReason, setRejectReason] = useState('');
  const [quotaModal, setQuotaModal] = useState(false);
  const [newTotalCalls, setNewTotalCalls] = useState('');
  const [newWarningThreshold, setNewWarningThreshold] = useState('');

  const tabs = [
    { key: 'applications', label: '采购审批', icon: Users, count: applications.filter((a) => a.status === 'pending').length },
    { key: 'quota', label: '额度管理', icon: DollarSign },
    { key: 'alerts', label: '告警处理', icon: AlertTriangle, count: alerts.filter((a) => a.status === 'open').length },
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
      pending: { variant: 'warning' as const, icon: Clock, label: '待审批' },
      approved: { variant: 'success' as const, icon: CheckCircle, label: '已通过' },
      rejected: { variant: 'danger' as const, icon: XCircle, label: '已驳回' },
    };
    const config = configs[status];
    return (
      <Badge variant={config.variant}>
        {config.label}
      </Badge>
    );
  };

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
                <Button variant="outline" onClick={() => {
                  setNewTotalCalls(currentQuota.totalCalls.toString());
                  setNewWarningThreshold(currentQuota.warningThreshold.toString());
                  setQuotaModal(true);
                }}>
                  修改额度
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
                {quotas.map((quota) => (
                  <div key={quota.id} className="flex items-center justify-between p-4 bg-dark-50 rounded-xl">
                    <div>
                      <p className="font-medium text-dark-900">
                        {quota.companyId === 'c1' ? '科技创新集团' : `企业 ${quota.companyId}`}
                      </p>
                      <p className="text-sm text-dark-500">
                        {quota.usedCalls.toLocaleString()} / {quota.totalCalls.toLocaleString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-primary">
                        {((quota.usedCalls / quota.totalCalls) * 100).toFixed(0)}%
                      </p>
                      <p className="text-xs text-dark-400">使用率</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        )}

        {activeTab === 'alerts' && (
          <div className="space-y-4">
            <Card>
              <CardTitle className="mb-4">告警统计</CardTitle>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-red-50 rounded-xl">
                  <AlertTriangle className="w-8 h-8 text-red-500 mb-2" />
                  <p className="text-2xl font-bold text-red-600">
                    {alerts.filter((a) => a.type === 'anomaly').length}
                  </p>
                  <p className="text-sm text-red-500">异常告警</p>
                </div>
                <div className="p-4 bg-warning/10 rounded-xl">
                  <TrendingUp className="w-8 h-8 text-warning mb-2" />
                  <p className="text-2xl font-bold text-warning">
                    {alerts.filter((a) => a.type === 'quota_warning').length}
                  </p>
                  <p className="text-sm text-warning">额度预警</p>
                </div>
                <div className="p-4 bg-blue-50 rounded-xl">
                  <BarChart3 className="w-8 h-8 text-blue-600 mb-2" />
                  <p className="text-2xl font-bold text-blue-600">
                    {alerts.filter((a) => a.type === 'compliance').length}
                  </p>
                  <p className="text-sm text-blue-500">合规通知</p>
                </div>
              </div>
            </Card>

            <Card>
              <CardTitle className="mb-4">告警列表</CardTitle>
              <div className="space-y-3">
                {alerts.map((alert) => (
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
                                : 'info'
                            }
                          >
                            {alert.type === 'anomaly'
                              ? '异常'
                              : alert.type === 'quota_warning'
                              ? '额度'
                              : '合规'}
                          </Badge>
                          <Badge variant={alert.status === 'open' ? 'danger' : 'success'}>
                            {alert.status === 'open' ? '待处理' : '已解决'}
                          </Badge>
                        </div>
                        <p className="text-dark-700">{alert.description}</p>
                        <p className="text-xs text-dark-400 mt-1">
                          {new Date(alert.createdAt).toLocaleDateString('zh-CN')}
                        </p>
                      </div>
                      {alert.status === 'open' && (
                        <Button variant="outline" size="sm" onClick={() => resolveAlert(alert.id)}>
                          标记已解决
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
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
      </div>
    </PageContainer>
  );
}
