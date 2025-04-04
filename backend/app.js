const express = require('express')
const http = require('http')
const cors = require('cors')
const WebSocket = require('ws')

const app = express()
const server = http.createServer(app)

const wss = new WebSocket.Server({ server })


wss.on("connection", (ws) => {
  console.log("Nouveau client connécter");

  ws.on("message", (message) => {
    console.log("Message reçu:", message);
    
  })

  ws.on("close", () => { 
    console.log("Client déconnecté");
  })
})


app.use(cors())
app.use(express.json())


const createClient = require("@supabase/supabase-js")

const supabaseUrl = 'https://pxldlplqpshfigfejuam.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB4bGRscGxxcHNoZmlnZmVqdWFtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI0NTU0MTgsImV4cCI6MjA1ODAzMTQxOH0.9_xwVw5dUk3eIEte2uQzuqaAyAi-YXqPKpFNRFXv-3c'
const supabase = createClient.createClient(supabaseUrl, supabaseKey)

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.get('/get-messages', async (req, res) => {
  const { data, error } = await supabase.from('messages').select()
  
  if (error) {
    console.error('Erreur lors de la récupération des messages :', error);
    return res.status(500).json({ error: 'Erreur lors de la récupération des messages' });
  }

  res.status(200).json(data)
}
)

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

const port = 3000

server.listen(port, () => {
  console.log(`serveur en écoute sur le port ${port}`)
})