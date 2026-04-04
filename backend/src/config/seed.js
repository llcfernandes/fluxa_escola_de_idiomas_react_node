/**
 * seed.js — Gera usuários demo com hashes bcrypt REAIS no startup.
 * Resolve o problema do hash placeholder inválido da versão anterior.
 */
const bcrypt = require('bcryptjs');
const db     = require('../data/database');

const SALT = 10;

const seed = async () => {
  // Evita duplicar se já foi rodado
  if (db.users.findByEmail('admin@fluxa.com.br')) return;

  const [adminHash, studentHash, student2Hash] = await Promise.all([
    bcrypt.hash('Admin@123',   SALT),
    bcrypt.hash('Student@123', SALT),
    bcrypt.hash('Maria@123',   SALT),
  ]);

  db.users.addSeedUser({
    id: 'usr_admin_001',
    name: 'Admin Fluxa',
    email: 'admin@fluxa.com.br',
    password: adminHash,
    role: 'admin',
    language: 'pt',
    enrolledCourses: [],
    progress: {},
    createdAt: '2024-01-01T00:00:00.000Z',
  });

  db.users.addSeedUser({
    id: 'usr_demo_001',
    name: 'Maria Demo',
    email: 'demo@fluxa.com.br',
    password: studentHash,
    role: 'student',
    language: 'pt',
    enrolledCourses: ['crs_en'],
    progress: { crs_en: { completedLessons: ['en_l1', 'en_l2'], score: 87 } },
    createdAt: '2024-03-01T00:00:00.000Z',
  });

  console.log('✅ Seed concluído. Usuários demo criados com hashes reais.');
  console.log('   Admin:  admin@fluxa.com.br  /  Admin@123');
  console.log('   Aluno:  demo@fluxa.com.br   /  Student@123');
};

module.exports = seed;
