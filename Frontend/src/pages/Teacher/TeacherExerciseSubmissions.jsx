import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import TeacherSidebar from '../../components/Common/TeacherSidebar';

export default function TeacherExerciseSubmissions() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [submissions, setSubmissions] = useState([]);
  const [summary, setSummary] = useState(null);
  const [exercise, setExercise] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      try {
const token = localStorage.getItem('token');

      const [exerciseRes, submissionsRes, summaryRes] = await Promise.all([
        fetch(`https://wed-edu.onrender.com/api/teacher/exercises/${id}`, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          }
        }),
        fetch(`https://wed-edu.onrender.com/api/teacher/exercises/${id}/submissions`, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          }
        }),
        fetch(`https://wed-edu.onrender.com/api/teacher/exercises/${id}/submission-summary`, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          }
        })
      ]);

        const exerciseData = await exerciseRes.json();
        const submissionsData = await submissionsRes.json();
        const summaryData = await summaryRes.json();

        if (exerciseRes.ok) {
          setExercise(exerciseData.exercise);
        }

        if (submissionsRes.ok && Array.isArray(submissionsData)) {
          setSubmissions(submissionsData);
        } else {
          setSubmissions([]);
        }

        if (summaryRes.ok) {
          setSummary(summaryData);
        }
      } catch (error) {
        console.error(error);
        setSubmissions([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, [id]);

return (
  <div className="flex min-h-screen bg-blue-50">
    <TeacherSidebar />

    <div className="flex-1 p-8">
      <div className="max-w-7xl mx-auto">
        <button
          onClick={() => navigate('/teacher-saved-exercises')}
          className="mb-6 bg-white border border-gray-300 hover:bg-gray-50 px-5 py-3 rounded-2xl font-bold text-gray-700"
        >
          ← Quay lại danh sách bài
        </button>

        {loading ? (
          <div className="bg-white rounded-3xl shadow p-8 text-center text-gray-500">
            Đang tải danh sách bài nộp...
          </div>
        ) : (
          <>
            <div className="bg-white rounded-3xl shadow p-6 border border-blue-100 mb-6">
              <h1 className="text-3xl font-black text-blue-700 mb-3">
                Kết quả học sinh đã nộp
              </h1>

              {exercise && (
                <div className="text-gray-600 space-y-2">
                  <p><span className="font-bold">Bài tập:</span> {exercise.title}</p>
                  <p><span className="font-bold">Chủ đề:</span> {exercise.topic}</p>
                  <p><span className="font-bold">Độ khó:</span> {exercise.difficulty}</p>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
              <div className="bg-white rounded-3xl shadow p-5 border border-blue-100">
                <p className="text-sm text-gray-500">Số lượt nộp</p>
                <p className="text-3xl font-black text-blue-700">
                  {summary?.total_submissions || 0}
                </p>
              </div>

              <div className="bg-white rounded-3xl shadow p-5 border border-green-100">
                <p className="text-sm text-gray-500">Điểm trung bình</p>
                <p className="text-3xl font-black text-green-600">
                  {summary?.average_score ? Math.round(summary.average_score) : 0}
                </p>
              </div>

              <div className="bg-white rounded-3xl shadow p-5 border border-yellow-100">
                <p className="text-sm text-gray-500">Điểm cao nhất</p>
                <p className="text-3xl font-black text-yellow-500">
                  {summary?.highest_score || 0}
                </p>
              </div>

              <div className="bg-white rounded-3xl shadow p-5 border border-red-100">
                <p className="text-sm text-gray-500">Điểm thấp nhất</p>
                <p className="text-3xl font-black text-red-500">
                  {summary?.lowest_score || 0}
                </p>
              </div>
            </div>

            {submissions.length === 0 ? (
              <div className="bg-white rounded-3xl shadow p-8 text-center text-gray-500">
                Chưa có học sinh nào nộp bài này.
              </div>
            ) : (
              <div className="bg-white rounded-3xl shadow overflow-hidden border border-gray-100">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-blue-600 text-white">
                    <tr>
                        <th className="text-left px-6 py-4 font-bold">Học sinh</th>
                        <th className="text-left px-6 py-4 font-bold">Mã</th>
                        <th className="text-left px-6 py-4 font-bold">Lớp</th>
                        <th className="text-left px-6 py-4 font-bold">Điểm</th>
                        <th className="text-left px-6 py-4 font-bold">Số câu</th>
                        <th className="text-left px-6 py-4 font-bold">Trạng thái</th>
                        <th className="text-left px-6 py-4 font-bold">Thời gian nộp</th>
                        <th className="text-left px-6 py-4 font-bold">Hành động</th>
                    </tr>
                    </thead>

                    <tbody>
                      {submissions.map((item) => (
                        <tr key={item.id} className="border-b last:border-b-0 hover:bg-blue-50">
                          <td className="px-6 py-4 font-semibold text-gray-800">
                            {item.username || 'Không rõ'}
                          </td>
                          <td className="px-6 py-4 text-gray-600">
                            {item.public_user_id || '---'}
                          </td>
                          <td className="px-6 py-4 text-gray-600">
                            {item.class_name || '---'}
                          </td>
                          <td className="px-6 py-4">
                            <span className="font-black text-blue-700 text-lg">
                              {item.score}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-gray-600">
                            {item.total_questions}
                          </td>
                          <td className="px-6 py-4">
                            <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-bold">
                              {item.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-gray-600">
                            {item.submitted_at
                              ? new Date(item.submitted_at).toLocaleString()
                              : '---'}
                          </td>
                          <td className="px-6 py-4">
                            <button
                                onClick={() => navigate(`/teacher-submission-detail/${item.id}`)}
                                className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-2xl font-bold"
                            >
                                Xem chi tiết
                            </button>
                            </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  </div>);
}
