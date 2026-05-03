const http = require('http');
const { Pool } = require('pg');

// 🔐 Validação de variáveis obrigatórias
const requiredEnv = ['DB_HOST', 'DB_USER', 'DB_PASSWORD', 'DB_NAME'];
requiredEnv.forEach((env) => {
  if (!process.env[env]) {
    console.error(`❌ Variável de ambiente ${env} não definida`);
    process.exit(1);
  }
});

// ⚠️ Corrige caso alguém coloque :5432 no host
let dbHost = process.env.DB_HOST;
if (dbHost.includes(':')) {
  console.warn('⚠️ DB_HOST contém porta, corrigindo automaticamente...');
  dbHost = dbHost.split(':')[0];
}

// 🔐 Configuração do banco
const pool = new Pool({
  host: dbHost,
  port: process.env.DB_PORT || 5432,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  ssl: { rejectUnauthorized: false },
  connectionTimeoutMillis: 5000, // ⛔ evita travamento infinito
});

// 🚀 Teste de conexão inicial
async function testConnection() {
  try {
    console.log('🔄 Testando conexão com o banco...');
    await pool.query('SELECT 1');
    console.log('✅ Conectado ao banco com sucesso');
  } catch (err) {
    console.error('❌ Erro ao conectar no banco:', err.message);
  }
}

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
    console.error("❌ Erro ao criar tabela:", err.message);
  }
}

// Inicialização
(async () => {
  await testConnection();
  await initDB();
})();

// 🌐 Servidor HTTP
const server = http.createServer((req, res) => {

  // Health check
  if (req.url === '/' && req.method === 'GET') {
    res.writeHead(200);
    return res.end('OK');
  }

  // GET /users
  if (req.url === '/users' && req.method === 'GET') {
    pool.query('SELECT * FROM users')
      .then(result => {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(result.rows));
      })
      .catch(err => {
        console.error("❌ GET ERROR:", err.message);
        res.writeHead(500);
        res.end('Erro ao buscar usuários');
      });

    return;
  }

  // POST /users
  if (req.url === '/users' && req.method === 'POST') {
    let body = '';

    req.on('data', chunk => body += chunk);

    req.on('end', async () => {
      try {
        console.log("📥 BODY:", body);

        if (!body) throw new Error("Body vazio");

        const { name } = JSON.parse(body);

        if (!name) throw new Error("Campo 'name' é obrigatório");

        const result = await pool.query(
          'INSERT INTO users(name) VALUES($1) RETURNING *',
          [name]
        );

        console.log("✅ INSERT:", result.rows[0]);

        res.writeHead(201, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(result.rows[0]));

      } catch (err) {
        console.error("❌ POST ERROR:", err.message);
        res.writeHead(500);
        res.end(err.message);
      }
    });

    return;
  }

  // 404
  res.writeHead(404);
  res.end('Not Found');
});

// 🔥 Start server
server.listen(3000, '0.0.0.0', () => {
  console.log('🚀 Server rodando na porta 3000');
});
