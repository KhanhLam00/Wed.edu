//AvatarModal là component con dùng để hiển thị danh sách avatar dưới dạng modal. Nó nhận dữ liệu và callback từ component cha thông qua props và sử dụng map để render động danh sách ảnh.

export default function AvatarModal({ avatars, currentAvatar, onSelectAvatar, onClose }) {
  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 backdrop-blur-sm animate-fade-in" onClick={onClose}>
      <div className="bg-white rounded-[40px] p-8 w-full max-w-xl relative shadow-2xl border-8 border-blue-100 animate-scale-up" onClick={e => e.stopPropagation()}>
        
        <button 
          onClick={onClose}
          className="absolute -top-5 -right-5 bg-red-500 text-white w-14 h-14 rounded-full font-black text-2xl border-4 border-white hover:scale-110 transition-transform shadow-lg"
        >
          X
        </button>

        <h2 className="text-3xl font-black text-blue-600 text-center mb-8">Bé thích người bạn nào? 🐾</h2>
        
        <div className="grid grid-cols-3 gap-6">
          {avatars.map((avatar, idx) => (
            <div 
              key={idx} 
              onClick={() => onSelectAvatar(avatar)}
              className={`cursor-pointer rounded-3xl p-4 flex justify-center items-center transition-all duration-200 border-4 ${currentAvatar === avatar ? 'border-orange-500 bg-orange-50 scale-110 shadow-lg' : 'border-gray-100 hover:border-blue-300 hover:bg-blue-50'}`}
            >
              <img src={avatar} alt="Avatar option" className="w-24 h-24 object-contain" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}