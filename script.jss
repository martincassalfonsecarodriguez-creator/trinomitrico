/**
 * trinomitrico - Minimalist Portfolio & Contact Page Scripts
 * Vanilla JavaScript (Zero External Dependencies)
 */

document.addEventListener('DOMContentLoaded', () => {
  initMobileMenu();
  initProjectsFilter();
  initContactForm();
  initCopyEmail();
  initModalListeners();
});

/* ==========================================================================
   1. Carga Inteligente del Logo con Rutas Candidatas y Fallback
   ========================================================================== */
const logoCandidatePaths = [
  './download/mitm.png',
  './download/mitm.jpg',
  './downloads/mitm.png',
  './downloads/mitm.jpg'
];

let currentLogoCandidateIndex = 0;

/**
 * Función invocada al dispararse onerror en la etiqueta <img> del logo.
 * Intenta secuencialmente las rutas solicitadas y, si ninguna existe,
 * activa el diseño de fallback tipográfico minimalista.
 */
function handleLogoError(imgElement) {
  currentLogoCandidateIndex++;
  
  if (currentLogoCandidateIndex < logoCandidatePaths.length) {
    imgElement.src = logoCandidatePaths[currentLogoCandidateIndex];
  } else {
    // Si ninguna ruta contiene la imagen localmente, ocultamos el img roto
    imgElement.style.display = 'none';
    const fallback = document.getElementById('logo-text-fallback');
    if (fallback) {
      fallback.classList.remove('hidden');
    }
  }
}

// Hacemos accesible la función en el ámbito global (window)
window.handleLogoError = handleLogoError;

/* ==========================================================================
   2. Menú Móvil / Navegación Adaptativa
   ========================================================================== */
function initMobileMenu() {
  const toggleBtn = document.getElementById('mobile-menu-toggle');
  const nav = document.getElementById('main-nav');

  if (!toggleBtn || !nav) return;

  toggleBtn.addEventListener('click', () => {
    const isExpanded = toggleBtn.getAttribute('aria-expanded') === 'true';
    toggleBtn.setAttribute('aria-expanded', String(!isExpanded));
    nav.classList.toggle('active');
  });

  // Cerrar menú al hacer clic en un enlace
  const navLinks = nav.querySelectorAll('.nav-link');
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      nav.classList.remove('active');
      toggleBtn.setAttribute('aria-expanded', 'false');
    });
  });
}

/* ==========================================================================
   3. Filtro de Proyectos de Scratch
   ========================================================================== */
function initProjectsFilter() {
  const filterButtons = document.querySelectorAll('.filter-chip');
  const projectCards = document.querySelectorAll('.project-card');

  if (!filterButtons.length || !projectCards.length) return;

  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      filterButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      projectCards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filterValue === 'all' || category === filterValue) {
          card.style.display = 'flex';
          card.style.animation = 'fadeIn 0.3s ease forwards';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

/* ==========================================================================
   4. Formulario de Contacto Minimalista & Validación
   ========================================================================== */
function initContactForm() {
  const form = document.getElementById('contact-form');
  const submitBtn = document.getElementById('submit-btn');
  const feedback = document.getElementById('form-feedback');

  if (!form) return;

  const nameInput = document.getElementById('contact-name');
  const emailInput = document.getElementById('contact-email');
  const messageInput = document.getElementById('contact-message');

  const nameError = document.getElementById('name-error');
  const emailError = document.getElementById('email-error');
  const messageError = document.getElementById('message-error');

  // Limpiar estados de error al escribir
  [nameInput, emailInput, messageInput].forEach(input => {
    input.addEventListener('input', () => {
      input.classList.remove('invalid');
      const errEl = document.getElementById(`${input.name}-error`);
      if (errEl) errEl.classList.remove('visible');
      if (feedback) feedback.classList.add('hidden');
    });
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    let isValid = true;

    // Validación Nombre
    if (!nameInput.value.trim()) {
      nameInput.classList.add('invalid');
      nameError.classList.add('visible');
      isValid = false;
    }

    // Validación Correo
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(emailInput.value.trim())) {
      emailInput.classList.add('invalid');
      emailError.classList.add('visible');
      isValid = false;
    }

    // Validación Mensaje
    if (messageInput.value.trim().length < 10) {
      messageInput.classList.add('invalid');
      messageError.classList.add('visible');
      isValid = false;
    }

    if (!isValid) return;

    // Simulación de envío con micro-interacción elegante
    const originalText = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.innerHTML = `<span>Enviando mensaje...</span>`;

    setTimeout(() => {
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalText;

      feedback.className = 'form-feedback success';
      feedback.innerHTML = `
        <strong>✓ ¡Mensaje registrado con éxito!</strong><br>
        Gracias por ponerte en contacto, ${escapeHtml(nameInput.value.trim())}. He recibido tu mensaje y responderé a la brevedad.
      `;
      feedback.classList.remove('hidden');

      form.reset();
    }, 800);
  });
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

/* ==========================================================================
   5. Copiar Correo Directo al Portapapeles
   ========================================================================== */
function initCopyEmail() {
  const copyBtn = document.getElementById('copy-email-btn');
  const copyBtnText = document.getElementById('copy-btn-text');
  const emailInput = document.getElementById('email-address-text');

  if (!copyBtn || !copyBtnText || !emailInput) return;

  copyBtn.addEventListener('click', async () => {
    const textToCopy = emailInput.value;

    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(textToCopy);
      } else {
        emailInput.select();
        document.execCommand('copy');
      }

      copyBtnText.textContent = '¡Copiado!';
      copyBtn.style.backgroundColor = 'var(--color-white)';
      copyBtn.style.color = 'var(--color-black)';

      setTimeout(() => {
        copyBtnText.textContent = 'Copiar';
        copyBtn.style.backgroundColor = '';
        copyBtn.style.color = '';
      }, 2000);
    } catch (err) {
      console.warn('Error al copiar texto:', err);
    }
  });
}

/* ==========================================================================
   6. Ventana Modal de Proyectos de Scratch
   ========================================================================== */
function initModalListeners() {
  const modal = document.getElementById('project-modal');
  const closeBtn = document.getElementById('modal-close');

  if (!modal || !closeBtn) return;

  closeBtn.addEventListener('click', closeProjectModal);

  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      closeProjectModal();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
      closeProjectModal();
    }
  });
}

function openProjectModal(title, user, extraDetails) {
  const modal = document.getElementById('project-modal');
  const modalTitle = document.getElementById('modal-title');
  const modalDesc = document.getElementById('modal-description');
  const modalLink = document.getElementById('modal-scratch-link');

  if (!modal || !modalTitle || !modalDesc) return;

  modalTitle.textContent = title;
  modalDesc.textContent = `${extraDetails} Desarrollado por @${user} en la plataforma oficial de Scratch.`;
  if (modalLink) {
    modalLink.href = `https://scratch.mit.edu/users/${user}/`;
  }

  modal.classList.remove('hidden');
  document.body.style.overflow = 'hidden';
}

function closeProjectModal() {
  const modal = document.getElementById('project-modal');
  if (!modal) return;

  modal.classList.add('hidden');
  document.body.style.overflow = '';
}

window.openProjectModal = openProjectModal;
window.closeProjectModal = closeProjectModal;
