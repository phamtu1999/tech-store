import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { COLORS, SCREEN_WIDTH } from '../constants/theme';

export const HeroBanner = () => {
  const banners = [
    { title: 'Tai nghe\nPremium 2024', sub: 'Chất âm đỉnh cao', emoji: '🎧', color: '#4F46E5', badge: 'MỚI VỀ' },
    { title: 'Smartwatch\nUltra Gen 2', sub: 'Theo dõi sức khoẻ', emoji: '⌚', color: '#7C3AED', badge: 'HOT' },
    { title: 'Phụ kiện\nGamimg Pro', sub: 'Trải nghiệm mượt mà', emoji: '🖱️', color: '#EA580C', badge: 'GIẢM 30%' },
  ];

  return (
    <ScrollView 
      horizontal 
      showsHorizontalScrollIndicator={false} 
      decelerationRate="fast"
      snapToInterval={SCREEN_WIDTH * 0.8 + 15}
      style={styles.container}
      contentContainerStyle={{ paddingLeft: 20, paddingRight: 5 }}
    >
      {banners.map((b, i) => (
        <View key={i} style={[styles.card, { backgroundColor: b.color }]}>
          <View style={styles.content}>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{b.badge}</Text>
            </View>
            <Text style={styles.title}>{b.title}</Text>
            <Text style={styles.subtitle}>{b.sub}</Text>
            <TouchableOpacity style={styles.btn}>
              <Text style={styles.btnText}>Xem ngay</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.imgWrap}>
            <Text style={styles.emoji}>{b.emoji}</Text>
          </View>
        </View>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 25,
  },
  card: {
    width: SCREEN_WIDTH * 0.8,
    height: 160,
    borderRadius: 24,
    marginRight: 15,
    padding: 20,
    flexDirection: 'row',
    overflow: 'hidden',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
  },
  badge: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    marginBottom: 8,
  },
  badgeText: {
    color: 'white',
    fontSize: 10,
    fontWeight: '700',
  },
  title: {
    color: 'white',
    fontSize: 20,
    fontWeight: '900',
    lineHeight: 24,
  },
  subtitle: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 12,
    marginTop: 4,
  },
  btn: {
    backgroundColor: COLORS.secondary,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
    alignSelf: 'flex-start',
    marginTop: 14,
  },
  btnText: {
    color: COLORS.textDark,
    fontSize: 12,
    fontWeight: '800',
  },
  imgWrap: {
    width: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emoji: {
    fontSize: 50,
  },
});
