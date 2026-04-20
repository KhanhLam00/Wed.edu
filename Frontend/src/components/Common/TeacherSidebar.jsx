import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

import AvatarModal from '../Student/AvatarModal';
import TeacherProfileModal from '../Teacher/TeacherProfileModal';

function TeacherSidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  const AVATAR_SUGGESTIONS = [
    'https://cdn-icons-png.flaticon.com/128/4140/4140048.png',
    'https://cdn-icons-png.flaticon.com/128/4140/4140047.png',
    'https://cdn-icons-png.flaticon.com/128/4140/4140038.png',
    'https://cdn-icons-png.flaticon.com/128/4140/4140043.png',
    'https://cdn-icons-png.flaticon.com/128/4140/4140051.png',
    'https://cdn-icons-png.flaticon.com/128/4140/4140052.png',
  ];

  const [currentAvatar, setCurrentAvatar] = useState(
    localStorage.getItem('userAvatar') ||
      localStorage.getItem('avatar') ||
      AVATAR_SUGGESTIONS[0]
  );

  const [showAvatarModal, setShowAvatarModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);

  const userData = {
    name: localStorage.getItem('username') || 'Giáo viên',
    id: localStorage.getItem('userId') || 'GV_000',
    className: 'Giáo viên',
  };

  useEffect(() => {
    const handleUpdate = () => {
      setCurrentAvatar(
        localStorage.getItem('userAvatar') ||
          localStorage.getItem('avatar') ||
          AVATAR_SUGGESTIONS[0]
      );
    };

    window.addEventListener('avatarChanged', handleUpdate);

    return () => {
      window.removeEventListener('avatarChanged', handleUpdate);
    };
  }, []);

  const handleSelectAvatar = (avatar) => {
    setCurrentAvatar(avatar);
    localStorage.setItem('userAvatar', avatar);
    localStorage.setItem('avatar', avatar);
    window.dispatchEvent(new Event('avatarChanged'));
    setShowAvatarModal(false);
  };

  const navItems = [
    { name: 'Dashboard', path: '/teacher-dashboard', icon: '🏠' },
    { name: 'AI tạo bài', path: '/teacher-ai-exercise', icon: '🤖' },
    { name: 'Bài đã tạo', path: '/teacher-saved-exercises', icon: '📚' },
    { name: 'Quản lý lớp', path: '/teacher-classes', icon: '📝' },
    { name: 'More options', path: '/teacher-more', icon: '⋯' },
  ];

  const isActive = (path) => location.pathname.includes(path);

  return (
    <div className="flex flex-col h-full min-h-screen bg-blue-50 w-64 border-r border-blue-100 p-4 pt-10 relative">
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
          <span className="text-blue-500 text-xs font-bold mt-0.5">Giáo viên</span>
        </div>

        <span className="text-gray-300 text-xl font-black">›</span>
      </div>

      <div className="flex flex-col gap-2 flex-grow">
        {navItems.map((item) => (
          <button
            key={item.name}
            onClick={() => navigate(item.path)}
            className={`flex items-center gap-4 px-6 py-4 rounded-full font-bold text-lg transition-all shadow-sm ${
              isActive(item.path)
                ? 'bg-white text-blue-700 shadow-md border border-gray-100'
                : 'text-gray-600 hover:bg-white hover:text-blue-600'
            }`}
          >
            <span className="text-2xl">{item.icon}</span>
            {item.name}
          </button>
        ))}
      </div>

      {showAvatarModal && (
        <AvatarModal
          avatars={AVATAR_SUGGESTIONS}
          currentAvatar={currentAvatar}
          onSelectAvatar={handleSelectAvatar}
          onClose={() => setShowAvatarModal(false)}
        />
      )}

      {showProfileModal && (
        <TeacherProfileModal
          userData={userData}
          currentAvatar={currentAvatar}
          onClose={() => setShowProfileModal(false)}
        />
      )}
    </div>
  );
}

export default TeacherSidebar;