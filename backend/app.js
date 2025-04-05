const express = require('express')
const http = require('http')
const cors = require('cors')
const WebSocket = require('ws')
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
require('dotenv').config()

const app = express()
const server = http.createServer(app)

const wss = new WebSocket.Server({ server })

const SECRET_KEY = process.env.JWT_SECRET;

wss.on("connection", (ws) => {
  console.log("Nouveau client connécter");

  ws.on("message", (message) => {
    console.log("Message reçu:", message);
    
  })

  ws.on("close", () => { 
    console.log("Client déconnecté");
  })
})

console.log(process.env.CLIENT_URL);


const corsOptions = {
  origin: process.env.CLIENT_URL, // Frontend : autoriser cette origine
  methods: ["GET", "POST", "PUT", "DELETE"], // Méthodes autorisées
  credentials: true, // Permet l'envoi des cookies
};

app.use(cors(corsOptions))
app.use(express.json())
// app.use(bodyParser.json());

const createClient = require("@supabase/supabase-js")

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

const supabase = createClient.createClient(supabaseUrl, supabaseKey)

// Middleware d'authentification via le cookie
function authenticateToken(req, res, next) {
  const token = req.cookies.token;

  if (!token) return res.status(401).json({ message: 'Pas de token' });

  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) return res.status(403).json({ message: 'Token invalide ou expiré' });
    req.user = user;
    next();
  });
}

app.get('/get-messages' ,async (req, res) => {
  const { data, error } = await supabase.from('messages').select()
  
  if (error) {
    console.error('Erreur lors de la récupération des messages :', error);
    return res.status(500).json({ error: 'Erreur lors de la récupération des messages' });
  }

  res.status(200).json(data)
}
)

app.post('/login', async (req, res) => {
  const {pseudo, email} = req.body

  
  const {data, error}  = await supabase.from('users_chat').select().eq('pseudo', pseudo).eq('email', email)

  if (error) {
    console.error('Erreur lors de la récupération de l utilisateur :', error);
    return res.status(500).json({ error: 'Erreur lors de la recuperation de l utilisateur' });
  }
  
  if (data.length === 0) {
    return res.status(401).json({ message: 'Utilisateur non trouvé' });
  }else {
    const token = jwt.sign(
      { id: data.id, pseudo: data.pseudo, email: data.email, role: data.role }, 
      SECRET_KEY, 
      { expiresIn: '1h' }
    );
    
    const isProduction = process.env.NODE_ENV === 'production';

    res.cookie('token', token, {
      httpOnly: true,
      secure: isProduction,                  // seulement true en prod (HTTPS)
      sameSite: isProduction ? 'None' : 'Lax',  // 'None' pour cross-origin sécurisé, 'Lax' sinon
      maxAge: 3600000,
    });
    
    
    console.log(data);
    return res.status(200).json(data)
  }
  
})


app.post('/send-message', async (req, res) => {
  const { message, pseudo} = req.body;

  const {Inserterror} = await supabase.from('messages').insert({
    content: message,
    pseudo: pseudo,
  });

  if (Inserterror) {
    console.error('Erreur lors de l\'insertion du message :', error);
    return res.status(500).json({ error: 'Erreur lors de l\'insertion du message' });
  }

  const {data, error} = await supabase.from('messages').select()
  
  if (error) {
    console.error('Erreur lors de la récupération des messages :', error);
    return res.status(500).json({ error: 'Erreur lors de la récupération des messages' });
  }
  
  // Envoyer le message à tous les clients connectés
  wss.clients.forEach(client => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(data));
    }
  });
  res.status(200).json(data);
})

const port = process.env.PORT || 3000

server.listen(port, '0.0.0.0',() => {
  console.log(`serveur en écoute sur le port ${port}`)
})