/* ==========================================================================
   Vikrant Thakur — Portfolio Script
   Sections: Loader, Custom Cursor, Scroll Progress, Navbar, Typing Animation,
   Scroll Reveal, Timeline Fill, Animated Counters, Theme Toggle,
   Gallery Lightbox, Contact Form Validation, Back To Top, Footer Year
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

  /* ---------------- Loader ---------------- */
  const loader = document.getElementById('loader');
  window.addEventListener('load', () => {
    setTimeout(() => loader.classList.add('hidden'), 400);
  });
  // Fallback in case load event already fired
  setTimeout(() => loader && loader.classList.add('hidden'), 2500);

  /* ---------------- Footer Year ---------------- */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------------- Custom Cursor ---------------- */
  const cursorDot = document.getElementById('cursorDot');
  const cursorRing = document.getElementById('cursorRing');
  const isTouch = window.matchMedia('(hover: none), (pointer: coarse)').matches;

  if (!isTouch && cursorDot && cursorRing) {
    let mouseX = 0, mouseY = 0, ringX = 0, ringY = 0;

    window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      cursorDot.style.left = mouseX + 'px';
      cursorDot.style.top = mouseY + 'px';
    });

    function animateRing() {
      ringX += (mouseX - ringX) * 0.18;
      ringY += (mouseY - ringY) * 0.18;
      cursorRing.style.left = ringX + 'px';
      cursorRing.style.top = ringY + 'px';
      requestAnimationFrame(animateRing);
    }
    animateRing();

    const hoverTargets = 'a, button, .skill-card, .project-card, .gallery-item, input, textarea';
    document.querySelectorAll(hoverTargets).forEach(el => {
      el.addEventListener('mouseenter', () => cursorRing.classList.add('hovering'));
      el.addEventListener('mouseleave', () => cursorRing.classList.remove('hovering'));
    });
  }

  /* ---------------- Mouse Glow on Hero ---------------- */
  const hero = document.querySelector('.hero');
  if (hero) {
    hero.addEventListener('mousemove', (e) => {
      const rect = hero.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      hero.style.background = `radial-gradient(600px circle at ${x}% ${y}%, rgba(0,212,255,0.06), transparent 55%)`;
    });
    hero.addEventListener('mouseleave', () => { hero.style.background = 'none'; });
  }

  /* ---------------- Scroll Progress Bar ---------------- */
  const scrollProgress = document.getElementById('scrollProgress');
  function updateScrollProgress() {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    if (scrollProgress) scrollProgress.style.width = pct + '%';
  }

  /* ---------------- Navbar: sticky style + active link + back-to-top ---------------- */
  const navbar = document.getElementById('navbar');
  const backToTop = document.getElementById('backToTop');
  const sections = document.querySelectorAll('main .section, .hero');
  const navLinks = document.querySelectorAll('[data-nav]');

  function updateNavOnScroll() {
    const y = window.scrollY;

    // sticky style
    if (navbar) navbar.classList.toggle('scrolled', y > 40);

    // back to top visibility
    if (backToTop) backToTop.classList.toggle('visible', y > 600);

    // active section
    let current = sections[0] ? sections[0].id : '';
    sections.forEach(sec => {
      const top = sec.offsetTop - 140;
      if (y >= top) current = sec.id;
    });
    navLinks.forEach(link => {
      link.classList.toggle('active', link.getAttribute('href') === '#' + current);
    });

    // timeline fill
    updateTimelineFill();
  }

  window.addEventListener('scroll', () => {
    updateScrollProgress();
    updateNavOnScroll();
  }, { passive: true });

  /* ---------------- Mobile Nav ---------------- */
  const hamburger = document.getElementById('hamburger');
  const mobileNav = document.getElementById('mobileNav');

  function closeMobileNav() {
    hamburger.classList.remove('open');
    mobileNav.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
  }

  if (hamburger && mobileNav) {
    hamburger.addEventListener('click', () => {
      const isOpen = mobileNav.classList.toggle('open');
      hamburger.classList.toggle('open', isOpen);
      hamburger.setAttribute('aria-expanded', String(isOpen));
    });
  }

  document.querySelectorAll('[data-nav]').forEach(link => {
    link.addEventListener('click', () => closeMobileNav());
  });

  /* ---------------- Typing Animation ---------------- */
  const typingText = document.getElementById('typingText');
  const roles = ['Web Developer', 'Technology Enthusiast', 'Photographer', 'Student', 'Future Software Engineer'];

  if (typingText) {
    let roleIndex = 0, charIndex = 0, deleting = false;

    function typeLoop() {
      const current = roles[roleIndex];

      if (!deleting) {
        charIndex++;
        typingText.textContent = current.slice(0, charIndex);
        if (charIndex === current.length) {
          deleting = true;
          setTimeout(typeLoop, 1500);
          return;
        }
      } else {
        charIndex--;
        typingText.textContent = current.slice(0, charIndex);
        if (charIndex === 0) {
          deleting = false;
          roleIndex = (roleIndex + 1) % roles.length;
        }
      }
      setTimeout(typeLoop, deleting ? 45 : 85);
    }
    typeLoop();
  }

  /* ---------------- Scroll Reveal ---------------- */
  const revealEls = document.querySelectorAll('.reveal');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });

  revealEls.forEach((el, i) => {
    el.style.transitionDelay = (i % 6) * 60 + 'ms';
    revealObserver.observe(el);
  });

  /* ---------------- Timeline Fill ---------------- */
  const timelineFill = document.getElementById('timelineFill');
  const timelineEl = document.querySelector('.timeline');

  function updateTimelineFill() {
    if (!timelineFill || !timelineEl) return;
    const rect = timelineEl.getBoundingClientRect();
    const viewportH = window.innerHeight;
    const total = rect.height;
    let visible = viewportH * 0.75 - rect.top;
    visible = Math.max(0, Math.min(visible, total));
    const pct = total > 0 ? (visible / total) * 100 : 0;
    timelineFill.style.height = pct + '%';
  }

  /* ---------------- Animated Counters ---------------- */
  const statNumbers = document.querySelectorAll('.stat-number');
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        counterObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  statNumbers.forEach(el => counterObserver.observe(el));

  function animateCounter(el) {
    const target = parseInt(el.getAttribute('data-count'), 10) || 0;
    const duration = 1600;
    const startTime = performance.now();

    function tick(now) {
      const progress = Math.min((now - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.floor(eased * target);
      if (progress < 1) {
        requestAnimationFrame(tick);
      } else {
        el.textContent = target;
      }
    }
    requestAnimationFrame(tick);
  }

  /* ---------------- Theme Toggle (Dark / Light) ---------------- */
  const themeToggle = document.getElementById('themeToggle');
  const root = document.documentElement;
  const savedTheme = getStoredTheme();

  if (savedTheme) {
    root.setAttribute('data-theme', savedTheme);
  }

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const current = root.getAttribute('data-theme') === 'light' ? 'light' : 'dark';
      const next = current === 'light' ? 'dark' : 'light';
      if (next === 'light') {
        root.setAttribute('data-theme', 'light');
      } else {
        root.removeAttribute('data-theme');
      }
      storeTheme(next);
    });
  }

  // In-memory fallback so the toggle still works if storage is unavailable
  let memoryTheme = null;
  function getStoredTheme() {
    try {
      return localStorage.getItem('vt-theme') || memoryTheme;
    } catch (e) {
      return memoryTheme;
    }
  }
  function storeTheme(value) {
    memoryTheme = value;
    try { localStorage.setItem('vt-theme', value); } catch (e) { /* ignore */ }
  }

  /* ---------------- Gallery Lightbox ---------------- */
  const galleryItems = document.querySelectorAll('.gallery-item');
  const lightbox = document.getElementById('lightbox');
  const lightboxImage = document.getElementById('lightboxImage');
  const lightboxCaption = document.getElementById('lightboxCaption');
  const lightboxClose = document.getElementById('lightboxClose');

  galleryItems.forEach(item => {
    item.addEventListener('click', () => {
      const g1 = getComputedStyle(item).getPropertyValue('--g1').trim();
      const g2 = getComputedStyle(item).getPropertyValue('--g2').trim();
      const icon = item.querySelector('.gallery-icon').textContent;
      const caption = item.getAttribute('data-caption') || '';

      lightboxImage.style.background = `linear-gradient(135deg, ${g1}, ${g2})`;
      lightboxImage.textContent = icon;
      lightboxCaption.textContent = caption;
      lightbox.classList.add('open');
      document.body.style.overflow = 'hidden';
    });
  });

  function closeLightbox() {
    lightbox.classList.remove('open');
    document.body.style.overflow = '';
  }

  if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
  if (lightbox) {
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) closeLightbox();
    });
  }
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeLightbox();
  });

  /* ---------------- Contact Form Validation ---------------- */
  const contactForm = document.getElementById('contactForm');
  const submitLabel = document.getElementById('submitLabel');
  const formSuccess = document.getElementById('formSuccess');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      formSuccess.classList.remove('show');

      const fields = [
        { id: 'name', test: v => v.trim().length > 1 },
        { id: 'email', test: v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()) },
        { id: 'subject', test: v => v.trim().length > 2 },
        { id: 'message', test: v => v.trim().length > 6 }
      ];

      let valid = true;
      fields.forEach(field => {
        const input = document.getElementById(field.id);
        const group = input.closest('.form-group');
        const ok = field.test(input.value);
        group.classList.toggle('invalid', !ok);
        if (!ok) valid = false;
      });

      if (!valid) return;

      const submitBtn = contactForm.querySelector('.btn-submit');
      submitBtn.classList.add('sending');
      submitLabel.textContent = 'Sending...';

      setTimeout(() => {
        submitBtn.classList.remove('sending');
        submitLabel.textContent = 'Send Message';
        formSuccess.classList.add('show');
        contactForm.reset();
        fields.forEach(field => {
          document.getElementById(field.id).closest('.form-group').classList.remove('invalid');
        });
        setTimeout(() => formSuccess.classList.remove('show'), 5000);
      }, 900);
    });

    // Clear invalid state as user types
    contactForm.querySelectorAll('input, textarea').forEach(el => {
      el.addEventListener('input', () => {
        el.closest('.form-group').classList.remove('invalid');
      });
    });
  }

  /* ---------------- Back To Top ---------------- */
  if (backToTop) {
    backToTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ---------------- Scroll Indicator ---------------- */
  const scrollIndicator = document.getElementById('scrollIndicator');
  if (scrollIndicator) {
    scrollIndicator.addEventListener('click', () => {
      const about = document.getElementById('about');
      if (about) about.scrollIntoView({ behavior: 'smooth' });
    });
  }

  /* ---------------- Initial calls ---------------- */
  updateScrollProgress();
  updateNavOnScroll();
});
/* =========================================
   BODMAS CALCULATOR
========================================= */

(function () {

    "use strict";


    const modal =
        document.getElementById("calculatorModal");

    const openButton =
        document.getElementById("openCalculator");

    const closeButton =
        document.getElementById("closeCalculator");

    const overlay =
        document.getElementById("calculatorOverlay");

    const expressionDisplay =
        document.getElementById("calcExpression");

    const resultDisplay =
        document.getElementById("calcResult");

    const keys =
        document.querySelector(".calculator-keys");

    const historyContainer =
        document.getElementById("calcHistory");

    const clearHistoryButton =
        document.getElementById("clearCalcHistory");


    let expression = "";

    let history = [];


    /* =====================================
       OPEN / CLOSE
    ===================================== */

    function openCalculator() {

        modal.classList.add("active");

        document.body.style.overflow = "hidden";

    }


    function closeCalculator() {

        modal.classList.remove("active");

        document.body.style.overflow = "";

    }


    openButton.addEventListener(
        "click",
        openCalculator
    );


    closeButton.addEventListener(
        "click",
        closeCalculator
    );


    overlay.addEventListener(
        "click",
        closeCalculator
    );


    /* =====================================
       DISPLAY
    ===================================== */

    function updateDisplay() {

        expressionDisplay.textContent =
            formatExpression(expression);

    }


    function formatExpression(value) {

        return value
            .replace(/\*/g, " × ")
            .replace(/\//g, " ÷ ")
            .replace(/\+/g, " + ")
            .replace(/(?<=\d)-(?=\d|\()/g, " − ")
            .replace(/\^/g, " ^ ")
            .replace(/\s+/g, " ")
            .trim();

    }


    /* =====================================
       INPUT
    ===================================== */

    function addValue(value) {


        /*
         * NUMBER
         */

        if (/^[0-9]$/.test(value)) {

            expression += value;

            updateDisplay();

            return;
        }


        /*
         * DECIMAL
         */

        if (value === ".") {

            const currentNumber =
                expression.split(/[+\-*/^()]/).pop();

            if (
                currentNumber.includes(".")
            ) {
                return;
            }

            expression += ".";

            updateDisplay();

            return;
        }


        /*
         * OPEN BRACKET
         */

        if (value === "(") {

            const last =
                expression.slice(-1);

            if (
                expression === "" ||
                ["+", "-", "*", "/", "^", "("]
                    .includes(last)
            ) {

                expression += "(";

                updateDisplay();
            }

            return;
        }


        /*
         * CLOSE BRACKET
         */

        if (value === ")") {

            const last =
                expression.slice(-1);

            if (
                expression === "" ||
                ["+", "-", "*", "/", "^", "("]
                    .includes(last)
            ) {
                return;
            }

            expression += ")";

            updateDisplay();

            return;
        }


        /*
         * PLUS
         */

        if (value === "+") {

            const last =
                expression.slice(-1);

            if (
                !expression ||
                ["+", "*", "/", "^", "("]
                    .includes(last)
            ) {
                return;
            }

            expression += "+";

            updateDisplay();

            return;
        }


        /*
         * MINUS
         *
         * This handles BOTH:
         *
         * 33 - 61
         *
         * and
         *
         * -33
         *
         * and
         *
         * 33 × -2
         */

        if (value === "-") {

            const last =
                expression.slice(-1);


            /*
             * Beginning:
             *
             * -33
             */

            if (!expression) {

                expression = "-";

                updateDisplay();

                return;
            }


            /*
             * After an operator:
             *
             * 33 × -2
             */

            if (
                ["+", "*", "/", "^", "("]
                    .includes(last)
            ) {

                expression += "-";

                updateDisplay();

                return;
            }


            /*
             * After number or ):
             *
             * 33 - 61
             */

            if (
                /[0-9)]/.test(last)
            ) {

                expression += "-";

                updateDisplay();

                return;
            }

            return;
        }


        /*
         * MULTIPLY / DIVIDE / POWER
         */

        if (
            ["*", "/", "^"].includes(value)
        ) {

            const last =
                expression.slice(-1);

            if (
                !expression ||
                ["+", "-", "*", "/", "^", "("]
                    .includes(last)
            ) {
                return;
            }

            expression += value;

            updateDisplay();

        }

    }


    /* =====================================
       DELETE
    ===================================== */

    function deleteLast() {

        expression =
            expression.slice(0, -1);

        resultDisplay.textContent =
            expression ? "0" : "0";

        updateDisplay();

    }


    /* =====================================
       CLEAR
    ===================================== */

    function clearCalculator() {

        expression = "";

        expressionDisplay.textContent = "";

        resultDisplay.textContent = "0";

    }


    /* =====================================
       PERCENT
    ===================================== */

    function percentage() {

        const match =
            expression.match(
                /(-?\d+(?:\.\d+)?)$/
            );

        if (!match) {
            return;
        }

        const number =
            Number(match[1]);

        expression =
            expression.slice(
                0,
                -match[1].length
            ) + (number / 100);

        updateDisplay();

    }


    /* =====================================
       TOKENIZER
    ===================================== */

    function tokenize(input) {

        const tokens = [];

        let number = "";


        function pushNumber() {

            if (!number) {
                return;
            }

            if (
                number === "." ||
                (number.match(/\./g) || []).length > 1
            ) {

                throw new Error(
                    "Invalid number"
                );
            }

            tokens.push(Number(number));

            number = "";

        }


        for (
            let i = 0;
            i < input.length;
            i++
        ) {

            const char =
                input[i];


            if (
                /[0-9.]/.test(char)
            ) {

                number += char;

                continue;
            }


            pushNumber();


            if (
                ["+", "-", "*", "/", "^"]
                    .includes(char)
            ) {

                tokens.push(char);

                continue;
            }


            if (
                char === "(" ||
                char === ")"
            ) {

                tokens.push(char);

                continue;
            }


            throw new Error(
                "Invalid character"
            );

        }


        pushNumber();

        return tokens;

    }


    /* =====================================
       BODMAS PARSER
    ===================================== */

    const precedence = {

        "+": 1,
        "-": 1,

        "*": 2,
        "/": 2,

        "u-": 3,

        "^": 4

    };


    const rightAssociative = {

        "^": true,
        "u-": true

    };


    function toPostfix(tokens) {

        const output = [];

        const operators = [];

        let previous = null;


        for (const token of tokens) {


            /*
             * NUMBER
             */

            if (
                typeof token === "number"
            ) {

                output.push(token);

                previous = "number";

                continue;
            }


            /*
             * (
             */

            if (token === "(") {

                operators.push("(");

                previous = "(";

                continue;
            }


            /*
             * )
             */

            if (token === ")") {

                while (
                    operators.length &&
                    operators[operators.length - 1] !== "("
                ) {

                    output.push(
                        operators.pop()
                    );

                }


                if (
                    !operators.length
                ) {

                    throw new Error(
                        "Mismatched brackets"
                    );
                }


                operators.pop();

                previous = ")";

                continue;
            }


            /*
             * UNARY MINUS
             */

            let operator = token;


            if (
                token === "-" &&
                (
                    previous === null ||
                    previous === "operator" ||
                    previous === "("
                )
            ) {

                operator = "u-";

            }


            /*
             * Operator precedence
             */

            while (
                operators.length &&
                operators[operators.length - 1] !== "("
            ) {

                const top =
                    operators[operators.length - 1];

                const current =
                    precedence[operator];

                const topPriority =
                    precedence[top];


                const pop =
                    rightAssociative[operator]
                        ? current < topPriority
                        : current <= topPriority;


                if (!pop) {
                    break;
                }


                output.push(
                    operators.pop()
                );

            }


            operators.push(operator);

            previous = "operator";

        }


        if (
            previous === "operator"
        ) {

            throw new Error(
                "Incomplete expression"
            );

        }


        while (
            operators.length
        ) {

            const operator =
                operators.pop();


            if (
                operator === "("
            ) {

                throw new Error(
                    "Mismatched brackets"
                );

            }


            output.push(operator);

        }


        return output;

    }


    /* =====================================
       CALCULATE
    ===================================== */

    function evaluatePostfix(postfix) {

        const stack = [];


        for (
            const token of postfix
        ) {


            if (
                typeof token === "number"
            ) {

                stack.push(token);

                continue;

            }


            /*
             * Unary minus
             */

            if (
                token === "u-"
            ) {

                if (
                    stack.length < 1
                ) {

                    throw new Error(
                        "Invalid expression"
                    );
                }

                stack.push(
                    -stack.pop()
                );

                continue;

            }


            if (
                stack.length < 2
            ) {

                throw new Error(
                    "Invalid expression"
                );
            }


            const right =
                stack.pop();

            const left =
                stack.pop();


            let result;


            switch (token) {

                case "+":

                    result =
                        left + right;

                    break;


                case "-":

                    result =
                        left - right;

                    break;


                case "*":

                    result =
                        left * right;

                    break;


                case "/":

                    if (
                        right === 0
                    ) {

                        throw new Error(
                            "Cannot divide by zero"
                        );

                    }

                    result =
                        left / right;

                    break;


                case "^":

                    result =
                        Math.pow(
                            left,
                            right
                        );

                    break;


                default:

                    throw new Error(
                        "Unknown operator"
                    );

            }


            stack.push(result);

        }


        if (
            stack.length !== 1
        ) {

            throw new Error(
                "Invalid expression"
            );

        }


        if (
            !Number.isFinite(stack[0])
        ) {

            throw new Error(
                "Invalid result"
            );

        }


        return stack[0];

    }


    /* =====================================
       CALCULATE BUTTON
    ===================================== */

    function calculate() {

        if (!expression) {
            return;
        }


        try {

            const tokens =
                tokenize(expression);


            const postfix =
                toPostfix(tokens);


            const answer =
                evaluatePostfix(postfix);


            const clean =
                Math.round(
                    (answer + Number.EPSILON) *
                    10000000000
                ) / 10000000000;


            resultDisplay.textContent =
                formatNumber(clean);


            addHistory(
                formatExpression(expression),
                formatNumber(clean)
            );


        } catch (error) {

            resultDisplay.textContent =
                error.message;

        }

    }


    /* =====================================
       FORMAT NUMBER
    ===================================== */

    function formatNumber(number) {

        return Number(number).toLocaleString(
            "en-US",
            {
                maximumFractionDigits: 10
            }
        );

    }


    /* =====================================
       HISTORY
    ===================================== */

    function addHistory(
        calculation,
        result
    ) {

        history.unshift({
            calculation,
            result
        });


        history =
            history.slice(0, 8);


        renderHistory();

    }


    function renderHistory() {

        if (
            history.length === 0
        ) {

            historyContainer.innerHTML =
                `
                <span class="calc-history-empty">
                    No calculations yet
                </span>
                `;

            return;
        }


        historyContainer.innerHTML =
            history.map(item => {

                return `
                    <div class="calc-history-row">
                        <span>
                            ${item.calculation}
                        </span>

                        <strong>
                            ${item.result}
                        </strong>
                    </div>
                `;

            }).join("");

    }


    /* =====================================
       BUTTON EVENTS
    ===================================== */

    keys.addEventListener(
        "click",
        function (event) {

            const button =
                event.target.closest("button");


            if (!button) {
                return;
            }


            const value =
                button.dataset.calcValue;

            const action =
                button.dataset.calcAction;


            if (
                value !== undefined
            ) {

                addValue(value);

                return;

            }


            switch (action) {

                case "clear":

                    clearCalculator();

                    break;


                case "delete":

                    deleteLast();

                    break;


                case "calculate":

                    calculate();

                    break;


                case "percent":

                    percentage();

                    break;


                case "sign":

                    addValue("-");

                    break;

            }

        }
    );


    /* =====================================
       KEYBOARD SUPPORT
    ===================================== */

    document.addEventListener(
        "keydown",
        function (event) {

            if (
                !modal.classList.contains("active")
            ) {
                return;
            }


            const key =
                event.key;


            if (
                /^[0-9.]$/.test(key)
            ) {

                addValue(key);

                return;
            }


            if (
                ["+", "-", "*", "/", "^", "(", ")"]
                    .includes(key)
            ) {

                addValue(key);

                return;
            }


            if (
                key === "Enter" ||
                key === "="
            ) {

                event.preventDefault();

                calculate();

                return;
            }


            if (
                key === "Backspace"
            ) {

                deleteLast();

                return;
            }


            if (
                key === "Escape"
            ) {

                closeCalculator();

            }

        }
    );


    /* =====================================
       CLEAR HISTORY
    ===================================== */

    clearHistoryButton.addEventListener(
        "click",
        function () {

            history = [];

            renderHistory();

        }
    );

})();
