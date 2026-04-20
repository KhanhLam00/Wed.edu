import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LessonItem from "../../components/Shared/LessonItem";
import StudentSidebar from "../../components/Common/StudentSidebar";
import Leaderboard from '../../components/Student/Leaderboard';

export default function StudentDashboard() {
  const navigate = useNavigate();

  const [lessons, setLessons] = useState([]);
  const [completedLessons, setCompletedLessons] = useState([]);
  const [rankings, setRankings] = useState([]);
  const [totalStars, setTotalStars] = useState(0);
  const [loadingLessons, setLoadingLessons] = useState(true);

  const DEFAULT_AVATAR = "https://cdn-icons-png.flaticon.com/128/4140/4140048.png";
  const [currentAvatar, setCurrentAvatar] = useState(localStorage.getItem('userAvatar') || DEFAULT_AVATAR);

  const username = localStorage.getItem('username') || 'Bé yêu';
  const className = localStorage.getItem('className') || 'Chưa vào lớp';
  const gradeLevel = localStorage.getItem('gradeLevel') || '';
  const classroomId = localStorage.getItem('classroomId');

  useEffect(() => {
    const handleSyncAvatar = () => {
      setCurrentAvatar(localStorage.getItem('userAvatar') || DEFAULT_AVATAR);
    };

    window.addEventListener('avatarChanged', handleSyncAvatar);
    return () => window.removeEventListener('avatarChanged', handleSyncAvatar);
  }, []);

  useEffect(() => {
    const userId = localStorage.getItem('userId');
    const currentGradeLevel = localStorage.getItem('gradeLevel');

    setLoadingLessons(true);

    const token = localStorage.getItem('token');
      fetch(`http://localhost:5000/api/lessons?gradeLevel=${currentGradeLevel}`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        }
      })

      .then(res => res.json())
      .then(data => setLessons(Array.isArray(data) ? data : []))
      .catch(err => {
        console.error("Lỗi lấy bài học:", err);
        setLessons([]);
      })
      .finally(() => setLoadingLessons(false));

    fetch('http://localhost:5000/api/leaderboard')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setRankings(data);
        } else {
          setRankings([]);
        }
      })
      .catch(err => {
        console.error("Lỗi lấy bảng xếp hạng:", err);
        setRankings([]);
      });

    if (userId) {
      fetch(`http://localhost:5000/api/results/student/${userId}`, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          }
        })
        .then(res => res.json())
        .then(data => {
          const finished = Array.isArray(data)
            ? data
                .filter(r => r.status === 'Hoàn thành')
                .map(r => String(r.lessonId))
            : [];

          setCompletedLessons(finished);

          const stars = Array.isArray(data)
            ? data.reduce((sum, current) => sum + (current.score || 0), 0)
            : 0;

          setTotalStars(stars);
        })
        .catch(err => console.error("Lỗi lấy tiến độ:", err));
    }
  }, []);

  const pathOffsets = [
    '',
    'translate-x-[-60px]',
    'translate-x-[55px]',
    'translate-x-[-70px]',
    'translate-x-[65px]',
    'translate-x-[-45px]',
    'translate-x-[50px]',
    'translate-x-[-30px]',
  ];

  const displayLessons = useMemo(() => {
    const maxSlots = 8;

    const realLessons = lessons.slice(0, 8).map((item, index) => {
      const lessonNum = String(item.lessonNum);
      const isDone = completedLessons.includes(lessonNum);

      let isLocked = false;
      if (index > 0) {
        const previousLessonNum = String(lessons[index - 1]?.lessonNum || '');
        isLocked = !completedLessons.includes(previousLessonNum);
      }

      return {
        label: item.lessonNum,
        isCompleted: isDone,
        isLocked,
        isVirtual: false,
      };
    });

    const virtualLessons = [];
    const startNumber =
      realLessons.length > 0 ? Number(realLessons[realLessons.length - 1].label) + 1 : 1;

    for (let i = realLessons.length; i < maxSlots; i++) {
      virtualLessons.push({
        label: startNumber + (i - realLessons.length),
        isCompleted: false,
        isLocked: true,
        isVirtual: true,
      });
    }

    return [...realLessons, ...virtualLessons];
  }, [lessons, completedLessons]);

  const completedCount = completedLessons.length;

  const renderNoLessonsState = () => (
    <div className="w-full">
      <div className="bg-gradient-to-br from-blue-50 to-white border border-blue-100 rounded-[32px] p-8 text-center shadow-sm">
        <div className="text-7xl mb-4">📚</div>
        <h3 className="text-3xl font-black text-blue-700 mb-4">
          Khối {gradeLevel || 'này'} đang được cập nhật bài học
        </h3>
        <p className="text-gray-600 text-lg leading-8 max-w-2xl mx-auto">
          Hiện tại hệ thống chưa có bài học cố định cho khối này.
          Bé vẫn có thể vào lớp học, làm bài tập được giao, hoặc học cùng AI trước nhé!
        </p>

        <div className="mt-8 grid md:grid-cols-3 gap-4">
          <button
            onClick={() => navigate('/assigned-exercises')}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-4 rounded-2xl font-bold text-lg shadow-md transition"
          >
            📘 Bài tập được giao
          </button>

          <button
            onClick={() => navigate('/ai-powered')}
            className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-4 rounded-2xl font-bold text-lg shadow-md transition"
          >
            🤖 Học cùng AI
          </button>

          <button
            onClick={() => navigate('/class')}
            className="bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 px-6 py-4 rounded-2xl font-bold text-lg transition"
          >
            🏫 Xem lớp học
          </button>
        </div>

        <div className="mt-8 bg-yellow-50 border border-yellow-100 rounded-3xl p-5 text-left">
          <p className="text-yellow-800 font-bold mb-2">Gợi ý cho bé:</p>
          <ul className="text-gray-700 leading-7">
            <li>• Bé có thể dùng AI để hỏi bài toán khó.</li>
            <li>• Bé có thể xem bài tập giáo viên giao trong lớp.</li>
            <li>• Khi hệ thống cập nhật, bài học của khối này sẽ hiện tại đây.</li>
          </ul>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-[#F0F7FF]">
      <StudentSidebar />

      <main className="flex-1 p-8 h-screen overflow-y-auto relative">
        {/* HEADER */}
        <div className="bg-white rounded-[30px] p-6 shadow-sm border border-blue-100 flex flex-col xl:flex-row xl:items-center xl:justify-between gap-6 mb-8 relative overflow-hidden">
          <div className="absolute right-0 top-0 w-64 h-64 bg-blue-50 rounded-full -mr-20 -mt-20 opacity-50 pointer-events-none"></div>

          <div className="flex items-center gap-6 z-10">
            <div className="w-24 h-24 bg-blue-100 rounded-full border-4 border-white shadow-md flex items-center justify-center overflow-hidden">
              <img src={currentAvatar} alt="Avatar" className="w-20 h-20 object-contain" />
            </div>

            <div>
              <h1 className="text-3xl font-black text-blue-800">
                Chào bé, {username}! 👋
              </h1>
              <p className="text-gray-500 font-medium mt-1">
                Hôm nay bé muốn học gì nào?
              </p>
              <div className="mt-3 flex flex-wrap gap-3">
                <span className="bg-blue-50 text-blue-700 px-4 py-2 rounded-full text-sm font-bold border border-blue-100">
                  🎓 Khối {gradeLevel || '---'}
                </span>
                <span className="bg-orange-50 text-orange-600 px-4 py-2 rounded-full text-sm font-bold border border-orange-100">
                  🏫 {className}
                </span>
                <span className="bg-green-50 text-green-600 px-4 py-2 rounded-full text-sm font-bold border border-green-100">
                  {classroomId ? '✅ Đã vào lớp' : '⚠️ Chưa vào lớp'}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4 bg-orange-50 px-6 py-4 rounded-2xl border border-orange-200 z-10 shadow-inner self-start xl:self-auto">
            <span className="text-4xl">🌟</span>
            <div className="flex flex-col">
              <span className="text-sm font-bold text-orange-600 uppercase tracking-wider">
                Điểm sao
              </span>
              <span className="text-3xl font-black text-orange-500 leading-none">
                {totalStars}
              </span>
            </div>
          </div>
        </div>

        {/* MINI STATS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
          <div className="bg-white rounded-[24px] p-5 border border-blue-100 shadow-sm">
            <p className="text-sm text-gray-500 mb-2">Khối học hiện tại</p>
            <h3 className="text-2xl font-black text-blue-700">Lớp {gradeLevel || '---'}</h3>
          </div>

          <div className="bg-white rounded-[24px] p-5 border border-green-100 shadow-sm">
            <p className="text-sm text-gray-500 mb-2">Bài đã hoàn thành</p>
            <h3 className="text-2xl font-black text-green-600">{completedCount}</h3>
          </div>

          <div className="bg-white rounded-[24px] p-5 border border-orange-100 shadow-sm">
            <p className="text-sm text-gray-500 mb-2">Trạng thái lớp học</p>
            <h3 className="text-2xl font-black text-orange-500">
              {classroomId ? 'Đang học trong lớp' : 'Chưa vào lớp'}
            </h3>
          </div>
        </div>

        <div className="flex flex-col xl:flex-row gap-8 items-start">
          <div className="flex-1 w-full bg-white rounded-[30px] p-8 shadow-sm border border-blue-100 flex flex-col items-center">
            <h2 className="text-3xl font-black text-blue-600 mb-8 flex items-center gap-3">
              <span>🚀</span> Lộ Trình Học Tập
            </h2>

            {loadingLessons ? (
              <div className="w-full text-center py-20 text-gray-500 font-medium italic">
                Đang tải lộ trình học tập...
              </div>
            ) : lessons.length === 0 ? (
              renderNoLessonsState()
            ) : (
              <div className="relative w-full max-w-md min-h-[760px] flex flex-col items-center">
                <div className="absolute top-10 bottom-10 left-1/2 -translate-x-1/2 w-2 rounded-full bg-gradient-to-b from-blue-100 via-sky-100 to-blue-50"></div>

                <div className="relative z-10 w-full flex flex-col gap-6 items-center">
                  {displayLessons.map((item, index) => (
                    <LessonItem
                      key={`${item.label}-${index}`}
                      label={item.label}
                      isCompleted={item.isCompleted}
                      isLocked={item.isLocked}
                      isVirtual={item.isVirtual}
                      offsetClass={pathOffsets[index % pathOffsets.length]}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="w-full xl:w-[450px] flex flex-col gap-6">
            <div className="bg-white rounded-[30px] p-6 border border-blue-100 shadow-sm">
              <h3 className="text-2xl font-black text-blue-700 mb-4">Lối tắt nhanh</h3>

              <div className="grid grid-cols-1 gap-4">
                <button
                  onClick={() => navigate('/class')}
                  className="w-full bg-blue-50 hover:bg-blue-100 text-blue-700 px-5 py-4 rounded-2xl font-bold text-left transition"
                >
                  🏫 Xem lớp học của bé
                </button>

                <button
                  onClick={() => navigate('/assigned-exercises')}
                  className="w-full bg-orange-50 hover:bg-orange-100 text-orange-600 px-5 py-4 rounded-2xl font-bold text-left transition"
                >
                  📘 Xem bài tập được giao
                </button>

                <button
                  onClick={() => navigate('/ai-powered')}
                  className="w-full bg-green-50 hover:bg-green-100 text-green-600 px-5 py-4 rounded-2xl font-bold text-left transition"
                >
                  🤖 Hỏi bài cùng AI
                </button>
              </div>
            </div>

            <Leaderboard rankings={rankings} />
          </div>
        </div>
      </main>
    </div>
  );
}