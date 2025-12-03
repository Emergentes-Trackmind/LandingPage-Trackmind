/* ===================================
   SPOTFINDER - MAIN JAVASCRIPT MEJORADO
   =================================== */

// Estado global mejorado
const state = {
  menuOpen: false,
  activeSection: 'home',
  observer: null,
  particles: [],
  animationFrame: null,
  isAnimating: false
};

// ===================================
// INICIALIZACIÓN
// ===================================

document.addEventListener('DOMContentLoaded', function() {
  initializeApp();
});

function initializeApp() {
  initMobileMenu();
  initSmoothScroll();
  initSectionObserver();
  initFAQAccordions();
  initFormValidation();
  initRevealAnimations();
  initParticleSystem();
  initInteractiveElements();
  initPerformanceOptimizations();

  // Marcar la sección home como activa inicialmente
  updateActiveNavLink('home');

  console.log('🚀 SpotFinder v2.0 - Sistema mejorado cargado correctamente');
}

// ===================================
// SISTEMA DE PARTÍCULAS
// ===================================

function initParticleSystem() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    return;
  }

  const particlesContainer = document.getElementById('particles');
  if (!particlesContainer) return;

  createParticles();
  animateParticles();
}

function createParticles() {
  const particlesContainer = document.getElementById('particles');
  const particleCount = window.innerWidth < 768 ? 15 : 25;

  for (let i = 0; i < particleCount; i++) {
    createParticle(i);
  }
}

function createParticle(index) {
  const particlesContainer = document.getElementById('particles');
  const particle = document.createElement('div');
  particle.className = 'particle';

  // Posición inicial aleatoria
  const x = Math.random() * window.innerWidth;
  const y = window.innerHeight + 50;

  // Propiedades de la partícula
  const particleData = {
    element: particle,
    x: x,
    y: y,
    speed: Math.random() * 2 + 1,
    drift: (Math.random() - 0.5) * 2,
    opacity: Math.random() * 0.5 + 0.3,
    delay: index * 200
  };

  particle.style.left = x + 'px';
  particle.style.top = y + 'px';
  particle.style.opacity = particleData.opacity;
  particle.style.animationDelay = particleData.delay + 'ms';

  state.particles.push(particleData);
  particlesContainer.appendChild(particle);

  // Reiniciar partícula después de que salga de la pantalla
  setTimeout(() => {
    resetParticle(particleData);
  }, 6000 + particleData.delay);
}

function resetParticle(particleData) {
  if (!particleData.element.parentNode) return;

  particleData.x = Math.random() * window.innerWidth;
  particleData.y = window.innerHeight + 50;
  particleData.element.style.left = particleData.x + 'px';
  particleData.element.style.top = particleData.y + 'px';

  setTimeout(() => {
    resetParticle(particleData);
  }, 6000);
}

function animateParticles() {
  if (state.particles.length === 0) return;

  state.particles.forEach(particle => {
    if (particle.element.parentNode) {
      particle.y -= particle.speed;
      particle.x += particle.drift;

      particle.element.style.transform = `translate(${particle.x}px, ${particle.y}px)`;

      if (particle.y < -50) {
        particle.y = window.innerHeight + 50;
        particle.x = Math.random() * window.innerWidth;
      }
    }
  });

  state.animationFrame = requestAnimationFrame(animateParticles);
}

// ===================================
// MENÚ MÓVIL MEJORADO
// ===================================

function initMobileMenu() {
  const menuToggle = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.nav');

  if (!menuToggle || !nav) return;

  menuToggle.addEventListener('click', toggleMobileMenu);

  // Cerrar menú al hacer clic en un enlace (móvil)
  const navLinks = document.querySelectorAll('.nav__link');
  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      if (window.innerWidth < 768) {
        closeMobileMenu();
      }

      // Agregar efecto de ripple
      createRippleEffect(e, link);
    });
  });

  // Cerrar menú con Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && state.menuOpen) {
      closeMobileMenu();
    }
  });

  // Cerrar menú al hacer scroll en móvil
  let scrollTimeout;
  window.addEventListener('scroll', () => {
    if (state.menuOpen && window.innerWidth < 768) {
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        closeMobileMenu();
      }, 100);
    }
  });
}

function toggleMobileMenu() {
  if (state.menuOpen) {
    closeMobileMenu();
  } else {
    openMobileMenu();
  }
}

function openMobileMenu() {
  const menuToggle = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.nav');

  state.menuOpen = true;
  menuToggle.setAttribute('aria-expanded', 'true');
  menuToggle.setAttribute('aria-label', 'Cerrar menú de navegación');

  // Crear overlay con glassmorphism
  const overlay = document.createElement('div');
  overlay.className = 'nav-overlay glass';
  overlay.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(15, 23, 42, 0.8);
    backdrop-filter: blur(10px);
    z-index: 150;
    opacity: 0;
    transition: opacity 0.3s ease;
  `;

  document.body.appendChild(overlay);
  document.body.style.overflow = 'hidden';

  // Mostrar navegación con animación mejorada
  nav.style.cssText = `
    display: block;
    position: fixed;
    top: 70px;
    left: 0;
    right: 0;
    background: linear-gradient(135deg, var(--brand-navy) 0%, #1E293B 100%);
    padding: var(--space-6);
    z-index: 200;
    box-shadow: var(--shadow-2xl);
    border-radius: 0 0 var(--radius-xl) var(--radius-xl);
    transform: translateY(-100%);
    transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    border-top: 1px solid rgba(255, 255, 255, 0.1);
  `;

  nav.querySelector('.nav__list').style.cssText = `
    flex-direction: column;
    gap: var(--space-1);
  `;

  // Animar entrada
  requestAnimationFrame(() => {
    overlay.style.opacity = '1';
    nav.style.transform = 'translateY(0)';
  });

  // Animar enlaces uno por uno
  const navLinks = nav.querySelectorAll('.nav__link');
  navLinks.forEach((link, index) => {
    link.style.opacity = '0';
    link.style.transform = 'translateX(-20px)';
    link.style.transition = 'opacity 0.3s ease, transform 0.3s ease';

    setTimeout(() => {
      link.style.opacity = '1';
      link.style.transform = 'translateX(0)';
    }, 100 + (index * 50));
  });

  // Cerrar al hacer clic en overlay
  overlay.addEventListener('click', closeMobileMenu);
}

function closeMobileMenu() {
  const menuToggle = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.nav');
  const overlay = document.querySelector('.nav-overlay');

  state.menuOpen = false;
  menuToggle.setAttribute('aria-expanded', 'false');
  menuToggle.setAttribute('aria-label', 'Abrir menú de navegación');

  if (overlay) {
    overlay.style.opacity = '0';
    nav.style.transform = 'translateY(-100%)';
    document.body.style.overflow = '';

    setTimeout(() => {
      if (overlay.parentNode) {
        overlay.remove();
      }
      nav.style.cssText = '';
      nav.querySelector('.nav__list').style.cssText = '';

      // Limpiar estilos de enlaces
      const navLinks = nav.querySelectorAll('.nav__link');
      navLinks.forEach(link => {
        link.style.cssText = '';
      });
    }, 400);
  }
}

// ===================================
// EFECTOS INTERACTIVOS
// ===================================

function initInteractiveElements() {
  initRippleEffects();
  initHoverEffects();
  initScrollEffects();
  initTypingEffect();
}

function initRippleEffects() {
  const buttons = document.querySelectorAll('.btn, .nav__link, .chip');

  buttons.forEach(button => {
    button.addEventListener('click', (e) => {
      createRippleEffect(e, button);
    });
  });
}

function createRippleEffect(event, element) {
  const rect = element.getBoundingClientRect();
  const ripple = document.createElement('span');
  const size = Math.max(rect.width, rect.height);
  const x = event.clientX - rect.left - size / 2;
  const y = event.clientY - rect.top - size / 2;

  ripple.style.cssText = `
    position: absolute;
    width: ${size}px;
    height: ${size}px;
    left: ${x}px;
    top: ${y}px;
    background: rgba(255, 255, 255, 0.3);
    border-radius: 50%;
    transform: scale(0);
    animation: ripple 0.6s ease-out;
    pointer-events: none;
    z-index: 1;
  `;

  // Agregar keyframes para ripple si no existen
  if (!document.querySelector('#ripple-styles')) {
    const style = document.createElement('style');
    style.id = 'ripple-styles';
    style.textContent = `
      @keyframes ripple {
        to {
          transform: scale(2);
          opacity: 0;
        }
      }
    `;
    document.head.appendChild(style);
  }

  element.style.position = 'relative';
  element.style.overflow = 'hidden';
  element.appendChild(ripple);

  setTimeout(() => {
    if (ripple.parentNode) {
      ripple.remove();
    }
  }, 600);
}

function initHoverEffects() {
  // Efecto de parallax en cards
  const cards = document.querySelectorAll('.benefit-card, .pricing__card, .testimonial, .contact-card');

  cards.forEach(card => {
    card.addEventListener('mouseenter', (e) => {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

      card.style.transition = 'transform 0.3s ease, box-shadow 0.3s ease';
    });

    card.addEventListener('mousemove', (e) => {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

      const rect = card.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;

      const rotateX = (y - 50) * 0.1;
      const rotateY = (x - 50) * 0.1;

      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(10px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
}

function initScrollEffects() {
  // Parallax effect para el hero
  const hero = document.querySelector('.hero');
  const heroContent = document.querySelector('.hero__content');

  if (hero && heroContent) {
    window.addEventListener('scroll', throttle(() => {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

      const scrolled = window.pageYOffset;
      const rate = scrolled * -0.5;

      heroContent.style.transform = `translateY(${rate}px)`;
    }, 16));
  }

  // Efecto de revelación progresiva
  const sections = document.querySelectorAll('section');
  sections.forEach((section, index) => {
    section.style.setProperty('--section-index', index);
  });
}

function initTypingEffect() {
  const heroTitle = document.querySelector('.hero__title');
  if (!heroTitle) return;

  const originalText = heroTitle.textContent;
  heroTitle.textContent = '';

  let index = 0;
  const typeSpeed = 50;

  function typeChar() {
    if (index < originalText.length) {
      heroTitle.textContent += originalText.charAt(index);
      index++;
      setTimeout(typeChar, typeSpeed);
    }
  }

  // Iniciar efecto después de un delay
  setTimeout(() => {
    if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      typeChar();
    } else {
      heroTitle.textContent = originalText;
    }
  }, 500);
}

// ===================================
// SCROLL SUAVE Y NAVEGACIÓN ACTIVA MEJORADOS
// ===================================

function initSmoothScroll() {
  const navLinks = document.querySelectorAll('.nav__link[href^="#"]');

  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();

      const targetId = link.getAttribute('href').substring(1);
      const targetElement = document.getElementById(targetId);

      if (targetElement) {
        smoothScrollTo(targetElement);

        // Agregar animación de pulso al elemento target
        targetElement.style.animation = 'pulse-highlight 1s ease-out';
        setTimeout(() => {
          targetElement.style.animation = '';
        }, 1000);
      }
    });
  });

  // Agregar keyframes para pulse-highlight
  if (!document.querySelector('#scroll-styles')) {
    const style = document.createElement('style');
    style.id = 'scroll-styles';
    style.textContent = `
      @keyframes pulse-highlight {
        0% { box-shadow: 0 0 0 0 rgba(56, 189, 248, 0.4); }
        50% { box-shadow: 0 0 0 20px rgba(56, 189, 248, 0.1); }
        100% { box-shadow: 0 0 0 0 rgba(56, 189, 248, 0); }
      }
    `;
    document.head.appendChild(style);
  }
}

function smoothScrollTo(element) {
  const headerHeight = document.querySelector('.header').offsetHeight;
  const targetPosition = element.offsetTop - headerHeight - 20;

  const startPosition = window.pageYOffset;
  const distance = targetPosition - startPosition;
  let startTime = null;

  function animation(currentTime) {
    if (startTime === null) startTime = currentTime;
    const timeElapsed = currentTime - startTime;
    const progress = Math.min(timeElapsed / 800, 1);

    // Easing function (ease-out)
    const ease = 1 - Math.pow(1 - progress, 3);

    window.scrollTo(0, startPosition + distance * ease);

    if (progress < 1) {
      requestAnimationFrame(animation);
    }
  }

  requestAnimationFrame(animation);
}

// ===================================
// OBSERVADOR DE SECCIONES MEJORADO
// ===================================

function initSectionObserver() {
  const sections = document.querySelectorAll('section[id]');
  const headerHeight = document.querySelector('.header').offsetHeight;

  const observerOptions = {
    rootMargin: `-${headerHeight}px 0px -30% 0px`,
    threshold: [0.1, 0.3, 0.7]
  };

  state.observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && entry.intersectionRatio > 0.3) {
        const sectionId = entry.target.id;
        updateActiveNavLink(sectionId);

        // Agregar animación de entrada a elementos
        animateElementsInSection(entry.target);
      }
    });
  }, observerOptions);

  sections.forEach(section => {
    state.observer.observe(section);
  });
}

function animateElementsInSection(section) {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const animatableElements = section.querySelectorAll('.benefit-card, .step, .pricing__card, .testimonial, .contact-card, .faq__item');

  animatableElements.forEach((element, index) => {
    if (!element.classList.contains('animated')) {
      element.classList.add('animated');
      element.style.animationDelay = `${index * 0.1}s`;
      element.style.animation = 'slideInUp 0.6s ease-out forwards';
    }
  });

  // Agregar keyframes para slideInUp
  if (!document.querySelector('#animation-styles')) {
    const style = document.createElement('style');
    style.id = 'animation-styles';
    style.textContent = `
      @keyframes slideInUp {
        from {
          opacity: 0;
          transform: translateY(30px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }
    `;
    document.head.appendChild(style);
  }
}

function updateActiveNavLink(activeSectionId) {
  if (state.activeSection === activeSectionId) return;

  state.activeSection = activeSectionId;

  const navLinks = document.querySelectorAll('.nav__link');
  navLinks.forEach(link => {
    link.classList.remove('nav__link--active');

    const href = link.getAttribute('href');
    if (href === `#${activeSectionId}`) {
      link.classList.add('nav__link--active');

      // Efecto de destello en el enlace activo
      if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        link.style.animation = 'flash 0.5s ease-out';
        setTimeout(() => {
          link.style.animation = '';
        }, 500);
      }
    }
  });
}

// ===================================
// ACORDEONES FAQ MEJORADOS
// ===================================

function initFAQAccordions() {
  const faqItems = document.querySelectorAll('.faq__item');

  faqItems.forEach((item, index) => {
    const question = item.querySelector('.faq__question');
    const answer = item.querySelector('.faq__answer');

    if (!question || !answer) return;

    // Agregar ID único para accesibilidad
    const answerId = `faq-answer-${index}`;
    answer.id = answerId;
    question.setAttribute('aria-controls', answerId);

    question.addEventListener('click', () => {
      toggleFAQItem(question, answer);
    });

    // Soporte mejorado para teclado
    question.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        toggleFAQItem(question, answer);
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        focusNextFAQItem(item);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        focusPrevFAQItem(item);
      }
    });
  });
}

function toggleFAQItem(question, answer) {
  const isExpanded = question.getAttribute('aria-expanded') === 'true';
  const faqItem = question.closest('.faq__item');

  // Cerrar todos los otros items con animación
  const allQuestions = document.querySelectorAll('.faq__question');
  const allAnswers = document.querySelectorAll('.faq__answer');

  allQuestions.forEach(q => {
    if (q !== question) {
      q.setAttribute('aria-expanded', 'false');
      q.closest('.faq__item').classList.remove('faq__item--active');
    }
  });

  allAnswers.forEach(a => {
    if (a !== answer) {
      a.style.maxHeight = '0';
      a.style.paddingTop = '0';
      a.style.paddingBottom = '0';
    }
  });

  // Togglear el item actual
  if (!isExpanded) {
    question.setAttribute('aria-expanded', 'true');
    faqItem.classList.add('faq__item--active');

    // Calcular altura real del contenido
    answer.style.maxHeight = 'none';
    const height = answer.scrollHeight;
    answer.style.maxHeight = '0';

    requestAnimationFrame(() => {
      answer.style.maxHeight = `${height + 48}px`;
      answer.style.paddingTop = 'var(--space-4)';
      answer.style.paddingBottom = 'var(--space-6)';
    });

    // Scroll suave hacia el item expandido
    setTimeout(() => {
      const headerHeight = document.querySelector('.header').offsetHeight;
      const itemTop = faqItem.offsetTop - headerHeight - 20;

      window.scrollTo({
        top: itemTop,
        behavior: 'smooth'
      });
    }, 300);
  } else {
    question.setAttribute('aria-expanded', 'false');
    faqItem.classList.remove('faq__item--active');
    answer.style.maxHeight = '0';
    answer.style.paddingTop = '0';
    answer.style.paddingBottom = '0';
  }

  // Efecto de ripple en el botón
  createRippleEffect(event, question);
}

function focusNextFAQItem(currentItem) {
  const nextItem = currentItem.nextElementSibling;
  if (nextItem) {
    nextItem.querySelector('.faq__question').focus();
  }
}

function focusPrevFAQItem(currentItem) {
  const prevItem = currentItem.previousElementSibling;
  if (prevItem) {
    prevItem.querySelector('.faq__question').focus();
  }
}

// ===================================
// VALIDACIÓN DE FORMULARIO MEJORADA
// ===================================

function initFormValidation() {
  const form = document.querySelector('.contact__form');
  if (!form) return;

  const inputs = form.querySelectorAll('.form-input');

  // Validación en tiempo real con debounce
  inputs.forEach(input => {
    let validationTimeout;

    input.addEventListener('input', () => {
      clearTimeout(validationTimeout);
      validationTimeout = setTimeout(() => {
        validateField(input);
      }, 300);

      clearFieldError(input);
    });

    input.addEventListener('blur', () => {
      validateField(input);
    });

    // Mejorar UX con autocompletado y formateo
    if (input.type === 'email') {
      input.addEventListener('input', formatEmail);
    }
  });

  // Validación al enviar con animaciones
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    handleFormSubmit(form);
  });
}

function formatEmail(event) {
  const input = event.target;
  // Remover espacios automáticamente
  input.value = input.value.trim().toLowerCase();
}

function validateField(field) {
  const value = field.value.trim();
  const fieldName = field.name;
  const errorElement = field.parentNode.querySelector('.form-error');

  let isValid = true;
  let errorMessage = '';

  // Validaciones mejoradas
  switch (fieldName) {
    case 'name':
      if (!value) {
        isValid = false;
        errorMessage = 'El nombre es obligatorio';
      } else if (value.length < 2) {
        isValid = false;
        errorMessage = 'El nombre debe tener al menos 2 caracteres';
      } else if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(value)) {
        isValid = false;
        errorMessage = 'El nombre solo puede contener letras y espacios';
      }
      break;

    case 'email':
      if (!value) {
        isValid = false;
        errorMessage = 'El email es obligatorio';
      } else if (!isValidEmail(value)) {
        isValid = false;
        errorMessage = 'Por favor ingresa un email válido';
      }
      break;

    case 'type':
      if (!value) {
        isValid = false;
        errorMessage = 'Por favor selecciona un tipo de usuario';
      }
      break;

    case 'message':
      if (!value) {
        isValid = false;
        errorMessage = 'El mensaje es obligatorio';
      } else if (value.length < 10) {
        isValid = false;
        errorMessage = 'El mensaje debe tener al menos 10 caracteres';
      } else if (value.length > 500) {
        isValid = false;
        errorMessage = 'El mensaje no puede exceder 500 caracteres';
      }
      break;
  }

  // Mostrar/ocultar error con animación
  if (isValid) {
    field.classList.remove('form-input--error');
    field.classList.add('form-input--valid');
    errorElement.textContent = '';
    errorElement.style.maxHeight = '0';
  } else {
    field.classList.add('form-input--error');
    field.classList.remove('form-input--valid');
    errorElement.textContent = errorMessage;
    errorElement.style.maxHeight = '40px';

    // Animación de shake en el campo
    field.style.animation = 'shake 0.5s ease-in-out';
    setTimeout(() => {
      field.style.animation = '';
    }, 500);
  }

  return isValid;
}

function clearFieldError(field) {
  field.classList.remove('form-input--error');
  const errorElement = field.parentNode.querySelector('.form-error');
  if (errorElement) {
    errorElement.style.maxHeight = '0';
    setTimeout(() => {
      errorElement.textContent = '';
    }, 300);
  }
}

function isValidEmail(email) {
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
  return emailRegex.test(email);
}

function handleFormSubmit(form) {
  const inputs = form.querySelectorAll('.form-input');
  const submitButton = form.querySelector('button[type="submit"]');

  let formIsValid = true;

  // Validar todos los campos
  inputs.forEach(input => {
    const fieldIsValid = validateField(input);
    if (!fieldIsValid) {
      formIsValid = false;
    }
  });

  if (!formIsValid) {
    // Enfocar el primer campo con error con scroll suave
    const firstErrorField = form.querySelector('.form-input--error');
    if (firstErrorField) {
      firstErrorField.focus();
      firstErrorField.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    // Shake animation en el formulario
    form.style.animation = 'shake 0.5s ease-in-out';
    setTimeout(() => {
      form.style.animation = '';
    }, 500);

    return;
  }

  // Simular envío con estado de carga mejorado
  submitButton.disabled = true;
  submitButton.classList.add('loading');
  submitButton.textContent = 'Enviando...';

  // Agregar spinner
  const spinner = document.createElement('div');
  spinner.className = 'spinner';
  submitButton.appendChild(spinner);

  setTimeout(() => {
    // Simular respuesta exitosa
    showFormSuccess();
    form.reset();

    // Limpiar estados de validación
    inputs.forEach(input => {
      input.classList.remove('form-input--valid', 'form-input--error');
    });

    submitButton.disabled = false;
    submitButton.classList.remove('loading');
    submitButton.textContent = 'Enviar mensaje';
    if (spinner.parentNode) {
      spinner.remove();
    }
  }, 2000);
}

function showFormSuccess() {
  // Crear mensaje de éxito mejorado
  const successMessage = document.createElement('div');
  successMessage.className = 'success-toast';
  successMessage.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: linear-gradient(135deg, var(--brand-green) 0%, #059669 100%);
    color: white;
    padding: var(--space-4) var(--space-6);
    border-radius: var(--radius-lg);
    box-shadow: var(--shadow-2xl);
    z-index: 1000;
    transform: translateX(400px);
    transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    display: flex;
    align-items: center;
    gap: var(--space-3);
    max-width: 400px;
  `;

  successMessage.innerHTML = `
    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
    </svg>
    <div>
      <strong>¡Mensaje enviado!</strong><br>
      <small>Te contactaremos pronto</small>
    </div>
  `;

  document.body.appendChild(successMessage);

  // Animar entrada
  requestAnimationFrame(() => {
    successMessage.style.transform = 'translateX(0)';
  });

  // Remover después de 5 segundos con animación
  setTimeout(() => {
    successMessage.style.transform = 'translateX(400px)';
    setTimeout(() => {
      if (successMessage.parentNode) {
        successMessage.remove();
      }
    }, 400);
  }, 5000);

  // Permitir cerrar manualmente
  successMessage.addEventListener('click', () => {
    successMessage.style.transform = 'translateX(400px)';
    setTimeout(() => {
      if (successMessage.parentNode) {
        successMessage.remove();
      }
    }, 400);
  });
}

// ===================================
// ANIMACIONES DE REVEAL MEJORADAS
// ===================================

function initRevealAnimations() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    return;
  }

  const revealElements = document.querySelectorAll(
    '.benefit-card, .step, .pricing__card, .testimonial, .contact-card, .stat'
  );

  revealElements.forEach(el => {
    el.classList.add('reveal');
  });

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const element = entry.target;
        element.classList.add('revealed');

        // Agregar delay escalonado para elementos hermanos
        const siblings = Array.from(element.parentNode.children);
        const index = siblings.indexOf(element);
        element.style.transitionDelay = `${index * 0.1}s`;

        revealObserver.unobserve(element);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
  });

  revealElements.forEach(el => {
    revealObserver.observe(el);
  });
}

// ===================================
// OPTIMIZACIONES DE PERFORMANCE
// ===================================

function initPerformanceOptimizations() {
  // Lazy loading para imágenes
  if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src;
          img.classList.remove('lazy');
          imageObserver.unobserve(img);
        }
      });
    });

    document.querySelectorAll('img[data-src]').forEach(img => {
      imageObserver.observe(img);
    });
  }

  // Prefetch de recursos críticos
  const linkPrefetch = document.createElement('link');
  linkPrefetch.rel = 'prefetch';
  linkPrefetch.href = 'main.js';
  document.head.appendChild(linkPrefetch);

  // Optimización de scroll
  let ticking = false;

  function updateScrollEffects() {
    // Actualizar header backdrop
    const header = document.querySelector('.header');
    if (window.scrollY > 50) {
      header.classList.add('header--scrolled');
    } else {
      header.classList.remove('header--scrolled');
    }

    ticking = false;
  }

  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(updateScrollEffects);
      ticking = true;
    }
  });
}

// ===================================
// UTILIDADES MEJORADAS
// ===================================

function debounce(func, wait, immediate) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      timeout = null;
      if (!immediate) func(...args);
    };
    const callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) func(...args);
  };
}

function throttle(func, limit) {
  let inThrottle;
  return function() {
    const args = arguments;
    const context = this;
    if (!inThrottle) {
      func.apply(context, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

function getRandomInRange(min, max) {
  return Math.random() * (max - min) + min;
}

// ===================================
// FUNCIONALIDADES ADICIONALES MEJORADAS
// ===================================

document.addEventListener('DOMContentLoaded', () => {
  const ctaButtons = document.querySelectorAll('.hero__ctas .btn');

  ctaButtons.forEach(button => {
    button.addEventListener('click', (e) => {
      const buttonText = button.textContent.trim();

      if (buttonText.includes('Publicar')) {
        const planesSection = document.getElementById('planes');
        if (planesSection) {
          smoothScrollTo(planesSection);

          // Highlight de las cards de pricing
          setTimeout(() => {
            const pricingCards = document.querySelectorAll('.pricing__card');
            pricingCards.forEach((card, index) => {
              setTimeout(() => {
                card.style.animation = 'bounce 0.6s ease-out';
                setTimeout(() => {
                  card.style.animation = '';
                }, 600);
              }, index * 200);
            });
          }, 800);
        }
      } else if (buttonText.includes('Descargar')) {
        showAppDownloadModal();
      }

      // Track evento
      trackEvent('cta_click', {
        button_text: buttonText,
        section: 'hero'
      });
    });
  });
});

function showAppDownloadModal() {
  const modal = document.createElement('div');
  modal.className = 'app-modal';
  modal.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(15, 23, 42, 0.8);
    backdrop-filter: blur(10px);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
    opacity: 0;
    transition: opacity 0.3s ease;
  `;

  const modalContent = document.createElement('div');
  modalContent.className = 'app-modal__content';
  modalContent.style.cssText = `
    background: white;
    padding: var(--space-8);
    border-radius: var(--radius-xl);
    max-width: 480px;
    margin: var(--space-4);
    text-align: center;
    transform: scale(0.9);
    transition: transform 0.3s ease;
    box-shadow: var(--shadow-2xl);
  `;

  modalContent.innerHTML = `
    <div style="margin-bottom: var(--space-6);">
      <svg width="64" height="64" viewBox="0 0 24 24" fill="var(--brand-sky)" style="margin-bottom: var(--space-4);">
        <path d="M17 3H7c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h10c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM7 19V5h10v14H7z"/>
      </svg>
      <h3 style="color: var(--brand-navy); margin-bottom: var(--space-3); font-size: var(--font-size-2xl); font-weight: 700;">
        Descarga SpotFinder
      </h3>
      <p style="color: var(--gray-600); margin-bottom: var(--space-6); line-height: 1.6;">
        La app estará disponible pronto en App Store y Google Play.
        ¡Regístrate para ser el primero en saberlo!
      </p>
    </div>

    <div style="display: flex; gap: var(--space-3); margin-bottom: var(--space-4);">
      <button class="btn btn--outline" style="flex: 1;" data-action="close">
        Cerrar
      </button>
      <a
      href="https://appdistribution.firebase.dev/i/8418f33986955dea"
      class="btn btn--primary"
      style="flex: 1; display: inline-flex; justify-content: center; align-items: center; text-decoration: none;"
      target="_blank"
      rel="noopener noreferrer"
      >
      Solicitar Descarga
      </a>
    </div>

    <p style="font-size: var(--font-size-sm); color: var(--gray-500);">
      Te enviaremos un email cuando esté disponible
    </p>
  `;

  modal.appendChild(modalContent);
  document.body.appendChild(modal);

  // Animar entrada
  requestAnimationFrame(() => {
    modal.style.opacity = '1';
    modalContent.style.transform = 'scale(1)';
  });

  // Event listeners
  modalContent.querySelector('[data-action="close"]').addEventListener('click', () => {
    closeModal();
  });

  modalContent.querySelector('[data-action="notify"]').addEventListener('click', () => {
    const contactSection = document.getElementById('contacto');
    closeModal();
    setTimeout(() => {
      smoothScrollTo(contactSection);
    }, 400);
  });

  // Cerrar con click en overlay
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      closeModal();
    }
  });

  // Cerrar con Escape
  const closeWithEscape = (e) => {
    if (e.key === 'Escape') {
      closeModal();
      document.removeEventListener('keydown', closeWithEscape);
    }
  };
  document.addEventListener('keydown', closeWithEscape);

  function closeModal() {
    modal.style.opacity = '0';
    modalContent.style.transform = 'scale(0.9)';
    setTimeout(() => {
      if (modal.parentNode) {
        modal.remove();
      }
    }, 300);
  }
}

// ===================================
// ANALYTICS Y TRACKING MEJORADO
// ===================================

function trackEvent(eventName, eventData = {}) {
  // Añadir timestamp y datos del usuario
  const trackingData = {
    ...eventData,
    timestamp: new Date().toISOString(),
    url: window.location.href,
    userAgent: navigator.userAgent,
    screenSize: `${window.screen.width}x${window.screen.height}`,
    viewport: `${window.innerWidth}x${window.innerHeight}`
  };

  console.log('📊 Track Event:', eventName, trackingData);

  // Aquí se integraría con el servicio de analytics real
  if (typeof gtag !== 'undefined') {
    gtag('event', eventName, trackingData);
  }

  if (typeof fbq !== 'undefined') {
    fbq('track', eventName, trackingData);
  }
}

// Tracking automático de eventos importantes
document.addEventListener('DOMContentLoaded', () => {
  // Track page view
  trackEvent('page_view', {
    page: 'landing',
    referrer: document.referrer
  });

  // Track scroll depth
  let maxScrollDepth = 0;
  const trackScrollDepth = throttle(() => {
    const scrollPercent = Math.round((window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100);
    if (scrollPercent > maxScrollDepth) {
      maxScrollDepth = scrollPercent;
      if (maxScrollDepth % 25 === 0) { // Track at 25%, 50%, 75%, 100%
        trackEvent('scroll_depth', { depth: maxScrollDepth });
      }
    }
  }, 1000);

  window.addEventListener('scroll', trackScrollDepth);

  // Track time on page
  const startTime = Date.now();
  window.addEventListener('beforeunload', () => {
    const timeOnPage = Math.round((Date.now() - startTime) / 1000);
    trackEvent('time_on_page', { seconds: timeOnPage });
  });
});

// ===================================
// MANEJO DE ERRORES Y CLEANUP MEJORADO
// ===================================

window.addEventListener('error', (e) => {
  console.error('❌ Error en SpotFinder:', e.error);
  trackEvent('javascript_error', {
    error: e.error?.message || 'Unknown error',
    stack: e.error?.stack || 'No stack trace',
    filename: e.filename,
    line: e.lineno
  });
});

window.addEventListener('beforeunload', () => {
  // Cleanup
  if (state.observer) {
    state.observer.disconnect();
  }

  if (state.animationFrame) {
    cancelAnimationFrame(state.animationFrame);
  }

  // Limpiar partículas
  state.particles.forEach(particle => {
    if (particle.element && particle.element.parentNode) {
      particle.element.remove();
    }
  });

  console.log('🧹 SpotFinder cleanup completed');
});

// ===================================
// COMPATIBILIDAD Y FALLBACKS
// ===================================

// Fallback para navegadores antiguos
if (!window.IntersectionObserver) {
  // Polyfill básico o fallback
  window.IntersectionObserver = class {
    constructor(callback) {
      this.callback = callback;
    }
    observe() {}
    unobserve() {}
    disconnect() {}
  };
}

// Fallback para requestAnimationFrame
if (!window.requestAnimationFrame) {
  window.requestAnimationFrame = function(callback) {
    return setTimeout(callback, 16);
  };
}

console.log('✨ SpotFinder v2.0 - JavaScript avanzado cargado correctamente ✅');
