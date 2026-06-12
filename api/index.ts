import express from 'express';
import cors from 'cors';
import { mockPersonalities, mockShortlists, mockApplications, mockUsageStats, mockAlerts, mockQuotas, mockEmployeeUsage, mockUsers } from '../src/data/mockData';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.get('/api/auth/me', (req, res) => {
  res.json({ user: mockUsers[0], company: { id: 'c1', name: '科技创新集团', industry: '科技' } });
});

app.get('/api/personalities', (req, res) => {
  const { industry, taskType, complianceLevel, responseStyle, search, sortBy, page = 1, pageSize = 20 } = req.query;
  
  let filtered = [...mockPersonalities];

  if (industry && industry !== '全部') {
    filtered = filtered.filter(p => p.industry === industry);
  }
  if (taskType && taskType !== '全部') {
    filtered = filtered.filter(p => p.taskType === taskType);
  }
  if (complianceLevel && complianceLevel !== '全部') {
    filtered = filtered.filter(p => p.complianceLevel === complianceLevel);
  }
  if (responseStyle && responseStyle !== '全部') {
    filtered = filtered.filter(p => p.responseStyle === responseStyle);
  }
  if (search) {
    const searchLower = (search as string).toLowerCase();
    filtered = filtered.filter(p => 
      p.name.toLowerCase().includes(searchLower) ||
      p.description.toLowerCase().includes(searchLower) ||
      p.tags.some(t => t.toLowerCase().includes(searchLower))
    );
  }

  if (sortBy) {
    switch (sortBy) {
      case 'rating':
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case 'monthlyCalls':
        filtered.sort((a, b) => b.monthlyCalls - a.monthlyCalls);
        break;
      case 'price':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'newest':
        filtered.sort((a, b) => a.id.localeCompare(b.id));
        break;
    }
  }

  const startIndex = (Number(page) - 1) * Number(pageSize);
  const endIndex = startIndex + Number(pageSize);
  const paginatedData = filtered.slice(startIndex, endIndex);

  res.json({
    data: paginatedData,
    total: filtered.length,
    page: Number(page),
    pageSize: Number(pageSize),
    totalPages: Math.ceil(filtered.length / Number(pageSize))
  });
});

app.get('/api/personalities/:id', (req, res) => {
  const personality = mockPersonalities.find(p => p.id === req.params.id);
  if (!personality) {
    return res.status(404).json({ error: 'Personality not found' });
  }
  res.json(personality);
});

app.get('/api/shortlist', (req, res) => {
  res.json(mockShortlists);
});

app.post('/api/shortlist', (req, res) => {
  const { personalityId, notes } = req.body;
  const personality = mockPersonalities.find(p => p.id === personalityId);
  if (!personality) {
    return res.status(404).json({ error: 'Personality not found' });
  }
  const newItem = {
    id: `s${Date.now()}`,
    userId: 'u1',
    personalityId,
    personality,
    notes: notes || '',
    addedAt: new Date().toISOString().split('T')[0]
  };
  mockShortlists.push(newItem);
  res.json(newItem);
});

app.delete('/api/shortlist/:id', (req, res) => {
  const index = mockShortlists.findIndex(s => s.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ error: 'Item not found' });
  }
  mockShortlists.splice(index, 1);
  res.json({ success: true });
});

app.get('/api/applications', (req, res) => {
  res.json(mockApplications);
});

app.post('/api/applications', (req, res) => {
  const { usage, expectedDate, budget, itemIds } = req.body;
  const newApplication = {
    id: `a${Date.now()}`,
    userId: 'u1',
    userName: '张明',
    items: itemIds.map((personalityId: string, index: number) => {
      const personality = mockPersonalities.find(p => p.id === personalityId);
      return {
        id: `ai${Date.now()}_${index}`,
        applicationId: `a${Date.now()}`,
        personalityId,
        personality,
        quantity: 1
      };
    }),
    usage,
    expectedDate,
    budget,
    status: 'pending' as const,
    createdAt: new Date().toISOString().split('T')[0]
  };
  mockApplications.unshift(newApplication);
  res.json(newApplication);
});

app.patch('/api/applications/:id/approve', (req, res) => {
  const app = mockApplications.find(a => a.id === req.params.id);
  if (!app) {
    return res.status(404).json({ error: 'Application not found' });
  }
  app.status = 'approved';
  res.json(app);
});

app.patch('/api/applications/:id/reject', (req, res) => {
  const { reason } = req.body;
  const app = mockApplications.find(a => a.id === req.params.id);
  if (!app) {
    return res.status(404).json({ error: 'Application not found' });
  }
  app.status = 'rejected';
  app.rejectionReason = reason;
  res.json(app);
});

app.get('/api/monitor/stats', (req, res) => {
  res.json(mockUsageStats);
});

app.get('/api/monitor/employees', (req, res) => {
  res.json(mockEmployeeUsage);
});

app.get('/api/monitor/alerts', (req, res) => {
  res.json(mockAlerts);
});

app.patch('/api/monitor/alerts/:id/resolve', (req, res) => {
  const alert = mockAlerts.find(a => a.id === req.params.id);
  if (!alert) {
    return res.status(404).json({ error: 'Alert not found' });
  }
  alert.status = 'resolved';
  alert.resolvedAt = new Date().toISOString().split('T')[0];
  res.json(alert);
});

app.get('/api/admin/quotas', (req, res) => {
  res.json(mockQuotas);
});

app.patch('/api/admin/quotas/:id', (req, res) => {
  const { totalCalls, warningThreshold } = req.body;
  const quota = mockQuotas.find(q => q.id === req.params.id);
  if (!quota) {
    return res.status(404).json({ error: 'Quota not found' });
  }
  if (totalCalls !== undefined) quota.totalCalls = totalCalls;
  if (warningThreshold !== undefined) quota.warningThreshold = warningThreshold;
  res.json(quota);
});

app.post('/api/evaluate', (req, res) => {
  const { question, personalityIds } = req.body;
  
  const generateAnswer = (personality: typeof mockPersonalities[0], q: string): string => {
    const answers: Record<string, string> = {
      customer_service: `感谢您的咨询。关于"${q.slice(0, 10)}..."这个问题，我来为您详细解答。首先，我会保持耐心和专业，仔细了解您的具体需求。\n\n1. 认真倾听您的问题和诉求\n2. 提供清晰、准确的解决方案\n3. 确保您完全理解处理方式\n4. 主动跟进后续进展\n\n如果您还有其他问题，请随时告诉我，我会竭诚为您服务！`,
      sales: `您好！很高兴为您解答。\n\n【核心方案】根据您的情况，我推荐您考虑我们的产品/方案，因为它能够完美满足您的需求。\n\n✓ 高性价比，帮您节省成本\n✓ 专业团队全程支持\n✓ 完善的售后服务体系\n\n请问您方便进一步沟通吗？`,
      training: `各位好！今天我们来探讨一下"${q.slice(0, 10)}..."这个问题。\n\n【理论框架】这个问题涉及核心知识点、实际应用场景、常见问题解析。\n\n【实践建议】给大家几点建议：\n• 建议一：打好基础\n• 建议二：多实践\n• 建议三：持续学习\n\n有问题欢迎随时提问！`,
    };
    return answers[personality.taskType] || answers.customer_service;
  };

  const results = personalityIds.map((id: string) => {
    const personality = mockPersonalities.find(p => p.id === id);
    if (!personality) return null;
    
    return {
      personalityId: id,
      personality,
      answer: generateAnswer(personality, question),
      scores: {
        accuracy: 85 + Math.floor(Math.random() * 15),
        professionalism: 80 + Math.floor(Math.random() * 18),
        friendliness: 88 + Math.floor(Math.random() * 10),
      }
    };
  }).filter(Boolean);

  res.json({ results, question });
});

app.listen(PORT, () => {
  console.log(`API Server running on http://localhost:${PORT}`);
});
