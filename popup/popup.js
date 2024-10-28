(() => {
  'use strict';

  document.addEventListener('DOMContentLoaded', () => {

    // Initial state
    const state = {
      settings: {
        autoPopupAlerts: true,
        settlementAlerts: true,
        dataBreachAlerts: true,
        investigationAlerts: true,
        darkMode: false,
      },
      showSnoozeOptions: false,
      showDismissConfirmation: false,
      settlements: [
        { id: 1, name: 'TechCorp Inc. Data Breach', deadline: '2024-12-30', dismissed: false },
        { id: 2, name: 'FinanceApp Overcharging', deadline: '2024-11-15', dismissed: false },
        { id: 3, name: 'EcoProducts False Advertising', deadline: '2025-01-20', dismissed: false },
      ],
      dataBreaches: [
        { id: 1, name: 'MegaStore', url: '#', dismissed: false },
        { id: 2, name: 'HealthPlus', url: '#', dismissed: false },
        { id: 3, name: 'SecureBank', url: '#', dismissed: false },
      ],
      investigations: [
        { id: 1, name: 'Acme Corp', subtype: 'Data Breach', url: '#', dismissed: false },
        { id: 2, name: 'Wells Fargo', subtype: 'Late Fees', url: '#', dismissed: false },
        { id: 3, name: 'TechGiant', subtype: 'Privacy Violation', url: '#', dismissed: false },
      ],
      showDismissed: false,
    };

    const settlement = {
      company: 'TechCorp Inc.',
      title: 'Class Action Settlement Alert',
      favicon: 'https://example.com/favicon.ico',
      deadline: '2024-12-30',
      settlementAmount: 10000000,
      awardAmount: 'Up to $500 per claim',
      description: 'Compensation for users affected by data breach. Eligibility: Customers between 2020-2023. Proof of account required.',
      claimUrl: 'https://techcorpsettlement.com/claim'
    };

    // Helper functions

    /**
     * Formats a date string into a human-readable format.
     * @param {string} dateString - The date string to format.
     * @returns {string} Formatted date string.
     */
    function formatDate(dateString) {
      return new Date(dateString).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    }

    /**
     * Formats a number into a currency string.
     * @param {number} amount - The amount to format.
     * @returns {string} Formatted currency string.
     */
    function formatCurrency(amount) {
      return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(amount);
    }

    /**
     * Calculates the time remaining until the deadline.
     * @param {string} deadline - The deadline date string.
     * @returns {string} Time remaining in days or hours and minutes.
     */
    function getTimeRemaining(deadline) {
      const now = new Date();
      const deadlineDate = new Date(deadline);
      const timeDiff = deadlineDate.getTime() - now.getTime();
      const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
        
      if (daysDiff > 1) {
        return `${daysDiff} days`;
      } else {
        const hours = Math.floor(timeDiff / (1000 * 3600));
        const minutes = Math.floor((timeDiff % (1000 * 3600)) / (1000 * 60));
        return `${hours}h ${minutes}m`;
      }
    }

    /**
     * Retrieves the full URL for an asset.
     * @param {string} path - Relative path to the asset.
     * @returns {string} Full URL to the asset.
     */
    function getAssetUrl(path) {
      return chrome.runtime.getURL(path);
    }

    // Render functions

    /**
     * Renders the settlement alert section.
     */
    function renderSettlementAlert() {
      const alertContainer = document.getElementById('settlementAlert');
      alertContainer.innerHTML = `
        <!-- Settlement Alert HTML content -->
        <!-- ... existing code ... -->
      `;
    }

    /**
     * Renders the potential claims section.
     */
    function renderPotentialClaims() {
      const claimsContainer = document.getElementById('potentialClaims');
      claimsContainer.innerHTML = `
        <!-- Potential Claims HTML content -->
        <!-- ... existing code ... -->
      `;
      updateTables();
    }

    /**
     * Updates the tables with current state data.
     */
    function updateTables() {
      const settlementsTable = document.getElementById('settlementsTable');
      const dataBreachesTable = document.getElementById('dataBreachesTable');
      const investigationsTable = document.getElementById('investigationsTable');

      settlementsTable.innerHTML = state.settlements
        .filter(s => state.showDismissed || !s.dismissed)
        .map(settlement => `
          <!-- Settlement Table Rows -->
          <!-- ... existing code ... -->
        `).join('');

      dataBreachesTable.innerHTML = state.dataBreaches
        .filter(d => state.showDismissed || !d.dismissed)
        .map(breach => `
          <!-- Data Breach Table Rows -->
          <!-- ... existing code ... -->
        `).join('');

      investigationsTable.innerHTML = state.investigations
        .filter(i => state.showDismissed || !i.dismissed)
        .map(investigation => `
          <!-- Investigations Table Rows -->
          <!-- ... existing code ... -->
        `).join('');
    }

    // Event delegation setup

    /**
     * Sets up event delegation for the popup.
     */
    function setupEventDelegation() {
      document.body.addEventListener('click', handleBodyClick);
      document.body.addEventListener('change', handleBodyChange);
    }

    /**
     * Handles click events on the body using event delegation.
     * @param {Event} e - The click event.
     */
    function handleBodyClick(e) {
      const target = e.target;

      // Settlement Alert actions
      if (target.matches('#submitClaimBtn')) {
        window.open(settlement.claimUrl, '_blank');
      } else if (target.matches('#snoozeBtn')) {
        document.getElementById('actionButtons').classList.add('hidden');
        document.getElementById('snoozeOptions').classList.remove('hidden');
      } else if (target.matches('#dismissBtn')) {
        document.getElementById('actionButtons').classList.add('hidden');
        document.getElementById('dismissConfirmation').classList.remove('hidden');
      } else if (target.matches('.snooze-option')) {
        const duration = target.dataset.duration;
        console.log(`Snoozed for ${duration}`);
        document.getElementById('snoozeOptions').classList.add('hidden');
        document.getElementById('actionButtons').classList.remove('hidden');
      } else if (target.matches('#cancelSnooze')) {
        document.getElementById('snoozeOptions').classList.add('hidden');
        document.getElementById('actionButtons').classList.remove('hidden');
      } else if (target.matches('#confirmDismiss')) {
        console.log('Dismissed for this website forever');
        document.getElementById('dismissConfirmation').classList.add('hidden');
        document.getElementById('actionButtons').classList.remove('hidden');
      } else if (target.matches('#cancelDismiss')) {
        document.getElementById('dismissConfirmation').classList.add('hidden');
        document.getElementById('actionButtons').classList.remove('hidden');
      }

      // Potential Claims actions
      else if (target.closest('.dismiss-item')) {
        const dismissBtn = target.closest('.dismiss-item');
        const type = dismissBtn.dataset.type;
        const id = parseInt(dismissBtn.dataset.id);
        state[type] = state[type].map(item => 
          item.id === id ? { ...item, dismissed: true } : item
        );
        updateTables();
      } else if (target.closest('.undo-dismiss')) {
        const undoBtn = target.closest('.undo-dismiss');
        const type = undoBtn.dataset.type;
        const id = parseInt(undoBtn.dataset.id);
        state[type] = state[type].map(item => 
          item.id === id ? { ...item, dismissed: false } : item
        );
        updateTables();
      }

      // Settings and More Options
      else if (target.matches('#settingsButton')) {
        toggleMenu('settingsMenu');
      } else if (target.matches('#moreOptionsButton')) {
        toggleMenu('moreOptionsMenu');
      } else {
        // Close menus if clicking outside
        if (!target.closest('#settingsMenu')) {
          document.getElementById('settingsMenu').classList.add('hidden');
        }
        if (!target.closest('#moreOptionsMenu')) {
          document.getElementById('moreOptionsMenu').classList.add('hidden');
        }
      }
    }

    /**
     * Handles change events on the body using event delegation.
     * @param {Event} e - The change event.
     */
    function handleBodyChange(e) {
      const target = e.target;

      if (target.matches('#show-dismissed')) {
        state.showDismissed = target.checked;
        updateTables();
      } else if (target.matches('.settings-toggle')) {
        const key = target.id;
        state.settings[key] = target.checked;
        if (key === 'darkMode') {
          document.body.classList.toggle('dark-mode', target.checked);
        }
      }
    }

    // Settings and More Options menus

    /**
     * Toggles the visibility of a menu.
     * @param {string} menuId - The ID of the menu to toggle.
     */
    function toggleMenu(menuId) {
      const menu = document.getElementById(menuId);
      menu.classList.toggle('hidden');
    }

    /**
     * Renders the settings menu with current settings.
     */
    function renderSettingsMenu() {
      const settingsMenu = document.getElementById('settingsMenu');
      settingsMenu.innerHTML = `
        <div class="py-1">
          ${Object.entries(state.settings).map(([key, value]) => `
            <div class="px-4 py-2 flex items-center justify-between">
              <span class="text-sm text-gray-800 dark:text-gray-200">
                ${key === 'darkMode' ? 'Dark Mode' : key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
              </span>
              <label class="switch">
                <input type="checkbox" id="${key}" class="settings-toggle" ${value ? 'checked' : ''}>
                <span class="slider"></span>
              </label>
            </div>
          `).join('')}
        </div>
      `;
    }

    /**
     * Renders the more options menu.
     */
    function renderMoreOptionsMenu() {
      const moreOptionsMenu = document.getElementById('moreOptionsMenu');
      moreOptionsMenu.innerHTML = `
        <div class="py-1">
          <a href="#feedback" class="menu-item">Feedback</a>
          <a href="#share" class="menu-item">Share</a>
          <a href="#rate" class="menu-item">Rate Us</a>
        </div>
      `;
    }

    // Add slide-in animation

    /**
     * Initializes the slide-in animation for the popup.
     */
    function initializeSlideAnimation() {
      const container = document.querySelector('.container');
      // Force reflow
      container.offsetHeight;
      // Add slide-in class after a brief delay
      requestAnimationFrame(() => {
        container.classList.add('slide-in');
      });
    }

    // Add close functionality

    /**
     * Closes the popup with animation.
     */
    function closePopup() {
      const container = document.querySelector('.container');
      container.classList.remove('slide-in');
        
      // Wait for animation to complete before closing
      setTimeout(() => {
        window.parent.postMessage({ action: 'closePopup' }, '*');
      }, 300); // Match --slide-duration from CSS
    }

    // Listen for escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        closePopup();
      }
    });

    // Listen for messages from parent
    window.addEventListener('message', (event) => {
      if (event.data.action === 'closePopup') {
        closePopup();
      }
    });

    // Initialize everything
    initializeSlideAnimation();
    renderSettlementAlert();
    renderPotentialClaims();
    renderSettingsMenu();
    renderMoreOptionsMenu();

    setupEventDelegation();

  });
})();
