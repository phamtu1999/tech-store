import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  TextInput,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS, SHADOWS, SCREEN_WIDTH } from './../constants/theme';

interface Address {
  id: string;
  label: string;
  name: string;
  phone: string;
  detail: string;
  isDefault: boolean;
}

export default function AddressScreen() {
  const router = useRouter();
  const [addresses, setAddresses] = useState<Address[]>([
    {
      id: '1',
      label: 'Nhà riêng',
      name: 'Phạm Tú',
      phone: '0987654321',
      detail: '123 Đường ABC, Phường 4, Quận 10, TP. Hồ Chí Minh',
      isDefault: true,
    }
  ]);

  const [isAdding, setIsAdding] = useState(false);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color={COLORS.textDark} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Sổ địa chỉ</Text>
        <TouchableOpacity 
          style={styles.addIcon}
          onPress={() => Alert.alert('Thông báo', 'Tính năng thêm địa chỉ đang được cập nhật')}
        >
          <Ionicons name="add" size={28} color={COLORS.primary} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {addresses.length > 0 ? (
          addresses.map((addr) => (
            <View key={addr.id} style={[styles.addrCard, addr.isDefault && styles.activeCard]}>
              <View style={styles.addrHeader}>
                <View style={styles.labelRow}>
                  <Text style={styles.addrLabel}>{addr.label}</Text>
                  {addr.isDefault && (
                    <View style={styles.defaultBadge}>
                      <Text style={styles.defaultText}>Mặc định</Text>
                    </View>
                  )}
                </View>
                <TouchableOpacity>
                  <Text style={styles.editText}>Sửa</Text>
                </TouchableOpacity>
              </View>

              <Text style={styles.userName}>{addr.name}</Text>
              <Text style={styles.userPhone}>{addr.phone}</Text>
              <Text style={styles.userAddr}>{addr.detail}</Text>

              <View style={styles.cardFooter}>
                <TouchableOpacity style={styles.deleteBtn}>
                  <Ionicons name="trash-outline" size={18} color="#94A3B8" />
                  <Text style={styles.deleteBtnText}>Xóa</Text>
                </TouchableOpacity>
                {!addr.isDefault && (
                  <TouchableOpacity style={styles.setMainBtn}>
                    <Text style={styles.setMainText}>Đặt làm mặc định</Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          ))
        ) : (
          <View style={styles.emptyBox}>
            <Ionicons name="location-outline" size={80} color="#E2E8F0" />
            <Text style={styles.emptyTitle}>Chưa có địa chỉ nào</Text>
            <Text style={styles.emptySub}>Vui lòng thêm địa chỉ giao hàng của bạn để tiến hành mua sắm thuận tiện hơn.</Text>
          </View>
        )}
      </ScrollView>

      <TouchableOpacity 
        style={styles.bottomAddBtn}
        onPress={() => Alert.alert('Thông báo', 'Vui lòng kết nối Backend để lưu địa chỉ mới')}
      >
        <Text style={styles.bottomAddText}>Thêm địa chỉ mới</Text>
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
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
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
  addIcon: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 100,
  },
  addrCard: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    ...SHADOWS.soft,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  activeCard: {
    borderColor: COLORS.primary + '30',
    backgroundColor: COLORS.primary + '05',
  },
  addrHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  addrLabel: {
    fontSize: 14,
    fontWeight: '800',
    color: COLORS.primary,
    backgroundColor: COLORS.primary + '15',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  defaultBadge: {
    backgroundColor: '#10B981',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  defaultText: {
    color: 'white',
    fontSize: 10,
    fontWeight: '900',
  },
  editText: {
    color: '#3B82F6',
    fontWeight: '700',
    fontSize: 14,
  },
  userName: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.textDark,
  },
  userPhone: {
    fontSize: 14,
    color: '#64748B',
    marginTop: 4,
    fontWeight: '600',
  },
  userAddr: {
    fontSize: 14,
    color: '#475569',
    marginTop: 8,
    lineHeight: 20,
    fontWeight: '500',
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 20,
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  deleteBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  deleteBtnText: {
    color: '#94A3B8',
    fontSize: 13,
    fontWeight: '700',
  },
  setMainBtn: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  setMainText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#64748B',
  },
  emptyBox: {
    alignItems: 'center',
    paddingTop: 80,
    paddingHorizontal: 40,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: COLORS.textDark,
    marginTop: 20,
  },
  emptySub: {
    fontSize: 14,
    color: '#94A3B8',
    textAlign: 'center',
    marginTop: 10,
    lineHeight: 22,
  },
  bottomAddBtn: {
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
  bottomAddText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '900',
  },
});
