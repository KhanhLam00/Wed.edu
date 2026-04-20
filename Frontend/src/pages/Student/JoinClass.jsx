import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import StudentSidebar from '../../components/Common/StudentSidebar';
import { showToast } from "../../../util/toast";

export default function JoinClass() {
  const navigate = useNavigate();
  const [classCode, setClassCode] = useState('');
  const [loading, setLoading] = useState(false);

  const handleJoinClass = async () => {
    const userId = localStorage.getItem('userId');

    if (!userId) {
      showToast('Không tìm thấy tài khoản. Bé đăng nhập lại nhé!');
      return;
    }

    if (!classCode.trim()) {
      showToast('Bé hãy nhập mã lớp trước nhé!');
      return;
    }

    try {
      setLoading(true);

      const response = await fetch('http://localhost:5000/api/student/join-class', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          classCode: classCode.trim().toUpperCase()
        })
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('classroomId', String(data.classroom.id));
        localStorage.setItem('className', data.classroom.class_name);
        localStorage.setItem('gradeLevel', String(data.classroom.grade_level));

        showToast(`Bé đã vào ${data.classroom.class_name} thành công rồi nè! 🎉`);
        navigate('/class');
      } else {
        showToast(data.message || 'Không thể vào lớp!');
      }
    } catch (error) {
      console.error(error);
      showToast('Lỗi kết nối server khi vào lớp!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-[#F0F7FF]">
      <StudentSidebar />

      <main className="flex-1 flex items-center justify-center p-8">
        <div className="bg-white w-full max-w-2xl rounded-[36px] shadow-xl border border-blue-100 p-10">
          <div className="text-center mb-8">
            <div className="text-7xl mb-4">🏫</div>
            <h1 className="text-4xl font-black text-blue-700 mb-3">Nhập mã lớp</h1>
            <p className="text-gray-500 text-lg leading-8">
              Bé hãy nhập mã lớp mà giáo viên gửi cho bé để vào lớp học nhé.
            </p>
          </div>

          <div className="bg-blue-50 border border-blue-100 rounded-3xl p-5 mb-6">
            <p className="text-gray-700 leading-7">
              Ví dụ mã lớp như: <span className="font-bold text-blue-700">ABC123</span>
            </p>
          </div>

          <input
            type="text"
            value={classCode}
            onChange={(e) => setClassCode(e.target.value.toUpperCase())}
            placeholder="Nhập mã lớp ở đây..."
            className="w-full border-2 border-blue-200 focus:border-blue-500 outline-none rounded-3xl px-6 py-5 text-2xl font-black text-center tracking-[6px] text-blue-700 mb-6"
            maxLength={6}
          />

          <div className="flex gap-4">
            <button
              onClick={() => navigate('/student-dashboard')}
              className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-4 rounded-2xl font-bold text-lg transition"
            >
              Quay lại
            </button>

            <button
              onClick={handleJoinClass}
              disabled={loading}
              className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white py-4 rounded-2xl font-black text-lg transition"
            >
              {loading ? 'Đang vào lớp...' : 'Vào lớp ngay'}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}