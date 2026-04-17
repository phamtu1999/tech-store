import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  Alert,
  ActivityIndicator,
  Image,
  Platform,
  StatusBar,
} from 'react-native';
import { useRouter, Stack } from 'expo-router';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { checkoutApi } from '../api';
import { COLORS, SHADOWS } from '../constants/theme';
import { formatPrice } from '../utils/helpers';

export default function CheckoutScreen() {
  const router = useRouter();
  const { cartItems, totalPrice, clearCart } = useCart();
  const { user } = useAuth();

  const [receiverName, setReceiverName] = useState(user?.fullName || '');
  const [receiverPhone, setReceiverPhone] = useState(user?.phone || '');
  const [shippingAddress, setShippingAddress] = useState('');
  const [note, setNote] = useState('');
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('COD');

  // Auto-fill when user data is available
  React.useEffect(() => {
    if (user) {
      if (!receiverName) setReceiverName(user.fullName);
      if (!receiverPhone && user.phone) setReceiverPhone(user.phone);
    }
  }, [user]);

  const handlePlaceOrder = async () => {
    if (!shippingAddress || !receiverName || !receiverPhone) {
      Alert.alert('Thông báo', 'Vui lòng điền các thông tin bắt buộc (*)');
      return;
    }
    
    if (receiverPhone.length < 10) {
      Alert.alert('Lỗi', 'Số điện thoại không hợp lệ');
      return;
    }

    setLoading(true);
    try {
      const orderItems = cartItems.map(item => ({
        variantId: item.variants?.[0]?.id || item.id,
        quantity: item.quantity
      }));

      const payload = {
        receiverName,
        receiverPhone,
        shippingAddress,
        note,
        items: orderItems,
        idempotencyKey: Math.random().toString(36).substring(7)
      };

      await checkoutApi(payload);
      clearCart();
      
      // Navigate to success or orders
      Alert.alert('🎉 Đặt hàng thành công!', 'Cảm ơn bạn đã tin tưởng TECHZONE. Đơn hàng của bạn đang được xử lý.', [
        { text: 'XEM ĐƠN HÀNG', onPress: () => router.push('/orders') }
      ]);
    } catch (error: any) {
      console.error('Checkout error:', error);
      Alert.alert('Lỗi', error.response?.data?.message || 'Không thể đặt hàng. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      <StatusBar barStyle="dark-content" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color={COLORS.textDark} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Xác nhận thanh toán</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        {/* Order Items Preview (CRITICAL) */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Sản phẩm trong đơn hàng</Text>
          {cartItems.map((item, index) => (
            <View key={index} style={styles.productCard}>
              <Image source={{ uri: item.imageUrls[0] }} style={styles.productImg} />
              <View style={styles.productInfo}>
                <Text style={styles.productName} numberOfLines={1}>{item.name}</Text>
                <Text style={styles.productVariant}>
                  {item.selectedVariant || 'Mặc định'}{item.selectedColor ? ` | ${item.selectedColor}` : ''}
                </Text>
                <View style={styles.productPriceRow}>
                  <Text style={styles.productPrice}>{formatPrice(item.price)}</Text>
                  <Text style={styles.productQty}>x{item.quantity}</Text>
                </View>
              </View>
            </View>
          ))}
        </View>

        {/* Shipping Info Card */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <MaterialCommunityIcons name="truck-delivery-outline" size={22} color={COLORS.primary} />
            <Text style={styles.sectionTitle}>Thông tin giao hàng</Text>
          </View>
          
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Họ và tên người nhận <Text style={{color: COLORS.danger}}>*</Text></Text>
            <TextInput
              style={styles.input}
              placeholder="Nhập tên người nhận"
              value={receiverName}
              onChangeText={setReceiverName}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Số điện thoại <Text style={{color: COLORS.danger}}>*</Text></Text>
            <TextInput
              style={styles.input}
              placeholder="Ví dụ: 0987xxxxxx"
              value={receiverPhone}
              onChangeText={setReceiverPhone}
              keyboardType="phone-pad"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Địa chỉ nhận hàng <Text style={{color: COLORS.danger}}>*</Text></Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Số nhà, tên đường, phường/xã, quận/huyện..."
              value={shippingAddress}
              onChangeText={setShippingAddress}
              multiline
              numberOfLines={3}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Ghi chú đơn hàng (Tùy chọn)</Text>
            <TextInput
              style={styles.input}
              placeholder="Ví dụ: Giao vào giờ hành chính..."
              value={note}
              onChangeText={setNote}
            />
          </View>
        </View>

        {/* Payment Methods (Fixed UI) */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <MaterialCommunityIcons name="credit-card-outline" size={22} color={COLORS.primary} />
            <Text style={styles.sectionTitle}>Phương thức thanh toán</Text>
          </View>

          <TouchableOpacity 
            style={[styles.paymentOption, paymentMethod === 'COD' && styles.paymentOptionActive]}
            onPress={() => setPaymentMethod('COD')}
          >
            <View style={styles.paymentMain}>
              <View style={[styles.methodIcon, { backgroundColor: '#FFF7ED' }]}>
                <Ionicons name="cash-outline" size={22} color={COLORS.primary} />
              </View>
              <View style={styles.methodInfo}>
                <Text style={styles.methodTitle}>Thanh toán khi nhận hàng (COD)</Text>
                <Text style={styles.methodSub}>Trả tiền mặt khi Shipper giao hàng</Text>
              </View>
            </View>
            <Ionicons 
              name={paymentMethod === 'COD' ? "checkmark-circle" : "ellipse-outline"} 
              size={24} 
              color={paymentMethod === 'COD' ? COLORS.primary : '#E2E8F0'} 
            />
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.paymentOption, paymentMethod === 'ONLINE' && styles.paymentOptionActive, { opacity: 0.6 }]}
            onPress={() => {}}
            disabled
          >
            <View style={styles.paymentMain}>
              <View style={[styles.methodIcon, { backgroundColor: '#F0F9FF' }]}>
                <Ionicons name="card-outline" size={22} color="#0EA5E9" />
              </View>
              <View style={styles.methodInfo}>
                <Text style={styles.methodTitle}>Thẻ ATM / Ví điện tử</Text>
                <Text style={styles.methodSub}>Sắp ra mắt: VNPay, MoMo, ZaloPay</Text>
              </View>
            </View>
            <View style={styles.comingSoonTag}><Text style={styles.comingSoonText}>SOON</Text></View>
          </TouchableOpacity>
        </View>

        {/* Final Order Summary (Full details) */}
        <View style={styles.summaryBox}>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryItemLabel}>Tạm tính ({cartItems.length} sản phẩm)</Text>
            <Text style={styles.summaryItemValue}>{formatPrice(totalPrice)}</Text>
          </View>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryItemLabel}>Phí giao hàng</Text>
            <Text style={[styles.summaryItemValue, { color: COLORS.success }]}>Miễn phí</Text>
          </View>
          <View style={styles.summaryDivider} />
          <View style={styles.summaryItem}>
            <Text style={styles.summaryTotalLabel}>Tổng số tiền</Text>
            <Text style={styles.summaryTotalValue}>{formatPrice(totalPrice)}</Text>
          </View>
        </View>

        {/* Trust Badges */}
        <View style={styles.trustBadges}>
          <View style={styles.badgeItem}>
            <Ionicons name="shield-checkmark" size={16} color={COLORS.success} />
            <Text style={styles.badgeLabel}>Bảo mật 256-bit</Text>
          </View>
          <View style={styles.badgeItem}>
            <Ionicons name="refresh-circle" size={16} color={COLORS.success} />
            <Text style={styles.badgeLabel}>Đổi trả trong 7 ngày</Text>
          </View>
          <View style={styles.badgeItem}>
            <Ionicons name="star" size={16} color={COLORS.success} />
            <Text style={styles.badgeLabel}>Chính hãng 100%</Text>
          </View>
        </View>

      </ScrollView>

      {/* Sticky Bottom Bar */}
      <View style={styles.footer}>
        <View style={styles.footerTotalBox}>
          <Text style={styles.footerTotalLabel}>Tổng thanh toán</Text>
          <Text style={styles.footerTotalValue}>{formatPrice(totalPrice)}</Text>
        </View>
        <TouchableOpacity 
          style={[styles.orderBtn, loading && { opacity: 0.7 }]} 
          onPress={handlePlaceOrder}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text style={styles.orderBtnText}>ĐẶT HÀNG NGAY</Text>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6',
  },
  header: {
    height: 64,
    backgroundColor: 'white',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F1F1',
    ...SHADOWS.soft,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: COLORS.textDark,
  },
  backBtn: {
    padding: 5,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  section: {
    backgroundColor: 'white',
    borderRadius: 24,
    padding: 20,
    marginBottom: 16,
    ...SHADOWS.soft,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '900',
    color: '#1E293B',
  },
  productCard: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    backgroundColor: '#F8FAFC',
    borderRadius: 16,
    padding: 10,
  },
  productImg: {
    width: 60,
    height: 60,
    borderRadius: 10,
    backgroundColor: 'white',
  },
  productInfo: {
    flex: 1,
    marginLeft: 15,
  },
  productName: {
    fontSize: 14,
    fontWeight: '800',
    color: COLORS.textDark,
  },
  productVariant: {
    fontSize: 11,
    color: '#94A3B8',
    marginTop: 2,
    fontWeight: '600'
  },
  productPriceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  productPrice: {
    fontSize: 14,
    fontWeight: '900',
    color: COLORS.primary,
  },
  productQty: {
    fontSize: 13,
    color: '#64748B',
    fontWeight: '700',
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: '800',
    color: '#475569',
    marginBottom: 8,
    marginLeft: 4,
  },
  input: {
    backgroundColor: '#F8FAFC',
    borderRadius: 16,
    paddingHorizontal: 16,
    height: 52,
    borderWidth: 1.5,
    borderColor: '#F1F5F9',
    fontSize: 14,
    color: COLORS.textDark,
    fontWeight: '600',
  },
  textArea: {
    height: 90,
    paddingTop: 15,
    textAlignVertical: 'top',
  },
  paymentOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F8FAFC',
    padding: 16,
    borderRadius: 18,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  paymentOptionActive: {
    borderColor: COLORS.primary,
    backgroundColor: '#FFF7ED',
  },
  paymentMain: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
  },
  methodInfo: {
    flex: 1,
  },
  methodIcon: {
    width: 44,
    height: 44,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  methodTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: COLORS.textDark,
  },
  methodSub: {
    fontSize: 11,
    color: '#94A3B8',
    marginTop: 2,
    fontWeight: '600'
  },
  comingSoonTag: {
    backgroundColor: '#E2E8F0',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  comingSoonText: {
    fontSize: 9,
    fontWeight: '900',
    color: '#64748B',
  },
  summaryBox: {
    backgroundColor: '#1E293B',
    borderRadius: 24,
    padding: 24,
    marginBottom: 16,
  },
  summaryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  summaryItemLabel: {
    fontSize: 14,
    color: '#94A3B8',
    fontWeight: '600'
  },
  summaryItemValue: {
    fontSize: 14,
    color: 'white',
    fontWeight: '800'
  },
  summaryDivider: {
    height: 1,
    backgroundColor: '#334155',
    marginVertical: 15,
  },
  summaryTotalLabel: {
    fontSize: 16,
    color: 'white',
    fontWeight: '900'
  },
  summaryTotalValue: {
    fontSize: 22,
    color: '#FB923C',
    fontWeight: '900'
  },
  trustBadges: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    marginBottom: 20,
  },
  badgeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  badgeLabel: {
    fontSize: 11,
    color: '#64748B',
    fontWeight: '700'
  },
  footer: {
    backgroundColor: 'white',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: Platform.OS === 'ios' ? 34 : 20,
    borderTopWidth: 1,
    borderTopColor: '#F1F1F1',
    flexDirection: 'row',
    alignItems: 'center',
    ...SHADOWS.medium,
  },
  footerTotalBox: {
    flex: 1,
  },
  footerTotalLabel: {
    fontSize: 11,
    color: '#94A3B8',
    fontWeight: '800'
  },
  footerTotalValue: {
    fontSize: 18,
    fontWeight: '900',
    color: COLORS.primary,
  },
  orderBtn: {
    backgroundColor: COLORS.primary,
    height: 56,
    paddingHorizontal: 30,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: 180,
    ...SHADOWS.medium,
  },
  orderBtnText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
});
