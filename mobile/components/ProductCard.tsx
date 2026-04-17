import React, { useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Animated,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { ProductResponse } from '../api';
import { COLORS, SHADOWS } from '../constants/theme';
import { useWishlist } from '../context/WishlistContext';

interface ProductCardProps {
  item: ProductResponse;
}

export const ProductCard = ({ item }: ProductCardProps) => {
  const router = useRouter();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const isFav = isInWishlist(item.id);

  const discount = item.originalPrice > item.price 
    ? Math.round(((item.originalPrice - item.price) / item.originalPrice) * 100) 
    : 0;

  const onPressIn = () => Animated.spring(scaleAnim, { toValue: 0.96, useNativeDriver: true }).start();
  const onPressOut = () => Animated.spring(scaleAnim, { toValue: 1, useNativeDriver: true }).start();

  const handlePress = () => {
    router.push({
      pathname: '/product/[id]',
      params: { id: item.slug }
    });
  };

  const imageUrl = item.imageUrls && item.imageUrls.length > 0 ? item.imageUrls[0] : null;

  return (
    <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
      <TouchableOpacity
        style={styles.card}
        activeOpacity={1}
        onPressIn={onPressIn}
        onPressOut={onPressOut}
        onPress={handlePress}
      >
        {discount > 0 && (
          <View style={styles.discountBadge}>
            <Text style={styles.discountText}>-{discount}%</Text>
          </View>
        )}

        <View style={styles.imgBox}>
          {imageUrl ? (
            <Image source={{ uri: imageUrl }} style={styles.image} resizeMode="contain" />
          ) : (
            <Ionicons name="cube-outline" size={40} color="#E2E8F0" />
          )}
          
          <TouchableOpacity 
            style={styles.wishlistBtn}
            onPress={() => toggleWishlist(item)}
          >
            <Ionicons 
              name={isFav ? "heart" : "heart-outline"} 
              size={20} 
              color={isFav ? COLORS.danger : COLORS.textLight} 
            />
          </TouchableOpacity>
        </View>

        <Text style={styles.name} numberOfLines={1}>{item.name}</Text>

        <View style={styles.priceRow}>
          {item.originalPrice > item.price && (
            <Text style={styles.originalPrice}>{item.originalPrice.toLocaleString('vi-VN')}đ</Text>
          )}
          <Text style={styles.currentPrice}>{item.price.toLocaleString('vi-VN')}đ</Text>
        </View>

        <View style={styles.footer}>
          <View style={styles.ratingBox}>
            <Ionicons name="star" size={10} color={COLORS.secondary} />
            <Text style={styles.ratingVal}>{item.rating?.toFixed(1) || '5.0'}</Text>
          </View>
          <View style={styles.cta}>
            <Text style={styles.ctaText}>Xem</Text>
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  card: {
    width: '100%',
    backgroundColor: COLORS.white,
    borderRadius: 20,
    padding: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOWS.soft,
  },
  discountBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: COLORS.danger,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    zIndex: 1,
  },
  discountText: {
    color: 'white',
    fontSize: 10,
    fontWeight: '800',
  },
  imgBox: {
    width: '100%',
    height: 120,
    borderRadius: 16,
    backgroundColor: COLORS.bgGray,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  wishlistBtn: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(255,255,255,0.85)',
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    ...SHADOWS.soft,
  },
  name: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.textDark,
    marginBottom: 6,
  },
  priceRow: {
    marginBottom: 8,
  },
  originalPrice: {
    fontSize: 11,
    color: COLORS.textLight,
    textDecorationLine: 'line-through',
    marginBottom: 2,
  },
  currentPrice: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.primary,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 'auto',
  },
  ratingBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  ratingVal: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.textDark,
  },
  cta: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    backgroundColor: COLORS.primaryLight,
    borderRadius: 8,
  },
  ctaText: {
    fontSize: 11,
    fontWeight: '800',
    color: COLORS.primary,
  },
});
