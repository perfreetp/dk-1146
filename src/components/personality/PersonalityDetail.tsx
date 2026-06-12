import { useNavigate } from 'react-router-dom';
import type { Personality } from '../../types';
import { Modal } from '../common/Modal';
import { Badge, ComplianceBadge } from '../common/Badge';
import { Button } from '../common/Button';
import { Star, CheckCircle2, Play } from 'lucide-react';
import { usePersonalityStore } from '../../stores/personalityStore';

interface PersonalityDetailProps {
  personality: Personality | null;
  isOpen: boolean;
  onClose: () => void;
}

export function PersonalityDetail({ personality, isOpen, onClose }: PersonalityDetailProps) {
  const navigate = useNavigate();
  const { shortlist, addToShortlist, removeFromShortlist } = usePersonalityStore();

  if (!personality) return null;

  const isInShortlist = shortlist.some((s) => s.personalityId === personality.id);

  const handleToggleShortlist = () => {
    if (isInShortlist) {
      const item = shortlist.find((s) => s.personalityId === personality.id);
      if (item) removeFromShortlist(item.id);
    } else {
      addToShortlist(personality.id);
    }
  };

  const handleStartTrial = () => {
    navigate(`/compare?ids=${personality.id}`);
    onClose();
  };

  const handleTrialWithShortlist = () => {
    const shortlistIds = shortlist.map((s) => s.personalityId);
    if (shortlistIds.length > 0) {
      navigate(`/compare?ids=${[personality.id, ...shortlistIds].slice(0, 5).join(',')}`);
    } else {
      navigate(`/compare?ids=${personality.id}`);
    }
    onClose();
  };

  const taskTypeLabels = {
    customer_service: '客服',
    sales: '销售陪练',
    training: '培训讲师',
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={personality.name} size="xl">
      <div className="space-y-6">
        <div className="flex gap-6">
          <div className="relative flex-shrink-0">
            <img
              src={personality.avatar}
              alt={personality.name}
              className={`w-32 h-32 rounded-xl object-cover bg-dark-50 ${
                !personality.isActive ? 'opacity-50' : ''
              }`}
            />
            {!personality.isActive && (
              <div className="absolute inset-0 bg-black/50 rounded-xl flex items-center justify-center">
                <span className="text-white text-sm font-medium">已停用</span>
              </div>
            )}
          </div>

          <div className="flex-1">
            <div className="flex items-center gap-3 mb-3">
              <Badge variant="primary">{taskTypeLabels[personality.taskType]}</Badge>
              <ComplianceBadge level={personality.complianceLevel} />
              <Badge variant="info">{personality.responseStyle}</Badge>
            </div>
            <p className="text-dark-600 mb-4">{personality.description}</p>
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-1">
                <Star className="w-5 h-5 text-yellow-400 fill-current" />
                <span className="text-lg font-bold text-dark-900">{personality.rating}</span>
                <span className="text-sm text-dark-400">(4.8分)</span>
              </div>
              <div className="flex items-center gap-1 text-dark-500">
                <span>{(personality.monthlyCalls / 1000).toFixed(0)}K 月调用</span>
              </div>
              <div className="text-2xl font-bold text-primary">
                ¥{personality.price.toLocaleString()}
                <span className="text-sm font-normal text-dark-400">/月</span>
              </div>
            </div>
          </div>
        </div>

        <div>
          <h4 className="font-semibold text-dark-900 mb-3">标签</h4>
          <div className="flex flex-wrap gap-2">
            {personality.tags.map((tag) => (
              <span
                key={tag}
                className="px-3 py-1 bg-dark-50 text-dark-700 text-sm rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        <div>
          <h4 className="font-semibold text-dark-900 mb-3">核心能力</h4>
          <div className="grid grid-cols-2 gap-3">
            {personality.capabilities.map((cap) => (
              <div key={cap} className="flex items-center gap-2 text-dark-600">
                <CheckCircle2 className="w-4 h-4 text-accent flex-shrink-0" />
                <span>{cap}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-dark-50 rounded-card p-4">
          <h4 className="font-semibold text-dark-900 mb-2">评测报告摘要</h4>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-dark-500 mb-1">准确度</p>
              <div className="flex items-center gap-2">
                <div className="flex-1 h-2 bg-dark-200 rounded-full overflow-hidden">
                  <div className="h-full bg-accent rounded-full" style={{ width: '92%' }} />
                </div>
                <span className="text-sm font-medium text-dark-900">92%</span>
              </div>
            </div>
            <div>
              <p className="text-sm text-dark-500 mb-1">专业度</p>
              <div className="flex items-center gap-2">
                <div className="flex-1 h-2 bg-dark-200 rounded-full overflow-hidden">
                  <div className="h-full bg-primary rounded-full" style={{ width: '88%' }} />
                </div>
                <span className="text-sm font-medium text-dark-900">88%</span>
              </div>
            </div>
            <div>
              <p className="text-sm text-dark-500 mb-1">友好度</p>
              <div className="flex items-center gap-2">
                <div className="flex-1 h-2 bg-dark-200 rounded-full overflow-hidden">
                  <div className="h-full bg-warning rounded-full" style={{ width: '95%' }} />
                </div>
                <span className="text-sm font-medium text-dark-900">95%</span>
              </div>
            </div>
          </div>
        </div>

        {personality.isActive ? (
          <div className="flex gap-3 pt-4 border-t border-dark-100">
            <Button variant="primary" size="lg" className="flex-1" onClick={handleStartTrial}>
              <Play className="w-5 h-5 mr-2" />
              发起试用
            </Button>
            {shortlist.length > 0 && (
              <Button variant="secondary" size="lg" onClick={handleTrialWithShortlist}>
                与候选人格对比 ({shortlist.length})
              </Button>
            )}
            <Button
              variant={isInShortlist ? 'secondary' : 'outline'}
              size="lg"
              onClick={handleToggleShortlist}
            >
              {isInShortlist ? '已加入清单' : '加入候选'}
            </Button>
          </div>
        ) : (
          <div className="flex gap-3 pt-4 border-t border-dark-100">
            <Button variant="secondary" size="lg" className="flex-1" disabled>
              该人格已停用
            </Button>
          </div>
        )}
      </div>
    </Modal>
  );
}
