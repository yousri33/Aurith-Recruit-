// Mock Data for Aurith Recruit Demo
// All data is hardcoded for UI/UX prototyping

export interface Candidate {
  id: string
  name: string
  position: string
  score: number
  badge: 'green' | 'yellow' | 'red'
  skills: string[]
  education: string[]
  experience: { role: string; company: string; years: number }[]
  gaps: string[]
  flags: string[]
  matchPercentage: number
}

export interface Folder {
  id: string
  name: string
  jobTitle: string
  cvCount: number
  createdAt: string
  candidates: Candidate[]
}

export interface PipelineResult {
  folderId: string
  jobTitle: string
  jobDescription: string
  requiredSkills: string[]
  yearsExperience: number
  language: string
  rankedCandidates: Candidate[]
  totalProcessed: number
  timestamp: string
}

export const mockUser = {
  id: 'user-1',
  email: 'yousri@aurith.dz',
  name: 'Yousri Meziani',
  language: 'fr',
}

// 9 Mock Candidates distributed across folders
export const mockCandidates: Record<string, Candidate[]> = {
  'folder-1': [ // Backend Engineer folder
    {
      id: 'c1',
      name: 'Ahmed Hassan',
      position: 'Senior Backend Developer',
      score: 92,
      badge: 'green',
      skills: ['Node.js', 'PostgreSQL', 'Docker', 'AWS', 'TypeScript'],
      education: ['BSc Computer Science', 'Advanced SQL Certification'],
      experience: [
        { role: 'Senior Backend Developer', company: 'TechCorp', years: 5 },
        { role: 'Backend Developer', company: 'StartupXYZ', years: 3 },
      ],
      gaps: [],
      flags: [],
      matchPercentage: 92,
    },
    {
      id: 'c2',
      name: 'Fatima Ouali',
      position: 'Full Stack Developer',
      score: 78,
      badge: 'yellow',
      skills: ['React', 'Node.js', 'MongoDB', 'AWS'],
      education: ['BSc Software Engineering'],
      experience: [
        { role: 'Full Stack Developer', company: 'WebAgency', years: 4 },
      ],
      gaps: ['Advanced PostgreSQL', 'Docker experience'],
      flags: ['Limited backend focus', 'First time in senior role'],
      matchPercentage: 78,
    },
    {
      id: 'c3',
      name: 'Karim Belgaid',
      position: 'Junior Backend Developer',
      score: 41,
      badge: 'red',
      skills: ['Python', 'Flask', 'MySQL'],
      education: ['Bootcamp - Web Development'],
      experience: [
        { role: 'Junior Backend Developer', company: 'SmallAgency', years: 1 },
      ],
      gaps: ['No TypeScript experience', 'No AWS experience', 'Limited database scaling knowledge'],
      flags: ['Entry-level candidate', 'Bootcamp training', 'No senior role experience'],
      matchPercentage: 41,
    },
  ],
  'folder-2': [ // Sales folder
    {
      id: 'c4',
      name: 'Leila Benmessaoud',
      position: 'Senior Account Executive',
      score: 89,
      badge: 'green',
      skills: ['B2B Sales', 'CRM Management', 'Negotiation', 'Account Strategy', 'Team Leadership'],
      education: ['MBA Business Administration', 'BAc Economics'],
      experience: [
        { role: 'Regional Sales Director', company: 'Enterprise Solutions Inc', years: 8 },
        { role: 'Account Executive', company: 'SaaS Startup', years: 4 },
      ],
      gaps: [],
      flags: [],
      matchPercentage: 89,
    },
    {
      id: 'c5',
      name: 'Mahmoud Cherif',
      position: 'Sales Manager',
      score: 72,
      badge: 'yellow',
      skills: ['Sales Management', 'Team Building', 'CRM', 'Forecasting'],
      education: ['Bachelor of Commerce'],
      experience: [
        { role: 'Sales Manager', company: 'Retail Corp', years: 6 },
      ],
      gaps: ['Limited B2B enterprise experience', 'No international sales'],
      flags: ['Background in retail sales, not SaaS', 'Need onboarding for enterprise sales'],
      matchPercentage: 72,
    },
    {
      id: 'c6',
      name: 'Noor Hamza',
      position: 'Sales Representative',
      score: 58,
      badge: 'yellow',
      skills: ['Sales', 'Customer Service', 'Basic CRM'],
      education: ['Associate Degree Business'],
      experience: [
        { role: 'Sales Representative', company: 'E-Commerce Platform', years: 2 },
      ],
      gaps: ['No account management experience', 'Limited SaaS knowledge', 'No team management'],
      flags: ['Junior candidate', 'E-commerce background, not B2B'],
      matchPercentage: 58,
    },
  ],
  'folder-3': [ // Marketing Intern folder
    {
      id: 'c7',
      name: 'Sophia Djelloul',
      position: 'Marketing Intern',
      score: 85,
      badge: 'green',
      skills: ['Social Media', 'Content Writing', 'Analytics', 'SEO Basics', 'Canva'],
      education: ['Currently pursuing MSc Marketing', 'BAc Communications'],
      experience: [
        { role: 'Marketing Intern', company: 'Digital Agency', years: 0.5 },
      ],
      gaps: [],
      flags: [],
      matchPercentage: 85,
    },
    {
      id: 'c8',
      name: 'Yassine Benmahdjoub',
      position: 'Content Creator',
      score: 76,
      badge: 'yellow',
      skills: ['Content Creation', 'Video Editing', 'Social Media', 'Copywriting'],
      education: ['Self-taught Digital Creator'],
      experience: [
        { role: 'Freelance Content Creator', company: 'Self-Employed', years: 2 },
      ],
      gaps: ['No formal marketing training', 'Limited analytics knowledge'],
      flags: ['Self-taught, no agency experience', 'Freelance background'],
      matchPercentage: 76,
    },
    {
      id: 'c9',
      name: 'Imen Korichi',
      position: 'Student',
      score: 52,
      badge: 'yellow',
      skills: ['Social Media', 'Basic Writing'],
      education: ['Currently pursuing BAc Marketing'],
      experience: [],
      gaps: ['No professional experience', 'Limited marketing tools knowledge', 'No analytics'],
      flags: ['Full-time student', 'No professional experience', 'Will need significant training'],
      matchPercentage: 52,
    },
  ],
}

export const mockFolders: Folder[] = [
  {
    id: 'folder-1',
    name: 'Backend Engineer',
    jobTitle: 'Senior Backend Engineer',
    cvCount: 3,
    createdAt: '2025-03-10',
    candidates: mockCandidates['folder-1'],
  },
  {
    id: 'folder-2',
    name: 'Sales Manager',
    jobTitle: 'Senior Account Executive',
    cvCount: 3,
    createdAt: '2025-03-05',
    candidates: mockCandidates['folder-2'],
  },
  {
    id: 'folder-3',
    name: 'Marketing Intern',
    jobTitle: 'Marketing Intern',
    cvCount: 3,
    createdAt: '2025-03-01',
    candidates: mockCandidates['folder-3'],
  },
]

export const mockPipelineResult: PipelineResult = {
  folderId: 'folder-1',
  jobTitle: 'Senior Backend Engineer',
  jobDescription: 'Looking for a senior backend engineer with 5+ years of experience in Node.js, PostgreSQL, and AWS.',
  requiredSkills: ['Node.js', 'PostgreSQL', 'AWS', 'Docker'],
  yearsExperience: 5,
  language: 'en',
  rankedCandidates: mockCandidates['folder-1'],
  totalProcessed: 3,
  timestamp: new Date().toISOString(),
}

export const mockDashboardMetrics = {
  totalFolders: 3,
  totalCandidates: 9,
  averageScore: 72,
  completedPipelines: 1,
}

export const mockRecentActivity = [
  { id: '1', type: 'pipeline_completed', folder: 'Backend Engineer', score: 92, timestamp: '2025-03-15T10:30:00Z' },
  { id: '2', type: 'cv_uploaded', folder: 'Sales Manager', count: 3, timestamp: '2025-03-05T14:20:00Z' },
  { id: '3', type: 'folder_created', folder: 'Marketing Intern', timestamp: '2025-03-01T09:15:00Z' },
]
