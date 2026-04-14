const ProductSkeleton = () => {
  return (
    <div className="bg-white rounded-2xl overflow-hidden border border-gray-100 h-full flex flex-col shadow-sm">
      {/* Image skeleton */}
      <div className="aspect-square w-full animate-pulse-soft bg-gray-100" />
      
      {/* Content skeleton */}
      <div className="p-5 flex-1 flex flex-col">
        {/* Title skeleton */}
        <div className="mb-4 space-y-2">
          <div className="h-5 w-full animate-pulse-soft rounded-lg bg-gray-100" />
          <div className="h-5 w-2/3 animate-pulse-soft rounded-lg bg-gray-100" />
        </div>
        
        {/* Info skeleton */}
        <div className="mb-4 flex items-center justify-between">
          <div className="h-4 w-1/3 animate-pulse-soft rounded-lg bg-gray-100" />
          <div className="h-4 w-1/4 animate-pulse-soft rounded-lg bg-gray-100" />
        </div>
        
        {/* Price skeleton */}
        <div className="mt-auto">
          <div className="h-8 w-1/2 animate-pulse-soft rounded-lg bg-gray-100 mb-4" />
          <div className="h-10 w-full animate-pulse-soft rounded-full bg-gray-100" />
        </div>
      </div>
    </div>
  )
}

export default ProductSkeleton
