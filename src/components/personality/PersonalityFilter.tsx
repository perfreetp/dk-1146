import { industries, taskTypes, complianceLevels, responseStyles } from '../../data/mockData';
import { Select, SearchInput } from '../common/Input';
import { usePersonalityStore } from '../../stores/personalityStore';
import { Filter, X } from 'lucide-react';

export function PersonalityFilter() {
  const { filters, setFilter } = usePersonalityStore();

  const sortOptions = [
    { value: 'rating', label: '综合评分' },
    { value: 'monthlyCalls', label: '月调用量' },
    { value: 'price', label: '价格从低到高' },
    { value: 'newest', label: '最新上架' },
  ];

  const hasFilters =
    filters.industry || filters.taskType || filters.complianceLevel || filters.responseStyle || filters.search;

  const clearFilters = () => {
    setFilter('industry', undefined);
    setFilter('taskType', undefined);
    setFilter('complianceLevel', undefined);
    setFilter('responseStyle', undefined);
    setFilter('search', undefined);
  };

  return (
    <div className="bg-white rounded-card shadow-card p-6 mb-6">
      <div className="flex items-center gap-4 mb-4">
        <div className="flex items-center gap-2 text-dark-700">
          <Filter className="w-5 h-5" />
          <span className="font-medium">筛选条件</span>
        </div>
        {hasFilters && (
          <button
            onClick={clearFilters}
            className="ml-auto text-sm text-primary hover:text-primary-600 flex items-center gap-1"
          >
            <X className="w-4 h-4" />
            清除筛选
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <SearchInput
          placeholder="搜索人格名称..."
          value={filters.search || ''}
          onChange={(e) => setFilter('search', e.target.value)}
        />

        <Select
          options={[{ value: '全部', label: '全部行业' }, ...industries.map((i) => ({ value: i, label: i }))]}
          value={filters.industry || '全部'}
          onChange={(e) => setFilter('industry', e.target.value === '全部' ? undefined : e.target.value)}
        />

        <Select
          options={[{ value: '全部', label: '全部任务' }, ...taskTypes.map((t) => ({ value: t.value, label: t.label }))]}
          value={filters.taskType || '全部'}
          onChange={(e) => setFilter('taskType', e.target.value === '全部' ? undefined : e.target.value)}
        />

        <Select
          options={[{ value: '全部', label: '全部合规等级' }, ...complianceLevels.map((c) => ({ value: c.value, label: c.label }))]}
          value={filters.complianceLevel || '全部'}
          onChange={(e) =>
            setFilter('complianceLevel', e.target.value === '全部' ? undefined : e.target.value)
          }
        />

        <Select
          options={[{ value: '全部', label: '全部风格' }, ...responseStyles.map((r) => ({ value: r, label: r }))]}
          value={filters.responseStyle || '全部'}
          onChange={(e) =>
            setFilter('responseStyle', e.target.value === '全部' ? undefined : e.target.value)
          }
        />
      </div>

      <div className="mt-4 flex items-center gap-4">
        <span className="text-sm text-dark-500">排序方式：</span>
        <div className="flex gap-2">
          {sortOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => setFilter('sortBy', option.value as any)}
              className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
                filters.sortBy === option.value
                  ? 'bg-primary text-white'
                  : 'text-dark-600 hover:bg-dark-50'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
