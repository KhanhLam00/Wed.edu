import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import StudentSidebar from '../../components/Common/StudentSidebar';

export default function ClassRoom() {
  const navigate = useNavigate();

  const [classmates, setClassmates] = useState([]);
  const [classroom, setClassroom] = useState(null);
  const [teacher, setTeacher] = useState(null);
  const [activeTab, setActiveTab] = useState('home');
  const [loading, setLoading] = useState(true);

  const classroomId = localStorage.getItem('classroomId');
  const className = localStorage.getItem('className') || 'Chưa có lớp';
  const gradeLevel = localStorage.getItem('gradeLevel') || '';

  useEffect(() => {
    const fetchClassroomData = async () => {
      if (!classroomId) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);

        const classRes = await fetch(`http://localhost:5000/api/classrooms/${classroomId}`);
        const classData = await classRes.json();

        if (classRes.ok) {
          setClassroom(classData);

          if (classData.teacher_name || classData.teacher_avatar) {
            setTeacher({
              name: classData.teacher_name || 'Giáo viên phụ trách',
              avatar:
                classData.teacher_avatar ||
                'https://cdn-icons-png.flaticon.com/128/4140/4140048.png'
            });
          } else if (classData.teacher_id) {
            setTeacher({
              name: `Giáo viên phụ trách`,
              avatar: 'https://cdn-icons-png.flaticon.com/128/4140/4140048.png'
            });
          } else {
            setTeacher(null);
          }
        } else {
          console.error('Không lấy được lớp:', classData.message);
          setClassroom(null);
          setTeacher(null);
        }

        const membersRes = await fetch(`http://localhost:5000/api/classrooms/${classroomId}/members`);
        const membersData = await membersRes.json();

        if (membersRes.ok && Array.isArray(membersData)) {
          setClassmates(membersData);
        } else {
          setClassmates([]);
        }
      } catch (err) {
        console.error('Lỗi lấy dữ liệu lớp học:', err);
        setClassroom(null);
        setTeacher(null);
        setClassmates([]);
      } finally {
        setLoading(false);
      }
    };

    fetchClassroomData();
  }, [classroomId]);

  const announcements = useMemo(() => {
    if (!classroom) return [];

    return [
      {
        id: 1,
        title: 'Thông tin lớp',
        date: `Khối ${classroom.grade_level}`,
        bgColor: 'bg-[#DFA642]',
        content: `Chào mừng bé đến với ${classroom.class_name}. Đây là lớp học thật mà bé đã tham gia bằng mã lớp.`
      },
      {
        id: 2,
        title: 'Nhắc nhở',
        date: 'Lưu ý',
        bgColor: 'bg-[#5BA06B]',
        content: `Bé hãy vào phần bài tập được giao và theo dõi thông tin lớp thường xuyên nhé. Nếu bé đổi lớp, hãy dùng mã lớp mới để vào đúng lớp học.`
      }
    ];
  }, [classroom]);

  const renderNoClassUI = () => (
    <div className="max-w-3xl mx-auto mt-10">
      <div className="bg-white rounded-[32px] shadow-sm border border-gray-100 p-10 text-center">
        <div className="text-7xl mb-5">🏫</div>
        <h2 className="text-3xl font-black text-blue-700 mb-4">Bé chưa vào lớp học nào</h2>
        <p className="text-gray-600 text-lg leading-8 max-w-2xl mx-auto mb-8">
          Bé đã chọn <span className="font-bold text-orange-500">khối {gradeLevel || 'học'}</span>,
          nhưng chưa nhập <span className="font-bold text-blue-600">mã lớp</span>.
          Hãy nhập mã lớp mà giáo viên gửi cho bé để vào đúng lớp học nhé!
        </p>

        <div className="flex flex-wrap justify-center gap-4">
          <button
            onClick={() => navigate('/join-class')}
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-2xl font-bold text-lg shadow-md transition"
          >
            Nhập mã lớp ngay
          </button>

          <button
            onClick={() => navigate('/grade-selection')}
            className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-4 rounded-2xl font-bold text-lg shadow-md transition"
          >
            Chọn lại khối học
          </button>

          <button
            onClick={() => navigate('/student-dashboard')}
            className="bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 px-8 py-4 rounded-2xl font-bold text-lg transition"
          >
            Quay lại Dashboard
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-[#EAF1F8]">
      <StudentSidebar />

      <main className="flex-1 p-10 h-screen overflow-y-auto">
        <div className="flex items-center gap-8 border-b-2 border-gray-300 mb-8 pb-2">
          <button
            onClick={() => setActiveTab('home')}
            className={`text-3xl font-bold transition-all ${
              activeTab === 'home'
                ? 'text-[#1B75D0] border-b-4 border-[#1B75D0] pb-2 -mb-[10px]'
                : 'text-gray-700 hover:text-blue-500'
            }`}
          >
            Home
          </button>
          <button
            onClick={() => setActiveTab('class')}
            className={`text-3xl font-bold transition-all ${
              activeTab === 'class'
                ? 'text-[#1B75D0] border-b-4 border-[#1B75D0] pb-2 -mb-[10px]'
                : 'text-gray-700 hover:text-blue-500'
            }`}
          >
            Class
          </button>
        </div>

        {loading ? (
          <div className="max-w-3xl mx-auto text-center py-16 text-gray-500 text-xl font-semibold">
            Đang tải thông tin lớp học...
          </div>
        ) : !classroomId ? (
          renderNoClassUI()
        ) : activeTab === 'home' ? (
          <div className="max-w-4xl mx-auto animate-fade-in space-y-8">
            <div className="relative w-full h-56 rounded-[30px] overflow-hidden shadow-sm bg-white border border-gray-100">
              <img
                src="/IMG/IMGLanding/chill2.jpg"
                alt="Banner"
                className="w-full h-full object-cover opacity-90"
              />
              <div className="absolute top-4 right-6 bg-white px-8 py-3 rounded-2xl font-black text-2xl text-gray-800 shadow-md">
                {classroom ? classroom.class_name : className}
              </div>
            </div>

            <div className="bg-white rounded-[24px] p-6 shadow-sm border border-gray-100">
              <h3 className="text-2xl font-bold text-blue-700 mb-3">Thông tin lớp học</h3>
              <p className="text-lg text-gray-700 mb-2">
                Mã lớp: <span className="font-semibold">{classroom?.class_code || '---'}</span>
              </p>
              <p className="text-lg text-gray-700 mb-2">
                Tên lớp: <span className="font-semibold">{classroom?.class_name || className}</span>
              </p>
              <p className="text-lg text-gray-700">
                Khối lớp: <span className="font-semibold">Lớp {classroom?.grade_level || gradeLevel}</span>
              </p>
            </div>

            {announcements.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-[30px] overflow-hidden shadow-sm border border-gray-100"
              >
                <div className={`${item.bgColor} px-8 py-4 flex justify-between items-center text-white`}>
                  <span className="text-xl font-bold">{item.title}</span>
                  <span className="text-sm font-medium opacity-90">{item.date}</span>
                </div>
                <div className="p-8 text-gray-700 text-lg leading-relaxed font-medium">
                  {item.content}
                </div>
              </div>
            ))}

            <div className="bg-blue-50 border border-blue-100 rounded-[24px] p-6">
              <h3 className="text-2xl font-bold text-blue-700 mb-3">Gợi ý cho bé</h3>
              <p className="text-gray-700 text-lg leading-8">
                Bé có thể dùng mã lớp này để kiểm tra mình đang ở đúng lớp.
                Nếu giáo viên đổi mã mới, bé chỉ cần vào lại phần nhập mã lớp để tham gia lớp mới.
              </p>
            </div>
          </div>
        ) : (
          <div className="max-w-4xl mx-auto animate-fade-in">
            <div className="mb-10">
              <div className="flex items-center gap-4 mb-6">
                <h2 className="text-2xl font-black text-gray-800">Giáo viên</h2>
                <div className="flex-1 border-b border-gray-400"></div>
              </div>

              {teacher ? (
                <div className="bg-white rounded-full p-3 pr-6 flex items-center justify-between shadow-sm border border-gray-100">
                  <div className="flex items-center gap-6">
                    <div className="w-16 h-16 rounded-full overflow-hidden ml-2 border-2 border-orange-200">
                      <img src={teacher.avatar} alt="Teacher" className="w-full h-full object-cover" />
                    </div>
                    <span className="text-2xl font-medium text-gray-800">{teacher.name}</span>
                  </div>
                  <button className="bg-gray-200 text-gray-600 px-8 py-2 rounded-full font-bold text-lg cursor-default">
                    Teacher
                  </button>
                </div>
              ) : (
                <div className="bg-white rounded-[24px] p-8 text-center border border-gray-100 shadow-sm">
                  <div className="text-5xl mb-4">👩‍🏫</div>
                  <p className="text-gray-500 italic text-lg">
                    Lớp học hiện tại chưa có giáo viên phụ trách.
                  </p>
                </div>
              )}
            </div>

            <div>
              <div className="flex items-center gap-4 mb-6">
                <h2 className="text-2xl font-black text-gray-800">Bạn học</h2>
                <div className="flex-1 border-b border-gray-400"></div>
              </div>

              <div className="space-y-4">
                {classmates.length > 0 ? (
                  classmates.map((friend) => (
                    <div
                      key={friend.id}
                      className="bg-white rounded-full p-3 pr-6 flex items-center justify-between shadow-sm border border-gray-100"
                    >
                      <div className="flex items-center gap-6">
                        <div className="w-16 h-16 rounded-full overflow-hidden ml-2 border-2 border-blue-100">
                          <img src={friend.avatar} alt="Student" className="w-full h-full object-cover" />
                        </div>
                        <span className="text-2xl font-medium text-gray-800">{friend.name}</span>
                      </div>
                      <button className="bg-gray-200 text-gray-600 px-8 py-2 rounded-full font-bold text-lg cursor-default">
                        Student
                      </button>
                    </div>
                  ))
                ) : (
                  <div className="bg-white rounded-[24px] p-8 text-center border border-gray-100 shadow-sm">
                    <div className="text-5xl mb-4">👫</div>
                    <p className="text-gray-500 italic text-lg">
                      Lớp học hiện tại chưa có bạn nào.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}