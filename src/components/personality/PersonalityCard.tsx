import { useNavigate } from 'react-router-dom';
import type { Personality } from '../../types';
import { Card } from '../common/Card';
import { Badge, ComplianceBadge } from '../common/Badge';
import { Button } from '../common/Button';
import { Star, Bookmark } from 'lucide-react';
import { usePersonalityStore } from '../../stores/personalityStore';

interface PersonalityCardProps {
  personality: Personality;
  onView?: (id: string) => void;
}

export function PersonalityCard({ personality, onView }: PersonalityCardProps) {
  const navigate = useNavigate();
  const { shortlist, addToShortlist, removeFromShortlist } = usePersonalityStore();
  const isInShortlist = shortlist.some((s) => s.personalityId === personality.id);

  const handleToggleShortlist = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!personality.isActive) return;

    if (isInShortlist) {
      const item = shortlist.find((s) => s.personalityId === personality.id);
      if (item) removeFromShortlist(item.id);
    } else {
      addToShortlist(personality.id);
    }
  };

  const handleTrial = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!personality.isActive) return;
    navigate(`/compare?ids=${personality.id}`);
    onView?.(personality.id);
  };

  const taskTypeLabels = {
    customer_service: '客服',
    sales: '销售陪练',
    training: '培训讲师',
  };

  return (
    <Card
      hover={personality.isActive}
      className={`cursor-pointer group ${!personality.isActive ? 'opacity-75' : ''}`}
      onClick={() => onView?.(personality.id)}
    >
      <div className="flex gap-4">
        <div className="relative flex-shrink-0">
          <img
            src={personality.avatar}
            alt={personality.name}
            className={`w-20 h-20 rounded-xl object-cover bg-dark-50 ${
              !personality.isActive ? 'opacity-50' : ''
            }`}
          />
          {!personality.isActive && (
            <div className="absolute inset-0 bg-black/50 rounded-xl flex items-center justify-center">
              <span className="text-white text-xs font-medium">已停用</span>
            </div>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between mb-2">
            <div>
              <h3 className={`text-lg font-bold group-hover:text-primary transition-colors ${
                personality.isActive ? 'text-dark-900' : 'text-dark-500'
              }`}>
                {personality.name}
              </h3>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="primary">{taskTypeLabels[personality.taskType]}</Badge>
                <ComplianceBadge level={personality.complianceLevel} />
              </div>
            </div>
            {personality.isActive && (
              <button
                onClick={handleToggleShortlist}
                className={`p-2 rounded-lg transition-all ${
                  isInShortlist
                    ? 'text-accent bg-accent/10 hover:bg-accent/20'
                    : 'text-dark-400 hover:text-accent hover:bg-accent/5'
                }`}
              >
                <Bookmark className={`w-5 h-5 ${isInShortlist ? 'fill-current' : ''}`} />
              </button>
            )}
          </div>

          <p className={`text-sm line-clamp-2 mb-3 ${personality.isActive ? 'text-dark-600' : 'text-dark-400'}`}>
            {personality.description}
          </p>

          <div className="flex flex-wrap gap-1.5 mb-3">
            {personality.tags.map((tag) => (
              <span
                key={tag}
                className={`px-2 py-0.5 text-xs rounded-full ${
                  personality.isActive ? 'bg-dark-50 text-dark-600' : 'bg-dark-100 text-dark-400'
                }`}
              >
                {tag}
              </span>
            ))}
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-1">
                <Star className={`w-4 h-4 ${personality.isActive ? 'text-yellow-400 fill-current' : 'text-dark-300'}`} />
                <span className={`font-medium ${personality.isActive ? 'text-dark-900' : 'text-dark-400'}`}>
                  {personality.rating}
                </span>
              </div>
              <span className={personality.isActive ? 'text-dark-500' : 'text-dark-400'}>
                {(personality.monthlyCalls / 1000).toFixed(0)}K/月
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className={`text-lg font-bold ${personality.isActive ? 'text-primary' : 'text-dark-400'}`}>
                ¥{personality.price.toLocaleString()}
              </span>
              <span className="text-xs text-dark-400">/月</span>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-dark-100 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
        {personality.isActive ? (
          <>
            <Button
              variant="primary"
              size="sm"
              className="flex-1"
              onClick={handleTrial}
            >
              发起试用
            </Button>
            <Button
              variant={isInShortlist ? 'secondary' : 'outline'}
              size="sm"
              onClick={handleToggleShortlist}
            >
              <Bookmark className={`w-4 h-4 mr-1 ${isInShortlist ? 'fill-current' : ''}`} />
              {isInShortlist ? '已添加' : '加入清单'}
            </Button>
          </>
        ) : (
          <Button variant="secondary" size="sm" className="flex-1" disabled>
            该人格已停用
          </Button>
        )}
      </div>
    </Card>
  );
}
