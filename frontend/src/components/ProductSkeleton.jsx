const ProductSkeleton = () => {
  return (
    <div className="bg-white rounded-2xl overflow-hidden border border-gray-100 h-full flex flex-col shadow-sm">
      {/* Image skeleton with shimmer effect */}
      <div className="aspect-square w-full relative overflow-hidden bg-gray-100">
        <div className="absolute inset-0 animate-shimmer bg-gradient-to-r from-transparent via-white/60 to-transparent" />
      </div>
      
      {/* Content skeleton */}
      <div className="p-5 flex-1 flex flex-col">
        {/* Title skeleton */}
        <div className="mb-4 space-y-2">
          <div className="h-5 w-full rounded-lg bg-gray-100 relative overflow-hidden">
            <div className="absolute inset-0 animate-shimmer bg-gradient-to-r from-transparent via-white/60 to-transparent" />
          </div>
          <div className="h-5 w-2/3 rounded-lg bg-gray-100 relative overflow-hidden">
            <div className="absolute inset-0 animate-shimmer bg-gradient-to-r from-transparent via-white/60 to-transparent" />
          </div>
        </div>
        
        {/* Info skeleton */}
        <div className="mb-4 flex items-center justify-between">
          <div className="h-4 w-1/3 rounded-lg bg-gray-100 relative overflow-hidden">
            <div className="absolute inset-0 animate-shimmer bg-gradient-to-r from-transparent via-white/60 to-transparent" />
          </div>
          <div className="h-4 w-1/4 rounded-lg bg-gray-100 relative overflow-hidden">
            <div className="absolute inset-0 animate-shimmer bg-gradient-to-r from-transparent via-white/60 to-transparent" />
          </div>
        </div>
        
        {/* Price skeleton */}
        <div className="mt-auto">
          <div className="h-8 w-1/2 rounded-lg bg-gray-100 mb-4 relative overflow-hidden">
            <div className="absolute inset-0 animate-shimmer bg-gradient-to-r from-transparent via-white/60 to-transparent" />
          </div>
          <div className="h-10 w-full rounded-full bg-gray-100 relative overflow-hidden">
            <div className="absolute inset-0 animate-shimmer bg-gradient-to-r from-transparent via-white/60 to-transparent" />
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductSkeleton
