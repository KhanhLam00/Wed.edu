import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function LessonItem({
  label,
  isLocked,
  isCompleted,
  isVirtual = false,
  offsetClass = '',
}) {
  const navigate = useNavigate();

  const handleClick = () => {
    if (isVirtual) return;

    if (isLocked) {
      alert("Bài học này đang khóa, bé hãy hoàn thành bài trước đó nhé! 🔒");
    } else {
      navigate('/lesson/' + label);
    }
  };

  return (
    <div className={`w-full flex justify-center ${offsetClass} transition-all duration-300`}>
      <div className="relative flex flex-col items-center">
        {/* số bài */}
        <div className="mb-3 px-3 py-1 rounded-xl bg-blue-500 text-white text-base font-bold shadow">
          {label}
        </div>

        {/* vòng tròn bài học */}
        <div
          onClick={handleClick}
          className={`relative w-20 h-20 rounded-full flex items-center justify-center text-3xl border-[6px] border-white shadow-lg transition-all duration-300
            ${
              isVirtual
                ? 'bg-blue-100 opacity-45 cursor-default'
                : isCompleted
                ? 'bg-green-500 text-white'
                : isLocked
                ? 'bg-gray-300 text-white cursor-not-allowed opacity-80'
                : 'bg-[#4FA1E9] text-white cursor-pointer hover:scale-110 hover:-translate-y-1'
            }
          `}
        >
          {/* vòng sáng ngoài */}
          <div
            className={`absolute inset-0 rounded-full scale-125 -z-10 ${
              isVirtual ? 'bg-blue-100/40' : 'bg-blue-200/40'
            }`}
          ></div>

          {/* icon */}
          {!isVirtual && (
            <>
              {isCompleted ? '✅' : isLocked ? '🔒' : '⭐'}
            </>
          )}
        </div>
      </div>
    </div>
  );
}