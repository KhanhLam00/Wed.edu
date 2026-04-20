import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function RoleSelection() {
  const navigate = useNavigate();
  const [role, setRole] = useState('student');

  const handleContinue = () => {
    navigate('/register', { state: { selectedRole: role } });
  };

  return (
    <div className="min-h-screen bg-[#F0F7FF] flex items-center justify-center p-4 relative overflow-hidden font-sans">

      <button
        onClick={() => navigate('/')}
        className="absolute top-6 left-6 z-20 bg-white/90 hover:bg-white text-blue-700 font-bold px-5 py-3 rounded-full shadow-md border border-blue-100 transition-all hover:-translate-y-0.5"
      >
        ← Quay lại
      </button>

      {/* nền mờ */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-200 rounded-full mix-blend-multiply blur-3xl opacity-40 pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[400px] h-[400px] bg-pink-200 rounded-full mix-blend-multiply blur-3xl opacity-30 pointer-events-none"></div>

      <div className="bg-white rounded-[40px] shadow-2xl p-8 md:p-10 w-full max-w-md border-b-8 border-blue-600 relative z-10">

        {/* avatar/icon */}
        <div className="flex justify-center mb-6">
          <div className="w-24 h-24 rounded-full border-4 border-blue-100 p-1 shadow-md overflow-hidden bg-white flex items-center justify-center text-5xl">
            🌟
          </div>
        </div>

        <h1 className="text-2xl font-black text-center text-blue-700 mb-2">
          Bạn là ai?
        </h1>

        <p className="text-center text-gray-500 font-medium mb-8 text-sm">
          Chọn vai trò để tiếp tục đăng ký nhé
        </p>

        <div className="flex gap-4 mb-8">
          <div
            onClick={() => setRole('student')}
            className={`flex-1 py-4 px-4 rounded-2xl border-2 cursor-pointer font-bold text-center transition-all flex flex-col items-center gap-2 ${
              role === 'student'
                ? 'bg-blue-50 border-blue-500 text-blue-700 shadow-md scale-[1.02]'
                : 'bg-gray-50 border-transparent text-gray-400'
            }`}
          >
            <span className="text-3xl">🎒</span>
            <span>Học sinh</span>
          </div>

          <div
            onClick={() => setRole('teacher')}
            className={`flex-1 py-4 px-4 rounded-2xl border-2 cursor-pointer font-bold text-center transition-all flex flex-col items-center gap-2 ${
              role === 'teacher'
                ? 'bg-orange-50 border-orange-500 text-orange-700 shadow-md scale-[1.02]'
                : 'bg-gray-50 border-transparent text-gray-400'
            }`}
          >
            <span className="text-3xl">👩‍🏫</span>
            <span>Giáo viên</span>
          </div>
        </div>

        <button
          onClick={handleContinue}
          className="w-full text-white font-black text-xl py-4 rounded-full shadow-lg transition-all active:scale-95 bg-blue-600 hover:bg-blue-700 shadow-blue-500/30 hover:shadow-xl hover:-translate-y-1"
        >
          Tiếp tục 🚀
        </button>
      </div>
    </div>
  );
}