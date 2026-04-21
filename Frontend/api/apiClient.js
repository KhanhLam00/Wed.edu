// Tự động lấy link Render nếu có, nếu không thì dùng localhost (khi Lâm dev ở máy)
const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://wed-edu.onrender.com/api';

export async function apiFetch(endpoint, options = {}) {
  const token = localStorage.getItem('token');
  
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers || {}),
  };

  // endpoint truyền vào nên có dấu / ở đầu (ví dụ: /auth/login)
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || 'Có lỗi xảy ra từ server');
  }

  return data;
}
