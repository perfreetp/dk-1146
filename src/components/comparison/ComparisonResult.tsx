import type { EvaluationResult } from '../../types';
import { Card } from '../common/Card';
import { Badge, ComplianceBadge } from '../common/Badge';
import { Star, ThumbsUp, ThumbsDown } from 'lucide-react';

interface ComparisonResultProps {
  results: EvaluationResult[];
  question: string;
}

export function ComparisonResult({ results, question }: ComparisonResultProps) {
  if (results.length === 0) return null;

  return (
    <div className="mt-6">
      <div className="mb-4">
        <h3 className="font-semibold text-dark-900 mb-2">问题：</h3>
        <p className="text-dark-600 bg-dark-50 px-4 py-3 rounded-lg">{question}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {results.map((result, index) => (
          <Card key={result.personalityId} className="animate-fade-in" style={{ animationDelay: `${index * 100}ms` }}>
            <div className="flex items-start gap-4 mb-4">
              <img
                src={result.personality.avatar}
                alt={result.personality.name}
                className="w-12 h-12 rounded-xl object-cover bg-dark-50"
              />
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h4 className="font-semibold text-dark-900">{result.personality.name}</h4>
                  <ComplianceBadge level={result.personality.complianceLevel} />
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <Star className="w-4 h-4 text-yellow-400 fill-current" />
                  <span className="text-sm font-medium text-dark-700">{result.personality.rating}</span>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-primary/5 to-accent/5 rounded-xl p-4 mb-4">
              <h5 className="text-sm font-medium text-dark-500 mb-2">AI 回答：</h5>
              <p className="text-dark-700 leading-relaxed whitespace-pre-wrap">{result.answer}</p>
            </div>

            <div className="space-y-3">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-dark-600">准确度</span>
                  <span className="text-sm font-medium text-dark-900">{result.scores.accuracy}%</span>
                </div>
                <div className="h-2 bg-dark-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-accent rounded-full transition-all duration-500"
                    style={{ width: `${result.scores.accuracy}%` }}
                  />
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-dark-600">专业度</span>
                  <span className="text-sm font-medium text-dark-900">{result.scores.professionalism}%</span>
                </div>
                <div className="h-2 bg-dark-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary rounded-full transition-all duration-500"
                    style={{ width: `${result.scores.professionalism}%` }}
                  />
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-dark-600">友好度</span>
                  <span className="text-sm font-medium text-dark-900">{result.scores.friendliness}%</span>
                </div>
                <div className="h-2 bg-dark-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-warning rounded-full transition-all duration-500"
                    style={{ width: `${result.scores.friendliness}%` }}
                  />
                </div>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-dark-100 flex gap-3">
              <button className="flex-1 flex items-center justify-center gap-2 py-2 text-dark-500 hover:text-accent hover:bg-accent/5 rounded-lg transition-colors">
                <ThumbsUp className="w-4 h-4" />
                <span className="text-sm">满意</span>
              </button>
              <button className="flex-1 flex items-center justify-center gap-2 py-2 text-dark-500 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                <ThumbsDown className="w-4 h-4" />
                <span className="text-sm">不满意</span>
              </button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
