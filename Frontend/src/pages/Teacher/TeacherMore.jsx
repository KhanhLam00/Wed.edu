import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TeacherSidebar from '../../components/Common/TeacherSidebar';
import { showToast } from "../../../util/toast";

export default function TeacherMore() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('settings');

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

    showToast('Giáo viên đã đăng xuất rồi nhé! 👋');
    navigate('/'); // 🔥 chuyển về login
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <TeacherSidebar />

      <main className="flex-1 p-10 flex gap-8">
        {/* CỘT TRÁI: NỘI DUNG CHI TIẾT */}
        <div className="flex-1 bg-white rounded-[40px] p-10 shadow-xl shadow-gray-200/50 border border-gray-100">
          {activeTab === 'settings' && (
            <div className="animate-fade-in">
              <h1 className="text-3xl font-black text-gray-800 mb-8">
                Settings
              </h1>

              <section className="mb-10">
                <h3 className="text-lg font-bold text-gray-500 mb-4 uppercase tracking-wider">
                  Teaching Experience
                </h3>
                <div className="space-y-4">
                  {[
                    'Sound Effects',
                    'Encouragement Notifications',
                    'Teacher Activity Tracking'
                  ].map((item) => (
                    <div
                      key={item}
                      className="flex justify-between items-center p-4 bg-gray-50 rounded-2xl"
                    >
                      <span className="font-bold text-gray-700">{item}</span>
                      <div className="w-12 h-6 bg-blue-400 rounded-full relative shadow-inner cursor-pointer">
                        <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full"></div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              <section className="mb-10">
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

          {activeTab === 'notifications' && (
            <div className="animate-fade-in">
              <h1 className="text-3xl font-black text-gray-800 mb-8">
                Notifications 🔔
              </h1>

              <div className="space-y-5">
                <div className="p-5 rounded-2xl bg-blue-50 border border-blue-100 shadow-sm hover:shadow-md transition">
                  <h3 className="font-bold text-blue-700 text-lg">
                    📝 New Exercise Draft Ready
                  </h3>
                  <p className="text-gray-600 mt-2">
                    A new exercise draft has been prepared. Review it before assigning it to students.
                  </p>
                </div>

                <div className="p-5 rounded-2xl bg-green-50 border border-green-100 shadow-sm hover:shadow-md transition">
                  <h3 className="font-bold text-green-700 text-lg">
                    📥 New Student Submissions
                  </h3>
                  <p className="text-gray-600 mt-2">
                    Some students have submitted their work. Check submissions to review their results.
                  </p>
                </div>

                <div className="p-5 rounded-2xl bg-purple-50 border border-purple-100 shadow-sm hover:shadow-md transition">
                  <h3 className="font-bold text-purple-700 text-lg">
                    👩‍🏫 Teaching Activity Summary
                  </h3>
                  <p className="text-gray-600 mt-2">
                    Your recent teaching activities have been recorded for easier class management.
                  </p>
                </div>

                <div className="p-5 rounded-2xl bg-orange-50 border border-orange-100 shadow-sm hover:shadow-md transition">
                  <h3 className="font-bold text-orange-600 text-lg">
                    🚀 Class Update Reminder
                  </h3>
                  <p className="text-gray-600 mt-2">
                    Review your classes regularly to keep track of student progress and assignments.
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