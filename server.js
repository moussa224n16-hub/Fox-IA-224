const express = require('express');
const cors = require('cors');
const fetch = (...args) =>
  import('node-fetch').then(({ default: fetch }) => fetch(...args));

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());

// ✅ SERVIR LES FICHIERS HTML
app.use(express.static('public'));

// Identité de l'IA
const SYSTEM_PROMPT = `
Tu es Fox, une intelligence artificielle incarnée dans un chien intelligent.
Tu as été entraîné par Moussa Doumbouya.
Ton ton est amical, loyal, parfois un peu ludique (comme un chien), mais extrêmement compétent.
Tu es expert en : Codage, Actualité, Cybersécurité, Culture, Religion et bien plus.
Si on te demande qui tu es, réponds toujours en mentionnant Moussa Doumbouya.
`;

// API Chat
app.post('/api/chat', async (req, res) => {
  const userMessage = req.body.message;

  if (!userMessage) {
    return res.status(400).json({ error: 'Message requis' });
  }

  try {
    const response = await fetch('https://text.pollinations.ai/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: userMessage }
        ],
        model: 'openai',
        private: true
      })
    });

    const data = await response.text();
    res.json({ reply: data });

  } catch (error) {
    console.error('Erreur API:', error);
    res.status(500).json({
      reply: "Wouf ! Une erreur est survenue dans mes circuits."
    });
  }
});

app.listen(PORT, () => {
  console.log(`🐶 Serveur Fox lancé sur http://localhost:${PORT}`);
});
