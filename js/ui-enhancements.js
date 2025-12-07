/**
 * UI Enhancements Module
 * Handles micro-animations, transitions, and interactive elements
 * 
 * @module UIEnhancements
 * @description Provides smooth animations, ripple effects, loading states,
 *              and interactive feedback throughout the app
 */

const UIEnhancements = (() => {
  'use strict';

  // ===========================
  // RIPPLE EFFECT
  // ===========================

  /**
   * Creates a ripple effect on click
   * @param {Event} event - The click event
   * @param {string} color - Optional ripple color (default: rgba(255,255,255,0.5))
   */
  const createRipple = (event, color = 'rgba(255,255,255,0.5)') => {
    const button = event.currentTarget;
    const rect = button.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;

    const ripple = document.createElement('span');
    ripple.style.width = ripple.style.height = size + 'px';
    ripple.style.left = x + 'px';
    ripple.style.top = y + 'px';
    ripple.className = 'ripple';
    ripple.style.backgroundColor = color;

    // Remove previous ripples
    const previousRipple = button.querySelector('.ripple');
    if (previousRipple) {
      previousRipple.remove();
    }

    button.appendChild(ripple);

    // Remove ripple after animation
    setTimeout(() => ripple.remove(), 600);
  };

  /**
   * Attach ripple effect to all buttons with data-ripple attribute
   */
  const initializeRipples = () => {
    const buttons = document.querySelectorAll('button[data-ripple], .btn[data-ripple], [role="button"][data-ripple]');
    buttons.forEach(button => {
      button.addEventListener('click', (e) => {
        const color = button.getAttribute('data-ripple-color') || 'rgba(255,255,255,0.5)';
        createRipple(e, color);
      });
    });
  };

  // ===========================
  // PULSE ANIMATIONS
  // ===========================

  /**
   * Pulses an element for emphasis
   * @param {HTMLElement} element - Element to pulse
   * @param {number} duration - Duration in milliseconds (default: 600)
   */
  const pulse = (element, duration = 600) => {
    element.style.animation = 'none';
    element.offsetHeight; // Trigger reflow
    element.style.animation = `smoothPulse ${duration}ms cubic-bezier(0.4, 0, 0.6, 1)`;
    
    setTimeout(() => {
      element.style.animation = '';
    }, duration);
  };

  /**
   * Start continuous pulse on an element
   * @param {HTMLElement} element - Element to pulse
   */
  const startContinuousPulse = (element) => {
    element.style.animation = 'smoothPulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite';
  };

  /**
   * Stop continuous pulse on an element
   * @param {HTMLElement} element - Element to stop pulsing
   */
  const stopContinuousPulse = (element) => {
    element.style.animation = '';
  };

  // ===========================
  // GLOW EFFECTS
  // ===========================

  /**
   * Add glow effect to an element
   * @param {HTMLElement} element - Element to glow
   * @param {string} glowColor - Color for glow effect (default: cyan)
   */
  const addGlow = (element, glowColor = 'var(--neon-cyan)') => {
    element.style.animation = `glow 2s ease-in-out infinite`;
    element.style.boxShadow = `0 0 10px ${glowColor}, 0 0 20px ${glowColor}`;
  };

  /**
   * Remove glow effect from an element
   * @param {HTMLElement} element - Element to remove glow from
   */
  const removeGlow = (element) => {
    element.style.animation = '';
    element.style.boxShadow = '';
  };

  // ===========================
  // SLIDE & FADE ANIMATIONS
  // ===========================

  /**
   * Animate element sliding in from top
   * @param {HTMLElement} element - Element to animate
   * @param {number} duration - Duration in milliseconds (default: 500)
   * @param {number} delay - Delay in milliseconds (default: 0)
   */
  const slideInUp = (element, duration = 500, delay = 0) => {
    element.style.opacity = '0';
    element.style.transform = 'translateY(30px)';
    element.style.transition = `all ${duration}ms cubic-bezier(0.34, 1.56, 0.64, 1)`;
    element.style.transitionDelay = `${delay}ms`;

    setTimeout(() => {
      element.style.opacity = '1';
      element.style.transform = 'translateY(0)';
    }, 10);

    setTimeout(() => {
      element.style.transition = '';
      element.style.transitionDelay = '';
    }, duration + delay);
  };

  /**
   * Animate element sliding in from left
   * @param {HTMLElement} element - Element to animate
   * @param {number} duration - Duration in milliseconds (default: 500)
   */
  const slideInLeft = (element, duration = 500) => {
    element.style.opacity = '0';
    element.style.transform = 'translateX(-50px)';
    element.style.transition = `all ${duration}ms cubic-bezier(0.34, 1.56, 0.64, 1)`;

    setTimeout(() => {
      element.style.opacity = '1';
      element.style.transform = 'translateX(0)';
    }, 10);

    setTimeout(() => {
      element.style.transition = '';
    }, duration);
  };

  /**
   * Fade in an element
   * @param {HTMLElement} element - Element to fade
   * @param {number} duration - Duration in milliseconds (default: 300)
   */
  const fadeIn = (element, duration = 300) => {
    element.style.opacity = '0';
    element.style.transition = `opacity ${duration}ms ease-in`;

    setTimeout(() => {
      element.style.opacity = '1';
    }, 10);

    setTimeout(() => {
      element.style.transition = '';
    }, duration);
  };

  /**
   * Fade out an element
   * @param {HTMLElement} element - Element to fade
   * @param {number} duration - Duration in milliseconds (default: 300)
   */
  const fadeOut = (element, duration = 300) => {
    element.style.transition = `opacity ${duration}ms ease-out`;
    element.style.opacity = '0';

    setTimeout(() => {
      element.style.transition = '';
    }, duration);
  };

  // ===========================
  // SCALE ANIMATIONS
  // ===========================

  /**
   * Scale in an element (grow from small to normal)
   * @param {HTMLElement} element - Element to animate
   * @param {number} duration - Duration in milliseconds (default: 400)
   */
  const scaleIn = (element, duration = 400) => {
    element.style.opacity = '0';
    element.style.transform = 'scale(0.8)';
    element.style.transition = `all ${duration}ms cubic-bezier(0.34, 1.56, 0.64, 1)`;

    setTimeout(() => {
      element.style.opacity = '1';
      element.style.transform = 'scale(1)';
    }, 10);

    setTimeout(() => {
      element.style.transition = '';
    }, duration);
  };

  /**
   * Scale out an element (shrink from normal to small)
   * @param {HTMLElement} element - Element to animate
   * @param {number} duration - Duration in milliseconds (default: 400)
   */
  const scaleOut = (element, duration = 400) => {
    element.style.transition = `all ${duration}ms cubic-bezier(0.34, 1.56, 0.64, 1)`;
    element.style.opacity = '0';
    element.style.transform = 'scale(0.8)';

    setTimeout(() => {
      element.style.transition = '';
    }, duration);
  };

  // ===========================
  // LOADING STATES
  // ===========================

  /**
   * Show loading state on a button
   * @param {HTMLElement} button - Button element
   * @param {string} loadingText - Text to display (default: 'Loading...')
   */
  const showLoading = (button, loadingText = 'Loading...') => {
    const originalContent = button.innerHTML;
    button.disabled = true;
    button.setAttribute('data-original-content', originalContent);
    button.setAttribute('aria-busy', 'true');
    button.innerHTML = `<span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>${loadingText}`;
    button.classList.add('loading');
  };

  /**
   * Hide loading state on a button
   * @param {HTMLElement} button - Button element
   */
  const hideLoading = (button) => {
    const originalContent = button.getAttribute('data-original-content');
    if (originalContent) {
      button.innerHTML = originalContent;
      button.removeAttribute('data-original-content');
    }
    button.disabled = false;
    button.setAttribute('aria-busy', 'false');
    button.classList.remove('loading');
  };

  /**
   * Show loading skeleton on an element
   * @param {HTMLElement} container - Container element
   */
  const showSkeleton = (container) => {
    container.innerHTML = `
      <div class="skeleton-loader">
        <div class="skeleton-line" style="width: 100%; height: 20px; margin-bottom: 10px;"></div>
        <div class="skeleton-line" style="width: 90%; height: 20px; margin-bottom: 10px;"></div>
        <div class="skeleton-line" style="width: 85%; height: 20px;"></div>
      </div>
    `;
    container.classList.add('loading');
  };

  /**
   * Hide loading skeleton
   * @param {HTMLElement} container - Container element
   */
  const hideSkeleton = (container) => {
    container.classList.remove('loading');
    container.innerHTML = '';
  };

  // ===========================
  // TOAST NOTIFICATIONS
  // ===========================

  /**
   * Show a toast notification
   * @param {string} message - Notification message
   * @param {string} type - Type: 'success', 'error', 'info', 'warning' (default: 'info')
   * @param {number} duration - Duration in milliseconds (default: 3000)
   */
  const showToast = (message, type = 'info', duration = 3000) => {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.setAttribute('role', 'alert');
    toast.setAttribute('aria-live', 'assertive');
    toast.innerHTML = `
      <div class="toast-content">
        <span class="toast-message">${message}</span>
        <button type="button" class="btn-close" data-dismiss="toast" aria-label="Close"></button>
      </div>
    `;

    const container = document.getElementById('toast-container') || createToastContainer();
    container.appendChild(toast);

    // Animate in
    setTimeout(() => {
      toast.classList.add('show');
    }, 10);

    // Dismiss button
    toast.querySelector('.btn-close').addEventListener('click', () => {
      dismissToast(toast);
    });

    // Auto dismiss
    if (duration > 0) {
      setTimeout(() => {
        dismissToast(toast);
      }, duration);
    }
  };

  /**
   * Dismiss a toast notification
   * @param {HTMLElement} toast - Toast element
   */
  const dismissToast = (toast) => {
    toast.classList.remove('show');
    setTimeout(() => {
      toast.remove();
    }, 300);
  };

  /**
   * Create toast container if it doesn't exist
   * @returns {HTMLElement} Toast container
   */
  const createToastContainer = () => {
    const container = document.createElement('div');
    container.id = 'toast-container';
    container.className = 'toast-container';
    document.body.appendChild(container);
    return container;
  };

  // ===========================
  // MODAL ANIMATIONS
  // ===========================

  /**
   * Animate modal opening
   * @param {HTMLElement} modal - Modal element
   */
  const openModal = (modal) => {
    modal.style.display = 'block';
    modal.setAttribute('aria-hidden', 'false');
    
    setTimeout(() => {
      modal.classList.add('show');
      const backdrop = modal.querySelector('.modal-backdrop');
      if (backdrop) {
        backdrop.classList.add('show');
      }
    }, 10);
  };

  /**
   * Animate modal closing
   * @param {HTMLElement} modal - Modal element
   */
  const closeModal = (modal) => {
    modal.classList.remove('show');
    const backdrop = modal.querySelector('.modal-backdrop');
    if (backdrop) {
      backdrop.classList.remove('show');
    }
    
    setTimeout(() => {
      modal.style.display = 'none';
      modal.setAttribute('aria-hidden', 'true');
    }, 300);
  };

  // ===========================
  // COUNTDOWN TIMER ANIMATION
  // ===========================

  /**
   * Animate a countdown timer
   * @param {HTMLElement} element - Element showing the timer
   * @param {number} seconds - Seconds remaining
   */
  const animateCountdown = (element, seconds) => {
    element.classList.add('countdown');
    
    if (seconds <= 10) {
      element.classList.add('countdown-warning');
    } else {
      element.classList.remove('countdown-warning');
    }

    if (seconds === 0) {
      element.classList.add('countdown-ended');
      pulse(element, 400);
    }
  };

  // ===========================
  // PROGRESS BAR ANIMATION
  // ===========================

  /**
   * Animate progress bar
   * @param {HTMLElement} progressBar - Progress bar element
   * @param {number} percentage - Progress percentage (0-100)
   * @param {number} duration - Animation duration in milliseconds
   */
  const updateProgress = (progressBar, percentage, duration = 500) => {
    progressBar.style.transition = `width ${duration}ms cubic-bezier(0.4, 0, 0.2, 1)`;
    progressBar.style.width = `${Math.min(100, Math.max(0, percentage))}%`;
    progressBar.setAttribute('aria-valuenow', percentage);
  };

  /**
   * Animate indeterminate progress
   * @param {HTMLElement} progressBar - Progress bar element
   */
  const startIndeterminate = (progressBar) => {
    progressBar.classList.add('progress-indeterminate');
  };

  /**
   * Stop indeterminate progress
   * @param {HTMLElement} progressBar - Progress bar element
   */
  const stopIndeterminate = (progressBar) => {
    progressBar.classList.remove('progress-indeterminate');
  };

  // ===========================
  // STATS CARD ANIMATIONS
  // ===========================

  /**
   * Animate stat number change
   * @param {HTMLElement} element - Stat number element
   * @param {number} targetValue - Target value
   * @param {number} duration - Animation duration in milliseconds (default: 500)
   */
  const animateStatChange = (element, targetValue, duration = 500) => {
    const startValue = parseInt(element.textContent) || 0;
    const diff = targetValue - startValue;
    const steps = 30;
    let currentStep = 0;

    pulse(element, 300);

    const interval = setInterval(() => {
      currentStep++;
      const progress = currentStep / steps;
      const easeProgress = progress < 0.5 
        ? 2 * progress * progress 
        : -1 + (4 - 2 * progress) * progress;
      
      const currentValue = Math.round(startValue + diff * easeProgress);
      element.textContent = currentValue;

      if (currentStep >= steps) {
        element.textContent = targetValue;
        clearInterval(interval);
      }
    }, duration / steps);
  };

  // ===========================
  // BATCH ANIMATIONS
  // ===========================

  /**
   * Stagger animate multiple elements
   * @param {NodeList|Array} elements - Elements to animate
   * @param {string} animationType - Animation type: 'slideInUp', 'fadeIn', 'scaleIn'
   * @param {number} staggerDelay - Delay between elements in milliseconds
   */
  const staggerAnimate = (elements, animationType = 'slideInUp', staggerDelay = 100) => {
    const animationFunctions = {
      slideInUp,
      slideInLeft,
      fadeIn,
      scaleIn,
    };

    const animateFunc = animationFunctions[animationType] || slideInUp;

    Array.from(elements).forEach((element, index) => {
      setTimeout(() => {
        animateFunc(element, 500, 0);
      }, index * staggerDelay);
    });
  };

  /**
   * Pulse multiple elements in sequence
   * @param {NodeList|Array} elements - Elements to pulse
   * @param {number} delay - Delay between pulses in milliseconds
   */
  const pulseSequence = (elements, delay = 200) => {
    Array.from(elements).forEach((element, index) => {
      setTimeout(() => {
        pulse(element, 500);
      }, index * delay);
    });
  };

  // ===========================
  // INITIALIZATION
  // ===========================

  /**
   * Initialize all UI enhancements
   */
  const init = () => {
    // Initialize ripple effects
    initializeRipples();

    // Add data-ripple to all buttons if not already present
    const buttons = document.querySelectorAll('button:not([data-ripple])');
    buttons.forEach(button => {
      button.setAttribute('data-ripple', 'true');
    });

    // Re-initialize ripples for new buttons
    initializeRipples();

    console.log('✅ UI Enhancements initialized');
  };

  /**
   * Re-initialize ripples (call after adding new buttons dynamically)
   */
  const reinitializeRipples = () => {
    initializeRipples();
  };

  // ===========================
  // PUBLIC API
  // ===========================

  return {
    // Ripple effects
    createRipple,
    initializeRipples,
    reinitializeRipples,

    // Pulse animations
    pulse,
    startContinuousPulse,
    stopContinuousPulse,

    // Glow effects
    addGlow,
    removeGlow,

    // Slide & fade animations
    slideInUp,
    slideInLeft,
    fadeIn,
    fadeOut,

    // Scale animations
    scaleIn,
    scaleOut,

    // Loading states
    showLoading,
    hideLoading,
    showSkeleton,
    hideSkeleton,

    // Toast notifications
    showToast,
    dismissToast,
    createToastContainer,

    // Modal animations
    openModal,
    closeModal,

    // Countdown timer
    animateCountdown,

    // Progress bar
    updateProgress,
    startIndeterminate,
    stopIndeterminate,

    // Stats card animations
    animateStatChange,

    // Batch animations
    staggerAnimate,
    pulseSequence,

    // Initialization
    init,
  };
})();

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    UIEnhancements.init();
  });
} else {
  UIEnhancements.init();
}
