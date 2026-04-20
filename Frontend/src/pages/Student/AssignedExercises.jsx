import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import StudentSidebar from '../../components/Common/StudentSidebar';

export default function AssignedExercises() {
  const navigate = useNavigate();
  const [exercises, setExercises] = useState([]);
  const [loading, setLoading] = useState(true);

  const classroomId = localStorage.getItem('classroomId');
  const className = localStorage.getItem('className') || 'Chưa có lớp';

  useEffect(() => {
  const fetchExercises = async () => {
    if (!classroomId) {
      setLoading(false);
      return;
    }

    try {
      const token = localStorage.getItem('token');

      const response = await fetch(
        `http://localhost:5000/api/student/classroom-exercises/${classroomId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      const data = await response.json();

      if (response.ok && Array.isArray(data)) {
        setExercises(data);
      } else {
        setExercises([]);
      }
    } catch (error) {
      console.error(error);
      setExercises([]);
    } finally {
      setLoading(false);
    }
  };

  fetchExercises();
}, [classroomId]);

  return (
    <div className="flex min-h-screen bg-blue-50">
      <StudentSidebar />

      <div className="flex-1 p-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-black text-blue-700 mb-3">
            Bài tập được giao
          </h1>
          <p className="text-gray-600 mb-8">
            Lớp hiện tại: <span className="font-bold">{className}</span>
          </p>

          {!classroomId ? (
            <div className="bg-white rounded-3xl p-8 shadow text-center text-gray-500">
              Bé chưa vào lớp học nào. Hãy chọn lớp học trước nhé!
            </div>
          ) : loading ? (
            <div className="bg-white rounded-3xl p-8 shadow text-center text-gray-500">
              Đang tải bài tập...
            </div>
          ) : exercises.length === 0 ? (
            <div className="bg-white rounded-3xl p-8 shadow text-center text-gray-500">
              Hiện tại lớp của bé chưa có bài tập nào được giao.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {exercises.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-3xl shadow p-6 border border-blue-100"
                >
                  <h2 className="text-2xl font-black text-blue-700 mb-3">
                    {item.title}
                  </h2>

                  <div className="space-y-2 text-gray-600">
                    <p><span className="font-bold">Chủ đề:</span> {item.topic}</p>
                    <p><span className="font-bold">Độ khó:</span> {item.difficulty}</p>
                    <p><span className="font-bold">Khối:</span> Lớp {item.grade_level}</p>
                    <p><span className="font-bold">Lớp:</span> {item.class_name}</p>
                  </div>

                  <button
                    onClick={() => navigate(`/assigned-exercise/${item.id}`)}
                    className="mt-5 w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-2xl font-bold"
                  >
                    Vào làm bài
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}