import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import StudentSidebar from '../../components/Common/StudentSidebar';

export default function LessonDetail() {
  const navigate = useNavigate();
  const { id } = useParams();
  const gradeLevel = String(localStorage.getItem('gradeLevel') || '1');

  const [answers, setAnswers] = useState({});

  const speak = (text) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'vi-VN';
      utterance.rate = 0.92;
      window.speechSynthesis.speak(utterance);
    }
  };

  const setAnswer = (key, value) => {
    setAnswers((prev) => ({ ...prev, [key]: value }));
  };

  useEffect(() => {
    const welcomeMap = {
      '1-1': 'Chào bé yêu! Hôm nay mình cùng khám phá các số từ một đến năm nhé.',
      '1-2': 'Milu chào bé! Hôm nay mình học nhiều hơn, ít hơn và bằng nhau nhé.',
      '1-3': 'Bé sẵn sàng chưa? Hôm nay mình học phép cộng đơn giản nhé.',
      '2-1': 'Chào bé! Hôm nay mình học phép cộng trong phạm vi hai mươi.',
      '2-2': 'Cùng Milu học phép trừ trong phạm vi hai mươi nhé.',
      '3-1': 'Hôm nay bé sẽ làm quen với phép nhân cơ bản.',
      '3-2': 'Cùng học phép chia cơ bản thật vui nhé.',
      '4-1': 'Bé cùng Milu khám phá phân số cơ bản nhé.',
      '4-2': 'Hôm nay mình học cách tính chu vi hình chữ nhật.',
      '5-1': 'Bé cùng học số thập phân cơ bản nhé.',
      '5-2': 'Hôm nay mình học đổi đơn vị đo đơn giản.'
    };

    speak(welcomeMap[`${gradeLevel}-${id}`] || 'Chào bé! Cùng bắt đầu bài học nhé.');
  }, [gradeLevel, id]);

  const lessonMeta = useMemo(() => {
    const map = {
      '1-1': 'Bài 1: Khám phá các số 1, 2, 3, 4, 5',
      '1-2': 'Bài 2: Nhiều hơn, ít hơn, bằng nhau',
      '1-3': 'Bài 3: Phép cộng trong phạm vi 10',
      '2-1': 'Bài 1: Phép cộng trong phạm vi 20',
      '2-2': 'Bài 2: Phép trừ trong phạm vi 20',
      '3-1': 'Bài 1: Phép nhân cơ bản',
      '3-2': 'Bài 2: Phép chia cơ bản',
      '4-1': 'Bài 1: Phân số cơ bản',
      '4-2': 'Bài 2: Chu vi hình chữ nhật',
      '5-1': 'Bài 1: Số thập phân cơ bản',
      '5-2': 'Bài 2: Đổi đơn vị đo'
    };

    return map[`${gradeLevel}-${id}`] || 'Bài học đang được cập nhật';
  }, [gradeLevel, id]);

  const renderOptionButtons = (questionKey, options, correctValue, successText, failText, color = 'blue') => {
    const active = answers[questionKey];
    const colorMap = {
      blue: {
        base: 'hover:border-blue-400 hover:text-blue-500',
        correct: 'bg-green-500 text-white border-green-500',
        wrong: 'bg-red-500 text-white border-red-500'
      },
      orange: {
        base: 'hover:border-orange-400 hover:text-orange-500',
        correct: 'bg-green-500 text-white border-green-500',
        wrong: 'bg-red-500 text-white border-red-500'
      },
      purple: {
        base: 'hover:border-purple-400 hover:text-purple-500',
        correct: 'bg-green-500 text-white border-green-500',
        wrong: 'bg-red-500 text-white border-red-500'
      }
    };

    return (
      <div className="flex flex-wrap gap-3 mt-4">
        {options.map((opt) => (
          <button
            key={opt}
            onClick={(e) => {
              e.stopPropagation();
              setAnswer(questionKey, opt);
              if (String(opt) === String(correctValue)) {
                speak(successText);
              } else {
                speak(failText);
              }
            }}
            className={`min-w-[52px] h-[52px] px-4 rounded-xl border-2 shadow-sm text-lg font-bold transition-all hover:scale-105 active:scale-95 ${
              active === opt
                ? String(opt) === String(correctValue)
                  ? colorMap[color].correct
                  : colorMap[color].wrong
                : `bg-white text-gray-600 border-gray-300 ${colorMap[color].base}`
            }`}
          >
            {opt}
          </button>
        ))}
      </div>
    );
  };

  // ==============================
  // LỚP 1
  // ==============================
  const renderGrade1Lesson1 = () => {
    const numbers = [
      { num: 1, text: 'một', blocks: 1, color: 'bg-blue-100' },
      { num: 2, text: 'hai', blocks: 2, color: 'bg-green-100' },
      { num: 3, text: 'ba', blocks: 3, color: 'bg-red-100' },
      { num: 4, text: 'bốn', blocks: 4, color: 'bg-orange-100' },
      { num: 5, text: 'năm', blocks: 5, color: 'bg-teal-100' },
    ];

    return (
      <div className="w-full max-w-3xl border-2 border-blue-400 rounded-3xl p-8 bg-white">
        <div className="mb-10">
          <h3 className="flex items-center gap-2 text-xl font-bold mb-6">
            <span className="text-2xl">👩‍🏫</span> Khám phá các số
            <button onClick={() => speak('Bé hãy cùng khám phá các số từ 1 đến 5 nhé')} className="ml-auto text-blue-500 text-2xl">
              🔊
            </button>
          </h3>

          <div className="space-y-6">
            {numbers.map((item) => (
              <div key={item.num} className="flex items-center gap-4 border-b border-dashed pb-4">
                <div
                  className="w-20 h-20 rounded-2xl bg-blue-50 border-2 border-blue-100 flex items-center justify-center text-4xl font-black text-blue-600 cursor-pointer"
                  onClick={() => speak(`Số ${item.text}`)}
                >
                  {item.num}
                </div>

                <div className={`flex gap-2 p-3 rounded-xl ${item.color}`}>
                  {[...Array(item.blocks)].map((_, i) => (
                    <div key={i} className="w-8 h-8 bg-yellow-400 border-2 border-yellow-600 rounded-md"></div>
                  ))}
                </div>

                <div className="ml-auto flex flex-col items-center w-24">
                  <span className="text-6xl font-black text-blue-500">{item.num}</span>
                  <span className="text-lg font-bold text-gray-400 uppercase">{item.text}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h3 className="flex items-center gap-2 text-xl font-bold mb-6">
            <span className="text-2xl">✍️</span> Bé tập viết số
          </h3>
          <div className="flex justify-around mb-8 flex-wrap gap-3">
            {[0, 1, 2, 3, 4, 5].map((n) => (
              <div
                key={n}
                onClick={() => speak(`Bé tập viết số ${n}`)}
                className="w-14 h-20 border-2 border-blue-100 flex items-center justify-center text-4xl text-gray-300 font-bold relative cursor-pointer hover:border-blue-400 hover:text-blue-500 rounded-xl transition-all shadow-sm bg-white"
              >
                {n}
                <span className="absolute bottom-1 text-xs text-red-400">✏️</span>
              </div>
            ))}
          </div>

          <div
            onClick={() => navigate(`/video/${id}`)}
            className="flex items-center justify-center gap-4 bg-blue-50 py-4 rounded-full cursor-pointer hover:bg-blue-100 transition shadow-inner group"
          >
            <span className="group-hover:text-blue-700 font-medium transition-colors">
              🎬 Bấm vào để xem hướng dẫn cách viết
            </span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                speak('Bấm vào đây để xem hướng dẫn cách viết số nhé');
              }}
              className="text-blue-500 text-xl"
            >
              🔊
            </button>
          </div>
        </div>
      </div>
    );
  };

  const renderGrade1Lesson2 = () => {
    return (
      <div className="w-full max-w-5xl flex flex-col gap-8">
        <div>
          <h3 className="flex items-center gap-2 text-2xl font-bold mb-6 text-blue-700">
            <span className="text-3xl">👩‍🏫</span> Khám phá
          </h3>

          <div className="space-y-6">
            <div className="flex items-center bg-white p-6 rounded-[30px] shadow-lg border border-blue-100 relative">
              <div className="w-1/2 flex flex-col items-start gap-4 text-6xl pl-10">
                <div className="flex items-center gap-2">🐸🐸🐸</div>
                <div className="flex items-center gap-2 text-5xl">🍃🍃</div>
              </div>
              <div className="w-1/2 pl-8 border-l-2 border-dashed border-blue-200">
                <p className="text-2xl text-gray-700 font-medium">Số ếch <strong className="text-blue-600">nhiều hơn</strong> số lá.</p>
                <p className="text-2xl text-gray-700 mt-2 font-medium">Số lá <strong className="text-red-500">ít hơn</strong> số ếch.</p>
              </div>
              <button onClick={() => speak('Số ếch nhiều hơn số lá. Số lá ít hơn số ếch.')} className="absolute bottom-4 right-6 text-3xl">
                🔊
              </button>
            </div>

            <div className="flex items-center bg-white p-6 rounded-[30px] shadow-lg border border-green-100 relative">
              <div className="w-1/2 flex flex-col items-start gap-4 text-6xl pl-10">
                <div className="flex items-center gap-2">🐰🐰🐰</div>
                <div className="flex items-center gap-2">🥕🥕🥕</div>
              </div>
              <div className="w-1/2 pl-8 border-l-2 border-dashed border-green-200">
                <p className="text-2xl text-gray-700 font-medium">Số thỏ <strong className="text-green-600">bằng</strong> số cà rốt.</p>
              </div>
              <button onClick={() => speak('Số thỏ bằng số cà rốt.')} className="absolute bottom-4 right-6 text-3xl">
                🔊
              </button>
            </div>
          </div>
        </div>

        <div>
          <h3 className="flex items-center gap-2 text-2xl font-bold mb-6 text-orange-600 mt-8">
            <span className="text-3xl">🙋‍♂️</span> Hoạt động nhỏ
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="border border-dashed border-orange-200 p-6 rounded-3xl flex flex-col items-center bg-orange-50 shadow-inner">
              <div className="flex justify-between w-full text-5xl mb-6">
                <div>🐞🐞<br />🐞</div>
                <div className="flex items-center justify-center w-16 h-16 border-2 border-dashed border-orange-300 mx-4 bg-white rounded-xl text-orange-500 font-black">
                  {answers.q1 || '?'}
                </div>
                <div>🐟🐟<br />🐟🐟</div>
              </div>

              {renderOptionButtons('q1', ['>', '=', '<'], '<', 'Giỏi quá! Ba bé hơn bốn.', 'Chưa đúng rồi, bé đếm lại xem nhé.', 'orange')}
            </div>

            <div className="border border-dashed border-green-200 p-6 rounded-3xl flex flex-col items-center bg-green-50 shadow-inner">
              <div className="flex justify-between w-full text-5xl mb-6">
                <div>🍎🍌<br />🍓</div>
                <div className="flex items-center justify-center w-16 h-16 border-2 border-dashed border-green-300 mx-4 bg-white rounded-xl text-green-500 font-black">
                  {answers.q2 || '?'}
                </div>
                <div>🎃🌽<br />🥒</div>
              </div>

              {renderOptionButtons('q2', ['>', '=', '<'], '=', 'Chính xác! Ba bằng ba.', 'Chưa đúng rồi, bé chọn lại nhé.', 'blue')}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderGrade1Lesson3 = () => {
    const cards = [
      { key: 'g1l3_1', text: '1 + 1', visual: '🍎🍏', correct: 2, options: [1, 2, 3] },
      { key: 'g1l3_2', text: '2 + 1', visual: '🍎🍎🍏', correct: 3, options: [2, 3, 4] },
      { key: 'g1l3_3', text: '3 + 1', visual: '🍎🍎🍎🍏', correct: 4, options: [3, 4, 5] },
      { key: 'g1l3_4', text: '1 + 4', visual: '🍎🍏🍏🍏🍏', correct: 5, options: [4, 5, 6] },
    ];

    return (
      <div className="w-full max-w-4xl flex flex-col gap-8">
        <div className="border border-blue-100 rounded-[30px] p-8 bg-white shadow-lg flex flex-col items-center relative">
          <div className="bg-blue-50 px-8 py-3 rounded-full text-blue-800 font-bold mb-6 border-2 border-blue-200 text-lg text-center">
            Gộp 3 quả bóng và 2 quả bóng được mấy quả bóng?
          </div>
          <div className="flex items-center gap-8 bg-red-50 px-10 py-6 rounded-3xl border border-dashed border-red-200 mb-6 shadow-inner">
            <div className="text-6xl">🔴🔴🔴</div>
            <div className="text-6xl">🔵🔵</div>
          </div>
          <div className="text-5xl font-black text-red-500 mb-2">3 + 2 = 5</div>
          <p className="text-2xl text-gray-700 font-medium">
            Ba cộng hai bằng năm.
          </p>
          <button onClick={() => speak('Ba cộng hai bằng năm.')} className="absolute bottom-6 right-6 text-3xl">
            🔊
          </button>
        </div>

        <div>
          <h3 className="flex items-center gap-2 text-2xl font-bold mb-6 text-orange-600 mt-8">
            <span className="text-3xl">🙋‍♂️</span> Hoạt động nhỏ
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {cards.map((card) => (
              <div key={card.key} className="flex flex-col border border-dashed border-orange-200 p-6 rounded-3xl bg-red-50 shadow-inner">
                <div className="flex items-center justify-between mb-4">
                  <div className="text-5xl">{card.visual}</div>
                  <div className="text-3xl font-bold text-gray-700 flex items-center gap-3">
                    {card.text} =
                    <span className={`flex items-center justify-center w-14 h-14 bg-white rounded-xl border-2 shadow-sm font-black text-4xl ${
                      answers[card.key] === card.correct
                        ? 'text-green-500 border-green-400'
                        : answers[card.key]
                        ? 'text-red-500 border-red-400'
                        : 'text-gray-400 border-gray-200'
                    }`}>
                      {answers[card.key] || '?'}
                    </span>
                  </div>
                </div>

                {renderOptionButtons(
                  card.key,
                  card.options,
                  card.correct,
                  'Giỏi quá! Bé trả lời đúng rồi.',
                  'Chưa đúng rồi, bé thử lại nhé.',
                  'orange'
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  // ==============================
  // LỚP 2
  // ==============================
  const renderGrade2Lesson1 = () => {
    const tasks = [
      { key: 'g2l1_1', expr: '8 + 5', correct: 13, visual: '🍎🍎🍎🍎🍎🍎🍎🍎 + 🍊🍊🍊🍊🍊' },
      { key: 'g2l1_2', expr: '7 + 6', correct: 13, visual: '🎈🎈🎈🎈🎈🎈🎈 + 🎈🎈🎈🎈🎈🎈' },
      { key: 'g2l1_3', expr: '9 + 4', correct: 13, visual: '🧸🧸🧸🧸🧸🧸🧸🧸🧸 + 🎁🎁🎁🎁' },
    ];

    return (
      <div className="w-full max-w-5xl space-y-8">
        <div className="bg-white rounded-[32px] border border-green-100 shadow-lg p-8">
          <h3 className="text-2xl font-black text-green-600 mb-4">🧮 Cộng trong phạm vi 20</h3>
          <p className="text-lg text-gray-600 leading-8">
            Khi cộng hai số, bé có thể đếm thêm hoặc tách số để tìm kết quả nhanh hơn.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6">
          {tasks.map((task) => (
            <div key={task.key} className="bg-white rounded-[28px] p-6 border border-green-100 shadow-sm">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <p className="text-3xl font-black text-green-700">{task.expr} = ?</p>
                  <p className="text-lg text-gray-500 mt-2">{task.visual}</p>
                </div>

                <div className={`w-16 h-16 rounded-2xl border-2 flex items-center justify-center text-3xl font-black ${
                  answers[task.key] === task.correct
                    ? 'border-green-400 text-green-600 bg-green-50'
                    : answers[task.key]
                    ? 'border-red-400 text-red-500 bg-red-50'
                    : 'border-gray-200 text-gray-400 bg-white'
                }`}>
                  {answers[task.key] || '?'}
                </div>
              </div>

              {renderOptionButtons(
                task.key,
                [11, 12, 13, 14],
                task.correct,
                'Chính xác! Bé cộng rất tốt.',
                'Chưa đúng rồi, bé thử đếm thêm nhé.',
                'blue'
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderGrade2Lesson2 = () => {
    const tasks = [
      { key: 'g2l2_1', expr: '15 - 4', correct: 11, visual: '15 viên kẹo bớt đi 4 viên' },
      { key: 'g2l2_2', expr: '18 - 6', correct: 12, visual: '18 quả bóng bớt đi 6 quả' },
      { key: 'g2l2_3', expr: '14 - 5', correct: 9, visual: '14 cái bút bớt đi 5 cái' },
    ];

    return (
      <div className="w-full max-w-5xl space-y-8">
        <div className="bg-white rounded-[32px] border border-orange-100 shadow-lg p-8">
          <h3 className="text-2xl font-black text-orange-600 mb-4">➖ Trừ trong phạm vi 20</h3>
          <p className="text-lg text-gray-600 leading-8">
            Phép trừ là bớt đi một phần. Bé hãy tưởng tượng mình lấy bớt đồ vật để tìm đáp án nhé.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6">
          {tasks.map((task) => (
            <div key={task.key} className="bg-white rounded-[28px] p-6 border border-orange-100 shadow-sm">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <p className="text-3xl font-black text-orange-600">{task.expr} = ?</p>
                  <p className="text-lg text-gray-500 mt-2">{task.visual}</p>
                </div>

                <div className={`w-16 h-16 rounded-2xl border-2 flex items-center justify-center text-3xl font-black ${
                  answers[task.key] === task.correct
                    ? 'border-green-400 text-green-600 bg-green-50'
                    : answers[task.key]
                    ? 'border-red-400 text-red-500 bg-red-50'
                    : 'border-gray-200 text-gray-400 bg-white'
                }`}>
                  {answers[task.key] || '?'}
                </div>
              </div>

              {renderOptionButtons(
                task.key,
                [9, 10, 11, 12],
                task.correct,
                'Giỏi lắm! Bé trừ đúng rồi.',
                'Bé thử lấy bớt đi rồi đếm lại nhé.',
                'orange'
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };

  // ==============================
  // LỚP 3
  // ==============================
  const renderGrade3Lesson1 = () => {
    const tasks = [
      { key: 'g3l1_1', expr: '2 × 3', correct: 6, visual: '2 nhóm, mỗi nhóm 3 ngôi sao' },
      { key: 'g3l1_2', expr: '4 × 2', correct: 8, visual: '4 nhóm, mỗi nhóm 2 quả bóng' },
      { key: 'g3l1_3', expr: '3 × 5', correct: 15, visual: '3 nhóm, mỗi nhóm 5 bông hoa' },
    ];

    return (
      <div className="w-full max-w-5xl space-y-8">
        <div className="bg-white rounded-[32px] border border-purple-100 shadow-lg p-8">
          <h3 className="text-2xl font-black text-purple-600 mb-4">✖️ Phép nhân cơ bản</h3>
          <p className="text-lg text-gray-600 leading-8">
            Phép nhân là cộng nhiều lần các nhóm bằng nhau. Bé hãy nhìn theo từng nhóm nhé.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6">
          {tasks.map((task) => (
            <div key={task.key} className="bg-white rounded-[28px] p-6 border border-purple-100 shadow-sm">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <p className="text-3xl font-black text-purple-600">{task.expr} = ?</p>
                  <p className="text-lg text-gray-500 mt-2">{task.visual}</p>
                </div>

                <div className={`w-16 h-16 rounded-2xl border-2 flex items-center justify-center text-3xl font-black ${
                  answers[task.key] === task.correct
                    ? 'border-green-400 text-green-600 bg-green-50'
                    : answers[task.key]
                    ? 'border-red-400 text-red-500 bg-red-50'
                    : 'border-gray-200 text-gray-400 bg-white'
                }`}>
                  {answers[task.key] || '?'}
                </div>
              </div>

              {renderOptionButtons(
                task.key,
                [6, 8, 10, 15],
                task.correct,
                'Đúng rồi! Bé làm phép nhân rất tốt.',
                'Bé đếm theo nhóm lại nhé.',
                'purple'
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderGrade3Lesson2 = () => {
    const tasks = [
      { key: 'g3l2_1', expr: '12 ÷ 3', correct: 4, visual: '12 cái kẹo chia đều cho 3 bạn' },
      { key: 'g3l2_2', expr: '10 ÷ 2', correct: 5, visual: '10 quả bóng chia đều cho 2 bạn' },
      { key: 'g3l2_3', expr: '15 ÷ 5', correct: 3, visual: '15 cái bút chia đều cho 5 bạn' },
    ];

    return (
      <div className="w-full max-w-5xl space-y-8">
        <div className="bg-white rounded-[32px] border border-sky-100 shadow-lg p-8">
          <h3 className="text-2xl font-black text-sky-600 mb-4">➗ Phép chia cơ bản</h3>
          <p className="text-lg text-gray-600 leading-8">
            Phép chia là chia đều. Bé hãy tưởng tượng chia thật đều cho từng bạn nhé.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6">
          {tasks.map((task) => (
            <div key={task.key} className="bg-white rounded-[28px] p-6 border border-sky-100 shadow-sm">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <p className="text-3xl font-black text-sky-600">{task.expr} = ?</p>
                  <p className="text-lg text-gray-500 mt-2">{task.visual}</p>
                </div>

                <div className={`w-16 h-16 rounded-2xl border-2 flex items-center justify-center text-3xl font-black ${
                  answers[task.key] === task.correct
                    ? 'border-green-400 text-green-600 bg-green-50'
                    : answers[task.key]
                    ? 'border-red-400 text-red-500 bg-red-50'
                    : 'border-gray-200 text-gray-400 bg-white'
                }`}>
                  {answers[task.key] || '?'}
                </div>
              </div>

              {renderOptionButtons(
                task.key,
                [3, 4, 5, 6],
                task.correct,
                'Chính xác! Bé chia đều rất giỏi.',
                'Bé thử chia đều lại nhé.',
                'blue'
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };

  // ==============================
  // LỚP 4
  // ==============================
  const renderGrade4Lesson1 = () => {
    const tasks = [
      { key: 'g4l1_1', question: 'Hình tròn được chia 4 phần bằng nhau, tô màu 1 phần là phân số nào?', correct: '1/4' },
      { key: 'g4l1_2', question: 'Có 2 phần được tô trong 5 phần bằng nhau. Phân số là gì?', correct: '2/5' },
      { key: 'g4l1_3', question: 'Có 3 phần được tô trong 4 phần bằng nhau. Phân số là gì?', correct: '3/4' },
    ];

    return (
      <div className="w-full max-w-5xl space-y-8">
        <div className="bg-white rounded-[32px] border border-pink-100 shadow-lg p-8">
          <h3 className="text-2xl font-black text-pink-600 mb-4">🍰 Phân số cơ bản</h3>
          <p className="text-lg text-gray-600 leading-8">
            Phân số cho biết một phần của cả hình. Tử số là số phần được lấy, mẫu số là tổng số phần bằng nhau.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6">
          {tasks.map((task) => (
            <div key={task.key} className="bg-white rounded-[28px] p-6 border border-pink-100 shadow-sm">
              <p className="text-xl font-bold text-gray-800 leading-8">{task.question}</p>

              <div className={`mt-5 w-20 h-20 rounded-2xl border-2 flex items-center justify-center text-2xl font-black ${
                answers[task.key] === task.correct
                  ? 'border-green-400 text-green-600 bg-green-50'
                  : answers[task.key]
                  ? 'border-red-400 text-red-500 bg-red-50'
                  : 'border-gray-200 text-gray-400 bg-white'
              }`}>
                {answers[task.key] || '?'}
              </div>

              {renderOptionButtons(
                task.key,
                ['1/4', '2/5', '3/4', '2/4'],
                task.correct,
                'Giỏi quá! Bé chọn đúng phân số rồi.',
                'Bé xem lại tử số và mẫu số nhé.',
                'purple'
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderGrade4Lesson2 = () => {
    const tasks = [
      { key: 'g4l2_1', length: 8, width: 4, correct: 24 },
      { key: 'g4l2_2', length: 10, width: 5, correct: 30 },
      { key: 'g4l2_3', length: 7, width: 3, correct: 20 },
    ];

    return (
      <div className="w-full max-w-5xl space-y-8">
        <div className="bg-white rounded-[32px] border border-yellow-100 shadow-lg p-8">
          <h3 className="text-2xl font-black text-yellow-600 mb-4">📐 Chu vi hình chữ nhật</h3>
          <p className="text-lg text-gray-600 leading-8">
            Chu vi hình chữ nhật được tính bằng công thức: (dài + rộng) × 2.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6">
          {tasks.map((task) => (
            <div key={task.key} className="bg-white rounded-[28px] p-6 border border-yellow-100 shadow-sm">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                <div>
                  <p className="text-2xl font-black text-yellow-600 mb-3">
                    Dài {task.length}m, rộng {task.width}m
                  </p>
                  <div className="w-56 h-32 border-4 border-yellow-400 rounded-xl bg-yellow-50 flex items-center justify-center text-lg font-bold text-yellow-700">
                    HCN
                  </div>
                </div>

                <div className={`w-20 h-20 rounded-2xl border-2 flex items-center justify-center text-3xl font-black ${
                  answers[task.key] === task.correct
                    ? 'border-green-400 text-green-600 bg-green-50'
                    : answers[task.key]
                    ? 'border-red-400 text-red-500 bg-red-50'
                    : 'border-gray-200 text-gray-400 bg-white'
                }`}>
                  {answers[task.key] || '?'}
                </div>
              </div>

              {renderOptionButtons(
                task.key,
                [20, 24, 30, 26],
                task.correct,
                'Chính xác! Bé tính chu vi đúng rồi.',
                'Bé thử cộng dài với rộng rồi nhân hai nhé.',
                'orange'
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };

  // ==============================
  // LỚP 5
  // ==============================
  const renderGrade5Lesson1 = () => {
    const tasks = [
      { key: 'g5l1_1', expr: '0.5 + 0.5', correct: '1' },
      { key: 'g5l1_2', expr: '2.5 + 1', correct: '3.5' },
      { key: 'g5l1_3', expr: '4.2 - 1.2', correct: '3' },
    ];

    return (
      <div className="w-full max-w-5xl space-y-8">
        <div className="bg-white rounded-[32px] border border-indigo-100 shadow-lg p-8">
          <h3 className="text-2xl font-black text-indigo-600 mb-4">🔢 Số thập phân cơ bản</h3>
          <p className="text-lg text-gray-600 leading-8">
            Khi tính với số thập phân, bé chú ý đặt các chữ số thẳng cột với dấu phẩy.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6">
          {tasks.map((task) => (
            <div key={task.key} className="bg-white rounded-[28px] p-6 border border-indigo-100 shadow-sm">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <p className="text-3xl font-black text-indigo-600">{task.expr} = ?</p>
                </div>

                <div className={`w-20 h-20 rounded-2xl border-2 flex items-center justify-center text-3xl font-black ${
                  answers[task.key] === task.correct
                    ? 'border-green-400 text-green-600 bg-green-50'
                    : answers[task.key]
                    ? 'border-red-400 text-red-500 bg-red-50'
                    : 'border-gray-200 text-gray-400 bg-white'
                }`}>
                  {answers[task.key] || '?'}
                </div>
              </div>

              {renderOptionButtons(
                task.key,
                ['1', '3', '3.5', '4'],
                task.correct,
                'Giỏi lắm! Bé làm đúng rồi.',
                'Bé thử đặt thẳng cột rồi tính lại nhé.',
                'purple'
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderGrade5Lesson2 = () => {
    const tasks = [
      { key: 'g5l2_1', question: '1m = ? cm', correct: '100' },
      { key: 'g5l2_2', question: '1kg = ? g', correct: '1000' },
      { key: 'g5l2_3', question: '1 giờ = ? phút', correct: '60' },
    ];

    return (
      <div className="w-full max-w-5xl space-y-8">
        <div className="bg-white rounded-[32px] border border-teal-100 shadow-lg p-8">
          <h3 className="text-2xl font-black text-teal-600 mb-4">📏 Đổi đơn vị đo</h3>
          <p className="text-lg text-gray-600 leading-8">
            Bé hãy nhớ các mốc đổi đơn vị quen thuộc để tính nhanh hơn nhé.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6">
          {tasks.map((task) => (
            <div key={task.key} className="bg-white rounded-[28px] p-6 border border-teal-100 shadow-sm">
              <p className="text-2xl font-black text-teal-600">{task.question}</p>

              <div className={`mt-5 w-24 h-20 rounded-2xl border-2 flex items-center justify-center text-3xl font-black ${
                answers[task.key] === task.correct
                  ? 'border-green-400 text-green-600 bg-green-50'
                  : answers[task.key]
                  ? 'border-red-400 text-red-500 bg-red-50'
                  : 'border-gray-200 text-gray-400 bg-white'
              }`}>
                {answers[task.key] || '?'}
              </div>

              {renderOptionButtons(
                task.key,
                ['60', '100', '1000', '10'],
                task.correct,
                'Đúng rồi! Bé đổi đơn vị rất tốt.',
                'Bé nhớ lại bảng đơn vị đo nhé.',
                'blue'
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderComingSoon = () => (
    <div className="w-full max-w-4xl bg-white rounded-[32px] border border-blue-100 shadow-lg p-10 text-center">
      <div className="text-7xl mb-4">🚧</div>
      <h3 className="text-3xl font-black text-blue-700 mb-4">Bài học này đang được cập nhật</h3>
      <p className="text-lg text-gray-600 leading-8 max-w-2xl mx-auto">
        Milu đang chuẩn bị thêm nội dung mới cho bài học này. Bé có thể quay lại Dashboard hoặc làm bài tập được giao trước nhé.
      </p>

      <div className="mt-8 flex flex-wrap justify-center gap-4">
        <button
          onClick={() => navigate('/student-dashboard')}
          className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-2xl font-bold text-lg shadow-md transition"
        >
          Quay lại Dashboard
        </button>

        <button
          onClick={() => navigate('/assigned-exercises')}
          className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-4 rounded-2xl font-bold text-lg shadow-md transition"
        >
          Xem bài tập được giao
        </button>
      </div>
    </div>
  );

  const renderLessonContent = () => {
    const key = `${gradeLevel}-${id}`;

    switch (key) {
      case '1-1':
        return renderGrade1Lesson1();
      case '1-2':
        return renderGrade1Lesson2();
      case '1-3':
        return renderGrade1Lesson3();
      case '2-1':
        return renderGrade2Lesson1();
      case '2-2':
        return renderGrade2Lesson2();
      case '3-1':
        return renderGrade3Lesson1();
      case '3-2':
        return renderGrade3Lesson2();
      case '4-1':
        return renderGrade4Lesson1();
      case '4-2':
        return renderGrade4Lesson2();
      case '5-1':
        return renderGrade5Lesson1();
      case '5-2':
        return renderGrade5Lesson2();
      default:
        return renderComingSoon();
    }
  };

  return (
    <div className="flex min-h-screen bg-[#F8FAFC]">
      <StudentSidebar />

      <main className="flex-1 p-6 flex flex-col items-center">
        <div className="w-full max-w-3xl bg-gradient-to-r from-blue-600 to-blue-500 text-white text-center py-4 rounded-xl shadow-md mb-6 font-black text-xl tracking-wide">
          {lessonMeta}
        </div>

        {renderLessonContent()}

        <div className="mt-12 mb-10 flex justify-center w-full max-w-4xl border-t border-gray-100 pt-10">
          <button
            onClick={() => {
              speak('Đi làm thử thách lấy sao thôi nào!');
              setTimeout(() => navigate(`/study/${id}`), 800);
            }}
            className="bg-orange-500 text-white px-10 py-4 rounded-full font-black text-xl hover:bg-orange-600 transition-all shadow-xl hover:scale-105 active:scale-95 flex items-center gap-3 border-b-4 border-orange-700"
          >
            Bé đã hiểu bài, đi làm thử thách lấy sao thôi! 🚀
          </button>
        </div>
      </main>
    </div>
  );
}