import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GoogleOAuthProvider, useGoogleLogin } from '@react-oauth/google';
import { showToast } from "../../../util/toast";

// THAY MÃ CLIENT ID CỦA BẠN NẾU CẦN
const GOOGLE_CLIENT_ID = "886239754084-97953c2s5htecs39cjakkd3o3brs46l6.apps.googleusercontent.com";

function LoginForm() {
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [googleUser, setGoogleUser] = useState(null);

  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const [extraInfo, setExtraInfo] = useState({
    role: 'student',
    userId: '',
    className: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleExtraInfoChange = (e) => {
    setExtraInfo({ ...extraInfo, [e.target.name]: e.target.value });
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

    // 🔥 FIX: tự động suy ra gradeLevel từ className
    // Ví dụ:
    // "1A" -> "1"
    // "Lớp 3A" -> "3"
    // "Lớp 5" -> "5"
    let autoGradeLevel = '';
    if (resolvedClassName) {
      const match = String(resolvedClassName).match(/\d+/);
      if (match) {
        autoGradeLevel = match[0];
      }
    }

    // 🔥 reset dữ liệu cũ trước
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

    // Ưu tiên gradeLevel trả từ backend, nếu không có thì tự suy ra từ className
    if (resolvedGradeLevel) {
      localStorage.setItem('gradeLevel', String(resolvedGradeLevel));
    } else if (autoGradeLevel) {
      localStorage.setItem('gradeLevel', String(autoGradeLevel));
    }
  };

  const navigateByRole = (role) => {
    if (role === 'teacher') {
      navigate('/teacher-dashboard');
    } else {
      navigate('/student-dashboard');
    }
  };

  // ==========================================
  // ĐĂNG NHẬP GOOGLE
  // ==========================================
  const loginWithGoogle = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        const res = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
          headers: {
            Authorization: `Bearer ${tokenResponse.access_token}`,
          },
        });

        const userInfo = await res.json();

        setGoogleUser(userInfo);
        setStep(2);
      } catch (error) {
        console.error('Lỗi lấy thông tin Google:', error);
        showToast('Không lấy được thông tin Google!');
      }
    },
    onError: () => {
      showToast('Đăng nhập Google bị hủy!');
    }
  });

  // ==========================================
  // HOÀN TẤT HỒ SƠ GOOGLE
  // ==========================================
  const handleCompleteGoogleProfile = async (e) => {
    e.preventDefault();

    const finalUserData = {
      name: googleUser?.name,
      email: googleUser?.email,
      avatar: googleUser?.picture,
      role: extraInfo.role,
      userId: extraInfo.userId,
      className: extraInfo.className
    };

    try {
      const response = await fetch('http://localhost:5000/api/google-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(finalUserData),
      });

      const data = await response.json();

      if (response.ok) {
        const mergedUser = {
          ...data.user,
          avatar: data.user?.avatar || googleUser?.picture
        };

        saveUserToLocalStorage(mergedUser, data.token);

        showToast(`Hồ sơ đã được lưu vào hệ thống! Chào mừng ${mergedUser.username || mergedUser.name || 'bạn'} 🎉`);
        navigateByRole(mergedUser.role);
      } else {
        showToast('Lỗi từ hệ thống: ' + (data.message || 'Không thể đăng nhập bằng Google'));
      }
    } catch (error) {
      console.error(error);
     showToast('Lỗi kết nối Server! Hãy kiểm tra backend cổng 5000 nhé.');
    }
  };

  // ==========================================
  // ĐĂNG NHẬP THƯỜNG
  // ==========================================
  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:5000/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        saveUserToLocalStorage(data.user, data.token);

        showToast(`Chào mừng ${data.user?.username || data.user?.name || 'bạn'} quay trở lại! 👋`);
        navigateByRole(data.user?.role);
      } else {
        showToast(data.message || 'Đăng nhập thất bại!');
      }
    } catch (error) {
      console.error(error);
      showToast('Lỗi kết nối Server rồi!');
    }
  };

  return (
    <div className="min-h-screen bg-[#F0F7FF] flex items-center justify-center p-4 relative overflow-hidden">

      <button
        onClick={() => navigate('/')}
        className="absolute top-6 left-6 z-20 bg-white/90 hover:bg-white text-blue-700 font-bold px-5 py-3 rounded-full shadow-md border border-blue-100 transition-all hover:-translate-y-0.5"
      >
        ← Quay lại
      </button>

      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-200 rounded-full mix-blend-multiply blur-3xl opacity-40 pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[400px] h-[400px] bg-pink-200 rounded-full mix-blend-multiply blur-3xl opacity-30 pointer-events-none"></div>

      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-40"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-orange-200 rounded-full mix-blend-multiply filter blur-3xl opacity-40"></div>

      <div className="bg-white rounded-[40px] shadow-2xl p-10 w-full max-w-md border-b-8 border-blue-600 relative z-10 animate-fade-in">
        {step === 1 && (
          <>
            <h1 className="text-4xl font-black text-center text-blue-700 mb-2">Xin chào! 👋</h1>
            <p className="text-center text-gray-500 font-medium mb-8">Đăng nhập để tiếp tục học nhé</p>

            <button
              onClick={() => loginWithGoogle()}
              type="button"
              className="w-full flex items-center justify-center gap-4 bg-white border-2 border-gray-200 text-gray-700 font-bold text-lg px-6 py-4 rounded-full hover:bg-gray-50 hover:border-blue-300 transition-all shadow-sm active:scale-95 group"
            >
              <svg
                className="group-hover:scale-110 transition-transform"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Đăng nhập bằng Google
            </button>

            <div className="flex items-center gap-4 my-8">
              <div className="flex-1 h-px bg-gray-200"></div>
              <span className="text-gray-400 font-bold text-xs uppercase tracking-widest">Hoặc</span>
              <div className="flex-1 h-px bg-gray-200"></div>
            </div>

            <form onSubmit={handleLogin} className="flex flex-col gap-5">
              <input
                name="email"
                type="email"
                placeholder="Email của bạn"
                className="w-full px-6 py-4 rounded-2xl bg-gray-50 border-2 border-transparent focus:border-blue-400 focus:bg-white transition-all outline-none font-medium text-lg placeholder:text-gray-400"
                value={formData.email}
                onChange={handleChange}
                required
              />

              <input
                name="password"
                type="password"
                placeholder="Mật khẩu"
                className="w-full px-6 py-4 rounded-2xl bg-gray-50 border-2 border-transparent focus:border-blue-400 focus:bg-white transition-all outline-none font-medium text-lg placeholder:text-gray-400"
                value={formData.password}
                onChange={handleChange}
                required
              />

              <button
                type="submit"
                className="w-full bg-blue-600 text-white font-black text-xl py-4 rounded-full mt-4 hover:bg-blue-700 shadow-lg shadow-blue-500/30 hover:shadow-xl hover:-translate-y-1 transition-all active:scale-95"
              >
                Vào học ngay 🚀
              </button>
            </form>

            <p className="text-center mt-8 text-gray-500 font-medium">
              Chưa có tài khoản?{' '}
              <span
                onClick={() => navigate('/register')}
                className="text-blue-600 font-bold cursor-pointer hover:underline"
              >
                Đăng ký tại đây
              </span>
            </p>
          </>
        )}

        {step === 2 && googleUser && (
          <form onSubmit={handleCompleteGoogleProfile} className="flex flex-col items-center animate-fade-in">
            <div className="w-20 h-20 rounded-full overflow-hidden border-4 border-blue-200 mb-4 shadow-md">
              <img src={googleUser.picture} alt="Avatar" className="w-full h-full object-cover" />
            </div>

            <h1 className="text-2xl font-black text-center text-blue-700 mb-2">
              Sắp xong rồi, {googleUser.name}!
            </h1>

            <p className="text-center text-gray-500 font-medium mb-8 text-sm">
              Cho chúng mình biết thêm một chút về bạn nhé.
            </p>

            <div className="w-full flex flex-col gap-5">
              <div className="flex gap-4">
                <label className={`flex-1 py-3 px-4 rounded-xl border-2 cursor-pointer font-bold text-center transition-all ${
                  extraInfo.role === 'student'
                    ? 'bg-blue-50 border-blue-500 text-blue-700'
                    : 'bg-gray-50 border-transparent text-gray-500 hover:bg-gray-100'
                }`}>
                  <input
                    type="radio"
                    name="role"
                    value="student"
                    checked={extraInfo.role === 'student'}
                    onChange={handleExtraInfoChange}
                    className="hidden"
                  />
                  Học sinh 🎒
                </label>

                <label className={`flex-1 py-3 px-4 rounded-xl border-2 cursor-pointer font-bold text-center transition-all ${
                  extraInfo.role === 'teacher'
                    ? 'bg-orange-50 border-orange-500 text-orange-700'
                    : 'bg-gray-50 border-transparent text-gray-500 hover:bg-gray-100'
                }`}>
                  <input
                    type="radio"
                    name="role"
                    value="teacher"
                    checked={extraInfo.role === 'teacher'}
                    onChange={handleExtraInfoChange}
                    className="hidden"
                  />
                  Giáo viên 👩‍🏫
                </label>
              </div>

              <input
                name="userId"
                type="text"
                placeholder={extraInfo.role === 'student' ? 'Mã ID Học Sinh (VD: STD_001)' : 'Mã Giáo Viên (VD: TCH_001)'}
                className="w-full px-6 py-4 rounded-2xl bg-gray-50 border-2 border-transparent focus:border-blue-400 focus:bg-white transition-all outline-none font-medium text-lg placeholder:text-gray-400"
                value={extraInfo.userId}
                onChange={handleExtraInfoChange}
                required
              />

              {extraInfo.role === 'student' && (
                <input
                  name="className"
                  type="text"
                  placeholder="Lớp của bé (VD: 1A)"
                  className="w-full px-6 py-4 rounded-2xl bg-gray-50 border-2 border-transparent focus:border-blue-400 focus:bg-white transition-all outline-none font-medium text-lg placeholder:text-gray-400"
                  value={extraInfo.className}
                  onChange={handleExtraInfoChange}
                  required
                />
              )}

              <button
                type="submit"
                className="w-full bg-blue-600 text-white font-black text-xl py-4 rounded-full mt-4 hover:bg-blue-700 shadow-lg shadow-blue-500/30 hover:shadow-xl hover:-translate-y-1 transition-all active:scale-95"
              >
                Hoàn tất & Vào ngay! ✨
              </button>

              <button
                type="button"
                onClick={() => setStep(1)}
                className="text-gray-400 font-bold mt-2 hover:text-gray-600"
              >
                Quay lại
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

export default function Login() {
  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <LoginForm />
    </GoogleOAuthProvider>
  );
}