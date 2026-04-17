import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { getProducts, ProductResponse } from '../api';
import { COLORS } from '../constants/theme';
import { ProductCard } from '../components/ProductCard';

export default function SearchScreen() {
  const { q } = useLocalSearchParams();
  const router = useRouter();
  const [searchText, setSearchText] = useState((q as string) || '');
  const [products, setProducts] = useState<ProductResponse[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (query: string) => {
    if (!query.trim()) return;
    setLoading(true);
    try {
      const result = await getProducts({ q: query, size: 20 });
      setProducts(result?.content || []);
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (q) {
      handleSearch(q as string);
    }
  }, [q]);

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      
      {/* Header Search Bar */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color={COLORS.textDark} />
        </TouchableOpacity>
        <View style={styles.searchBar}>
          <Ionicons name="search-outline" size={20} color={COLORS.textLight} />
          <TextInput
            style={styles.searchInput}
            placeholder="Bạn tìm gì hôm nay?"
            value={searchText}
            onChangeText={setSearchText}
            autoFocus={!q}
            returnKeyType="search"
            onSubmitEditing={() => handleSearch(searchText)}
          />
          {searchText.length > 0 && (
            <TouchableOpacity onPress={() => setSearchText('')}>
              <Ionicons name="close-circle" size={18} color={COLORS.textLight} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Results */}
      <View style={styles.content}>
        <View style={styles.resultHeader}>
          <Text style={styles.resultTitle}>
            {loading ? 'Đang tìm kiếm...' : `Tìm thấy ${products.length} sản phẩm`}
          </Text>
          <TouchableOpacity style={styles.filterBtn}>
            <Ionicons name="options-outline" size={20} color={COLORS.primary} />
            <Text style={styles.filterText}>Lọc</Text>
          </TouchableOpacity>
        </View>

        {loading ? (
          <View style={styles.center}>
            <ActivityIndicator size="large" color={COLORS.primary} />
          </View>
        ) : products.length > 0 ? (
          <FlatList
            data={products}
            keyExtractor={(item) => item.id.toString()}
            numColumns={2}
            renderItem={({ item }) => (
              <View style={styles.productWrapper}>
                <ProductCard item={item} />
              </View>
            )}
            contentContainerStyle={styles.listPadding}
            showsVerticalScrollIndicator={false}
          />
        ) : (
          <View style={styles.center}>
            <Ionicons name="search-outline" size={64} color="#E2E8F0" />
            <Text style={styles.noResultText}>Không tìm thấy sản phẩm nào phù hợp</Text>
            <Text style={styles.noResultSub}>Thử tìm kiếm với từ khóa khác nhé!</Text>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  backBtn: {
    padding: 5,
    marginRight: 10,
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.bgGray,
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 44,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 15,
    color: COLORS.textDark,
  },
  content: {
    flex: 1,
  },
  resultHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  resultTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.textDark,
  },
  filterBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: COLORS.primaryLight,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  filterText: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.primary,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 100,
  },
  productWrapper: {
    flex: 1,
    padding: 10,
    maxWidth: '50%',
  },
  listPadding: {
    paddingHorizontal: 10,
    paddingBottom: 20,
  },
  noResultText: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.textDark,
    marginTop: 20,
  },
  noResultSub: {
    fontSize: 14,
    color: COLORS.textLight,
    marginTop: 5,
  },
});
