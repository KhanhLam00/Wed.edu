/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'math-blue': '#2D5AAB', // Màu xanh tiêu đề trong báo cáo của bạn
        'math-light': '#A3D1FF', // Màu nút Sign in
      }
    },
  },
  plugins: [],
}