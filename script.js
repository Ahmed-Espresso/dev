// الكود الرئيسي
let currentLang = localStorage.getItem('lang') || 'ar';
let currentTheme = localStorage.getItem('theme') || 'dark';
const lemonThemeStyle = document.getElementById('lemon-theme');

// تأكد من صحة قيمة الثيم
if (currentTheme !== 'dark' && currentTheme !== 'lemon') {
    currentTheme = 'dark';
    localStorage.setItem('theme', currentTheme);
}

// تعيين اللغة والاتجاه
document.documentElement.lang = currentLang;
document.documentElement.dir = currentLang === 'ar' ? 'rtl' : 'ltr';
document.getElementById('language-toggle').textContent = currentLang === 'ar' ? 'EN' : 'AR';

// تطبيق الثيم عند التحميل
function applyTheme() {
    if (currentTheme === 'lemon') {
        document.body.classList.add('light-theme');
        lemonThemeStyle.disabled = false;
    } else {
        document.body.classList.remove('light-theme');
        lemonThemeStyle.disabled = true;
    }
}

// حدث تبديل الثيم
document.getElementById('theme-toggle').addEventListener('click', () => {
    currentTheme = currentTheme === 'dark' ? 'lemon' : 'dark';
    localStorage.setItem('theme', currentTheme);
    applyTheme();
});

// حدث تبديل اللغة
document.getElementById('language-toggle').addEventListener('click', async () => {
    currentLang = currentLang === 'ar' ? 'en' : 'ar';
    localStorage.setItem('lang', currentLang);
    document.documentElement.lang = currentLang;
    document.documentElement.dir = currentLang === 'ar' ? 'rtl' : 'ltr';
    document.getElementById('language-toggle').textContent = currentLang === 'ar' ? 'EN' : 'AR';
    await updateLanguageSettings();
});

// التهيئة الأولية
document.addEventListener('DOMContentLoaded', () => {
    applyTheme();
});
// تحديث اللغة والمشاريع
async function updateLanguageSettings() {
    await loadLanguage();
    await loadProjects();
}

// تحميل اللغة من ملف JSON
async function loadLanguage() {
    try {
        const response = await fetch(`lang/${currentLang}.json`);
        const translations = await response.json();
        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.getAttribute('data-i18n');
            el.textContent = translations[key] || key;
        });
    } catch (error) {
        console.error("Error loading language file:", error);
    }
}

// تحميل المشاريع من ملف JSON
async function loadProjects() {
    try {
        const response = await fetch(`products/${currentLang}-products.json`);
        const projects = await response.json();
        const projectsContainer = document.querySelector('.projects-grid');
        projectsContainer.innerHTML = "";

        projects.forEach((project, index) => {
            const projectCard = document.createElement('div');
            projectCard.className = 'project-card';
            
            // إعدادات الأنيميشن الأولية
            projectCard.style.opacity = '0';
            projectCard.style.transform = 'translateY(30px)';
            projectCard.style.transition = `
                opacity 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94) ${index * 0.15}s,
                transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94) ${index * 0.15}s
            `;

            // العناصر الجانبية
            const edgeLeft = document.createElement('div');
            edgeLeft.className = 'edge-left';
            const edgeRight = document.createElement('div');
            edgeRight.className = 'edge-right';
            projectCard.append(edgeLeft, edgeRight);

            // حاوية الوسائط
            const mediaContainer = document.createElement('div');
            mediaContainer.className = 'project-media';
            
            // الكاروسيل
            const carouselContainer = document.createElement('div');
            carouselContainer.className = 'carousel-container';
            
            // الشرائح
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

            // عناصر التحكم
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

            // محتوى البطاقة
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

            // تهيئة الكاروسيل
            initializeCarousel(projectCard);

            // مراقبة ظهور العنصر
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

    // أحداث التنقل
    const navigate = (direction) => {
        stopAutoPlay();
        updateSlide(currentIndex + direction);
        startAutoPlay();
    };

    prevArrow.addEventListener('click', () => navigate(-1));
    nextArrow.addEventListener('click', () => navigate(1));

    // التنقل بالنقاط
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            stopAutoPlay();
            updateSlide(index);
            startAutoPlay();
        });
    });

    // السحب على الهاتف
    const hammer = new Hammer(projectCard.querySelector('.project-media'));
    hammer.on('swipeleft', () => navigate(1));
    hammer.on('swiperight', () => navigate(-1));

    // التنقل بالنقر
    projectCard.querySelector('.project-media').addEventListener('click', (e) => {
        const rect = e.target.getBoundingClientRect();
        const x = e.clientX - rect.left;
        x > rect.width / 2 ? navigate(1) : navigate(-1);
    });

    // إدارة حالة ال hover
    projectCard.querySelector('.project-media').addEventListener('mouseenter', () => {
        isHovered = true;
        stopAutoPlay();
        projectCard.style.transition = 'none';
    });
    
    projectCard.querySelector('.project-media').addEventListener('mouseleave', () => {
        isHovered = false;
        startAutoPlay();
        projectCard.style.transition = `
            opacity 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94),
            transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)
        `;
    });

    // بدء التشغيل التلقائي
    startAutoPlay();

    // إدارة حالة النافذة
    window.addEventListener('blur', stopAutoPlay);
    window.addEventListener('focus', startAutoPlay);
}

// أحداث التحميل الأولية
document.addEventListener('DOMContentLoaded', async () => {
    await updateLanguageSettings();
    
    // تفعيل الأنيميشن للعناصر المرئية مباشرة
    setTimeout(() => {
        document.querySelectorAll('.project-card').forEach(card => {
            const rect = card.getBoundingClientRect();
            if (rect.top < window.innerHeight * 1.2) {
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }
        });
    }, 500);
});

// إعادة حساب الأنيميشن عند تغيير الحجم
window.addEventListener('resize', () => {
    document.querySelectorAll('.project-card').forEach(card => {
        const rect = card.getBoundingClientRect();
        if (rect.top < window.innerHeight && card.style.opacity !== '1') {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }
    });
});

// تأثير الفضاء (النجوم المتحركة)
const canvas = document.getElementById('space');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let stars = [];
function createStar() {
    stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * 1.1,
        speed: Math.random() * 0.2
    });
}

function drawStars() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    stars.forEach(star => {
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        ctx.fillStyle = 'white';
        ctx.fill();
        star.y += star.speed;
        if (star.y > canvas.height) {
            star.y = 0;
            star.x = Math.random() * canvas.width;
        }
    });
}

function animate() {
    drawStars();
    requestAnimationFrame(animate);
}

for (let i = 0; i < 400; i++) createStar();
animate();

// دالة لتحديد الزر النشط في النافبار
function setActiveNavLink() {
    const navLinks = document.querySelectorAll('.nav-links a');
    const currentPage = window.location.pathname.split('/').pop() || 'index.html'; // الحصول على اسم الملف الحالي

    navLinks.forEach(link => {
        const linkHref = link.getAttribute('href');
        if (linkHref === currentPage) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
}

// تحديث الزر النشط عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', () => {
    setActiveNavLink();
});

// زر إرسال إلى واتساب

  
document.getElementById('quick-contact-form').addEventListener('submit', function (e) {
    e.preventDefault(); // منع إرسال النموذج بالطريقة التقليدية

    // جمع بيانات الحقول
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const message = document.getElementById('message').value;

    // تنسيق الرسالة
    const whatsappMessage = `مرحبًا، أنا ${name} (${email}). أود أن أتواصل معك بخصوص: ${message}`;

    // ترميز الرسالة لاستخدامها في الرابط
    const encodedMessage = encodeURIComponent(whatsappMessage);

    // إنشاء رابط واتساب
    const whatsappUrl = `https://wa.me/201030851648?text=${encodedMessage}`;

    // فتح الرابط في نافذة جديدة
    window.open(whatsappUrl, '_blank');
});

// زر إرسال إلى الجيميل
document.getElementById('send-email').addEventListener('click', function () {
    // جمع بيانات الحقول
    const name = document.getElementById('name');
    const email = document.getElementById('email');
    const message = document.getElementById('message');

    // التحقق من أن الحقول ليست فارغة
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

    // تنسيق الرسالة
    const subject = `رسالة جديدة من ${name.value}`;
    const body = `مرحبًا، أنا ${name.value} (${email.value}). أود أن أتواصل معك بخصوص: ${message.value}`;

    // إنشاء رابط mailto
    const mailtoUrl = `mailto:dev.espressoahmed@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

    // فتح الرابط
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










// إنشاء وإدارة تذكير الصلاة على النبي
function createPrayerAlert() {
    const alertDiv = document.createElement('div');
    alertDiv.className = 'prayer-alert';
    alertDiv.textContent = 'صلي على محمد ﷺ';
    document.body.appendChild(alertDiv);
    
    let isFirstTime = true;

    function showAlert() {
        alertDiv.style.animation = 'slideDown 0.5s ease-out forwards';
        alertDiv.style.opacity = '1';
        alertDiv.style.visibility = 'visible';
        
        // إخفاء بعد 3 ثواني
        setTimeout(() => {
            alertDiv.style.animation = 'none';
            alertDiv.style.opacity = '0';
            alertDiv.style.visibility = 'hidden';
        }, 3000);
    }

    // التشغيل الأول بعد دقيقة كاملة
    setTimeout(() => {
        showAlert();
        // تكرار كل دقيقة بعد ذلك
        setInterval(showAlert, 60000);
    }, 60000);
}

window.addEventListener('DOMContentLoaded', () => {
    createPrayerAlert();
});
