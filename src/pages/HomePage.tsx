import { Link } from 'react-router-dom';
import { PageContainer } from '../components/layout/PageContainer';
import { Card, CardTitle } from '../components/common/Card';
import { Badge } from '../components/common/Badge';
import { Button } from '../components/common/Button';
import { StatsCard } from '../components/monitor/StatsCard';
import { UsageChart } from '../components/monitor/UsageChart';
import { useAuthStore } from '../stores/authStore';
import { useMonitorStore } from '../stores/monitorStore';
import { usePersonalityStore } from '../stores/personalityStore';
import {
  Phone,
  Users,
  Star,
  ClipboardList,
  ArrowRight,
  Play,
  Bookmark,
  BarChart3,
  Zap,
} from 'lucide-react';

export function HomePage() {
  const { user, company } = useAuthStore();
  const { usageStats } = useMonitorStore();
  const { personalities, applications, shortlist } = usePersonalityStore();

  const recommendedPersonality = personalities.slice(0, 4);
  const pendingApplications = applications.filter((a) => a.status === 'pending');

  return (
    <PageContainer>
      <div className="space-y-8 animate-fade-in">
        <div>
          <h1 className="text-3xl font-bold text-dark-900 mb-2">
            欢迎回来，{user?.name}
          </h1>
          <p className="text-dark-500">
            {company?.name} · {company?.industry}行业 · {new Date().toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatsCard
            title="本月调用量"
            value={(usageStats.totalCalls / 1000).toFixed(1) + 'K'}
            change="+12.5% 较上月"
            changeType="positive"
            icon={Phone}
            color="primary"
          />
          <StatsCard
            title="活跃人格"
            value={usageStats.activePersonas}
            change="共 5 个人格"
            changeType="neutral"
            icon={Users}
            color="accent"
          />
          <StatsCard
            title="平均满意度"
            value={usageStats.avgSatisfaction.toFixed(1)}
            change="+0.3 较上月"
            changeType="positive"
            icon={Star}
            color="warning"
          />
          <StatsCard
            title="待处理审批"
            value={usageStats.pendingApprovals}
            change={pendingApplications.length > 0 ? '需要处理' : '暂无待处理'}
            changeType={pendingApplications.length > 0 ? 'negative' : 'positive'}
            icon={ClipboardList}
            color="info"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <UsageChart data={usageStats} />
          </div>

          <Card>
            <CardTitle className="mb-4">快捷操作</CardTitle>
            <div className="space-y-3">
              <Link
                to="/personalities"
                className="flex items-center justify-between p-4 bg-primary/5 hover:bg-primary/10 rounded-xl transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Zap className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-dark-900">浏览人格库</p>
                    <p className="text-sm text-dark-500">发现更多AI人格</p>
                  </div>
                </div>
                <ArrowRight className="w-5 h-5 text-dark-400 group-hover:text-primary transition-colors" />
              </Link>

              <Link
                to="/compare"
                className="flex items-center justify-between p-4 bg-accent/5 hover:bg-accent/10 rounded-xl transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-accent/10 rounded-lg">
                    <Play className="w-5 h-5 text-accent" />
                  </div>
                  <div>
                    <p className="font-medium text-dark-900">发起评测</p>
                    <p className="text-sm text-dark-500">对比不同人格回答</p>
                  </div>
                </div>
                <ArrowRight className="w-5 h-5 text-dark-400 group-hover:text-accent transition-colors" />
              </Link>

              <Link
                to="/shortlist"
                className="flex items-center justify-between p-4 bg-warning/5 hover:bg-warning/10 rounded-xl transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-warning/10 rounded-lg">
                    <Bookmark className="w-5 h-5 text-warning" />
                  </div>
                  <div>
                    <p className="font-medium text-dark-900">候选清单</p>
                    <p className="text-sm text-dark-500">
                      {shortlist.length} 个人格待采购
                    </p>
                  </div>
                </div>
                <ArrowRight className="w-5 h-5 text-dark-400 group-hover:text-warning transition-colors" />
              </Link>

              <Link
                to="/monitor"
                className="flex items-center justify-between p-4 bg-blue-50 hover:bg-blue-100 rounded-xl transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <BarChart3 className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium text-dark-900">使用监控</p>
                    <p className="text-sm text-dark-500">查看详细数据</p>
                  </div>
                </div>
                <ArrowRight className="w-5 h-5 text-dark-400 group-hover:text-blue-600 transition-colors" />
              </Link>
            </div>
          </Card>
        </div>

        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-dark-900">推荐人格</h2>
            <Link to="/personalities" className="text-primary hover:text-primary-600 font-medium flex items-center gap-1">
              查看全部
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {recommendedPersonality.map((personality, index) => (
              <Card
                key={personality.id}
                hover
                className="animate-slide-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex items-start gap-3 mb-3">
                  <img
                    src={personality.avatar}
                    alt={personality.name}
                    className="w-14 h-14 rounded-xl object-cover bg-dark-50"
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-dark-900 truncate">{personality.name}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="primary" className="text-xs">
                        {personality.taskType === 'customer_service' ? '客服' : personality.taskType === 'sales' ? '销售' : '培训'}
                      </Badge>
                      <div className="flex items-center gap-1">
                        <Star className="w-3 h-3 text-yellow-400 fill-current" />
                        <span className="text-xs font-medium text-dark-700">{personality.rating}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <p className="text-sm text-dark-600 line-clamp-2 mb-3">{personality.description}</p>
                <div className="flex items-center justify-between">
                  <div className="flex flex-wrap gap-1">
                    {personality.tags.slice(0, 2).map((tag) => (
                      <span key={tag} className="px-2 py-0.5 bg-dark-50 text-dark-500 text-xs rounded-full">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <span className="text-lg font-bold text-primary">
                    ¥{personality.price.toLocaleString()}
                  </span>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {pendingApplications.length > 0 && (
          <Card>
            <CardTitle className="mb-4">待处理审批</CardTitle>
            <div className="space-y-3">
              {pendingApplications.map((app) => (
                <div
                  key={app.id}
                  className="flex items-center justify-between p-4 bg-dark-50 rounded-xl"
                >
                  <div>
                    <p className="font-medium text-dark-900">{app.userName} 的采购申请</p>
                    <p className="text-sm text-dark-500 mt-1">
                      {app.items.length} 个人格 · 预算 ¥{app.budget.toLocaleString()}
                    </p>
                  </div>
                  <Link to="/admin">
                    <Button variant="primary" size="sm">
                      去处理
                    </Button>
                  </Link>
                </div>
              ))}
            </div>
          </Card>
        )}
      </div>
    </PageContainer>
  );
}
