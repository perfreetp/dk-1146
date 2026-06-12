import { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { PageContainer } from '../components/layout/PageContainer';
import { QuestionInput } from '../components/comparison/QuestionInput';
import { ComparisonResult } from '../components/comparison/ComparisonResult';
import { Card } from '../components/common/Card';
import { Badge } from '../components/common/Badge';
import { usePersonalityStore } from '../stores/personalityStore';
import type { EvaluationResult, Personality } from '../types';
import { Check, Sparkles } from 'lucide-react';

export function ComparePage() {
  const [searchParams] = useSearchParams();
  const { personalities } = usePersonalityStore();
  const [selectedPersonalityIds, setSelectedPersonalityIds] = useState<string[]>([]);
  const [question, setQuestion] = useState('');
  const [results, setResults] = useState<EvaluationResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentUrlIds, setCurrentUrlIds] = useState<string | null>(null);

  useEffect(() => {
    const ids = searchParams.get('ids');
    const newIds = ids || null;

    if (newIds !== currentUrlIds) {
      setCurrentUrlIds(newIds);
      if (newIds) {
        const parsedIds = newIds.split(',').filter((id) => {
          const p = personalities.find((personality) => personality.id === id);
          return p && p.isActive;
        });
        if (parsedIds.length > 0) {
          setSelectedPersonalityIds(parsedIds);
        } else {
          setSelectedPersonalityIds([]);
        }
      } else {
        setSelectedPersonalityIds([]);
      }
    }
  }, [searchParams, personalities, currentUrlIds]);

  const allActivePersonalities = useMemo(() => {
    return personalities.filter((p) => p.isActive);
  }, [personalities]);

  const togglePersonality = (id: string) => {
    const personality = personalities.find((p) => p.id === id);
    if (!personality || !personality.isActive) return;

    setSelectedPersonalityIds((prev) =>
      prev.includes(id) ? prev.filter((pid) => pid !== id) : prev.length < 5 ? [...prev, id] : prev
    );
  };

  const generateAnswer = (personality: Personality, q: string): string => {
    const answers: Record<string, string> = {
      customer_service: `感谢您的咨询。关于"${q.slice(0, 10)}..."这个问题，我来为您详细解答。

首先，我会保持耐心和专业，仔细了解您的具体需求。在沟通过程中，我会：
1. 认真倾听您的问题和诉求
2. 提供清晰、准确的解决方案
3. 确保您完全理解处理方式
4. 主动跟进后续进展

如果您还有其他问题，请随时告诉我，我会竭诚为您服务！`,
      sales: `您好！很高兴为您解答。

关于"${q.slice(0, 10)}..."这个问题，我建议我们可以这样来处理：

【核心方案】
根据您的情况，我推荐您考虑我们的[产品/方案]，因为它能够完美满足您的需求，并且具有以下优势：
✓ 高性价比，帮您节省成本
✓ 专业团队全程支持
✓ 完善的售后服务体系

【限时优惠】
目前我们正在推出特别优惠活动，现在入手可以享受更多福利。请问您方便进一步沟通吗？`,
      training: `各位好！今天我们来探讨一下"${q.slice(0, 10)}..."这个问题。

【理论框架】
这个问题涉及以下几个核心知识点：
1. 基础知识要点
2. 实际应用场景
3. 常见问题解析

【案例分析】
让我们通过一个实际案例来理解：
[模拟案例场景...] 通过这个案例，我们可以看到...

【实践建议】
给大家几点建议：
• 建议一：打好基础
• 建议二：多实践
• 建议三：持续学习

有问题欢迎随时提问！`,
    };

    return answers[personality.taskType] || answers.customer_service;
  };

  const handleEvaluate = async (q: string) => {
    setQuestion(q);
    setIsLoading(true);
    setResults([]);

    await new Promise((resolve) => setTimeout(resolve, 1500));

    const evaluationResults: EvaluationResult[] = allActivePersonalities
      .filter((p) => selectedPersonalityIds.includes(p.id) && p.isActive)
      .map((personality) => ({
        personalityId: personality.id,
        personality,
        answer: generateAnswer(personality, q),
        scores: {
          accuracy: 85 + Math.floor(Math.random() * 15),
          professionalism: 80 + Math.floor(Math.random() * 18),
          friendliness: 88 + Math.floor(Math.random() * 10),
        },
      }));

    setResults(evaluationResults);
    setIsLoading(false);
  };

  const displayCount = selectedPersonalityIds.length > 0 ? selectedPersonalityIds.length : allActivePersonalities.length;
  const hasUrlParam = !!searchParams.get('ids');

  return (
    <PageContainer>
      <div className="space-y-6 animate-fade-in">
        <div>
          <h1 className="text-3xl font-bold text-dark-900 mb-2">评测对比</h1>
          <p className="text-dark-500">
            选择多个 AI 人格，输入同一问题，查看不同人格的回答差异
          </p>
        </div>

        <Card>
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="w-5 h-5 text-accent" />
            <h3 className="font-semibold text-dark-900">选择要对比的人格</h3>
            <Badge variant="info">{displayCount}/5</Badge>
            {hasUrlParam && (
              <Badge variant="success" className="ml-2">
                已从{selectedPersonalityIds.length > 1 ? '候选清单' : '人格详情'}选中
              </Badge>
            )}
          </div>

          {selectedPersonalityIds.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 mb-4">
              {selectedPersonalityIds.map((id) => {
                const personality = allActivePersonalities.find((p) => p.id === id);
                if (!personality) return null;
                return (
                  <button
                    key={personality.id}
                    onClick={() => togglePersonality(personality.id)}
                    className="p-3 rounded-xl border-2 border-primary bg-primary/5 transition-all text-left"
                  >
                    <div className="flex items-start gap-2">
                      <img
                        src={personality.avatar}
                        alt={personality.name}
                        className="w-10 h-10 rounded-lg object-cover bg-dark-50"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-dark-900 text-sm truncate">{personality.name}</p>
                        <p className="text-xs text-dark-400 truncate">
                          {personality.taskType === 'customer_service'
                            ? '客服'
                            : personality.taskType === 'sales'
                            ? '销售'
                            : '培训'}
                        </p>
                      </div>
                      <div className="w-5 h-5 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
                        <Check className="w-3 h-3 text-white" />
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          ) : null}

          <div className="border-t border-dark-100 pt-4">
            <p className="text-sm text-dark-500 mb-3">
              {selectedPersonalityIds.length > 0
                ? '点击下方人格可临时增减（最多选择5个）'
                : '请从下方选择人格进行对比（最多5个）'}
            </p>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
              {allActivePersonalities.map((personality) => {
                const isSelected = selectedPersonalityIds.includes(personality.id);
                const isDisabled = !personality.isActive || (selectedPersonalityIds.length >= 5 && !isSelected);
                return (
                  <button
                    key={personality.id}
                    onClick={() => togglePersonality(personality.id)}
                    disabled={isDisabled}
                    className={`p-3 rounded-xl border-2 transition-all text-left ${
                      isDisabled
                        ? 'border-dark-100 opacity-50 cursor-not-allowed bg-dark-50'
                        : isSelected
                        ? 'border-primary bg-primary/5'
                        : 'border-dark-100 hover:border-dark-200'
                    }`}
                  >
                    <div className="flex items-start gap-2">
                      <img
                        src={personality.avatar}
                        alt={personality.name}
                        className="w-10 h-10 rounded-lg object-cover bg-dark-50"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-dark-900 text-sm truncate">
                          {personality.name}
                          {isDisabled && !personality.isActive && <span className="text-red-500 ml-1">(已停用)</span>}
                        </p>
                        <p className="text-xs text-dark-400 truncate">
                          {personality.taskType === 'customer_service'
                            ? '客服'
                            : personality.taskType === 'sales'
                            ? '销售'
                            : '培训'}
                        </p>
                      </div>
                      {isSelected && (
                        <div className="w-5 h-5 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
                          <Check className="w-3 h-3 text-white" />
                        </div>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <p className="text-sm text-dark-400 mt-3">
            {selectedPersonalityIds.length > 0
              ? `已选中 ${selectedPersonalityIds.length} 个人格，点击上方选中的人格可取消选择`
              : `共 ${allActivePersonalities.length} 个活跃人格可选择`}
          </p>
        </Card>

        <QuestionInput onEvaluate={handleEvaluate} isLoading={isLoading} />

        {results.length > 0 && <ComparisonResult results={results} question={question} />}

        {results.length === 0 && (
          <Card className="text-center py-12">
            <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Sparkles className="w-8 h-8 text-accent" />
            </div>
            <h3 className="text-lg font-semibold text-dark-900 mb-2">开始您的评测</h3>
            <p className="text-dark-500 max-w-md mx-auto">
              {selectedPersonalityIds.length > 0
                ? `已选择 ${selectedPersonalityIds.length} 个人格，请输入您的问题开始评测`
                : hasUrlParam
                ? `已选择 ${allActivePersonalities.length} 个人格，请输入您的问题开始评测`
                : '请先选择 2-5 个想要对比的 AI 人格，然后输入您的问题，系统将生成各人格的回答供您对比分析'}
            </p>
          </Card>
        )}
      </div>
    </PageContainer>
  );
}
