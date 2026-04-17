export const formatPrice = (p: number) => {
  return p.toLocaleString('vi-VN') + 'đ';
};

export const getCategoryIcon = (name: string): any => {
  const map: Record<string, any> = {
    'Điện thoại': 'phone-portrait-outline',
    'Laptop': 'laptop-outline',
    'Âm thanh': 'headset-outline',
    'Đồng hồ': 'watch-outline',
    'Phụ kiện': 'briefcase-outline',
    'Máy tính': 'desktop-outline',
    'Tablet': 'tablet-portrait-outline',
  };
  return map[name] || 'apps-outline';
};

export const getProductEmoji = (categoryName: string) => {
  const map: Record<string, string> = {
    'Điện thoại': '📱',
    'Laptop': '💻',
    'Âm thanh': '🎧',
    'Đồng hồ': '⌚',
    'Máy tính': '🖥️',
    'Tablet': '📲',
  };
  return map[categoryName] || '📦';
};
