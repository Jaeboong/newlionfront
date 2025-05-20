import React, { useState } from 'react';
import '../App.css';

function PasswordInput({ onSuccess }) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (password === 'qwer1234') {
      setError('');
      onSuccess();
    } else {
      setError('비밀번호가 올바르지 않습니다.');
    }
  };
  
  return (
    <div className="password-container">
      <h2>비밀번호 입력</h2>
      <form onSubmit={handleSubmit}>
        <div className="input-group">
          <label htmlFor="password">비밀번호:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="비밀번호를 입력하세요"
            required
          />
        </div>
        {error && <p className="error-message">{error}</p>}
        <button type="submit" className="submit-button">입장하기</button>
      </form>
    </div>
  );
}

export default PasswordInput; 