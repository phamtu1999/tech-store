const DEFAULT_PRODUCT_PLACEHOLDER = `data:image/svg+xml,${encodeURIComponent(
  "<svg xmlns='http://www.w3.org/2000/svg' width='800' height='800' viewBox='0 0 24 24' fill='none' stroke='%23cbd5e1' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'><rect x='3' y='3' width='18' height='18' rx='2' ry='2'/><circle cx='8.5' cy='8.5' r='1.5'/><polyline points='21 15 16 10 5 21'/></svg>"
)}`

const PLACEHOLDER_HOSTS = ['picsum.photos', 'placehold.co', 'via.placeholder.com', 'dummyimage.com']

const MODEL_IMAGE_RULES = [
  {
    keywords: ['iphone 15 pro max'],
    imageUrl: 'https://fdn2.gsmarena.com/vv/pics/apple/apple-iphone-15-pro-max-1.jpg',
  },
  {
    keywords: ['galaxy s24 ultra'],
    imageUrl: 'https://fdn2.gsmarena.com/vv/pics/samsung/samsung-galaxy-s24-ultra-5g-sm-s928-0.jpg',
  },
  {
    keywords: ['macbook pro 14 m3'],
    imageUrl: 'https://images.unsplash.com/photo-1517336714739-489689fd1ca8?auto=format&fit=crop&w=1400&q=80',
  },
  {
    keywords: ['rog zephyrus g14'],
    imageUrl: 'https://images.unsplash.com/photo-1593640408182-31c70c8268f5?auto=format&fit=crop&w=1400&q=80',
  },
  {
    keywords: ['ipad pro m2'],
    imageUrl: 'https://fdn2.gsmarena.com/vv/pics/apple/apple-ipad-pro-11-2022-1.jpg',
  },
  {
    keywords: ['airpods pro'],
    imageUrl: 'https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?auto=format&fit=crop&w=1400&q=80',
  },
  {
    keywords: ['galaxy z fold5'],
    imageUrl: 'https://fdn2.gsmarena.com/vv/pics/samsung/samsung-galaxy-z-fold5-5g-1.jpg',
  },
  {
    keywords: ['wh 1000xm5'],
    imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1400&q=80',
  },
  {
    keywords: ['apple watch series 9'],
    imageUrl: 'https://fdn2.gsmarena.com/vv/pics/apple/apple-watch-series9-1.jpg',
  },
  {
    keywords: ['dell xps 13 plus'],
    imageUrl: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=1400&q=80',
  },
  {
    keywords: ['tab s9 ultra'],
    imageUrl: 'https://fdn2.gsmarena.com/vv/pics/samsung/samsung-galaxy-tab-s9-ultra-5g-2.jpg',
  },
  {
    keywords: ['xiaomi 14 ultra'],
    imageUrl: 'https://fdn2.gsmarena.com/vv/pics/xiaomi/xiaomi-14-ultra-1.jpg',
  },
  {
    keywords: ['spectre x360 14'],
    imageUrl: 'https://images.unsplash.com/photo-1527443195645-1133f7f28990?auto=format&fit=crop&w=1400&q=80',
  },
  {
    keywords: ['mx master 3s'],
    imageUrl: 'https://images.unsplash.com/photo-1527814050087-3793815479db?auto=format&fit=crop&w=1400&q=80',
  },
  {
    keywords: ['keychron q1 pro'],
    imageUrl: 'https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?auto=format&fit=crop&w=1400&q=80',
  },
  {
    keywords: ['surface pro 9'],
    imageUrl: 'https://images.unsplash.com/photo-1629131726692-1accd0c53ce0?auto=format&fit=crop&w=1400&q=80',
  },
  {
    keywords: ['garmin fenix 7 pro'],
    imageUrl: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1400&q=80',
  },
  {
    keywords: ['vivobook s 15 oled'],
    imageUrl: 'https://images.unsplash.com/photo-1484788984921-03950022c9ef?auto=format&fit=crop&w=1400&q=80',
  },
  {
    keywords: ['find n3 flip'],
    imageUrl: 'https://fdn2.gsmarena.com/vv/pics/oppo/oppo-find-n3-flip-1.jpg',
  },
  {
    keywords: ['anker 737'],
    imageUrl: 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?auto=format&fit=crop&w=1400&q=80',
  },
]

const FALLBACK_TAGS = {
  phone: ['smartphone', 'product'],
  laptop: ['laptop', 'computer'],
  tablet: ['tablet', 'device'],
  watch: ['smartwatch', 'wearable'],
  audio: ['headphones', 'earbuds'],
  accessory: ['tech', 'gadget'],
}

const normalizeText = (value = '') =>
  String(value)
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()

const isPlaceholderImageUrl = (url = '') => {
  if (!url || typeof url !== 'string') return true
  if (url.startsWith('data:image')) return false

  try {
    const hostname = new URL(url, 'http://localhost').hostname
    return PLACEHOLDER_HOSTS.some((host) => hostname.includes(host))
  } catch {
    return false
  }
}

const extractImageCandidates = (payload = {}) => {
  const candidates = []

  if (Array.isArray(payload.imageUrls)) {
    candidates.push(...payload.imageUrls)
  }
  if (payload.imageUrl) {
    candidates.push(payload.imageUrl)
  }
  if (payload.productImage) {
    candidates.push(payload.productImage)
  }

  return candidates.filter((url) => typeof url === 'string' && url.trim() !== '')
}

const getProductSearchText = (payload = {}) =>
  normalizeText(
    [
      payload.name,
      payload.productName,
      payload.variantName,
      payload.slug,
      payload.brand?.name,
      payload.brandName,
      payload.category?.name,
      payload.categoryName,
    ]
      .filter(Boolean)
      .join(' ')
  )

const findMappedImage = (normalizedText) => {
  for (const rule of MODEL_IMAGE_RULES) {
    if (rule.keywords.every((keyword) => normalizedText.includes(keyword))) {
      return rule.imageUrl
    }
  }
  return ''
}

const hashString = (value) => {
  let hash = 0
  for (let i = 0; i < value.length; i += 1) {
    hash = (hash * 31 + value.charCodeAt(i)) % 1000003
  }
  return Math.abs(hash)
}

const getCategoryTags = (normalizedText) => {
  if (normalizedText.includes('iphone') || normalizedText.includes('galaxy') || normalizedText.includes('xiaomi') || normalizedText.includes('oppo') || normalizedText.includes('phone')) {
    return FALLBACK_TAGS.phone
  }
  if (normalizedText.includes('laptop') || normalizedText.includes('macbook') || normalizedText.includes('xps') || normalizedText.includes('vivobook') || normalizedText.includes('spectre')) {
    return FALLBACK_TAGS.laptop
  }
  if (normalizedText.includes('ipad') || normalizedText.includes('tab') || normalizedText.includes('surface')) {
    return FALLBACK_TAGS.tablet
  }
  if (normalizedText.includes('watch') || normalizedText.includes('fenix')) {
    return FALLBACK_TAGS.watch
  }
  if (normalizedText.includes('airpods') || normalizedText.includes('headphone') || normalizedText.includes('sony wh')) {
    return FALLBACK_TAGS.audio
  }
  return FALLBACK_TAGS.accessory
}

const buildSearchImageUrl = (normalizedText) => {
  const words = normalizedText
    .split(' ')
    .filter((word) => word.length > 1)
    .slice(0, 5)

  const tags = words.length > 0 ? words : getCategoryTags(normalizedText)
  const lock = hashString(normalizedText || tags.join('-'))

  return `https://loremflickr.com/1200/1200/${tags.join(',')}?lock=${lock}`
}

export const getProductImageSources = (payload = {}) => {
  const normalizedText = getProductSearchText(payload)
  const mappedImage = findMappedImage(normalizedText)
  const searchImage = buildSearchImageUrl(normalizedText)
  const candidates = extractImageCandidates(payload)
  const firstRealImage = candidates.find((url) => !isPlaceholderImageUrl(url))

  const primary = firstRealImage || mappedImage || searchImage || DEFAULT_PRODUCT_PLACEHOLDER
  const fallback =
    (mappedImage && mappedImage !== primary && mappedImage) ||
    (searchImage && searchImage !== primary && searchImage) ||
    DEFAULT_PRODUCT_PLACEHOLDER

  return { primary, fallback }
}

export const getProductGalleryImages = (payload = {}) => {
  const candidates = extractImageCandidates(payload).filter((url) => !isPlaceholderImageUrl(url))
  if (candidates.length > 0) {
    return candidates
  }

  const { primary } = getProductImageSources(payload)
  return primary ? [primary] : [DEFAULT_PRODUCT_PLACEHOLDER]
}

export const handleProductImageError = (event, fallbackUrl = '') => {
  const element = event.currentTarget
  const hasFallback = fallbackUrl && element.dataset.fallbackApplied !== 'true' && element.src !== fallbackUrl

  if (hasFallback) {
    element.dataset.fallbackApplied = 'true'
    element.src = fallbackUrl
    return
  }

  element.dataset.fallbackApplied = 'true'
  element.src = DEFAULT_PRODUCT_PLACEHOLDER
}

export { DEFAULT_PRODUCT_PLACEHOLDER }
