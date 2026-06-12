import { useState } from 'react';
import { PageContainer } from '../components/layout/PageContainer';
import { PersonalityCard } from '../components/personality/PersonalityCard';
import { PersonalityFilter } from '../components/personality/PersonalityFilter';
import { PersonalityDetail } from '../components/personality/PersonalityDetail';
import { usePersonalityStore } from '../stores/personalityStore';

export function PersonalityLibraryPage() {
  const { filteredPersonalities, selectedPersonality, selectPersonality, clearSelection } =
    usePersonalityStore();

  return (
    <PageContainer>
      <div className="space-y-6 animate-fade-in">
        <div>
          <h1 className="text-3xl font-bold text-dark-900 mb-2">人格库</h1>
          <p className="text-dark-500">
            浏览并筛选适合您业务场景的 AI 人格，已收录 {filteredPersonalities.length} 个优质人格
          </p>
        </div>

        <PersonalityFilter />

        {filteredPersonalities.length === 0 ? (
          <div className="bg-white rounded-card shadow-card p-12 text-center">
            <div className="w-16 h-16 bg-dark-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-dark-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-dark-900 mb-2">未找到匹配的人格</h3>
            <p className="text-dark-500 mb-4">请尝试调整筛选条件</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredPersonalities.map((personality, index) => (
              <div
                key={personality.id}
                className="animate-slide-up"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <PersonalityCard
                  personality={personality}
                  onView={selectPersonality}
                />
              </div>
            ))}
          </div>
        )}

        <PersonalityDetail
          personality={selectedPersonality}
          isOpen={!!selectedPersonality}
          onClose={clearSelection}
        />
      </div>
    </PageContainer>
  );
}
