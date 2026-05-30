const fs = require('fs');
const path = require('path');

// Manually parse .env.local to avoid extra dotenv dependency issues
function loadEnv() {
  const envPath = path.join(__dirname, '../.env.local');
  if (!fs.existsSync(envPath)) {
    console.warn('.env.local file not found. Running with environment variables.');
    return;
  }
  const envContent = fs.readFileSync(envPath, 'utf8');
  envContent.split('\n').forEach(line => {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) return;
    const firstEquals = trimmed.indexOf('=');
    if (firstEquals === -1) return;
    const key = trimmed.substring(0, firstEquals).trim();
    const value = trimmed.substring(firstEquals + 1).trim().replace(/^['"]|['"]$/g, '');
    process.env[key] = value;
  });
}

loadEnv();

const dbUrl = process.env.DATABASE_URL || process.env.POSTGRES_URL;

console.log('====================================================');
console.log(' SyncDay Supabase Database Setup Helper ');
console.log('====================================================');

if (!dbUrl) {
  console.log('\n[INFO] No "DATABASE_URL" or "POSTGRES_URL" found in .env.local.');
  console.log('To run this script automatically, please add your PostgreSQL connection string:');
  console.log('  DATABASE_URL=postgresql://postgres:[password]@db.[project-id].supabase.co:5432/postgres');
  console.log('\n[ALTERNATIVE] Paste the SQL schema directly in your browser:');
  console.log('1. Go to your Supabase Project Dashboard (https://supabase.com).');
  console.log('2. Click on "SQL Editor" in the left navigation sidebar.');
  console.log('3. Click "New query".');
  console.log('4. Copy the complete SQL contents from this file:');
  console.log('   -> supabase/migrations/consolidated_schema.sql');
  console.log('5. Click "Run" in the bottom right corner.');
  console.log('====================================================\n');
  process.exit(0);
}

// If DATABASE_URL is present, we can connect using pg and execute
console.log('Connection string found. Attempting automatic database migration...');

let Client;
try {
  Client = require('pg').Client;
} catch (err) {
  console.error('\n[ERROR] The "pg" package is not fully installed yet.');
  console.log('Please wait for "npm install" to complete, or run:');
  console.log('  npm install pg');
  console.log('====================================================\n');
  process.exit(1);
}

const client = new Client({
  connectionString: dbUrl,
  ssl: {
    rejectUnauthorized: false
  }
});

async function run() {
  try {
    await client.connect();
    console.log('Successfully connected to the Supabase PostgreSQL database.');

    const schemaPath = path.join(__dirname, 'migrations/consolidated_schema.sql');
    if (!fs.existsSync(schemaPath)) {
      throw new Error(`Schema file not found at ${schemaPath}`);
    }

    const sql = fs.readFileSync(schemaPath, 'utf8');
    console.log('Executing database migrations...');
    await client.query(sql);
    console.log('\n[SUCCESS] Database tables, constraints, and Row Level Security policies initialized successfully!');
  } catch (err) {
    console.error('\n[DATABASE SETUP ERROR]:', err.message);
    console.log('\nIf connection failed, double check your password in DATABASE_URL,');
    console.log('or simply copy-paste the SQL queries from consolidated_schema.sql');
    console.log('directly into your Supabase Dashboard SQL Editor.');
  } finally {
    await client.end();
    console.log('====================================================\n');
  }
}

run();
