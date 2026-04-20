import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { showToast } from "../../../util/toast";

export default function GradeSelect() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [selectedGrade, setSelectedGrade] = useState(null);

  const gradeStyles = {
    1: {
      label: 'Khối 1',
      color: 'border-red-300 text-red-500 bg-red-50',
      button: 'bg-red-500 hover:bg-red-600',
      icon: '🍎',
    },
    2: {
      label: 'Khối 2',
      color: 'border-yellow-300 text-yellow-600 bg-yellow-50',
      button: 'bg-yellow-500 hover:bg-yellow-600',
      icon: '🐥',
    },
    3: {
      label: 'Khối 3',
      color: 'border-green-300 text-green-600 bg-green-50',
      button: 'bg-green-500 hover:bg-green-600',
      icon: '🍀',
    },
    4: {
      label: 'Khối 4',
      color: 'border-blue-300 text-blue-600 bg-blue-50',
      button: 'bg-blue-500 hover:bg-blue-600',
      icon: '🐳',
    },
    5: {
      label: 'Khối 5',
      color: 'border-purple-300 text-purple-600 bg-purple-50',
      button: 'bg-purple-500 hover:bg-purple-600',
      icon: '🦄',
    },
  };

  const handleContinue = async () => {
    const userId = localStorage.getItem('userId');

    if (!userId) {
      showToast('Không tìm thấy tài khoản. Bé đăng nhập lại nhé!');
      return;
    }

    if (!selectedGrade) {
      showToast('Bé hãy chọn khối học trước nhé!');
      return;
    }

    try {
      setLoading(true);

      const response = await fetch('http://localhost:5000/api/update-grade', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          className: null,
          gradeLevel: selectedGrade
        }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('gradeLevel', String(selectedGrade));
        localStorage.removeItem('classroomId');
        localStorage.removeItem('className');
        localStorage.setItem('needChooseRealClass', 'true');

        showToast(`Bé đã chọn ${gradeStyles[selectedGrade].label} rồi nè! Bây giờ mình nhập mã lớp nhé 🎉`);
        navigate('/join-class');
      } else {
       showToast('Không thể lưu khối học: ' + (data.message || 'Có lỗi xảy ra'));
      }
    } catch (error) {
      console.error(error);
     showToast('Lỗi kết nối server khi lưu khối học!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F0F7FF] flex items-center justify-center p-6 font-sans">
      <div className="bg-white p-8 md:p-12 rounded-[50px] shadow-2xl flex flex-col xl:flex-row items-start gap-10 border-b-[12px] border-blue-100 max-w-6xl w-full animate-fade-in">
        <div className="w-full xl:w-1/3 text-center xl:text-left space-y-6">
          <div className="text-[110px] animate-bounce filter drop-shadow-lg text-center">🎓</div>

          <div className="space-y-3">
            <h2 className="text-4xl font-black text-[#2D5AAB] tracking-tight">
              Chọn khối học
            </h2>
            <p className="text-lg font-medium text-gray-500 leading-8">
              Bé hãy chọn <span className="font-bold text-blue-600">khối lớp</span> trước,
              sau đó nhập <span className="font-bold text-blue-600">mã lớp</span> mà giáo viên gửi cho bé nhé!
            </p>
          </div>

          <div className="bg-blue-50 rounded-3xl p-5 border border-blue-100">
            <p className="text-sm text-gray-600 leading-7">
              Ví dụ: Bé học khối 3 thì chọn <span className="font-bold text-blue-700">Khối 3</span>,
              rồi nhập mã lớp như <span className="font-bold text-blue-700">ABC123</span>.
            </p>
          </div>
        </div>

        <div className="w-full xl:w-2/3">
          <div className="mb-6">
            <h3 className="text-3xl font-black text-slate-800">Khối học của bé</h3>
            <p className="text-gray-500 mt-2">
              Bước 1: Chọn khối lớp → Bước 2: Sang trang nhập mã lớp
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
            {[1, 2, 3, 4, 5].map((grade) => {
              const style = gradeStyles[grade];
              const isActive = selectedGrade === grade;

              return (
                <button
                  key={grade}
                  type="button"
                  onClick={() => setSelectedGrade(grade)}
                  className={`rounded-3xl border-4 px-4 py-5 font-black text-xl shadow-md transition-all hover:scale-105 active:scale-95
                  ${style.color}
                  ${isActive ? 'ring-4 ring-offset-2 ring-blue-200 scale-105' : ''}`}
                >
                  <div className="text-3xl mb-2">{style.icon}</div>
                  <div>{style.label}</div>
                </button>
              );
            })}
          </div>

          <div className="bg-slate-50 rounded-[35px] p-8 border border-slate-200 min-h-[260px] flex flex-col justify-center">
            {!selectedGrade ? (
              <div className="text-center text-gray-400">
                <div className="text-6xl mb-4">🏫</div>
                <p className="text-2xl font-bold">Bé hãy chọn khối lớp trước nhé</p>
                <p className="mt-3 text-base">
                  Sau khi chọn xong, hệ thống sẽ đưa bé sang trang nhập mã lớp.
                </p>
              </div>
            ) : (
              <div className="text-center">
                <div className="text-6xl mb-4">{gradeStyles[selectedGrade].icon}</div>
                <h4 className="text-3xl font-black text-slate-800 mb-3">
                  Bé đã chọn {gradeStyles[selectedGrade].label}
                </h4>
                <p className="text-gray-600 text-lg leading-8 max-w-2xl mx-auto">
                  Bước tiếp theo là nhập mã lớp mà giáo viên gửi cho bé để vào đúng lớp học thật.
                </p>

                <div className="mt-8 flex flex-wrap justify-center gap-4">
                  <button
                    type="button"
                    onClick={() => navigate('/student-dashboard')}
                    className="bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 px-8 py-4 rounded-2xl font-bold text-lg transition"
                  >
                    Quay lại
                  </button>

                  <button
                    type="button"
                    disabled={loading}
                    onClick={handleContinue}
                    className={`text-white px-8 py-4 rounded-2xl font-black text-lg shadow-md transition disabled:opacity-50 ${gradeStyles[selectedGrade].button}`}
                  >
                    {loading ? 'Đang lưu...' : 'Tiếp tục nhập mã lớp'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}