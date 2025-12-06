// Smooth scroll animations
document.addEventListener('DOMContentLoaded', () => {
    // Custom cursor removed - was distracting

    // Intersection Observer for fade-in animations - DISABLED ON MOBILE
    const isMobileDevice = window.innerWidth <= 768;

    if (!isMobileDevice) {
        // Only run animations on desktop
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
    }

    // Observe project cards - also only on desktop
    if (!isMobileDevice && typeof observer !== 'undefined') {
        document.querySelectorAll('.project-card').forEach(card => {
            observer.observe(card);
        });
    }

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

    // Info panel elements
    const infoTitle = document.getElementById('infoTitle');
    const infoCategory = document.getElementById('infoCategory');
    const infoRole = document.getElementById('infoRole');
    const infoDescription = document.getElementById('infoDescription');

    // Function to update video info panel
    function updateVideoInfo(videoId) {
        // Find video in customVideos
        const video = customVideos.find(v => v.id === videoId);

        if (video && video.name) {
            // Show info panel with video data
            infoTitle.textContent = video.name || 'Untitled Video';
            infoCategory.textContent = video.category || '—';
            infoRole.textContent = video.role || '—';
            infoDescription.textContent = video.description || '';
        } else {
            // Hide or show default info for hardcoded videos
            infoTitle.textContent = 'Featured Work';
            infoCategory.textContent = '—';
            infoRole.textContent = 'Motion Designer & Animator';
            infoDescription.textContent = '';
        }
    }

    // Hero reel click handler - open in modal on desktop, inline on mobile
    const heroReel = document.getElementById('hero-reel');
    if (heroReel) {
        heroReel.addEventListener('click', () => {
            const videoId = heroReel.getAttribute('data-video-id');
            if (videoId) {
                const isMobile = window.innerWidth <= 768;

                if (isMobile) {
                    // Mobile: Open in modal with enhanced params to prevent app redirect
                    updateVideoInfo(videoId);
                    modalIframe.src = `https://www.youtube.com/embed/${videoId}?autoplay=0&rel=0&playsinline=1&modestbranding=1&fs=0&controls=1&enablejsapi=1&origin=${window.location.origin}`;
                    modal.classList.add('active');
                    document.body.style.overflow = 'hidden';
                } else {
                    // Desktop: Open modal as before
                    updateVideoInfo(videoId);
                    modalIframe.src = `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`;
                    modal.classList.add('active');
                    document.body.style.overflow = 'hidden';
                }
            }
        });
    }

    // Fix thumbnails for unlisted videos - add error handling with multiple fallbacks
    document.querySelectorAll('.project-image img').forEach(img => {
        // Force immediate load
        img.loading = 'eager';
        img.decoding = 'sync';

        img.addEventListener('error', function() {
            console.log('Thumbnail failed to load:', this.src);
            // Try multiple fallback sizes
            if (this.src.includes('hqdefault')) {
                this.src = this.src.replace('hqdefault', 'mqdefault');
            } else if (this.src.includes('mqdefault')) {
                this.src = this.src.replace('mqdefault', 'sddefault');
            } else if (this.src.includes('sddefault')) {
                this.src = this.src.replace('sddefault', '0');
            } else if (this.src.includes('/0.jpg')) {
                this.src = this.src.replace('/0.jpg', '/default.jpg');
            } else {
                // Last fallback - show gradient only
                this.style.display = 'none';
            }
        });

        // Also try to force load on mobile
        if (window.innerWidth <= 768) {
            img.style.display = 'block';
            img.style.visibility = 'visible';
            img.style.opacity = '1';
        }
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
                const isMobile = window.innerWidth <= 768;

                // Create ripple effect
                createRipple(e, card);

                if (isMobile) {
                    // Mobile: Open modal with enhanced parameters to prevent app redirect
                    setTimeout(() => {
                        updateVideoInfo(videoId);
                        // Enhanced parameters for Firefox and other mobile browsers
                        modalIframe.src = `https://www.youtube.com/embed/${videoId}?autoplay=0&rel=0&playsinline=1&modestbranding=1&fs=0&controls=1&enablejsapi=1&origin=${window.location.origin}`;
                        modal.classList.add('active');
                        document.body.style.overflow = 'hidden';
                    }, 100);
                } else {
                    // Desktop: Normal modal
                    setTimeout(() => {
                        updateVideoInfo(videoId);
                        modalIframe.src = `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`;
                        modal.classList.add('active');
                        document.body.style.overflow = 'hidden';
                    }, 100);
                }
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

    // Smooth Reveal Animations on Scroll - FIXED: Don't hide on mobile
    const revealElements = document.querySelectorAll('.project-card, .about-content, .section-title');
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, { threshold: 0.05 }); // Lower threshold for mobile

    // Only apply fade-in animation on desktop, not mobile (prevents thumbnail hiding)
    const isMobile = window.innerWidth <= 768;

    revealElements.forEach(el => {
        if (!isMobile) {
            el.style.opacity = '0';
            el.style.transform = 'translateY(30px)';
            el.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
            revealObserver.observe(el);
        } else {
            // Mobile: Just show immediately, no fade animation
            el.style.opacity = '1';
            el.style.transform = 'translateY(0)';
        }
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
        // Calculate real statistics based on start date: April 1st, 2017
        const startDate = new Date('2017-04-01');
        const today = new Date();

        // Years of experience (with decimals, rounded to 1 decimal)
        const yearsExperience = Math.floor(((today - startDate) / (1000 * 60 * 60 * 24 * 365.25)) * 10) / 10;

        // Projects: average 6-8 projects per month
        const monthsWorked = (today - startDate) / (1000 * 60 * 60 * 24 * 30.44);
        const projects = Math.floor(monthsWorked * 7); // ~7 projects per month

        // Clients: roughly 1 new client every 2 months
        const clients = Math.floor(monthsWorked / 2);

        // Coffee cups: 3 cups per working day (5 days/week)
        const daysWorked = Math.floor((today - startDate) / (1000 * 60 * 60 * 24));
        const workingDays = Math.floor(daysWorked * (5/7)); // Only working days
        const coffeeCups = Math.floor(workingDays * 3);

        // Update stat items with calculated values
        statItems.forEach((item, index) => {
            setTimeout(() => {
                item.classList.add('visible');
                const numberEl = item.querySelector('.stat-number');
                const label = item.querySelector('.stat-label').textContent;

                let target;
                if (label.includes('Years')) {
                    target = Math.floor(yearsExperience); // Show full years only
                    item.setAttribute('data-target', target);
                } else if (label.includes('Projects')) {
                    target = projects;
                    item.setAttribute('data-target', target);
                } else if (label.includes('Clients')) {
                    target = clients;
                    item.setAttribute('data-target', target);
                } else if (label.includes('Coffee')) {
                    target = coffeeCups;
                    item.setAttribute('data-target', target);
                } else {
                    target = parseInt(item.getAttribute('data-target'));
                }

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

    // Radio Player Toggle for Mobile
    const radioToggle = document.getElementById('radioToggle');
    const miniPlayer = document.getElementById('miniPlayer');

    if (radioToggle && miniPlayer) {
        radioToggle.addEventListener('click', () => {
            miniPlayer.classList.toggle('open');
            // Hide toggle when player is open
            if (miniPlayer.classList.contains('open')) {
                radioToggle.style.opacity = '0';
                radioToggle.style.pointerEvents = 'none';
            } else {
                radioToggle.style.opacity = '1';
                radioToggle.style.pointerEvents = 'auto';
            }
        });

        // Click outside to close
        document.addEventListener('click', (e) => {
            if (window.innerWidth <= 768 &&
                !miniPlayer.contains(e.target) &&
                !radioToggle.contains(e.target) &&
                miniPlayer.classList.contains('open')) {
                miniPlayer.classList.remove('open');
                radioToggle.style.opacity = '1';
                radioToggle.style.pointerEvents = 'auto';
            }
        });
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
        // Your private SoundCloud playlist
        iframe.src = 'https://w.soundcloud.com/player/?url=https%3A//on.soundcloud.com/gmdzJXQ28cU0Sunvpy&auto_play=false&hide_related=true&show_comments=false&show_user=false&show_reposts=false&visual=false';
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
    const cancelEditBtn = document.getElementById('cancelEdit');
    const exportVideosBtn = document.getElementById('exportVideos');
    const videoIdInput = document.getElementById('videoId');
    const videoNameInput = document.getElementById('videoName');
    const videoCategoryInput = document.getElementById('videoCategory');
    const videoRoleInput = document.getElementById('videoRole');
    const videoDescriptionInput = document.getElementById('videoDescription');
    const videoListContainer = document.getElementById('videoList');
    const projectsGrid = document.querySelector('.projects-grid');

    // Check if admin elements exist
    if (!adminToggle || !adminPanel) {
        console.error('Admin elements not found');
        return;
    }

    // Load custom videos from localStorage OR videos.json file
    let customVideos = JSON.parse(localStorage.getItem('customVideos')) || [];

    // Track if we're editing a video
    let editingVideoId = null;

    // GitHub Gist URL for automatic sync
    const GIST_URL = 'https://gist.githubusercontent.com/mickeyperry/4a55db213bfab3ce2b210f0e16341524/raw/videos.json';

    // Try to load videos from GitHub Gist OR videos.json file
    async function loadVideosFromFile() {
        try {
            // Try Gist first (automatic sync) with cache busting
            if (GIST_URL && GIST_URL !== 'GIST_URL_HERE') {
                const cacheBuster = `?t=${Date.now()}`;
                const response = await fetch(GIST_URL + cacheBuster);
                if (response.ok) {
                    const fileVideos = await response.json();
                    if (fileVideos && fileVideos.length > 0) {
                        customVideos = fileVideos;
                        localStorage.setItem('customVideos', JSON.stringify(customVideos));
                        console.log('Loaded videos from GitHub Gist');
                        return;
                    }
                }
            }

            // Fallback to videos.json
            const response = await fetch('videos.json');
            if (response.ok) {
                const fileVideos = await response.json();
                if (fileVideos && fileVideos.length > 0) {
                    customVideos = fileVideos;
                    localStorage.setItem('customVideos', JSON.stringify(customVideos));
                    console.log('Loaded videos from videos.json');
                }
            }
        } catch (error) {
            console.log('Using localStorage only');
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

    // Add or Update video
    addVideoBtn.addEventListener('click', () => {
        const videoId = videoIdInput.value.trim();
        const name = videoNameInput.value.trim() || 'Untitled Video';
        const category = videoCategoryInput.value.trim() || 'Custom Video';
        const role = videoRoleInput.value.trim() || 'Motion Designer';
        const description = videoDescriptionInput.value.trim();

        if (!videoId) {
            showNotification('⚠️ Please enter a YouTube video ID');
            return;
        }

        if (editingVideoId) {
            // UPDATE existing video
            const videoIndex = customVideos.findIndex(v => v.id === editingVideoId);
            if (videoIndex !== -1) {
                customVideos[videoIndex] = {
                    ...customVideos[videoIndex],
                    id: videoId,
                    name: name,
                    category: category,
                    role: role,
                    description: description
                };
                localStorage.setItem('customVideos', JSON.stringify(customVideos));

                // Clear editing state
                editingVideoId = null;
                addVideoBtn.textContent = 'Add Video';
                addVideoBtn.style.background = 'linear-gradient(135deg, var(--accent-pink), var(--accent-purple))';
                cancelEditBtn.style.display = 'none';

                showNotification('✅ Video updated successfully!');
            }
        } else {
            // ADD new video
            // Check if video already exists
            if (customVideos.some(v => v.id === videoId)) {
                showNotification('⚠️ This video is already added');
                return;
            }

            const newVideo = {
                id: videoId,
                name: name,
                category: category,
                role: role,
                description: description,
                timestamp: Date.now()
            };

            customVideos.push(newVideo);
            localStorage.setItem('customVideos', JSON.stringify(customVideos));
            showNotification('✅ Video added successfully! Remember to export to make it live.');
        }

        // Clear inputs
        videoIdInput.value = '';
        videoNameInput.value = '';
        videoCategoryInput.value = '';
        videoRoleInput.value = '';
        videoDescriptionInput.value = '';

        // Refresh displays
        renderVideoList();
        renderCustomVideos();
        playPopSound();
    });

    // Export videos to JSON file AND auto-save to GitHub Gist
    exportVideosBtn.addEventListener('click', async () => {
        if (customVideos.length === 0) {
            showNotification('⚠️ No videos to export');
            return;
        }

        // Update videos.json locally first
        const jsonData = JSON.stringify(customVideos, null, 2);

        // Try to auto-save to GitHub Gist
        try {
            const gistId = localStorage.getItem('gistId');
            const gistToken = localStorage.getItem('gistToken');

            if (gistId && gistToken) {
                const response = await fetch(`https://api.github.com/gists/${gistId}`, {
                    method: 'PATCH',
                    headers: {
                        'Authorization': `token ${gistToken}`,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        files: {
                            'videos.json': {
                                content: jsonData
                            }
                        }
                    })
                });

                if (response.ok) {
                    showNotification('✅ Videos saved automatically! Live in 10 seconds.');
                    playPopSound();
                    return;
                }
            }

            // If no gist setup, show setup instructions
            showNotification('⚠️ GitHub Gist not configured. Downloading file instead.');

        } catch (error) {
            console.error('Auto-save failed:', error);
        }

        // Fallback: Download file
        const blob = new Blob([jsonData], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'videos.json';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        showNotification('📥 Videos exported! Upload to GitHub or setup Gist for auto-sync');
        playPopSound();
    });

    // Edit video
    function editVideo(videoId) {
        const video = customVideos.find(v => v.id === videoId);
        if (!video) return;

        // Populate form with video data
        videoIdInput.value = video.id;
        videoNameInput.value = video.name || '';
        videoCategoryInput.value = video.category || '';
        videoRoleInput.value = video.role || '';
        videoDescriptionInput.value = video.description || '';

        // Set editing state
        editingVideoId = videoId;
        addVideoBtn.textContent = 'Update Video';
        addVideoBtn.style.background = 'linear-gradient(135deg, var(--accent-cyan), var(--accent-purple))';
        cancelEditBtn.style.display = 'block';

        // Scroll to form
        document.querySelector('.admin-form').scrollIntoView({ behavior: 'smooth', block: 'start' });

        showNotification('✏️ Editing mode - click Update to save changes');
    }

    // Cancel editing
    function cancelEdit() {
        editingVideoId = null;
        addVideoBtn.textContent = 'Add Video';
        addVideoBtn.style.background = 'linear-gradient(135deg, var(--accent-pink), var(--accent-purple))';
        cancelEditBtn.style.display = 'none';

        // Clear inputs
        videoIdInput.value = '';
        videoNameInput.value = '';
        videoCategoryInput.value = '';
        videoRoleInput.value = '';
        videoDescriptionInput.value = '';

        showNotification('❌ Edit cancelled');
    }

    // Cancel button click handler
    if (cancelEditBtn) {
        cancelEditBtn.addEventListener('click', cancelEdit);
    }

    // Remove video
    function removeVideo(videoId) {
        if (!confirm('Are you sure you want to remove this video?')) return;

        customVideos = customVideos.filter(v => v.id !== videoId);
        localStorage.setItem('customVideos', JSON.stringify(customVideos));

        // If we were editing this video, cancel edit mode
        if (editingVideoId === videoId) {
            cancelEdit();
        }

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
                    <strong>${video.name || video.category || 'Untitled'}</strong>
                    <span>Category: ${video.category || '—'}</span>
                    <span>Role: ${video.role || '—'}</span>
                    <span style="font-size: 0.85rem; opacity: 0.7;">ID: ${video.id}</span>
                </div>
                <div class="video-item-actions">
                    <button onclick="window.editVideoById('${video.id}')" class="edit-btn">✏️ Edit</button>
                    <button onclick="window.removeVideoById('${video.id}')" class="remove-btn">🗑️ Remove</button>
                </div>
            </div>
        `).join('');
    }

    // Make functions globally accessible
    window.removeVideoById = removeVideo;
    window.editVideoById = editVideo;
    window.cancelEdit = cancelEdit;

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
                    <img src="https://img.youtube.com/vi/${video.id}/hqdefault.jpg" alt="${video.name || video.category}" loading="eager">
                    <div class="play-overlay">▶</div>
                </div>
                <h3>${video.name || video.category}</h3>
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
                const isMobile = window.innerWidth <= 768;
                createRipple(e, card);
                setTimeout(() => {
                    updateVideoInfo(videoId);
                    if (isMobile) {
                        modalIframe.src = `https://www.youtube.com/embed/${videoId}?autoplay=0&rel=0&playsinline=1&modestbranding=1&fs=0&controls=1&enablejsapi=1&origin=${window.location.origin}`;
                    } else {
                        modalIframe.src = `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`;
                    }
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
