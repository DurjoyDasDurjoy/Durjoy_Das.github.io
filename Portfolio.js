document.addEventListener('DOMContentLoaded', function() {
    // ======================
    // LOADING SCREEN
    // ======================
    const initLoadingScreen = () => {
        const loadingScreen = document.querySelector('.loading-screen');
        if (!loadingScreen) return;

        // Simulate loading progress with realistic timing
        const progressBar = loadingScreen.querySelector('.progress-bar');
        const progressText = loadingScreen.querySelector('.progress-text');
        let progress = 0;
        
        // More realistic loading simulation with variable speed
        const simulateLoading = () => {
            // Random increment between 1-10% with different speeds
            let increment = Math.random() * 10;
            
            // Slow down at certain points for realism
            if (progress > 70 && progress < 90) {
                increment = Math.random() * 5;
            } else if (progress > 90) {
                increment = Math.random() * 2;
            }
            
            progress = Math.min(progress + increment, 100);
            
            progressBar.style.width = `${progress}%`;
            progressText.textContent = `${Math.floor(progress)}%`;
            
            if (progress < 100) {
                // Vary the timeout for more natural feel
                const delay = 50 + Math.random() * 100;
                setTimeout(simulateLoading, delay);
            } else {
                // Smooth transition out
                loadingScreen.style.opacity = '0';
                setTimeout(() => {
                    loadingScreen.style.display = 'none';
                    document.body.style.overflow = 'auto';
                    
                    // Initialize animations after loading
                    initAnimations();
                }, 500);
            }
        };

        // Start loading simulation
        setTimeout(simulateLoading, 300);
    };

    // ======================
    // UTILITY FUNCTIONS
    // ======================
    const setCurrentYear = () => {
        document.getElementById('year').textContent = new Date().getFullYear();
    };

    const debounce = (func, delay) => {
        let timeoutId;
        return function() {
            const context = this;
            const args = arguments;
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => func.apply(context, args), delay);
        };
    };

    const throttle = (func, limit) => {
        let lastFunc;
        let lastRan;
        return function() {
            const context = this;
            const args = arguments;
            if (!lastRan) {
                func.apply(context, args);
                lastRan = Date.now();
            } else {
                clearTimeout(lastFunc);
                lastFunc = setTimeout(function() {
                    if ((Date.now() - lastRan) >= limit) {
                        func.apply(context, args);
                        lastRan = Date.now();
                    }
                }, limit - (Date.now() - lastRan));
            }
        };
    };

    // ======================
    // NAVIGATION
    // ======================
    const initMobileMenu = () => {
        const hamburger = document.querySelector('.hamburger');
        const navLinks = document.querySelector('.nav-links');
        if (!hamburger || !navLinks) return;

        const toggleMenu = () => {
            hamburger.classList.toggle('active');
            navLinks.classList.toggle('active');
            document.body.classList.toggle('no-scroll');
        };

        hamburger.addEventListener('click', toggleMenu);
        
        // Close menu when clicking links
        document.querySelectorAll('.nav-links a').forEach(link => {
            link.addEventListener('click', () => {
                if (navLinks.classList.contains('active')) {
                    toggleMenu();
                }
            });
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (navLinks.classList.contains('active') && 
                !e.target.closest('.nav-links') && 
                !e.target.closest('.hamburger')) {
                toggleMenu();
            }
        });
    };

    // ======================
    // SCROLL EFFECTS
    // ======================
    const initScrollEffects = () => {
        // Header scroll effect with throttle for performance
        const header = document.querySelector('header');
        if (header) {
            const handleScroll = throttle(() => {
                header.classList.toggle('scrolled', window.scrollY > 50);
            }, 10);
            
            window.addEventListener('scroll', handleScroll);
            handleScroll(); // Initialize on load
        }

        // Smooth scrolling with offset
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                e.preventDefault();
                
                const targetId = this.getAttribute('href');
                if (targetId === '#') return;
                
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    const headerHeight = document.querySelector('header').offsetHeight;
                    const additionalOffset = targetId === '#home' ? 0 : 20;
                    const targetPosition = targetElement.getBoundingClientRect().top + 
                                         window.pageYOffset - 
                                         headerHeight - 
                                         additionalOffset;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            });
        });

        // Back to top button with smooth behavior
        const backToTopBtn = document.querySelector('.back-to-top');
        if (backToTopBtn) {
            const checkScroll = () => {
                backToTopBtn.classList.toggle('visible', window.scrollY > 300);
            };
            
            window.addEventListener('scroll', throttle(checkScroll, 50));
            checkScroll(); // Initialize
            
            backToTopBtn.addEventListener('click', (e) => {
                e.preventDefault();
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
            });
        }

        // Active section highlighting
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('.nav-links a');
        
        const highlightNav = () => {
            let current = '';
            
            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                const sectionHeight = section.clientHeight;
                const headerHeight = document.querySelector('header').offsetHeight;
                
                if (window.scrollY >= sectionTop - headerHeight - 50) {
                    current = section.getAttribute('id');
                }
            });
            
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${current}`) {
                    link.classList.add('active');
                }
            });
        };
        
        window.addEventListener('scroll', throttle(highlightNav, 100));
        highlightNav(); // Initialize
    };

    // ======================
    // PROJECT FILTERING
    // ======================
    const initProjectFilter = () => {
        const filterButtons = document.querySelectorAll('.filter-btn');
        const projectCards = document.querySelectorAll('.project-card');
        if (!filterButtons.length || !projectCards.length) return;

        filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                // Update active button with animation
                filterButtons.forEach(btn => {
                    btn.classList.remove('active');
                    btn.style.transform = 'scale(1)';
                });
                button.classList.add('active');
                button.style.transform = 'scale(1.05)';
                
                const filterValue = button.getAttribute('data-filter');
                
                // Filter projects with fade animation
                projectCards.forEach((card, index) => {
                    const cardCategories = card.getAttribute('data-category').split(' ');
                    
                    if (filterValue === 'all' || cardCategories.includes(filterValue)) {
                        card.style.display = 'flex';
                        card.style.animation = `fadeIn 0.5s ease ${index * 0.1}s forwards`;
                    } else {
                        card.style.animation = 'fadeOut 0.3s ease forwards';
                        setTimeout(() => {
                            card.style.display = 'none';
                        }, 300);
                    }
                });
            });
        });

        // Initialize with all projects visible
        filterButtons[0].click();
    };

    // ======================
    // SKILLS TABS
    // ======================
    const initSkillsTabs = () => {
        const tabButtons = document.querySelectorAll('.tab-btn');
        const tabContents = document.querySelectorAll('.tab-content');
        if (!tabButtons.length || !tabContents.length) return;

        tabButtons.forEach(button => {
            button.addEventListener('click', () => {
                const tabId = button.getAttribute('data-tab');
                
                // Update active tab with animation
                tabButtons.forEach(btn => {
                    btn.classList.remove('active');
                    btn.style.transform = 'scale(1)';
                });
                
                tabContents.forEach(content => content.classList.remove('active'));
                
                button.classList.add('active');
                button.style.transform = 'scale(1.05)';
                document.getElementById(tabId).classList.add('active');
                
                // Animate skill bars when tab becomes visible
                if (tabId === 'hardware' || tabId === 'software') {
                    animateSkillBars();
                }
            });
        });

        // Initialize first tab
        tabButtons[0].click();
    };

    // ======================
    // FORM HANDLING
    // ======================
    const initContactForm = () => {
        const contactForm = document.querySelector('.contact-form');
        if (!contactForm) return;

        // Form validation
        const validateForm = () => {
            let isValid = true;
            const requiredFields = contactForm.querySelectorAll('[required]');
            
            requiredFields.forEach(field => {
                if (!field.value.trim()) {
                    field.classList.add('error');
                    isValid = false;
                } else {
                    field.classList.remove('error');
                }
                
                // Email validation
                if (field.type === 'email' && field.value.trim()) {
                    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                    if (!emailRegex.test(field.value)) {
                        field.classList.add('error');
                        isValid = false;
                    }
                }
            });
            
            return isValid;
        };

        contactForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            if (!validateForm()) {
                return;
            }
            
            const formData = new FormData(this);
            const submitBtn = this.querySelector('button[type="submit"]');
            const originalBtnText = submitBtn.innerHTML;
            
            try {
                // Show loading state
                submitBtn.disabled = true;
                submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
                
                // Simulate form submission (replace with actual fetch request)
                await new Promise(resolve => setTimeout(resolve, 1500));
                
                // Show success message
                const successMsg = document.createElement('div');
                successMsg.className = 'form-success animate__animated animate__fadeIn';
                successMsg.innerHTML = `
                    <i class="fas fa-check-circle"></i>
                    <p>Thank you for your message! I will get back to you soon.</p>
                `;
                contactForm.prepend(successMsg);
                
                // Reset form
                this.reset();
                
                // Remove success message after 5 seconds
                setTimeout(() => {
                    successMsg.classList.add('animate__fadeOut');
                    setTimeout(() => successMsg.remove(), 500);
                }, 5000);
            } catch (error) {
                console.error('Form submission error:', error);
                const errorMsg = document.createElement('div');
                errorMsg.className = 'form-error animate__animated animate__fadeIn';
                errorMsg.innerHTML = `
                    <i class="fas fa-exclamation-circle"></i>
                    <p>There was an error sending your message. Please try again later.</p>
                `;
                contactForm.prepend(errorMsg);
                
                setTimeout(() => {
                    errorMsg.classList.add('animate__fadeOut');
                    setTimeout(() => errorMsg.remove(), 500);
                }, 5000);
            } finally {
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalBtnText;
            }
        });

        // Add real-time validation
        contactForm.querySelectorAll('input, textarea').forEach(field => {
            field.addEventListener('input', () => {
                if (field.value.trim()) {
                    field.classList.remove('error');
                }
            });
        });
    };

    // ======================
    // DARK MODE
    // ======================
    const initDarkMode = () => {
        const darkModeToggle = document.getElementById('dark-mode-toggle');
        if (!darkModeToggle) return;

        const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
        
        const updateDarkMode = (isDark) => {
            if (isDark) {
                document.body.classList.add('dark-mode');
                darkModeToggle.checked = true;
                localStorage.setItem('darkMode', 'enabled');
            } else {
                document.body.classList.remove('dark-mode');
                darkModeToggle.checked = false;
                localStorage.setItem('darkMode', 'disabled');
            }
            
            // Update theme color meta tag
            const themeColor = document.querySelector('meta[name="theme-color"]');
            if (themeColor) {
                themeColor.content = isDark ? '#1f2937' : '#f9fafb';
            }
        };
        
        // Initialize dark mode
        if (localStorage.getItem('darkMode') === 'enabled' || 
            (!localStorage.getItem('darkMode') && prefersDarkScheme.matches)) {
            updateDarkMode(true);
        }
        
        // Toggle dark mode
        darkModeToggle.addEventListener('change', function() {
            updateDarkMode(this.checked);
        });
        
        // Watch for system color scheme changes
        prefersDarkScheme.addListener((e) => {
            if (!localStorage.getItem('darkMode')) {
                updateDarkMode(e.matches);
            }
        });
    };

    // ======================
    // TYPEWRITER EFFECT
    // ======================
    const initTypewriter = () => {
        const typingText = document.querySelector('.typing-text');
        if (!typingText) return;

        const professions = [
             
            "Power Electronics Researcher",
            "Machine Learning Explorer",
            "Hardware Designer",
            "IoT Enthusiast"
        ];
        
        let professionIndex = 0;
        let charIndex = 0;
        let isDeleting = false;
        let isEnd = false;
        
        const type = () => {
            const currentProfession = professions[professionIndex];
            
            if (isDeleting) {
                typingText.textContent = currentProfession.substring(0, charIndex - 1);
                charIndex--;
            } else {
                typingText.textContent = currentProfession.substring(0, charIndex + 1);
                charIndex++;
            }
            
            if (!isDeleting && charIndex === currentProfession.length) {
                isEnd = true;
                setTimeout(type, 2000); // Pause at end
            } else if (isDeleting && charIndex === 0) {
                isDeleting = false;
                professionIndex = (professionIndex + 1) % professions.length;
                setTimeout(type, 500); // Short pause before next word
            } else {
                // Variable typing speed for more natural feel
                const typingSpeed = isDeleting ? 30 + Math.random() * 50 : 100 + Math.random() * 100;
                setTimeout(type, isEnd ? typingSpeed * 2 : typingSpeed);
            }
        };
        
        // Start with a delay
        setTimeout(type, 1000);
    };

    // ======================
    // ANIMATIONS
    // ======================
    const initAnimations = () => {
        // Initialize AOS (Animate On Scroll)
        if (typeof AOS !== 'undefined') {
            AOS.init({
                duration: 800,
                easing: 'ease-in-out',
                once: true,
                mirror: false,
                offset: 100
            });
        }

        // Animate skill bars when they come into view
        const animateSkillBars = () => {
            document.querySelectorAll('.skill-level').forEach(bar => {
                const width = bar.getAttribute('data-width') || bar.style.width;
                bar.style.width = '0';
                
                setTimeout(() => {
                    bar.style.width = width;
                }, 100);
            });
        };

        const skillObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateSkillBars();
                    skillObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.2 });

        document.querySelectorAll('.skill-level').forEach(el => skillObserver.observe(el));

        // Add CSS for fade animations
        const style = document.createElement('style');
        style.textContent = `
            @keyframes fadeIn {
                from { opacity: 0; transform: translateY(20px); }
                to { opacity: 1; transform: translateY(0); }
            }
            @keyframes fadeOut {
                from { opacity: 1; transform: translateY(0); }
                to { opacity: 0; transform: translateY(20px); }
            }
            .form-success, .form-error {
                background: rgba(255,255,255,0.9);
                padding: 1rem;
                margin-bottom: 1.5rem;
                border-radius: var(--border-radius);
                display: flex;
                align-items: center;
                gap: 0.75rem;
            }
            .form-success {
                background: rgba(16, 185, 129, 0.1);
                border-left: 4px solid var(--success-color);
            }
            .form-error {
                background: rgba(239, 68, 68, 0.1);
                border-left: 4px solid var(--danger-color);
            }
            .form-success i {
                color: var(--success-color);
                font-size: 1.5rem;
            }
            .form-error i {
                color: var(--danger-color);
                font-size: 1.5rem;
            }
            .form-success p, .form-error p {
                margin: 0;
                color: var(--dark-color);
            }
            body.dark-mode .form-success, 
            body.dark-mode .form-error {
                background: rgba(0,0,0,0.5);
            }
            body.dark-mode .form-success p, 
            body.dark-mode .form-error p {
                color: white;
            }
        `;
        document.head.appendChild(style);
    };

    // ======================
    // TESTIMONIALS & SHOWCASE SLIDERS
    // ======================
    const initSliders = () => {
        // Testimonial slider
        const testimonialSlider = document.querySelector('.testimonial-slider');
        if (testimonialSlider) {
            const testimonials = document.querySelectorAll('.testimonial');
            const dots = document.querySelectorAll('.testimonial-dots .dot');
            let currentIndex = 0;
            let autoSlideInterval;

            const showTestimonial = (index) => {
                testimonials.forEach(testimonial => testimonial.classList.remove('active'));
                dots.forEach(dot => dot.classList.remove('active'));
                
                testimonials[index].classList.add('active');
                dots[index].classList.add('active');
                currentIndex = index;
            };

            const nextTestimonial = () => {
                showTestimonial((currentIndex + 1) % testimonials.length);
            };

            const prevTestimonial = () => {
                showTestimonial((currentIndex - 1 + testimonials.length) % testimonials.length);
            };

            document.querySelector('.testimonial-next').addEventListener('click', nextTestimonial);
            document.querySelector('.testimonial-prev').addEventListener('click', prevTestimonial);

            dots.forEach((dot, index) => {
                dot.addEventListener('click', () => showTestimonial(index));
            });

            // Auto-advance testimonials
            const startAutoSlide = () => {
                autoSlideInterval = setInterval(nextTestimonial, 5000);
            };

            const stopAutoSlide = () => {
                clearInterval(autoSlideInterval);
            };

            testimonialSlider.addEventListener('mouseenter', stopAutoSlide);
            testimonialSlider.addEventListener('mouseleave', startAutoSlide);

            showTestimonial(0);
            startAutoSlide();
        }

        // Project showcase slider
        const showcaseSlider = document.querySelector('.showcase-container');
        if (showcaseSlider) {
            const slides = document.querySelectorAll('.showcase-slide');
            const dotsContainer = document.querySelector('.showcase-dots');
            const prevBtn = document.querySelector('.showcase-prev');
            const nextBtn = document.querySelector('.showcase-next');
            
            // Create dots dynamically
            dotsContainer.innerHTML = '';
            slides.forEach((_, index) => {
                const dot = document.createElement('span');
                dot.classList.add('dot');
                if (index === 0) dot.classList.add('active');
                dot.addEventListener('click', () => showSlide(index));
                dotsContainer.appendChild(dot);
            });

            const dots = document.querySelectorAll('.showcase-dots .dot');
            let currentIndex = 0;
            let autoSlideInterval;

            const showSlide = (index) => {
                // Handle wrap-around
                if (index >= slides.length) index = 0;
                if (index < 0) index = slides.length - 1;
                
                slides.forEach(slide => slide.classList.remove('active'));
                slides[index].classList.add('active');
                
                dots.forEach(dot => dot.classList.remove('active'));
                dots[index].classList.add('active');
                
                currentIndex = index;
            };

            const nextSlide = () => showSlide(currentIndex + 1);
            const prevSlide = () => showSlide(currentIndex - 1);

            nextBtn.addEventListener('click', nextSlide);
            prevBtn.addEventListener('click', prevSlide);

            // Keyboard navigation
            document.addEventListener('keydown', (e) => {
                if (e.key === 'ArrowRight') nextSlide();
                if (e.key === 'ArrowLeft') prevSlide();
            });

            // Auto-slide functionality
            const startAutoSlide = () => {
                autoSlideInterval = setInterval(nextSlide, 5000);
            };

            const stopAutoSlide = () => {
                clearInterval(autoSlideInterval);
            };

            // Pause on hover
            showcaseSlider.addEventListener('mouseenter', stopAutoSlide);
            showcaseSlider.addEventListener('mouseleave', startAutoSlide);

            // Touch support for mobile
            let touchStartX = 0;
            let touchEndX = 0;
            
            showcaseSlider.addEventListener('touchstart', (e) => {
                touchStartX = e.changedTouches[0].screenX;
            }, {passive: true});

            showcaseSlider.addEventListener('touchend', (e) => {
                touchEndX = e.changedTouches[0].screenX;
                handleSwipe();
            }, {passive: true});

            const handleSwipe = () => {
                if (touchEndX < touchStartX - 50) nextSlide(); // Swipe left
                if (touchEndX > touchStartX + 50) prevSlide(); // Swipe right
            };

            // Initialize
            showSlide(0);
            startAutoSlide();
        }
    };

    // ======================
    // VIDEO LAZY LOADING
    // ======================
    const initLazyLoadVideos = () => {
        const lazyVideos = document.querySelectorAll('video[data-src]');
        
        const lazyVideoObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const video = entry.target;
                    video.src = video.getAttribute('data-src');
                    video.load();
                    lazyVideoObserver.unobserve(video);
                }
            });
        }, { threshold: 0.1 });

        lazyVideos.forEach(video => lazyVideoObserver.observe(video));
    };

    // ======================
    // INITIALIZE ALL COMPONENTS
    // ======================
    const initAll = () => {
        initLoadingScreen();
        setCurrentYear();
        initMobileMenu();
        initScrollEffects();
        initProjectFilter();
        initSkillsTabs();
        initContactForm();
        initDarkMode();
        initTypewriter();
        initAnimations();
        initSliders();
        initLazyLoadVideos();
    };

    initAll();
});