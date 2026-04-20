//Leaderboard là component hiển thị bảng xếp hạng học sinh dựa trên dữ liệu rankings được truyền vào. 
// Nó sử dụng phương thức map để render động danh sách và áp dụng conditional styling để làm nổi bật top 3 học sinh.

export default function Leaderboard({ rankings }) {
  return (
    <div className="bg-white rounded-[30px] p-8 shadow-sm border border-blue-100 w-full max-w-3xl mx-auto mt-8 relative z-10">
      <div className="flex items-center justify-center gap-3 mb-8">
        <span className="text-4xl">🏆</span>
        <h2 className="text-3xl font-black text-blue-700 uppercase tracking-wide text-center">
          Bảng Xếp Hạng Lớp
        </h2>
        <span className="text-4xl">🏆</span>
      </div>
        
      <div className="flex flex-col gap-4">
        {rankings.map((student, index) => {
          let rankStyle = "bg-gray-50 border-gray-100 text-gray-500";
          let medal = `#${index + 1}`;
          
          if (index === 0) { rankStyle = "bg-yellow-50 border-yellow-300 shadow-[0_4px_0_#FDE047]"; medal = "🥇"; }
          else if (index === 1) { rankStyle = "bg-gray-100 border-gray-300 shadow-[0_4px_0_#D1D5DB]"; medal = "🥈"; }
          else if (index === 2) { rankStyle = "bg-orange-50 border-orange-300 shadow-[0_4px_0_#FDBA74]"; medal = "🥉"; }

          return (
            <div key={student.id} className={`flex items-center p-4 rounded-2xl border-2 transition-transform hover:-translate-y-1 ${rankStyle}`}>
              <div className="w-16 flex justify-center text-4xl font-black">{medal}</div>
              <div className="w-16 h-16 bg-white rounded-full border-2 border-white shadow-sm flex items-center justify-center mx-4">
                <img src={student.avatar} alt={student.name} className="w-12 h-12 object-contain" />
              </div>
              <h3 className={`text-2xl font-bold flex-1 ${index < 3 ? 'text-gray-800' : 'text-gray-600'}`}>
                {student.name}
              </h3>
              <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-xl shadow-inner border border-gray-100">
                <span className="text-2xl font-black text-orange-500">{student.stars}</span>
                <span className="text-2xl">🌟</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}