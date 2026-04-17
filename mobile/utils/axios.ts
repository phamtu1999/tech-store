import axios from 'axios';
import { Platform } from 'react-native';

// NOTE: Vì bạn dùng port 8081 cho backend, bạn phải chắc chắn truyền địa chỉ ip local (VD: 192.168.1.15) vào đây nếu dùng trên điện thoại thật.
// Nếu dùng máy ảo Android (Emulator), IP sẽ là 10.0.2.2.
// Nếu chạy trên iOS Simulator, IP sẽ là localhost hoặc 127.0.0.1.

const getBaseUrl = () => {
    // IPv4 LAN của máy tính: 192.168.0.105
    const MY_COMPUTER_IP = '192.168.0.105'; 
    const BACKEND_PORT = '8081';

    if (Platform.OS === 'android') {
        // Dùng 10.0.2.2 cho Emulator, dùng IP máy tính cho máy thật
        // return `http://10.0.2.2:${BACKEND_PORT}/api/v1`; 
        return `http://${MY_COMPUTER_IP}:${BACKEND_PORT}/api/v1`;
    }
    
    if (Platform.OS === 'ios') {
        // Dùng localhost cho Simulator, dùng IP máy tính cho máy thật
        // return `http://localhost:${BACKEND_PORT}/api/v1`;
        return `http://${MY_COMPUTER_IP}:${BACKEND_PORT}/api/v1`;
    }

    return `http://localhost:${BACKEND_PORT}/api/v1`;
};

const instance = axios.create({
    baseURL: getBaseUrl(),
    headers: {
        'Content-Type': 'application/json',
    },
});

export default instance;
