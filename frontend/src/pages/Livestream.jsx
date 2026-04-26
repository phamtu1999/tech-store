import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { fetchLivestreams } from '../store/slices/livestreamSlice';
import { Video, Users, Play, Calendar } from 'lucide-react';

const Livestream = () => {
    const dispatch = useDispatch();
    const { streams, loading } = useSelector((state) => state.livestream);

    useEffect(() => {
        dispatch(fetchLivestreams());
    }, [dispatch]);

    return (
        <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-8">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 sm:gap-8 mb-6 sm:mb-8">
                <div className="max-w-2xl">
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-2 leading-tight">
                        <Video className="text-red-500 shrink-0" />
                        <span>Trực tiếp & Sự kiện</span>
                    </h1>
                    <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mt-1">Theo dõi các buổi livestream giới thiệu sản phẩm mới nhất</p>
                </div>
            </div>

            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3].map((n) => (
                        <div key={n} className="bg-white rounded-2xl overflow-hidden shadow-sm animate-pulse">
                            <div className="aspect-video bg-gray-200"></div>
                            <div className="p-4 space-y-3">
                                <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : streams.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                    {streams.map((stream) => (
                        <Link 
                            key={stream.id} 
                            to={`/livestream/${stream.id}`}
                            className="group bg-white dark:bg-dark-card rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                        >
                            <div className="relative aspect-video">
                                <img 
                                    src={stream.thumbnailUrl || 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=1000&auto=format&fit=crop'} 
                                    alt={stream.title}
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute top-3 left-3 sm:top-4 sm:left-4 flex items-center gap-2 flex-wrap">
                                    <span className="bg-red-500 text-white px-2.5 sm:px-3 py-1 rounded-full text-[10px] sm:text-xs font-bold flex items-center gap-1 animate-pulse">
                                        <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                                        TRỰC TIẾP
                                    </span>
                                    <span className="bg-black/50 backdrop-blur-md text-white px-2.5 sm:px-3 py-1 rounded-full text-[10px] sm:text-xs font-medium flex items-center gap-1">
                                        <Users size={12} />
                                        {stream.viewerCount || 0}
                                    </span>
                                </div>
                                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                                    <div className="w-11 h-11 sm:w-12 sm:h-12 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center scale-100 sm:scale-0 group-hover:scale-100 transition-transform duration-300">
                                        <Play className="text-white fill-white ml-1" />
                                    </div>
                                </div>
                            </div>
                            <div className="p-4">
                                <div className="flex items-center gap-3 mb-3 min-w-0">
                                    <img 
                                        src={stream.streamerAvatar || 'https://ui-avatars.com/api/?name=' + stream.streamerUsername} 
                                        alt={stream.streamerUsername}
                                        className="w-10 h-10 rounded-full border-2 border-primary-100 flex-shrink-0"
                                    />
                                    <div className="min-w-0">
                                        <h3 className="font-bold text-gray-900 dark:text-white line-clamp-1 group-hover:text-primary-600 transition-colors text-sm sm:text-base">
                                            {stream.title}
                                        </h3>
                                        <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">{stream.streamerUsername}</p>
                                    </div>
                                </div>
                                {stream.productName && (
                                    <div className="mt-3 p-2 bg-gray-50 dark:bg-white/5 rounded-lg flex items-center gap-2 min-w-0">
                                        <span className="text-xs font-medium text-gray-400 flex-shrink-0">Đang bán:</span>
                                        <span className="text-xs font-bold text-primary-600 line-clamp-1 min-w-0">{stream.productName}</span>
                                    </div>
                                )}
                            </div>
                        </Link>
                    ))}
                </div>
            ) : (
                <div className="text-center py-16 sm:py-20 bg-gray-50 dark:bg-dark-card rounded-3xl border-2 border-dashed border-gray-200 dark:border-white/10 px-4">
                    <Video size={56} className="mx-auto text-gray-300 mb-4" />
                    <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-2">Hiện không có livestream nào</h2>
                    <p className="text-gray-500 dark:text-gray-400 mb-6 text-sm sm:text-base">Hãy quay lại sau hoặc xem lịch phát sóng sắp tới</p>
                    <button className="bg-primary-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-primary-700 transition-colors flex items-center gap-2 mx-auto text-sm sm:text-base">
                        <Calendar size={18} />
                        Xem lịch phát sóng
                    </button>
                </div>
            )}
        </div>
    );
};

export default Livestream;
