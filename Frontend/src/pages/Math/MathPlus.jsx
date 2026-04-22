import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import StudentSidebar from '../../components/Common/StudentSidebar';
import Confetti from 'react-confetti';
import { classConfigs } from './classConfigs';

export default function MathPlus() {
  const { lessonId } = useParams();
  const navigate = useNavigate();

  const [topic, setTopic] = useState('');
  const [questionText, setQuestionText] = useState('');
  const [correctAnswer, setCorrectAnswer] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const [answer, setAnswer] = useState('');
  const [hearts, setHearts] = useState(5);
  const [score, setScore] = useState(0);
  const maxScore = 5;

  const [miluAdvice, setMiluAdvice] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [showSummary, setShowSummary] = useState(false);
  const [isWin, setIsWin] = useState(false);

  // ✅ Lấy gradeLevel làm chuẩn chính
  const storedGradeLevel = String(localStorage.getItem('gradeLevel') || '1');
  const storedClassName = localStorage.getItem('className') || `Lớp ${storedGradeLevel}`;

  const userClass = storedClassName;
  const config =
    classConfigs[userClass] ||
    classConfigs[`Lớp ${storedGradeLevel}`] ||
    classConfigs['Lớp 1'];

  const speak = (text) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const textWithoutEmoji = String(text || '').replace(/[\p{Extended_Pictographic}\uFE0F]/gu, '');
      const utterance = new SpeechSynthesisUtterance(textWithoutEmoji);
      utterance.lang = 'vi-VN';
      window.speechSynthesis.speak(utterance);
    }
  };

  const normalizeAnswerText = (value) => {
    if (value === null || value === undefined) return '';
    return String(value)
      .trim()
      .toLowerCase()
      .replace(/[.,!?;:]/g, '')
      .replace(/\s+/g, ' ');
  };

  const checkAnswerSmart = (userAnswer, correctAnswer) => {
    const user = String(userAnswer ?? '').trim();
    const correct = String(correctAnswer ?? '').trim();

    if (!user || !correct) return false;

    const userNum = parseFloat(user.replace(',', '.').match(/-?\d+(\.\d+)?/)?.[0] ?? '');
    const correctNum = parseFloat(correct.replace(',', '.').match(/-?\d+(\.\d+)?/)?.[0] ?? '');

    const bothHaveNumber = !Number.isNaN(userNum) && !Number.isNaN(correctNum);
    if (bothHaveNumber) {
      return userNum === correctNum;
    }

    return normalizeAnswerText(user) === normalizeAnswerText(correct);
  };

  const saveResultToDatabase = async (finalStatus, currentScore, currentHearts) => {
    try {
      const studentId = localStorage.getItem('userId');

      if (!studentId) {
        console.error('Không tìm thấy studentId trong localStorage');
        return;
      }

      const response = await fetch('https://wed-edu.onrender.com/api/results/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentId,
          lessonId,
          score: currentScore,
          heartsRemaining: currentHearts,
          status: finalStatus,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        console.error('Lỗi lưu kết quả:', data.message);
      } else {
        console.log('✅ Lưu kết quả thành công:', data.message);
      }
    } catch (error) {
      console.error('❌ Lỗi kết nối khi lưu kết quả:', error);
    }
  };

  // =============================
  // MAP BÀI HỌC -> DẠNG TOÁN
  // =============================
  const lessonTypeMap = {
    '1-1': {
      type: 'counting',
      label: 'Đếm số từ 1 đến 5',
      rule: 'Chỉ tạo bài đếm số, nhận biết số lượng, không dùng phép cộng.',
    },
    '1-2': {
      type: 'comparison',
      label: 'Nhiều hơn, ít hơn, bằng nhau',
      rule: 'Chỉ tạo bài so sánh số lượng: nhiều hơn, ít hơn, bằng nhau.',
    },
    '1-3': {
      type: 'addition10',
      label: 'Phép cộng trong phạm vi 10',
      rule: 'Chỉ tạo bài phép cộng đơn giản trong phạm vi 10.',
    },
    '2-1': {
      type: 'addition20',
      label: 'Phép cộng trong phạm vi 20',
      rule: 'Chỉ tạo bài phép cộng trong phạm vi 20.',
    },
    '2-2': {
      type: 'subtraction20',
      label: 'Phép trừ trong phạm vi 20',
      rule: 'Chỉ tạo bài phép trừ trong phạm vi 20.',
    },
    '3-1': {
      type: 'multiplication',
      label: 'Phép nhân cơ bản',
      rule: 'Chỉ tạo bài phép nhân cơ bản theo nhóm bằng nhau.',
    },
    '3-2': {
      type: 'division',
      label: 'Phép chia cơ bản',
      rule: 'Chỉ tạo bài phép chia cơ bản theo kiểu chia đều.',
    },
    '4-1': {
      type: 'fractions',
      label: 'Phân số cơ bản',
      rule: 'Chỉ tạo bài phân số cơ bản, nhận biết tử số và mẫu số.',
    },
    '4-2': {
      type: 'rectangle_perimeter',
      label: 'Chu vi hình chữ nhật',
      rule: 'Chỉ tạo bài tính chu vi hình chữ nhật theo công thức (dài + rộng) × 2.',
    },
    '5-1': {
      type: 'decimals',
      label: 'Số thập phân cơ bản',
      rule: 'Chỉ tạo bài tính toán số thập phân cơ bản.',
    },
    '5-2': {
      type: 'unit_conversion',
      label: 'Đổi đơn vị đo',
      rule: 'Chỉ tạo bài đổi đơn vị đo như m-cm, kg-g, giờ-phút.',
    },
  };

  // ✅ Dùng gradeLevel chuẩn, không parse từ className nữa
  const gradeNumber = storedGradeLevel;
  const lessonKey = `${gradeNumber}-${lessonId}`;
  const currentLesson = lessonTypeMap[lessonKey] || lessonTypeMap['1-1'];

  const generateProblem = async (selectedTopic = topic) => {
    if (!selectedTopic) {
      speak('Bé hãy chọn một chủ đề bé thích nhé!');
      return;
    }

    setIsGenerating(true);
    setAnswer('');
    setMiluAdvice('');
    setQuestionText(`🤖 Milu đang tạo bài "${currentLesson.label}" cho bé...`);

    try {
      const response = await fetch('https://wed-edu.onrender.com/api/ai/generate-math', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          className: userClass,
          gradeLevel: storedGradeLevel,
          topic: selectedTopic,
          lessonType: currentLesson.type,
          lessonLabel: currentLesson.label,
          lessonRule: currentLesson.rule,
          lessonId,
        }),
      });

      const data = await response.json();
      setQuestionText(data.question);
      setCorrectAnswer(data.answer);

      speak(data.question);
    } catch (error) {
      console.error('Lỗi sinh đề AI:', error);
      setQuestionText('Ôi, mạng bị chập chờn rồi. Bé thử lại nha!');
    } finally {
      setIsGenerating(false);
    }
  };

  const checkResult = async () => {
    if (!answer) return;

    const isCorrect = checkAnswerSmart(answer, correctAnswer);

    console.log('Bé trả lời:', answer);
    console.log('Đáp án đúng từ AI:', correctAnswer);
    console.log('Kết quả so sánh:', isCorrect);

    if (isCorrect) {
      const newScore = score + 1;
      setScore(newScore);
      window.speechSynthesis.cancel();

      if (newScore >= maxScore) {
        setIsWin(true);
        setShowSummary(true);
        speak('Chúc mừng bé đã hoàn thành xuất sắc bài học!');
        await saveResultToDatabase('Hoàn thành', newScore, hearts);
      } else {
        generateProblem(topic);
      }
    } else {
      const newHearts = hearts - 1;
      setHearts(newHearts);
      setIsAiLoading(true);
      window.speechSynthesis.cancel();

      if (newHearts <= 0) {
        setIsWin(false);
        setShowSummary(true);
        speak('Ôi hết tim mất rồi! Lần sau bé cố gắng hơn nhé.');
        await saveResultToDatabase('Chưa đạt', score, newHearts);
        setIsAiLoading(false);
      } else {
        try {
          const response = await fetch('https://wed-edu.onrender.com/api/ai/explain', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              question_text: questionText,
              user_answer: answer,
              correct_answer: correctAnswer,
            }),
          });

          const data = await response.json();
          setMiluAdvice(data.advice);
          speak(data.advice);
        } catch (error) {
          setMiluAdvice('Chà, câu này hơi khó, bé nháp lại cẩn thận nhé!');
        } finally {
          setIsAiLoading(false);
        }
      }
    }
  };

  const renderAIExercise = () => {
    return (
      <div className="flex flex-col items-center w-full">
        {!questionText && (
          <div className="mb-8 w-full animate-fade-in">
            <div className="mb-6 bg-blue-50 border border-blue-100 rounded-2xl px-5 py-4 text-center">
              <p className="text-sm text-gray-500 mb-1">Dạng bài hiện tại</p>
              <p className="text-xl font-black text-blue-700">{currentLesson.label}</p>
            </div>

            <h3 className="text-xl font-bold text-gray-600 mb-4">✨ Bé muốn học toán về chủ đề gì nào?</h3>

            <div className="flex flex-wrap justify-center gap-3 mb-6">
              {['🦸‍♂️ Siêu nhân', '👸 Công chúa Elsa', '🦖 Khủng long', '🚗 Ô tô đua', '🐶 Động vật', '🍬 Bánh kẹo'].map((item) => (
                <button
                  key={item}
                  onClick={() => setTopic(item)}
                  className={`px-4 py-2 rounded-full font-bold transition-all ${
                    topic === item
                      ? 'bg-orange-500 text-white shadow-lg scale-105'
                      : 'bg-orange-100 text-orange-600 hover:bg-orange-200'
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>

            <div className="flex justify-center gap-2">
              <input
                type="text"
                placeholder="Hoặc bé tự gõ vào đây nhé..."
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                className="px-6 py-3 rounded-full border-2 border-orange-200 focus:border-orange-500 focus:outline-none w-64 text-center font-medium"
              />
              <button
                onClick={() => generateProblem(topic)}
                disabled={isGenerating}
                className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-3 rounded-full font-bold shadow-md transition-all active:scale-95 disabled:opacity-50"
              >
                Bắt đầu phép màu! 🪄
              </button>
            </div>
          </div>
        )}

        {questionText && (
          <div className="flex flex-col items-center gap-8 w-full animate-fade-in">
            <div className="bg-blue-50 p-8 rounded-3xl border-2 border-blue-200 w-full shadow-inner relative">
              <p className={`text-2xl font-bold ${config.textColor} leading-relaxed`}>
                {questionText}
              </p>

              <button
                onClick={() => speak(questionText)}
                className="absolute -top-6 -right-6 bg-yellow-400 hover:bg-yellow-500 text-white w-14 h-14 rounded-full shadow-lg transition-transform hover:scale-110 active:scale-95 text-3xl flex items-center justify-center border-4 border-white"
                title="Nghe lại đề bài"
              >
                🔊
              </button>
            </div>

            {!isGenerating && (
              <div className="flex items-center gap-4">
                <span className="text-3xl font-black text-gray-700">Đáp án:</span>
                <input
                  type="text"
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && checkResult()}
                  className="w-40 border-b-8 border-orange-300 focus:outline-none text-center text-4xl bg-transparent font-black text-blue-600"
                  autoFocus
                  placeholder="..."
                />
              </div>
            )}

            {!isGenerating && (
              <button
                onClick={() => checkResult()}
                className="mt-2 bg-orange-500 text-white px-12 py-5 rounded-full font-bold text-xl hover:scale-105 transition-all shadow-lg active:scale-95"
              >
                Kiểm tra kết quả 🚀
              </button>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className={`flex min-h-screen ${config.themeColor} relative transition-all duration-700`}>
      <StudentSidebar />
      <main className="flex-1 p-8 flex flex-col items-center">
        <div className="w-full max-w-2xl flex justify-between items-center mb-10 bg-white p-4 rounded-2xl shadow-sm">
          <div className="flex gap-2 text-2xl">
            {'❤️'.repeat(hearts)}
            {'🖤'.repeat(5 - hearts)}
          </div>
          <div className="w-64 bg-gray-200 h-4 rounded-full overflow-hidden">
            <div
              className="bg-green-500 h-full transition-all duration-500"
              style={{ width: `${(score / maxScore) * 100}%` }}
            ></div>
          </div>
          <span className="font-bold text-orange-600">{score}/{maxScore} ⭐</span>
        </div>

        <div className="bg-white p-12 rounded-[50px] shadow-2xl text-center border-4 border-orange-200 relative w-full max-w-3xl min-h-[400px] flex items-center justify-center">
          {renderAIExercise()}
        </div>

        {(miluAdvice || isAiLoading) && !showSummary && (
          <div className="fixed bottom-10 right-10 flex items-end gap-4 transition-all duration-500">
            <div className="bg-white p-6 rounded-[30px] shadow-2xl border-4 border-blue-400 max-w-sm relative mb-10">
              {isAiLoading ? (
                <p className="text-blue-500 font-bold">Milu đang phân tích lỗi sai... 💭</p>
              ) : (
                <>
                  <p className="text-gray-700 font-medium italic">"{miluAdvice}"</p>
                  <button
                    onClick={() => {
                      setMiluAdvice('');
                      window.speechSynthesis.cancel();
                    }}
                    className="mt-4 text-xs font-bold text-blue-500 uppercase"
                  >
                    Con hiểu rồi ạ! ✨
                  </button>
                </>
              )}
              <div className="absolute bottom-[-20px] right-10 w-0 h-0 border-l-[15px] border-l-transparent border-t-[20px] border-t-white border-r-[15px] border-r-transparent"></div>
            </div>
            <div className="text-8xl drop-shadow-lg">{config.mascot.split(' ')[0]}</div>
          </div>
        )}
      </main>

      {showSummary && (
        <div className="fixed inset-0 bg-black/60 z-[100] flex items-center justify-center backdrop-blur-sm animate-fade-in">
          {isWin && (
            <Confetti
              width={window.innerWidth}
              height={window.innerHeight}
              recycle={false}
              numberOfPieces={600}
              gravity={0.15}
            />
          )}

          <div className="bg-white p-10 rounded-[50px] max-w-md w-full text-center shadow-2xl border-8 border-blue-100 flex flex-col items-center z-10">
            <div className="text-8xl mb-6">{isWin ? '🏆' : '🤖'}</div>
            <h1 className="text-4xl font-black mb-4 text-orange-500">
              {isWin ? 'Tuyệt vời quá!' : 'Cố gắng lên nhé!'}
            </h1>
            <div className="flex gap-4 w-full mt-6">
              <button
                onClick={() => window.location.reload()}
                className="flex-1 bg-orange-100 py-4 rounded-full font-bold"
              >
                🔄 Thử lại
              </button>
              <button
                onClick={() => navigate('/student-dashboard')}
                className="flex-1 bg-blue-600 text-white py-4 rounded-full font-bold"
              >
                Trở về 🏠
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
