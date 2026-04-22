import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import TeacherSidebar from '../../components/Common/TeacherSidebar';
import { showToast } from "../../../util/toast";

export default function TeacherExerciseDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [exercise, setExercise] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const token = localStorage.getItem('token');

        const response = await fetch(`https://wed-edu.onrender.com/api/teacher/exercises/${id}`, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          }
        });

        const data = await response.json();

        if (response.ok) {
          setExercise(data.exercise);
          setQuestions(data.questions || []);
        } else {
          showToast(data.message || 'Không tải được chi tiết bài tập!');
        }
      } catch (error) {
        console.error(error);
        showToast('Lỗi kết nối khi tải chi tiết bài tập!');
      } finally {
        setLoading(false);
      }
    };

    fetchDetail();
  }, [id]);

return (
  <div className="flex min-h-screen bg-blue-50">
    <TeacherSidebar />

    <div className="flex-1 p-8">
      <div className="max-w-5xl mx-auto">
        <button
          onClick={() => navigate('/teacher-saved-exercises')}
          className="mb-6 bg-white border border-gray-300 hover:bg-gray-50 px-5 py-3 rounded-2xl font-bold text-gray-700"
        >
          ← Quay lại danh sách bài
        </button>

        {loading ? (
          <div className="bg-white rounded-3xl shadow p-8 text-center text-gray-500">
            Đang tải chi tiết bài tập...
          </div>
        ) : !exercise ? (
          <div className="bg-white rounded-3xl shadow p-8 text-center text-gray-500">
            Không tìm thấy bài tập.
          </div>
        ) : (
          <>
            <div className="bg-white rounded-3xl shadow p-6 border border-blue-100 mb-6">
              <h1 className="text-3xl font-black text-blue-700 mb-3">{exercise.title}</h1>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-600">
                <p><span className="font-bold">Chủ đề:</span> {exercise.topic}</p>
                <p><span className="font-bold">Độ khó:</span> {exercise.difficulty}</p>
                <p><span className="font-bold">Khối:</span> Lớp {exercise.grade_level}</p>
                <p><span className="font-bold">Lớp:</span> {exercise.class_name || 'Chưa rõ lớp'}</p>
              </div>
            </div>

            <div className="space-y-5">
              {questions.map((q, index) => (
                <div
                  key={q.id}
                  className="bg-white rounded-3xl shadow p-6 border border-gray-100"
                >
                  <p className="text-xl font-black text-gray-800 mb-3">
                    Câu {index + 1}: {q.question_text}
                  </p>
                  <p className="text-green-700 font-bold mb-2">
                    Đáp án: {q.answer_text}
                  </p>
                  <p className="text-gray-600">
                    Giải thích: {q.explanation}
                  </p>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
      
    </div>


  </div>);
}
