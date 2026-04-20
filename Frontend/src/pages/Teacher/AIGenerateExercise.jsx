import React, { useEffect, useMemo, useState } from 'react';
import TeacherSidebar from '../../components/Common/TeacherSidebar';
import { showToast } from "../../../util/toast";

export default function AIGenerateExercise() {
  const [gradeLevel, setGradeLevel] = useState('1');
  const [topic, setTopic] = useState('');
  const [difficulty, setDifficulty] = useState('Dễ');
  const [questionCount, setQuestionCount] = useState(3);
  const [loading, setLoading] = useState(false);
  const [exercise, setExercise] = useState(null);
  const [classrooms, setClassrooms] = useState([]);
  const [classroomId, setClassroomId] = useState('');
  const [saving, setSaving] = useState(false);

  const teacherName = localStorage.getItem('username') || 'Giáo viên';
  const teacherId = localStorage.getItem('userId');

  useEffect(() => {
    if (!teacherId) {
      setClassrooms([]);
      return;
    }

    const token = localStorage.getItem('token');

    fetch('http://localhost:5000/api/teacher/classes', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then(async (res) => {
        const data = await res.json();
        if (res.ok && Array.isArray(data)) {
          setClassrooms(data);
        } else {
          setClassrooms([]);
        }
      })
      .catch((err) => {
        console.error('Lỗi lấy classrooms:', err);
        setClassrooms([]);
      });
  }, [teacherId]);

  useEffect(() => {
    setClassroomId('');
  }, [gradeLevel]);

  const filteredClassrooms = classrooms.filter(
    (c) => String(c.grade_level) === String(gradeLevel)
  );

  const selectedClassroom = useMemo(() => {
    return filteredClassrooms.find((c) => String(c.id) === String(classroomId));
  }, [filteredClassrooms, classroomId]);

  const getDifficultyStyle = (value) => {
    const difficultyText = (value || '').toLowerCase();

    if (difficultyText.includes('dễ')) {
      return 'bg-green-50 text-green-600 border-green-100';
    }
    if (difficultyText.includes('trung')) {
      return 'bg-yellow-50 text-yellow-600 border-yellow-100';
    }
    if (difficultyText.includes('khó')) {
      return 'bg-red-50 text-red-500 border-red-100';
    }

    return 'bg-blue-50 text-blue-600 border-blue-100';
  };

  const handleGenerate = async () => {
    if (!topic.trim()) {
      showToast('Giáo viên hãy nhập chủ đề trước nhé!');
      return;
    }

    try {
      setLoading(true);
      setExercise(null);

      const token = localStorage.getItem('token');

      const response = await fetch('http://localhost:5000/api/teacher/generate-exercise', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          gradeLevel,
          topic,
          difficulty,
          questionCount
        })
      });

      const data = await response.json();

      if (response.ok) {
        setExercise(data);
      } else {
        showToast(data.message || 'Có lỗi khi tạo bài tập!');
      }
    } catch (error) {
      console.error(error);
      showToast('Không thể kết nối tới backend!');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveExercise = async () => {
    if (!exercise) {
      showToast('Chưa có bài tập để lưu!');
      return;
    }

    if (!classroomId) {
      showToast('Giáo viên hãy chọn lớp trước nhé!');
      return;
    }

    try {
      setSaving(true);
      const token = localStorage.getItem('token');

      const response = await fetch('http://localhost:5000/api/teacher/save-exercise', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          title: exercise.title,
          gradeLevel: exercise.gradeLevel,
          topic: exercise.topic,
          difficulty: exercise.difficulty,
          classroomId,
          questions: exercise.questions || []
        })
      });

      const data = await response.json();

      if (response.ok) {
        showToast('Lưu bài tập thành công!');
      } else {
        showToast(data.message || 'Không thể lưu bài tập!');
      }
    } catch (error) {
      console.error(error);
      showToast('Lỗi kết nối khi lưu bài tập!');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-[#EEF5FF]">
      <TeacherSidebar />

      <main className="flex-1 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="relative overflow-hidden rounded-[36px] bg-gradient-to-r from-[#2D5AAB] to-[#4B7BE5] text-white p-8 md:p-10 shadow-xl mb-8">
            <div className="absolute -top-10 right-0 w-52 h-52 bg-white/10 rounded-full blur-sm"></div>
            <div className="absolute bottom-0 left-1/3 w-36 h-36 bg-white/10 rounded-full blur-sm"></div>

            <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
              <div>
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/15 font-bold text-sm mb-4">
                  🤖 AI Exercise Generator
                </div>

                <h1 className="text-4xl md:text-5xl font-black mb-4">
                  AI tạo bài tập cho giáo viên
                </h1>

                <p className="text-white/90 text-lg leading-8 max-w-3xl">
                  Giáo viên {teacherName} có thể chọn khối lớp, lớp học, chủ đề và độ khó
                  để AI tạo bài tập nhanh hơn, sau đó lưu vào hệ thống để giao cho học sinh.
                </p>
              </div>

              <div className="self-start lg:self-auto bg-white/15 backdrop-blur-sm rounded-[28px] px-6 py-5 border border-white/20 min-w-[260px]">
                <p className="text-sm uppercase tracking-widest font-bold text-white/80 mb-2">
                  Trạng thái AI
                </p>
                <p className="text-2xl font-black">
                  {loading ? 'Đang tạo bài...' : 'Sẵn sàng hỗ trợ'}
                </p>
                <p className="text-white/80 mt-2">
                  Tạo nhanh bộ câu hỏi phù hợp với khối lớp và chủ đề giáo viên chọn.
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-[430px_1fr] gap-8">
            <section className="bg-white rounded-[32px] border border-blue-100 shadow-sm p-6 md:p-7 h-fit">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-14 h-14 rounded-3xl bg-blue-50 flex items-center justify-center text-3xl shadow-sm">
                  ✍️
                </div>
                <div>
                  <h2 className="text-2xl font-black text-gray-800">Thiết lập bài tập</h2>
                  <p className="text-gray-500">Nhập thông tin để AI tạo bộ câu hỏi.</p>
                </div>
              </div>

              <div className="space-y-5">
                <div>
                  <label className="block font-black text-gray-700 mb-2">Khối lớp</label>
                  <select
                    value={gradeLevel}
                    onChange={(e) => setGradeLevel(e.target.value)}
                    className="w-full border border-gray-200 bg-[#F8FAFC] rounded-2xl px-4 py-3 font-bold text-gray-700 outline-none focus:border-blue-400"
                  >
                    <option value="1">Lớp 1</option>
                    <option value="2">Lớp 2</option>
                    <option value="3">Lớp 3</option>
                    <option value="4">Lớp 4</option>
                    <option value="5">Lớp 5</option>
                  </select>
                </div>

                <div>
                  <label className="block font-black text-gray-700 mb-2">Lớp học</label>
                  <select
                    value={classroomId}
                    onChange={(e) => setClassroomId(e.target.value)}
                    className="w-full border border-gray-200 bg-[#F8FAFC] rounded-2xl px-4 py-3 font-bold text-gray-700 outline-none focus:border-blue-400"
                  >
                    <option value="">-- Chọn lớp --</option>
                    {filteredClassrooms.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.class_name} {c.class_code ? `(${c.class_code})` : ''}
                      </option>
                    ))}
                  </select>

                  {filteredClassrooms.length === 0 && (
                    <p className="text-sm text-orange-500 font-medium mt-2">
                      Giáo viên chưa có lớp nào thuộc khối này.
                    </p>
                  )}
                </div>

                <div>
                  <label className="block font-black text-gray-700 mb-2">Chủ đề</label>
                  <input
                    type="text"
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    placeholder="Ví dụ: phép cộng trong phạm vi 10"
                    className="w-full border border-gray-200 bg-[#F8FAFC] rounded-2xl px-4 py-3 font-medium text-gray-700 outline-none focus:border-blue-400"
                  />
                </div>

                <div>
                  <label className="block font-black text-gray-700 mb-2">Độ khó</label>
                  <select
                    value={difficulty}
                    onChange={(e) => setDifficulty(e.target.value)}
                    className="w-full border border-gray-200 bg-[#F8FAFC] rounded-2xl px-4 py-3 font-bold text-gray-700 outline-none focus:border-blue-400"
                  >
                    <option>Dễ</option>
                    <option>Trung bình</option>
                    <option>Khó</option>
                  </select>
                </div>

                <div>
                  <label className="block font-black text-gray-700 mb-2">Số câu</label>
                  <select
                    value={questionCount}
                    onChange={(e) => setQuestionCount(Number(e.target.value))}
                    className="w-full border border-gray-200 bg-[#F8FAFC] rounded-2xl px-4 py-3 font-bold text-gray-700 outline-none focus:border-blue-400"
                  >
                    <option value={3}>3 câu</option>
                    <option value={5}>5 câu</option>
                    <option value={10}>10 câu</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-blue-50 rounded-2xl p-4 border border-blue-100">
                    <p className="text-xs text-gray-500 mb-1">Khối đang chọn</p>
                    <p className="text-xl font-black text-blue-700">Lớp {gradeLevel}</p>
                  </div>

                  <div className="bg-green-50 rounded-2xl p-4 border border-green-100">
                    <p className="text-xs text-gray-500 mb-1">Số câu hỏi</p>
                    <p className="text-xl font-black text-green-600">{questionCount} câu</p>
                  </div>
                </div>

                <button
                  onClick={handleGenerate}
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:opacity-95 text-white py-4 rounded-2xl font-black text-lg disabled:bg-blue-300 shadow-md transition"
                >
                  {loading ? 'AI đang tạo bài...' : 'Tạo bài tập bằng AI'}
                </button>
              </div>
            </section>

            <section className="bg-white rounded-[32px] shadow-sm p-6 md:p-8 border border-yellow-100 min-h-[760px]">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
                <div>
                  <h2 className="text-3xl font-black text-orange-500">Kết quả bài tập</h2>
                  <p className="text-gray-500 mt-1">
                    AI sẽ tạo bài tập theo thông tin giáo viên đã nhập.
                  </p>
                </div>

                <div className="flex flex-wrap gap-3">
                  <span className="px-4 py-2 rounded-full bg-blue-50 text-blue-700 border border-blue-100 font-bold text-sm">
                    Khối: Lớp {gradeLevel}
                  </span>
                  <span
                    className={`px-4 py-2 rounded-full border font-bold text-sm ${getDifficultyStyle(
                      difficulty
                    )}`}
                  >
                    Độ khó: {difficulty}
                  </span>
                </div>
              </div>

              {!exercise ? (
                <div className="h-full min-h-[620px] flex flex-col items-center justify-center text-center">
                  <div className="text-7xl mb-4">🧠</div>
                  <h3 className="text-3xl font-black text-blue-700 mb-3">
                    Chưa có bài tập nào được tạo
                  </h3>
                  <p className="text-gray-500 text-lg leading-8 max-w-2xl">
                    Giáo viên hãy chọn khối, lớp, chủ đề và độ khó, sau đó bấm tạo bài để AI hỗ trợ sinh câu hỏi nhé.
                  </p>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="bg-gradient-to-r from-blue-50 to-white border border-blue-100 rounded-[24px] p-5">
                    <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                      <div>
                        <h3 className="text-2xl font-black text-blue-700">
                          {exercise.title}
                        </h3>
                        <div className="flex flex-wrap gap-3 mt-3">
                          <span className="px-4 py-2 rounded-full bg-blue-50 text-blue-700 border border-blue-100 font-bold text-sm">
                            Khối: Lớp {exercise.gradeLevel}
                          </span>

                          <span className="px-4 py-2 rounded-full bg-purple-50 text-purple-600 border border-purple-100 font-bold text-sm">
                            Chủ đề: {exercise.topic}
                          </span>

                          <span
                            className={`px-4 py-2 rounded-full border font-bold text-sm ${getDifficultyStyle(
                              exercise.difficulty
                            )}`}
                          >
                            Độ khó: {exercise.difficulty}
                          </span>

                          <span className="px-4 py-2 rounded-full bg-orange-50 text-orange-600 border border-orange-100 font-bold text-sm">
                            Lớp học: {selectedClassroom?.class_name || 'Chưa chọn'}
                          </span>
                        </div>
                      </div>

                      <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm min-w-[130px]">
                        <p className="text-sm text-gray-500">Tổng số câu</p>
                        <p className="text-3xl font-black text-green-600">
                          {exercise.questions?.length || 0}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {exercise.questions?.map((q, index) => (
                      <div
                        key={index}
                        className="bg-[#F8FAFC] border border-gray-100 rounded-[24px] p-5 shadow-sm"
                      >
                        <div className="flex items-start gap-4">
                          <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center font-black text-lg shrink-0 shadow-sm">
                            {index + 1}
                          </div>

                          <div className="flex-1">
                            <p className="font-black text-gray-800 text-lg leading-8">
                              {q.question}
                            </p>

                            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div className="bg-green-50 border border-green-100 rounded-2xl p-4">
                                <p className="text-sm text-gray-500 mb-1">Đáp án</p>
                                <p className="text-green-700 font-black text-lg">
                                  {q.answer}
                                </p>
                              </div>

                              <div className="bg-white border border-gray-100 rounded-2xl p-4">
                                <p className="text-sm text-gray-500 mb-1">Giải thích</p>
                                <p className="text-gray-700 leading-7">
                                  {q.explanation}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <button
                    onClick={handleSaveExercise}
                    disabled={saving}
                    className="w-full mt-2 bg-gradient-to-r from-green-600 to-green-500 hover:opacity-95 text-white py-4 rounded-2xl font-black text-lg disabled:bg-green-300 shadow-md transition"
                  >
                    {saving ? 'Đang lưu bài tập...' : 'Lưu bài tập này'}
                  </button>
                </div>
              )}
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}