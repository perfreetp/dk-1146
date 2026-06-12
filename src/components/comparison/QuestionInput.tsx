import { useState } from 'react';
import { Textarea } from '../common/Input';
import { Button } from '../common/Button';
import { Send, Sparkles } from 'lucide-react';

interface QuestionInputProps {
  onEvaluate: (question: string) => void;
  isLoading?: boolean;
}

export function QuestionInput({ onEvaluate, isLoading }: QuestionInputProps) {
  const [question, setQuestion] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (question.trim()) {
      onEvaluate(question.trim());
    }
  };

  const templates = [
    '产品缺货时如何安抚客户？',
    '如何向客户推荐高价商品？',
    '处理客户投诉的标准流程是什么？',
    '新员工培训应该包含哪些内容？',
  ];

  return (
    <div className="bg-white rounded-card shadow-card p-6">
      <div className="flex items-center gap-2 mb-4">
        <Sparkles className="w-5 h-5 text-accent" />
        <h3 className="font-semibold text-dark-900">输入您的问题</h3>
      </div>

      <form onSubmit={handleSubmit}>
        <Textarea
          placeholder="请输入您想要测试的问题，例如：产品缺货时如何安抚客户？"
          rows={4}
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          className="mb-4"
        />

        <div className="flex items-center justify-between">
          <div className="flex flex-wrap gap-2">
            <span className="text-sm text-dark-400">快速模板：</span>
            {templates.map((template) => (
              <button
                key={template}
                type="button"
                onClick={() => setQuestion(template)}
                className="text-sm text-primary hover:text-primary-600"
              >
                {template}
              </button>
            ))}
          </div>
          <Button type="submit" disabled={!question.trim() || isLoading}>
            <Send className="w-4 h-4 mr-2" />
            {isLoading ? '评测中...' : '开始评测'}
          </Button>
        </div>
      </form>
    </div>
  );
}
