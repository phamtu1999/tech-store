import { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import { fetchLivestreamDetail, joinLivestream, leaveLivestream } from '../store/slices/livestreamSlice';
import { 
    Users, Heart, Share2, ShoppingBag, 
    Send, MessageCircle, X, Maximize2, Volume2 
} from 'lucide-react';

const LivestreamDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { currentStream, loading } = useSelector((state) => state.livestream);
    const { user } = useSelector((state) => state.auth);
    
    const [message, setMessage] = useState('');
    const [chatMessages, setChatMessages] = useState([
        { id: 1, user: 'Admin', text: 'Chào mừng các bạn đến với buổi livestream!', isAdmin: true },
        { id: 2, user: 'Nguyễn Văn A', text: 'Sản phẩm này có sale không ạ?' },
        { id: 3, user: 'Trần Thị B', text: 'Cho mình xem kỹ hơn về mặt sau camera nhé' },
    ]);
    const chatEndRef = useRef(null);

    useEffect(() => {
        // Join stream and fetch details
        dispatch(joinLivestream(id));
        dispatch(fetchLivestreamDetail(id));
        
        // Polling for real-time updates (Viewer count, Pinned product)
        const interval = setInterval(() => {
            dispatch(fetchLivestreamDetail(id));
        }, 5000); 

        return () => {
            clearInterval(interval);
            dispatch(leaveLivestream(id));
        };
    }, [id, dispatch]);

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [chatMessages]);

    const handleSendMessage = (e) => {
        e.preventDefault();
        if (!message.trim()) return;

        const newMessage = {
            id: Date.now(),
            user: user?.fullName || user?.username || 'Khách',
            text: message,
        };
        setChatMessages([...chatMessages, newMessage]);
        setMessage('');
    };

    if (loading && !currentStream) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-900">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
            </div>
        );
    }

    if (!currentStream) return null;

    return (
        <div className="bg-gray-950 min-h-screen lg:h-[calc(100vh-64px)] overflow-hidden flex flex-col lg:flex-row">
            {/* Video Section */}
            <div className="flex-1 relative bg-black group overflow-hidden min-h-[52vh] lg:min-h-0">
                <div className="absolute inset-0 flex items-center justify-center">
                    {/* Background Blur */}
                    <img 
                        src={currentStream.thumbnailUrl || 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=1000&auto=format&fit=crop'} 
                        className="w-full h-full object-cover opacity-30 blur-2xl scale-110"
                        alt="Background blur"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/60"></div>
                    
                    {/* Video Player Placeholder */}
                    <div className="relative z-10 w-full max-w-5xl aspect-video bg-gray-900 rounded-3xl shadow-2xl overflow-hidden border border-white/5 flex items-center justify-center group-hover:border-orange-500/30 transition-colors">
                        <div className="text-center">
                            <div className="w-24 h-24 bg-orange-500/20 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                                <Maximize2 size={40} className="text-orange-500" />
                            </div>
                            <h2 className="text-3xl font-black text-white tracking-tight">Tín hiệu đang tải...</h2>
                            <p className="text-gray-400 mt-2 font-medium">Đang kết nối đến máy chủ RTMP</p>
                            <div className="mt-6 flex justify-center gap-2">
                                <span className="w-2 h-2 bg-orange-500 rounded-full animate-bounce"></span>
                                <span className="w-2 h-2 bg-orange-500 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                                <span className="w-2 h-2 bg-orange-500 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Overlays */}
                <div className="absolute top-4 left-4 sm:top-8 sm:left-8 flex items-center gap-3 sm:gap-4 z-20 max-w-[calc(100%-1rem)] sm:max-w-none">
                    <div className="flex items-center gap-3 bg-black/40 backdrop-blur-2xl p-2.5 pl-2.5 pr-4 sm:pr-5 rounded-2xl border border-white/10 shadow-2xl">
                        <img 
                            src={currentStream.streamerAvatar || 'https://ui-avatars.com/api/?background=f97316&color=fff&name=' + currentStream.streamerUsername} 
                            alt={currentStream.streamerUsername}
                            className="w-12 h-12 rounded-xl border-2 border-orange-500 shadow-lg"
                        />
                        <div>
                            <p className="text-white font-black text-base leading-tight tracking-tight">{currentStream.streamerUsername}</p>
                            <p className="text-orange-400 text-xs font-bold flex items-center gap-1.5 mt-0.5">
                                <Users size={14} />
                                {currentStream.viewerCount || 0} người đang xem
                            </p>
                        </div>
                    </div>
                    <div className="bg-red-600 text-white px-4 py-2 rounded-xl text-[10px] font-black animate-pulse uppercase tracking-[0.2em] shadow-lg shadow-red-600/20">
                        TRỰC TIẾP
                    </div>
                </div>

                <div className="absolute top-4 right-4 sm:top-8 sm:right-8 flex items-center gap-2 sm:gap-3 z-20">
                    <button className="w-10 h-10 sm:w-12 sm:h-12 bg-black/40 backdrop-blur-2xl rounded-2xl text-white hover:bg-orange-500 transition-all flex items-center justify-center border border-white/10 shadow-2xl">
                        <Share2 size={18} className="sm:w-5 sm:h-5" />
                    </button>
                    <button onClick={() => navigate('/livestream')} className="w-10 h-10 sm:w-12 sm:h-12 bg-black/40 backdrop-blur-2xl rounded-2xl text-white hover:bg-red-500 transition-all flex items-center justify-center border border-white/10 shadow-2xl">
                        <X size={18} className="sm:w-5 sm:h-5" />
                    </button>
                </div>

                {/* Featured Product Overlay */}
                {currentStream.productId && (
                    <div className="absolute bottom-4 left-4 sm:bottom-10 sm:left-8 z-20 w-[calc(100%-2rem)] sm:w-full max-w-sm animate-in fade-in slide-in-from-bottom-8 duration-700">
                        <div 
                            onClick={() => navigate(`/product/${currentStream.productSlug}`)}
                            className="bg-white/95 backdrop-blur-3xl p-4 sm:p-5 rounded-[1.5rem] sm:rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.3)] flex items-center gap-4 sm:gap-5 border border-white/20 cursor-pointer hover:bg-white transition-all transform hover:-translate-y-2 group"
                        >
                            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden shadow-inner flex-shrink-0 bg-gray-50 border border-gray-100 p-2">
                                <img src={currentStream.productImage} alt={currentStream.productName} className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500" />
                            </div>
                            <div className="flex-1">
                                <div className="inline-flex items-center gap-1.5 bg-orange-100 text-orange-600 px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-wider mb-2">
                                    <ShoppingBag size={10} />
                                    Đang giới thiệu
                                </div>
                                <h3 className="text-base font-black text-gray-900 line-clamp-1 group-hover:text-orange-600 transition-colors tracking-tight">{currentStream.productName}</h3>
                                <div className="flex items-center justify-between mt-2">
                                    <p className="text-xs font-bold text-gray-500">Xem chi tiết sản phẩm</p>
                                    <div className="bg-orange-600 text-white p-2.5 rounded-xl group-hover:bg-orange-500 transition-colors shadow-lg shadow-orange-500/30">
                                        <ArrowRight size={18} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Heart/Like Action */}
                <div className="absolute bottom-4 right-4 sm:bottom-10 sm:right-8 flex flex-col gap-4 z-20">
                    <button className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-pink-500 to-rose-600 rounded-2xl flex items-center justify-center text-white shadow-2xl shadow-pink-500/20 hover:scale-110 active:scale-95 transition-all">
                        <Heart size={22} className="sm:w-7 sm:h-7" fill="currentColor" />
                    </button>
                </div>
            </div>

            {/* Chat Section */}
            <div className="w-full lg:w-[400px] bg-gray-900 flex flex-col border-l border-white/5 shadow-2xl z-30 relative max-h-[48vh] lg:max-h-none">
                <div className="p-4 sm:p-6 border-b border-white/5 flex items-center justify-between bg-gray-900/50 backdrop-blur-xl">
                    <h3 className="text-white font-black text-lg flex items-center gap-3">
                        <div className="p-2 bg-orange-500/10 rounded-xl">
                            <MessageCircle size={22} className="text-orange-500" />
                        </div>
                        Trò chuyện
                    </h3>
                    <div className="flex items-center gap-1.5 bg-gray-800 px-3 py-1.5 rounded-full text-gray-400 text-[10px] font-black uppercase tracking-wider">
                        <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
                        {currentStream.viewerCount || 0} Trực tuyến
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 sm:space-y-6 custom-scrollbar scroll-smooth">
                    {chatMessages.map((msg) => (
                        <div key={msg.id} className="flex gap-4 animate-in fade-in slide-in-from-left-4 duration-300">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-gray-700 to-gray-800 flex-shrink-0 flex items-center justify-center text-white text-sm font-black shadow-lg border border-white/5">
                                {msg.user[0].toUpperCase()}
                            </div>
                            <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1.5">
                                    <p className={`text-xs font-black tracking-tight ${msg.isAdmin ? 'text-orange-500' : 'text-gray-300'}`}>
                                        {msg.user}
                                    </p>
                                    <span className="text-[10px] text-gray-600 font-bold">12:30</span>
                                </div>
                                <div className={`p-4 rounded-2xl rounded-tl-none text-sm leading-relaxed shadow-sm ${
                                    msg.isAdmin 
                                    ? 'bg-orange-500/10 text-orange-100 border border-orange-500/20' 
                                    : 'bg-gray-800 text-gray-200 border border-white/5'
                                }`}>
                                    {msg.text}
                                </div>
                            </div>
                        </div>
                    ))}
                    <div ref={chatEndRef} />
                </div>

                <div className="p-4 sm:p-6 bg-gray-900/80 backdrop-blur-xl border-t border-white/5">
                    <form onSubmit={handleSendMessage} className="relative">
                        <input 
                            type="text" 
                            className="w-full bg-gray-800 text-white border border-white/5 rounded-2xl py-4 pl-5 pr-14 focus:ring-2 focus:ring-orange-500/50 outline-none placeholder:text-gray-500 font-medium transition-all text-sm sm:text-base"
                            placeholder="Gửi tin nhắn đến mọi người..."
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                        />
                        <button 
                            type="submit"
                            className="absolute right-2 top-2 w-12 h-12 rounded-xl bg-orange-500 text-white hover:bg-orange-600 transition-all flex items-center justify-center shadow-lg shadow-orange-500/20 active:scale-90"
                        >
                            <Send size={20} />
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

const ArrowRight = ({ size }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
        <path d="M5 12h14M12 5l7 7-7 7"/>
    </svg>
);

export default LivestreamDetail;
