import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  ActivityIndicator,
  Image,
} from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { getProductBySlug } from '../../api'; // For getting product image if needed
import { COLORS } from '../../constants/theme';
import { formatPrice } from '../../utils/helpers';
import axios from '../../utils/axios';

export default function OrderDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrderDetail();
  }, [id]);

  const fetchOrderDetail = async () => {
    try {
      const response = await axios.get(`/orders/${id}`);
      setOrder(response.data.result);
    } catch (error) {
      console.error('Fetch order detail error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return (
    <View style={styles.center}>
      <ActivityIndicator size="large" color={COLORS.primary} />
    </View>
  );

  if (!order) return (
    <View style={styles.center}>
      <Text style={styles.errorText}>Không tìm thấy đơn hàng!</Text>
      <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
        <Text style={styles.backBtnText}>Quay lại</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen options={{ title: `Đơn hàng #${id}`, headerShown: false }} />
      
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtnAction}>
          <Ionicons name="arrow-back" size={24} color={COLORS.textDark} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Chi tiết đơn hàng</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Status Section */}
        <View style={styles.section}>
          <View style={styles.statusRow}>
            <View>
              <Text style={styles.statusLabel}>Trạng thái đơn hàng</Text>
              <Text style={styles.statusValue}>{order.status}</Text>
            </View>
            <Ionicons name="receipt" size={40} color={COLORS.primary} />
          </View>
          <Text style={styles.orderDate}>Ngày đặt: {new Date(order.createdAt).toLocaleString('vi-VN')}</Text>
        </View>

        {/* Shipping Address */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="location-outline" size={20} color={COLORS.textDark} />
            <Text style={styles.sectionTitle}>Địa chỉ nhận hàng</Text>
          </View>
          <Text style={styles.receiverName}>{order.receiverName}</Text>
          <Text style={styles.receiverPhone}>{order.receiverPhone}</Text>
          <Text style={styles.addressText}>{order.shippingAddress}</Text>
        </View>

        {/* Items List */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Sản phẩm đã chọn</Text>
          {order.orderItems?.map((item: any) => (
            <View key={item.id} style={styles.productItem}>
              <View style={styles.productInfo}>
                <Text style={styles.productName}>{item.productName}</Text>
                <Text style={styles.productVariant}>Số lượng: {item.quantity}</Text>
              </View>
              <Text style={styles.productPrice}>{formatPrice(item.price)}</Text>
            </View>
          ))}
        </View>

        {/* Payment Summary */}
        <View style={styles.section}>
          <View style={styles.billRow}>
            <Text style={styles.billLabel}>Tạm tính</Text>
            <Text style={styles.billValue}>{formatPrice(order.totalPrice)}</Text>
          </View>
          <View style={styles.billRow}>
            <Text style={styles.billLabel}>Phí vận chuyển</Text>
            <Text style={styles.billValue}>0đ</Text>
          </View>
          <View style={styles.billDivider} />
          <View style={styles.billRow}>
            <Text style={styles.totalLabel}>Tổng cộng</Text>
            <Text style={styles.totalValue}>{formatPrice(order.totalPrice)}</Text>
          </View>
        </View>

        {/* Note Section */}
        {order.note && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Ghi chú</Text>
            <Text style={styles.noteText}>{order.note}</Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FA' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 15, paddingVertical: 15, backgroundColor: 'white', borderBottomWidth: 1, borderBottomColor: '#F1F1F1' },
  backBtnAction: { width: 40, height: 40, justifyContent: 'center' },
  headerTitle: { fontSize: 18, fontWeight: '800', color: '#1A1A1A' },
  scrollContent: { padding: 20 },
  section: { backgroundColor: 'white', borderRadius: 20, padding: 20, marginBottom: 20, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 10, elevation: 3 },
  statusRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  statusLabel: { fontSize: 14, color: '#9CA3AF', fontWeight: '600' },
  statusValue: { fontSize: 24, fontWeight: '900', color: COLORS.primary, marginTop: 4 },
  orderDate: { fontSize: 13, color: '#9CA3AF', marginTop: 10 },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12 },
  sectionTitle: { fontSize: 16, fontWeight: '800', color: '#1A1A1A', marginBottom: 15 },
  receiverName: { fontSize: 15, fontWeight: '700', color: '#1A1A1A' },
  receiverPhone: { fontSize: 14, color: '#4B5563', marginTop: 4 },
  addressText: { fontSize: 14, color: '#4B5563', marginTop: 8, lineHeight: 20 },
  productItem: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 15 },
  productInfo: { flex: 1, marginRight: 10 },
  productName: { fontSize: 14, fontWeight: '700', color: '#1A1A1A' },
  productVariant: { fontSize: 12, color: '#9CA3AF', marginTop: 4 },
  productPrice: { fontSize: 14, fontWeight: '800', color: '#1A1A1A' },
  billRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  billLabel: { fontSize: 14, color: '#4B5563' },
  billValue: { fontSize: 14, fontWeight: '700', color: '#1A1A1A' },
  billDivider: { height: 1, backgroundColor: '#F1F1F1', marginVertical: 15 },
  totalLabel: { fontSize: 16, fontWeight: '800', color: '#1A1A1A' },
  totalValue: { fontSize: 18, fontWeight: '900', color: COLORS.primary },
  noteText: { fontSize: 14, color: '#4B5563', fontStyle: 'italic' },
  errorText: { fontSize: 16, color: COLORS.textDark, marginBottom: 20 },
  backBtn: { backgroundColor: COLORS.primary, paddingHorizontal: 25, paddingVertical: 12, borderRadius: 12 },
  backBtnText: { color: 'white', fontWeight: '800' },
});
