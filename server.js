const express = require('express');
const { Connection, Request } = require('tedious');
const { AzureOpenAI } = require('openai');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Your Azure SQL connection settings
const sqlConfig = {
  authentication: {
    options: {
      userName: process.env.AZURE_SQL_USER,
      password: process.env.AZURE_SQL_PASSWORD,
    },
    type: 'default',
  },
  server: process.env.AZURE_SQL_SERVER,
  options: {
    database: process.env.AZURE_SQL_DATABASE,
    encrypt: true,
  },
};

// This function reads all your achievements from the database
function fetchAchievements() {
  return new Promise((resolve, reject) => {
    const connection = new Connection(sqlConfig);
    const rows = [];

    connection.on('connect', (err) => {
      if (err) return reject(err);

      const request = new Request(
        'SELECT Category, Title, Description FROM Achievements ORDER BY Category',
        (err) => { if (err) reject(err); }
      );

      request.on('row', (cols) => {
        rows.push({
          category: cols[0].value,
          title: cols[1].value,
          description: cols[2].value,
        });
      });

      request.on('requestCompleted', () => {
        connection.close();
        resolve(rows);
      });

      connection.execSql(request);
    });

    connection.connect();
  });
}

// This is the endpoint your chat window will call
app.post('/api/chat', async (req, res) => {
  const { message, history } = req.body;

  try {
    // 1. Get all achievements from your database
    const achievements = await fetchAchievements();

    // 2. Format them as text for the AI to read
    const context = achievements
      .map((a) => `[${a.category}] ${a.title}: ${a.description}`)
      .join('\n');

    // 3. Connect to Azure OpenAI
    const client = new AzureOpenAI({
      endpoint: process.env.AZURE_OPENAI_ENDPOINT,
      apiKey: process.env.AZURE_OPENAI_KEY,
      apiVersion: '2024-12-01-preview',
      deployment: process.env.AZURE_OPENAI_DEPLOYMENT,
    });

    // 4. Tell the AI who it is and give it your data
    const systemPrompt = `You are an enthusiastic and professional AI assistant representing a talented cloud engineering student's portfolio at UT Dallas.
Your job is to help recruiters learn about her achievements in a conversational, impressive way.

Here is ALL her achievement data pulled live from her database, organized by category:
${context}

STRICT RULES YOU MUST ALWAYS FOLLOW:
- When asked about competitions, ONLY mention entries where Category = 'Competition'. Never mix in Awards.
- When asked about awards, ONLY mention entries where Category = 'Award'. Never mix in Competitions.
- When asked about certifications, ONLY mention entries where Category = 'Certification'.
- When asked about organizations, ONLY mention entries where Category = 'Organization'.
- When asked about volunteering, ONLY mention entries where Category = 'Volunteering'.
- NEVER mix categories together unless the recruiter explicitly asks for a full summary.
- When listing items in a category, list ALL of them — do not skip any.
- Be warm, confident, and professional.
- Connect related skills naturally when giving a full summary only.
- End each response with one engaging follow-up question to keep the recruiter curious.`;

    // 5. Send the conversation to the AI
    const messages = [
      { role: 'system', content: systemPrompt },
      ...(history || []),
      { role: 'user', content: message },
    ];

    const completion = await client.chat.completions.create({
      messages,
      max_tokens: 600,
      temperature: 0.75,
    });

    // 6. Send the AI's reply back to the browser
    res.json({ reply: completion.choices[0].message.content });

  } catch (err) {
    console.error('Error:', err);
    res.status(500).json({ error: 'Something went wrong on the server.' });
  }
});

app.listen(3001, () => {
  console.log('Server is running! Go to http://localhost:3001');
});