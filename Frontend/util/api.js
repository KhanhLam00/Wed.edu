export const apiFetch = async (url, options = {}) => {
  const token = localStorage.getItem('token');

  const res = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
      ...(options.headers || {})
    }
  });

  if (res.status === 401) {
    localStorage.clear();
    window.location.href = '/auth-choice';
  }

  return res.json();
};