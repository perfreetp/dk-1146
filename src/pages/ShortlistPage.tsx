import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageContainer } from '../components/layout/PageContainer';
import { Card, CardTitle } from '../components/common/Card';
import { Badge, Button } from '../components/common/Badge';
import { Modal } from '../components/common/Modal';
import { Input, Textarea } from '../components/common/Input';
import { usePersonalityStore } from '../stores/personalityStore';
import { Star, Trash2, Send, Calendar, DollarSign, CheckCircle, Play } from 'lucide-react';

export function ShortlistPage() {
  const navigate = useNavigate();
  const { shortlist, removeFromShortlist, submitApplication } = usePersonalityStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [usage, setUsage] = useState('');
  const [expectedDate, setExpectedDate] = useState('');
  const [budget, setBudget] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const totalBudget = shortlist.reduce((sum, item) => sum + item.personality.price, 0);

  const handleSubmit = () => {
    if (!usage || !expectedDate || !budget) return;
    submitApplication(usage, expectedDate, parseInt(budget));
    setIsSubmitted(true);
    setTimeout(() => {
      setIsModalOpen(false);
      setIsSubmitted(false);
      setUsage('');
      setExpectedDate('');
      setBudget('');
    }, 2000);
  };

  const handleTrialAll = () => {
    if (shortlist.length > 0) {
      const ids = shortlist.map((s) => s.personalityId).join(',');
      navigate(`/compare?ids=${ids}`);
    }
  };

  return (
    <PageContainer>
      <div className="space-y-6 animate-fade-in">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-dark-900 mb-2">候选清单</h1>
            <p className="text-dark-500">
              已收藏 {shortlist.length} 个人格，总预算 ¥{totalBudget.toLocaleString()}
            </p>
          </div>
          <div className="flex gap-3">
            {shortlist.length > 1 && (
              <Button variant="outline" onClick={handleTrialAll}>
                <Play className="w-4 h-4 mr-2" />
                对比试用全部
              </Button>
            )}
            <Button
              variant="primary"
              onClick={() => setIsModalOpen(true)}
              disabled={shortlist.length === 0}
            >
              <Send className="w-4 h-4 mr-2" />
              提交采购申请
            </Button>
          </div>
        </div>

        {shortlist.length === 0 ? (
          <Card className="text-center py-16">
            <div className="w-20 h-20 bg-dark-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Star className="w-10 h-10 text-dark-400" />
            </div>
            <h3 className="text-xl font-semibold text-dark-900 mb-2">清单为空</h3>
            <p className="text-dark-500 mb-6 max-w-md mx-auto">
              您还没有添加任何人格到候选清单，去人格库看看吧！
            </p>
            <Button variant="primary" onClick={() => navigate('/personalities')}>
              浏览人格库
            </Button>
          </Card>
        ) : (
          <div className="space-y-4">
            {shortlist.map((item, index) => (
              <Card
                key={item.id}
                className="animate-slide-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex items-start gap-4">
                  <img
                    src={item.personality.avatar}
                    alt={item.personality.name}
                    className="w-20 h-20 rounded-xl object-cover bg-dark-50 flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="text-lg font-semibold text-dark-900">
                          {item.personality.name}
                        </h3>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="primary">
                            {item.personality.taskType === 'customer_service'
                              ? '客服'
                              : item.personality.taskType === 'sales'
                              ? '销售陪练'
                              : '培训讲师'}
                          </Badge>
                          <div className="flex items-center gap-1">
                            <Star className="w-4 h-4 text-yellow-400 fill-current" />
                            <span className="text-sm font-medium text-dark-700">
                              {item.personality.rating}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-primary">
                          ¥{item.personality.price.toLocaleString()}
                        </p>
                        <p className="text-sm text-dark-400">/月</p>
                      </div>
                    </div>
                    <p className="text-sm text-dark-600 line-clamp-2 mb-2">
                      {item.personality.description}
                    </p>
                    {item.notes && (
                      <p className="text-sm text-dark-400 italic mb-2">
                        备注：{item.notes}
                      </p>
                    )}
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2 text-xs text-dark-400">
                        <Calendar className="w-3 h-3" />
                        添加于 {new Date(item.addedAt).toLocaleDateString('zh-CN')}
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => navigate(`/compare?ids=${item.personalityId}`)}
                      >
                        <Play className="w-4 h-4 mr-1" />
                        试用此人格
                      </Button>
                    </div>
                  </div>
                  <button
                    onClick={() => removeFromShortlist(item.id)}
                    className="p-2 text-dark-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </Card>
            ))}

            <Card className="bg-gradient-to-br from-primary/5 to-accent/5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-white rounded-xl shadow-sm">
                    <DollarSign className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold text-dark-900">预估总费用</p>
                    <p className="text-sm text-dark-500">每月费用（不含折扣）</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-3xl font-bold text-primary">
                    ¥{totalBudget.toLocaleString()}
                  </p>
                  <p className="text-sm text-dark-400">/月</p>
                </div>
              </div>
            </Card>
          </div>
        )}

        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="提交采购申请" size="lg">
          {isSubmitted ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-accent" />
              </div>
              <h3 className="text-xl font-semibold text-dark-900 mb-2">申请已提交</h3>
              <p className="text-dark-500">请等待管理员审批</p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="bg-dark-50 rounded-xl p-4 mb-4">
                <p className="text-sm text-dark-500 mb-2">申请购买</p>
                <div className="flex flex-wrap gap-2">
                  {shortlist.map((item) => (
                    <Badge key={item.id} variant="primary">
                      {item.personality.name}
                    </Badge>
                  ))}
                </div>
              </div>

              <Textarea
                label="用途说明"
                placeholder="请详细描述采购这些AI人格的用途和使用场景..."
                rows={4}
                value={usage}
                onChange={(e) => setUsage(e.target.value)}
              />

              <div className="grid grid-cols-2 gap-4">
                <Input
                  type="date"
                  label="期望上线日期"
                  value={expectedDate}
                  onChange={(e) => setExpectedDate(e.target.value)}
                />
                <Input
                  type="number"
                  label="预算范围 (元)"
                  placeholder="请输入预算"
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                />
              </div>

              <div className="flex gap-3 pt-4 border-t border-dark-100">
                <Button variant="outline" className="flex-1" onClick={() => setIsModalOpen(false)}>
                  取消
                </Button>
                <Button
                  variant="primary"
                  className="flex-1"
                  onClick={handleSubmit}
                  disabled={!usage || !expectedDate || !budget}
                >
                  <Send className="w-4 h-4 mr-2" />
                  提交申请
                </Button>
              </div>
            </div>
          )}
        </Modal>
      </div>
    </PageContainer>
  );
}
