import type { Template } from '@/types'
import { PLANNER_TYPE_PAGES, DEFAULT_CONFIG, makeBlock, makePage } from './defaults'

const cfg = (overrides: object) => ({ ...DEFAULT_CONFIG, ...overrides })

export const TEMPLATES: Template[] = [
  // ── DAILY ──────────────────────────────────────────────────────────────────
  {
    id: 'tpl_daily_minimal', name: 'Minimal Daily', type: 'daily',
    description: 'Clean, structured daily planner with time blocks and reflection.',
    thumbnail: '', category: 'Daily', tags: ['minimal', 'clean', 'productivity'],
    pages: PLANNER_TYPE_PAGES.daily(), isFavorite: false, isPremium: false, downloads: 4821,
    accentHue: '220', config: cfg({ primaryColor: '#0F172A', accentColor: '#E2E8F0' }),
  },
  {
    id: 'tpl_daily_sage', name: 'Sage Daily', type: 'daily',
    description: 'Nature-inspired daily planner in calming sage and forest tones.',
    thumbnail: '', category: 'Daily', tags: ['sage', 'nature', 'calm'],
    pages: PLANNER_TYPE_PAGES.daily(), isFavorite: false, isPremium: false, downloads: 2941,
    accentHue: '150', config: cfg({ primaryColor: '#1A3A2A', secondaryColor: '#52796F', accentColor: '#CAD2C5' }),
  },
  {
    id: 'tpl_daily_executive', name: 'Executive Daily', type: 'daily',
    description: 'Power planner for executives — priority matrix, meetings, and EOD review.',
    thumbnail: '', category: 'Daily', tags: ['executive', 'business', 'leadership'],
    pages: PLANNER_TYPE_PAGES.daily(), isFavorite: false, isPremium: true, downloads: 3204,
    accentHue: '215', config: cfg({ primaryColor: '#0C2340', accentColor: '#B8D4E8' }),
  },
  {
    id: 'tpl_daily_rose', name: 'Rose Daily', type: 'daily',
    description: 'Elegant daily planner in rose and blush for a warm, personal feel.',
    thumbnail: '', category: 'Daily', tags: ['rose', 'elegant', 'feminine'],
    pages: PLANNER_TYPE_PAGES.daily(), isFavorite: false, isPremium: false, downloads: 1872,
    accentHue: '345', config: cfg({ primaryColor: '#4A1942', secondaryColor: '#9D174D', accentColor: '#FBCFE8' }),
  },
  {
    id: 'tpl_daily_ink', name: 'Ink Daily', type: 'daily',
    description: 'Bold monochrome daily planner with strong typographic hierarchy.',
    thumbnail: '', category: 'Daily', tags: ['bold', 'monochrome', 'minimal'],
    pages: PLANNER_TYPE_PAGES.daily(), isFavorite: false, isPremium: false, downloads: 1540,
    accentHue: '0', config: cfg({ primaryColor: '#0D0D0D', secondaryColor: '#404040', accentColor: '#D4D4D4' }),
  },

  // ── WEEKLY ─────────────────────────────────────────────────────────────────
  {
    id: 'tpl_weekly_classic', name: 'Classic Weekly', type: 'weekly',
    description: 'Timeless 7-day column layout with goal tracking and notes.',
    thumbnail: '', category: 'Weekly', tags: ['classic', 'structured', 'weekly'],
    pages: PLANNER_TYPE_PAGES.weekly(), isFavorite: false, isPremium: false, downloads: 5241,
    accentHue: '220', config: cfg({ primaryColor: '#0F172A', accentColor: '#E2E8F0' }),
  },
  {
    id: 'tpl_weekly_blush', name: 'Blush Weekly', type: 'weekly',
    description: 'Soft blush and dusty pink weekly planner with elegant styling.',
    thumbnail: '', category: 'Weekly', tags: ['blush', 'feminine', 'elegant'],
    pages: PLANNER_TYPE_PAGES.weekly(), isFavorite: false, isPremium: true, downloads: 2198,
    accentHue: '345', config: cfg({ primaryColor: '#4A1942', accentColor: '#F5D0CA' }),
  },
  {
    id: 'tpl_weekly_indigo', name: 'Indigo Weekly', type: 'weekly',
    description: 'Vibrant indigo-accented weekly planner with bold section headers.',
    thumbnail: '', category: 'Weekly', tags: ['indigo', 'bold', 'colorful'],
    pages: PLANNER_TYPE_PAGES.weekly(), isFavorite: false, isPremium: false, downloads: 1784,
    accentHue: '245', config: cfg({ primaryColor: '#1E1B4B', secondaryColor: '#4338CA', accentColor: '#C7D2FE' }),
  },

  // ── MONTHLY ────────────────────────────────────────────────────────────────
  {
    id: 'tpl_monthly_classic', name: 'Monthly Overview', type: 'monthly',
    description: 'Full calendar page with monthly goals and habit tracker.',
    thumbnail: '', category: 'Monthly', tags: ['calendar', 'monthly', 'overview'],
    pages: PLANNER_TYPE_PAGES.monthly(), isFavorite: false, isPremium: false, downloads: 6102,
    accentHue: '215', config: cfg({ primaryColor: '#0C2340', accentColor: '#B8D4E8' }),
  },
  {
    id: 'tpl_monthly_gold', name: 'Gold Monthly', type: 'monthly',
    description: 'Warm gold and amber monthly calendar with rich typographic style.',
    thumbnail: '', category: 'Monthly', tags: ['gold', 'warm', 'premium'],
    pages: PLANNER_TYPE_PAGES.monthly(), isFavorite: false, isPremium: true, downloads: 2341,
    accentHue: '43', config: cfg({ primaryColor: '#3D1A08', secondaryColor: '#A07840', accentColor: '#E8D5B4' }),
  },

  // ── HABIT ──────────────────────────────────────────────────────────────────
  {
    id: 'tpl_habit_grid', name: 'Habit Grid', type: 'habit',
    description: 'Track up to 12 habits with a visual monthly grid and progress bar.',
    thumbnail: '', category: 'Tracker', tags: ['habits', 'grid', 'streak'],
    pages: PLANNER_TYPE_PAGES.habit(), isFavorite: false, isPremium: false, downloads: 7501,
    accentHue: '262', config: cfg({ primaryColor: '#2D1B69', secondaryColor: '#6B5B95', accentColor: '#D4C5F9' }),
  },
  {
    id: 'tpl_habit_sage', name: 'Botanical Habits', type: 'habit',
    description: 'Calming sage-toned habit tracker with monthly reflection section.',
    thumbnail: '', category: 'Tracker', tags: ['sage', 'botanical', 'calm'],
    pages: PLANNER_TYPE_PAGES.habit(), isFavorite: false, isPremium: false, downloads: 2189,
    accentHue: '150', config: cfg({ primaryColor: '#1A3A2A', secondaryColor: '#52796F', accentColor: '#CAD2C5' }),
  },

  // ── BUDGET ─────────────────────────────────────────────────────────────────
  {
    id: 'tpl_budget_master', name: 'Budget Master', type: 'budget',
    description: 'Complete monthly budget with income, expenses, and savings tracking.',
    thumbnail: '', category: 'Finance', tags: ['budget', 'finance', 'savings'],
    pages: PLANNER_TYPE_PAGES.budget(), isFavorite: false, isPremium: false, downloads: 8304,
    accentHue: '145', config: cfg({ primaryColor: '#1A2E1A', secondaryColor: '#3D6B41', accentColor: '#B9D4BC' }),
  },
  {
    id: 'tpl_budget_minimalist', name: 'Zero-Based Budget', type: 'budget',
    description: 'Zero-based budgeting template for tracking every dollar.',
    thumbnail: '', category: 'Finance', tags: ['zero-based', 'strict', 'finance'],
    pages: PLANNER_TYPE_PAGES.budget(), isFavorite: false, isPremium: true, downloads: 3841,
    accentHue: '220', config: cfg({ primaryColor: '#0F172A', accentColor: '#E2E8F0' }),
  },

  // ── WELLNESS ────────────────────────────────────────────────────────────────
  {
    id: 'tpl_wellness_daily', name: 'Wellness Daily', type: 'wellness',
    description: 'Holistic daily wellness — mood, water, sleep, meals, and gratitude.',
    thumbnail: '', category: 'Wellness', tags: ['wellness', 'health', 'mood'],
    pages: PLANNER_TYPE_PAGES.wellness(), isFavorite: false, isPremium: false, downloads: 4987,
    accentHue: '330', config: cfg({ primaryColor: '#4A1942', secondaryColor: '#C0695C', accentColor: '#F5D0CA' }),
  },
  {
    id: 'tpl_wellness_teal', name: 'Calm & Clear', type: 'wellness',
    description: 'Teal-toned wellness tracker with mindfulness and self-care focus.',
    thumbnail: '', category: 'Wellness', tags: ['teal', 'mindfulness', 'calm'],
    pages: PLANNER_TYPE_PAGES.wellness(), isFavorite: false, isPremium: false, downloads: 2140,
    accentHue: '175', config: cfg({ primaryColor: '#042F2E', secondaryColor: '#0D9488', accentColor: '#99F6E4' }),
  },

  // ── FITNESS ────────────────────────────────────────────────────────────────
  {
    id: 'tpl_fitness_log', name: 'Workout Log', type: 'fitness',
    description: 'Log exercises, sets, reps, and personal records with clean formatting.',
    thumbnail: '', category: 'Fitness', tags: ['fitness', 'workout', 'gym'],
    pages: PLANNER_TYPE_PAGES.fitness(), isFavorite: false, isPremium: false, downloads: 3671,
    accentHue: '220', config: cfg({ primaryColor: '#0D0D0D', accentColor: '#D4D4D4' }),
  },
  {
    id: 'tpl_fitness_running', name: 'Running Log', type: 'fitness',
    description: 'Dedicated running tracker with mileage, pace, and route notes.',
    thumbnail: '', category: 'Fitness', tags: ['running', 'cardio', 'mileage'],
    pages: PLANNER_TYPE_PAGES.fitness(), isFavorite: false, isPremium: false, downloads: 1823,
    accentHue: '12', config: cfg({ primaryColor: '#7C2D12', secondaryColor: '#C2410C', accentColor: '#FED7AA' }),
  },

  // ── STUDENT ────────────────────────────────────────────────────────────────
  {
    id: 'tpl_student_success', name: 'Student Success', type: 'student',
    description: 'Academic daily planner with class schedule, assignments, and study goals.',
    thumbnail: '', category: 'Academic', tags: ['student', 'school', 'academic'],
    pages: PLANNER_TYPE_PAGES.student(), isFavorite: false, isPremium: false, downloads: 6456,
    accentHue: '33', config: cfg({ primaryColor: '#3D1A08', secondaryColor: '#A07840', accentColor: '#F2C49B' }),
  },
  {
    id: 'tpl_student_exam', name: 'Exam Study Plan', type: 'student',
    description: 'Focused exam preparation planner with countdown and topic tracker.',
    thumbnail: '', category: 'Academic', tags: ['exam', 'study', 'revision'],
    pages: PLANNER_TYPE_PAGES.student(), isFavorite: false, isPremium: false, downloads: 3102,
    accentHue: '245', config: cfg({ primaryColor: '#1E1B4B', secondaryColor: '#4338CA', accentColor: '#C7D2FE' }),
  },
  {
    id: 'tpl_student_semester', name: 'Semester Planner', type: 'student',
    description: 'Full semester overview with weekly spreads and grade tracking.',
    thumbnail: '', category: 'Academic', tags: ['semester', 'university', 'schedule'],
    pages: PLANNER_TYPE_PAGES.student(), isFavorite: false, isPremium: true, downloads: 4201,
    accentHue: '175', config: cfg({ primaryColor: '#042F2E', secondaryColor: '#0D9488', accentColor: '#99F6E4' }),
  },

  // ── BUSINESS ────────────────────────────────────────────────────────────────
  {
    id: 'tpl_business_pro', name: 'Business Pro', type: 'business',
    description: 'Professional daily planner with priority matrix and project tracking.',
    thumbnail: '', category: 'Business', tags: ['business', 'professional', 'projects'],
    pages: PLANNER_TYPE_PAGES.business(), isFavorite: false, isPremium: true, downloads: 9231,
    accentHue: '220', config: cfg({ primaryColor: '#0F172A', accentColor: '#E2E8F0' }),
  },
  {
    id: 'tpl_business_startup', name: 'Startup Planner', type: 'business',
    description: 'Fast-paced startup planner with OKRs, sprint goals, and meetings.',
    thumbnail: '', category: 'Business', tags: ['startup', 'okr', 'agile'],
    pages: PLANNER_TYPE_PAGES.business(), isFavorite: false, isPremium: true, downloads: 4102,
    accentHue: '262', config: cfg({ primaryColor: '#2D1B69', secondaryColor: '#6366F1', accentColor: '#C7D2FE' }),
  },
  {
    id: 'tpl_business_freelance', name: 'Freelance Planner', type: 'business',
    description: 'Client tracking, project management, and invoice log for freelancers.',
    thumbnail: '', category: 'Business', tags: ['freelance', 'client', 'invoice'],
    pages: PLANNER_TYPE_PAGES.business(), isFavorite: false, isPremium: false, downloads: 5820,
    accentHue: '43', config: cfg({ primaryColor: '#451A03', secondaryColor: '#B45309', accentColor: '#FDE68A' }),
  },

  // ── JOURNAL ────────────────────────────────────────────────────────────────
  {
    id: 'tpl_journal_morning', name: 'Morning Pages', type: 'journal',
    description: 'Daily morning journaling with brain dump and intention setting.',
    thumbnail: '', category: 'Journal', tags: ['morning', 'journaling', 'mindfulness'],
    pages: PLANNER_TYPE_PAGES.journal(), isFavorite: false, isPremium: false, downloads: 3891,
    accentHue: '33', config: cfg({ primaryColor: '#451A03', secondaryColor: '#B45309', accentColor: '#FDE68A' }),
  },
  {
    id: 'tpl_journal_gratitude', name: 'Gratitude Journal', type: 'journal',
    description: 'Dedicated gratitude practice journal with daily and weekly prompts.',
    thumbnail: '', category: 'Journal', tags: ['gratitude', 'positivity', 'mindfulness'],
    pages: PLANNER_TYPE_PAGES.journal(), isFavorite: false, isPremium: false, downloads: 5102,
    accentHue: '330', config: cfg({ primaryColor: '#4A1942', secondaryColor: '#9D174D', accentColor: '#FBCFE8' }),
  },
  {
    id: 'tpl_journal_5year', name: '5-Year Journal', type: 'journal',
    description: 'Reflect, set goals, and track your journey across 5 years.',
    thumbnail: '', category: 'Journal', tags: ['long-term', 'reflection', '5-year'],
    pages: PLANNER_TYPE_PAGES.journal(), isFavorite: false, isPremium: true, downloads: 2341,
    accentHue: '262', config: cfg({ primaryColor: '#2D1B69', secondaryColor: '#6B5B95', accentColor: '#D4C5F9' }),
  },

  // ── CREATIVE ────────────────────────────────────────────────────────────────
  {
    id: 'tpl_creative_content', name: 'Content Calendar', type: 'creative',
    description: 'Social media content planning with platform tracking and post ideas.',
    thumbnail: '', category: 'Creative', tags: ['content', 'social media', 'calendar'],
    pages: PLANNER_TYPE_PAGES.creative(), isFavorite: false, isPremium: false, downloads: 4502,
    accentHue: '262', config: cfg({ primaryColor: '#2D1B69', secondaryColor: '#6366F1', accentColor: '#C7D2FE' }),
  },
  {
    id: 'tpl_creative_design', name: 'Design Sprint', type: 'creative',
    description: 'Product design sprint planner with research, ideation, and testing phases.',
    thumbnail: '', category: 'Creative', tags: ['design', 'sprint', 'ux'],
    pages: PLANNER_TYPE_PAGES.creative(), isFavorite: false, isPremium: true, downloads: 2102,
    accentHue: '175', config: cfg({ primaryColor: '#042F2E', secondaryColor: '#0D9488', accentColor: '#99F6E4' }),
  },
  {
    id: 'tpl_creative_story', name: 'Story Planner', type: 'creative',
    description: 'Novel and story planning with character sheets, plot arcs, and chapter outlines.',
    thumbnail: '', category: 'Creative', tags: ['writing', 'novel', 'story'],
    pages: PLANNER_TYPE_PAGES.creative(), isFavorite: false, isPremium: false, downloads: 3241,
    accentHue: '33', config: cfg({ primaryColor: '#3D1A08', secondaryColor: '#A07840', accentColor: '#E8D5B4' }),
  },

  // ── LIFE PLANNING ───────────────────────────────────────────────────────────
  {
    id: 'tpl_life_yearreview', name: 'Year in Review', type: 'journal',
    description: 'Annual reflection and goal-setting for the year ahead.',
    thumbnail: '', category: 'Life', tags: ['year', 'review', 'goals', 'reflection'],
    pages: PLANNER_TYPE_PAGES.journal(), isFavorite: false, isPremium: false, downloads: 6891,
    accentHue: '220', config: cfg({ primaryColor: '#0F172A', accentColor: '#E2E8F0' }),
  },
  {
    id: 'tpl_life_quarter', name: 'Quarter Goals', type: 'business',
    description: 'OKR-style quarterly goal setting with weekly milestones.',
    thumbnail: '', category: 'Life', tags: ['quarter', 'goals', 'okr'],
    pages: PLANNER_TYPE_PAGES.business(), isFavorite: false, isPremium: false, downloads: 3510,
    accentHue: '150', config: cfg({ primaryColor: '#1A2E1A', secondaryColor: '#3D6B41', accentColor: '#B9D4BC' }),
  },
  {
    id: 'tpl_life_travel', name: 'Travel Planner', type: 'creative',
    description: 'Trip planning with itinerary, packing list, and budget tracking.',
    thumbnail: '', category: 'Life', tags: ['travel', 'itinerary', 'packing'],
    pages: PLANNER_TYPE_PAGES.creative(), isFavorite: false, isPremium: false, downloads: 7102,
    accentHue: '215', config: cfg({ primaryColor: '#0C2340', secondaryColor: '#1B5E8C', accentColor: '#B8D4E8' }),
  },
]

export const TEMPLATE_CATEGORIES = [
  'All', 'Daily', 'Weekly', 'Monthly',
  'Tracker', 'Finance', 'Wellness', 'Fitness',
  'Academic', 'Business', 'Journal', 'Creative', 'Life',
]
