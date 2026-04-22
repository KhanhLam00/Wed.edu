import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import TeacherSidebar from '../../components/Common/TeacherSidebar';
import { showToast } from "../../../util/toast";

export default function TeacherSubmissionDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [submission, setSubmission] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const token = localStorage.getItem('token');

        const response = await fetch(`https://wed-edu.onrender.com/api/teacher/submissions/${id}/detail`, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          }
        });

        const data = await response.json();

        if (response.ok) {
          setSubmission(data.submission);
          setAnswers(data.answers || []);
        } else {
          showToast(data.message || 'Không tải được chi tiết bài nộp!');
        }
      } catch (error) {
        console.error(error);
        showToast('Lỗi kết nối khi tải chi tiết bài nộp!');
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
      <div className="max-w-6xl mx-auto">
        <button
          onClick={() => navigate(-1)}
          className="mb-6 bg-white border border-gray-300 hover:bg-gray-50 px-5 py-3 rounded-2xl font-bold text-gray-700"
        >
          ← Quay lại
        </button>

        {loading ? (
          <div className="bg-white rounded-3xl shadow p-8 text-center text-gray-500">
            Đang tải chi tiết bài nộp...
          </div>
        ) : !submission ? (
          <div className="bg-white rounded-3xl shadow p-8 text-center text-gray-500">
            Không tìm thấy bài nộp.
          </div>
        ) : (
          <>
            <div className="bg-white rounded-3xl shadow p-6 border border-blue-100 mb-6">
              <h1 className="text-3xl font-black text-blue-700 mb-4">
                Chi tiết bài nộp của học sinh
              </h1>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700">
                <p><span className="font-bold">Học sinh:</span> {submission.username}</p>
                <p><span className="font-bold">Mã học sinh:</span> {submission.public_user_id || '---'}</p>
                <p><span className="font-bold">Lớp:</span> {submission.class_name || '---'}</p>
                <p><span className="font-bold">Bài tập:</span> {submission.exercise_title}</p>
                <p><span className="font-bold">Chủ đề:</span> {submission.topic}</p>
                <p><span className="font-bold">Độ khó:</span> {submission.difficulty}</p>
                <p><span className="font-bold">Điểm:</span> {submission.score}/100</p>
                <p><span className="font-bold">Số câu:</span> {submission.total_questions}</p>
              </div>
            </div>

            <div className="space-y-5">
              {answers.map((item, index) => (
                <div
                  key={item.id}
                  className={`rounded-3xl shadow p-6 border ${
                    item.is_correct
                      ? 'bg-green-50 border-green-200'
                      : 'bg-red-50 border-red-200'
                  }`}
                >
                  <p className="text-xl font-black text-gray-800 mb-3">
                    Câu {index + 1}: {item.question_text}
                  </p>

                  <p className="mb-2">
                    <span className="font-bold">Học sinh trả lời:</span>{' '}
                    <span className="text-gray-700">{item.user_answer || '(trống)'}</span>
                  </p>

                  <p className="mb-2">
                    <span className="font-bold">Đáp án đúng:</span>{' '}
                    <span className="text-green-700 font-semibold">{item.correct_answer}</span>
                  </p>

                  <p className="mb-2">
                    <span className="font-bold">Giải thích:</span>{' '}
                    <span className="text-gray-600">{item.explanation || 'Không có giải thích.'}</span>
                  </p>

                  <div className="mt-3">
                    <span
                      className={`px-4 py-2 rounded-full text-sm font-bold ${
                        item.is_correct
                          ? 'bg-green-200 text-green-800'
                          : 'bg-red-200 text-red-800'
                      }`}
                    >
                      {item.is_correct ? 'Đúng' : 'Sai'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  </div>);
}
