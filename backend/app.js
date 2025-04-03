/* 
* © 2025 ChanJinhuyk & kingjr7 - Logiciel propriétaire
* ID de suivi : SASKI-[hash]-[date]
* Toute utilisation non autorisée sera automatiquement tracée
*/

const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');
const nodemailer = require('nodemailer');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Servir les fichiers frontend
app.use(express.static(path.join(__dirname, '../frontend')));

// Configuration de Nodemailer
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'sasaki-compagnie@gmail.com', // Adresse email de l'expéditeur
    pass: 'votre_mot_de_passe_email'    // Mot de passe de l'email
  }
});

// Route pour envoyer un email de confirmation
app.post('/send-confirmation', express.json(), (req, res) => {
  const { email, username } = req.body;

  const mailOptions = {
    from: 'sasaki-compagnie@gmail.com',
    to: email,
    subject: 'Confirmation de votre inscription à BLUEVISION',
    text: `Bonjour ${username},\n\nMerci de vous être inscrit sur BLUEVISION. Votre compte est maintenant actif.\n\nCordialement,\nL'équipe BLUEVISION`
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error(error);
      res.status(500).send('Erreur lors de l\'envoi de l\'email.');
    } else {
      console.log('Email envoyé : ' + info.response);
      res.status(200).send('Email de confirmation envoyé.');
    }
  });
});

io.on('connection', (socket) => {
  console.log('Un utilisateur est connecté');

  // Réception d'un message
  socket.on('chat message', (msg) => {
    io.emit('chat message', msg); // Diffuser le message à tous les utilisateurs
  });

  socket.on('disconnect', () => {
    console.log('Un utilisateur s\'est déconnecté');
  });
});

server.listen(3000, () => {
  console.log('Serveur en écoute sur http://localhost:3000');
});
