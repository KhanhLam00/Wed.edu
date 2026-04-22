import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TeacherSidebar from '../../components/Common/TeacherSidebar';

export default function TeacherDashboard() {
  const navigate = useNavigate();
  const teacherName = localStorage.getItem('username') || 'Giáo viên';

  const [summary, setSummary] = useState({
    totalExercises: 0,
    totalSubmissions: 0,
    totalClassrooms: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const token = localStorage.getItem('token');

        const response = await fetch('https://wed-edu.onrender.com/api/teacher/dashboard-summary', {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          }
        });
        const data = await response.json();

        if (response.ok) {
          setSummary(data);
        }
      } catch (error) {
        console.error('Lỗi lấy dashboard giáo viên:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSummary();
  }, []);

  const quickActions = [
    {
      title: 'AI tạo bài tập',
      desc: 'Dùng AI để tạo bộ câu hỏi cho từng lớp học nhanh hơn.',
      icon: '🤖',
      path: '/teacher-ai-exercise',
      bg: 'from-blue-600 to-blue-500',
      light: 'bg-blue-50',
      border: 'border-blue-100',
      text: 'text-blue-700'
    },
    {
      title: 'Bài đã tạo',
      desc: 'Xem lại thư viện bài tập giáo viên đã lưu và đã giao.',
      icon: '📚',
      path: '/teacher-saved-exercises',
      bg: 'from-green-600 to-green-500',
      light: 'bg-green-50',
      border: 'border-green-100',
      text: 'text-green-700'
    },
    {
      title: 'Bài học sinh đã nộp',
      desc: 'Theo dõi kết quả nộp bài và kiểm tra tiến độ học sinh.',
      icon: '📊',
      path: '/teacher-saved-exercises',
      bg: 'from-orange-500 to-orange-400',
      light: 'bg-orange-50',
      border: 'border-orange-100',
      text: 'text-orange-600'
    },
    {
      title: 'Quản lý lớp học',
      desc: 'Xem danh sách lớp, học sinh trong lớp và bài tập đã giao.',
      icon: '🏫',
      path: '/teacher-classes',
      bg: 'from-purple-600 to-fuchsia-500',
      light: 'bg-purple-50',
      border: 'border-purple-100',
      text: 'text-purple-700'
    }
  ];

  const statCards = useMemo(() => [
    {
      label: 'Tổng số bài đã tạo',
      value: loading ? '...' : summary.totalExercises,
      icon: '📝',
      color: 'text-blue-700',
      light: 'bg-blue-50',
      border: 'border-blue-100'
    },
    {
      label: 'Tổng lượt nộp bài',
      value: loading ? '...' : summary.totalSubmissions,
      icon: '📥',
      color: 'text-green-600',
      light: 'bg-green-50',
      border: 'border-green-100'
    },
    {
      label: 'Số lớp đang có bài',
      value: loading ? '...' : summary.totalClassrooms,
      icon: '🏫',
      color: 'text-yellow-500',
      light: 'bg-yellow-50',
      border: 'border-yellow-100'
    }
  ], [loading, summary]);

  return (
    <div className="flex min-h-screen bg-[#EEF5FF]">
      <TeacherSidebar />

      <main className="flex-1 p-8">
        <div className="max-w-7xl mx-auto">
          {/* HERO */}
          <div className="relative overflow-hidden rounded-[36px] bg-gradient-to-r from-[#2D5AAB] to-[#4B7BE5] text-white p-8 md:p-10 shadow-xl mb-8">
            <div className="absolute -top-10 right-0 w-52 h-52 bg-white/10 rounded-full blur-sm"></div>
            <div className="absolute bottom-0 left-1/3 w-36 h-36 bg-white/10 rounded-full blur-sm"></div>

            <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
              <div>
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/15 font-bold text-sm mb-4">
                  👩‍🏫 Teacher Workspace
                </div>

                <h1 className="text-4xl md:text-5xl font-black mb-4">
                  Chào mừng quay lại, {teacherName}!
                </h1>

                <p className="text-white/90 text-lg leading-8 max-w-3xl">
                  Đây là khu vực quản lý bài tập, lớp học và kết quả nộp bài của học sinh.
                  Giáo viên có thể tạo bài, theo dõi tiến độ và quản lý lớp học một cách rõ ràng hơn.
                </p>
              </div>

              <div className="self-start lg:self-auto bg-white/15 backdrop-blur-sm rounded-[28px] px-6 py-5 border border-white/20 min-w-[250px]">
                <p className="text-sm uppercase tracking-widest font-bold text-white/80 mb-2">
                  Trạng thái hệ thống
                </p>
                <p className="text-2xl font-black">Sẵn sàng giảng dạy</p>
                <p className="text-white/80 mt-2">
                  Hệ thống đã kết nối và có thể tiếp tục quản lý bài học.
                </p>
              </div>
            </div>
          </div>

          {/* STATS */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            {statCards.map((item, index) => (
              <div
                key={index}
                className={`rounded-[28px] p-6 shadow-sm border ${item.border} ${item.light} relative overflow-hidden`}
              >
                <div className="absolute top-0 right-0 w-24 h-24 bg-white/40 rounded-full translate-x-6 -translate-y-6"></div>

                <div className="relative z-10 flex items-start justify-between">
                  <div>
                    <p className="text-sm text-gray-500 mb-3">{item.label}</p>
                    <h2 className={`text-5xl font-black ${item.color}`}>{item.value}</h2>
                  </div>

                  <div className="w-14 h-14 rounded-2xl bg-white shadow-sm flex items-center justify-center text-3xl">
                    {item.icon}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* QUICK ACTIONS */}
          <div className="mb-10">
            <div className="flex items-center justify-between gap-4 mb-5">
              <div>
                <h2 className="text-3xl font-black text-gray-800">Chức năng nhanh</h2>
                <p className="text-gray-500 mt-1">
                  Truy cập nhanh đến các khu vực giáo viên sử dụng nhiều nhất.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
              {quickActions.map((item, index) => (
                <div
                  key={index}
                  className={`rounded-[30px] border ${item.border} ${item.light} shadow-sm p-6 flex flex-col justify-between hover:-translate-y-1 hover:shadow-lg transition-all`}
                >
                  <div>
                    <div className="w-16 h-16 rounded-3xl bg-white shadow-sm flex items-center justify-center text-4xl mb-5">
                      {item.icon}
                    </div>

                    <h3 className={`text-2xl font-black mb-3 ${item.text}`}>
                      {item.title}
                    </h3>

                    <p className="text-gray-600 leading-7 min-h-[84px]">
                      {item.desc}
                    </p>
                  </div>

                  <button
                    onClick={() => navigate(item.path)}
                    className={`mt-6 bg-gradient-to-r ${item.bg} hover:opacity-95 text-white px-5 py-4 rounded-2xl font-black text-lg shadow-md transition`}
                  >
                    Mở chức năng
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* GUIDE + INSIGHT */}
          <div className="grid grid-cols-1 xl:grid-cols-[1.3fr_0.7fr] gap-6">
            <div className="bg-white rounded-[32px] shadow-sm p-8 border border-purple-100">
              <h2 className="text-3xl font-black text-purple-600 mb-5">
                Gợi ý sử dụng
              </h2>

              <div className="space-y-4 text-gray-700 leading-8 text-lg">
                <p>
                  1. Giáo viên vào <span className="font-black text-blue-700">AI tạo bài tập</span> để tạo bộ câu hỏi mới.
                </p>
                <p>
                  2. Sau khi lưu bài, giáo viên vào <span className="font-black text-green-600">Bài đã tạo</span> để xem lại nội dung.
                </p>
                <p>
                  3. Khi học sinh nộp bài, giáo viên có thể vào <span className="font-black text-orange-500">Bài đã tạo</span> rồi bấm <span className="font-black">Xem bài nộp</span> để kiểm tra kết quả.
                </p>
                <p>
                  4. Giáo viên vào <span className="font-black text-purple-600">Quản lý lớp học</span> để xem lớp và danh sách học sinh đang tham gia.
                </p>
              </div>
            </div>

            <div className="bg-white rounded-[32px] shadow-sm p-8 border border-blue-100">
              <h2 className="text-3xl font-black text-blue-700 mb-5">
                Tổng quan nhanh
              </h2>

              <div className="space-y-4">
                <div className="bg-blue-50 rounded-2xl p-5 border border-blue-100">
                  <p className="text-sm text-gray-500 mb-2">Mức độ hoạt động</p>
                  <h3 className="text-2xl font-black text-blue-700">
                    {summary.totalExercises > 0 ? 'Đang hoạt động tốt' : 'Chưa có dữ liệu'}
                  </h3>
                </div>

                <div className="bg-green-50 rounded-2xl p-5 border border-green-100">
                  <p className="text-sm text-gray-500 mb-2">Theo dõi bài nộp</p>
                  <h3 className="text-2xl font-black text-green-600">
                    {loading ? '...' : `${summary.totalSubmissions} lượt nộp`}
                  </h3>
                </div>

                <div className="bg-orange-50 rounded-2xl p-5 border border-orange-100">
                  <p className="text-sm text-gray-500 mb-2">Lớp đang có bài</p>
                  <h3 className="text-2xl font-black text-orange-500">
                    {loading ? '...' : `${summary.totalClassrooms} lớp`}
                  </h3>
                </div>
              </div>

              <button
                onClick={() => navigate('/teacher-classes')}
                className="w-full mt-6 bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-2xl font-black text-lg shadow-md transition"
              >
                Vào quản lý lớp ngay
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
