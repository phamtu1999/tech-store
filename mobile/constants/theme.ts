import { Dimensions, Platform } from 'react-native';

export const COLORS = {
  primary: '#FF6A00',      // TECHZONE Orange
  primaryLight: '#FFF7ED',
  secondary: '#F59E0B',    // Gold
  accent: '#7C3AED',       // Purple
  danger: '#EF4444',
  success: '#22C55E',
  textDark: '#111827',
  textLight: '#6B7280',
  white: '#FFFFFF',
  bgGray: '#F9FAFB',
  bgCard: '#FFFFFF',
  border: '#F1F5F9',
};

export const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

export const SHADOWS = {
  soft: Platform.select({
    ios: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.05,
      shadowRadius: 10,
    },
    android: { elevation: 4 },
    web: { boxShadow: '0 4px 10px rgba(0,0,0,0.05)' },
  }),
  medium: Platform.select({
    ios: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.08,
      shadowRadius: 15,
    },
    android: { elevation: 8 },
    web: { boxShadow: '0 8px 15px rgba(0,0,0,0.08)' },
  }),
};
