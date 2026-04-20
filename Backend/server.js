const app = require('./app');

const PORT = 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server Backend đang chạy tại cổng ${PORT}...`);
  console.log("Gemini key loaded:", process.env.GEMINI_API_KEY ? "YES" : "NO");
});