<template>
  <div>
    <!-- Header -->
    <header class="header" id="header">
      <nav class="nav">
        <div class="logo">
          <div class="logo-icon"></div>
          ÔN THI
        </div>
        <ul class="nav-links">
          <li><a href="#home">Trang chủ</a></li>
          <li><a href="#exams">Các kỳ thi</a></li>
          <li><a href="#courses">Khóa học</a></li>
          <li><a href="#about">Giới thiệu</a></li>
          <li><a href="#contact">Liên hệ</a></li>
          <li>
            <router-link :to="{ name: 'login' }" class="login-btn">Đăng nhập</router-link>
          </li>
        </ul>
        <button class="cta-button">Dùng thử miễn phí</button>
      </nav>
    </header>

    <!-- Hero Section -->
    <section class="hero" id="home">
      <div class="hero-content">
        <h1>Chinh phục <span class="highlight">Kỳ thi Tiếng Anh</span></h1>
        <p>
          Khóa học ôn thi trực tuyến toàn diện cho TOEIC, IELTS, SAT, GRE, GMAT và 
          nhiều kỳ thi khác. Tham gia cùng hàng nghìn học viên thành công trên toàn thế giới.
        </p>
        <div class="hero-buttons">
          <button class="btn-primary">Bắt đầu học ngay</button>
          <button class="btn-secondary">Xem demo</button>
        </div>
      </div>
    </section>

    <!-- Exams -->
    <section class="exams" id="exams">
      <div class="container">
        <h2 class="section-title">Các khóa ôn thi phổ biến</h2>
        <div class="exam-grid">
          <div class="exam-card fade-in-up">
            <div class="exam-icon">TOEIC</div>
            <h3>Ôn thi TOEIC</h3>
            <p>
              Khóa học ôn thi toàn diện với các bài kiểm tra thực hành, 
              bài tập nghe và ôn tập ngữ pháp chi tiết.
            </p>
            <div class="exam-stats">
              <div class="stat">
                <div class="stat-number">500+</div>
                <div class="stat-label">Đề thi thử</div>
              </div>
              <div class="stat">
                <div class="stat-number">95%</div>
                <div class="stat-label">Tỷ lệ thành công</div>
              </div>
            </div>
            <button class="start-btn">Bắt đầu ôn TOEIC</button>
          </div>

          <div class="exam-card fade-in-up">
            <div class="exam-icon">IELTS</div>
            <h3>Ôn thi IELTS</h3>
            <p>
              Chuẩn bị toàn diện cho 4 kỹ năng nghe, nói, đọc, viết 
              với các chiến lược thi hiệu quả và bài tập thực hành.
            </p>
            <div class="exam-stats">
              <div class="stat">
                <div class="stat-number">300+</div>
                <div class="stat-label">Đề thi thử</div>
              </div>
              <div class="stat">
                <div class="stat-number">92%</div>
                <div class="stat-label">Tỷ lệ thành công</div>
              </div>
            </div>
            <button class="start-btn">Bắt đầu ôn IELTS</button>
          </div>

          <div class="exam-card fade-in-up">
            <div class="exam-icon">SAT</div>
            <h3>Ôn thi SAT</h3>
            <p>
              Khóa học chuẩn bị SAT với các bài tập toán, đọc hiểu 
              và viết luận, giúp bạn đạt điểm số mong muốn.
            </p>
            <div class="exam-stats">
              <div class="stat">
                <div class="stat-number">200+</div>
                <div class="stat-label">Đề thi thử</div>
              </div>
              <div class="stat">
                <div class="stat-number">88%</div>
                <div class="stat-label">Tỷ lệ thành công</div>
              </div>
            </div>
            <button class="start-btn">Bắt đầu ôn SAT</button>
          </div>

          <div class="exam-card fade-in-up">
            <div class="exam-icon">GRE</div>
            <h3>Ôn thi GRE</h3>
            <p>
              Chuẩn bị kỹ lưỡng cho kỳ thi GRE với các bài tập từ vựng, 
              toán học và viết luận chuyên sâu.
            </p>
            <div class="exam-stats">
              <div class="stat">
                <div class="stat-number">150+</div>
                <div class="stat-label">Đề thi thử</div>
              </div>
              <div class="stat">
                <div class="stat-number">90%</div>
                <div class="stat-label">Tỷ lệ thành công</div>
              </div>
            </div>
            <button class="start-btn">Bắt đầu ôn GRE</button>
          </div>

          <div class="exam-card fade-in-up">
            <div class="exam-icon">GMAT</div>
            <h3>Ôn thi GMAT</h3>
            <p>
              Khóa học GMAT toàn diện với các bài tập logic, toán học 
              và kỹ năng phân tích dành cho ứng viên MBA.
            </p>
            <div class="exam-stats">
              <div class="stat">
                <div class="stat-number">120+</div>
                <div class="stat-label">Đề thi thử</div>
              </div>
              <div class="stat">
                <div class="stat-number">87%</div>
                <div class="stat-label">Tỷ lệ thành công</div>
              </div>
            </div>
            <button class="start-btn">Bắt đầu ôn GMAT</button>
          </div>

          <div class="exam-card fade-in-up">
            <div class="exam-icon">ACT</div>
            <h3>Ôn thi ACT</h3>
            <p>
              Chuẩn bị kỳ thi ACT với các bài tập toán, khoa học, 
              đọc hiểu và viết luận hiệu quả.
            </p>
            <div class="exam-stats">
              <div class="stat">
                <div class="stat-number">100+</div>
                <div class="stat-label">Đề thi thử</div>
              </div>
              <div class="stat">
                <div class="stat-number">85%</div>
                <div class="stat-label">Tỷ lệ thành công</div>
              </div>
            </div>
            <button class="start-btn">Bắt đầu ôn ACT</button>
          </div>
        </div>
      </div>
    </section>

    <!-- Features -->
    <section class="features">
      <div class="container">
        <h2 class="section-title">Tại sao chọn ÔnThi?</h2>
        <div class="features-grid">
          <div class="feature fade-in-up">
            <div class="feature-icon">📚</div>
            <h3>Nội dung toàn diện</h3>
            <p>
              Hàng nghìn câu hỏi thực hành, giải thích chi tiết và tài liệu học tập 
              được tạo bởi các chuyên gia giáo dục và chuyên gia kỳ thi.
            </p>
          </div>
          
          <div class="feature fade-in-up">
            <div class="feature-icon">🎯</div>
            <h3>Học tập cá nhân hóa</h3>
            <p>
              Hệ thống AI thông minh phân tích điểm yếu của bạn và tạo ra 
              lộ trình học tập cá nhân hóa để tối ưu hóa kết quả.
            </p>
          </div>
          
          <div class="feature fade-in-up">
            <div class="feature-icon">📊</div>
            <h3>Theo dõi tiến độ</h3>
            <p>
              Dashboard chi tiết giúp bạn theo dõi tiến độ học tập, 
              xem điểm số và xác định các lĩnh vực cần cải thiện.
            </p>
          </div>
          
          <div class="feature fade-in-up">
            <div class="feature-icon">👨‍🏫</div>
            <h3>Hướng dẫn chuyên nghiệp</h3>
            <p>
              Đội ngũ giảng viên giàu kinh nghiệm và chuyên gia kỳ thi 
              sẵn sàng hỗ trợ bạn 24/7 qua chat và video call.
            </p>
          </div>
          
          <div class="feature fade-in-up">
            <div class="feature-icon">📱</div>
            <h3>Học mọi lúc mọi nơi</h3>
            <p>
              Ứng dụng mobile và web responsive cho phép bạn học tập 
              linh hoạt trên mọi thiết bị, mọi lúc mọi nơi.
            </p>
          </div>
          
          <div class="feature fade-in-up">
            <div class="feature-icon">🏆</div>
            <h3>Kết quả được chứng minh</h3>
            <p>
              Hơn 50,000 học viên đã đạt được điểm số mong muốn 
              với phương pháp học tập hiệu quả của chúng tôi.
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- Success Stories -->
    <section class="success-stories">
      <div class="container">
        <h2 class="section-title" style="color: white;">Con đường dẫn đến thành công</h2>
        <div class="checklist">
          <div class="checklist-item">
            <div class="checklist-icon">✓</div>
            <div class="checklist-text">
              Làm bài kiểm tra đánh giá để xác định trình độ hiện tại và điểm yếu
            </div>
          </div>
          
          <div class="checklist-item">
            <div class="checklist-icon">✓</div>
            <div class="checklist-text">
              Nhận lộ trình học tập cá nhân hóa dựa trên mục tiêu và thời gian của bạn
            </div>
          </div>
          
          <div class="checklist-item">
            <div class="checklist-icon">✓</div>
            <div class="checklist-text">
              Học tập theo từng module với video bài giảng chi tiết và bài tập thực hành
            </div>
          </div>
          
          <div class="checklist-item">
            <div class="checklist-icon">✓</div>
            <div class="checklist-text">
              Làm bài kiểm tra định kỳ để theo dõi tiến độ và điều chỉnh kế hoạch học
            </div>
          </div>
          
          <div class="checklist-item">
            <div class="checklist-icon">✓</div>
            <div class="checklist-text">
              Tham gia các bài thi thử toàn diện để chuẩn bị tốt nhất cho kỳ thi thật
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Footer -->
    <footer class="footer">
      <div class="container">
        <div class="footer-content">
          <div class="footer-section">
            <h3>ÔnThi</h3>
            <p>
              Đối tác tin cậy trong việc ôn thi của bạn. Giúp học viên đạt được 
              mục tiêu học tập với tài liệu học tập toàn diện và sự hướng dẫn của chuyên gia.
            </p>
          </div>
          
          <div class="footer-section">
            <h3>Kỳ thi</h3>
            <ul>
              <li><a href="#toeic">TOEIC</a></li>
              <li><a href="#ielts">IELTS</a></li>
              <li><a href="#sat">SAT</a></li>
              <li><a href="#gre">GRE</a></li>
              <li><a href="#gmat">GMAT</a></li>
              <li><a href="#act">ACT</a></li>
            </ul>
          </div>
          
          <div class="footer-section">
            <h3>Hỗ trợ</h3>
            <ul>
              <li><a href="#help">Trung tâm trợ giúp</a></li>
              <li><a href="#contact">Liên hệ</a></li>
              <li><a href="#faq">Câu hỏi thường gặp</a></li>
              <li><a href="#tutorial">Hướng dẫn sử dụng</a></li>
              <li><a href="#feedback">Góp ý</a></li>
            </ul>
          </div>
          
          <div class="footer-section">
            <h3>Công ty</h3>
            <ul>
              <li><a href="#about">Giới thiệu</a></li>
              <li><a href="#careers">Tuyển dụng</a></li>
              <li><a href="#press">Báo chí</a></li>
              <li><a href="#partners">Đối tác</a></li>
              <li><a href="#blog">Blog</a></li>
            </ul>
          </div>
        </div>
        <div class="footer-bottom">
          <p>&copy; 2024 ÔnThi. Tất cả quyền được bảo lưu.</p>
        </div>
      </div>
    </footer>
  </div>
</template>


<script setup>
import { onMounted } from "vue";
import { RouterLink } from 'vue-router'

onMounted(() => {
  const header = document.getElementById("header");
  let lastScrollY = window.scrollY;

  // Header scroll effect
  window.addEventListener("scroll", () => {
    if (window.scrollY > 100) {
      header.style.background = "rgba(30, 58, 95, 0.95)";
      header.style.backdropFilter = "blur(20px)";
    } else {
      header.style.background =
        "linear-gradient(135deg, #1e3a5f 0%, #2c5aa0 100%)";
      header.style.backdropFilter = "blur(10px)";
    }
  });

  // Animate on scroll
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = "1";
          entry.target.style.transform = "translateY(0)";
        }
      });
    },
    { threshold: 0.1, rootMargin: "0px 0px -50px 0px" }
  );

  document.querySelectorAll(".fade-in-up, .checklist-item").forEach((el) => {
    observer.observe(el);
  });

  // Ripple effect for buttons
  document.querySelectorAll("button").forEach((button) => {
    button.addEventListener("click", (e) => {
      const ripple = document.createElement("span");
      const rect = button.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      const x = e.clientX - rect.left - size / 2;
      const y = e.clientY - rect.top - size / 2;

      ripple.style.cssText = `
        position: absolute;
        width: ${size}px;
        height: ${size}px;
        left: ${x}px;
        top: ${y}px;
        background: rgba(255, 255, 255, 0.3);
        border-radius: 50%;
        transform: scale(0);
        animation: ripple 0.6s linear;
        pointer-events: none;
      `;

      if (!button.style.position || button.style.position === "static") {
        button.style.position = "relative";
      }
      button.style.overflow = "hidden";
      button.appendChild(ripple);
      setTimeout(() => ripple.remove(), 600);
    });
  });

  // Smooth scroll for nav links
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute("href"));
      if (target) {
        target.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    });
  });

  // Logo animation on scroll
  window.addEventListener("scroll", () => {
    const logoIcon = document.querySelector(".logo-icon");
    if (window.scrollY > lastScrollY) {
      logoIcon.style.transform = "rotate(5deg)";
    } else {
      logoIcon.style.transform = "rotate(-5deg)";
    }
    setTimeout(() => {
      logoIcon.style.transform = "rotate(0deg)";
    }, 200);
    lastScrollY = window.scrollY;
  });
});
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  line-height: 1.6;
  color: #1e3a5f;
  overflow-x: hidden;
}

/* Header */
.header {
  background: linear-gradient(135deg, #1e3a5f 0%, #2c5aa0 100%);
  color: white;
  padding: 1rem 0;
  position: fixed;
  width: 100%;
  top: 0;
  z-index: 1000;
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;
  box-shadow: 0 2px 20px rgba(30, 58, 95, 0.2);
}

.nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
}

.logo {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1.8rem;
  font-weight: bold;
  color: white;
}

.logo-icon {
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, #4a90e2 0%, #68a3ef 100%);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  border: 2px solid #1e3a5f;
}

.logo-icon::before {
  content: '✓';
  color: #1e3a5f;
  font-weight: bold;
  font-size: 1.2rem;
}

.logo-icon::after {
  content: '';
  position: absolute;
  right: -5px;
  bottom: -5px;
  width: 20px;
  height: 20px;
  background: linear-gradient(135deg, #ff6b35 0%, #f7931e 100%);
  border-radius: 3px;
  border: 2px solid #1e3a5f;
}

.nav-links {
  display: flex;
  list-style: none;
  gap: 2rem;
}

.nav-links a {
  color: white;
  text-decoration: none;
  font-weight: 500;
  transition: all 0.3s ease;
  position: relative;
}

.nav-links a:hover {
  color: #4a90e2;
  transform: translateY(-2px);
}

.nav-links a::after {
  content: '';
  position: absolute;
  width: 0;
  height: 2px;
  bottom: -5px;
  left: 0;
  background: #ff6b35;
  transition: width 0.3s ease;
}

.nav-links a:hover::after {
  width: 100%;
}

/* Login Button Styles */
.nav-links .login-btn {
  background: linear-gradient(45deg, #ff6b35, #f7931e);
  color: white;
  padding: 0.5rem 1.5rem;
  border-radius: 6px;
  font-weight: 500;
  transition: all 0.3s ease;
}

.nav-links .login-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(255, 107, 53, 0.3);
  color: white;
  opacity: 0.9;
}

.cta-button {
  background: linear-gradient(45deg, #ff6b35, #f7931e);
  color: white;
  padding: 0.8rem 2rem;
  border: none;
  border-radius: 8px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(255, 107, 53, 0.3);
}

.cta-button:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 25px rgba(255, 107, 53, 0.4);
}

/* Hero Section */
.hero {
  background: linear-gradient(135deg, #1e3a5f 0%, #2c5aa0 100%);
  color: white;
  padding: 120px 0 80px;
  text-align: center;
  position: relative;
  overflow: hidden;
}

.hero::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image:
    radial-gradient(circle at 20% 50%, rgba(74, 144, 226, 0.1) 0%, transparent 50%),
    radial-gradient(circle at 80% 20%, rgba(255, 107, 53, 0.1) 0%, transparent 50%),
    radial-gradient(circle at 40% 80%, rgba(74, 144, 226, 0.1) 0%, transparent 50%);
  animation: float 20s linear infinite;
}

@keyframes float {
  0% {
    transform: translateX(0) rotate(0deg);
  }

  100% {
    transform: translateX(-30px) rotate(360deg);
  }
}

.hero-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
  position: relative;
  z-index: 2;
}

.hero h1 {
  font-size: 3.5rem;
  font-weight: 700;
  margin-bottom: 1rem;
  color: white;
  animation: fadeInUp 1s ease;
}

.hero h1 span.highlight {
  background: linear-gradient(45deg, #ff6b35, #f7931e);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.hero p {
  font-size: 1.3rem;
  margin-bottom: 2rem;
  opacity: 0.9;
  animation: fadeInUp 1s ease 0.2s both;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.hero-buttons {
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
  animation: fadeInUp 1s ease 0.4s both;
}

.btn-primary {
  background: linear-gradient(45deg, #ff6b35, #f7931e);
  color: white;
  padding: 1rem 2.5rem;
  border: none;
  border-radius: 8px;
  font-size: 1.1rem;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 8px 30px rgba(255, 107, 53, 0.3);
}

.btn-primary:hover {
  transform: translateY(-3px);
  box-shadow: 0 12px 40px rgba(255, 107, 53, 0.4);
}

.btn-secondary {
  background: rgba(74, 144, 226, 0.2);
  color: white;
  padding: 1rem 2.5rem;
  border: 2px solid #4a90e2;
  border-radius: 8px;
  font-size: 1.1rem;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
}

.btn-secondary:hover {
  background: rgba(74, 144, 226, 0.3);
  transform: translateY(-3px);
}

/* Exam Cards */
.exams {
  padding: 80px 0;
  background: linear-gradient(to bottom, #f8fafc, #ffffff);
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
}

.section-title {
  text-align: center;
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 3rem;
  color: #1e3a5f;
  position: relative;
}

.section-title::after {
  content: '';
  position: absolute;
  width: 100px;
  height: 4px;
  background: linear-gradient(45deg, #ff6b35, #f7931e);
  bottom: -10px;
  left: 50%;
  transform: translateX(-50%);
  border-radius: 2px;
}

.exam-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 2rem;
  margin-top: 4rem;
}

.exam-card {
  background: white;
  border-radius: 12px;
  padding: 2rem;
  text-align: center;
  box-shadow: 0 10px 40px rgba(30, 58, 95, 0.1);
  transition: all 0.3s ease;
  border: 2px solid #e2e8f0;
  position: relative;
  overflow: hidden;
}

.exam-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(45deg, #ff6b35, #f7931e);
  transform: scaleX(0);
  transition: transform 0.3s ease;
}

.exam-card:hover::before {
  transform: scaleX(1);
}

.exam-card:hover {
  transform: translateY(-10px);
  box-shadow: 0 20px 60px rgba(30, 58, 95, 0.15);
  border-color: #4a90e2;
}

.exam-icon {
  width: 80px;
  height: 80px;
  background: linear-gradient(135deg, #4a90e2 0%, #68a3ef 100%);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1.5rem;
  font-size: 1.5rem;
  color: white;
  font-weight: bold;
  border: 3px solid #1e3a5f;
  position: relative;
}

.exam-icon::after {
  content: '';
  position: absolute;
  bottom: -3px;
  right: -3px;
  width: 24px;
  height: 24px;
  background: linear-gradient(135deg, #ff6b35, #f7931e);
  border-radius: 4px;
  border: 2px solid white;
}

.exam-card h3 {
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 1rem;
  color: #1e3a5f;
}

.exam-card p {
  color: #64748b;
  margin-bottom: 1.5rem;
  line-height: 1.6;
}

.exam-stats {
  display: flex;
  justify-content: space-around;
  margin-bottom: 1.5rem;
  padding: 1rem;
  background: #f8fafc;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
}

.stat {
  text-align: center;
}

.stat-number {
  font-size: 1.2rem;
  font-weight: bold;
  color: #1e3a5f;
}

.stat-label {
  font-size: 0.9rem;
  color: #64748b;
}

.start-btn {
  background: linear-gradient(45deg, #1e3a5f, #2c5aa0);
  color: white;
  padding: 0.8rem 2rem;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  width: 100%;
  position: relative;
  overflow: hidden;
}

.start-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(30, 58, 95, 0.3);
}

.start-btn::before {
  content: '✓';
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.start-btn:hover::before {
  opacity: 1;
}

/* Features Section */
.features {
  padding: 80px 0;
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 3rem;
  margin-top: 4rem;
}

.feature {
  text-align: center;
  padding: 2rem;
  background: white;
  border-radius: 12px;
  box-shadow: 0 5px 30px rgba(30, 58, 95, 0.1);
  transition: transform 0.3s ease;
  border: 2px solid #e2e8f0;
  position: relative;
}

.feature:hover {
  transform: translateY(-5px);
  border-color: #4a90e2;
}

.feature-icon {
  width: 60px;
  height: 60px;
  background: linear-gradient(135deg, #4a90e2 0%, #68a3ef 100%);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1.5rem;
  font-size: 1.5rem;
  color: white;
  border: 3px solid #1e3a5f;
  position: relative;
}

.feature-icon::before {
  content: '✓';
  position: absolute;
  top: -8px;
  right: -8px;
  width: 20px;
  height: 20px;
  background: linear-gradient(135deg, #ff6b35, #f7931e);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.8rem;
  color: white;
  border: 2px solid white;
}

.feature h3 {
  font-size: 1.3rem;
  font-weight: 700;
  margin-bottom: 1rem;
  color: #1e3a5f;
}

.feature p {
  color: #64748b;
  line-height: 1.6;
}

/* Success Stories */
.success-stories {
  padding: 80px 0;
  background: linear-gradient(135deg, #1e3a5f 0%, #2c5aa0 100%);
  color: white;
}

.checklist {
  max-width: 800px;
  margin: 3rem auto 0;
  text-align: left;
}

.checklist-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  animation: fadeInUp 0.6s ease forwards;
  opacity: 0;
}

.checklist-item:nth-child(1) {
  animation-delay: 0.1s;
}

.checklist-item:nth-child(2) {
  animation-delay: 0.2s;
}

.checklist-item:nth-child(3) {
  animation-delay: 0.3s;
}

.checklist-item:nth-child(4) {
  animation-delay: 0.4s;
}

.checklist-item:nth-child(5) {
  animation-delay: 0.5s;
}

.checklist-icon {
  width: 32px;
  height: 32px;
  background: linear-gradient(135deg, #4a90e2 0%, #68a3ef 100%);
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #1e3a5f;
  font-weight: bold;
  flex-shrink: 0;
  border: 2px solid rgba(255, 255, 255, 0.2);
}

.checklist-text {
  font-size: 1.1rem;
  flex: 1;
}

/* Footer */
.footer {
  background: #0f1419;
  color: white;
  padding: 60px 0 30px;
}

.footer-content {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 3rem;
  margin-bottom: 2rem;
}

.footer-section h3 {
  font-size: 1.3rem;
  font-weight: 700;
  margin-bottom: 1rem;
  color: #4a90e2;
}

.footer-section ul {
  list-style: none;
}

.footer-section ul li {
  margin-bottom: 0.5rem;
}

.footer-section ul li a {
  color: #94a3b8;
  text-decoration: none;
  transition: color 0.3s ease;
}

.footer-section ul li a:hover {
  color: #ff6b35;
}

.footer-bottom {
  text-align: center;
  padding-top: 2rem;
  border-top: 1px solid #1e293b;
  color: #94a3b8;
}

/* Responsive */
@media (max-width: 768px) {
  .nav-links {
    display: none;
  }

  .hero h1 {
    font-size: 2.5rem;
  }

  .hero p {
    font-size: 1.1rem;
  }

  .hero-buttons {
    flex-direction: column;
    align-items: center;
  }

  .exam-grid {
    grid-template-columns: 1fr;
  }

  .features-grid {
    grid-template-columns: 1fr;
  }

  .checklist {
    padding: 0 1rem;
  }
}

/* Animations */
.fade-in-up {
  opacity: 0;
  transform: translateY(30px);
  animation: fadeInUp 0.6s ease forwards;
}

.fade-in-up:nth-child(1) {
  animation-delay: 0.1s;
}

.fade-in-up:nth-child(2) {
  animation-delay: 0.2s;
}

.fade-in-up:nth-child(3) {
  animation-delay: 0.3s;
}

.fade-in-up:nth-child(4) {
  animation-delay: 0.4s;
}

.fade-in-up:nth-child(5) {
  animation-delay: 0.5s;
}

.fade-in-up:nth-child(6) {
  animation-delay: 0.6s;
}
</style>
