import React, { useState, useEffect, useRef } from 'react';
import socketService from '../services/socketService';
import '../styles/Chat.css';

function Chat() {
  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState('');
  const [username, setUsername] = useState('');
  const [users, setUsers] = useState([]);
  const messagesEndRef = useRef(null);

  // 소켓 초기화 및 이벤트 리스너 설정
  useEffect(() => {
    const socket = socketService.connect();
    
    // 자신의 사용자 정보 수신
    socket.on('user_info', (userData) => {
      setUsername(userData.username);
    });
    
    // 메시지 수신
    socket.on('message', (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });
    
    // 사용자 목록 업데이트
    socket.on('users_update', (userList) => {
      setUsers(userList);
    });
    
    // 컴포넌트 언마운트 시 소켓 연결 해제
    return () => {
      socketService.disconnect();
    };
  }, []);

  // 메시지 목록이 업데이트될 때 스크롤 아래로 이동
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // 메시지 전송 핸들러
  const handleSendMessage = (e) => {
    e.preventDefault();
    
    if (messageInput.trim() === '') return;
    
    socketService.sendMessage(messageInput);
    setMessageInput('');
  };

  // 메시지 시간 포맷팅
  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
  };

  return (
    <div className="chat-container">
      <div className="chat-header">
        <h2>실시간 채팅</h2>
        <div className="user-info">
          <span>나의 이름: {username}</span>
        </div>
      </div>
      
      <div className="chat-body">
        <div className="messages-container">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`message ${msg.type === 'system' ? 'system-message' : 
                               (msg.username === username ? 'my-message' : 'other-message')}`}
            >
              {msg.type !== 'system' && (
                <div className="message-sender">{msg.username}</div>
              )}
              <div className="message-content">
                <p>{msg.text}</p>
                <span className="message-time">{formatTime(msg.timestamp)}</span>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
        
        <div className="users-sidebar">
          <h3>접속자 목록 ({users.length}명)</h3>
          <ul className="users-list">
            {users.map((user) => (
              <li key={user.id} className={user.username === username ? 'current-user' : ''}>
                {user.username} {user.username === username && '(나)'}
              </li>
            ))}
          </ul>
        </div>
      </div>
      
      <div className="chat-footer">
        <form onSubmit={handleSendMessage}>
          <input
            type="text"
            value={messageInput}
            onChange={(e) => setMessageInput(e.target.value)}
            placeholder="메시지를 입력하세요..."
            required
          />
          <button type="submit">전송</button>
        </form>
      </div>
    </div>
  );
}

export default Chat; 