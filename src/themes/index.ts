// ─── Theme Engine ─────────────────────────────────────────────────────────────

export interface Theme {
  id: string
  name: string
  emoji: string
  description: string
  colors: {
    primary: string
    secondary: string
    accent: string
    surface: string
    background: string
    text: string
    muted: string
    border: string
    highlight: string
  }
  fonts: {
    heading: string
    body: string
    accent: string
  }
  gradient: string
  patternColor: string
  coverStyle: 'minimal' | 'elegant' | 'bold' | 'floral' | 'dark' | 'warm' | 'cosmic'
  decorations: {
    dividerStyle: string
    borderAccent: string
    headerDecoration: string
  }
}

export const THEMES: Record<string, Theme> = {
  minimalist: {
    id: 'minimalist',
    name: 'Minimalist',
    emoji: '⬜',
    description: 'Clean lines, pure focus, zero distraction',
    colors: {
      primary: '#0F172A',
      secondary: '#64748B',
      accent: '#334155',
      surface: '#F8FAFC',
      background: '#FFFFFF',
      text: '#0F172A',
      muted: '#94A3B8',
      border: '#E2E8F0',
      highlight: '#F1F5F9',
    },
    fonts: { heading: 'Plus Jakarta Sans', body: 'Inter', accent: 'Inter' },
    gradient: 'linear-gradient(135deg, #F8FAFC 0%, #E2E8F0 100%)',
    patternColor: '#0F172A',
    coverStyle: 'minimal',
    decorations: {
      dividerStyle: 'solid',
      borderAccent: '#334155',
      headerDecoration: 'underline',
    },
  },

  boho: {
    id: 'boho',
    name: 'Boho',
    emoji: '🌿',
    description: 'Earthy warmth, natural textures, free spirit',
    colors: {
      primary: '#5C4033',
      secondary: '#8D6E63',
      accent: '#D4A26A',
      surface: '#FDF6EC',
      background: '#FFFDF7',
      text: '#3E2723',
      muted: '#A1887F',
      border: '#D7CCC8',
      highlight: '#FFF8E1',
    },
    fonts: { heading: 'Playfair Display', body: 'Inter', accent: 'Playfair Display' },
    gradient: 'linear-gradient(135deg, #FFF8E1 0%, #FFE0B2 60%, #FFCCBC 100%)',
    patternColor: '#5C4033',
    coverStyle: 'warm',
    decorations: {
      dividerStyle: 'dashed',
      borderAccent: '#D4A26A',
      headerDecoration: 'leaf',
    },
  },

  floral: {
    id: 'floral',
    name: 'Floral Garden',
    emoji: '🌸',
    description: 'Soft petals, romantic blooms, feminine grace',
    colors: {
      primary: '#6B2737',
      secondary: '#C2185B',
      accent: '#F06292',
      surface: '#FFF0F5',
      background: '#FFFFFF',
      text: '#4A0E1F',
      muted: '#F48FB1',
      border: '#FCCCD7',
      highlight: '#FCE4EC',
    },
    fonts: { heading: 'Playfair Display', body: 'Inter', accent: 'Playfair Display' },
    gradient: 'linear-gradient(135deg, #FCE4EC 0%, #F8BBD9 50%, #E1BEE7 100%)',
    patternColor: '#6B2737',
    coverStyle: 'floral',
    decorations: {
      dividerStyle: 'dotted',
      borderAccent: '#F06292',
      headerDecoration: 'floral',
    },
  },

  cottagecore: {
    id: 'cottagecore',
    name: 'Cottagecore',
    emoji: '🍄',
    description: 'Rustic charm, wildflowers, cozy countryside',
    colors: {
      primary: '#33691E',
      secondary: '#558B2F',
      accent: '#8BC34A',
      surface: '#F1F8E9',
      background: '#FAFFF5',
      text: '#1B5E20',
      muted: '#81C784',
      border: '#C5E1A5',
      highlight: '#DCEDC8',
    },
    fonts: { heading: 'Playfair Display', body: 'Inter', accent: 'Playfair Display' },
    gradient: 'linear-gradient(135deg, #DCEDC8 0%, #C5E1A5 60%, #F0F4C3 100%)',
    patternColor: '#33691E',
    coverStyle: 'warm',
    decorations: {
      dividerStyle: 'dashed',
      borderAccent: '#8BC34A',
      headerDecoration: 'leaf',
    },
  },

  kawaii: {
    id: 'kawaii',
    name: 'Kawaii',
    emoji: '🌈',
    description: 'Playful pastels, cute vibes, joyful energy',
    colors: {
      primary: '#AD1457',
      secondary: '#EC407A',
      accent: '#FF80AB',
      surface: '#FFF1F7',
      background: '#FFFFFF',
      text: '#880E4F',
      muted: '#F48FB1',
      border: '#F8BBD9',
      highlight: '#FCE4EC',
    },
    fonts: { heading: 'Plus Jakarta Sans', body: 'Inter', accent: 'Inter' },
    gradient: 'linear-gradient(135deg, #FCE4EC 0%, #F3E5F5 33%, #E1F5FE 66%, #E8F5E9 100%)',
    patternColor: '#AD1457',
    coverStyle: 'floral',
    decorations: {
      dividerStyle: 'dotted',
      borderAccent: '#FF80AB',
      headerDecoration: 'stars',
    },
  },

  galaxy: {
    id: 'galaxy',
    name: 'Space Galaxy',
    emoji: '🌌',
    description: 'Cosmic depths, star clusters, infinite wonder',
    colors: {
      primary: '#E8D5FF',
      secondary: '#B39DDB',
      accent: '#7C4DFF',
      surface: '#1A0533',
      background: '#0D0121',
      text: '#E8D5FF',
      muted: '#7E57C2',
      border: '#3D1A6E',
      highlight: '#261445',
    },
    fonts: { heading: 'Plus Jakarta Sans', body: 'Inter', accent: 'Inter' },
    gradient: 'linear-gradient(135deg, #0D0121 0%, #1A0533 40%, #0D1B4B 70%, #150533 100%)',
    patternColor: '#E8D5FF',
    coverStyle: 'cosmic',
    decorations: {
      dividerStyle: 'solid',
      borderAccent: '#7C4DFF',
      headerDecoration: 'stars',
    },
  },

  darkAcademia: {
    id: 'darkAcademia',
    name: 'Dark Academia',
    emoji: '📚',
    description: 'Scholarly depths, worn leather, candlelit pages',
    colors: {
      primary: '#2C1810',
      secondary: '#5D4037',
      accent: '#8D6E63',
      surface: '#FFF8F0',
      background: '#FFFDF8',
      text: '#1A0E07',
      muted: '#795548',
      border: '#D7CCC8',
      highlight: '#EFEBE9',
    },
    fonts: { heading: 'Playfair Display', body: 'Inter', accent: 'Playfair Display' },
    gradient: 'linear-gradient(135deg, #EFEBE9 0%, #D7CCC8 50%, #BCAAA4 100%)',
    patternColor: '#2C1810',
    coverStyle: 'elegant',
    decorations: {
      dividerStyle: 'double',
      borderAccent: '#8D6E63',
      headerDecoration: 'underline',
    },
  },

  pastelDreams: {
    id: 'pastelDreams',
    name: 'Pastel Dreams',
    emoji: '🦋',
    description: 'Soft hues, dreamy gradients, gentle beauty',
    colors: {
      primary: '#6A1B9A',
      secondary: '#9C27B0',
      accent: '#CE93D8',
      surface: '#F9F0FF',
      background: '#FFFFFF',
      text: '#4A0072',
      muted: '#BA68C8',
      border: '#E1BEE7',
      highlight: '#F3E5F5',
    },
    fonts: { heading: 'Plus Jakarta Sans', body: 'Inter', accent: 'Inter' },
    gradient: 'linear-gradient(135deg, #F3E5F5 0%, #E3F2FD 33%, #F1F8E9 66%, #FFF3E0 100%)',
    patternColor: '#6A1B9A',
    coverStyle: 'floral',
    decorations: {
      dividerStyle: 'dotted',
      borderAccent: '#CE93D8',
      headerDecoration: 'stars',
    },
  },

  royal: {
    id: 'royal',
    name: 'Royal Elegance',
    emoji: '👑',
    description: 'Regal gold, deep sapphire, timeless grandeur',
    colors: {
      primary: '#1A237E',
      secondary: '#283593',
      accent: '#C9A227',
      surface: '#F5F5FF',
      background: '#FFFFFF',
      text: '#0D1257',
      muted: '#5C6BC0',
      border: '#C5CAE9',
      highlight: '#E8EAF6',
    },
    fonts: { heading: 'Playfair Display', body: 'Inter', accent: 'Playfair Display' },
    gradient: 'linear-gradient(135deg, #E8EAF6 0%, #F3F4FF 50%, #FFF8E1 100%)',
    patternColor: '#1A237E',
    coverStyle: 'elegant',
    decorations: {
      dividerStyle: 'double',
      borderAccent: '#C9A227',
      headerDecoration: 'royal',
    },
  },

  nature: {
    id: 'nature',
    name: 'Nature Escape',
    emoji: '🌲',
    description: 'Forest greens, morning mist, grounded serenity',
    colors: {
      primary: '#1B4332',
      secondary: '#2D6A4F',
      accent: '#52B788',
      surface: '#F0FBF5',
      background: '#FFFFFF',
      text: '#081C15',
      muted: '#74C69D',
      border: '#B7E4C7',
      highlight: '#D8F3DC',
    },
    fonts: { heading: 'Plus Jakarta Sans', body: 'Inter', accent: 'Inter' },
    gradient: 'linear-gradient(135deg, #D8F3DC 0%, #B7E4C7 50%, #95D5B2 100%)',
    patternColor: '#1B4332',
    coverStyle: 'minimal',
    decorations: {
      dividerStyle: 'solid',
      borderAccent: '#52B788',
      headerDecoration: 'leaf',
    },
  },

  tropical: {
    id: 'tropical',
    name: 'Tropical Summer',
    emoji: '🏝️',
    description: 'Vivid teal, golden sun, lush paradise vibes',
    colors: {
      primary: '#004D40',
      secondary: '#00695C',
      accent: '#FFD54F',
      surface: '#E0F7FA',
      background: '#FFFFFF',
      text: '#00251A',
      muted: '#26A69A',
      border: '#80CBC4',
      highlight: '#E0F7FA',
    },
    fonts: { heading: 'Plus Jakarta Sans', body: 'Inter', accent: 'Inter' },
    gradient: 'linear-gradient(135deg, #E0F7FA 0%, #B2EBF2 33%, #FFF9C4 66%, #FFECB3 100%)',
    patternColor: '#004D40',
    coverStyle: 'bold',
    decorations: {
      dividerStyle: 'dashed',
      borderAccent: '#FFD54F',
      headerDecoration: 'tropical',
    },
  },

  autumn: {
    id: 'autumn',
    name: 'Autumn Cozy',
    emoji: '🍂',
    description: 'Burnt orange, maple red, harvest warmth',
    colors: {
      primary: '#4E1E00',
      secondary: '#BF360C',
      accent: '#FF6D00',
      surface: '#FFF3E0',
      background: '#FFFDF8',
      text: '#3E0000',
      muted: '#E64A19',
      border: '#FFCCBC',
      highlight: '#FBE9E7',
    },
    fonts: { heading: 'Playfair Display', body: 'Inter', accent: 'Playfair Display' },
    gradient: 'linear-gradient(135deg, #FBE9E7 0%, #FFF3E0 50%, #FFECB3 100%)',
    patternColor: '#4E1E00',
    coverStyle: 'warm',
    decorations: {
      dividerStyle: 'dashed',
      borderAccent: '#FF6D00',
      headerDecoration: 'leaf',
    },
  },

  christmas: {
    id: 'christmas',
    name: 'Christmas',
    emoji: '🎄',
    description: 'Holly red, evergreen, golden holiday magic',
    colors: {
      primary: '#1B5E20',
      secondary: '#C62828',
      accent: '#FFD700',
      surface: '#F1F8E9',
      background: '#FFFFFF',
      text: '#1B5E20',
      muted: '#558B2F',
      border: '#C8E6C9',
      highlight: '#E8F5E9',
    },
    fonts: { heading: 'Playfair Display', body: 'Inter', accent: 'Playfair Display' },
    gradient: 'linear-gradient(135deg, #E8F5E9 0%, #FFEBEE 50%, #FFF8E1 100%)',
    patternColor: '#1B5E20',
    coverStyle: 'warm',
    decorations: {
      dividerStyle: 'dashed',
      borderAccent: '#FFD700',
      headerDecoration: 'stars',
    },
  },

  valentine: {
    id: 'valentine',
    name: "Valentine's",
    emoji: '💕',
    description: 'Deep rose, blush pink, tender romance',
    colors: {
      primary: '#880E4F',
      secondary: '#C2185B',
      accent: '#FF4081',
      surface: '#FFF0F5',
      background: '#FFFFFF',
      text: '#560027',
      muted: '#F06292',
      border: '#F8BBD9',
      highlight: '#FCE4EC',
    },
    fonts: { heading: 'Playfair Display', body: 'Inter', accent: 'Playfair Display' },
    gradient: 'linear-gradient(135deg, #FCE4EC 0%, #F8BBD9 50%, #F3E5F5 100%)',
    patternColor: '#880E4F',
    coverStyle: 'floral',
    decorations: {
      dividerStyle: 'dotted',
      borderAccent: '#FF4081',
      headerDecoration: 'hearts',
    },
  },

  productivity: {
    id: 'productivity',
    name: 'Productivity Pro',
    emoji: '⚡',
    description: 'Sharp blue, clean lines, peak performance',
    colors: {
      primary: '#1565C0',
      secondary: '#1976D2',
      accent: '#2196F3',
      surface: '#F5F9FF',
      background: '#FFFFFF',
      text: '#0D47A1',
      muted: '#64B5F6',
      border: '#BBDEFB',
      highlight: '#E3F2FD',
    },
    fonts: { heading: 'Plus Jakarta Sans', body: 'Inter', accent: 'Inter' },
    gradient: 'linear-gradient(135deg, #E3F2FD 0%, #E8EAF6 50%, #EDE7F6 100%)',
    patternColor: '#1565C0',
    coverStyle: 'bold',
    decorations: {
      dividerStyle: 'solid',
      borderAccent: '#2196F3',
      headerDecoration: 'underline',
    },
  },
}

export const THEME_LIST = Object.values(THEMES)
export type ThemeId = keyof typeof THEMES
export const DEFAULT_THEME_ID: ThemeId = 'minimalist'
