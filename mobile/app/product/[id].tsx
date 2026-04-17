import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  SafeAreaView,
  ActivityIndicator,
  Share,
  Platform,
  Animated,
  StatusBar,
} from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { getProductBySlug, ProductResponse } from '../../api';
import { COLORS, SCREEN_WIDTH } from '../../constants/theme';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';

export default function ProductDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const [product, setProduct] = useState<ProductResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [added, setAdded] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedVariant, setSelectedVariant] = useState('256GB');
  const [selectedColor, setSelectedColor] = useState('Titan Tự Nhiên');

  const scrollY = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        if (id) {
          const data = await getProductBySlug(id as string);
          setProduct(data);
        }
      } catch (error) {
        console.error('Error fetching product:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const onShare = async () => {
    try {
      if (product) {
        await Share.share({ message: `Khám phá ${product.name} tại TECHZONE!` });
      }
    } catch (error) {
      console.error(error);
    }
  };

  const headerOpacity = scrollY.interpolate({
    inputRange: [SCREEN_WIDTH * 0.5, SCREEN_WIDTH * 0.8],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });

  const handleAddToCart = () => {
    if (product) {
      addToCart(product, { color: selectedColor, variant: selectedVariant });
      setAdded(true);
      setTimeout(() => setAdded(false), 2000);
    }
  };

  const handleBuyNow = () => {
    if (product) {
      addToCart(product, { color: selectedColor, variant: selectedVariant });
      router.push('/cart');
    }
  };

  if (loading) return (
    <View style={styles.center}>
      <ActivityIndicator size="large" color={COLORS.primary} />
    </View>
  );

  if (!product) return (
    <View style={styles.center}>
      <Text style={styles.errorText}>Không tìm thấy sản phẩm!</Text>
      <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
        <Text style={styles.backBtnText}>Quay lại</Text>
      </TouchableOpacity>
    </View>
  );

  const isFavorite = isInWishlist(product.id);
  const discount = Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: product?.name || 'Chi tiết', headerShown: false }} />
      <StatusBar barStyle="dark-content" translucent backgroundColor="transparent" />
      
      {/* Dynamic Header */}
      <Animated.View style={[styles.stickyHeader, { opacity: headerOpacity }]}>
        <SafeAreaView>
          <View style={styles.headerContent}>
            <TouchableOpacity onPress={() => router.back()} style={styles.headerBtn}>
              <Ionicons name="arrow-back" size={24} color={COLORS.textDark} />
            </TouchableOpacity>
            <Animated.Text 
              numberOfLines={1} 
              style={[styles.headerTitleText, { transform: [{ translateY: headerOpacity.interpolate({ inputRange: [0, 1], outputRange: [20, 0] }) }] }]}
            >
              {product?.name}
            </Animated.Text>
            <TouchableOpacity onPress={onShare} style={styles.headerBtn}>
              <Ionicons name="share-social-outline" size={22} color={COLORS.textDark} />
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </Animated.View>

      {/* Floating Buttons */}
      <SafeAreaView style={styles.floatingHeader}>
        <View style={styles.headerContent}>
          <TouchableOpacity onPress={() => router.back()} style={styles.floatingBtn}>
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
          <View style={{ flexDirection: 'row', gap: 10 }}>
            <TouchableOpacity onPress={onShare} style={styles.floatingBtn}>
              <Ionicons name="share-social-outline" size={22} color="white" />
            </TouchableOpacity>
            <TouchableOpacity 
              onPress={() => toggleWishlist(product)} 
              style={[styles.floatingBtn, isFavorite && { backgroundColor: 'white' }]}
            >
              <Ionicons name={isFavorite ? "heart" : "heart-outline"} size={22} color={isFavorite ? COLORS.danger : "white"} />
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>

      <Animated.ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 120 }}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false }
        )}
        scrollEventThrottle={16}
      >
        {/* Full-width Image Slider */}
        <View style={styles.imageSection}>
          <ScrollView
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onMomentumScrollEnd={(e) => {
              const index = Math.round(e.nativeEvent.contentOffset.x / SCREEN_WIDTH);
              setSelectedImage(index);
            }}
          >
            {product.imageUrls && product.imageUrls.length > 0 ? (
              product.imageUrls.map((url, idx) => (
                <Image key={idx} source={{ uri: url }} style={styles.productImg} resizeMode="contain" />
              ))
            ) : (
              <View style={[styles.productImg, styles.placeholderImg]}>
                <MaterialCommunityIcons name="image-off-outline" size={80} color="#E2E8F0" />
              </View>
            )}
          </ScrollView>
          
          <View style={styles.indicatorContainer}>
            {product.imageUrls && product.imageUrls.length > 1 && product.imageUrls.map((_, idx) => (
              <View 
                key={idx} 
                style={[styles.indicatorBar, selectedImage === idx ? styles.indicatorActive : { opacity: 0.3 }]} 
              />
            ))}
          </View>
        </View>

        {/* Product Essential Info */}
        <View style={styles.infoBlock}>
          <View style={styles.badgeRow}>
            <View style={[styles.badge, { backgroundColor: COLORS.primaryLight }]}>
              <Text style={[styles.badgeText, { color: COLORS.primary }]}>{product.category?.name?.toUpperCase() || 'SẢN PHẨM'}</Text>
            </View>
            {product?.isNew && (
              <View style={[styles.badge, { backgroundColor: '#DEF7EC' }]}>
                <Text style={[styles.badgeText, { color: '#03543F' }]}>MỚI VỀ</Text>
              </View>
            )}
          </View>

          <Text style={styles.productName}>{product?.name}</Text>
          
          <View style={styles.ratingRow}>
            <View style={styles.stars}>
              {[1, 2, 3, 4, 5].map((s) => (
                <Ionicons key={s} name="star" size={16} color={product && s <= product.rating ? COLORS.secondary : '#E5E7EB'} />
              ))}
            </View>
            <Text style={styles.ratingValue}>{product?.rating?.toFixed(1) || '4.9'}</Text>
            <View style={styles.vDivider} />
            <Text style={styles.soldText}>Đã bán {product?.soldCount || 0}</Text>
          </View>

          {/* Price Section */}
          <View style={styles.priceContainer}>
            <View style={styles.priceMainRow}>
              <Text style={styles.currentPrice}>{product?.price?.toLocaleString('vi-VN')}đ</Text>
              {product && product.originalPrice > product.price && (
                <View style={styles.discountBadge}>
                  <Text style={styles.discountBadgeText}>-{discount}%</Text>
                </View>
              )}
            </View>
            {product && product.originalPrice > product.price && (
              <Text style={styles.originalPrice}>Giá niêm yết: {product?.originalPrice?.toLocaleString('vi-VN')}đ</Text>
            )}
          </View>
        </View>

        {/* Promotion Block */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <Ionicons name="gift" size={20} color={COLORS.primary} />
            <Text style={styles.sectionTitle}>Ưu đãi độc quyền TECHZONE</Text>
          </View>
          <PromoItem text="Tặng Gói bảo hành rơi vỡ 12 tháng trị giá 1.200.000đ" />
          <PromoItem text="Giảm thêm 5% tối đa 500k cho thành viên TECH-Club" />
          <PromoItem text="Thu cũ đổi mới trợ giá đến 2.000.000đ" />
        </View>

        {/* Variant Selection */}
        <View style={styles.sectionCard}>
          <Text style={styles.selectionTitle}>Chọn Dung lượng</Text>
          <View style={styles.optionList}>
            {['128GB', '256GB', '512GB', '1TB'].map((v) => (
              <OptionItem key={v} label={v} active={selectedVariant === v} onPress={() => setSelectedVariant(v)} />
            ))}
          </View>

          <Text style={[styles.selectionTitle, { marginTop: 20 }]}>Chọn Màu sắc</Text>
          <View style={styles.optionList}>
            {['Titan Tự Nhiên', 'Titan Đen', 'Titan Trắng'].map((c) => (
              <OptionItem key={c} label={c} active={selectedColor === c} onPress={() => setSelectedColor(c)} />
            ))}
          </View>
        </View>

        {/* Trust Badges */}
        <View style={styles.trustRow}>
          <TrustItem icon="checkmark-circle" label="Chính hãng" />
          <TrustItem icon="shield-checkmark" label="Bảo hành 12th" />
          <TrustItem icon="refresh" label="1 đổi 1 30 ngày" />
        </View>

        {/* Description Section */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Mô tả sản phẩm</Text>
          <Text style={styles.description} numberOfLines={5}>
            {product?.name} là đỉnh cao công nghệ của năm 2024, mang đến trải nghiệm người dùng hoàn hảo với thiết kế sang trọng và hiệu năng vượt trội.
          </Text>
          <TouchableOpacity style={styles.readMoreBtn}>
            <Text style={styles.readMoreText}>Xem tất cả mô tả</Text>
            <Ionicons name="chevron-down" size={16} color={COLORS.primary} />
          </TouchableOpacity>
        </View>

      </Animated.ScrollView>

      {/* Sticky Bottom Actions */}
      <View style={styles.bottomBar}>
        <TouchableOpacity style={styles.sideAction}>
          <Ionicons name="chatbubble-ellipses-outline" size={24} color={COLORS.textDark} />
          <Text style={styles.sideActionText}>Chat</Text>
        </TouchableOpacity>
        <View style={styles.vDividerLarge} />
        <TouchableOpacity 
          style={[styles.addToCartBtn, added && { backgroundColor: COLORS.success, borderColor: COLORS.success }]} 
          onPress={handleAddToCart}
        >
          <Text style={[styles.addToCartText, added && { color: 'white' }]}>{added ? 'Đã thêm' : 'Thêm vào giỏ'}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.buyNowBtn} activeOpacity={0.8} onPress={handleBuyNow}>
          <Text style={styles.buyNowText}>Mua Ngay</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const PromoItem = ({ text }: { text: string }) => (
  <View style={styles.promoItem}><View style={styles.promoBullet} /><Text style={styles.promoText}>{text}</Text></View>
);

const OptionItem = ({ label, active, onPress }: any) => (
  <TouchableOpacity onPress={onPress} style={[styles.optionItem, active && styles.optionItemActive]}><Text style={[styles.optionLabel, active && styles.optionLabelActive]}>{label}</Text></TouchableOpacity>
);

const TrustItem = ({ icon, label }: any) => (
  <View style={styles.trustItem}><Ionicons name={icon} size={18} color="#22C55E" /><Text style={styles.trustText}>{label}</Text></View>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.white },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  stickyHeader: { position: 'absolute', top: 0, left: 0, right: 0, zIndex: 100, backgroundColor: 'rgba(255,255,255,0.95)', borderBottomWidth: 1, borderBottomColor: COLORS.border, paddingBottom: 10 },
  headerBtn: { width: 40, height: 40, justifyContent: 'center', alignItems: 'center' },
  headerContent: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 15, height: 50 },
  headerTitleText: { flex: 1, fontSize: 16, fontWeight: '800', color: COLORS.textDark, textAlign: 'center', paddingHorizontal: 10 },
  floatingHeader: { position: 'absolute', top: Platform.OS === 'ios' ? 44 : 10, left: 0, right: 0, zIndex: 90 },
  floatingBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(0,0,0,0.3)', justifyContent: 'center', alignItems: 'center' },
  imageSection: { width: SCREEN_WIDTH, height: SCREEN_WIDTH, backgroundColor: 'white' },
  productImg: { width: SCREEN_WIDTH, height: SCREEN_WIDTH },
  placeholderImg: { justifyContent: 'center', alignItems: 'center', backgroundColor: '#F9FAFB' },
  indicatorContainer: { flexDirection: 'row', position: 'absolute', bottom: 20, left: 20, right: 20, justifyContent: 'center', gap: 6 },
  indicatorBar: { height: 4, flex: 1, maxWidth: 40, borderRadius: 2, backgroundColor: 'rgba(0,0,0,0.2)' },
  indicatorActive: { backgroundColor: COLORS.primary },
  infoBlock: { padding: 20, paddingTop: 10 },
  badgeRow: { flexDirection: 'row', gap: 8, marginBottom: 12 },
  badge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6 },
  badgeText: { fontSize: 10, fontWeight: '900' },
  productName: { fontSize: 22, fontWeight: '900', color: COLORS.textDark, lineHeight: 28, marginBottom: 12 },
  ratingRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
  stars: { flexDirection: 'row', gap: 2, marginRight: 8 },
  ratingValue: { fontSize: 14, fontWeight: '800', color: COLORS.textDark },
  vDivider: { width: 1, height: 12, backgroundColor: '#E5E7EB', marginHorizontal: 12 },
  soldText: { fontSize: 14, color: COLORS.textLight, fontWeight: '500' },
  priceContainer: { backgroundColor: '#FFF7ED', padding: 15, borderRadius: 16, borderWidth: 1, borderColor: '#FFEDD5' },
  priceMainRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  currentPrice: { fontSize: 26, fontWeight: '900', color: COLORS.primary },
  discountBadge: { backgroundColor: COLORS.danger, paddingHorizontal: 6, paddingVertical: 2, borderRadius: 6 },
  discountBadgeText: { color: 'white', fontSize: 12, fontWeight: '900' },
  originalPrice: { fontSize: 13, color: COLORS.textLight, textDecorationLine: 'line-through', marginTop: 4 },
  sectionCard: { marginHorizontal: 20, marginTop: 20, padding: 20, backgroundColor: 'white', borderRadius: 24, borderWidth: 1, borderColor: COLORS.border },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 15 },
  sectionTitle: { fontSize: 16, fontWeight: '900', color: COLORS.textDark },
  promoItem: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 10, gap: 12 },
  promoBullet: { width: 6, height: 6, borderRadius: 3, backgroundColor: COLORS.primary, marginTop: 7 },
  promoText: { flex: 1, fontSize: 14, color: COLORS.textDark, lineHeight: 20, fontWeight: '500' },
  selectionTitle: { fontSize: 15, fontWeight: '800', color: COLORS.textDark, marginBottom: 15 },
  optionList: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  optionItem: { paddingHorizontal: 16, paddingVertical: 10, borderRadius: 12, borderWidth: 1.5, borderColor: '#E2E8F0' },
  optionItemActive: { borderColor: COLORS.primary, backgroundColor: COLORS.primaryLight },
  optionLabel: { fontSize: 13, fontWeight: '700', color: COLORS.textLight },
  optionLabelActive: { color: COLORS.primary },
  trustRow: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 25, marginTop: 25 },
  trustItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  trustText: { fontSize: 11, fontWeight: '700', color: '#475569' },
  description: { fontSize: 14, color: COLORS.textLight, lineHeight: 22, marginTop: 10, fontWeight: '500' },
  readMoreBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: 15, gap: 5 },
  readMoreText: { fontSize: 14, color: COLORS.primary, fontWeight: '700' },
  bottomBar: { position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: 'white', flexDirection: 'row', alignItems: 'center', paddingHorizontal: 15, paddingTop: 15, paddingBottom: Platform.OS === 'ios' ? 35 : 20, borderTopWidth: 1, borderTopColor: COLORS.border, shadowColor: '#000', shadowOffset: { width: 0, height: -10 }, shadowOpacity: 0.05, shadowRadius: 20, elevation: 20 },
  sideAction: { alignItems: 'center', paddingHorizontal: 10 },
  sideActionText: { fontSize: 10, fontWeight: '700', color: COLORS.textDark, marginTop: 2 },
  vDividerLarge: { width: 1, height: 40, backgroundColor: COLORS.border, marginHorizontal: 10 },
  addToCartBtn: { flex: 1, height: 52, borderRadius: 16, justifyContent: 'center', alignItems: 'center', marginRight: 10, borderWidth: 1.5, borderColor: COLORS.primary },
  addToCartText: { color: COLORS.primary, fontSize: 14, fontWeight: '900' },
  buyNowBtn: { flex: 1.5, height: 52, backgroundColor: COLORS.primary, borderRadius: 16, justifyContent: 'center', alignItems: 'center' },
  buyNowText: { color: 'white', fontSize: 16, fontWeight: '900' },
  backBtn: { marginTop: 20, paddingHorizontal: 25, paddingVertical: 12, backgroundColor: COLORS.primary, borderRadius: 12 },
  backBtnText: { color: 'white', fontWeight: '800' },
  errorText: { fontSize: 18, color: COLORS.textDark, fontWeight: '700' },
});
