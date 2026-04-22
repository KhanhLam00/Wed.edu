import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import StudentSidebar from '../../components/Common/StudentSidebar';
import { showToast } from "../../../util/toast";

export default function MoreOptions() {
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('settings');
  const [currentGrade, setCurrentGrade] = useState(
    localStorage.getItem('gradeLevel')
      ? `Lớp ${localStorage.getItem('gradeLevel')}`
      : 'Lớp 1'
  );

  const handleGradeChange = async (grade) => {
    const userId = localStorage.getItem('userId');

    const gradeMap = {
      'Lớp 1': 1,
      'Lớp 2': 2,
      'Lớp 3': 3,
      'Lớp 4': 4,
      'Lớp 5': 5
    };

    try {
      const response = await fetch('https://wed-edu.onrender.com/api/update-grade', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          className: grade, // tạm lưu khối học
          gradeLevel: gradeMap[grade]
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // Lưu khối mới
        localStorage.setItem('gradeLevel', gradeMap[grade].toString());

        // Xóa lớp thật cũ để tránh loạn dữ liệu
        localStorage.removeItem('classroomId');
        localStorage.removeItem('className');

        localStorage.setItem('needChooseRealClass', 'true');
        
        setCurrentGrade(grade);

        showToast(
          `Bé đã chuyển sang ${grade} rồi nè! 🌟\nBây giờ mình chọn lớp học thật tiếp nhé.`
        );

        // Chuyển sang trang chọn lớp thật
        navigate('/grade-selection');
      } else {
        showToast('Không thể đổi khối học: ' + data.message);
      }
    } catch (error) {
      console.error(error);
      showToast('Lỗi kết nối server khi đổi khối học!');
    }
  };

      const handleLogout = () => {
    localStorage.removeItem('token'); // 🔥 QUAN TRỌNG
    localStorage.removeItem('userId');
    localStorage.removeItem('role');
    localStorage.removeItem('username');
    localStorage.removeItem('avatar');
    localStorage.removeItem('userAvatar');
    localStorage.removeItem('className');
    localStorage.removeItem('classroomId');
    localStorage.removeItem('gradeLevel');
    localStorage.removeItem('needChooseRealClass');

    showToast('Bé đã đăng xuất rồi nhé! 👋');
    navigate('/'); // 🔥 chuyển về đúng trang login
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <StudentSidebar />

      <main className="flex-1 p-10 flex gap-8">
        {/* CỘT TRÁI: NỘI DUNG CHI TIẾT */}
        <div className="flex-1 bg-white rounded-[40px] p-10 shadow-xl shadow-gray-200/50 border border-gray-100">
          {activeTab === 'settings' && (
            <div className="animate-fade-in">
              <h1 className="text-3xl font-black text-gray-800 mb-8 ">
                Settings
              </h1>

              <section className="mb-10">
                <h3 className="text-lg font-bold text-gray-500 mb-4 uppercase tracking-wider">
                  Learning Experience
                </h3>
                <div className="space-y-4">
                  {['Sound Effects', 'Encouragement Notifications', 'Listening Activity'].map(item => (
                    <div key={item} className="flex justify-between items-center p-4 bg-gray-50 rounded-2xl">
                      <span className="font-bold text-gray-700">{item}</span>
                      <div className="w-12 h-6 bg-blue-400 rounded-full relative shadow-inner cursor-pointer">
                        <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full"></div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              <section>
                <h3 className="text-lg font-bold text-gray-500 mb-4 uppercase tracking-wider">
                  Interface
                </h3>
                <div className="p-4 bg-gray-50 rounded-2xl flex justify-between items-center">
                  <span className="font-bold text-gray-700">Dark Mode</span>
                  <select className="bg-white border-none rounded-xl px-4 py-2 font-bold text-gray-600 shadow-sm focus:ring-2 focus:ring-blue-400 outline-none">
                    <option>System Default</option>
                    <option>On</option>
                    <option>Off</option>
                  </select>
                </div>
              </section>
            </div>
          )}

          {activeTab === 'change-classes' && (
            <div className="animate-fade-in">
              <div className="text-center mb-8">
                <h1 className="text-3xl font-black text-orange-500 mb-3">
                  Đổi Khối Học ✏️
                </h1>
                <p className="text-gray-500 font-medium max-w-xl mx-auto leading-7">
                  Bé hãy chọn <span className="font-bold text-orange-500">khối học mới</span>.
                  Sau đó hệ thống sẽ đưa bé tới trang chọn <span className="font-bold text-blue-600">lớp học thật</span>
                  như 1A, 2A, 5A nhé!
                </p>
              </div>

              <div className="bg-orange-50 border border-orange-100 rounded-3xl p-5 mb-8 max-w-2xl mx-auto">
                <p className="text-sm text-gray-700 leading-7">
                  <span className="font-bold text-orange-600">Lưu ý:</span> Khi đổi khối học,
                  lớp học thật cũ sẽ được xóa để tránh bị lệch dữ liệu. Bé sẽ chọn lại lớp mới ở bước sau.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-4 max-w-md mx-auto">
                {['Lớp 1', 'Lớp 2', 'Lớp 3', 'Lớp 4', 'Lớp 5'].map((grade) => (
                  <button
                    key={grade}
                    onClick={() => handleGradeChange(grade)}
                    className={`p-6 rounded-3xl border-4 transition-all flex items-center justify-between group ${
                      currentGrade === grade
                        ? 'border-orange-500 bg-orange-50 scale-105 shadow-lg'
                        : 'border-gray-100 hover:border-orange-200 hover:bg-white'
                    }`}
                  >
                    <span className="text-2xl font-black">{grade}</span>
                    <span className="text-4xl">
                      {grade === 'Lớp 1' && '🍎'}
                      {grade === 'Lớp 2' && '🐥'}
                      {grade === 'Lớp 3' && '🍀'}
                      {grade === 'Lớp 4' && '🧠'}
                      {grade === 'Lớp 5' && '🚀'}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="animate-fade-in">
              <h1 className="text-3xl font-black text-gray-800 mb-8">
                Notifications 🔔
              </h1>

              <div className="space-y-5">

                {/* Notification 1 */}
                <div className="p-5 rounded-2xl bg-blue-50 border border-blue-100 shadow-sm hover:shadow-md transition">
                  <h3 className="font-bold text-blue-700 text-lg">
                    🎯 New Math Challenge Available!
                  </h3>
                  <p className="text-gray-600 mt-2">
                    Try today’s challenge to improve your problem-solving skills and earn rewards!
                  </p>
                </div>

                {/* Notification 2 */}
                <div className="p-5 rounded-2xl bg-green-50 border border-green-100 shadow-sm hover:shadow-md transition">
                  <h3 className="font-bold text-green-700 text-lg">
                    🧠 AI Feedback Ready
                  </h3>
                  <p className="text-gray-600 mt-2">
                    Your recent answers have been analyzed. Check out your weak areas and improve faster!
                  </p>
                </div>

                {/* Notification 3 */}
                <div className="p-5 rounded-2xl bg-purple-50 border border-purple-100 shadow-sm hover:shadow-md transition">
                  <h3 className="font-bold text-purple-700 text-lg">
                    ⭐ Keep Your Streak!
                  </h3>
                  <p className="text-gray-600 mt-2">
                    You are on a learning streak. Complete one lesson today to keep it going!
                  </p>
                </div>

                {/* Notification 4 */}
                <div className="p-5 rounded-2xl bg-orange-50 border border-orange-100 shadow-sm hover:shadow-md transition">
                  <h3 className="font-bold text-orange-600 text-lg">
                    📚 New Lesson Unlocked
                  </h3>
                  <p className="text-gray-600 mt-2">
                    Congratulations! A new math lesson is now available for you to explore.
                  </p>
                </div>

              </div>
            </div>
          )}

        </div>

        {/* CỘT PHẢI: MENU DANH MỤC */}
        <div className="w-80 flex flex-col gap-6">
          <div className="bg-white p-8 rounded-[40px] shadow-lg border border-gray-100">
            <h3 className="font-black text-xl mb-6 text-gray-800">Account</h3>
            <ul className="space-y-4">
              {[
                { id: 'settings', label: 'Settings' },
                { id: 'change-classes', label: 'Change classes' },
                { id: 'notifications', label: 'Notifications' }
              ].map((item) => (
                <li
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`cursor-pointer font-bold transition-colors ${
                    activeTab === item.id
                      ? 'text-blue-600 underline'
                      : 'text-gray-400 hover:text-gray-600'
                  }`}
                >
                  {item.label}
                </li>
              ))}
            </ul>
          </div>

<button
  onClick={handleLogout}
  className="w-full py-5 bg-white text-blue-500 font-black text-2xl rounded-[30px] shadow-lg hover:bg-blue-50 transition-all border border-blue-100"
>
  Log out
</button>
        </div>
      </main>
    </div>
  );
}
