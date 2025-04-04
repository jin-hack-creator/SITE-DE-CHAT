function detectDevice() {
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  const isTablet = /iPad|Android|Tablet/i.test(navigator.userAgent) && !isMobile;
  const isIOS = /iPhone|iPad|iPod/i.test(navigator.userAgent);
  const isLandscape = window.matchMedia("(orientation: landscape)").matches;
  
  document.body.classList.toggle('mobile', isMobile);
  document.body.classList.toggle('tablet', isTablet);
  document.body.classList.toggle('ios', isIOS);
  document.body.classList.toggle('landscape', isLandscape);
}


document.addEventListener('DOMContentLoaded', () => {
  detectDevice();
  

  window.addEventListener('resize', detectDevice);
  window.addEventListener('orientationchange', detectDevice);
  

  const email = localStorage.getItem('email');
  const username = localStorage.getItem('username');
  
  if (!email || !username) {
    window.location.href = 'login.html';
    return;
  }
  
  const userInfo = document.getElementById('user-info');
  userInfo.innerHTML = `
    <i class="fas fa-user"></i> ${username}
    <small>${email}</small>
  `;
  

  const messageInput = document.getElementById('message');
  const sendButton = document.getElementById('send');
  const messagesContainer = document.getElementById('messages');
  

  function sendMessage() {
    const message = messageInput.value.trim();
    if (message) {
      addMessage(message, true);
      
      setTimeout(() => {
        addMessage("Message reçu sur " + (window.innerWidth > 768 ? "desktop" : "mobile"), false);
      }, 1000);
      
      messageInput.value = '';
      
      if (/Android|iPhone|iPad/i.test(navigator.userAgent)) {
        messageInput.blur();
      }
    }
  }
  
  function addMessage(text, isMyMessage) {
    const messageElement = document.createElement('div');
    messageElement.classList.add('message');
    messageElement.classList.add(isMyMessage ? 'my-message' : 'other-message');
    messageElement.textContent = text;
    messagesContainer.appendChild(messageElement);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  }
  
  sendButton.addEventListener('click', sendMessage);
  messageInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') sendMessage();
  });
  
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/sw.js').catch(err => {
        console.log('ServiceWorker registration failed: ', err);
      });
    });
  }
});