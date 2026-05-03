const http = require('http');
const { Pool } = require('pg');

// 🔐 Configuração do banco
const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT || 5432,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  ssl: { rejectUnauthorized: false },
});

// 🚀 Inicializa tabela
async function initDB() {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL
      )
    `);
    console.log("✅ Tabela 'users' pronta");
  } catch (err) {
    console.error("❌ Erro ao criar tabela:", err);
  }
}

initDB();

// 🌐 Servidor HTTP
const server = http.createServer(async (req, res) => {
  // Health check (ALB usa isso)
  if (req.url === '/' && req.method === 'GET') {
    res.writeHead(200);
    return res.end('OK');
  }

  // GET /users
  if (req.url === '/users' && req.method === 'GET') {
    try {
      const result = await pool.query('SELECT * FROM users');

      res.writeHead(200, { 'Content-Type': 'application/json' });
      return res.end(JSON.stringify(result.rows));
    } catch (err) {
      console.error("❌ GET ERROR:", err);

      res.writeHead(500);
      return res.end('Erro ao buscar usuários');
    }
  }

  // POST /users
  if (req.url === '/users' && req.method === 'POST') {
    let body = '';

    req.on('data', chunk => body += chunk);

    req.on('end', async () => {
      try {
        console.log("📥 BODY RECEBIDO:", body);

        if (!body) throw new Error("Body vazio");

        const parsed = JSON.parse(body);
        const name = parsed.name;

        if (!name) throw new Error("Campo 'name' é obrigatório");

        const result = await pool.query(
          'INSERT INTO users(name) VALUES($1) RETURNING *',
          [name]
        );

        console.log("✅ INSERT OK:", result.rows[0]);

        res.writeHead(201, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(result.rows[0]));

      } catch (err) {
        console.error("❌ POST ERROR:", err);

        res.writeHead(500);
        res.end('Erro ao criar usuário');
      }
    });

    return;
  }

  // Rota não encontrada
  res.writeHead(404);
  res.end('Not Found');
});

// 🔥 Start server
server.listen(3000, '0.0.0.0', () => {
  console.log('🚀 Server rodando na porta 3000');
});