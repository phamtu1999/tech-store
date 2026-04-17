import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  SafeAreaView,
  StatusBar,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useCart } from '../../context/CartContext';
import { COLORS, SHADOWS, SCREEN_WIDTH } from '../../constants/theme';
import { formatPrice } from '../../utils/helpers';

export default function CartScreen() {
  const router = useRouter();
  const { cartItems, updateQuantity, removeFromCart, totalPrice, totalItems, clearCart } = useCart();

  if (cartItems.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Giỏ Hàng</Text>
        </View>
        <View style={styles.emptyContainer}>
          <View style={styles.emptyIconBox}>
            <Ionicons name="cart-outline" size={100} color="#E2E8F0" />
            <View style={styles.emptyBadge} />
          </View>
          <Text style={styles.emptyTitle}>Giỏ hàng của bạn đang trống</Text>
          <Text style={styles.emptySub}>Có vẻ như bạn chưa chọn được sản phẩm nào ưng ý. Khám phá ngay hàng ngàn ưu đãi tại TECHZONE!</Text>
          <TouchableOpacity 
            style={styles.shopBtn}
            onPress={() => router.push('/')}
          >
            <Text style={styles.shopBtnText}>KHÁM PHÁ NGAY</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      {/* Enhanced Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.headerTitle}>Giỏ Hàng</Text>
          <View style={styles.itemCountBadge}>
            <Text style={styles.itemCountText}>{totalItems}</Text>
          </View>
        </View>
        <TouchableOpacity onPress={clearCart}>
          <Text style={styles.clearText}>Xóa tất cả</Text>
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Shipping Incentive */}
        <View style={styles.incentiveBanner}>
          <MaterialCommunityIcons name="truck-fast-outline" size={24} color={COLORS.primary} />
          <Text style={styles.incentiveText}>Chúc mừng! Đơn hàng của bạn được <Text style={{fontWeight: '900'}}>Miễn phí vận chuyển</Text></Text>
        </View>

        {/* Product Cards */}
        {cartItems.map((item, index) => {
          const hasDiscount = item.originalPrice > item.price;
          const discount = hasDiscount ? Math.round(((item.originalPrice - item.price) / item.originalPrice) * 100) : 0;
          
          return (
            <View key={`${item.id}-${index}`} style={styles.cartItem}>
              <View style={styles.itemContent}>
                <Image source={{ uri: item.imageUrls[0] }} style={styles.itemImg} resizeMode="contain" />
                
                <View style={styles.itemInfo}>
                  <View style={styles.itemHeader}>
                    <Text style={styles.itemName} numberOfLines={1}>{item.name}</Text>
                    <TouchableOpacity onPress={() => removeFromCart(item.id, { color: item.selectedColor, variant: item.selectedVariant })}>
                      <Ionicons name="close" size={20} color="#94A3B8" />
                    </TouchableOpacity>
                  </View>

                  {/* Variant Tag */}
                  {(item.selectedVariant || item.selectedColor) && (
                    <View style={styles.variantBox}>
                      <Text style={styles.variantText}>
                        {item.selectedVariant}{item.selectedColor ? ` | ${item.selectedColor}` : ''}
                      </Text>
                    </View>
                  )}

                  <View style={styles.priceRow}>
                    <View>
                      <Text style={styles.itemPrice}>{formatPrice(item.price)}</Text>
                      {hasDiscount && (
                        <View style={styles.originalPriceRow}>
                          <Text style={styles.originalPrice}>{formatPrice(item.originalPrice)}</Text>
                          <View style={styles.discountTag}>
                            <Text style={styles.discountTagText}>-{discount}%</Text>
                          </View>
                        </View>
                      )}
                    </View>
                  </View>

                  <View style={styles.actionRow}>
                    <View style={styles.quantityControl}>
                      <TouchableOpacity 
                        style={styles.qtyBtn} 
                        onPress={() => updateQuantity(item.id, -1, { color: item.selectedColor, variant: item.selectedVariant })}
                      >
                        <Ionicons name="remove" size={20} color={COLORS.textDark} />
                      </TouchableOpacity>
                      <Text style={styles.qtyText}>{item.quantity}</Text>
                      <TouchableOpacity 
                        style={styles.qtyBtn} 
                        onPress={() => updateQuantity(item.id, 1, { color: item.selectedColor, variant: item.selectedVariant })}
                      >
                        <Ionicons name="add" size={20} color={COLORS.textDark} />
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              </View>
            </View>
          );
        })}

        {/* Coupon Section (Mock) */}
        <TouchableOpacity style={styles.couponBtn}>
          <MaterialCommunityIcons name="ticket-percent-outline" size={24} color={COLORS.primary} />
          <Text style={styles.couponText}>TECHZONE Voucher / Mã giảm giá</Text>
          <Ionicons name="chevron-forward" size={20} color="#CBD5E1" />
        </TouchableOpacity>

        {/* Order Summary Bolder */}
        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>Tổng quát đơn hàng</Text>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Tạm tính ({totalItems} sản phẩm)</Text>
            <Text style={styles.summaryValue}>{formatPrice(totalPrice)}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Phí vận chuyển</Text>
            <Text style={[styles.summaryValue, { color: COLORS.success, fontWeight: '800' }]}>MIỄN PHÍ</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.summaryRow}>
            <Text style={styles.totalLabel}>Tổng thanh toán</Text>
            <Text style={styles.totalValue}>{formatPrice(totalPrice)}</Text>
          </View>
          <Text style={styles.taxNote}>(Đã bao gồm thuế VAT nếu có)</Text>
        </View>
      </ScrollView>

      {/* Redesigned Sticky Bottom Bar */}
      <View style={styles.bottomBar}>
        <View style={styles.totalSection}>
          <Text style={styles.bottomTotalLabel}>Tổng cộng</Text>
          <Text style={styles.bottomTotalValue}>{formatPrice(totalPrice)}</Text>
        </View>
        <TouchableOpacity 
          style={styles.checkoutBtn} 
          onPress={() => router.push('/checkout')}
          activeOpacity={0.8}
        >
          <Text style={styles.checkoutBtnText}>THANH TOÁN</Text>
          <Ionicons name="arrow-forward" size={20} color="white" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    height: 60,
    backgroundColor: 'white',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F1F1',
    ...SHADOWS.soft,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: COLORS.textDark,
  },
  itemCountBadge: {
    backgroundColor: COLORS.primaryLight,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
    marginLeft: 10,
  },
  itemCountText: {
    color: COLORS.primary,
    fontSize: 12,
    fontWeight: '900',
  },
  clearText: {
    fontSize: 14,
    color: COLORS.textLight,
    fontWeight: '600',
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  incentiveBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#DEF7EC',
    padding: 12,
    borderRadius: 16,
    marginBottom: 16,
    gap: 12,
  },
  incentiveText: {
    flex: 1,
    fontSize: 13,
    color: '#03543F',
  },
  cartItem: {
    backgroundColor: 'white',
    borderRadius: 24,
    marginBottom: 16,
    padding: 16,
    ...SHADOWS.soft,
  },
  itemContent: {
    flexDirection: 'row',
  },
  itemImg: {
    width: 100,
    height: 100,
    borderRadius: 16,
    backgroundColor: '#F9FAFB',
  },
  itemInfo: {
    flex: 1,
    marginLeft: 16,
    justifyContent: 'space-between',
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  itemName: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.textDark,
    flex: 1,
    marginRight: 10,
  },
  variantBox: {
    backgroundColor: '#F3F4FB',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    alignSelf: 'flex-start',
    marginTop: 4,
  },
  variantText: {
    fontSize: 11,
    color: '#64748B',
    fontWeight: '700',
  },
  priceRow: {
    marginTop: 10,
  },
  itemPrice: {
    fontSize: 18,
    fontWeight: '900',
    color: COLORS.primary,
  },
  originalPriceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 2,
  },
  originalPrice: {
    fontSize: 12,
    color: COLORS.textLight,
    textDecorationLine: 'line-through',
  },
  discountTag: {
    backgroundColor: '#FEE2E2',
    paddingHorizontal: 5,
    paddingVertical: 1,
    borderRadius: 4,
  },
  discountTagText: {
    color: '#EF4444',
    fontSize: 10,
    fontWeight: '900',
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginTop: 10,
  },
  quantityControl: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
    borderRadius: 12,
    padding: 2,
  },
  qtyBtn: {
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
  },
  qtyText: {
    paddingHorizontal: 15,
    fontSize: 16,
    fontWeight: '900',
    color: COLORS.textDark,
  },
  couponBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 20,
    gap: 12,
    marginBottom: 20,
    ...SHADOWS.soft,
  },
  couponText: {
    flex: 1,
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.textDark,
  },
  summaryCard: {
    backgroundColor: 'white',
    borderRadius: 24,
    padding: 20,
    ...SHADOWS.soft,
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: '900',
    color: COLORS.textDark,
    marginBottom: 16,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  summaryLabel: {
    fontSize: 14,
    color: '#64748B',
    fontWeight: '600',
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.textDark,
  },
  divider: {
    height: 1,
    backgroundColor: '#F1F1F1',
    marginVertical: 15,
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: '900',
    color: COLORS.textDark,
  },
  totalValue: {
    fontSize: 22,
    fontWeight: '900',
    color: COLORS.primary,
  },
  taxNote: {
    fontSize: 11,
    color: COLORS.textLight,
    textAlign: 'center',
    marginTop: 10,
  },
  bottomBar: {
    backgroundColor: 'white',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: Platform.OS === 'ios' ? 34 : 20,
    flexDirection: 'row',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#F1F1F1',
    ...SHADOWS.medium,
  },
  totalSection: {
    flex: 1,
  },
  bottomTotalLabel: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '700',
  },
  bottomTotalValue: {
    fontSize: 20,
    fontWeight: '900',
    color: COLORS.primary,
  },
  checkoutBtn: {
    backgroundColor: COLORS.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    height: 54,
    borderRadius: 18,
    gap: 10,
    minWidth: 180,
    ...SHADOWS.medium,
  },
  checkoutBtnText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyIconBox: {
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: '#F3F4FB',
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyBadge: {
    position: 'absolute',
    top: 30,
    right: 30,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: COLORS.primary,
    borderWidth: 4,
    borderColor: '#F3F4FB',
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: COLORS.textDark,
    marginTop: 30,
    textAlign: 'center',
  },
  emptySub: {
    fontSize: 14,
    color: COLORS.textLight,
    textAlign: 'center',
    marginTop: 12,
    lineHeight: 22,
  },
  shopBtn: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 40,
    paddingVertical: 18,
    borderRadius: 20,
    marginTop: 40,
    ...SHADOWS.medium,
  },
  shopBtnText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '900',
    letterSpacing: 1,
  },
});
