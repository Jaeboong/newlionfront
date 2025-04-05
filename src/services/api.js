/**
 * API 서비스
 * 개발 및 배포 환경에 따라 다른 백엔드 URL을 사용합니다.
 */

// 백엔드 서버 기본 URL
// 로컬 개발 환경에서는 프록시 설정 사용
// 배포 환경에서는 실제 백엔드 서버 URL 사용
const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://1.247.204.214:5000' // 배포 환경에서 로컬 백엔드 서버 URL로 변경
  : ''; // 개발 환경에서는 프록시 설정 사용

// 기본 fetch 옵션
const DEFAULT_OPTIONS = {
  headers: {
    'Content-Type': 'application/json'
  },
  credentials: 'include' // 쿠키 포함
};

/**
 * API 요청을 보내는 함수
 * @param {string} endpoint - API 엔드포인트 경로
 * @param {Object} options - fetch 옵션
 * @returns {Promise} - fetch 응답
 */
export const fetchApi = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  const fetchOptions = {
    ...DEFAULT_OPTIONS,
    ...options,
    headers: {
      ...DEFAULT_OPTIONS.headers,
      ...options.headers
    }
  };

  // 인증 토큰이 있으면 헤더에 추가
  const token = localStorage.getItem('authToken');
  if (token) {
    fetchOptions.headers.access = token;
  }

  try {
    console.log(`API 요청: ${url}`, fetchOptions);
    const response = await fetch(url, fetchOptions);
    
    // 인증 오류 처리
    if (response.status === 401) {
      localStorage.removeItem('authToken');
      // 로그인 페이지로 리디렉션 또는 다른 처리
    }

    return response;
  } catch (error) {
    console.error('API 요청 오류:', error);
    throw error;
  }
};

// API 요청 함수들
export const api = {
  // 인증 관련 API
  auth: {
    login: (credentials) => fetchApi('/api/login', {
      method: 'POST',
      body: JSON.stringify(credentials)
    }),
    register: (userData) => fetchApi('/api/register', {
      method: 'POST',
      body: JSON.stringify(userData)
    }),
    verifyToken: () => fetchApi('/api/verify-token'),
    logout: () => fetchApi('/api/logout', { method: 'POST' })
  },
  
  // 나중에 추가할 다른 API 요청들
  // ...
};

export default api; 