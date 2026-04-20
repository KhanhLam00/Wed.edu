import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

// ✅ Import mảnh ghép Modal
import AvatarModal from '../Student/AvatarModal'; 
import ProfileInfoModal from '../Student/ProfileInfoModal';

function StudentSidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  const AVATAR_SUGGESTIONS = [
    "https://cdn-icons-png.flaticon.com/128/4140/4140048.png",
    "https://cdn-icons-png.flaticon.com/128/4140/4140047.png",
    "https://cdn-icons-png.flaticon.com/128/4140/4140038.png",
    "https://cdn-icons-png.flaticon.com/128/4140/4140043.png",
    "https://cdn-icons-png.flaticon.com/128/4140/4140051.png",
    "https://cdn-icons-png.flaticon.com/128/4140/4140052.png",
  ];

  // ==========================================
  // 1. QUẢN LÝ TRẠNG THÁI (STATE)
  // ==========================================
  const [currentAvatar, setCurrentAvatar] = useState(
    localStorage.getItem('userAvatar') || AVATAR_SUGGESTIONS[0]
  );//Avatar hiện tại
  const [currentClass, setCurrentClass] = useState(
    localStorage.getItem('className') || '' 
  );//Lớp hiện tại
  const [showAvatarModal, setShowAvatarModal] = useState(false);//Có mở modal avatar không
  const [showProfileModal, setShowProfileModal] = useState(false);//Có mở modal profile không

  // ==========================================
  // 2. TỔNG HỢP DỮ LIỆU NGƯỜI DÙNG
  // ==========================================
  
  const userData = {
    name: localStorage.getItem('username') || 'Người dùng',
    id: localStorage.getItem('userId') || 'ID_000',
    className: currentClass // ✅ Tự động lấy từ State để cập nhật ngay lập tức
  };

  // 🪄 BÍ KÍP ĐỒNG BỘ: Nghe tín hiệu đổi Avatar VÀ đổi Lớp
  useEffect(() => {
    const handleUpdate = () => {
      setCurrentAvatar(localStorage.getItem('userAvatar') || AVATAR_SUGGESTIONS[0]);
      setCurrentClass(localStorage.getItem('className') || ''); 
    };

    window.addEventListener('avatarChanged', handleUpdate);//kỹ thuật đồng bộ component.
    window.addEventListener('classChanged', handleUpdate); // Nghe Milu đổi lớp

    return () => {
      window.removeEventListener('avatarChanged', handleUpdate);
      window.removeEventListener('classChanged', handleUpdate);
    };
  }, []);

  //HÀM CHỌN AVATAR
  const handleSelectAvatar = (avatar) => {
    setCurrentAvatar(avatar);
    localStorage.setItem('userAvatar', avatar);
    window.dispatchEvent(new Event('avatarChanged'));
    setShowAvatarModal(false);
  };

  const navItems = [
    { name: 'Study', path: '/student-dashboard', icon: '🏠' },
    { name: 'AI-Powered', path: '/ai-powered', icon: '🧠' },
    { name: 'Class', path: '/class', icon: '📅' },
    { name: 'Bài tập giao', path: '/assigned-exercises', icon: '📝' },
    { name: 'More options', path: '/more', icon: '⋯' },
  ];

  return (
    <div className="flex flex-col h-full min-h-screen bg-blue-50 w-64 border-r border-blue-100 p-4 pt-10 relative">
      
      {/* THANH THÔNG TIN TÀI KHOẢN */}
      <div 
        onClick={() => setShowProfileModal(true)} 
        className="bg-white rounded-2xl p-3 flex items-center gap-3 shadow-sm border border-gray-100 mb-8 mt-4 cursor-pointer hover:shadow-lg transition-all"
      >
        <div 
          onClick={(e) => {
            e.stopPropagation(); 
            setShowAvatarModal(true);
          }}
          className="relative w-14 h-14 bg-green-400 rounded-xl flex items-center justify-center shadow-inner overflow-hidden p-1 cursor-pointer group hover:scale-110 transition-transform"
        >
          <img src={currentAvatar} alt="Avatar" className="w-full h-full object-contain" />
          <div className="absolute inset-0 bg-green-600/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-xl">
              <span className="text-white text-[10px] font-black uppercase tracking-wider">Đổi</span>
          </div>
        </div>
        
        <div className="flex flex-col flex-1 truncate">
          <span className="text-gray-800 font-bold text-sm truncate">{userData.name}</span>
          <span className="text-gray-400 text-[10px] font-medium uppercase tracking-wider mt-0.5 truncate">
            Mã: {userData.id}
          </span>
          <span className="text-blue-500 text-xs font-bold mt-0.5">
            {userData.className ? `Lớp: ${userData.className}` : "Chưa chọn lớp"}
          </span>
        </div>
        <span className="text-gray-300 text-xl font-black">›</span>
      </div>

      {/* MENU ĐIỀU HƯỚNG */}
      <div className="flex flex-col gap-2 flex-grow">
        {/* lặp qua từng item để tạo button. */}
        {navItems.map((item) => (
          <button
            key={item.name}
            onClick={() => navigate(item.path)} //React Router chuyển trang
            className={`flex items-center gap-4 px-6 py-4 rounded-full font-bold text-lg transition-all shadow-sm
              ${location.pathname.includes(item.path) //đổi màu button.
                ? 'bg-white text-blue-700 shadow-md border border-gray-100' 
                : 'text-gray-600 hover:bg-white hover:text-blue-600'}`} 
          > 
            <span className="text-2xl">{item.icon}</span>
            {item.name}
          </button>
        ))}
      </div>

      {/* MODAL Nếu showAvatarModal = true
      → Render component AvatarModal
      Nếu false → Không hiển thị*/}
      {showAvatarModal && (
        <AvatarModal 
          avatars={AVATAR_SUGGESTIONS} 
          currentAvatar={currentAvatar} 
          onSelectAvatar={handleSelectAvatar} 
          onClose={() => setShowAvatarModal(false)} 
        />
      )}

      {showProfileModal && (
        <ProfileInfoModal 
          userData={userData} 
          currentAvatar={currentAvatar} 
          onClose={() => setShowProfileModal(false)} 
        />
      )}
    </div>
  );
}

export default StudentSidebar;