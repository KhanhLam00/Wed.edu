//AuthChoice là trang trung gian cho phép người dùng chọn giữa đăng nhập và đăng ký.
//Component sử dụng useNavigate của React Router để điều hướng sang các route tương ứng mà không reload trang.

import { useNavigate } from 'react-router-dom';

export default function AuthChoice() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#F0F7FF] p-4">
      <h1 className="text-3xl font-bold mb-10 text-[#2D5AAB] text-center">Chào mừng bé! Bé muốn làm gì nào?</h1>
      <div className="flex flex-col md:flex-row gap-8 w-full max-w-2xl">
        
        {/* Lựa chọn Đăng nhập */}
        <div 
          onClick={() => navigate('/login')} 
          className="flex-1 bg-white p-10 rounded-3xl shadow-xl cursor-pointer hover:scale-105 transition-all border-b-8 border-blue-400 text-center"
        >
          <div className="text-7xl mb-4">🔑</div>
          <h2 className="text-2xl font-bold text-gray-700">Đăng nhập</h2>
          <p className="text-gray-500 mt-2">Dành cho bé đã có tài khoản</p>
        </div>

        {/* ✅ CHỖ ĐÃ SỬA: Lựa chọn Đăng ký trả về đúng /register */}
        <div 
          onClick={() => navigate('/role-selection')}
     
          className="flex-1 bg-white p-10 rounded-3xl shadow-xl cursor-pointer hover:scale-105 transition-all border-b-8 border-orange-400 text-center"
        >
          <div className="text-7xl mb-4">📝</div>
          <h2 className="text-2xl font-bold text-gray-700">Đăng ký</h2>
          <p className="text-gray-500 mt-2">Dành cho bé mới học lần đầu</p>
        </div>
        
      </div>
      
      <button 
        onClick={() => navigate('/')}
        className="mt-10 text-gray-500 hover:text-[#2D5AAB] font-medium"
      >
        ← Quay lại trang chủ
      </button>
    </div>
  );
}