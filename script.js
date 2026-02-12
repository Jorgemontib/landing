/* ============================================
   REVELIX STUDIO — V2 Interactive Scripts
   ============================================ */

(function () {
    'use strict';

    document.addEventListener('DOMContentLoaded', () => {
        initCursorGlow();
        initNavbar();
        initScrollReveal();
        initCountUp();
        initVizBars();
        initContactForm();
        initSmoothScroll();
        initRexChatbot();
    });

    /* ── Cursor Glow Follower ── */
    function initCursorGlow() {
        const glow = document.getElementById('cursorGlow');
        if (!glow || window.innerWidth < 768) return;

        let cx = window.innerWidth / 2;
        let cy = window.innerHeight / 2;
        let tx = cx, ty = cy;

        document.addEventListener('mousemove', (e) => {
            tx = e.clientX;
            ty = e.clientY;
        });

        function update() {
            cx += (tx - cx) * 0.08;
            cy += (ty - cy) * 0.08;
            glow.style.transform = `translate(${cx - 300}px, ${cy - 300}px)`;
            requestAnimationFrame(update);
        }
        update();
    }

    /* ── Navigation ── */
    function initNavbar() {
        const nav = document.getElementById('nav');
        const toggle = document.getElementById('navToggle');
        const menu = document.getElementById('navMenu');

        window.addEventListener('scroll', () => {
            nav.classList.toggle('scrolled', window.scrollY > 60);
        }, { passive: true });

        toggle.addEventListener('click', () => {
            toggle.classList.toggle('active');
            menu.classList.toggle('open');
            document.body.style.overflow = menu.classList.contains('open') ? 'hidden' : '';
        });

        menu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                toggle.classList.remove('active');
                menu.classList.remove('open');
                document.body.style.overflow = '';
            });
        });
    }

    /* ── Scroll Reveal ── */
    function initScrollReveal() {
        const elements = document.querySelectorAll('.reveal');
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
        elements.forEach(el => observer.observe(el));
    }

    /* ── Count Up Animation ── */
    function initCountUp() {
        const counters = document.querySelectorAll('[data-count]');
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateCounter(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });
        counters.forEach(el => observer.observe(el));
    }

    function animateCounter(el) {
        const target = parseInt(el.getAttribute('data-count'));
        const prefix = el.getAttribute('data-prefix') || '';
        const suffix = el.getAttribute('data-suffix') || '';
        const duration = 2000;
        const start = performance.now();

        function tick(now) {
            const elapsed = now - start;
            const progress = Math.min(elapsed / duration, 1);
            const ease = 1 - Math.pow(1 - progress, 4);
            const current = Math.round(target * ease);
            el.textContent = prefix + current.toLocaleString() + suffix;
            if (progress < 1) requestAnimationFrame(tick);
        }
        requestAnimationFrame(tick);
    }

    /* ── Viz Bars Animation ── */
    function initVizBars() {
        const container = document.getElementById('vizBars');
        if (!container) return;
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    container.classList.add('animate');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.3 });
        observer.observe(container);
    }

    /* ── Contact Form ── */
    function initContactForm() {
        const form = document.getElementById('contactForm');
        if (!form) return;

        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const btn = document.getElementById('contact-submit');
            const originalHTML = btn.innerHTML;

            btn.innerHTML = '<span style="display:flex;align-items:center;gap:0.5rem;justify-content:center"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="animation:spin 1s linear infinite"><path d="M21 12a9 9 0 11-6.219-8.56"/></svg> Enviando...</span>';
            btn.disabled = true;
            btn.style.opacity = '0.8';

            setTimeout(() => {
                btn.innerHTML = '✓ Mensaje Enviado';
                btn.style.background = '#10B981';
                btn.style.boxShadow = '0 4px 20px rgba(16, 185, 129, 0.3)';
                btn.style.opacity = '1';
                setTimeout(() => {
                    form.reset();
                    btn.innerHTML = originalHTML;
                    btn.disabled = false;
                    btn.style.background = '';
                    btn.style.boxShadow = '';
                }, 3000);
            }, 1500);
        });

        const style = document.createElement('style');
        style.textContent = '@keyframes spin { to { transform: rotate(360deg); } }';
        document.head.appendChild(style);
    }

    /* ── Smooth Scroll ── */
    function initSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                const id = anchor.getAttribute('href');
                if (id === '#') return;
                e.preventDefault();
                const target = document.querySelector(id);
                if (!target) return;
                window.scrollTo({ top: target.offsetTop - 80, behavior: 'smooth' });
            });
        });
    }

    /* ══════════════════════════════════════════
       REX CHATBOT — T-Rex Assistant 🦖
       ══════════════════════════════════════════ */
    function initRexChatbot() {
        const toggleBtn = document.getElementById('rexToggle');
        const closeBtn = document.getElementById('rexClose');
        const chatWindow = document.getElementById('rexWindow');
        const tooltip = document.getElementById('rexTooltip');
        const messagesEl = document.getElementById('rexMessages');
        const inputEl = document.getElementById('rexInput');
        const sendBtn = document.getElementById('rexSend');

        if (!toggleBtn || !chatWindow) return;

        let isOpen = false;
        let hasGreeted = false;

        // Show tooltip after 5 seconds
        setTimeout(() => {
            if (!isOpen) {
                tooltip.classList.add('visible');
                setDinoState('greeting');
                setTimeout(() => {
                    tooltip.classList.remove('visible');
                    setDinoState('idle');
                }, 5000);
            }
        }, 5000);

        // Toggle chat
        toggleBtn.addEventListener('click', () => {
            isOpen = !isOpen;
            chatWindow.classList.toggle('open', isOpen);
            tooltip.classList.remove('visible');
            if (isOpen && !hasGreeted) {
                hasGreeted = true;
                showGreeting();
            }
            if (isOpen) inputEl.focus();
        });

        closeBtn.addEventListener('click', () => {
            isOpen = false;
            chatWindow.classList.remove('open');
        });

        // Send message
        sendBtn.addEventListener('click', handleUserInput);
        inputEl.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') handleUserInput();
        });

        function handleUserInput() {
            const text = inputEl.value.trim();
            if (!text) return;
            addMessage(text, 'user');
            inputEl.value = '';
            showTypingThenRespond(() => showFallback());
        }

        // ─── Dino animation state (both toggle button AND in-chat avatar) ───
        function setDinoState(state) {
            const avatar = document.getElementById('rexAvatar');
            // Toggle button animation
            toggleBtn.classList.remove('rex--thinking', 'rex--typing', 'rex--greeting');
            if (state !== 'idle') toggleBtn.classList.add('rex--' + state);
            // In-chat avatar animation
            if (avatar) {
                avatar.classList.remove('rex-avatar--thinking', 'rex-avatar--typing', 'rex-avatar--greeting');
                if (state !== 'idle') avatar.classList.add('rex-avatar--' + state);
            }
        }

        // ─── Add message ───
        function addMessage(html, type) {
            const div = document.createElement('div');
            div.className = `rex-msg rex-msg--${type}`;
            div.innerHTML = html;
            messagesEl.appendChild(div);
            scrollToBottom();
        }

        // ─── Add options ───
        function addOptions(options) {
            const container = document.createElement('div');
            container.className = 'rex-options';

            options.forEach(opt => {
                const btn = document.createElement('button');
                btn.className = 'rex-opt' + (opt.back ? ' rex-opt--back' : '');
                btn.innerHTML = opt.label;
                btn.addEventListener('click', () => {
                    // Remove options after click
                    container.remove();
                    addMessage(opt.label, 'user');
                    showTypingThenRespond(opt.action);
                });
                container.appendChild(btn);
            });

            messagesEl.appendChild(container);
            scrollToBottom();
        }

        // ─── Typing indicator ───
        function showTyping() {
            setDinoState('typing');
            const typing = document.createElement('div');
            typing.className = 'rex-typing';
            typing.id = 'rexTyping';
            typing.innerHTML = '<span class="rex-typing__dot"></span><span class="rex-typing__dot"></span><span class="rex-typing__dot"></span>';
            messagesEl.appendChild(typing);
            scrollToBottom();
        }

        function removeTyping() {
            const t = document.getElementById('rexTyping');
            if (t) t.remove();
            setDinoState('idle');
        }

        function showTypingThenRespond(callback, delay) {
            showTyping();
            setTimeout(() => {
                removeTyping();
                callback();
            }, delay || 800 + Math.random() * 600);
        }

        function scrollToBottom() {
            setTimeout(() => {
                messagesEl.scrollTop = messagesEl.scrollHeight;
            }, 50);
        }

        // ═══════════ CONVERSATION FLOWS ═══════════

        function showGreeting() {
            setDinoState('greeting');
            showTypingThenRespond(() => {
                addMessage('🦖 <strong>¡Hola! Soy Rex</strong>, el asistente de Revelix Studio.<br>¿En qué te puedo ayudar?', 'bot');
                showMainMenu();
            });
        }

        function showMainMenu() {
            addOptions([
                { label: '🔍 ¿Qué servicios ofrecen?', action: showServices },
                { label: '💰 ¿Cuánto cuesta?', action: showPricing },
                { label: '⚙️ ¿Cómo trabajan?', action: showProcess },
                { label: '📅 Agendar consulta gratis', action: showBooking },
            ]);
        }

        // ─── SERVICES ───
        function showServices() {
            addMessage('¡Buena pregunta! En Revelix Studio nos enfocamos en <strong>4 áreas clave</strong>. ¿Cuál te interesa?', 'bot');
            addOptions([
                { label: '📊 Data & Analytics', action: showDataService },
                { label: '🌐 Desarrollo Web', action: showWebService },
                { label: '🤖 Inteligencia Artificial', action: showAIService },
                { label: '⚙️ Software a Medida', action: showSoftwareService },
                { label: '← Volver al inicio', action: () => { addMessage('¡Claro! ¿En qué más puedo ayudarte?', 'bot'); showMainMenu(); }, back: true },
            ]);
        }

        function showDataService() {
            addMessage('Transformamos tus datos caóticos en <strong>dashboards claros</strong> que te dicen exactamente qué está pasando en tu negocio.<br><br>Incluye:<br>• Dashboards interactivos en Power BI<br>• Reportes automatizados (adiós Excel manual)<br>• Integración de múltiples fuentes de datos<br>• KPIs y métricas de negocio<br><br><strong>Ideal para:</strong> empresas que toman decisiones basadas en intuición y quieren pasar a decisiones basadas en datos.', 'bot');
            addServiceEndOptions();
        }

        function showWebService() {
            addMessage('Creamos sitios y aplicaciones web que no solo se ven increíbles, sino que <strong>convierten visitantes en clientes</strong>.<br><br>Incluye:<br>• Landing pages de alto impacto<br>• Aplicaciones web (SaaS)<br>• E-commerce<br>• Portales y plataformas<br><br><strong>Dato:</strong> Esta misma página que estás viendo la construimos nosotros — incluyéndome a mí 😉', 'bot');
            addServiceEndOptions();
        }

        function showAIService() {
            addMessage('Implementamos soluciones de IA que automatizan procesos y atienden a tus clientes 24/7 — <strong>como yo, por ejemplo</strong> 😊<br><br>Incluye:<br>• Chatbots inteligentes (como este)<br>• Automatización de procesos<br>• Análisis predictivo<br>• Asistentes virtuales<br><br><strong>Ideal para:</strong> empresas con procesos repetitivos o que necesitan atender clientes fuera de horario.', 'bot');
            addServiceEndOptions();
        }

        function showSoftwareService() {
            addMessage('Cuando las soluciones genéricas no alcanzan, construimos <strong>exactamente lo que tu operación necesita</strong>.<br><br>Incluye:<br>• APIs e integraciones entre sistemas<br>• Sistemas de gestión internos<br>• Aplicaciones móviles<br>• Herramientas personalizadas<br><br><strong>Ideal para:</strong> empresas con flujos de trabajo únicos que no encuentran solución en software estándar.', 'bot');
            addServiceEndOptions();
        }

        function addServiceEndOptions() {
            addOptions([
                { label: '💰 ¿Cuánto cuesta esto?', action: showPricing },
                { label: '📅 Agendar consulta gratis', action: showBooking },
                { label: '← Ver otros servicios', action: showServices, back: true },
            ]);
        }

        // ─── PRICING ───
        function showPricing() {
            addMessage('Cada proyecto es único, pero estas son nuestras <strong>soluciones base</strong> para que tengas una referencia:<br><br>📊 Dashboard Power BI → desde <strong>$400 USD</strong><br>🌐 Landing Page premium → desde <strong>$350 USD</strong><br>🤖 Chatbot FAQ (como yo 😉) → desde <strong>$500 USD</strong><br>⚙️ API / Integración → desde <strong>$600 USD</strong><br><br>Los precios finales dependen de la complejidad de tu proyecto. <strong>La consulta inicial es gratis</strong> y ahí definimos todo.', 'bot');
            addOptions([
                { label: '📅 Agendar consulta gratis', action: showBooking },
                { label: '🔍 Ver detalle de servicios', action: showServices },
                { label: '← Volver al inicio', action: () => { addMessage('¡Claro! ¿En qué más puedo ayudarte?', 'bot'); showMainMenu(); }, back: true },
            ]);
        }

        // ─── PROCESS ───
        function showProcess() {
            addMessage('Nuestro proceso es simple:<br><br><strong>1️⃣ Escuchamos</strong> → Entendemos tu negocio, tus metas y tus dolores reales.<br><br><strong>2️⃣ Diseñamos</strong> → Te mostramos el plan antes de construir. Sin sorpresas.<br><br><strong>3️⃣ Entregamos</strong> → Producto 100% funcional desde el día uno.<br><br>Todo esto suele tardar entre <strong>1 y 4 semanas</strong> dependiendo del proyecto.', 'bot');
            addOptions([
                { label: '📅 Agendar consulta', action: showBooking },
                { label: '💰 ¿Cuánto cuesta?', action: showPricing },
                { label: '← Volver al inicio', action: () => { addMessage('¡Claro! ¿En qué más puedo ayudarte?', 'bot'); showMainMenu(); }, back: true },
            ]);
        }

        // ─── BOOKING ───
        function showBooking() {
            setDinoState('greeting');
            setTimeout(() => setDinoState('idle'), 600);
            addMessage('🎉 <strong>¡Excelente decisión!</strong><br><br>Tienes dos opciones rápidas:<br><br>📧 <strong>Email:</strong> <a href="mailto:hola@revelixstudio.com">hola@revelixstudio.com</a><br>💬 <strong>WhatsApp:</strong> <a href="https://wa.me/5491176511863" target="_blank">Escríbenos</a><br><br>O si prefieres, llena el formulario aquí abajo ↓', 'bot');
            addOptions([
                {
                    label: '📝 Ir al formulario', action: () => {
                        isOpen = false;
                        chatWindow.classList.remove('open');
                        const contactSection = document.getElementById('contacto');
                        if (contactSection) {
                            window.scrollTo({ top: contactSection.offsetTop - 80, behavior: 'smooth' });
                        }
                    }
                },
                { label: '← Volver al inicio', action: () => { addMessage('¡Claro! ¿En qué más puedo ayudarte?', 'bot'); showMainMenu(); }, back: true },
            ]);
        }

        // ─── FALLBACK (free text) ───
        function showFallback() {
            addMessage('¡Gracias por escribir! Para darte la mejor respuesta, te recomiendo agendar una <strong>consulta gratuita</strong> donde podemos conversar en detalle sobre tu proyecto.<br><br>¿Te puedo ayudar con algo más?', 'bot');
            showMainMenu();
        }
    }

})();
