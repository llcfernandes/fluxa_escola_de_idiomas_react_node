const express      = require('express');
const cors         = require('cors');
const helmet       = require('helmet');
const morgan       = require('morgan');
const rateLimit    = require('express-rate-limit');

const authRoutes    = require('./routes/auth.routes');
const courseRoutes  = require('./routes/course.routes');
const contactRoutes = require('./routes/contact.routes');
const userRoutes    = require('./routes/user.routes');
const learnRoutes   = require('./routes/learn.routes');
const errorHandler  = require('./middleware/errorHandler');
const notFound      = require('./middleware/notFound');

const app = express();

// ─── SECURITY ─────────────────────────────────────────────────────
app.use(helmet());
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
  methods: ['GET','POST','PUT','DELETE','PATCH'],
  allowedHeaders: ['Content-Type','Authorization'],
}));

// ─── RATE LIMIT ───────────────────────────────────────────────────
const globalLimiter = rateLimit({ windowMs:15*60*1000, max:100 });
const authLimiter   = rateLimit({ windowMs:15*60*1000, max:10,
  message:{ success:false, message:'Muitas tentativas. Aguarde 15 minutos.' } });

app.use('/api/',          globalLimiter);
app.use('/api/auth/login',    authLimiter);
app.use('/api/auth/register', authLimiter);

// ─── PARSING ──────────────────────────────────────────────────────
app.use(express.json({ limit:'10kb' }));
app.use(express.urlencoded({ extended:true }));
if (process.env.NODE_ENV !== 'test') app.use(morgan('dev'));

// ─── HEALTH ───────────────────────────────────────────────────────
app.get('/api/health', (_req, res) => res.json({
  success:true, message:'Fluxa API online 🚀',
  timestamp:new Date().toISOString(), version:'2.0.0',
}));

// ─── ROUTES ───────────────────────────────────────────────────────
app.use('/api/auth',    authRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/users',   userRoutes);
app.use('/api/learn',   learnRoutes);  // NEW: APA learning engine

// ─── ERROR ────────────────────────────────────────────────────────
app.use(notFound);
app.use(errorHandler);

module.exports = app;
