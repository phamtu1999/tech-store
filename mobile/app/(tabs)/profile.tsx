import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Image,
  ScrollView,
  StatusBar,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { COLORS, SHADOWS, SCREEN_WIDTH } from '../../constants/theme';
import { LinearGradient } from 'expo-linear-gradient';

export default function ProfileScreen() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const { totalItems } = useCart();
  const { wishlistItems } = useWishlist();

  const handleLogout = () => {
    logout();
    router.replace('/');
  };

  if (!user) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" />
        <View style={styles.guestContainer}>
          <View style={styles.guestIconBox}>
            <Ionicons name="person-circle-outline" size={100} color="#E2E8F0" />
          </View>
          <Text style={styles.guestTitle}>Chào mừng bạn đến TECHZONE</Text>
          <Text style={styles.guestSub}>Đăng nhập để theo dõi đơn hàng và nhận nhiều ưu đãi dành riêng cho bạn.</Text>
          <TouchableOpacity 
            style={styles.loginBtn}
            onPress={() => router.push('/login')}
          >
            <Text style={styles.loginBtnText}>Đăng Nhập / Đăng Ký</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <ScrollView showsVerticalScrollIndicator={false} bounces={false}>
        
        {/* 1. Header with Gradient & Brand Feel */}
        <LinearGradient
          colors={[COLORS.primary, '#FB923C']}
          style={styles.headerGradient}
        >
          <SafeAreaView>
            <View style={styles.headerContent}>
              <View style={styles.headerTop}>
                <Text style={styles.headerTitle}>Cá Nhân</Text>
                <TouchableOpacity style={styles.settingsIcon}>
                  <Ionicons name="settings-outline" size={24} color="white" />
                </TouchableOpacity>
              </View>
              
              <View style={styles.userInfoRow}>
                <View style={styles.avatarContainer}>
                  <View style={styles.avatarCircle}>
                    <Text style={styles.avatarText}>{user.fullName.charAt(0).toUpperCase()}</Text>
                  </View>
                  <TouchableOpacity style={styles.editAvatarBtn}>
                    <Ionicons name="camera" size={14} color="white" />
                  </TouchableOpacity>
                </View>
                
                <View style={styles.infoTextContainer}>
                  <Text style={styles.userNameText}>{user.fullName}</Text>
                  <View style={{ flexDirection: 'row', gap: 10 }}>
                    <Text style={styles.userEmailText}>{user.email}</Text>
                    {user.phone && <Text style={styles.userEmailText}>• {user.phone}</Text>}
                  </View>
                  <View style={styles.badgeRow}>
                    <MaterialCommunityIcons name="shield-check" size={14} color="#FDE68A" />
                    <Text style={styles.badgeLabelText}>Thành viên Bạc</Text>
                  </View>
                </View>
              </View>
            </View>
          </SafeAreaView>
        </LinearGradient>

        {/* 2. Quick Stats (New) */}
        <View style={styles.statsCard}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>12</Text>
            <Text style={styles.statLabel}>Đơn mua</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{wishlistItems.length}</Text>
            <Text style={styles.statLabel}>Yêu thích</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>500k</Text>
            <Text style={styles.statLabel}>Điểm xu</Text>
          </View>
        </View>

        {/* 3. My Orders Entry Point (Expanded) */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Đơn hàng của tôi</Text>
            <TouchableOpacity onPress={() => router.push('/orders')}>
              <Text style={styles.seeAllText}>Xem lịch sử đơn hàng</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.orderWorkflow}>
            <OrderWorkflowItem icon="wallet-outline" label="Chờ xác nhận" />
            <OrderWorkflowItem icon="cube-outline" label="Đang đóng gói" badge={1} />
            <OrderWorkflowItem icon="truck-outline" label="Đang giao" />
            <OrderWorkflowItem icon="star-outline" label="Đánh giá" />
          </View>
        </View>

        {/* 4. Account Management */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quản lý tài khoản</Text>
          <View style={styles.menuCard}>
            <ProfileMenuItem 
              icon="heart-outline" 
              label="Sản phẩm yêu thích" 
              color="#F43F5E" 
              onPress={() => router.push('/wishlist')}
            />
            <ProfileMenuItem 
              icon="location-outline" 
              label="Sổ địa chỉ" 
              color="#3B82F6" 
              onPress={() => router.push('/addresses')}
            />
            <ProfileMenuItem 
              icon="card-outline" 
              label="Thanh toán" 
              color="#10B981" 
              onPress={() => router.push('/payment-methods')}
            />
            <ProfileMenuItem 
              icon="shield-lock-outline" 
              label="Bảo mật & Mật khẩu" 
              color="#8B5CF6" 
              onPress={() => router.push('/security')}
            />
          </View>
        </View>

        {/* 5. App Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Cài đặt ứng dụng</Text>
          <View style={styles.menuCard}>
            <ProfileMenuItem icon="notifications-outline" label="Thông báo" color="#F97316" />
            <ProfileMenuItem icon="language-outline" label="Ngôn ngữ" color="#64748B" />
            <ProfileMenuItem icon="help-circle-outline" label="Trung tâm hỗ trợ" color="#64748B" />
          </View>
        </View>

        {/* 6. Logout Button */}
        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={20} color={COLORS.danger} />
          <Text style={styles.logoutBtnText}>Đăng xuất tài khoản</Text>
        </TouchableOpacity>

        <View style={styles.footer}>
          <Text style={styles.versionText}>Phiên bản 1.2.0 (Stable)</Text>
          <Text style={styles.copyrightText}>© 2024 TECHZONE. All rights reserved.</Text>
        </View>
      </ScrollView>
    </View>
  );
}

const OrderWorkflowItem = ({ icon, label, badge }: any) => (
  <TouchableOpacity style={styles.workflowItem}>
    <View style={styles.workflowIconBox}>
      <Ionicons name={icon} size={24} color="#64748B" />
      {badge && (
        <View style={styles.workflowBadge}>
          <Text style={styles.workflowBadgeText}>{badge}</Text>
        </View>
      )}
    </View>
    <Text style={styles.workflowLabel}>{label}</Text>
  </TouchableOpacity>
);

const ProfileMenuItem = ({ icon, label, color, onPress }: any) => (
  <TouchableOpacity style={styles.menuItem} onPress={onPress}>
    <View style={[styles.menuIcon, { backgroundColor: color + '15' }]}>
      <MaterialCommunityIcons name={icon} size={22} color={color} />
    </View>
    <Text style={styles.menuLabelText}>{label}</Text>
    <Ionicons name="chevron-forward" size={18} color="#CBD5E1" />
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  headerGradient: {
    paddingBottom: 40,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
  },
  headerContent: {
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'android' ? 20 : 0,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 25,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '900',
    color: 'white',
  },
  settingsIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  userInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarContainer: {
    position: 'relative',
  },
  avatarCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255,255,255,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: 'rgba(255,255,255,0.5)',
  },
  avatarText: {
    fontSize: 32,
    fontWeight: '900',
    color: 'white',
  },
  editAvatarBtn: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: '#64748B',
    borderWidth: 2,
    borderColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoTextContainer: {
    marginLeft: 18,
  },
  userNameText: {
    fontSize: 22,
    fontWeight: '900',
    color: 'white',
  },
  userEmailText: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 2,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,165,0,0.25)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    marginTop: 8,
    alignSelf: 'flex-start',
    gap: 5,
  },
  badgeLabelText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#FEF3C7',
  },
  // Stats Card
  statsCard: {
    flexDirection: 'row',
    backgroundColor: 'white',
    marginHorizontal: 20,
    marginTop: -25,
    borderRadius: 24,
    paddingVertical: 20,
    ...SHADOWS.medium,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 18,
    fontWeight: '900',
    color: COLORS.textDark,
  },
  statLabel: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 4,
    fontWeight: '600',
  },
  statDivider: {
    width: 1,
    height: '60%',
    backgroundColor: '#F1F5F9',
    alignSelf: 'center',
  },
  // Sections
  section: {
    marginTop: 30,
    paddingHorizontal: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '900',
    color: COLORS.textDark,
  },
  seeAllText: {
    fontSize: 13,
    color: COLORS.primary,
    fontWeight: '700',
  },
  orderWorkflow: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 24,
    paddingVertical: 18,
    ...SHADOWS.soft,
  },
  workflowItem: {
    flex: 1,
    alignItems: 'center',
  },
  workflowIconBox: {
    marginBottom: 8,
  },
  workflowBadge: {
    position: 'absolute',
    top: -5,
    right: -10,
    backgroundColor: COLORS.danger,
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
    borderWidth: 1.5,
    borderColor: 'white',
  },
  workflowBadgeText: {
    color: 'white',
    fontSize: 10,
    fontWeight: '900',
  },
  workflowLabel: {
    fontSize: 11,
    color: COLORS.textDark,
    fontWeight: '600',
  },
  menuCard: {
    backgroundColor: 'white',
    borderRadius: 24,
    padding: 8,
    ...SHADOWS.soft,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
  },
  menuIcon: {
    width: 44,
    height: 44,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuLabelText: {
    flex: 1,
    marginLeft: 15,
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.textDark,
  },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    marginHorizontal: 20,
    marginTop: 40,
    paddingVertical: 18,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#FEE2E2',
    gap: 10,
    ...SHADOWS.soft,
  },
  logoutBtnText: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.danger,
  },
  footer: {
    padding: 40,
    alignItems: 'center',
  },
  versionText: {
    fontSize: 12,
    color: COLORS.textLight,
    fontWeight: '700',
  },
  copyrightText: {
    fontSize: 11,
    color: '#CBD5E1',
    marginTop: 4,
  },
  // Guest view styles
  guestContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 30,
  },
  guestIconBox: {
    marginBottom: 20,
  },
  guestTitle: {
    fontSize: 22,
    fontWeight: '900',
    color: COLORS.textDark,
    textAlign: 'center',
  },
  guestSub: {
    fontSize: 15,
    color: COLORS.textLight,
    textAlign: 'center',
    marginTop: 10,
    lineHeight: 22,
  },
  loginBtn: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 30,
    paddingVertical: 16,
    borderRadius: 20,
    marginTop: 32,
    width: '100%',
    alignItems: 'center',
    ...SHADOWS.medium,
  },
  loginBtnText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '800',
  },
});
