import React, { useEffect, useRef, useState } from 'react';
import StudentSidebar from '../../components/Common/StudentSidebar';
import { showToast } from "../../../util/toast";

export default function AIPowered() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [aiResult, setAiResult] = useState('');
  const [isSpeaking, setIsSpeaking] = useState(false);

  const utteranceRef = useRef(null);

  const gradeLevel = localStorage.getItem('gradeLevel') || '1';

  useEffect(() => {
    return () => {
      window.speechSynthesis.cancel();
    };
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    stopSpeaking();
    setSelectedImage(file);
    setPreviewUrl(URL.createObjectURL(file));
    setAiResult('');
  };

  const handleReset = () => {
    stopSpeaking();
    setSelectedImage(null);
    setPreviewUrl('');
    setAiResult('');
  };

  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      const reader = new FileReader();

      reader.onload = (event) => {
        img.src = event.target.result;
      };

      img.onload = () => {
        const canvas = document.createElement('canvas');
        const maxWidth = 800;

        const scaleSize = Math.min(maxWidth / img.width, 1);
        canvas.width = img.width * scaleSize;
        canvas.height = img.height * scaleSize;

        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

        const compressedBase64 = canvas.toDataURL('image/jpeg', 0.7);
        resolve(compressedBase64);
      };

      img.onerror = (error) => reject(error);
      reader.onerror = (error) => reject(error);

      reader.readAsDataURL(file);
    });
  };

  const handleAskAI = async () => {
  if (!selectedImage) {
    showToast('Bé hãy chọn ảnh bài tập trước nhé!');
    return;
  }

  try {
    stopSpeaking();
    setLoading(true);
    setAiResult('');

    const base64 = await convertToBase64(selectedImage);
    const token = localStorage.getItem('token');

    const response = await fetch('https://wed-edu.onrender.com/api/ai/solve-from-image', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        imageBase64: base64,
        gradeLevel,
      }),
    });

    // 👇 LOG để debug
    console.log('STATUS:', response.status);

    const text = await response.text();
    console.log('RAW RESPONSE:', text);

    let data;
    try {
      data = JSON.parse(text);
    } catch (err) {
      throw new Error('Backend không trả JSON → AI đang lỗi hoặc Gemini lỗi');
    }

    if (response.ok) {
      setAiResult(data.guidance || data.answer || 'AI chưa trả nội dung');
    } else {
      showToast(data.message || 'Lỗi từ backend AI');
    }

  } catch (error) {
    console.error('AI ERROR:', error);
    showToast(error.message || 'Không thể kết nối AI');
  } finally {
    setLoading(false);
  }
};

  const cleanTextForSpeech = (text) => {
    return text
      .replace(/\*\*/g, '')
      .replace(/#{1,6}\s?/g, '')
      .replace(/`/g, '')
      .replace(/\n+/g, '. ')
      .replace(/\s+/g, ' ')
      .trim();
  };

  const speakResult = () => {
    if (!aiResult) {
      showToast('Chưa có lời giải để đọc đâu nhé!');
      return;
    }

    if (!('speechSynthesis' in window)) {
      showToast('Trình duyệt này chưa hỗ trợ đọc văn bản.');
      return;
    }

    window.speechSynthesis.cancel();

    const textToSpeak = cleanTextForSpeech(aiResult);
    const utterance = new SpeechSynthesisUtterance(textToSpeak);

    utterance.lang = 'vi-VN';
    utterance.rate = 0.95;
    utterance.pitch = 1.1;
    utterance.volume = 1;

    const voices = window.speechSynthesis.getVoices();
    const vietnameseVoice = voices.find(
      (voice) => voice.lang === 'vi-VN' || voice.lang.startsWith('vi')
    );
    if (vietnameseVoice) {
      utterance.voice = vietnameseVoice;
    }

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    utteranceRef.current = utterance;
    window.speechSynthesis.speak(utterance);
  };

  const stopSpeaking = () => {
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-sky-50 via-blue-50 to-indigo-50">
      <StudentSidebar />

      <div className="flex-1 px-6 py-8 md:px-10">
        <div className="mb-8">
          <h1 className="text-4xl font-extrabold text-blue-700 tracking-tight">
            AI Homework Helper
          </h1>
          <p className="mt-2 text-gray-600 text-base">
            Bạn AI sẽ giúp bé đọc bài và hướng dẫn từng bước thật dễ hiểu nhé.
          </p>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          <div className="bg-white/90 backdrop-blur rounded-3xl shadow-lg border border-blue-100 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-2xl bg-blue-100 flex items-center justify-center text-2xl">
                📸
              </div>
              <div>
                <h2 className="text-2xl font-bold text-slate-800">Tải ảnh bài tập lên</h2>
                <p className="text-sm text-gray-500">Bé chỉ cần chọn 1 bài rõ nét thôi nhé</p>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4 mb-5">
              <p className="text-sm text-gray-700 leading-6">
                Bé hãy chụp rõ <span className="font-semibold text-blue-700">1 bài tập thôi nhé</span>.
                Ảnh sáng, thẳng và không bị mờ sẽ giúp AI hướng dẫn tốt hơn.
              </p>
            </div>

            <label className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-3 rounded-2xl cursor-pointer transition">
              <span>📂 Chọn ảnh bài tập</span>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
            </label>

            {selectedImage && (
              <p className="mt-3 text-sm text-gray-600">
                Ảnh đã chọn: <span className="font-medium">{selectedImage.name}</span>
              </p>
            )}

            <div className="mt-5 rounded-3xl border-2 border-dashed border-blue-200 bg-slate-50 min-h-[360px] flex items-center justify-center overflow-hidden p-4">
              {previewUrl ? (
                <img
                  src={previewUrl}
                  alt="Preview"
                  className="max-h-[320px] w-auto object-contain rounded-2xl shadow"
                />
              ) : (
                <div className="text-center text-gray-400">
                  <div className="text-5xl mb-3">🖼️</div>
                  <p className="font-medium">Chưa có ảnh nào được chọn</p>
                  <p className="text-sm mt-1">Bé chọn ảnh để AI bắt đầu giúp nhé</p>
                </div>
              )}
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              <button
                onClick={handleAskAI}
                disabled={loading}
                className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white px-6 py-3 rounded-2xl font-bold shadow-md transition"
              >
                {loading ? '⏳ AI đang suy nghĩ...' : '🤖 Nhờ AI hướng dẫn'}
              </button>

              <button
                onClick={handleReset}
                className="bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 px-6 py-3 rounded-2xl font-semibold transition"
              >
                🔄 Chọn ảnh khác
              </button>
            </div>
          </div>

          <div className="bg-white/90 backdrop-blur rounded-3xl shadow-lg border border-yellow-100 p-6">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 rounded-full bg-yellow-300 shadow flex items-center justify-center text-3xl">
                🤖
              </div>
              <div>
                <p className="text-2xl font-bold text-blue-700">AI Buddy</p>
                <p className="text-gray-600">Mình sẽ giúp bé giải bài từng bước nhé!</p>
              </div>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100 rounded-3xl p-5 min-h-[430px] shadow-inner">
              {!aiResult ? (
                <div className="h-full flex flex-col items-center justify-center text-center text-gray-400">
                  <div className="text-6xl mb-4">✨</div>
                  <p className="text-lg font-semibold text-gray-500">Kết quả AI sẽ hiện ở đây</p>
                  <p className="text-sm mt-2 max-w-md leading-6">
                    Sau khi bé tải ảnh lên và bấm nút <span className="font-semibold text-blue-600">“Nhờ AI hướng dẫn”</span>,
                    bạn AI sẽ đọc bài và giải thích thật dễ hiểu.
                  </p>
                </div>
              ) : (
                <div>
                  <div className="flex flex-wrap items-center gap-3 mb-4">
                    <div className="inline-block px-4 py-2 rounded-full bg-white border border-blue-200 text-sm font-semibold text-blue-700 shadow-sm">
                      📚 Hướng dẫn cho lớp {gradeLevel}
                    </div>

                    <button
                      onClick={speakResult}
                      disabled={isSpeaking}
                      className="px-4 py-2 rounded-full bg-green-500 hover:bg-green-600 disabled:bg-green-300 text-white text-sm font-semibold shadow-sm transition"
                    >
                      {isSpeaking ? '🔊 Đang đọc...' : '🔊 Đọc cho bé nghe'}
                    </button>

                    <button
                      onClick={stopSpeaking}
                      className="px-4 py-2 rounded-full bg-red-500 hover:bg-red-600 text-white text-sm font-semibold shadow-sm transition"
                    >
                      ⏹ Dừng đọc
                    </button>
                  </div>

                  <div className="whitespace-pre-line text-[16px] leading-8 text-slate-700 bg-white rounded-2xl p-5 border border-blue-100 shadow-sm">
                    {aiResult}
                  </div>
                </div>
              )}
            </div>

            <div className="mt-5 grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="bg-pink-50 border border-pink-100 rounded-2xl p-3 text-sm text-pink-700 font-medium text-center">
                🌟 Dễ hiểu
              </div>
              <div className="bg-green-50 border border-green-100 rounded-2xl p-3 text-sm text-green-700 font-medium text-center">
                🧠 Từng bước
              </div>
              <div className="bg-yellow-50 border border-yellow-100 rounded-2xl p-3 text-sm text-yellow-700 font-medium text-center">
                🎉 Thân thiện
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
