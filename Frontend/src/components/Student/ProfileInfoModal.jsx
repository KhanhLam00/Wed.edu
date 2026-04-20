export default function ProfileInfoModal({ userData, currentAvatar, onClose }) {
  // Giao diện cửa sổ thông tin tài khoản chi tiết
  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[60] backdrop-blur-sm animate-fade-in" onClick={onClose}>
      <div className="bg-white rounded-[40px] p-8 w-full max-w-lg relative shadow-2xl border-8 border-purple-100 animate-scale-up flex flex-col items-center" onClick={e => e.stopPropagation()}>
        
        {/* Nút đóng X màu đỏ */}
        <button 
          onClick={onClose}
          className="absolute -top-5 -right-5 bg-red-500 text-white w-14 h-14 rounded-full font-black text-2xl border-4 border-white hover:scale-110 transition-transform shadow-lg"
        >
          X
        </button>

        <h2 className="text-3xl font-black text-purple-600 text-center mb-10 flex items-center gap-3">
          <span>Hồ Sơ Của Bé</span> ⭐️
        </h2>

        {/* Khung Avatar tròn to chính giữa */}
        <div className="w-40 h-40 bg-green-100 rounded-full border-4 border-green-300 shadow-lg flex items-center justify-center overflow-hidden mb-8">
           <img src={currentAvatar} alt="Avatar bé" className="w-32 h-32 object-contain" />
        </div>
        
        {/* Khung chứa các dòng thông tin */}
        <div className="w-full space-y-5">
           <div className="bg-purple-50 p-4 rounded-xl border border-purple-100 flex items-center justify-between">
              <span className="text-purple-700 font-bold uppercase text-sm">Tên của bé</span>
              <span className="text-gray-800 font-black text-xl">{userData.name}</span>
           </div>
           
           <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 flex items-center justify-between">
              <span className="text-blue-700 font-bold uppercase text-sm">Mã ID Học Sinh</span>
              <span className="text-gray-800 font-black text-lg">{userData.id}</span>
           </div>

           {/* ✅ CHỖ ĐÃ SỬA: Không còn "1A" nữa, lấy trực tiếp từ dữ liệu máy */}
           <div className="bg-orange-50 p-4 rounded-xl border border-orange-100 flex items-center justify-between">
              <span className="text-orange-700 font-bold uppercase text-sm">Lớp của bé</span>
              <span className="text-gray-800 font-black text-lg">
                {userData.className ? userData.className : "Chưa chọn lớp"}
              </span>
           </div>
        </div>

        {/* Nút bấm để chỉnh sửa thông tin (Placeholder - chưa cần tương tác) */}
        <button className="mt-10 bg-purple-500 text-white px-8 py-3 rounded-xl font-bold hover:bg-purple-600 transition shadow-md hover:scale-105">
           ✏️ Chỉnh sửa thông tin
        </button>

      </div>
    </div>
  );
}