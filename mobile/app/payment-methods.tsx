import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Alert,
  Image,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS, SHADOWS } from './../constants/theme';

export default function PaymentMethodsScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color={COLORS.textDark} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Phương thức thanh toán</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.sectionLabel}>Thanh toán liên kết</Text>
        
        <TouchableOpacity style={styles.methodCard}>
          <View style={[styles.iconWrap, { backgroundColor: '#F0F9FF' }]}>
            <MaterialCommunityIcons name="credit-card-plus-outline" size={24} color="#0EA5E9" />
          </View>
          <View style={styles.methodInfo}>
            <Text style={styles.methodName}>Thêm thẻ tín dụng/ghi nợ</Text>
            <Text style={styles.methodSub}>Liên kết thẻ Visa, Mastercard, JCB...</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#CBD5E1" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.methodCard}>
          <View style={[styles.iconWrap, { backgroundColor: '#FFF7ED' }]}>
            <Image 
              source={{ uri: 'https://developers.momo.vn/v3/assets/images/logo-custom.png' }} 
              style={{ width: 24, height: 24, borderRadius: 4 }}
            />
          </View>
          <View style={styles.methodInfo}>
            <Text style={styles.methodName}>Liên kết Ví MoMo</Text>
            <Text style={styles.methodSub}>Thanh toán nhanh qua ví MoMo</Text>
          </View>
          <TouchableOpacity style={styles.connectBtn}>
            <Text style={styles.connectText}>Liên kết</Text>
          </TouchableOpacity>
        </TouchableOpacity>

        <Text style={[styles.sectionLabel, { marginTop: 30 }]}>Khác</Text>

        <View style={styles.methodCard}>
          <View style={[styles.iconWrap, { backgroundColor: '#F8FAFC' }]}>
            <Ionicons name="cash-outline" size={24} color="#64748B" />
          </View>
          <View style={styles.methodInfo}>
            <Text style={styles.methodName}>Thanh toán khi nhận hàng (COD)</Text>
            <Text style={styles.methodSub}>Phương thức mặc định</Text>
          </View>
          <Ionicons name="checkmark-circle" size={22} color="#10B981" />
        </View>

        <View style={styles.infoBox}>
          <Ionicons name="lock-closed-outline" size={20} color="#94A3B8" />
          <Text style={styles.infoText}>Mọi thông tin thanh toán của bạn đều được bảo mật theo tiêu chuẩn quốc tế PCI DSS.</Text>
        </View>
      </ScrollView>

      <TouchableOpacity 
        style={styles.saveBtn}
        onPress={() => Alert.alert('Thông báo', 'Tính năng đang được tích hợp cùng cổng thanh toán VNPay/MoMo')}
      >
        <Text style={styles.saveBtnText}>Lưu thay đổi</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    height: 60,
    backgroundColor: 'white',
    ...SHADOWS.soft,
  },
  backBtn: {
    width: 40,
    height: 40,
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.textDark,
  },
  scrollContent: {
    padding: 20,
  },
  sectionLabel: {
    fontSize: 13,
    fontWeight: '800',
    color: '#64748B',
    marginBottom: 15,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  methodCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 20,
    marginBottom: 12,
    ...SHADOWS.soft,
  },
  iconWrap: {
    width: 48,
    height: 48,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  methodInfo: {
    flex: 1,
    marginLeft: 15,
  },
  methodName: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.textDark,
  },
  methodSub: {
    fontSize: 12,
    color: '#94A3B8',
    marginTop: 2,
    fontWeight: '500',
  },
  connectBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: COLORS.primary + '15',
  },
  connectText: {
    fontSize: 12,
    fontWeight: '800',
    color: COLORS.primary,
  },
  infoBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
    padding: 15,
    borderRadius: 16,
    marginTop: 30,
    gap: 12,
  },
  infoText: {
    flex: 1,
    fontSize: 12,
    color: '#64748B',
    lineHeight: 18,
    fontWeight: '500',
  },
  saveBtn: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    backgroundColor: COLORS.primary,
    height: 56,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    ...SHADOWS.medium,
  },
  saveBtnText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '900',
  },
});
