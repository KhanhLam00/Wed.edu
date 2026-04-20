import React from 'react';

export default function TeacherProfileModal({ userData, currentAvatar, onClose }) {
  return (
    <div className="fixed inset-0 z-[999] bg-black/40 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-[32px] shadow-2xl border border-blue-100 overflow-hidden">
        <div className="bg-gradient-to-r from-[#2D5AAB] to-[#4B7BE5] px-6 py-5 text-white">
          <h2 className="text-2xl font-black">Thông tin giáo viên</h2>
          <p className="text-white/90 mt-1">Hồ sơ tài khoản đang đăng nhập</p>
        </div>

        <div className="p-8">
          <div className="flex flex-col items-center text-center">
            <div className="w-28 h-28 rounded-full overflow-hidden border-4 border-green-400 shadow-md bg-white mb-4">
              <img
                src={currentAvatar}
                alt="Teacher Avatar"
                className="w-full h-full object-cover"
              />
            </div>

            <h3 className="text-2xl font-black text-gray-800">{userData.name}</h3>
            <p className="text-gray-400 font-bold mt-1">Mã: {userData.id}</p>
            <p className="text-blue-600 font-bold mt-2">Vai trò: Giáo viên</p>
          </div>

          <div className="mt-8 space-y-4">
            <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100">
              <p className="text-sm text-gray-400 font-bold uppercase tracking-wider mb-1">
                Họ và tên
              </p>
              <p className="text-lg font-bold text-gray-800">{userData.name}</p>
            </div>

            <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100">
              <p className="text-sm text-gray-400 font-bold uppercase tracking-wider mb-1">
                Mã tài khoản
              </p>
              <p className="text-lg font-bold text-gray-800">{userData.id}</p>
            </div>

            <div className="bg-blue-50 rounded-2xl p-4 border border-blue-100">
              <p className="text-sm text-blue-500 font-bold uppercase tracking-wider mb-1">
                Chức năng
              </p>
              <p className="text-base font-medium text-gray-700 leading-7">
                Giáo viên có thể tạo bài tập, quản lý lớp học, xem danh sách học sinh và theo dõi kết quả nộp bài.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-full mt-8 bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-2xl font-black text-lg shadow-md transition"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
}