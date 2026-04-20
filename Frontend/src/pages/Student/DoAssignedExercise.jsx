import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import StudentSidebar from '../../components/Common/StudentSidebar';
import { showToast } from "../../../util/toast";

export default function DoAssignedExercise() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [exercise, setExercise] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(null);

  const userId = localStorage.getItem('userId') || '1';

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const token = localStorage.getItem('token'); // FIX: lấy token

        const response = await fetch(`http://localhost:5000/api/student/exercise-detail/${id}`, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}` // FIX: gửi token
          }
        });

        const data = await response.json();

        if (response.ok) {
          setExercise(data.exercise);
          setQuestions(data.questions || []);
        } else {
          showToast(data.message || 'Không tải được bài tập!');
        }
      } catch (error) {
        console.error(error);
        showToast('Lỗi kết nối khi tải bài tập!');
      } finally {
        setLoading(false);
      }
    };

    fetchDetail();
  }, [id]);

  const handleChangeAnswer = (questionId, value) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: value
    }));
  };

  const handleSubmit = async () => {
    if (questions.length === 0) return;

    try {
      setSubmitting(true);

      const token = localStorage.getItem('token'); // FIX: lấy token

      const response = await fetch('http://localhost:5000/api/student/submit-exercise', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}` // FIX: gửi token
        },
        body: JSON.stringify({
          exerciseId: id,
          userId,
          answers
        })
      });

      const data = await response.json();

      if (response.ok) {
        setResult(data);
      } else {
        showToast(data.message || 'Nộp bài thất bại!');
      }
    } catch (error) {
      console.error(error);
      showToast('Lỗi kết nối khi nộp bài!');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-blue-50">
      <StudentSidebar />

      <div className="flex-1 p-8">
        <div className="max-w-5xl mx-auto">
          {loading ? (
            <div className="bg-white rounded-3xl p-8 shadow text-center text-gray-500">
              Đang tải bài tập...
            </div>
          ) : !exercise ? (
            <div className="bg-white rounded-3xl p-8 shadow text-center text-gray-500">
              Không tìm thấy bài tập.
            </div>
          ) : (
            <>
              <div className="bg-white rounded-3xl shadow p-6 border border-blue-100 mb-6">
                <h1 className="text-3xl font-black text-blue-700 mb-3">{exercise.title}</h1>
                <p className="text-gray-600">
                  Chủ đề: <span className="font-bold">{exercise.topic}</span> | Độ khó:{' '}
                  <span className="font-bold">{exercise.difficulty}</span>
                </p>
              </div>

              {!result ? (
                <div className="space-y-5">
                  {questions.map((q, index) => (
                    <div key={q.id} className="bg-white rounded-3xl shadow p-6 border border-gray-100">
                      <p className="text-xl font-bold text-gray-800 mb-4">
                        Câu {index + 1}: {q.question_text}
                      </p>

                      <input
                        type="text"
                        value={answers[q.id] || ''}
                        onChange={(e) => handleChangeAnswer(q.id, e.target.value)}
                        placeholder="Nhập câu trả lời của bé..."
                        className="w-full border rounded-2xl px-4 py-3"
                      />
                    </div>
                  ))}

                  <button
                    onClick={handleSubmit}
                    disabled={submitting}
                    className="w-full bg-green-600 hover:bg-green-700 text-white py-4 rounded-2xl font-bold text-lg"
                  >
                    {submitting ? 'Đang nộp bài...' : 'Nộp bài'}
                  </button>
                </div>
              ) : (
                <div className="space-y-5">
                  <div className="bg-white rounded-3xl shadow p-6 border border-green-100">
                    <h2 className="text-3xl font-black text-green-600 mb-3">
                      Bé làm rất tốt!
                    </h2>
                    <p className="text-xl text-gray-700">
                      Điểm của bé: <span className="font-black">{result.score}</span>/100
                    </p>
                    <p className="text-gray-600 mt-2">
                      Đúng {result.correctCount}/{result.totalQuestions} câu
                    </p>
                  </div>

                  {result.results?.map((item, index) => (
                    <div
                      key={index}
                      className={`rounded-3xl shadow p-6 border ${
                        item.isCorrect
                          ? 'bg-green-50 border-green-200'
                          : 'bg-red-50 border-red-200'
                      }`}
                    >
                      <p className="font-bold text-lg mb-2">
                        Câu {index + 1}: {item.question}
                      </p>
                      <p>Bé trả lời: <span className="font-semibold">{item.userAnswer || '(trống)'}</span></p>
                      <p>Đáp án đúng: <span className="font-semibold">{item.correctAnswer}</span></p>
                      <p className="mt-2 text-gray-600">Giải thích: {item.explanation}</p>
                    </div>
                  ))}

                  <button
                    onClick={() => navigate('/assigned-exercises')}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-2xl font-bold text-lg"
                  >
                    Quay lại danh sách bài tập
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}