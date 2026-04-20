import React, { useEffect, useState } from 'react';
import TeacherSidebar from '../../components/Common/TeacherSidebar';
import { showToast } from "../../../util/toast";

export default function TeacherClasses() {
  const [classes, setClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState(null);
  const [students, setStudents] = useState([]);
  const [exercises, setExercises] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loadingClasses, setLoadingClasses] = useState(true);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [creatingClass, setCreatingClass] = useState(false);

  const teacherId = localStorage.getItem('userId');

  const fetchClasses = async () => {
  if (!teacherId) {
    setClasses([]);
    setLoadingClasses(false);
    return;
  }

  try {
    setLoadingClasses(true);
    const token = localStorage.getItem('token');

    const response = await fetch(`http://localhost:5000/api/teacher/classes`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    const data = await response.json();

    if (response.ok && Array.isArray(data)) {
      setClasses(data);
    } else {
      setClasses([]);
    }
  } catch (error) {
    console.error(error);
    setClasses([]);
  } finally {
    setLoadingClasses(false);
  }
};

  useEffect(() => {
    fetchClasses();
  }, []);

  const handleSelectClass = async (classId) => {
    if (!teacherId) return;

    try {
      setLoadingDetail(true);

const token = localStorage.getItem('token');

      const [detailRes, summaryRes] = await Promise.all([
        fetch(`http://localhost:5000/api/teacher/classes/${classId}/detail`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }),
        fetch(`http://localhost:5000/api/teacher/classes/${classId}/submission-summary`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
      ]);

      const detailData = await detailRes.json();
      const summaryData = await summaryRes.json();

      if (detailRes.ok) {
        setSelectedClass(detailData.classroom);
        setStudents(detailData.students || []);
        setExercises(detailData.exercises || []);
      } else {
        showToast(detailData.message || 'Không tải được thông tin lớp!');
        setSelectedClass(null);
        setStudents([]);
        setExercises([]);
      }

      if (summaryRes.ok) {
        setSummary(summaryData);
      } else {
        setSummary(null);
      }
    } catch (error) {
      console.error(error);
      showToast('Lỗi kết nối khi tải thông tin lớp!');
    } finally {
      setLoadingDetail(false);
    }
  };

const handleCreateClass = async () => {
  const className = prompt('Nhập tên lớp:');
  if (!className) return;

  const gradeText = prompt('Nhập khối lớp (1-5):');
  if (!gradeText) return;

  const gradeLevel = Number(gradeText);
  if (![1, 2, 3, 4, 5].includes(gradeLevel)) {
    showToast('Khối lớp không hợp lệ! Chỉ nhập số từ 1 đến 5.');
    return;
  }

  if (!teacherId) {
    showToast('Không tìm thấy tài khoản giáo viên. Hãy đăng nhập lại.');
    return;
  }

  try {
    setCreatingClass(true);
    const token = localStorage.getItem('token');

    const res = await fetch('http://localhost:5000/api/teacher/create-class', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ className, gradeLevel }),
    });

    const data = await res.json();

    if (res.ok) {
      showToast(`Tạo lớp thành công!\nMã lớp: ${data.classCode}`);
      await fetchClasses();
    } else {
      showToast(data.message || 'Tạo lớp thất bại!');
    }
  } catch (error) {
    console.error(error);
    showToast('Lỗi kết nối server khi tạo lớp!');
  } finally {
    setCreatingClass(false);
  }
};

const handleDeleteClass = async (classId, className) => {
  if (!teacherId) return;

  const confirmed = window.confirm(`Bạn có chắc muốn xóa lớp "${className}" không?`);
  if (!confirmed) return;

  try {
    const token = localStorage.getItem('token');

    const res = await fetch(`http://localhost:5000/api/teacher/classes/${classId}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    const data = await res.json();

    if (res.ok) {
      showToast(data.message || 'Xóa lớp thành công!');
      if (selectedClass?.id === classId) {
        setSelectedClass(null);
        setStudents([]);
        setExercises([]);
        setSummary(null);
      }
      await fetchClasses();
    } else {
      showToast(data.message || 'Không thể xóa lớp!');
    }
  } catch (error) {
    console.error(error);
    showToast('Lỗi kết nối server khi xóa lớp!');
  }
};

  return (
    <div className="flex min-h-screen bg-blue-50">
      <TeacherSidebar />

      <div className="flex-1 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-4xl font-black text-blue-700 mb-3">
              Teacher Class Management
            </h1>
            <p className="text-gray-600 text-lg">
              Giáo viên chỉ xem các lớp do chính mình phụ trách.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1 bg-white rounded-3xl shadow-lg p-6 border border-blue-100">
              <div className="flex items-center justify-between mb-5 gap-4">
                <h2 className="text-2xl font-black text-gray-800">Danh sách lớp</h2>

                <button
                  onClick={handleCreateClass}
                  disabled={creatingClass}
                  className="px-5 py-3 bg-green-500 text-white rounded-2xl hover:bg-green-600 font-bold disabled:opacity-50"
                >
                  {creatingClass ? 'Đang tạo...' : '+ Tạo lớp mới'}
                </button>
              </div>

              {loadingClasses ? (
                <div className="text-gray-500 text-center py-10">Đang tải danh sách lớp...</div>
              ) : classes.length === 0 ? (
                <div className="text-gray-500 text-center py-10">
                  Giáo viên này chưa có lớp nào.
                </div>
              ) : (
                <div className="space-y-4">
                  {classes.map((item) => (
                    <div
                      key={item.id}
                      className={`w-full rounded-3xl border p-5 shadow-sm transition ${
                        selectedClass?.id === item.id
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-100 bg-white hover:border-blue-200'
                      }`}
                    >
                      <button
                        onClick={() => handleSelectClass(item.id)}
                        className="w-full text-left"
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-2xl font-black text-blue-700">
                              {item.class_code || 'Chưa có mã'}
                            </p>
                            <p className="text-gray-600 font-medium">{item.class_name}</p>
                          </div>
                          <div className="text-right text-sm text-gray-500">
                            <p>{item.total_students || 0} học sinh</p>
                            <p>{item.total_exercises || 0} bài</p>
                          </div>
                        </div>
                      </button>

                      <div className="mt-4 flex justify-end">
                        <button
                          onClick={() => handleDeleteClass(item.id, item.class_name)}
                          className="px-4 py-2 bg-red-50 text-red-600 rounded-xl font-bold hover:bg-red-100 transition"
                        >
                          Xóa lớp
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="lg:col-span-2 space-y-8">
              {!selectedClass ? (
                <div className="bg-white rounded-3xl shadow-lg p-10 border border-gray-100 text-center text-gray-500">
                  Giáo viên hãy chọn một lớp để xem chi tiết nhé.
                </div>
              ) : loadingDetail ? (
                <div className="bg-white rounded-3xl shadow-lg p-10 border border-gray-100 text-center text-gray-500">
                  Đang tải chi tiết lớp học...
                </div>
              ) : (
                <>
                  <div className="bg-white rounded-3xl shadow-lg p-6 border border-blue-100">
                    <h2 className="text-3xl font-black text-blue-700 mb-4">
                      {selectedClass.class_name}
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div className="bg-blue-50 rounded-2xl p-4">
                        <p className="text-sm text-gray-500">Mã lớp</p>
                        <p className="text-2xl font-black text-blue-700">
                          {selectedClass.class_code || '---'}
                        </p>
                      </div>

                      <div className="bg-blue-50 rounded-2xl p-4">
                        <p className="text-sm text-gray-500">Khối lớp</p>
                        <p className="text-2xl font-black text-blue-700">
                          Lớp {selectedClass.grade_level}
                        </p>
                      </div>

                      <div className="bg-green-50 rounded-2xl p-4">
                        <p className="text-sm text-gray-500">Số học sinh đã nộp</p>
                        <p className="text-2xl font-black text-green-600">
                          {summary?.total_students_submitted || 0}
                        </p>
                      </div>

                      <div className="bg-yellow-50 rounded-2xl p-4">
                        <p className="text-sm text-gray-500">Điểm trung bình</p>
                        <p className="text-2xl font-black text-yellow-500">
                          {summary?.average_score ? Math.round(summary.average_score) : 0}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-3xl shadow-lg p-6 border border-gray-100">
                    <h3 className="text-2xl font-black text-gray-800 mb-5">Học sinh trong lớp</h3>

                    {students.length === 0 ? (
                      <div className="text-gray-500">Chưa có học sinh nào trong lớp này.</div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {students.map((student) => (
                          <div
                            key={student.id}
                            className="border border-gray-100 rounded-2xl p-4 bg-gray-50 flex items-center gap-4"
                          >
                            <img
                              src={student.avatar || '/IMG/IMGLanding/chill2.jpg'}
                              alt="avatar"
                              className="w-14 h-14 rounded-full object-cover"
                            />
                            <div>
                              <p className="font-black text-gray-800">{student.username}</p>
                              <p className="text-sm text-gray-500">
                                {student.public_user_id || 'Chưa có mã'}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="bg-white rounded-3xl shadow-lg p-6 border border-gray-100">
                    <h3 className="text-2xl font-black text-gray-800 mb-5">Bài tập đã giao cho lớp</h3>

                    {exercises.length === 0 ? (
                      <div className="text-gray-500">Lớp này chưa có bài tập nào được giao.</div>
                    ) : (
                      <div className="space-y-4">
                        {exercises.map((item) => (
                          <div
                            key={item.id}
                            className="border border-blue-100 rounded-2xl p-5 bg-blue-50"
                          >
                            <div className="flex flex-wrap items-center justify-between gap-3">
                              <div>
                                <p className="text-xl font-black text-blue-700">{item.title}</p>
                                <p className="text-gray-600 mt-1">
                                  Chủ đề: {item.topic} | Độ khó: {item.difficulty}
                                </p>
                              </div>

                              <div className="bg-white px-4 py-2 rounded-full text-sm font-bold text-blue-700 shadow-sm">
                                {item.total_submissions || 0} lượt nộp
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}