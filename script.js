// Smooth scroll animations
document.addEventListener('DOMContentLoaded', () => {
    // Custom cursor removed - was distracting

    // Intersection Observer for fade-in animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    // Observe all sections
    document.querySelectorAll('section').forEach(section => {
        section.classList.add('fade-in');
        observer.observe(section);
    });

    // Observe project cards
    document.querySelectorAll('.project-card').forEach(card => {
        observer.observe(card);
    });

    // Navbar scroll effect
    let lastScroll = 0;
    const navbar = document.querySelector('.navbar');

    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;

        if (currentScroll > 100) {
            navbar.style.background = 'rgba(10, 10, 26, 0.95)';
            navbar.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.3)';
        } else {
            navbar.style.background = 'rgba(10, 10, 26, 0.85)';
            navbar.style.boxShadow = 'none';
        }

        lastScroll = currentScroll;
    });

    // Video Modal handlers
    const modal = document.getElementById('video-modal');
    const modalIframe = document.getElementById('modal-iframe');
    const closeModal = document.querySelector('.close-modal');

    // Hero reel click handler - open in modal
    const heroReel = document.getElementById('hero-reel');
    if (heroReel) {
        heroReel.addEventListener('click', () => {
            const videoId = heroReel.getAttribute('data-video-id');
            if (videoId) {
                modalIframe.src = `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`;
                modal.classList.add('active');
                document.body.style.overflow = 'hidden';
            }
        });
    }

    // Fix thumbnails for unlisted videos - add error handling
    document.querySelectorAll('.project-image img').forEach(img => {
        img.addEventListener('error', function() {
            // If thumbnail fails to load, try different quality
            if (this.src.includes('mqdefault')) {
                this.src = this.src.replace('mqdefault', '0');
            } else if (this.src.includes('/0.jpg')) {
                this.src = this.src.replace('/0.jpg', '/default.jpg');
            } else {
                // Last fallback - hide image, show gradient background with play button
                this.classList.add('hidden');
            }
        });
    });

    // Ripple effect function
    function createRipple(e, element) {
        const ripple = document.createElement('div');
        ripple.className = 'ripple';

        const rect = element.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);

        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = (e.clientX - rect.left - size / 2) + 'px';
        ripple.style.top = (e.clientY - rect.top - size / 2) + 'px';

        element.style.position = 'relative';
        element.style.overflow = 'hidden';
        element.appendChild(ripple);

        setTimeout(() => ripple.remove(), 600);
    }

    // 3D Tilt Effect on Project Cards
    const projectCards = document.querySelectorAll('.project-card');
    projectCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const rotateX = (y - centerY) / 10;
            const rotateY = (centerX - x) / 10;

            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-10px) scale(1.02)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = '';
        });

        const openVideo = (e) => {
            const videoId = card.getAttribute('data-video-id');
            if (videoId) {
                // Create ripple effect
                createRipple(e, card);

                // Open modal with video
                setTimeout(() => {
                    modalIframe.src = `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`;
                    modal.classList.add('active');
                    document.body.style.overflow = 'hidden';
                }, 100);
            }
        };

        // Support both desktop and mobile clicks
        card.addEventListener('click', openVideo);
    });

    // Close modal handlers
    const closeVideoModal = () => {
        modal.classList.remove('active');
        modalIframe.src = ''; // Stop video
        document.body.style.overflow = ''; // Restore scroll
    };

    closeModal.addEventListener('click', closeVideoModal);

    // Close on background click
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeVideoModal();
        }
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            closeVideoModal();
        }
    });

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Subtle parallax effect to hero section
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const hero = document.querySelector('.hero-content');
        if (hero && scrolled < 600) {
            hero.style.transform = `translateY(${scrolled * 0.2}px)`;
            hero.style.opacity = 1 - scrolled / 800;
        }
    });

    // Enhanced parallax effect with mouse movement AND scroll direction
    const projectsSection = document.querySelector('.projects');
    const parallaxShapes = document.getElementById('parallax-layer');

    if (projectsSection) {
        let mouseX = 0;
        let mouseY = 0;
        let lastScrollY = window.pageYOffset;
        let scrollVelocity = 0;
        let scrollDirection = 0; // 1 for down, -1 for up

        // Smooth parallax on mouse move with requestAnimationFrame
        let targetX = 0;
        let targetY = 0;
        let currentX = 0;
        let currentY = 0;
        let scrollOffsetY = 0;
        let targetScrollOffsetY = 0;

        // Parallax on scroll with direction detection
        let scrollTicking = false;
        window.addEventListener('scroll', () => {
            if (!scrollTicking) {
                window.requestAnimationFrame(() => {
                    const rect = projectsSection.getBoundingClientRect();
                    const isVisible = rect.top < window.innerHeight && rect.bottom > 0;

                    if (isVisible) {
                        const currentScrollY = window.pageYOffset;
                        scrollVelocity = currentScrollY - lastScrollY;
                        scrollDirection = scrollVelocity > 0 ? 1 : -1;

                        // Calculate scroll offset relative to projects section
                        const sectionTop = projectsSection.offsetTop;
                        const scrollProgress = (currentScrollY - sectionTop + window.innerHeight) / (rect.height + window.innerHeight);

                        // Slow, smooth parallax movement based on scroll
                        targetScrollOffsetY = scrollProgress * 80; // Adjust multiplier for speed
                    }

                    lastScrollY = currentScrollY;
                    scrollTicking = false;
                });

                scrollTicking = true;
            }
        });

        document.addEventListener('mousemove', (e) => {
            const rect = projectsSection.getBoundingClientRect();
            const isVisible = rect.top < window.innerHeight && rect.bottom > 0;

            if (isVisible) {
                targetX = (e.clientX - window.innerWidth / 2) / 100;
                targetY = (e.clientY - window.innerHeight / 2) / 100;
            }
        });

        // Smooth animation loop
        function smoothParallax() {
            // Ease towards target (smooth movement)
            currentX += (targetX - currentX) * 0.05;
            currentY += (targetY - currentY) * 0.05;
            scrollOffsetY += (targetScrollOffsetY - scrollOffsetY) * 0.03; // Slow, smooth easing

            updateParallax();
            requestAnimationFrame(smoothParallax);
        }

        smoothParallax();

        function updateParallax() {
            // Layer 1 - Background orbs (slowest, opposite direction for depth)
            const bgScrollEffect = scrollOffsetY * -0.15;
            projectsSection.style.setProperty('--before-x', `${currentX * -0.8}px`);
            projectsSection.style.setProperty('--before-y', `${currentY * -0.8 + bgScrollEffect}px`);

            // Layer 2 - Grid (medium speed, moves with scroll)
            const gridScrollEffect = scrollOffsetY * 0.3;
            projectsSection.style.setProperty('--after-x', `${currentX * 1.2}px`);
            projectsSection.style.setProperty('--after-y', `${currentY * 1.2 + gridScrollEffect}px`);

            // Layer 3 - Floating shapes (individual speeds based on data-speed attribute)
            if (parallaxShapes) {
                const shapes = parallaxShapes.querySelectorAll('[data-speed]');
                shapes.forEach((shape) => {
                    const speed = parseFloat(shape.dataset.speed) || 0.5;
                    const shapeScrollEffect = scrollOffsetY * speed;
                    const shapeX = currentX * (2 + speed);
                    const shapeY = currentY * (2 + speed) + shapeScrollEffect;

                    // Apply transform while preserving existing animations
                    shape.style.transform = `translate(${shapeX}px, ${shapeY}px)`;
                });
            }
        }
    }

    // Easter eggs - Konami code and click interactions
    let konamiCode = [];
    const konamiSequence = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];

    document.addEventListener('keydown', (e) => {
        konamiCode.push(e.key);
        konamiCode = konamiCode.slice(-10);

        if (konamiCode.join(',') === konamiSequence.join(',')) {
            activateEasterEggs();
        }
    });

    // Click on shapes to reveal easter eggs
    let shapeClicks = 0;
    document.querySelectorAll('.parallax-shape').forEach(shape => {
        shape.style.cursor = 'pointer';
        shape.style.pointerEvents = 'auto';
        shape.addEventListener('click', () => {
            shapeClicks++;
            shape.style.transform = 'scale(1.2) rotate(360deg)';
            setTimeout(() => {
                shape.style.transform = '';
            }, 500);

            if (shapeClicks >= 3) {
                activateEasterEggs();
                shapeClicks = 0;
            }
        });
    });

    function activateEasterEggs() {
        document.querySelectorAll('.easter-egg').forEach(egg => {
            egg.classList.add('active');
            setTimeout(() => {
                egg.classList.remove('active');
            }, 5000);
        });
    }

    // Audio context for sound effects
    let audioCtx = null;

    function playPopSound() {
        if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.frequency.setValueAtTime(600, audioCtx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(200, audioCtx.currentTime + 0.1);
        gain.gain.setValueAtTime(0.3, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.15);
        osc.start(audioCtx.currentTime);
        osc.stop(audioCtx.currentTime + 0.15);
    }

    // Magnetic Button Effect
    const magneticButtons = document.querySelectorAll('.magnetic-button');
    magneticButtons.forEach(button => {
        button.addEventListener('mousemove', (e) => {
            const rect = button.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;

            button.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px)`;
        });

        button.addEventListener('mouseleave', () => {
            button.style.transform = '';
        });
    });

    // Smooth Reveal Animations on Scroll
    const revealElements = document.querySelectorAll('.project-card, .about-content, .section-title');
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, { threshold: 0.1 });

    revealElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
        revealObserver.observe(el);
    });

    // Animated Stats Counter
    const statItems = document.querySelectorAll('.stat-item');
    let statsAnimated = false;

    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !statsAnimated) {
                statsAnimated = true;
                animateStats();
            }
        });
    }, { threshold: 0.5 });

    statItems.forEach(item => statsObserver.observe(item));

    function animateStats() {
        statItems.forEach((item, index) => {
            setTimeout(() => {
                item.classList.add('visible');
                const numberEl = item.querySelector('.stat-number');
                const target = parseInt(item.getAttribute('data-target'));
                animateCounter(numberEl, target);
            }, index * 200);
        });
    }

    function animateCounter(element, target) {
        const duration = 2000;
        const start = 0;
        const increment = target / (duration / 16);
        let current = start;

        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                element.textContent = target.toLocaleString();
                clearInterval(timer);
            } else {
                element.textContent = Math.floor(current).toLocaleString();
            }
        }, 16);
    }

    // Mini Music Player with SoundCloud Widget API
    const miniPlayBtn = document.getElementById('miniPlay');
    const miniPrevBtn = document.getElementById('miniPrev');
    const miniNextBtn = document.getElementById('miniNext');
    const marqueeText = document.getElementById('marqueeText');

    let widget = null;
    let currentTrackIndex = 0;
    let isPlaying = false;
    let playlist = [];

    // Load SoundCloud Widget API
    const scScript = document.createElement('script');
    scScript.src = 'https://w.soundcloud.com/player/api.js';
    document.head.appendChild(scScript);

    scScript.onload = function() {
        // Create hidden iframe for SoundCloud widget
        const iframe = document.createElement('iframe');
        iframe.id = 'sc-widget';
        iframe.width = '0';
        iframe.height = '0';
        iframe.scrolling = 'no';
        iframe.frameborder = 'no';
        iframe.allow = 'autoplay';
        iframe.src = 'https://w.soundcloud.com/player/?url=https%3A//soundcloud.com/pafu&auto_play=false&hide_related=true&show_comments=false&show_user=false&show_reposts=false&visual=false';
        iframe.style.display = 'none';
        document.body.appendChild(iframe);

        // Initialize widget
        widget = SC.Widget('sc-widget');

        widget.bind(SC.Widget.Events.READY, function() {
            // Get playlist/tracks
            widget.getSounds(function(sounds) {
                playlist = sounds;
                if (playlist.length > 0) {
                    updateMarquee(playlist[0].title);
                }
            });

            // Listen for track changes
            widget.bind(SC.Widget.Events.PLAY, function() {
                isPlaying = true;
                miniPlayBtn.textContent = '⏸';
                widget.getCurrentSound(function(sound) {
                    if (sound) {
                        updateMarquee(sound.title);
                    }
                });
            });

            widget.bind(SC.Widget.Events.PAUSE, function() {
                isPlaying = false;
                miniPlayBtn.textContent = '▶';
            });

            widget.bind(SC.Widget.Events.FINISH, function() {
                // Auto-play next track
                miniNextBtn.click();
            });
        });
    };

    // Update scrolling marquee
    function updateMarquee(trackName) {
        marqueeText.textContent = `♪ ${trackName} ♪`;
        // Restart animation
        marqueeText.style.animation = 'none';
        setTimeout(() => {
            marqueeText.style.animation = 'marquee 15s linear infinite';
        }, 10);
    }

    // Play/Pause
    miniPlayBtn.addEventListener('click', () => {
        if (!widget) return;
        widget.toggle();
    });

    // Previous track
    miniPrevBtn.addEventListener('click', () => {
        if (!widget) return;
        widget.prev();
    });

    // Next track
    miniNextBtn.addEventListener('click', () => {
        if (!widget) return;
        widget.next();
    });

    // Cool copy email notification
    const emailLink = document.querySelector('.email-link');
    if (emailLink) {
        emailLink.addEventListener('click', (e) => {
            // Check if it's a mailto link - let it open normally
            if (emailLink.href && emailLink.href.startsWith('mailto:')) {
                return; // Let default behavior happen
            }

            // If it's just text, copy to clipboard
            e.preventDefault();
            const email = emailLink.textContent;
            navigator.clipboard.writeText(email).then(() => {
                showNotification('📧 Email copied to clipboard!');
                playPopSound();
            });
        });
    }

    // Show notification
    function showNotification(message) {
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.textContent = message;
        document.body.appendChild(notification);

        // Trigger animation
        setTimeout(() => notification.classList.add('show'), 10);

        // Remove after 3 seconds
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }

    // Movie/Animation themed emojis for name explosion
    const movieEmojis = [
        '🎬', '🎬', '🎬', '🎬', '🎬',
        '🎥', '🎥', '🎥', '📹', '📹',
        '🎨', '🎨', '✨', '✨', '⭐',
        '💫', '🌟', '🔥', '⚡', '🎭',
        '🎪', '🏆', '💎', '🎯', '👾'
    ];

    function createParticleExplosion(x, y) {
        const particleCount = 40;
        const gravity = 0.3;
        const friction = 0.99;
        const duration = 3000;

        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            particle.textContent = movieEmojis[Math.floor(Math.random() * movieEmojis.length)];
            particle.style.fontSize = (28 + Math.random() * 28) + 'px';

            document.body.appendChild(particle);

            // Initial velocity - burst outward and upward
            const angle = (Math.PI * 2 * i) / particleCount + (Math.random() - 0.5) * 0.5;
            const power = 8 + Math.random() * 12;
            let vx = Math.cos(angle) * power;
            let vy = Math.sin(angle) * power - (8 + Math.random() * 6); // Upward bias
            let rotation = 0;
            let rotationSpeed = (Math.random() - 0.5) * 15;

            let posX = x;
            let posY = y;
            let opacity = 1;
            let scale = 0.5;

            const startTime = performance.now();

            function animate(currentTime) {
                const elapsed = currentTime - startTime;
                const progress = elapsed / duration;

                if (progress >= 1) {
                    particle.remove();
                    return;
                }

                // Apply physics
                vy += gravity;
                vx *= friction;
                vy *= friction;

                posX += vx;
                posY += vy;
                rotation += rotationSpeed;
                rotationSpeed *= 0.98;

                // Scale: pop up quickly, then settle
                if (progress < 0.1) {
                    scale = 0.5 + (progress / 0.1) * 0.7; // Scale up to 1.2
                } else if (progress < 0.2) {
                    scale = 1.2 - ((progress - 0.1) / 0.1) * 0.2; // Settle to 1.0
                } else {
                    scale = 1;
                }

                // Fade out in the last 40%
                if (progress > 0.6) {
                    opacity = 1 - ((progress - 0.6) / 0.4);
                }

                particle.style.left = posX + 'px';
                particle.style.top = posY + 'px';
                particle.style.transform = `rotate(${rotation}deg) scale(${scale})`;
                particle.style.opacity = opacity;

                requestAnimationFrame(animate);
            }

            // Stagger start slightly for organic feel
            setTimeout(() => {
                requestAnimationFrame(animate);
            }, Math.random() * 50);
        }
    }

    // Screen shake effect
    function shakeScreen() {
        document.body.classList.add('shaking');
        setTimeout(() => document.body.classList.remove('shaking'), 500);
    }

    // Confetti explosion for extra celebration
    function createConfetti() {
        const colors = ['#ff006e', '#fbbf24', '#22c55e', '#3b82f6', '#ec4899', '#8b5cf6'];
        const confettiCount = 80;

        for (let i = 0; i < confettiCount; i++) {
            const confetti = document.createElement('div');
            confetti.style.position = 'fixed';
            confetti.style.pointerEvents = 'none';
            confetti.style.zIndex = '9999';
            confetti.style.left = Math.random() * 100 + 'vw';
            confetti.style.top = '-20px';
            confetti.style.width = (Math.random() * 10 + 5) + 'px';
            confetti.style.height = (Math.random() * 10 + 5) + 'px';
            confetti.style.background = colors[Math.floor(Math.random() * colors.length)];
            confetti.style.borderRadius = Math.random() > 0.5 ? '50%' : '2px';
            confetti.style.willChange = 'transform, opacity';

            document.body.appendChild(confetti);

            let posY = -20;
            let posX = parseFloat(confetti.style.left);
            let velY = Math.random() * 3 + 2;
            let velX = (Math.random() - 0.5) * 4;
            let rotation = 0;
            let rotSpeed = (Math.random() - 0.5) * 10;

            function animateConfetti() {
                velY += 0.1; // gravity
                posY += velY;
                posX += velX;
                rotation += rotSpeed;

                confetti.style.transform = `translateY(${posY}px) translateX(${velX * 50}px) rotate(${rotation}deg)`;

                if (posY < window.innerHeight + 50) {
                    requestAnimationFrame(animateConfetti);
                } else {
                    confetti.remove();
                }
            }

            setTimeout(() => requestAnimationFrame(animateConfetti), Math.random() * 500);
        }
    }

    // Add click event to the name for particle explosion
    const nameElement = document.getElementById('name-explosion');
    if (nameElement) {
        let clickCount = 0;
        nameElement.addEventListener('click', (e) => {
            const rect = nameElement.getBoundingClientRect();
            const x = rect.left + rect.width / 2;
            const y = rect.top + rect.height / 2;

            // Create particle explosion
            createParticleExplosion(x, y);

            // Play sound
            playPopSound();

            // Shake the screen
            shakeScreen();

            // Every 3rd click, add confetti!
            clickCount++;
            if (clickCount % 3 === 0) {
                createConfetti();
                showNotification('🎬 PARTY MODE ACTIVATED! 🎉');
            } else {
                const messages = [
                    '🎬 Action!',
                    '✨ That\'s a wrap!',
                    '🎥 Rolling!',
                    '⭐ Lights, Camera, Action!',
                    '🎨 Creative explosion!',
                    '🔥 On fire!',
                    '💫 Magic in motion!',
                    '🏆 Award-winning click!'
                ];
                showNotification(messages[Math.floor(Math.random() * messages.length)]);
            }
        });
    }

    // ============================================
    // VIDEO MANAGEMENT SYSTEM
    // ============================================

    const adminToggle = document.getElementById('adminToggle');
    const adminPanel = document.getElementById('adminPanel');
    const closeAdmin = document.getElementById('closeAdmin');
    const addVideoBtn = document.getElementById('addVideo');
    const exportVideosBtn = document.getElementById('exportVideos');
    const videoIdInput = document.getElementById('videoId');
    const videoCategoryInput = document.getElementById('videoCategory');
    const videoListContainer = document.getElementById('videoList');
    const projectsGrid = document.querySelector('.projects-grid');

    // Check if admin elements exist
    if (!adminToggle || !adminPanel) {
        console.error('Admin elements not found');
        return;
    }

    // Load custom videos from localStorage OR videos.json file
    let customVideos = JSON.parse(localStorage.getItem('customVideos')) || [];

    // Try to load videos from videos.json file
    async function loadVideosFromFile() {
        try {
            const response = await fetch('videos.json');
            if (response.ok) {
                const fileVideos = await response.json();
                // Merge with localStorage, prioritizing file videos
                if (fileVideos && fileVideos.length > 0) {
                    customVideos = fileVideos;
                    localStorage.setItem('customVideos', JSON.stringify(customVideos));
                    console.log('Loaded videos from videos.json');
                }
            }
        } catch (error) {
            console.log('No videos.json file found, using localStorage only');
        }
    }

    // Load videos on startup
    loadVideosFromFile().then(() => {
        renderCustomVideos();
    });

    // Admin password (you can change this)
    const ADMIN_PASSWORD = 'mickey2025';
    let isAuthenticated = sessionStorage.getItem('adminAuth') === 'true';

    // Open admin panel with password check
    adminToggle.addEventListener('click', () => {
        console.log('Admin button clicked'); // Debug log

        // Check if already authenticated in this session
        if (!isAuthenticated) {
            const password = prompt('Enter admin password:');
            if (password !== ADMIN_PASSWORD) {
                showNotification('❌ Incorrect password');
                return;
            }
            // Store authentication for this session
            sessionStorage.setItem('adminAuth', 'true');
            isAuthenticated = true;
            showNotification('✅ Access granted!');
        }

        adminPanel.classList.add('active');
        document.body.style.overflow = 'hidden';
        renderVideoList();
    });

    // Close admin panel
    closeAdmin.addEventListener('click', () => {
        adminPanel.classList.remove('active');
        document.body.style.overflow = '';
    });

    // Close on background click
    adminPanel.addEventListener('click', (e) => {
        if (e.target === adminPanel) {
            adminPanel.classList.remove('active');
            document.body.style.overflow = '';
        }
    });

    // Add video
    addVideoBtn.addEventListener('click', () => {
        const videoId = videoIdInput.value.trim();
        const category = videoCategoryInput.value.trim() || 'Custom Video';

        if (!videoId) {
            showNotification('⚠️ Please enter a YouTube video ID');
            return;
        }

        // Check if video already exists
        if (customVideos.some(v => v.id === videoId)) {
            showNotification('⚠️ This video is already added');
            return;
        }

        // Add to custom videos
        const newVideo = {
            id: videoId,
            category: category,
            timestamp: Date.now()
        };

        customVideos.push(newVideo);
        localStorage.setItem('customVideos', JSON.stringify(customVideos));

        // Clear inputs
        videoIdInput.value = '';
        videoCategoryInput.value = '';

        // Refresh displays
        renderVideoList();
        renderCustomVideos();

        showNotification('✅ Video added successfully! Remember to export to make it live.');
        playPopSound();
    });

    // Export videos to JSON file
    exportVideosBtn.addEventListener('click', () => {
        if (customVideos.length === 0) {
            showNotification('⚠️ No videos to export');
            return;
        }

        // Create JSON blob
        const jsonData = JSON.stringify(customVideos, null, 2);
        const blob = new Blob([jsonData], { type: 'application/json' });
        const url = URL.createObjectURL(blob);

        // Create download link
        const a = document.createElement('a');
        a.href = url;
        a.download = 'videos.json';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        showNotification('📥 Videos exported! Now upload videos.json to GitHub');
        playPopSound();
    });

    // Remove video
    function removeVideo(videoId) {
        customVideos = customVideos.filter(v => v.id !== videoId);
        localStorage.setItem('customVideos', JSON.stringify(customVideos));
        renderVideoList();
        renderCustomVideos();
        showNotification('🗑️ Video removed');
    }

    // Render video list in admin panel
    function renderVideoList() {
        if (customVideos.length === 0) {
            videoListContainer.innerHTML = '<p style="color: var(--text-secondary); text-align: center; padding: 2rem;">No custom videos added yet</p>';
            return;
        }

        videoListContainer.innerHTML = customVideos.map(video => `
            <div class="video-item">
                <div class="video-item-info">
                    <strong>${video.category}</strong>
                    <span>ID: ${video.id}</span>
                </div>
                <button onclick="window.removeVideoById('${video.id}')">Remove</button>
            </div>
        `).join('');
    }

    // Make removeVideo globally accessible
    window.removeVideoById = removeVideo;

    // Render custom videos to the projects grid
    function renderCustomVideos() {
        // Remove old custom videos
        document.querySelectorAll('.project-card[data-custom="true"]').forEach(card => card.remove());

        // Add new custom videos (reversed to show newest first at top)
        const reversedVideos = [...customVideos].reverse();
        reversedVideos.forEach(video => {
            const card = document.createElement('div');
            card.className = 'project-card';
            card.setAttribute('data-video-id', video.id);
            card.setAttribute('data-custom', 'true');

            card.innerHTML = `
                <div class="project-image">
                    <img src="https://img.youtube.com/vi/${video.id}/mqdefault.jpg" alt="${video.category}" loading="lazy">
                    <div class="play-overlay">▶</div>
                </div>
                <h3>${video.category}</h3>
            `;

            // Add to grid at the TOP (insert as first child)
            projectsGrid.insertBefore(card, projectsGrid.firstChild);

            // Add event listeners for the new card
            addCardEventListeners(card);
        });
    }

    // Add event listeners to a card
    function addCardEventListeners(card) {
        // 3D Tilt Effect
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const rotateX = (y - centerY) / 10;
            const rotateY = (centerX - x) / 10;

            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-10px) scale(1.02)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = '';
        });

        // Click to open video
        const openVideo = (e) => {
            const videoId = card.getAttribute('data-video-id');
            if (videoId) {
                createRipple(e, card);
                setTimeout(() => {
                    modalIframe.src = `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`;
                    modal.classList.add('active');
                    document.body.style.overflow = 'hidden';
                }, 100);
            }
        };

        card.addEventListener('click', openVideo);

        // Observe for fade-in animation
        revealObserver.observe(card);
    }
});
