//WritingTutorial là trang bài học tương tác dùng để dạy học sinh viết số. Trang sử dụng React state để điều khiển số hiện tại,
//React Router để lấy ID bài học, Web Speech API để phát âm thanh tiếng Việt, và video động để hướng dẫn viết số.

import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

export default function WritingTutorial() {
  const navigate = useNavigate();
  const { id } = useParams();

  // Dạy viết các số từ 0 đến 5 nếu là bài 1
  const numbersToLearn = id === "1" ? [0, 1, 2, 3, 4, 5] : [6, 7, 8, 9, 10];
  const [currentIndex, setCurrentIndex] = useState(0);

  const currentNumber = numbersToLearn[currentIndex];

  // Hàm phát âm thanh
  const speak = (text) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'vi-VN';
      utterance.rate = 0.9;
      window.speechSynthesis.speak(utterance);
    }
  };

  // Tự động đọc số khi chuyển sang số mới
  useEffect(() => {
    speak(`Số ${currentNumber}`);
  }, [currentNumber]);

  // Hàm chuyển số
  const handleNext = () => {
    if (currentIndex < numbersToLearn.length - 1) setCurrentIndex(currentIndex + 1);
  };
  const handlePrev = () => {
    if (currentIndex > 0) setCurrentIndex(currentIndex - 1);
  };

  return (
    <div className="min-h-screen bg-[#F0F7FF] flex items-center justify-center p-4">
      
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden border border-gray-200">
        
        {/* Thanh Header màu xanh */}
        <div className="bg-[#4FA1E9] text-white p-4 flex items-center relative shadow-sm">
          <button 
            onClick={() => navigate(`/lesson/${id}`)} 
            className="absolute left-6 text-3xl font-black hover:scale-125 transition-transform"
          >
            {"<"}
          </button>
          <h1 className="text-3xl font-bold w-full text-center tracking-wide">
            Số {currentNumber}
          </h1>
        </div>

        <div className="p-10 flex flex-col items-center">
          
          <div className="w-80 h-80 border-4 border-[#4FA1E9] relative mb-12 bg-white shadow-sm rounded-2xl overflow-hidden">
            
            {/* THẺ VIDEO */}
            <div className="absolute inset-0 flex items-center justify-center z-10">
              <video 
                key={currentNumber} 
                src={`/videos/viet-so-${currentNumber}.mp4`} 
                className="w-full h-full object-contain"
                autoPlay 
                loop     
                muted    
                playsInline
                onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }}
              ></video>

              {/* Số dự phòng khi chưa tải được video */}
              <div className="hidden text-[150px] font-black text-gray-200 w-full h-full items-center justify-center">
                {currentNumber}
              </div>
            </div>
          </div>

          {/* ✅ 3D-STYLED CONTROL BUTTONS */}
          {/* Container with light blue border and white background */}
          <div className="border border-[#4FA1E9]/50 rounded-full px-12 py-3 bg-white flex items-center gap-10 shadow-inner">
            
            {/* Prev button: square blue block with white symbols */}
            <button 
              onClick={handlePrev} 
              disabled={currentIndex === 0}
              className={`flex items-center justify-center bg-[#4FA1E9] text-white rounded-xl p-4 text-4xl shadow-[6px_6px_0px_#1D4ED8] transition-all duration-150 hover:-translate-y-1 active:translate-y-0.5 active:shadow-[2px_2px_0px_#1D4ED8] ${currentIndex === 0 ? 'opacity-40 cursor-not-allowed' : ''}`}
            >
              ⏪
            </button>
            
            {/* Play button: square blue block with a white symbol */}
            <button className="flex items-center justify-center bg-[#4FA1E9] text-white rounded-xl p-5 text-6xl hover:-translate-y-1 active:translate-y-0.5 shadow-[6px_6px_0px_#1D4ED8] active:shadow-[2px_2px_0px_#1D4ED8] transition-all duration-150">
              ▶
            </button>
            
            {/* Next button: square blue block with white symbols */}
            <button 
              onClick={handleNext} 
              disabled={currentIndex === numbersToLearn.length - 1}
              className={`flex items-center justify-center bg-[#4FA1E9] text-white rounded-xl p-4 text-4xl shadow-[6px_6px_0px_#1D4ED8] transition-all duration-150 hover:-translate-y-1 active:translate-y-0.5 active:shadow-[2px_2px_0px_#1D4ED8] ${currentIndex === numbersToLearn.length - 1 ? 'opacity-40 cursor-not-allowed' : ''}`}
            >
              ⏩
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}