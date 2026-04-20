const genAI = require('../utils/gemini');

exports.generateMath = async (req, res, next) => {
  const { className, topic, lessonType, lessonLabel, lessonRule } = req.body;
  const t = topic || 'bạn nhỏ';

  const prompt = `
Bạn là giáo viên Toán tiểu học tại Việt Nam.

Hãy tạo đúng 1 bài toán ngắn cho học sinh ${className}.

Chủ đề bé thích:
"${t}"

Dạng bài bắt buộc:
- lessonType: ${lessonType}
- lessonLabel: ${lessonLabel}
- rule: ${lessonRule}

YÊU CẦU BẮT BUỘC:
- Chỉ được tạo bài đúng với dạng bài đã chỉ định.
- Không được tự ý chuyển sang phép cộng nếu dạng bài không phải là cộng.
- Câu hỏi phải ngắn, dễ hiểu, phù hợp học sinh tiểu học.
- Có thể dùng 1-2 emoji cho vui nhưng không quá nhiều.
- Trả về đúng JSON, không giải thích thêm, theo mẫu:
{"question":"...","answer":"..."}
`;

  try {
    if (!genAI) throw new Error('Chưa cấu hình GEMINI_API_KEY');

    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    const cleanJson = text.replace(/```json|```/g, '').trim();

    return res.status(200).json(JSON.parse(cleanJson));
  } catch (error) {
    const fallbackDatabase = {
      counting: [ 
        { question: `Bé hãy đếm xem có mấy bạn ${t} trong hình nhé 🧸🧸🧸`, answer: '3' },
        { question: `Có 5 chiếc kẹo ${t} 🍬. Bé đếm được mấy chiếc?`, answer: '5' },
      ],
      comparison: [
        { question: `Có 3 con thỏ 🐰 và 5 củ cà rốt 🥕. Bên nào nhiều hơn?`, answer: 'cà rốt' },
        { question: `Có 4 quả táo 🍎 và 4 quả cam 🍊. Hai bên như thế nào?`, answer: 'bằng nhau' },
      ],
      addition10: [
        { question: `Bé có 3 chiếc xe ${t} 🚗, được tặng thêm 2 chiếc nữa. Hỏi bé có tất cả mấy chiếc?`, answer: '5' },
        { question: `Có 4 viên kẹo ${t} 🍬 và thêm 3 viên nữa. Hỏi có tất cả bao nhiêu viên?`, answer: '7' },
      ],
      addition20: [
        { question: `Có 8 quả bóng ${t} 🎈 và thêm 5 quả nữa. Hỏi có tất cả bao nhiêu quả?`, answer: '13' },
        { question: `Có 9 con gấu ${t} 🧸 và thêm 4 con nữa. Hỏi có tất cả bao nhiêu con?`, answer: '13' },
      ],
      subtraction20: [
        { question: `Bé có 15 viên kẹo ${t} 🍬, cho bạn 4 viên. Hỏi còn lại mấy viên?`, answer: '11' },
        { question: `Có 18 quả bóng ${t} 🎈, bay mất 6 quả. Hỏi còn lại bao nhiêu quả?`, answer: '12' },
      ],
      multiplication: [
        { question: `Có 3 nhóm ${t}, mỗi nhóm có 4 bạn. Hỏi có tất cả bao nhiêu bạn?`, answer: '12' },
        { question: `Có 2 hộp bánh ${t}, mỗi hộp có 5 chiếc. Hỏi có tất cả bao nhiêu chiếc?`, answer: '10' },
      ],
      division: [
        { question: `Có 12 cái kẹo ${t} 🍬 chia đều cho 3 bạn. Mỗi bạn được mấy cái?`, answer: '4' },
        { question: `Có 10 quả bóng ${t} chia đều cho 2 bạn. Mỗi bạn được mấy quả?`, answer: '5' },
      ],
      fractions: [
        { question: `Một chiếc bánh ${t} được chia thành 4 phần bằng nhau. Bé ăn 1 phần. Phân số phần bánh bé ăn là bao nhiêu?`, answer: '1/4' },
        { question: `Có 3 phần được tô màu trong 4 phần bằng nhau. Phân số là gì?`, answer: '3/4' },
      ],
      rectangle_perimeter: [
        { question: `Hình chữ nhật ${t} có chiều dài 8m và chiều rộng 4m. Tính chu vi hình chữ nhật.`, answer: '24' },
        { question: `Hình chữ nhật có chiều dài 10m và chiều rộng 5m. Tính chu vi.`, answer: '30' },
      ],
      decimals: [
        { question: `Bé có 2.5 chiếc bánh ${t}, được cho thêm 1 chiếc nữa. Hỏi bé có tất cả bao nhiêu chiếc?`, answer: '3.5' },
        { question: `4.2 lít nước bớt đi 1.2 lít. Còn lại bao nhiêu lít?`, answer: '3' },
      ],
      unit_conversion: [
        { question: `1 mét bằng bao nhiêu xăng-ti-mét?`, answer: '100' },
        { question: `1 ki-lô-gam bằng bao nhiêu gam?`, answer: '1000' },
      ],
    };

    const questions = fallbackDatabase[lessonType] || fallbackDatabase.addition10;
    const randomQuestion = questions[Math.floor(Math.random() * questions.length)];

    return res.status(200).json(randomQuestion);
  }
};

exports.solveFromImage = async (req, res, next) => {
  try {
    const { imageBase64, gradeLevel } = req.body;

    if (!imageBase64) {
      return res.status(400).json({ message: 'Thiếu ảnh bài tập.' });
    }

    const grade = Number(gradeLevel || 1);
    const cleanBase64 = imageBase64.split(',')[1];

    const lessonRulesByGrade = {
      1: {
        allowedTopics: [
          'Nhận biết và đếm các số 1 đến 5',
          'Nhiều hơn, ít hơn, bằng nhau',
          'Phép cộng trong phạm vi 10'
        ],
        strictRule:
          'Lớp 1 chỉ được giải theo 1 trong 3 dạng: đếm số, so sánh nhiều hơn/ít hơn/bằng nhau, hoặc phép cộng đơn giản trong phạm vi 10. Nếu ảnh là bài đếm hình hoặc nhận biết số thì KHÔNG được biến thành phép cộng.'
      },
      2: {
        allowedTopics: [
          'Phép cộng trong phạm vi 20',
          'Phép trừ trong phạm vi 20'
        ],
        strictRule:
          'Lớp 2 chỉ được giải theo cộng hoặc trừ đơn giản trong phạm vi 20.'
      },
      3: {
        allowedTopics: [
          'Phép nhân cơ bản',
          'Phép chia cơ bản'
        ],
        strictRule:
          'Lớp 3 ưu tiên phép nhân và phép chia cơ bản. Không tự ý đổi thành phép cộng nếu ảnh là bài nhóm bằng nhau hoặc chia đều.'
      },
      4: {
        allowedTopics: [
          'Phân số cơ bản',
          'Chu vi hình chữ nhật'
        ],
        strictRule:
          'Lớp 4 chỉ được giải theo phân số cơ bản hoặc chu vi hình chữ nhật khi ảnh thuộc các dạng này. Nếu có hình chữ nhật với chiều dài chiều rộng thì phải dùng công thức chu vi, không được làm theo phép cộng đơn giản.'
      },
      5: {
        allowedTopics: [
          'Số thập phân cơ bản',
          'Đổi đơn vị đo'
        ],
        strictRule:
          'Lớp 5 ưu tiên số thập phân hoặc đổi đơn vị đo. Nếu ảnh có m, cm, kg, g, giờ, phút thì phải giải theo đổi đơn vị đo.'
      }
    };

    const selectedRule = lessonRulesByGrade[grade] || lessonRulesByGrade[1];

    if (!process.env.GEMINI_API_KEY || !genAI) {
      return res.json({
        guidance: `Xin chào bé, mình sẽ giúp bé làm bài nhé.

Chủ đề được phép của lớp ${grade}:
- ${selectedRule.allowedTopics.join('\n- ')}

Bước 1: Nhìn kỹ đề bài trong ảnh.
Bước 2: Xác định đây là dạng bài nào.
Bước 3: Giải đúng theo dạng bài đó.
Bước 4: Kiểm tra lại đáp án.

Hiện tại hệ thống đang chạy chế độ demo vì chưa có API key AI.`
      });
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

    const prompt = `
Bạn là trợ lý AI dạy Toán tiểu học bằng tiếng Việt.

Học sinh đang học lớp ${grade}.

Chủ đề bài học hợp lệ của lớp ${grade} gồm:
- ${selectedRule.allowedTopics.join('\n- ')}

Quy tắc bắt buộc:
${selectedRule.strictRule}

Nhiệm vụ của bạn:
1. Nhìn ảnh bài tập và xác định đúng dạng bài trong số các chủ đề hợp lệ của lớp ${grade}.
2. Chỉ giải theo đúng dạng bài nhìn thấy trong ảnh.
3. Nếu ảnh là bài đếm hình, nhận biết số, so sánh nhiều hơn/ít hơn/bằng nhau thì giải đúng kiểu đó, không đổi sang phép cộng.
4. Nếu ảnh là phép nhân, chia, phân số, chu vi, số thập phân, đổi đơn vị thì phải giải đúng theo chủ đề đó.
5. Giải từng bước thật ngắn gọn, dễ hiểu, thân thiện với trẻ em.
6. Không dùng markdown, không dùng ký hiệu phức tạp nếu không cần.
7. Trả lời hoàn toàn bằng tiếng Việt.

Cách trả lời mong muốn:
- Dạng bài: ...
- Cách làm:
Bước 1: ...
Bước 2: ...
- Đáp án: ...

Hãy quan sát thật kỹ ảnh trước khi trả lời.
`;

    const result = await model.generateContent([
      prompt,
      {
        inlineData: {
          data: cleanBase64,
          mimeType: 'image/png',
        },
      },
    ]);

    const text = result.response.text();

    res.json({
      guidance: text,
    });
  } catch (error) {
    next(error);
  }
};

exports.explainAnswer = async (req, res, next) => {
  try {
    const { question_text, user_answer, correct_answer } = req.body;

    if (!question_text || user_answer === undefined || correct_answer === undefined) {
      return res.status(400).json({ message: 'Thiếu dữ liệu để giải thích.' });
    }

    if (!genAI) {
      return res.json({
        advice: `Chà, câu này hơi khó, bé nháp lại cẩn thận nhé!
Đề bài là: ${question_text}
Bé trả lời: ${user_answer}
Đáp án đúng là: ${correct_answer}`
      });
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

    const prompt = `
Bạn là một trợ lý AI dạy Toán cho học sinh tiểu học.
Hãy giải thích thật ngắn gọn, dễ thương, dễ hiểu bằng tiếng Việt.

Đề bài:
${question_text}

Bé trả lời:
${user_answer}

Đáp án đúng:
${correct_answer}

Yêu cầu:
- Nói nhẹ nhàng, khích lệ bé
- Giải thích vì sao bé sai
- Nói cách làm đúng thật ngắn gọn
- Chỉ trả về 1 đoạn văn ngắn, không markdown
`;

    const result = await model.generateContent(prompt);
    const text = result.response.text();

    res.json({ advice: text.trim() });
  } catch (error) {
    next(error);
  }
};