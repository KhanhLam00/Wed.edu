import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { showToast } from "../../../util/toast";

export default function Register() {
  const navigate = useNavigate();
  const location = useLocation();

  const selectedRole = location.state?.selectedRole || '';

  useEffect(() => {
    if (!selectedRole) {
      navigate('/role-selection');
    }
  }, [selectedRole, navigate]);

  const [formData, setFormData] = useState({
    email: '',
    username: '',
    password: '',
    dob: '',
    teacherCode: ''
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const saveUserToLocalStorage = (user, token) => {
    const resolvedUserId =
      user?.id ||
      user?._id ||
      user?.userId ||
      user?.public_user_id ||
      '';

    const resolvedUsername =
      user?.username ||
      user?.name ||
      '';

    const resolvedRole =
      user?.role || '';

    const resolvedAvatar =
      user?.avatar ||
      user?.picture ||
      '';

    const resolvedClassName =
      user?.className ||
      user?.class_name ||
      '';

    const resolvedClassroomId =
      user?.classroomId ||
      user?.classroom_id ||
      '';

    const resolvedGradeLevel =
      user?.gradeLevel ||
      user?.grade_level ||
      '';

    // reset sạch dữ liệu lớp cũ
    localStorage.removeItem('classroomId');
    localStorage.removeItem('className');
    localStorage.removeItem('gradeLevel');
    localStorage.removeItem('needChooseRealClass');

    if (resolvedUserId) localStorage.setItem('userId', String(resolvedUserId));
    if (resolvedUsername) localStorage.setItem('username', resolvedUsername);
    if (resolvedRole) localStorage.setItem('role', resolvedRole);
    if (token) localStorage.setItem('token', token);

    if (resolvedAvatar) {
      localStorage.setItem('avatar', resolvedAvatar);
      localStorage.setItem('userAvatar', resolvedAvatar);
    } else {
      localStorage.removeItem('avatar');
      localStorage.removeItem('userAvatar');
    }

    if (resolvedClassName) {
      localStorage.setItem('className', resolvedClassName);
    }

    if (resolvedClassroomId) {
      localStorage.setItem('classroomId', String(resolvedClassroomId));
    }

    if (resolvedGradeLevel) {
      localStorage.setItem('gradeLevel', String(resolvedGradeLevel));
    }
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('http://localhost:5000/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, role: selectedRole })
      });

      const data = await response.json();

      if (response.ok) {
        saveUserToLocalStorage(data.user, data.token);
        if (data.user.role === 'teacher') {
          showToast(`Chúc mừng Thầy/Cô ${data.user.username}! Đăng ký thành công. 🎉`);
          navigate('/teacher-dashboard');
        } else {
          showToast(`Đăng ký thành công! Bé ${data.user.username} đi chọn khối học nhé 🌟`);
          navigate('/grade-selection');
        }
      } else {
        showToast(data.message || 'Đăng ký thất bại rồi!');
      }
    } catch (error) {
      console.error(error);
      showToast('Chưa bật Backend rồi! Nhớ chạy server ở cổng 5000 nhé.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F0F7FF] flex flex-col items-center justify-center p-4">

      <button
        onClick={() => navigate('/role-selection')}
        className="absolute top-6 left-6 z-20 bg-white/90 hover:bg-white text-blue-700 font-bold px-5 py-3 rounded-full shadow-md border border-blue-100 transition-all hover:-translate-y-0.5"
      >
        ← Quay lại
      </button>

      {/* nền mờ */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-200 rounded-full mix-blend-multiply blur-3xl opacity-40 pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[400px] h-[400px] bg-pink-200 rounded-full mix-blend-multiply blur-3xl opacity-30 pointer-events-none"></div>

      <div className="bg-white p-8 rounded-[40px] shadow-2xl w-full max-w-md flex flex-col items-center border border-blue-50 relative overflow-hidden">
        <div className="absolute top-[-30px] right-[-30px] w-32 h-32 bg-blue-100 rounded-full mix-blend-multiply opacity-50"></div>
        <div className="absolute bottom-[-30px] left-[-30px] w-32 h-32 bg-orange-100 rounded-full mix-blend-multiply opacity-50"></div>

        <div className="flex flex-col items-center mb-6 relative z-10">
          <div className="text-6xl mb-2 animate-bounce">
            {selectedRole === 'teacher' ? '👨‍🏫' : '🐘'}
          </div>
          <h1 className="text-2xl font-black text-blue-700 tracking-tight">
            Đăng ký {selectedRole === 'teacher' ? 'Giáo viên' : 'Học sinh'}
          </h1>
          <p className="text-gray-400 text-sm font-medium mt-1">
            Chào mừng bạn đến với thế giới toán học!
          </p>
        </div>

        <form className="w-full space-y-5 relative z-10" onSubmit={handleSignUp}>
          <input
            name="email"
            onChange={handleChange}
            type="email"
            placeholder="Email của bạn"
            className="w-full px-4 py-3 border-2 border-transparent bg-gray-50 rounded-2xl focus:outline-none focus:border-blue-400 font-medium transition-all"
            required
          />

          <input
            name="username"
            onChange={handleChange}
            type="text"
            placeholder="Tên hiển thị (Ví dụ: Bi Béo)"
            className="w-full px-4 py-3 border-2 border-transparent bg-gray-50 rounded-2xl focus:outline-none focus:border-blue-400 font-medium transition-all"
            required
          />

          <input
            name="password"
            onChange={handleChange}
            type="password"
            placeholder="Mật khẩu bí mật"
            className="w-full px-4 py-3 border-2 border-transparent bg-gray-50 rounded-2xl focus:outline-none focus:border-blue-400 font-medium transition-all"
            required
          />

          <input
            name="dob"
            onChange={handleChange}
            type="date"
            className="w-full px-4 py-3 border-2 border-transparent bg-gray-50 rounded-2xl focus:outline-none focus:border-blue-400 font-medium text-gray-500 transition-all"
          />

          {selectedRole === 'teacher' && (
            <div className="animate-slide-down">
              <label className="text-xs font-bold text-orange-500 ml-2 uppercase tracking-widest">
                Mã xác thực Giáo viên:
              </label>
              <input
                name="teacherCode"
                onChange={handleChange}
                type="password"
                placeholder="Nhập mã bí mật..."
                className="w-full px-4 py-3 border-2 border-orange-200 rounded-2xl focus:outline-none focus:border-orange-500 bg-orange-50 mt-1 font-bold"
                required
              />
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className={`w-full text-white py-4 rounded-full font-black text-lg transition-all active:scale-95 shadow-lg mt-2 ${
              loading
                ? 'bg-gray-400'
                : 'bg-blue-600 hover:bg-blue-700 hover:-translate-y-1 shadow-blue-500/30'
            }`}
          >
            {loading ? 'Đang tạo tài khoản...' : 'Đăng ký ngay 🚀'}
          </button>

          <p className="mt-4 text-sm text-gray-400 font-medium text-center">
            Đã có tài khoản?{' '}
            <span
              onClick={() => navigate('/login')}
              className="text-blue-600 font-bold cursor-pointer hover:underline underline-offset-4"
            >
              Đăng nhập ngay
            </span>
          </p>
        </form>
      </div>
    </div>
  );
}