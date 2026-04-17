import axios from 'axios'

const API_URL = '/api/v1/public/chat'

export const chatAPI = {
    sendMessage: (message, sessionId, productId, orderNumber) => {
        return axios.post(`${API_URL}/send`, {
            message,
            sessionId,
            productId,
            orderNumber
        })
    }
}
