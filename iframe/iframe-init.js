(() => {
  'use strict';

  // Initialize iframe functionality
  document.addEventListener('DOMContentLoaded', () => {
    // Initialize slide-in animation
    initializeSlideAnimation();
    
    // Setup event listeners
    setupEventListeners();
    
    // Initialize popup content
    initializePopupContent();
  });

  function initializeSlideAnimation() {
    const container = document.querySelector('.container');
    requestAnimationFrame(() => {
      container.classList.add('slide-in');
    });
  }

  function setupEventListeners() {
    // Handle messages from parent
    window.addEventListener('message', (event) => {
      if (event.data.action === 'closePopup') {
        closeIframe();
      }
    });

    // Handle escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        closeIframe();
      }
    });
  }

  function closeIframe() {
    const container = document.querySelector('.container');
    container.classList.remove('slide-in');
    setTimeout(() => {
      window.parent.postMessage({ action: 'closeIframe' }, '*');
    }, 300);
  }

  function initializePopupContent() {
    // Initialize all the popup functionality
    const event = new Event('DOMContentLoaded');
    document.dispatchEvent(event);
  }
})();
