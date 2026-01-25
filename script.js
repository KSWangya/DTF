document.addEventListener("DOMContentLoaded", () => {
  // 1. 手機漢堡選單
  const menuBtn = document.getElementById("menuBtn");
  const menu = document.getElementById("menu");
  const navLinks = document.querySelectorAll(".menu a");

  menuBtn.addEventListener("click", () => {
    menu.classList.toggle("active");
    menuBtn.classList.toggle("active");
  });

  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      menu.classList.remove("active");
      menuBtn.classList.remove("active");
    });
  });

  // 2. 導航欄滾動變色
  const nav = document.querySelector("nav");
  window.addEventListener("scroll", () => {
    if (window.scrollY > 50) {
      nav.classList.add("scrolled");
    } else {
      nav.classList.remove("scrolled");
    }
  });

  // 3. 進階滾動動畫 Observer
  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -80px 0px",
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
      }
    });
  }, observerOptions);

  const animatedElements = document.querySelectorAll(
    ".fade-in, .fade-up, .reveal-img",
  );
  animatedElements.forEach((el) => observer.observe(el));

  // 4. 返回頂部按鈕
  const backToTopBtn = document.getElementById("backToTop");

  window.addEventListener("scroll", () => {
    if (window.scrollY > 500) {
      backToTopBtn.classList.add("visible");
    } else {
      backToTopBtn.classList.remove("visible");
    }
  });

  backToTopBtn.addEventListener("click", () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  });

  // 5. 香火粒子效果
  const canvas = document.getElementById("incenseParticles");
  if (canvas) {
    const ctx = canvas.getContext("2d");
    let particles = [];
    const particleCount = 60;

    // 設定畫布大小
    function resizeCanvas() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    // 粒子類別
    class Particle {
      constructor() {
        this.reset();
      }

      reset() {
        this.x = Math.random() * canvas.width;
        this.y = canvas.height + Math.random() * 100;
        this.size = Math.random() * 3 + 1;
        this.speedY = Math.random() * 0.8 + 0.3;
        this.speedX = (Math.random() - 0.5) * 0.5;
        this.opacity = Math.random() * 0.5 + 0.2;
        this.fadeSpeed = Math.random() * 0.005 + 0.002;

        // 香火的顏色範圍：淡金色到橙紅色
        const colors = [
          "rgba(255, 200, 100,", // 淡金
          "rgba(255, 180, 80,", // 暖橙
          "rgba(255, 150, 50,", // 橙色
          "rgba(200, 150, 100,", // 煙霧色
          "rgba(180, 180, 180,", // 灰白煙
        ];
        this.color = colors[Math.floor(Math.random() * colors.length)];
      }

      update() {
        this.y -= this.speedY;
        this.x += this.speedX + Math.sin(this.y * 0.01) * 0.3;
        this.opacity -= this.fadeSpeed;

        // 重置條件
        if (this.opacity <= 0 || this.y < -10) {
          this.reset();
        }
      }

      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = this.color + this.opacity + ")";
        ctx.fill();

        // 添加光暈效果
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size * 2, 0, Math.PI * 2);
        ctx.fillStyle = this.color + this.opacity * 0.3 + ")";
        ctx.fill();
      }
    }

    // 初始化粒子
    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }

    // 動畫循環
    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach((particle) => {
        particle.update();
        particle.draw();
      });

      requestAnimationFrame(animate);
    }

    animate();
  }

  // 6. 平滑滾動到錨點
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();
      const targetId = this.getAttribute("href");
      const targetElement = document.querySelector(targetId);

      if (targetElement) {
        const navHeight = nav.offsetHeight;
        const targetPosition = targetElement.offsetTop - navHeight - 20;

        window.scrollTo({
          top: targetPosition,
          behavior: "smooth",
        });
      }
    });
  });

  // 7. 數字計數動畫（用於年份徽章）
  const badges = document.querySelectorAll(".badge");
  const badgeObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.style.animation = "badgePop 0.6s ease forwards";
        }
      });
    },
    { threshold: 0.5 },
  );

  badges.forEach((badge) => badgeObserver.observe(badge));

  // 8. 圖片懶加載優化
  const images = document.querySelectorAll("img[data-src]");
  const imageObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src;
          img.removeAttribute("data-src");
          observer.unobserve(img);
        }
      });
    },
    { rootMargin: "50px" },
  );

  images.forEach((img) => imageObserver.observe(img));

  // 9. 導航活躍狀態追蹤
  const sections = document.querySelectorAll("section[id]");

  function updateActiveNav() {
    const scrollY = window.scrollY;

    sections.forEach((section) => {
      const sectionTop = section.offsetTop - 150;
      const sectionHeight = section.offsetHeight;
      const sectionId = section.getAttribute("id");

      if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
        navLinks.forEach((link) => {
          link.classList.remove("active");
          if (link.getAttribute("href") === `#${sectionId}`) {
            link.classList.add("active");
          }
        });
      }
    });
  }

  window.addEventListener("scroll", updateActiveNav);

  // 10. 視差滾動效果（Hero區域）
  const heroSection = document.querySelector(".hero");
  const heroBg = document.querySelector(".hero-bg img");

  if (heroSection && heroBg) {
    window.addEventListener("scroll", () => {
      const scrolled = window.scrollY;
      const heroHeight = heroSection.offsetHeight;

      if (scrolled < heroHeight) {
        const parallaxSpeed = 0.4;
        heroBg.style.transform = `scale(1.15) translateY(${scrolled * parallaxSpeed}px)`;
      }
    });
  }

  // 11. 打字機效果（可選用於標題）
  function typeWriter(element, text, speed = 100) {
    let i = 0;
    element.textContent = "";

    function type() {
      if (i < text.length) {
        element.textContent += text.charAt(i);
        i++;
        setTimeout(type, speed);
      }
    }
    type();
  }

  // 12. 神明卡片3D傾斜效果
  const godCards = document.querySelectorAll(".god-card");

  godCards.forEach((card) => {
    card.addEventListener("mousemove", (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = (y - centerY) / 20;
      const rotateY = (centerX - x) / 20;

      card.querySelector(".card-inner").style.transform =
        `translateY(-20px) perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    });

    card.addEventListener("mouseleave", () => {
      card.querySelector(".card-inner").style.transform = "translateY(0)";
    });
  });

  // 13. 圖庫點擊放大效果
  const galleryItems = document.querySelectorAll(".gallery-item");

  galleryItems.forEach((item) => {
    item.addEventListener("click", () => {
      const img = item.querySelector("img");
      const overlay = document.createElement("div");
      overlay.className = "lightbox-overlay";
      overlay.innerHTML = `
                <div class="lightbox-content">
                    <img src="${img.src}" alt="${img.alt}">
                    <button class="lightbox-close">&times;</button>
                </div>
            `;

      overlay.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0,0,0,0.9);
                display: flex;
                justify-content: center;
                align-items: center;
                z-index: 10000;
                animation: fadeIn 0.3s ease;
            `;

      overlay.querySelector(".lightbox-content").style.cssText = `
                position: relative;
                max-width: 90%;
                max-height: 90%;
            `;

      overlay.querySelector("img").style.cssText = `
                max-width: 100%;
                max-height: 85vh;
                object-fit: contain;
                border-radius: 4px;
            `;

      overlay.querySelector(".lightbox-close").style.cssText = `
                position: absolute;
                top: -40px;
                right: 0;
                background: none;
                border: none;
                color: white;
                font-size: 2.5rem;
                cursor: pointer;
                transition: transform 0.3s;
            `;

      document.body.appendChild(overlay);
      document.body.style.overflow = "hidden";

      overlay.addEventListener("click", (e) => {
        if (
          e.target === overlay ||
          e.target.classList.contains("lightbox-close")
        ) {
          overlay.style.animation = "fadeOut 0.3s ease";
          setTimeout(() => {
            overlay.remove();
            document.body.style.overflow = "";
          }, 300);
        }
      });
    });
  });

  // 添加 CSS 動畫
  const style = document.createElement("style");
  style.textContent = `
        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }
        @keyframes fadeOut {
            from { opacity: 1; }
            to { opacity: 0; }
        }
        @keyframes badgePop {
            0% { transform: scale(0.8); opacity: 0; }
            50% { transform: scale(1.1); }
            100% { transform: scale(1); opacity: 1; }
        }
        .menu a.active {
            color: #A83838;
        }
        .menu a.active::after {
            width: 100%;
        }
        .lightbox-close:hover {
            transform: rotate(90deg);
        }
    `;
  document.head.appendChild(style);

  console.log("🛕 岡山大埕代天府網站已載入完成");
});
