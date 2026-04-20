import { useNavigate } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';

export default function LandingPage() {
  const navigate = useNavigate();

    const sliderImages = [
      '/IMG/IMGLanding/Hoconl.jpg',
      '/IMG/IMGLanding/Children.jpg',
      '/IMG/IMGLanding/AIpro.jpg', 
    ];

  const stats = [
    {
      icon: '/IMG/IMGLanding/icon1.png',
      value: 5000,
      suffix: '+',
      title: 'Learners',
      desc: 'Learners have joined our platform',
    },
    {
      icon: '/IMG/IMGLanding/icon2.png',
      value: 1200,
      suffix: '+',
      title: 'Active Users',
      desc: 'Active users every day',
    },
    {
      icon: '/IMG/IMGLanding/icon3.png',
      value: 10000,
      suffix: '+',
      title: 'Lessons',
      desc: 'Lessons completed successfully',
    },
    {
      icon: '/IMG/IMGLanding/icon4.png',
      value: 95,
      suffix: '%',
      title: 'Satisfied',
      desc: 'Learners feel more confident after studying',
    },
  ];

  const features = [
    {
      icon: '/IMG/IMGLanding/b1.jpg',
      title: 'Comprehensive and Well-Structured Math Lessons',
      desc: 'Each lesson follows the school program and is presented in a simple way for children.',
    },
    {
      icon: '/IMG/IMGLanding/b2.jpg',
      title: 'Fun Math Games',
      desc: 'Practice through mini games that help students learn while enjoying the process.',
    },
    {
      icon: '/IMG/IMGLanding/b3.jpg',
      title: 'Teacher Assignment Support',
      desc: 'Teachers can create exercises, monitor progress, and organize lessons more effectively.',
    },
    {
      icon: '/IMG/IMGLanding/b4.jpg',
      title: 'Learning Progress',
      desc: 'Track student progress clearly and support personalized learning improvement.',
    },
  ];

  const courses = [
    {
      image: '/IMG/IMGLanding/c1.jpg',
      title: 'English',
      desc: 'Master English with fun and simple steps.',
      price: '$50.00',
    },
    {
      image: '/IMG/IMGLanding/c2.jpg',
      title: 'Physics',
      desc: 'Discover physics with easy and fun lessons.',
      price: '$50.00',
    },
    {
      image: '/IMG/IMGLanding/c3.jpg',
      title: 'Chemistry',
      desc: 'Explore chemistry in a clear and exciting way.',
      price: '$50.00',
    },
  ];

  const [currentSlide, setCurrentSlide] = useState(0);
  const statsRef = useRef(null);
  const [startCount, setStartCount] = useState(false);
  const [countValues, setCountValues] = useState(stats.map(() => 0));

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % sliderImages.length);
    }, 2500);

    return () => clearInterval(interval);
  }, [sliderImages.length]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry.isIntersecting) {
          setStartCount(true);
        }
      },
      { threshold: 0.35 }
    );

    if (statsRef.current) {
      observer.observe(statsRef.current);
    }

    return () => {
      if (statsRef.current) {
        observer.unobserve(statsRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (!startCount) return;

    const duration = 1800;
    const frameRate = 20;
    const totalSteps = duration / frameRate;

    const intervals = stats.map((item, index) => {
      const increment = item.value / totalSteps;
      let current = 0;

      return setInterval(() => {
        current += increment;

        setCountValues((prev) => {
          const updated = [...prev];
          updated[index] = current >= item.value ? item.value : Math.floor(current);
          return updated;
        });
      }, frameRate);
    });

    const timeout = setTimeout(() => {
      intervals.forEach(clearInterval);
      setCountValues(stats.map((item) => item.value));
    }, duration);

    return () => {
      intervals.forEach(clearInterval);
      clearTimeout(timeout);
    };
  }, [startCount]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white font-sans flex flex-col">
      <nav className="flex justify-between items-center px-8 py-5 bg-gradient-to-r from-[#2D5AAB] to-[#4B7BE5] text-white shadow-lg">
        <span className="font-bold text-xl tracking-tight">🐘 Smart Math Learning</span>

        <div className="flex gap-4">
          <button
            onClick={() => navigate('/login')}
            className="px-6 py-2 bg-white text-[#2D5AAB] font-bold rounded-full shadow-md hover:bg-gray-100 transition-all active:scale-95"
          >
            Login
          </button>

          <button
            onClick={() => navigate('/role-selection')}
            className="bg-[#FFB84C] text-white px-6 py-2 rounded-full font-black shadow-md hover:bg-orange-400 transition-all active:scale-95 border-b-4 border-orange-600"
          >
            Register
          </button>
        </div>
      </nav>

      <section className="max-w-6xl mx-auto flex flex-col md:flex-row items-center px-6 py-16 gap-10 w-full">
        <div className="md:w-1/2 flex justify-center">
          <img
            src="/IMG/IMGLanding/childre.jpg"
            className="rounded-[40px] shadow-2xl border-8 border-white rotate-2 hover:rotate-0 hover:scale-105 transition-all duration-500 w-[320px] md:w-[400px]"
            alt="Milu Mascot"
          />
        </div>

        <div className="md:w-1/2 space-y-6 text-center md:text-left">
          <h1 className="text-4xl md:text-5xl font-black text-gray-800 leading-tight">
            Kickstart Your <br />
            <span className="text-[#2D5AAB]">Math Adventure</span> Today
          </h1>

          <p className="text-lg text-gray-500 font-medium">
            Website dành cho học sinh tiểu học học toán vui vẻ cùng chú voi Milu thông minh!
          </p>

          <button
            onClick={() => navigate('/auth-choice')}
            className="bg-gradient-to-r from-[#2D5AAB] to-[#4B7BE5] text-white px-10 py-4 rounded-2xl font-black text-lg shadow-xl hover:scale-105 hover:shadow-2xl transition-all flex items-center gap-3"
          >
            <span>▶</span> Start Learning Today
          </button>
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-6 py-10 text-center">
        <div className="mx-auto mb-10 w-full max-w-[750px]">
          <div className="relative h-[350px] overflow-hidden rounded-[24px] shadow-2xl">
            <div
              className="flex h-full transition-transform duration-700 ease-in-out"
              style={{ transform: `translateX(-${currentSlide * 100}%)` }}
            >
              {sliderImages.map((img, index) => (
                <img
                  key={index}
                  src={img}
                  alt={`Student Learning ${index + 1}`}
                  className="min-w-full h-full object-cover"
                />
              ))}
            </div>
          </div>

          <div className="flex justify-center gap-3 mt-4">
            {sliderImages.map((_, index) => (
              <button
                key={index}
                type="button"
                onClick={() => setCurrentSlide(index)}
                className={`h-3 rounded-full transition-all duration-300 ${
                  index === currentSlide ? 'w-8 bg-[#2D5AAB]' : 'w-3 bg-gray-300'
                }`}
              />
            ))}
          </div>
        </div>

        <h2 className="text-2xl md:text-3xl font-extrabold text-[#3B5CC9] mb-4">
          Learn anytime, anywhere — and enjoy the process.
        </h2>

        <p className="text-gray-500 max-w-4xl mx-auto leading-7">
          With this website, learning Math has never been easier. You can study anytime, anywhere,
          at your own pace.
        </p>

        <p className="text-gray-500 max-w-4xl mx-auto leading-7 mt-3">
          Each lesson is designed to be simple, clear, and effective, making it perfect for primary
          students. All learning content closely follows the official school curriculum, helping
          young learners understand better and perform more confidently in class.
        </p>

        <p className="text-gray-500 max-w-4xl mx-auto leading-7 mt-3">
          Whether you want to practice basic calculations, improve problem-solving skills, or build
          confidence in Math, you will always find something useful here.
        </p>
      </section>

      <section
        ref={statsRef}
        className="relative overflow-hidden bg-gradient-to-r from-[#63C4EA] via-[#59B7E3] to-[#4D9FD6] py-20 px-6"
      >
        <div className="absolute -top-10 -left-10 w-40 h-40 bg-white/10 rounded-full blur-2xl"></div>
        <div className="absolute bottom-0 right-0 w-56 h-56 bg-white/10 rounded-full blur-2xl"></div>
        <div className="absolute top-1/2 left-1/3 w-24 h-24 bg-white/10 rounded-full blur-xl"></div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-black text-white drop-shadow-sm">
              Our Learning Achievements
            </h2>
            <p className="text-white/90 text-base md:text-lg mt-3">
              Thousands of young learners are improving their Math skills with us every day.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            {stats.map((item, index) => (
              <div
                key={index}
                className="group bg-white/12 backdrop-blur-md rounded-[28px] px-6 py-8 text-white shadow-xl border border-white/20 hover:-translate-y-3 hover:scale-105 hover:bg-white/20 transition-all duration-300"
              >
                <div className="w-20 h-20 mx-auto mb-5 rounded-full bg-white shadow-lg flex items-center justify-center group-hover:scale-110 transition duration-300">
                  <img
                    src={item.icon}
                    alt={item.title}
                    className="w-10 h-10 object-contain"
                  />
                </div>

                <h3 className="text-3xl md:text-4xl font-black tracking-wide group-hover:scale-110 transition duration-300">
                  {countValues[index].toLocaleString()}
                  {item.suffix}
                </h3>

                <div className="w-16 h-1.5 bg-white mx-auto my-4 rounded-full group-hover:w-24 transition-all duration-300"></div>

                <p className="font-extrabold text-xl">{item.title}</p>

                <p className="text-sm md:text-base mt-3 leading-6 text-white/95">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 py-16 grid md:grid-cols-2 gap-10 items-center">
        <div className="relative flex justify-center">
          <img
            src="/IMG/IMGLanding/Area.png"
            alt="Decorative"
            className="rounded-[30px] w-full max-w-[480px]"
          />
        </div>

        <div>
          <h2 className="text-3xl font-extrabold text-[#4B5FD1] mb-2">
            Experiences from Learn Together
          </h2>
          <p className="text-gray-500 mb-8">Smart Free Math Learning for Primary Students</p>

          <div className="space-y-4">
            {features.map((item, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl shadow-md border border-gray-100 p-4 flex items-start gap-4 hover:shadow-lg transition"
              >
                <img
                  src={item.icon}
                  alt={item.title}
                  className="w-14 h-14 rounded-xl object-cover"
                />
                <div>
                  <h3 className="font-bold text-gray-800 text-sm md:text-base">{item.title}</h3>
                  <p className="text-gray-500 text-sm mt-1">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#F7F7F7] py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-extrabold text-center text-gray-800 mb-10">
            Some of our other courses
          </h2>

          <div className="grid md:grid-cols-3 gap-6">
            {courses.map((course, index) => (
              <div
                key={index}
                className="bg-white rounded-3xl shadow-lg overflow-hidden hover:shadow-2xl hover:-translate-y-2 transition-all duration-300"
              >
                <img
                  src={course.image}
                  alt={course.title}
                  className="w-full h-44 object-cover"
                />

                <div className="p-5">
                  <h3 className="text-xl font-extrabold text-gray-800 mb-2">{course.title}</h3>
                  <p className="text-gray-500 text-sm mb-4">{course.desc}</p>

                  <div className="flex justify-between items-center">
                    <span className="text-[#2D5AAB] font-bold">{course.price}</span>
                    <span className="text-yellow-400 text-sm">★★★★★</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 px-6 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-extrabold text-[#3B5CC9] mb-4">Get in touch with us</h2>
          <p className="text-gray-500 mb-8">
            If you have any questions about Smart Math Learning for Kids, don&apos;t hesitate to
            contact us.
          </p>

          <div className="space-y-4">
            <textarea
              placeholder="Send us your questions or feedback"
              rows="6"
              className="w-full rounded-2xl border border-gray-300 p-4 outline-none focus:ring-2 focus:ring-[#2D5AAB]"
            ></textarea>

            <input
              type="email"
              placeholder="Please enter your email"
              className="w-full rounded-2xl border border-gray-300 p-4 outline-none focus:ring-2 focus:ring-[#2D5AAB]"
            />

            <button className="bg-gradient-to-r from-[#2D5AAB] to-[#4B7BE5] text-white px-10 py-4 rounded-2xl font-black text-lg shadow-xl hover:scale-105 hover:shadow-2xl transition-all flex items-center justify-center gap-3 mx-auto">
              Send Message
            </button>
          </div>
        </div>
      </section>

      <div className="w-full overflow-hidden leading-none">
        <svg
          viewBox="0 0 1440 220"
          className="w-full h-[120px]"
          preserveAspectRatio="none"
        >
          <path
            fill="#2D5AAB"
            d="M0,128L60,112C120,96,240,64,360,69.3C480,75,600,117,720,128C840,139,960,117,1080,96C1200,75,1320,53,1380,42.7L1440,32L1440,224L1380,224C1320,224,1200,224,1080,224C960,224,840,224,720,224C600,224,480,224,360,224C240,224,120,224,60,224L0,224Z"
          ></path>
        </svg>
      </div>

      <footer className="bg-gradient-to-r from-[#6EC6E9] to-[#4FA3D1] text-white px-6 py-12">
        <div className="max-w-6xl mx-auto grid md:grid-cols-4 gap-8 items-start">
          <div>
            <button className="bg-white text-gray-700 px-4 py-2 rounded-full font-medium">
              🌐 English
            </button>
          </div>

          <div>
            <h3 className="font-bold text-lg mb-3">About Us</h3>
            <ul className="space-y-2 text-sm">
              <li>Help / FAQ</li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-lg mb-3">Contact Us</h3>
            <ul className="space-y-2 text-sm">
              <li>Privacy Policy</li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-lg mb-3">Social Media:</h3>
            <div className="flex gap-4 items-center">
              <a href="#" className="hover:scale-110 transition">
                <img src="/IMG/IMGLanding/d1.png" alt="Facebook" className="w-8 h-8 object-contain" />
              </a>
              <a href="#" className="hover:scale-110 transition">
                <img src="/IMG/IMGLanding/d2.png" alt="Google" className="w-8 h-8 object-contain" />
              </a>
              <a href="#" className="hover:scale-110 transition">
                <img src="/IMG/IMGLanding/d3.png" alt="X" className="w-8 h-8 object-contain" />
              </a>
              <a href="#" className="hover:scale-110 transition">
                <img src="/IMG/IMGLanding/d4.png" alt="Instagram" className="w-8 h-8 object-contain" />
              </a>
            </div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto mt-8 text-sm opacity-90">
          @VoKhanhLam.edu
        </div>
      </footer>
    </div>
  );
}