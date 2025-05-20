import { io } from 'socket.io-client';

class SocketService {
  constructor() {
    this.socket = null;
    // 환경에 따라 다른 URL 사용
    this.serverUrl = process.env.NODE_ENV === 'production' 
      ? 'https://mongdangbul.store:5000'  // 배포 서버 URL
      : 'https://localhost:5000';         // 개발 서버 URL
  }

  // 소켓 연결
  connect() {
    if (!this.socket) {
      console.log(`소켓 서버 URL: ${this.serverUrl}, 환경: ${process.env.NODE_ENV}`);
      this.socket = io(this.serverUrl, {
        withCredentials: true,
        transports: ['websocket', 'polling']
      });

      console.log('소켓 서버에 연결 시도...');
      
      this.socket.on('connect', () => {
        console.log('소켓 서버에 연결되었습니다.');
      });
      
      this.socket.on('connect_error', (error) => {
        console.error('소켓 연결 오류:', error);
      });
    }
    
    return this.socket;
  }

  // 메시지 전송
  sendMessage(message) {
    if (this.socket) {
      this.socket.emit('send_message', message);
    }
  }

  // 연결 해제
  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      console.log('소켓 연결이 해제되었습니다.');
    }
  }
}

// 싱글톤 인스턴스 생성
const socketService = new SocketService();

export default socketService; 