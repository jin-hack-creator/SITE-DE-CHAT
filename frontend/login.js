const loginForm = document.getElementById('login-form');

loginForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const email = document.getElementById('email').value.trim();
  const username = document.getElementById('username').value.trim();

  if (email && username) {
    // Stocker l'email et le pseudonyme dans le stockage local
    localStorage.setItem('email', email);
    localStorage.setItem('username', username);

    // Envoyer un email de confirmation
    try {
      const response = await fetch('http://localhost:3000/send-confirmation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, username })
      });

      if (response.ok) {
        alert('Un email de confirmation a été envoyé à votre adresse.');
        // Rediriger vers la page de chat
        window.location.href = 'index.html';
      } else {
        alert('Erreur lors de l\'envoi de l\'email de confirmation.');
      }
    } catch (error) {
      console.error('Erreur :', error);
      alert('Impossible d\'envoyer l\'email de confirmation.');
    }
  } else {
    alert('Veuillez remplir tous les champs.');
  }
});