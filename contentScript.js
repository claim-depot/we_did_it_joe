(() => {
  'use strict';

  // Create and inject iframe when extension icon is clicked
  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'openPopup') {
      createAndInjectIframe();
    }
  });

  function createAndInjectIframe() {
    // Remove existing iframe if any
    const existingIframe = document.getElementById('extension-iframe');
    if (existingIframe) {
      existingIframe.remove();
    }

    // Create new iframe
    const iframe = document.createElement('iframe');
    iframe.id = 'extension-iframe';
    iframe.src = chrome.runtime.getURL('iframe/iframe.html');
    
    // Style the iframe
    Object.assign(iframe.style, {
      position: 'fixed',
      top: '0',
      right: '0',
      width: '470px',
      height: '100vh',
      border: 'none',
      zIndex: '2147483647',
      backgroundColor: 'transparent'
    });

    // Add iframe to page
    document.body.appendChild(iframe);

    // Handle messages from iframe
    window.addEventListener('message', (event) => {
      if (event.data.action === 'closeIframe') {
        iframe.remove();
      }
    });
  }
})();
