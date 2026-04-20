import { useState, useEffect, useRef } from 'react'
import { MessageSquare, X, Send, Bot, User, Minimize2, Maximize2, Sparkles, ShoppingBag, Truck } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useSelector } from 'react-redux'
import { chatAPI } from '../../api/chat'

const ChatWidget = () => {
    const [isOpen, setIsOpen] = useState(false)
    const [isMinimized, setIsMinimized] = useState(false)
    const [message, setMessage] = useState('')
    const [isTyping, setIsTyping] = useState(false)
    const [sessionId] = useState(`session_${Math.random().toString(36).substring(7)}`)
    const [messages, setMessages] = useState([
        { id: 1, text: 'Xin chào! Mình là trợ lý AI của Tech Store. Mình có thể giúp gì cho bạn hôm nay?', sender: 'bot', timestamp: new Date() }
    ])
    const { user } = useSelector((state) => state.auth)
    const chatEndRef = useRef(null)

    const scrollToBottom = () => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }

    useEffect(() => {
        scrollToBottom()
    }, [messages, isOpen, isTyping])

    const handleSend = async (e, customMessage = null) => {
        if (e) e.preventDefault()
        const textToSend = customMessage || message
        if (!textToSend.trim()) return

        const userMsg = { id: Date.now(), text: textToSend, sender: 'user', timestamp: new Date() }
        setMessages(prev => [...prev, userMsg])
        setMessage('')
        setIsTyping(true)

        try {
            const response = await chatAPI.sendMessage(textToSend, sessionId)
            const botReply = response.data.result
            
            setMessages(prev => [...prev, {
                id: Date.now() + 1,
                text: botReply.reply,
                sender: 'bot',
                timestamp: new Date(),
                requiresHuman: botReply.requiresHuman
            }])
        } catch (error) {
            setMessages(prev => [...prev, {
                id: Date.now() + 1,
                text: 'Xin lỗi, mình gặp chút trục trặc khi kết nối. Bạn thử lại sau nhé!',
                sender: 'bot',
                timestamp: new Date()
            }])
        } finally {
            setIsTyping(false)
        }
    }

    const quickActions = [
        { icon: <ShoppingBag className="w-3 h-3" />, text: 'Tư vấn sản phẩm', action: 'Mua iphone 15' },
        { icon: <Truck className="w-3 h-3" />, text: 'Kiểm tra đơn hàng', action: 'Kiểm tra đơn hàng của mình' },
        { icon: <Sparkles className="w-3 h-3" />, text: 'Ưu đãi hôm nay', action: 'Ưu đãi hôm nay có gì?' },
    ]

    return (
        <div className="fixed bottom-4 sm:bottom-6 right-4 sm:right-6 z-[9999]">
            <AnimatePresence>
                {!isOpen && (
                    <motion.button
                        initial={{ scale: 0, rotate: -45 }}
                        animate={{ scale: 1, rotate: 0 }}
                        exit={{ scale: 0, rotate: 45 }}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => setIsOpen(true)}
                        className="bg-gradient-to-tr from-primary-600 to-orange-500 text-white p-4 rounded-full shadow-2xl shadow-primary-500/40 border-4 border-white dark:border-dark-bg relative"
                    >
                        <MessageSquare className="w-7 h-7" />
                        <span className="absolute -top-1 -right-1 flex h-4 w-4">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-4 w-4 bg-orange-500 border-2 border-white dark:border-dark-bg"></span>
                        </span>
                    </motion.button>
                )}
            </AnimatePresence>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 100, scale: 0.8, transformOrigin: 'bottom right' }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 100, scale: 0.8 }}
                        className={`bg-white dark:bg-dark-card rounded-[2rem] sm:rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.2)] border border-gray-100 dark:border-white/5 flex flex-col transition-all duration-300 ${isMinimized ? 'h-16 w-[calc(100vw-2rem)] sm:w-64' : 'h-[70vh] max-h-[600px] w-[calc(100vw-1rem)] sm:w-[380px]'}` }
                    >
                        {/* Header */}
                        <div className="p-4 sm:p-5 flex items-center justify-between bg-gradient-to-r from-gray-900 to-gray-800 rounded-t-[2rem] sm:rounded-t-[2.5rem] text-white">
                            <div className="flex items-center gap-3">
                                <div className="h-10 w-10 rounded-2xl bg-primary-600 flex items-center justify-center shadow-lg shadow-primary-500/20">
                                    <Bot className="w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className="font-black text-sm uppercase tracking-wider">TechStore AI</h3>
                                    <div className="flex items-center gap-1.5">
                                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                                        <span className="text-[10px] font-bold text-gray-400">Đang trực tuyến</span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center gap-1">
                                <button onClick={() => setIsMinimized(!isMinimized)} className="p-2 hover:bg-white/10 rounded-xl transition-colors">
                                    {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
                                </button>
                                <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-red-500/20 rounded-xl transition-colors group">
                                    <X className="w-4 h-4 group-hover:text-red-500" />
                                </button>
                            </div>
                        </div>

                        {!isMinimized && (
                            <>
                                {/* Messages Area */}
                                <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 custom-scrollbar bg-gray-50/50 dark:bg-transparent">
                                    {messages.map((msg) => (
                                        <motion.div
                                            key={msg.id}
                                            initial={{ opacity: 0, x: msg.sender === 'bot' ? -20 : 20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            className={`flex ${msg.sender === 'bot' ? 'justify-start' : 'justify-end'}`}
                                        >
                                            <div className={`max-w-[80%] p-4 rounded-3xl text-sm font-bold leading-relaxed shadow-sm ${
                                                msg.sender === 'bot' 
                                                ? 'bg-white dark:bg-white/5 text-gray-700 dark:text-gray-200 rounded-tl-none border border-gray-100 dark:border-white/5' 
                                                : 'bg-primary-600 text-white rounded-tr-none shadow-primary-500/20'
                                            }`}>
                                                {msg.sender === 'bot' && <div className="flex items-center gap-1.5 mb-1 text-[10px] uppercase text-primary-500 font-black tracking-widest">
                                                    <Sparkles className="w-3 h-3" /> Assistant
                                                </div>}
                                                {msg.text}
                                            </div>
                                        </motion.div>
                                    ))}
                                    
                                    {isTyping && (
                                        <div className="flex justify-start">
                                            <div className="bg-white dark:bg-white/5 p-4 rounded-3xl rounded-tl-none border border-gray-100 dark:border-white/5 flex gap-1">
                                                <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"></span>
                                                <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                                                <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:0.4s]"></span>
                                            </div>
                                        </div>
                                    )}
                                    <div ref={chatEndRef} />
                                </div>

                                {/* Quick Actions */}
                                <div className="px-4 sm:px-6 py-2 flex gap-2 overflow-x-auto no-scrollbar">
                                    {quickActions.map((action, i) => (
                                        <button 
                                            key={i} 
                                            onClick={() => handleSend(null, action.action)}
                                            className="whitespace-nowrap flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 dark:bg-white/5 hover:bg-primary-50 dark:hover:bg-primary-500/10 text-[10px] font-black uppercase tracking-widest text-gray-500 hover:text-primary-600 rounded-full border border-transparent hover:border-primary-100 transition-all"
                                        >
                                            {action.icon}
                                            {action.text}
                                        </button>
                                    ))}
                                </div>

                                {/* Input Area */}
                                <div className="p-4 sm:p-6 border-t border-gray-100 dark:border-white/5 bg-white dark:bg-dark-card rounded-b-[2rem] sm:rounded-b-[2.5rem]">
                                    <form onSubmit={handleSend} className="relative">
                                        <input
                                            type="text"
                                            value={message}
                                            onChange={(e) => setMessage(e.target.value)}
                                            disabled={isTyping}
                                            placeholder={isTyping ? "AI đang suy nghĩ..." : "Bạn cần tư vấn sản phẩm gì?"}
                                            className="w-full h-12 pl-4 pr-12 bg-gray-50 dark:bg-white/5 border border-transparent focus:border-primary-500/30 dark:focus:border-primary-500/30 rounded-2xl text-sm outline-none transition-all placeholder:text-gray-400 font-bold disabled:opacity-50"
                                        />
                                        <button 
                                            type="submit"
                                            disabled={isTyping}
                                            className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 bg-primary-600 text-white rounded-xl flex items-center justify-center hover:bg-primary-700 transition-all shadow-lg shadow-primary-500/20 disabled:opacity-50"
                                        >
                                            <Send className="w-4 h-4" />
                                        </button>
                                    </form>
                                </div>
                            </>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}

export default ChatWidget
