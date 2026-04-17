import { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import { fetchLivestreamDetail, updateViewerCount } from '../store/slices/livestreamSlice';
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
        dispatch(fetchLivestreamDetail(id));
        
        // Polling for real-time product updates from Admin
        const interval = setInterval(() => {
            dispatch(fetchLivestreamDetail(id));
        }, 10000); 

        return () => clearInterval(interval);
    }, [id, dispatch]);

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [chatMessages]);

    const handleSendMessage = (e) => {
        e.preventDefault();
        if (!message.trim()) return;

        const newMessage = {
            id: Date.now(),
            user: user?.username || 'Khách',
            text: message,
        };
        setChatMessages([...chatMessages, newMessage]);
        setMessage('');
    };

    if (loading || !currentStream) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
            </div>
        );
    }

    return (
        <div className="bg-gray-900 min-h-screen lg:h-[calc(100vh-64px)] overflow-hidden flex flex-col lg:flex-row">
            {/* Video Section */}
            <div className="flex-1 relative bg-black group">
                <div className="absolute inset-0 flex items-center justify-center">
                    {/* Mock Video Stream */}
                    <img 
                        src={currentStream.thumbnailUrl || 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=1000&auto=format&fit=crop'} 
                        className="w-full h-full object-cover opacity-50 blur-sm"
                        alt="Background blur"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40"></div>
                    
                    {/* Main Video Content (Simulated) */}
                    <div className="relative z-10 w-full h-full flex items-center justify-center">
                        <div className="text-center text-white p-8">
                            <div className="bg-red-500 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
                                <Maximize2 size={40} />
                            </div>
                            <h2 className="text-2xl font-bold">Luồng Livestream Đang Tải...</h2>
                            <p className="text-gray-400 mt-2">Kết nối đến server RTMP: {currentStream.streamUrl}</p>
                        </div>
                    </div>
                </div>

                {/* Video Info Overlay */}
                <div className="absolute top-6 left-6 flex items-center gap-4 z-20">
                    <div className="flex items-center gap-3 bg-black/40 backdrop-blur-md p-2 pl-2 pr-4 rounded-full border border-white/10">
                        <img 
                            src={currentStream.streamerAvatar || 'https://ui-avatars.com/api/?name=' + currentStream.streamerUsername} 
                            alt={currentStream.streamerUsername}
                            className="w-10 h-10 rounded-full border-2 border-primary-500"
                        />
                        <div>
                            <p className="text-white font-bold text-sm leading-tight">{currentStream.streamerUsername}</p>
                            <p className="text-gray-300 text-xs flex items-center gap-1">
                                <Users size={12} />
                                {currentStream.viewerCount || 0} đang xem
                            </p>
                        </div>
                    </div>
                    <span className="bg-red-500 text-white px-3 py-1.5 rounded-full text-xs font-bold animate-pulse uppercase tracking-wider">
                        TRỰC TIẾP
                    </span>
                </div>

                <div className="absolute top-6 right-6 flex items-center gap-2 z-20">
                    <button className="p-3 bg-black/40 backdrop-blur-md rounded-full text-white hover:bg-black/60 transition-colors">
                        <Share2 size={20} />
                    </button>
                    <button onClick={() => navigate('/livestream')} className="p-3 bg-black/40 backdrop-blur-md rounded-full text-white hover:bg-black/60 transition-colors">
                        <X size={20} />
                    </button>
                </div>

                {/* Featured Product Overlay */}
                {currentStream.productId && (
                    <div className="absolute bottom-24 left-6 z-20 max-w-sm animate-slide-in-up">
                        <div 
                            onClick={() => navigate(`/products/${currentStream.productSlug}`)}
                            className="bg-white/95 backdrop-blur-md p-4 rounded-2xl shadow-2xl flex items-center gap-4 border border-white/20 cursor-pointer hover:bg-white transition-all transform hover:-translate-y-1 group"
                        >
                            <div className="w-16 h-16 rounded-xl overflow-hidden shadow-inner flex-shrink-0 bg-gray-50 border border-gray-100">
                                <img src={currentStream.productImage} alt={currentStream.productName} className="w-full h-full object-contain" />
                            </div>
                            <div className="flex-1">
                                <p className="text-[10px] font-black text-primary-600 uppercase mb-0.5 tracking-wider">🔥 ĐANG GIỚI THIỆU</p>
                                <h3 className="text-sm font-black text-gray-900 line-clamp-1 group-hover:text-primary-600 transition-colors uppercase tracking-tight">{currentStream.productName}</h3>
                                <div className="flex items-center justify-between mt-1">
                                    <p className="text-xs font-bold text-gray-500">Xem ngay chi tiết</p>
                                    <div className="bg-primary-600 text-white p-2 rounded-xl group-hover:bg-primary-500 transition-colors shadow-lg shadow-primary-500/30">
                                        <ShoppingBag size={16} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Interactions */}
                <div className="absolute bottom-8 right-6 flex flex-col gap-4 z-20">
                    <button className="w-12 h-12 bg-pink-500 rounded-full flex items-center justify-center text-white shadow-lg hover:scale-110 active:scale-95 transition-all">
                        <Heart size={24} fill="currentColor" />
                    </button>
                    <button className="w-12 h-12 bg-primary-600 rounded-full flex items-center justify-center text-white shadow-lg hover:scale-110 active:scale-95 transition-all">
                        <ShoppingBag size={24} />
                    </button>
                </div>
            </div>

            {/* Chat Section */}
            <div className="w-full lg:w-96 bg-gray-800 flex flex-col border-l border-white/5 shadow-2xl z-30">
                <div className="p-4 border-b border-white/5 flex items-center justify-between">
                    <h3 className="text-white font-bold flex items-center gap-2">
                        <MessageCircle size={20} className="text-primary-400" />
                        Trò chuyện trực tiếp
                    </h3>
                    <div className="text-gray-400 text-xs">
                        {currentStream.viewerCount || 0} người tham gia
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
                    {chatMessages.map((msg) => (
                        <div key={msg.id} className="flex gap-3">
                            <div className="w-8 h-8 rounded-full bg-gray-600 flex-shrink-0 flex items-center justify-center text-white text-xs font-bold">
                                {msg.user[0]}
                            </div>
                            <div>
                                <p className={`text-xs font-bold mb-0.5 ${msg.isAdmin ? 'text-yellow-400' : 'text-gray-400'}`}>
                                    {msg.user}
                                </p>
                                <div className={`p-2 rounded-2xl rounded-tl-none text-sm ${msg.isAdmin ? 'bg-yellow-400/10 text-yellow-50' : 'bg-gray-700 text-white'}`}>
                                    {msg.text}
                                </div>
                            </div>
                        </div>
                    ))}
                    <div ref={chatEndRef} />
                </div>

                <form onSubmit={handleSendMessage} className="p-4 bg-gray-900">
                    <div className="relative">
                        <input 
                            type="text" 
                            className="w-full bg-gray-700 text-white border-0 rounded-xl py-3 pl-4 pr-12 focus:ring-2 focus:ring-primary-500 outline-none placeholder:text-gray-500"
                            placeholder="Gửi tin nhắn..."
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                        />
                        <button 
                            type="submit"
                            className="absolute right-2 top-2 p-2 text-primary-400 hover:text-primary-300 transition-colors"
                        >
                            <Send size={20} />
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default LivestreamDetail;
