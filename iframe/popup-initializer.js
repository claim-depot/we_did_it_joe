// iframe/popup-initializer.js

(() => {
  'use strict';

  // Define settlement data
  const settlement = {
    company: "TechCorp Inc.",
    title: "Class Action Settlement Alert",
    favicon: "https://example.com/favicon.ico",
    deadline: "2024-12-30",
    settlementAmount: 10000000,
    awardAmount: "Up to $500 per claim",
    description: "Compensation for users affected by data breach. Eligibility: Customers between 2020-2023. Proof of account required.",
    claimUrl: "https://techcorpsettlement.com/claim"
  };

  // Initialize popup when DOM is ready
  document.addEventListener('DOMContentLoaded', () => {
    // Initialize state and render initial content
    initializeState();
    renderContent();
    setupEventListeners();
  });

  function initializeState() {
    window.state = {
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
      showDismissed: false
    };
  }

  function formatDate(dateString) {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  function formatCurrency(amount) {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(amount);
  }

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

  function renderContent() {
    renderSettlementAlert();
    renderPotentialClaims();
    renderSettingsMenu();
    renderMoreOptionsMenu();
  }

  function renderSettlementAlert() {
    const alertContainer = document.getElementById('settlementAlert');
    if (!alertContainer) return;

    alertContainer.innerHTML = `
      <div class="${window.state.settings.darkMode ? 'bg-[#111926]' : 'bg-gray-100'} p-4">
        <h2 class="text-xl font-bold mb-2">${settlement.title}</h2>
        <div class="flex items-center space-x-2">
          <div class="avatar">
            <img src="${settlement.favicon}" alt="" class="h-6 w-6 rounded-full" />
          </div>
          <h3 class="${window.state.settings.darkMode ? 'text-gray-200' : 'text-gray-700'}">${settlement.company}</h3>
        </div>
      </div>
      
      <div class="p-4 space-y-4">
        <div class="flex items-center space-x-2">
          <span class="text-red-500">📅</span>
          <p class="text-sm">
            <span class="font-semibold">Deadline:</span> ${formatDate(settlement.deadline)}
          </p>
        </div>
        <div class="flex items-center space-x-2">
          <span class="text-red-500">⌛</span>
          <p class="text-sm">
            <span class="font-semibold">Time Remaining:</span> ${getTimeRemaining(settlement.deadline)}
          </p>
        </div>
        <div class="flex items-center space-x-2">
          <span class="text-red-500">💰</span>
          <p class="text-sm">
            <span class="font-semibold">Settlement Amount:</span> ${formatCurrency(settlement.settlementAmount)}
          </p>
        </div>
        <div class="flex items-center space-x-2">
          <span class="text-red-500">🤝</span>
          <p class="text-sm">
            <span class="font-semibold">Potential Award:</span> ${settlement.awardAmount}
          </p>
        </div>
        <div class="flex items-start space-x-2">
          <span class="text-red-500 mt-1">⚖️</span>
          <p class="text-sm">
            <span class="font-semibold">Description:</span> ${settlement.description}
          </p>
        </div>
      </div>
      
      <div class="p-4 space-y-2">
        <button class="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-4 rounded flex items-center justify-center" id="submitClaimBtn">
          Submit a Claim
          <span class="ml-2">↗️</span>
        </button>
        
        ${!window.state.showSnoozeOptions && !window.state.showDismissConfirmation ? `
          <div class="flex space-x-2">
            <button class="flex-1 bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded flex items-center justify-center" id="snoozeBtn">
              Snooze
              <span class="ml-2">⏰</span>
            </button>
            <button class="flex-1 bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded flex items-center justify-center" id="dismissBtn">
              Dismiss
              <span class="ml-2">✕</span>
            </button>
          </div>
        ` : ''}
        
        ${window.state.showSnoozeOptions ? `
          <div class="space-y-2">
            <button class="w-full bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded" data-snooze="24h">
              Snooze for 24 hours
            </button>
            <button class="w-full bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded" data-snooze="1w">
              Snooze for 1 week
            </button>
            <button class="w-full bg-gray-500 hover:bg-gray-400 text-white font-bold py-2 px-4 rounded" id="cancelSnooze">
              Cancel
            </button>
          </div>
        ` : ''}
        
        ${window.state.showDismissConfirmation ? `
          <div class="space-y-2">
            <p class="text-center text-sm">Dismiss for this website forever?</p>
            <div class="flex space-x-2">
              <button class="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded" id="confirmDismiss">
                Confirm
              </button>
              <button class="flex-1 bg-gray-500 hover:bg-gray-400 text-white font-bold py-2 px-4 rounded" id="cancelDismiss">
                Cancel
              </button>
            </div>
          </div>
        ` : ''}
      </div>
    `;
  }

  function renderPotentialClaims() {
    const claimsContainer = document.getElementById('potentialClaims');
    if (!claimsContainer) return;

    claimsContainer.innerHTML = `
      <div class="p-4">
        <h2 class="text-xl font-bold mb-4">Your Potential Claims</h2>
        <div class="flex items-center justify-end space-x-2 mb-4">
          <label for="show-dismissed" class="text-sm">Show Dismissed</label>
          <label class="switch">
            <input type="checkbox" id="show-dismissed" ${window.state.showDismissed ? 'checked' : ''}>
            <span class="slider"></span>
          </label>
        </div>
        <div class="space-y-4">
          ${renderClaimsTable('Settlements', window.state.settlements)}
          ${renderClaimsTable('Data Breaches', window.state.dataBreaches)}
          ${renderClaimsTable('Investigations', window.state.investigations)}
        </div>
      </div>
    `;
  }

  function renderClaimsTable(title, items) {
    const filteredItems = window.state.showDismissed ? items : items.filter(item => !item.dismissed);
    
    return `
      <section>
        <h3 class="text-base font-semibold mb-2">${title}</h3>
        <table class="w-full">
          <tbody>
            ${filteredItems.map(item => `
              <tr class="border-b">
                <td class="py-2">
                  ${item.name}
                  ${item.deadline ? `
                    <div class="text-sm text-gray-600">Deadline: ${formatDate(item.deadline)}</div>
                  ` : ''}
                  ${item.subtype ? `
                    <div class="text-sm text-gray-600">${item.subtype}</div>
                  ` : ''}
                </td>
                <td class="py-2 text-right">
                  ${item.dismissed ? `
                    <button class="text-blue-600 hover:text-blue-800" data-action="undo" data-id="${item.id}" data-type="${title.toLowerCase()}">
                      <span>↩️ Undo</span>
                    </button>
                  ` : `
                    <button class="text-red-600 hover:text-red-800" data-action="dismiss" data-id="${item.id}" data-type="${title.toLowerCase()}">
                      Dismiss
                    </button>
                  `}
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
        ${title === 'Settlements' ? `
          <div class="mt-2 flex justify-end">
            <button class="border border-gray-300 hover:bg-red-500 hover:text-white hover:border-red-500 rounded-full px-4 py-2 text-sm transition-colors duration-200">
              Browse More Settlements
              <span class="ml-2">→</span>
            </button>
          </div>
        ` : ''}
      </section>
    `;
  }

  function renderSettingsMenu() {
    const settingsMenu = document.getElementById('settingsMenu');
    if (!settingsMenu) return;

    settingsMenu.innerHTML = `
      <div class="py-1">
        ${Object.entries(window.state.settings).map(([key, value]) => `
          <div class="px-4 py-2 flex items-center justify-between">
            <span class="text-sm text-gray-800">
              ${key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
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

  function renderMoreOptionsMenu() {
    const moreOptionsMenu = document.getElementById('moreOptionsMenu');
    if (!moreOptionsMenu) return;

    moreOptionsMenu.innerHTML = `
      <div class="py-1">
        <a href="#feedback" class="menu-item">Feedback</a>
        <a href="#share" class="menu-item">Share</a>
        <a href="#rate" class="menu-item">Rate Us</a>
      </div>
    `;
  }

  function setupEventListeners() {
    document.body.addEventListener('click', handleBodyClick);
    document.body.addEventListener('change', handleBodyChange);
  }

  function handleBodyClick(e) {
    const target = e.target;

    if (target.id === 'submitClaimBtn') {
      window.open(settlement.claimUrl, '_blank');
    } else if (target.id === 'snoozeBtn') {
      window.state.showSnoozeOptions = true;
      renderSettlementAlert();
    } else if (target.id === 'dismissBtn') {
      window.state.showDismissConfirmation = true;
      renderSettlementAlert();
    } else if (target.id === 'cancelSnooze') {
      window.state.showSnoozeOptions = false;
      renderSettlementAlert();
    } else if (target.id === 'confirmDismiss') {
      window.state.showDismissConfirmation = false;
      renderSettlementAlert();
    } else if (target.id === 'cancelDismiss') {
      window.state.showDismissConfirmation = false;
      renderSettlementAlert();
    }

    // Handle dismiss and undo actions
    const dismissButton = target.closest('[data-action="dismiss"]');
    const undoButton = target.closest('[data-action="undo"]');
    
    if (dismissButton) {
      const { id, type } = dismissButton.dataset;
      handleDismissItem(parseInt(id), type);
    } else if (undoButton) {
      const { id, type } = undoButton.dataset;
      handleUndoDismiss(parseInt(id), type);
    }
  }

  function handleBodyChange(e) {
    const target = e.target;

    if (target.id === 'show-dismissed') {
      window.state.showDismissed = target.checked;
      renderPotentialClaims();
    }
  }

  function handleDismissItem(id, type) {
    window.state[type] = window.state[type].map(item =>
      item.id === id ? { ...item, dismissed: true } : item
    );
    renderPotentialClaims();
  }

  function handleUndoDismiss(id, type) {
    window.state[type] = window.state[type].map(item =>
      item.id === id ? { ...item, dismissed: false } : item
    );
    renderPotentialClaims();
  }
})();
