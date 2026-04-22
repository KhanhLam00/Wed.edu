import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TeacherSidebar from '../../components/Common/TeacherSidebar';
import { showToast } from "../../../util/toast";

export default function TeacherSavedExercises() {
  const navigate = useNavigate();
  const [exercises, setExercises] = useState([]);
  const [loading, setLoading] = useState(true);

  const teacherId = localStorage.getItem('userId');

  const fetchExercises = async () => {
  if (!teacherId) {
    setExercises([]);
    setLoading(false);
    return;
  }

  try {
    setLoading(true);
    const token = localStorage.getItem('token');

    const response = await fetch(`https://wed-edu.onrender.com/api/teacher/exercises`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    const data = await response.json();

    if (response.ok && Array.isArray(data)) {
      setExercises(data);
    } else {
      setExercises([]);
    }
  } catch (error) {
    console.error('Lỗi lấy danh sách bài tập:', error);
    setExercises([]);
  } finally {
    setLoading(false);
  }
};

  useEffect(() => {
    fetchExercises();
  }, []);

  const handleDelete = async (id) => {
    if (!teacherId) return;

    const confirmed = window.confirm('Giáo viên có chắc muốn xóa bài tập này không?');
    if (!confirmed) return;

    try {
      const response = await fetch(
        `https://wed-edu.onrender.com/api/teacher/exercises/${id}?teacherId=${teacherId}`,
        { method: 'DELETE' }
      );

      const data = await response.json();

      if (response.ok) {
        showToast('Xóa bài tập thành công!');
        fetchExercises();
      } else {
        showToast(data.message || 'Không thể xóa bài tập!');
      }
    } catch (error) {
      console.error(error);
      showToast('Lỗi kết nối khi xóa bài tập!');
    }
  };

  const totalExercises = exercises.length;

  const gradeSummary = useMemo(() => {
    const grouped = {};
    exercises.forEach((item) => {
      const key = item.grade_level || '---';
      grouped[key] = (grouped[key] || 0) + 1;
    });
    return Object.entries(grouped)
      .sort((a, b) => Number(a[0]) - Number(b[0]))
      .slice(0, 3);
  }, [exercises]);

  const getDifficultyStyle = (difficulty) => {
    const value = (difficulty || '').toLowerCase();

    if (value.includes('dễ')) {
      return 'bg-green-50 text-green-600 border-green-100';
    }
    if (value.includes('trung')) {
      return 'bg-yellow-50 text-yellow-600 border-yellow-100';
    }
    if (value.includes('khó')) {
      return 'bg-red-50 text-red-500 border-red-100';
    }

    return 'bg-blue-50 text-blue-600 border-blue-100';
  };

  return (
    <div className="flex min-h-screen bg-[#EEF5FF]">
      <TeacherSidebar />

      <main className="flex-1 p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="relative overflow-hidden bg-gradient-to-r from-[#2D5AAB] to-[#4B7BE5] rounded-[32px] p-8 shadow-xl mb-8 text-white">
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full"></div>
            <div className="absolute bottom-0 left-1/3 w-28 h-28 bg-white/10 rounded-full"></div>

            <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
              <div>
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/15 text-sm font-bold mb-4">
                  📚 Teacher Exercise Library
                </div>
                <h1 className="text-4xl font-black mb-3">Bài tập giáo viên đã tạo</h1>
                <p className="text-white/90 text-lg max-w-3xl">
                  Giáo viên có thể xem, quản lý, kiểm tra chi tiết và theo dõi các bài tập đã giao cho từng lớp.
                </p>
              </div>

              <button
                onClick={() => navigate('/teacher-ai-exercise')}
                className="self-start lg:self-auto bg-white text-[#2D5AAB] px-6 py-4 rounded-2xl font-black shadow-lg hover:scale-105 transition-all"
              >
                + Tạo bài mới
              </button>
            </div>
          </div>

          {/* Summary cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
            <div className="bg-white rounded-[24px] p-6 border border-blue-100 shadow-sm">
              <p className="text-sm text-gray-500 mb-2">Tổng số bài đã tạo</p>
              <h3 className="text-3xl font-black text-blue-700">{totalExercises}</h3>
            </div>

            <div className="bg-white rounded-[24px] p-6 border border-green-100 shadow-sm">
              <p className="text-sm text-gray-500 mb-2">Khối có bài nhiều nhất</p>
              <h3 className="text-3xl font-black text-green-600">
                {gradeSummary.length > 0 ? `Lớp ${gradeSummary[0][0]}` : '---'}
              </h3>
            </div>

            <div className="bg-white rounded-[24px] p-6 border border-orange-100 shadow-sm">
              <p className="text-sm text-gray-500 mb-2">Trạng thái thư viện bài</p>
              <h3 className="text-3xl font-black text-orange-500">
                {totalExercises > 0 ? 'Sẵn sàng' : 'Chưa có bài'}
              </h3>
            </div>
          </div>

          {/* Main content */}
          <div className="bg-white rounded-[32px] border border-blue-100 shadow-sm p-6 md:p-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
              <div>
                <h2 className="text-2xl font-black text-gray-800">Danh sách bài tập</h2>
                <p className="text-gray-500 mt-1">
                  Tất cả bài tập thuộc đúng giáo viên đang đăng nhập.
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                {gradeSummary.map(([grade, count]) => (
                  <div
                    key={grade}
                    className="px-4 py-2 rounded-full bg-blue-50 text-blue-700 border border-blue-100 font-bold text-sm"
                  >
                    Lớp {grade}: {count} bài
                  </div>
                ))}
              </div>
            </div>

            {loading ? (
              <div className="py-20 text-center text-gray-500 text-lg font-medium">
                Đang tải danh sách bài tập...
              </div>
            ) : exercises.length === 0 ? (
              <div className="py-20 text-center">
                <div className="text-7xl mb-4">📝</div>
                <h3 className="text-3xl font-black text-blue-700 mb-3">
                  Giáo viên chưa tạo bài tập nào
                </h3>
                <p className="text-gray-500 text-lg max-w-2xl mx-auto leading-8">
                  Hãy bắt đầu tạo bài tập mới để giao cho học sinh theo từng lớp học nhé.
                </p>

                <button
                  onClick={() => navigate('/teacher-ai-exercise')}
                  className="mt-8 bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-2xl font-black text-lg shadow-md transition"
                >
                  + Tạo bài đầu tiên
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-5">
                {exercises.map((item, index) => (
                  <div
                    key={item.id}
                    className="group relative overflow-hidden rounded-[28px] border border-blue-100 bg-gradient-to-br from-white to-blue-50/50 p-6 shadow-sm hover:shadow-lg transition-all"
                  >
                    <div className="absolute top-0 right-0 w-28 h-28 bg-blue-100/30 rounded-full translate-x-8 -translate-y-8"></div>

                    <div className="relative z-10">
                      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-5">
                        <div className="flex-1">
                          <div className="flex flex-wrap items-center gap-3 mb-3">
                            <span className="w-10 h-10 rounded-2xl bg-blue-600 text-white flex items-center justify-center font-black shadow">
                              {index + 1}
                            </span>

                            <h3 className="text-3xl font-black text-blue-700 leading-tight">
                              {item.title}
                            </h3>
                          </div>

                          <div className="flex flex-wrap gap-3 mb-4">
                            <span className="px-4 py-2 rounded-full bg-blue-50 text-blue-700 border border-blue-100 font-bold text-sm">
                              Chủ đề: {item.topic || 'Chưa có'}
                            </span>

                            <span
                              className={`px-4 py-2 rounded-full border font-bold text-sm ${getDifficultyStyle(
                                item.difficulty
                              )}`}
                            >
                              Độ khó: {item.difficulty || 'Chưa rõ'}
                            </span>

                            <span className="px-4 py-2 rounded-full bg-purple-50 text-purple-600 border border-purple-100 font-bold text-sm">
                              Khối: Lớp {item.grade_level || '---'}
                            </span>

                            <span className="px-4 py-2 rounded-full bg-orange-50 text-orange-600 border border-orange-100 font-bold text-sm">
                              Lớp: {item.class_name || 'Chưa có lớp'}
                            </span>
                          </div>

                          <div className="text-sm text-gray-500 font-medium">
                            Mã bài tập: #{item.id}
                          </div>
                        </div>

                        <div className="flex flex-wrap lg:flex-col gap-3 lg:min-w-[170px]">
                          <button
                            onClick={() => navigate(`/teacher-exercise-detail/${item.id}`)}
                            className="bg-green-500 hover:bg-green-600 text-white px-5 py-3 rounded-2xl font-bold shadow-sm transition"
                          >
                            Xem chi tiết
                          </button>

                          <button
                            onClick={() => navigate(`/teacher-exercise-submissions/${item.id}`)}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-2xl font-bold shadow-sm transition"
                          >
                            Xem bài nộp
                          </button>

                          <button
                            onClick={() => handleDelete(item.id)}
                            className="bg-red-500 hover:bg-red-600 text-white px-5 py-3 rounded-2xl font-bold shadow-sm transition"
                          >
                            Xóa bài
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
