import { useState, useEffect } from 'react';
import ErrorBoundary from './ErrorBoundary';
import api from '../services/api';

function Home({ user, onLogout }) {
  const [isLoading, setIsLoading] = useState(false);
  
  useEffect(() => {
    console.log("Home 컴포넌트 마운트, 유저 정보:", user);
  }, [user]);

  const handleLogout = async () => {
    setIsLoading(true);
    
    try {
      await api.auth.logout();
      console.log("로그아웃 요청 성공");
      onLogout();
    } catch (error) {
      console.error('로그아웃 중 오류 발생:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) {
    console.log("사용자 정보가 없음");
    return <div>로그인이 필요합니다.</div>;
  }

  return (
    <div className="home-container">
      <h2>환영합니다, {user.nickname}님!</h2>
      <div className="user-info">
        <h3>사용자 정보</h3>
        <p><strong>아이디:</strong> {user.id}</p>
        <p><strong>닉네임:</strong> {user.nickname}</p>
        {user.createdAt && (
          <p><strong>가입일:</strong> {new Date(user.createdAt).toLocaleDateString()}</p>
        )}
      </div>
      <button 
        onClick={handleLogout} 
        className="logout-btn"
        disabled={isLoading}
      >
        {isLoading ? '처리 중...' : '로그아웃'}
      </button>
    </div>
  );
}

export default Home; 