import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  RefreshControl,
  StatusBar,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { getCategories, getProducts, getFlashSaleProducts, ProductResponse, CategoryResponse } from '../../api';
import { COLORS, SHADOWS, SCREEN_WIDTH } from '../../constants/theme';
import { getCategoryIcon } from '../../utils/helpers';
import { HeroBanner } from '../../components/HeroBanner';
import { ProductCard } from '../../components/ProductCard';
import { CountdownTimer } from '../../components/CountdownTimer';

export default function HomeScreen() {
  const router = useRouter();
  const [categories, setCategories] = useState<CategoryResponse[]>([]);
  const [flashProducts, setFlashProducts] = useState<ProductResponse[]>([]);
  const [newProducts, setNewProducts] = useState<ProductResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchData = async () => {
    try {
      const [cats, flash, news] = await Promise.all([
        getCategories(),
        getFlashSaleProducts(),
        getProducts({ size: 10, sort: 'id,desc' })
      ]);
      setCategories(cats);
      setFlashProducts(flash);
      setNewProducts(news?.content || []);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchData();
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[COLORS.primary]} />
        }
      >
        {/* Premium Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.logoText}>TECHZONE</Text>
            <View style={styles.taglineRow}>
              <View style={styles.dot} />
              <Text style={styles.logoTag}>PREMIUM TECHNOLOGY STORE</Text>
            </View>
          </View>
          <View style={styles.headerActions}>
            <TouchableOpacity style={styles.headerAction}>
              <Ionicons name="notifications-outline" size={22} color={COLORS.textDark} />
              <View style={styles.notifBadge} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Improved Search Bar */}
        <View style={styles.searchContainer}>
          <TouchableOpacity 
            style={styles.searchBar}
            activeOpacity={0.9}
            onPress={() => router.push('/search')}
          >
            <Ionicons name="search-outline" size={20} color="#94A3B8" />
            <Text style={styles.searchPlaceholderText}>Bạn tìm sản phẩm gì?</Text>
            <View style={styles.vDividerSearch} />
            <Ionicons name="camera-outline" size={20} color={COLORS.primary} />
          </TouchableOpacity>
        </View>

        <HeroBanner />

        {/* Categories Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Danh Mục</Text>
            <TouchableOpacity onPress={() => router.push('/categories')}>
              <Text style={styles.seeAll}>Xem tất cả</Text>
            </TouchableOpacity>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.catScroll}>
            <TouchableOpacity style={styles.catItem} onPress={() => router.push('/categories')}>
              <View style={styles.catIconBox}>
                <Ionicons name="grid-outline" size={24} color={COLORS.primary} />
              </View>
              <Text style={styles.catLabel}>Tất cả</Text>
            </TouchableOpacity>
            {categories.map(cat => (
              <TouchableOpacity 
                key={cat.id} 
                style={styles.catItem} 
                onPress={() => router.push({
                  pathname: '/categories',
                  params: { categoryId: cat.id }
                })}
              >
                <View style={styles.catIconBox}>
                  <Ionicons name={getCategoryIcon(cat.name)} size={24} color={COLORS.primary} />
                </View>
                <Text style={styles.catLabel}>{cat.name}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Flash Sale Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <Text style={styles.sectionTitle}>⚡ Flash Sale</Text>
              <CountdownTimer />
            </View>
            <TouchableOpacity><Text style={styles.seeAll}>Xem tất cả</Text></TouchableOpacity>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.productScroll}>
            {loading ? (
              <ActivityIndicator color={COLORS.primary} style={{ marginLeft: 20 }} />
            ) : flashProducts.length > 0 ? (
              flashProducts.map(item => <ProductCard key={item.id} item={item} />)
            ) : (
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>Đang cập nhật Flash Sale...</Text>
                <TouchableOpacity onPress={onRefresh} style={styles.retryBtn}>
                  <Text style={styles.retryBtnText}>Thử lại</Text>
                </TouchableOpacity>
              </View>
            )}
          </ScrollView>
        </View>

        {/* Free Ship Banner */}
        <View style={[styles.section, { marginBottom: 10 }]}>
          <TouchableOpacity style={styles.freeShipCard} activeOpacity={0.9}>
            <View style={styles.fsContent}>
              <Text style={styles.fsTitle}>Miễn phí vận chuyển 🚚</Text>
              <Text style={styles.fsDesc}>Cho đơn hàng từ 500.000đ nội thành</Text>
            </View>
            <View style={styles.fsIconWrap}>
              <Ionicons name="chevron-forward" size={20} color="white" />
            </View>
          </TouchableOpacity>
        </View>

        {/* New Products Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>🆕 Sản Phẩm Mới Nội Bật</Text>
            <TouchableOpacity><Text style={styles.seeAll}>Xem tất cả</Text></TouchableOpacity>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.productScroll}>
            {loading ? (
              <ActivityIndicator color={COLORS.primary} style={{ marginLeft: 20 }} />
            ) : newProducts.length > 0 ? (
              newProducts.map(item => <ProductCard key={item.id} item={item} />)
            ) : (
              <Text style={[styles.emptyText, { marginLeft: 20 }]}>Đang cập nhật...</Text>
            )}
          </ScrollView>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  logoText: {
    fontSize: 24,
    fontWeight: '900',
    color: COLORS.primary,
    letterSpacing: -1,
  },
  logoTag: {
    fontSize: 10,
    color: COLORS.textLight,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  taglineRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: -2,
  },
  dot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: COLORS.primary,
    marginRight: 6,
  },
  headerActions: {
    flexDirection: 'row',
    gap: 12,
  },
  headerAction: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.bgGray,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notifBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.primary,
    borderWidth: 1.5,
    borderColor: 'white',
  },
  searchContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 16,
    paddingHorizontal: 16,
    height: 54,
    ...SHADOWS.soft,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  searchPlaceholderText: {
    flex: 1,
    marginLeft: 12,
    fontSize: 14,
    color: '#94A3B8',
    fontWeight: '600',
  },
  vDividerSearch: {
    width: 1,
    height: 20,
    backgroundColor: '#E2E8F0',
    marginHorizontal: 12,
  },
  section: {
    marginBottom: 30,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.textDark,
  },
  seeAll: {
    color: COLORS.primary,
    fontSize: 13,
    fontWeight: '700',
  },
  catScroll: {
    paddingLeft: 20,
  },
  catItem: {
    alignItems: 'center',
    marginRight: 20,
  },
  catIconBox: {
    width: 60,
    height: 60,
    borderRadius: 20,
    backgroundColor: COLORS.bgGray,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  catLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.textLight,
  },
  productScroll: {
    paddingLeft: 20,
  },
  emptyContainer: {
    width: SCREEN_WIDTH - 40,
    padding: 30,
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: 20,
    ...SHADOWS.soft,
  },
  emptyText: {
    color: COLORS.textLight,
    fontStyle: 'italic',
    marginBottom: 15,
  },
  retryBtn: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 12,
  },
  retryBtnText: {
    color: 'white',
    fontWeight: '800',
  },
  freeShipCard: {
    marginHorizontal: 20,
    backgroundColor: '#0F172A',
    borderRadius: 24,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    ...SHADOWS.medium,
  },
  fsContent: {
    flex: 1,
  },
  fsTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: '800',
  },
  fsDesc: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 12,
    marginTop: 4,
  },
  fsIconWrap: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 15,
  },
});
