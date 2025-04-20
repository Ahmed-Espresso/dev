
(function initTheme() {
    const savedTheme = localStorage.getItem('theme') || 'dark';
    document.documentElement.style.visibility = 'hidden'; // إخفاء المحتوى مؤقتًا
    document.documentElement.classList.toggle('light-theme', savedTheme === 'lemon');
    if (document.getElementById('lemon-theme')) {
        document.getElementById('lemon-theme').disabled = savedTheme !== 'lemon';
    }
    document.addEventListener('DOMContentLoaded', () => {
        document.documentElement.style.visibility = 'visible';
    });
})();

// ============================================================
// الإعدادات الأولية للغة والثيم
// ============================================================
let currentLang = localStorage.getItem('lang') || 'ar';
let currentTheme = localStorage.getItem('theme') || 'dark';
const lemonThemeStyle = document.getElementById('lemon-theme');

if (currentTheme !== 'dark' && currentTheme !== 'lemon') {
  currentTheme = 'dark';
  localStorage.setItem('theme', currentTheme);
}

// تعيين لغة الصفحة واتجاهها
document.documentElement.lang = currentLang;
document.documentElement.dir = currentLang === 'ar' ? 'rtl' : 'ltr';
document.getElementById('language-toggle').textContent = currentLang === 'ar' ? 'EN' : 'AR';

// تعيين انتقال عام للمحتوى
document.body.style.transition = "background 6s ease, color 6s ease";

// ============================================================
// إعداد الكانفس للوضع الليلي (الفضائي)
// ============================================================
const darkCanvas = document.getElementById('space');
const darkCtx = darkCanvas.getContext('2d');
darkCanvas.width = window.innerWidth;
darkCanvas.height = window.innerHeight;

let stars = [];
function createStar() {
  stars.push({
    x: Math.random() * darkCanvas.width,
    y: Math.random() * darkCanvas.height,
    radius: Math.random() * 1.1,
    speed: Math.random() * 0.2
  });
}
function drawDarkStars() {
  stars.forEach(star => {
    darkCtx.beginPath();
    darkCtx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
    darkCtx.fillStyle = 'white';
    darkCtx.fill();
    // تحديث موقع النجم
    star.y += star.speed;
    if (star.y > darkCanvas.height) {
      star.y = 0;
      star.x = Math.random() * darkCanvas.width;
    }
  });
}
function animateDark() {
  darkCtx.clearRect(0, 0, darkCanvas.width, darkCanvas.height);
  drawDarkStars();
  requestAnimationFrame(animateDark);
}
function initDarkScene() {
  darkCanvas.width = window.innerWidth;
  darkCanvas.height = window.innerHeight;
  stars = [];
  for (let i = 0; i < 400; i++) {
    createStar();
  }
}

// ============================================================
// إعداد الكانفس للوضع النهاري (الليموني)
// ============================================================
let lemonCanvas = document.getElementById('lemon-canvas');
if (!lemonCanvas) {
  lemonCanvas = document.createElement('canvas');
  lemonCanvas.id = 'lemon-canvas';
  document.body.appendChild(lemonCanvas);
}
const lemonCtx = lemonCanvas.getContext('2d');
lemonCanvas.width = window.innerWidth;
lemonCanvas.height = window.innerHeight;

let clouds = [];
let bokehParticles = [];
const numBokeh = 100;
function initLemonElements() {
  lemonCanvas.width = window.innerWidth;
  lemonCanvas.height = window.innerHeight;
  
  const isMobile = window.innerWidth <= 480;
  // إنشاء السحاب مع تقليل الحجم والسرعة على الموبايل
  clouds = [];
  const cloudCount = isMobile ? 2 : 3;
  for (let i = 0; i < cloudCount; i++) {
    clouds.push({
      x: Math.random() * lemonCanvas.width,
      y: Math.random() * (lemonCanvas.height / 3),
      speed: isMobile ? (0.1 + Math.random() * 0.05) : (0.3 + Math.random() * 0.2),
      width: isMobile ? (50 + Math.random() * 20) : (100 + Math.random() * 50),
      height: isMobile ? (25 + Math.random() * 10) : (50 + Math.random() * 20)
    });
  }
  initBokeh();
}
function initBokeh() {
  bokehParticles = [];
  for (let i = 0; i < numBokeh; i++) {
    bokehParticles.push({
      x: Math.random() * lemonCanvas.width,
      y: Math.random() * lemonCanvas.height,
      radius: Math.random() * 1.5 + 0.5,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      alpha: Math.random() * 0.5 + 0.5,
      phase: Math.random() * Math.PI * 2
    });
  }
}
function updateBokeh() {
  bokehParticles.forEach(p => {
    p.x += p.vx;
    p.y += p.vy;
    p.phase += 0.02;
    p.alpha = 0.5 + 0.5 * Math.sin(p.phase);
    if (p.x < 0) p.x = lemonCanvas.width;
    if (p.x > lemonCanvas.width) p.x = 0;
    if (p.y < 0) p.y = lemonCanvas.height;
    if (p.y > lemonCanvas.height) p.y = 0;
  });
}
function drawBokeh() {
  bokehParticles.forEach(p => {
    lemonCtx.beginPath();
    lemonCtx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
    lemonCtx.fillStyle = `rgba(255, 255, 255, ${p.alpha})`;
    lemonCtx.shadowBlur = 10;
    lemonCtx.shadowColor = 'rgba(255, 255, 255, 0.8)';
    lemonCtx.fill();
  });
  lemonCtx.shadowBlur = 0;
}
function drawLemonScene() {
  // 1. رسم تدرج الخلفية
  const gradient = lemonCtx.createLinearGradient(0, 0, 0, lemonCanvas.height);
  gradient.addColorStop(0, '#29B6F6');
  gradient.addColorStop(1, '#0288D1');
  lemonCtx.fillStyle = gradient;
  lemonCtx.fillRect(0, 0, lemonCanvas.width, lemonCanvas.height);
  
  // 2. رسم الشمس في الزاوية العليا اليمنى
  const sunX = lemonCanvas.width - 100;
  const sunY = 100;
  const sunRadius = 50;
  const sunGradient = lemonCtx.createRadialGradient(sunX, sunY, sunRadius * 0.1, sunX, sunY, sunRadius);
  sunGradient.addColorStop(0, 'rgba(255, 255, 204, 1)');
  sunGradient.addColorStop(1, 'rgba(255, 255, 204, 0)');
  lemonCtx.beginPath();
  lemonCtx.arc(sunX, sunY, sunRadius, 0, Math.PI * 2);
  lemonCtx.fillStyle = sunGradient;
  lemonCtx.fill();
  
  // 3. رسم السحاب
  lemonCtx.fillStyle = 'rgba(255, 255, 255, 0.8)';
  clouds.forEach(cloud => {
    lemonCtx.beginPath();
    lemonCtx.arc(cloud.x, cloud.y, cloud.height * 0.6, 0, Math.PI * 2);
    lemonCtx.arc(cloud.x + cloud.width * 0.3, cloud.y - cloud.height * 0.2, cloud.height * 0.7, 0, Math.PI * 2);
    lemonCtx.arc(cloud.x + cloud.width * 0.6, cloud.y, cloud.height * 0.6, 0, Math.PI * 2);
    lemonCtx.fill();
    // تحديث موقع السحاب
    cloud.x += cloud.speed;
    if (cloud.x - cloud.width > lemonCanvas.width) {
      cloud.x = -cloud.width;
    }
  });
  
  // 4. رسم تأثير البوكيه
  updateBokeh();
  drawBokeh();
}
function animateLemon() {
  lemonCtx.clearRect(0, 0, lemonCanvas.width, lemonCanvas.height);
  drawLemonScene();
  requestAnimationFrame(animateLemon);
}

// ============================================================
// تطبيق الثيم عبر تغيير opacity (كروسفيد)
// ============================================================


function applyTheme(initialLoad = false) {
  // جلب الثيم من localStorage أو الافتراضي dark
  const theme = localStorage.getItem('theme') || 'dark';
  const html = document.documentElement;

  // تعطيل الانتقال مؤقتاً على الـ HTML
  html.style.transition = 'none';

  // تبديل الكلاس الخاص بالثيم بناءً على قيمة الثيم
  html.classList.toggle('light-theme', theme === 'lemon');

  if (theme === 'lemon') {
    if (lemonThemeStyle) lemonThemeStyle.disabled = false;
    document.getElementById('theme-toggle').textContent = '🌤️ ';
    if (initialLoad) {
      lemonCanvas.style.transition = "none";
      darkCanvas.style.transition = "none";
      lemonCanvas.style.opacity = "1";
      darkCanvas.style.opacity = "0";
      setTimeout(() => {
        lemonCanvas.style.transition = "opacity 6s ease";
        darkCanvas.style.transition = "opacity 6s ease";
      }, 100);
    } else {
      lemonCanvas.style.opacity = "1";
      darkCanvas.style.opacity = "0";
    }
  } else {
    if (lemonThemeStyle) lemonThemeStyle.disabled = true;
    document.getElementById('theme-toggle').textContent = '🌙';
    if (initialLoad) {
      lemonCanvas.style.transition = "none";
      darkCanvas.style.transition = "none";
      lemonCanvas.style.opacity = "0";
      darkCanvas.style.opacity = "1";
      setTimeout(() => {
        lemonCanvas.style.transition = "opacity 6s ease";
        darkCanvas.style.transition = "opacity 6s ease";
      }, 100);
    } else {
      darkCanvas.style.opacity = "1";
      lemonCanvas.style.opacity = "0";
    }
  }

  // تعيين خاصية اتجاه المؤشر بناءً على اللغة
  html.style.setProperty('--cursor-direction', currentLang === 'ar' ? 'right' : 'left');

  // إذا وُجد عنصر لتطبيق ثيم الليمون يتم تفعيل/تعطيل ملف الستايل الخاص به
  if (document.getElementById('lemon-theme')) {
    document.getElementById('lemon-theme').disabled = theme !== 'lemon';
  }

  // إعادة تفعيل الانتقالات بعد تأخير بسيط
  setTimeout(() => {
    html.style.transition = '';
  }, 10);
}

// حدث تبديل الثيم
document.getElementById('theme-toggle').addEventListener('click', () => {
  document.body.style.transition = "all 6s ease";
  const currentTheme = localStorage.getItem('theme') || 'dark';
  const newTheme = currentTheme === 'dark' ? 'lemon' : 'dark';
  localStorage.setItem('theme', newTheme);
  applyTheme();
});

document.getElementById('language-toggle').addEventListener('click', async () => {
  currentLang = currentLang === 'ar' ? 'en' : 'ar';
  localStorage.setItem('lang', currentLang);
  document.documentElement.lang = currentLang;
  document.documentElement.dir = currentLang === 'ar' ? 'rtl' : 'ltr';
  document.getElementById('language-toggle').textContent = currentLang === 'ar' ? 'EN' : 'AR';
  await updateLanguageSettings();
updateContactForm(); 
  refreshCountdown(); 
});

// ============================================================
// التهيئة الأولية عند تحميل الصفحة
// ============================================================


document.addEventListener('DOMContentLoaded', async () => {
  applyTheme(true);
  setActiveNav();
  initDarkScene();
  initLemonElements();
  animateDark();
  animateLemon();
  
  // الترتيب الصحيح للتحميل:
  await loadLanguage(); // 1. تحميل اللغة أولاً
  initTypingEffect();   // 2. تهيئة التأثير بعد تحميل اللغة
  
  await loadFAQ();      // 3. ثم تحميل الأسئلة الشائعة
  await loadProjects(); // 4. ثم تحميل المشاريع
  
  // ... بقية الكود
  await updateLanguageSettings();
  
 
  setTimeout(() => {
    document.querySelectorAll('.project-card').forEach(card => {
      const rect = card.getBoundingClientRect();
      if (rect.top < window.innerHeight * 1.2) {
        card.style.opacity = '1';
        card.style.transform = 'translateY(0)';
      }
    });
  }, 500);

initializeRamadanCountdown();
});

// تحديث حجم الكانفس عند تغيير حجم النافذة
window.addEventListener('resize', () => {
  darkCanvas.width = window.innerWidth;
  darkCanvas.height = window.innerHeight;
  lemonCanvas.width = window.innerWidth;
  lemonCanvas.height = window.innerHeight;
});

// ============================================================
// تحميل اللغة والمشاريع (وظائف متعلقة بالمحتوى)
// ============================================================
async function updateLanguageSettings() {
  await loadLanguage();
  await loadProjects();
}
async function loadLanguage() {
  try {
    const response = await fetch(`lang/${currentLang}.json`);
    translations = await response.json();
    
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
        el.placeholder = translations[key] || key;
      } else if (el.id !== 'typing-container') {
        el.textContent = translations[key] || key;
      }
    });
    
    if (window.typingEffect) {
      window.typingEffect.restart();
    }
    document.querySelector('.blinking-cursor').style.marginLeft = 
      currentLang === 'ar' ? '0' : '0.3em';
  } catch (error) {
    console.error("Error loading language file:", error);
  }
}


async function loadProjects() {
  try {
    const response = await fetch(`products/${currentLang}-products.json`);
    const projects = await response.json();
    const projectsContainer = document.querySelector('.projects-grid');
    projectsContainer.innerHTML = "";
    projects.forEach((project, index) => {
      const projectCard = document.createElement('div');
      projectCard.className = 'project-card';
      projectCard.style.opacity = '0';
      projectCard.style.transform = 'translateY(30px)';
      projectCard.style.transition = `
        opacity 3s cubic-bezier(0.25, 0.46, 0.45, 0.94) ${index * 0.15}s,
        transform 3s cubic-bezier(0.25, 0.46, 0.45, 0.94) ${index * 0.15}s
      `;
      const edgeLeft = document.createElement('div');
      edgeLeft.className = 'edge-left';
      const edgeRight = document.createElement('div');
      edgeRight.className = 'edge-right';
      projectCard.append(edgeLeft, edgeRight);
      
      const mediaContainer = document.createElement('div');
      mediaContainer.className = 'project-media';
      const carouselContainer = document.createElement('div');
      carouselContainer.className = 'carousel-container';
      project.images.forEach((image, imgIndex) => {
        const slide = document.createElement('div');
        slide.className = `carousel-slide ${imgIndex === 0 ? 'active' : ''}`;
        const img = document.createElement('img');
        img.src = image;
        img.alt = project.title;
        img.className = 'carousel-image';
        slide.appendChild(img);
        carouselContainer.appendChild(slide);
      });
      const prevArrow = document.createElement('button');
      prevArrow.className = 'nav-arrow prev';
      prevArrow.innerHTML = '‹';
      const nextArrow = document.createElement('button');
      nextArrow.className = 'nav-arrow next';
      nextArrow.innerHTML = '›';
      const dotsContainer = document.createElement('div');
      dotsContainer.className = 'carousel-controls';
      project.images.forEach((_, dotIndex) => {
        const dot = document.createElement('div');
        dot.className = `carousel-dot ${dotIndex === 0 ? 'active' : ''}`;
        dotsContainer.appendChild(dot);
      });
      mediaContainer.append(carouselContainer, prevArrow, nextArrow, dotsContainer);
      
      const contentContainer = document.createElement('div');
      contentContainer.className = 'project-content';
      const title = document.createElement('h3');
      title.className = 'project-title';
      title.textContent = project.title;
      const description = document.createElement('p');
      description.className = 'project-description';
      description.textContent = project.description;
      const link = document.createElement('a');
      link.className = 'project-link';
      link.href = project.links[0].url;
      link.target = '_blank';
      link.innerHTML = `
        <span>${project.links[0].text}</span>
        <i class="${project.links[0].icon}"></i>
      `;
      contentContainer.append(title, description, link);
      projectCard.append(mediaContainer, contentContainer);
      projectsContainer.appendChild(projectCard);
      
      initializeCarousel(projectCard);
      
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            projectCard.style.opacity = '1';
            projectCard.style.transform = 'translateY(0)';
            observer.unobserve(projectCard);
          }
        });
      }, { 
        root: null,
        rootMargin: '0px',
        threshold: 0.15
      });
      observer.observe(projectCard);
    });
  } catch (error) {
    console.error("Error loading projects:", error);
    const projectsContainer = document.querySelector('.projects-grid');
    projectsContainer.innerHTML = `<p class="error">${currentLang === 'ar' ? 
      '⚠️ حدث خطأ في تحميل المشاريع' : '⚠️ Error loading projects'}</p>`;
  }
}
function initializeCarousel(projectCard) {
  const slides = projectCard.querySelectorAll('.carousel-slide');
  const dots = projectCard.querySelectorAll('.carousel-dot');
  const prevArrow = projectCard.querySelector('.prev');
  const nextArrow = projectCard.querySelector('.next');
  
  let currentIndex = 0;
  let autoPlayInterval;
  let isHovered = false;
  
  const updateSlide = (newIndex) => {
    slides[currentIndex].classList.remove('active');
    dots[currentIndex].classList.remove('active');
    currentIndex = (newIndex + slides.length) % slides.length;
    slides[currentIndex].classList.add('active');
    dots[currentIndex].classList.add('active');
  };
  
  const startAutoPlay = () => {
    if (!isHovered) {
      autoPlayInterval = setInterval(() => {
        updateSlide(currentIndex + 1);
      }, 3000);
    }
  };
  
  const stopAutoPlay = () => {
    clearInterval(autoPlayInterval);
  };
  
  const navigate = (direction) => {
    stopAutoPlay();
    updateSlide(currentIndex + direction);
    startAutoPlay();
  };
  
  prevArrow.addEventListener('click', () => navigate(-1));
  nextArrow.addEventListener('click', () => navigate(1));
  
  dots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
      stopAutoPlay();
      updateSlide(index);
      startAutoPlay();
    });
  });
  
  if (typeof Hammer !== 'undefined') {
    const hammer = new Hammer(projectCard.querySelector('.project-media'));
    hammer.on('swipeleft', () => navigate(1));
    hammer.on('swiperight', () => navigate(-1));
  }
  
  projectCard.querySelector('.project-media').addEventListener('click', (e) => {
    const rect = e.target.getBoundingClientRect();
    const x = e.clientX - rect.left;
    x > rect.width / 2 ? navigate(1) : navigate(-1);
  });
  
  projectCard.querySelector('.project-media').addEventListener('mouseenter', () => {
    isHovered = true;
    stopAutoPlay();
    projectCard.style.transition = 'none';
  });
  
  projectCard.querySelector('.project-media').addEventListener('mouseleave', () => {
    isHovered = false;
    startAutoPlay();
    projectCard.style.transition = `
      opacity 3s cubic-bezier(0.25, 0.46, 0.45, 0.94),
      transform 3s cubic-bezier(0.25, 0.46, 0.45, 0.94)
    `;
  });
  
  startAutoPlay();
  window.addEventListener('blur', stopAutoPlay);
  window.addEventListener('focus', startAutoPlay);
}


// ----------------------------
// إدارة الأسئلة الشائعة (FAQ)
// ----------------------------
// 1. تعديل دالة loadLanguage لتصبح متاحة للجميع
async function loadLanguage() {
  try {
    const response = await fetch(`lang/${currentLang}.json`);
    translations = await response.json();
    
    // تحديث جميع العناصر التي تحتوي على data-i18n
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      
      if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
        // معالجة حقول الإدخال والنصوص
        el.placeholder = translations[key] || key;
      } else {
        // معالجة العناصر الأخرى
        el.textContent = translations[key] || key;
      }
    });

    // تحديث الإجابة إذا كانت معروضة
    const answerContent = document.querySelector('.answer-content');
    if (answerContent) {
      updateTextContent(answerContent);
    }

  } catch (error) {
    console.error("Error loading language file:", error);
  }
}
// 2. تعديل دالة loadFAQ
async function loadFAQ() {
  try {
    const response = await fetch('faq.json');
    const faqData = await response.json();
    
    // تمرير بيانات الأسئلة إلى renderFAQ
    renderFAQ(faqData);
    
    // تطبيق الترجمات بعد التحميل
    applyFAQTranslations();
    
  } catch (error) {
    console.error('Error loading FAQ:', error);
    // عرض رسالة خطأ مترجمة
    const errorMsg = document.createElement('p');
    errorMsg.className = 'error';
    errorMsg.setAttribute('data-i18n', 'load_faq_error');
    document.getElementById('faqGrid').appendChild(errorMsg);
    updateTextContent(errorMsg);
  }
}

// 3. تعديل renderFAQ لإعادة استخدام البيانات
let faqQuestions = []; // تخزين الأسئلة للوصول إليها لاحقًا

function renderFAQ(questions) {
  faqQuestions = questions; // حفظ الأسئلة في متغير عام
  
  const grid = document.getElementById('faqGrid');
  if (!grid) {
    console.error('FAQ grid container not found!');
    return;
  }
  
  grid.innerHTML = questions.map(question => `
    <div class="faq-item">
      <button class="faq-btn" 
              style="border-color: ${question.color}"
              data-id="${question.id}">
        <i class="${question.icon}"></i>
        <span data-i18n="${question.question}"></span>
      </button>
    </div>
  `).join('');
  // تعيين اللون لكل عنصر FAQ بناءً على قيمة question.color
  const faqItems = grid.querySelectorAll('.faq-item');
  faqItems.forEach((item, index) => {
    const question = faqQuestions[index];
    item.style.setProperty('--faq-color', question.color);
  });

  // ربط الأحداث مع كل زر سؤال
  document.querySelectorAll('.faq-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const questionId = btn.dataset.id;
      const question = faqQuestions.find(q => q.id == questionId);
      if (question) displayAnswer(question);
    });
  });
}

  function displayAnswer(question) {
  const answerBox = document.getElementById('answerBox');
  const answerContent = answerBox?.querySelector('.answer-content');

  if (!answerBox || !answerContent) {
    console.error('Answer container not found!');
    return;
  }
   answerBox.style.borderColor = question.color;
  answerContent.style.color = question.color;
  
  // تعيين اللون على الحاوية والإجابة
  answerBox.style.setProperty('--faq-color', question.color);
  answerContent.style.color = question.color;

  // تعيين الترجمة للإجابة وتحديث المحتوى
  answerContent.setAttribute('data-i18n', question.answer);
  updateTextContent(answerContent);
}
  

function applyFAQTranslations() {
  document.querySelectorAll('.faq-btn [data-i18n]').forEach(updateTextContent);
}

function updateTextContent(element) {
  const key = element.getAttribute('data-i18n');
  element.textContent = translations[key] || key;
}

// تحديث حقول التواصل السريع
function updateContactForm() {
  document.getElementById('name').placeholder = translations['namesmall'] || 'اسمك';
  document.getElementById('email').placeholder = translations['emailsmall'] || 'بريدك الإلكتروني';
  document.getElementById('message').placeholder = translations['messagesmall'] || 'رسالتك';
}

function refreshCountdown() {
  const countdownElement = document.querySelector('.offer-countdown');
  if (countdownElement) {
    countdownElement.innerHTML = `
      <div class="offer-header" data-i18n="offer_header"></div>
      <div class="offer-timer">
        <span id="offer-days">00</span>
        <span class="separator">:</span>
        <span id="offer-hours">00</span>
        <span class="separator">:</span>
        <span id="offer-minutes">00</span>
      </div>
      <div class="labels-container">
        <span class="time-label" data-i18n="days"></span>
        <span class="time-label" data-i18n="hours"></span>
        <span class="time-label" data-i18n="minutes"></span>
      </div>
    `;
    initializePermanentCountdown();
  }
}

// ============================================================
// زر إرسال إلى واتساب
// ============================================================
document.getElementById('quick-contact-form').addEventListener('submit', function (e) {
  e.preventDefault();

  const name = document.getElementById('name').value;
  const email = document.getElementById('email').value;
  const message = document.getElementById('message').value;

  const whatsappMessage = `مرحبًا، أنا ${name} (${email}). أود أن أتواصل معك بخصوص: ${message}`;
  const encodedMessage = encodeURIComponent(whatsappMessage);
  const whatsappUrl = `https://wa.me/201030851648?text=${encodedMessage}`;

  window.open(whatsappUrl, '_blank');
});

// ============================================================
// زر إرسال إلى الجيميل
// ============================================================
document.getElementById('send-email').addEventListener('click', function () {
  const name = document.getElementById('name');
  const email = document.getElementById('email');
  const message = document.getElementById('message');

  if (!name.value) {
      name.focus();
      showNotification("برجاء إدخال الاسم أولاً");
      return;
  }
  if (!email.value) {
      email.focus();
      showNotification("برجاء إدخال البريد الإلكتروني");
      return;
  }
  if (!message.value) {
      message.focus();
      showNotification("برجاء إدخال الرسالة");
      return;
  }

  const subject = `رسالة جديدة من ${name.value}`;
  const body = `مرحبًا، أنا ${name.value} (${email.value}). أود أن أتواصل معك بخصوص: ${message.value}`;
  const mailtoUrl = `mailto:dev.espressoahmed@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

  window.location.href = mailtoUrl;
});

function showNotification(message) {
  let notification = document.getElementById('notification');
  if (!notification) {
      notification = document.createElement('div');
      notification.id = 'notification';
      notification.className = 'notification';
      document.body.appendChild(notification);
  }
  
  notification.textContent = message;
  notification.classList.add('show');

  setTimeout(() => {
      notification.classList.remove('show');
  }, 3000);
}

// ============================================================
// إنشاء وإدارة تذكير الصلاة على النبي
// ============================================================
function createPrayerAlert() {
  const alertDiv = document.createElement('div');
  alertDiv.className = 'prayer-alert';
  alertDiv.textContent = 'صلي على محمد ﷺ';
  document.body.appendChild(alertDiv);
  
  function showAlert() {
      alertDiv.style.animation = 'slideDown 0.5s ease-out forwards';
      alertDiv.style.opacity = '1';
      alertDiv.style.visibility = 'visible';
      
      setTimeout(() => {
          alertDiv.style.animation = 'none';
          alertDiv.style.opacity = '0';
          alertDiv.style.visibility = 'hidden';
      }, 3000);
  }

  // التشغيل الأول بعد دقيقة واحدة ومن ثم كل دقيقة
  setTimeout(() => {
      showAlert();
      setInterval(showAlert, 60000);
  }, 60000);
}

window.addEventListener('DOMContentLoaded', () => {
  createPrayerAlert();
});




// ======= أضف هذا الكود في نهاية الملف (قبل النهاية) =======

// تفعيل الأزرار النشطة حسب الصفحة
function setActiveNav() {
    const currentPage = window.location.pathname.split('/').pop().toLowerCase();
    const navLinks = document.querySelectorAll('.nav-links a');
    
    navLinks.forEach(link => {
        const linkPage = link.getAttribute('href').toLowerCase();
        const isActive = linkPage === currentPage || (currentPage === '' && linkPage === 'index.html');
        link.classList.toggle('active', isActive);
    });
}

// تحديث حالة الأزرار عند التحميل أو تغيير الصفحة
window.addEventListener('popstate', setActiveNav);
document.addEventListener('DOMContentLoaded', setActiveNav);

// ============================================================
// تأثير الكتابة التقدمي (النسخة المصححة)
// ============================================================

// عدل دالة initTypingEffect كالتالي:

function initTypingEffect() {
  const container = document.getElementById('typing-container');
  if (!container) return;
  
  let currentLine = 0;
  let intervalId;
  
  // دالة لتقسيم النص إلى أسطر بناءً على عرض الحاوية
  const calculateLines = (text, maxWidth) => {
    const words = text.split(' ');
    const lines = [];
    let currentLineText = '';
    words.forEach(word => {
      const testLine = currentLineText ? `${currentLineText} ${word}` : word;
      const testElement = document.createElement('span');
      testElement.style.visibility = 'hidden';
      testElement.style.whiteSpace = 'nowrap';
      testElement.textContent = testLine;
      document.body.appendChild(testElement);
      
      if (testElement.offsetWidth > maxWidth) {
        lines.push(currentLineText);
        currentLineText = word;
      } else {
        currentLineText = testLine;
      }
      
      document.body.removeChild(testElement);
    });
    lines.push(currentLineText);
    return lines;
  };
  
  // بدء تأثير الكتابة
  const startTyping = () => {
    container.innerHTML = '';
    const originalText = translations['welcome-me'] || '';
    const maxWidth = container.offsetWidth * 0.9; // 90% من عرض الحاوية
    const lines = calculateLines(originalText, maxWidth);
    currentLine = 0;
    
    const typeLine = () => {
      if (currentLine >= lines.length) {
        // عند انتهاء الكتابة: إبقاء المؤشر 4 ثوانٍ ثم إزالته
        const lastLine = container.lastElementChild;
        if (lastLine) {
          setTimeout(() => {
            const cursor = lastLine.querySelector('.blinking-cursor');
            if (cursor) cursor.remove();
          }, 4000);
        }
        return;
      }
      
      const lineDiv = document.createElement('div');
      lineDiv.className = 'typing-line';
      container.appendChild(lineDiv);
      
      const text = lines[currentLine];
      let index = 0;
      
      const typeChar = () => {
        if (index <= text.length) {
          // يعرض النص مع المؤشر الملتصق مباشرةً بنهاية النص الحالي
          lineDiv.innerHTML = text.substring(0, index) + '<span class="blinking-cursor"></span>';
          index++;
          // تأخير 150 مللي ثانية لكل حرف لتأثير أبطأ
          setTimeout(typeChar, 80);
        } else {
          // انتهاء السطر الحالي؛ إذا لم يكن آخر سطر، ننتظر 700 مللي ثانية قبل بدء السطر التالي
          if (currentLine < lines.length - 1) {
            const cursor = lineDiv.querySelector('.blinking-cursor');
            if (cursor) cursor.remove();
            currentLine++;
            setTimeout(typeLine, 700);
          } else {
            // إذا كان آخر سطر: إبقاء المؤشر لمدة 4 ثوانٍ ثم إزالته
            setTimeout(() => {
              const cursor = lineDiv.querySelector('.blinking-cursor');
              if (cursor) cursor.remove();
            }, 4000);
            currentLine++;
          }
        }
      };
      typeChar();
    };
    typeLine();
  };
  
  // التشغيل الأولي لتأثير الكتابة
  startTyping();
  
  // تعديل حجم الخط بناءً على اللغة
  const observer = new ResizeObserver(() => {
    container.style.fontSize = currentLang === 'en' ? '1.2em' : '1em';
  });
  observer.observe(container);
  
  // إعادة تشغيل التأثير كل 60 ثانية
  intervalId = setInterval(startTyping, 90000);
  
  window.addEventListener('beforeunload', () => {
    clearInterval(intervalId);
    observer.disconnect();
  });
}

// ============================================================
// إعدادات العد التنازلي الدائم
// ============================================================
function initializePermanentCountdown() {
    const targetDate = new Date(2025, 3, 20, 23, 59, 59);
    const daysEl = document.getElementById('offer-days');
    const hoursEl = document.getElementById('offer-hours');
    const minutesEl = document.getElementById('offer-minutes');
    const headerEl = document.querySelector('.offer-header');
    const separators = document.querySelectorAll('.separator');
    
    let interval; // تعريف متغير المؤقت خارج الدالة

    function updateCountdown() {
        const now = new Date();
        let diff = targetDate - now;
        const currentLang = localStorage.getItem('lang') || 'ar';
        
        // إذا انتهى الوقت، نوقف المؤقت ونعرض الرسالة
        if (diff <= 0) {
            clearInterval(interval);
            daysEl.textContent = '00';
            hoursEl.textContent = '00';
            minutesEl.textContent = '00';
            separators.forEach(sep => sep.style.visibility = 'hidden');
            
            if (headerEl) {
                headerEl.textContent = currentLang === 'ar' ? 
                    'انتهى العرض' : 
                    'Offer Expired';
            }
            return;
        }

        // إذا لم ينته الوقت، نستمر في الحساب
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

        daysEl.textContent = days.toString().padStart(2, '0');
        hoursEl.textContent = hours.toString().padStart(2, '0');
        minutesEl.textContent = minutes.toString().padStart(2, '0');

        separators.forEach(sep => sep.style.visibility = 'visible');
        
        if (headerEl) {
            headerEl.textContent = currentLang === 'ar' ? 
                'الوقت المتبقي ⏳' : 
                'Remaining ⏳';
        }
    }
    
    // التشغيل الأولي
    updateCountdown();
    interval = setInterval(updateCountdown, 1000);
    
    // تنظيف المؤقت عند إغلاق الصفحة
    window.addEventListener('beforeunload', () => clearInterval(interval));
}

// 6. استدعاء الدالة عند التحميل وتغيير اللغة
document.addEventListener('DOMContentLoaded', initializePermanentCountdown);
document.getElementById('language-toggle').addEventListener('click', initializePermanentCountdown);

        document.addEventListener("DOMContentLoaded", function () {
            const nav = document.querySelector(".light-theme nav");
            if (!nav) return; // إذا لم يكن هناك نافبار، لا تفعل شيئًا
          
            window.addEventListener("scroll", function () {
              if (window.scrollY > 50) {
                nav.classList.add("scrolled");
              } else {
                nav.classList.remove("scrolled");
              }
            });
          });



// إدارة حالة النافبار عند التمرير
window.addEventListener('scroll', () => {
    const header = document.querySelector('header');
    header.classList.toggle('header-scrolled', window.scrollY > 50);
});

// إدارة الحالة النشطة للروابط
document.querySelectorAll('.nav-links li a').forEach(link => {
    link.addEventListener('click', function() {
        document.querySelectorAll('.nav-links li a').forEach(l => l.removeAttribute('data-active'));
        this.setAttribute('data-active', 'true');
    });
});
