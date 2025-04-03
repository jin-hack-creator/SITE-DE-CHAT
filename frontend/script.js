const socket = io();

const email = localStorage.getItem('email');
const username = localStorage.getItem('username');

if (!email || !username) {
  // Rediriger vers la page de connexion si les informations sont manquantes
  window.location.href = 'login.html';
} else {
  console.log(`Utilisateur connecté : ${username} (${email})`);
}

// Afficher le pseudonyme et l'email dans l'interface
const header = document.querySelector('header');
const userInfo = document.createElement('p');
userInfo.textContent = `Connecté en tant que : ${username} (${email})`;
header.appendChild(userInfo);

// Envoi d'un message
const messagesDiv = document.getElementById('messages');
const messageInput = document.getElementById('message');
const sendButton = document.getElementById('send');

sendButton.addEventListener('click', () => {
  const message = messageInput.value.trim();
  if (message) {
    // Ajouter le message de l'utilisateur dans la zone de chat
    const messageElement = document.createElement('div');
    messageElement.textContent = `Vous : ${message}`;
    messageElement.classList.add('my-message'); // Classe pour les messages de l'utilisateur
    messagesDiv.appendChild(messageElement);

    // Envoyer le message au serveur
    socket.emit('chat message', `${username}: ${message}`);
    messageInput.value = '';
    messagesDiv.scrollTop = messagesDiv.scrollHeight; // Scroll automatique
  }
});

// Réception d'un message
socket.on('chat message', (msg) => {
  const messageElement = document.createElement('div');
  messageElement.textContent = msg;
  messagesDiv.appendChild(messageElement);
  messagesDiv.scrollTop = messagesDiv.scrollHeight; // Scroll automatique
});