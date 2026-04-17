import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Image,
  ActivityIndicator,
  Platform,
  StatusBar,
  FlatList,
  TextInput,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { getCategories, getProducts, CategoryResponse, ProductResponse } from '../../api';
import { COLORS, SHADOWS, SCREEN_WIDTH } from '../../constants/theme';
import { ProductCard } from '../../components/ProductCard';

export default function CategoriesScreen() {
  const router = useRouter();
  const [categories, setCategories] = useState<CategoryResponse[]>([]);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [products, setProducts] = useState<ProductResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState('Mới nhất');

  useEffect(() => {
    fetchInitialData();
  }, []);

  useEffect(() => {
    if (selectedId) {
      fetchProducts(selectedId, selectedFilter);
    }
  }, [selectedId, selectedFilter]);

  const fetchInitialData = async () => {
    try {
      const cats = await getCategories();
      setCategories(cats);
      if (cats.length > 0) {
        setSelectedId(cats[0].id);
      }
    } catch (error) {
      console.error('Initial data fetch error:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchProducts = async (catId: number, filter: string) => {
    setLoadingProducts(true);
    try {
      let sort = 'id,desc';
      if (filter === 'Bán chạy') sort = 'soldCount,desc';
      if (filter === 'Giá thấp') sort = 'price,asc';
      if (filter === 'Giá cao') sort = 'price,desc';

      const result = await getProducts({ 
        categoryId: catId, 
        size: 20,
        sort: sort
      });
      setProducts(result?.content || []);
    } catch (error) {
      console.error('Products fetch error:', error);
    } finally {
      setLoadingProducts(false);
    }
  };

  const handleCategorySelect = (id: number) => {
    if (id === selectedId) return;
    setSelectedId(id);
    setProducts([]); // Clear list for better UX
    fetchProducts(id);
  };

  const FILTERS = ['Mới nhất', 'Bán chạy', 'Giá thấp', 'Giá cao'];

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      {/* 1. Header with Full-Width Search */}
      <View style={styles.header}>
        <View style={styles.searchContainer}>
          <TouchableOpacity 
            style={styles.searchBox}
            onPress={() => router.push('/search')}
            activeOpacity={0.8}
          >
            <Ionicons name="search-outline" size={20} color={COLORS.textLight} />
            <Text style={styles.searchPlaceholder}>Bạn tìm gì hôm nay?</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.filterBtn}>
            <Ionicons name="options-outline" size={22} color={COLORS.primary} />
          </TouchableOpacity>
        </View>
      </View>

      {/* 2. Horizontal Categories Navigation */}
      <View style={styles.catNavContainer}>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.catNavScroll}
        >
          {categories.map((cat) => (
            <TouchableOpacity
              key={cat.id}
              onPress={() => handleCategorySelect(cat.id)}
              style={[
                styles.catNavItem,
                selectedId === cat.id && styles.catNavItemActive
              ]}
            >
              <Text style={[
                styles.catNavText,
                selectedId === cat.id && styles.catNavTextActive
              ]}>
                {cat.name}
              </Text>
              {selectedId === cat.id && <View style={styles.activeLine} />}
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* 3. Main Content with Chips and Product Grid */}
      <View style={{ flex: 1 }}>
        {loading ? (
          <View style={styles.center}>
            <ActivityIndicator size="large" color={COLORS.primary} />
          </View>
        ) : (
          <FlatList
            data={products}
            keyExtractor={(item) => item.id.toString()}
            numColumns={2}
            removeClippedSubviews={true}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listContent}
            ListHeaderComponent={
              <View>
                {/* Promo Banner Banner */}
                <View style={styles.bannerContainer}>
                  <Image 
                    source={{ uri: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=800' }} 
                    style={styles.bannerImg}
                    resizeMode="cover"
                  />
                  <View style={styles.bannerOverlay}>
                    <Text style={styles.bannerTitle}>Siêu ưu đãi tuần này</Text>
                    <Text style={styles.bannerSub}>Giảm đến 50% cho các sản phẩm công nghệ</Text>
                  </View>
                </View>

                {/* Filter Chips */}
                <View style={styles.filterContainer}>
                  <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 10 }}>
                    {FILTERS.map((f) => (
                      <TouchableOpacity
                        key={f}
                        onPress={() => setSelectedFilter(f)}
                        style={[
                          styles.filterChip,
                          selectedFilter === f && styles.filterChipActive
                        ]}
                      >
                        <Text style={[
                          styles.filterChipText,
                          selectedFilter === f && styles.filterChipTextActive
                        ]}>
                          {f}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>

                {loadingProducts && products.length === 0 && (
                  <View style={{ paddingVertical: 40 }}>
                    <ActivityIndicator color={COLORS.primary} />
                  </View>
                )}
              </View>
            }
            renderItem={({ item }) => (
              <View style={styles.productWrapper}>
                <ProductCard item={item} />
              </View>
            )}
            ListEmptyComponent={
              !loadingProducts ? (
                <View style={styles.emptyBox}>
                  <Ionicons name="cube-outline" size={60} color="#E2E8F0" />
                  <Text style={styles.emptyText}>Chưa có sản phẩm nào trong danh mục này</Text>
                </View>
              ) : null
            }
            ListFooterComponent={loadingProducts && products.length > 0 ? (
              <ActivityIndicator color={COLORS.primary} style={{ marginVertical: 20 }} />
            ) : <View style={{ height: 20 }} />}
          />
        )}
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
    backgroundColor: 'white',
    paddingHorizontal: 16,
    paddingVertical: 12,
    ...SHADOWS.soft,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  searchBox: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    borderRadius: 14,
    paddingHorizontal: 15,
    height: 48,
  },
  searchPlaceholder: {
    marginLeft: 10,
    fontSize: 14,
    color: '#94A3B8',
    fontWeight: '500',
  },
  filterBtn: {
    width: 48,
    height: 48,
    backgroundColor: COLORS.primaryLight,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  // Cat Nav
  catNavContainer: {
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F1F1',
  },
  catNavScroll: {
    paddingHorizontal: 16,
    height: 50,
  },
  catNavItem: {
    justifyContent: 'center',
    paddingHorizontal: 16,
    marginRight: 10,
  },
  catNavItemActive: {
  },
  catNavText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#64748B',
  },
  catNavTextActive: {
    color: COLORS.primary,
  },
  activeLine: {
    position: 'absolute',
    bottom: 0,
    left: 16,
    right: 16,
    height: 3,
    backgroundColor: COLORS.primary,
    borderTopLeftRadius: 3,
    borderTopRightRadius: 3,
  },
  // Main List
  listContent: {
    paddingBottom: 20,
  },
  bannerContainer: {
    margin: 16,
    height: 140,
    borderRadius: 20,
    overflow: 'hidden',
    ...SHADOWS.medium,
  },
  bannerImg: {
    width: '100%',
    height: '100%',
  },
  bannerOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.25)',
    justifyContent: 'center',
    padding: 20,
  },
  bannerTitle: {
    color: 'white',
    fontSize: 20,
    fontWeight: '900',
  },
  bannerSub: {
    color: 'white',
    fontSize: 12,
    marginTop: 4,
    fontWeight: '600',
  },
  filterContainer: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  filterChipActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  filterChipText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#64748B',
  },
  filterChipTextActive: {
    color: 'white',
  },
  productWrapper: {
    width: (SCREEN_WIDTH / 2),
    padding: 8,
    alignItems: 'center'
  },
  emptyBox: {
    paddingTop: 60,
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyText: {
    textAlign: 'center',
    color: '#94A3B8',
    marginTop: 20,
    fontWeight: '600',
    lineHeight: 22,
  },
});
