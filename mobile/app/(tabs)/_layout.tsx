import React from 'react';
import { Tabs } from 'expo-router';
import { View, Text, StyleSheet, Animated, Platform } from 'react-native';
import { FontAwesome5, Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// ─── Animated Tab Icon ────────────────────────────────────────────────────────
function TabIcon({
  focused,
  children,
  label,
  badge,
}: {
  focused: boolean;
  children: React.ReactNode;
  label: string;
  badge?: number;
}) {
  const scaleRef = React.useRef(new Animated.Value(1)).current;

  React.useEffect(() => {
    if (focused) {
      Animated.sequence([
        Animated.spring(scaleRef, { toValue: 1.25, useNativeDriver: true, speed: 30 }),
        Animated.spring(scaleRef, { toValue: 1.0,  useNativeDriver: true, speed: 20 }),
      ]).start();
    }
  }, [focused]);

  return (
    <View style={tabStyles.wrapper}>
      <Animated.View
        style={[
          tabStyles.iconWrap,
          focused && tabStyles.iconWrapActive,
          { transform: [{ scale: scaleRef }] },
        ]}
      >
        {children}
        {badge !== undefined && badge > 0 && (
          <View style={tabStyles.badge}>
            <Text style={tabStyles.badgeText}>{badge > 9 ? '9+' : badge}</Text>
          </View>
        )}
      </Animated.View>
      <Text style={[tabStyles.label, focused && tabStyles.labelActive]}>{label}</Text>
    </View>
  );
}

const tabStyles = StyleSheet.create({
  wrapper: {
    alignItems: 'center',
    paddingTop: 6,
    minWidth: 60,
  },
  iconWrap: {
    width: 44,
    height: 30,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  iconWrapActive: {
    backgroundColor: '#FFF7ED',
  },
  label: {
    fontSize: 10,
    fontWeight: '600',
    color: '#9CA3AF',
    marginTop: 2,
  },
  labelActive: {
    color: '#FF6A00',
    fontWeight: '800',
  },
  badge: {
    position: 'absolute',
    top: -4,
    right: -6,
    backgroundColor: '#EF4444',
    borderRadius: 8,
    minWidth: 16,
    height: 16,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 3,
    borderWidth: 1.5,
    borderColor: 'white',
  },
  badgeText: {
    color: 'white',
    fontSize: 9,
    fontWeight: '800',
  },
});

// ─── Layout ───────────────────────────────────────────────────────────────────
export default function TabLayout() {
  const insets = useSafeAreaInsets();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {
          height: 64 + insets.bottom,
          paddingBottom: insets.bottom > 0 ? insets.bottom : 8,
          paddingTop: 4,
          backgroundColor: 'white',
          borderTopWidth: 1,
          borderTopColor: '#F1F5F9',
          ...Platform.select({
            ios: {
              shadowColor: '#000',
              shadowOffset: { width: 0, height: -4 },
              shadowOpacity: 0.06,
              shadowRadius: 12,
            },
            android: {
              elevation: 16,
            },
            web: {
              // @ts-ignore
              boxShadow: '0 -4px 12px rgba(0,0,0,0.06)',
            }
          }),
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} label="Trang Chủ">
              <Ionicons name={focused ? 'home' : 'home-outline'} size={22} color={focused ? '#FF6A00' : '#9CA3AF'} />
            </TabIcon>
          ),
        }}
      />
      <Tabs.Screen
        name="categories"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} label="Danh Mục">
              <FontAwesome5 name="th-large" size={19} color={focused ? '#FF6A00' : '#9CA3AF'} />
            </TabIcon>
          ),
        }}
      />
      <Tabs.Screen
        name="cart"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} label="Giỏ Hàng" badge={2}>
              <Ionicons name={focused ? 'cart' : 'cart-outline'} size={24} color={focused ? '#FF6A00' : '#9CA3AF'} />
            </TabIcon>
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} label="Tài Khoản">
              <FontAwesome5 name={focused ? 'user-alt' : 'user'} size={19} color={focused ? '#FF6A00' : '#9CA3AF'} />
            </TabIcon>
          ),
        }}
      />
    </Tabs>
  );
}
