/**
 * ─── FLUXA DATABASE (in-memory) ──────────────────────────────────
 * Simula PostgreSQL/MongoDB. Substitua por Prisma + PostgreSQL em produção.
 * Para MongoDB: substituir as funções de CRUD por mongoose models.
 *
 * FIX: Hashes gerados via script de seed no startup (src/config/seed.js)
 * Desenvolvido por Lucas Fernandes — Fernandes Web Studio
 */

const { v4: uuidv4 } = require('uuid');

// ─── MUTABLE STORES ───────────────────────────────────────────────
let users          = [];
let contactMessages= [];
let enrollments    = [];
let exerciseResults= [];

// ─── COURSES (APA-structured content) ────────────────────────────
const courses = [
  {
    id: 'crs_en',
    slug: 'ingles',
    language: 'Inglês',
    languageCode: 'en',
    flag: '🇺🇸',
    nativeName: 'English',
    level: 'A1 → C2',
    duration: '18 meses',
    hoursPerWeek: 4,
    maxStudents: 8,
    price: 299,
    priceLabel: 'R$ 299/mês',
    badge: 'Mais popular',
    badgeColor: '#0066FF',
    shortDesc: 'Do zero à fluência com o Método APA. Inglês para trabalho, viagens e vida.',
    longDesc: 'O curso de inglês da Fluxa é estruturado em torno do ciclo APA — Adquirir, Praticar e Ajustar. Cada módulo combina conteúdo autêntico (vídeos, podcasts, textos reais), exercícios interativos com correção imediata e sessões de ajuste onde você identifica exatamente onde evoluir. Sem decoreba, sem regras soltas — só comunicação real desde a primeira aula.',
    certifications: ['TOEFL','IELTS','Cambridge B2/C1'],
    image: null, // SVG placeholder
    color: '#0066FF',
    rating: 4.9,
    totalStudents: 3240,
    featured: true,
    order: 1,
    // APA Modules — real learning path
    modules: [
      {
        id: 'en_m1',
        title: 'Fundamentos & Pronúncia',
        phase: 'A', // Adquirir
        weeks: 4,
        desc: 'Você absorve os sons do inglês antes das regras. Fonética, ritmo e entonação com áudio nativo.',
        lessons: [
          { id:'en_l1', title:'Sons que não existem em português', type:'video+exercise', durationMin:20 },
          { id:'en_l2', title:'As 5 vogais vs os 14+ sons vocálicos', type:'exercise', durationMin:15 },
          { id:'en_l3', title:'Shadowing: seu primeiro diálogo real', type:'speaking', durationMin:25 },
          { id:'en_l4', title:'Ajuste: grave e compare sua pronúncia', type:'adjust', durationMin:10 },
        ],
      },
      {
        id: 'en_m2',
        title: 'Conversação Cotidiana',
        phase: 'P', // Praticar
        weeks: 6,
        desc: 'Situações reais do dia a dia. Você pratica até as estruturas virarem reflexo.',
        lessons: [
          { id:'en_l5', title:'Apresentações sem travar', type:'speaking', durationMin:20 },
          { id:'en_l6', title:'Phrasal verbs que você vai usar hoje', type:'exercise', durationMin:20 },
          { id:'en_l7', title:'Present Perfect: quando usar de verdade', type:'video+exercise', durationMin:25 },
          { id:'en_l8', title:'Diálogo simulado: entrevista de emprego', type:'speaking', durationMin:30 },
        ],
      },
      {
        id: 'en_m3',
        title: 'Inglês Profissional',
        phase: 'A', // Aplicar
        weeks: 8,
        desc: 'Você aplica o inglês em contextos reais de trabalho. E-mails, reuniões, apresentações.',
        lessons: [
          { id:'en_l9',  title:'E-mails profissionais sem clichê', type:'exercise', durationMin:20 },
          { id:'en_l10', title:'Reunião em inglês: frases que funcionam', type:'video+exercise', durationMin:30 },
          { id:'en_l11', title:'Negociação e persuasão', type:'speaking', durationMin:25 },
          { id:'en_l12', title:'Ajuste final: mapa de lacunas', type:'adjust', durationMin:15 },
        ],
      },
    ],
    exercises: [
      {
        id:'ex_en_001', type:'multiple_choice', phase:'A',
        question:'What is the correct pronunciation pattern for "comfortable"?',
        options:['com-FOR-ta-ble (4 syllables)','COMF-ta-ble (3 syllables)','com-for-TA-ble (4 syllables)','COM-for-ta-ble (4 syllables)'],
        correct: 1,
        explanation:'Native speakers compress "comfortable" to 3 syllables: COMF-ta-ble. This is stress-timed rhythm — English drops unstressed syllables.',
        hint:'Listen for how words are actually spoken, not spelled.',
      },
      {
        id:'ex_en_002', type:'fill_blank', phase:'P',
        sentence:'She decided to ___ a new project even though her schedule was already full.',
        options:['take on','take off','take out','take over'],
        correct: 0,
        explanation:'"Take on" = assumir uma responsabilidade. "Take off" = decolar/tirar. "Take out" = retirar. "Take over" = assumir controle total.',
        hint:'Think about accepting a new responsibility or challenge.',
      },
      {
        id:'ex_en_003', type:'reorder', phase:'P',
        instruction:'Reordene as palavras para formar uma frase correta:',
        words:['already','she','the','finished','has','report'],
        correct:'she has already finished the report',
        explanation:'Present Perfect: subject + have/has + past participle. "Already" goes between "has" and the participle.',
      },
      {
        id:'ex_en_004', type:'translation', phase:'A',
        prompt:'Traduza para inglês de forma natural (não literal):',
        source:'Eu estava pensando se você poderia me ajudar com isso.',
        acceptedAnswers:['I was wondering if you could help me with this.','I was thinking if you could help me with this.'],
        tip:'O inglês usa "wondering" para pedidos indiretos e educados — muito mais natural que "thinking".',
      },
    ],
  },
  {
    id: 'crs_es',
    slug: 'espanhol',
    language: 'Espanhol',
    languageCode: 'es',
    flag: '🇪🇸',
    nativeName: 'Español',
    level: 'A1 → C1',
    duration: '15 meses',
    hoursPerWeek: 4,
    maxStudents: 8,
    price: 279,
    priceLabel: 'R$ 279/mês',
    badge: 'Alta demanda',
    badgeColor: '#FF6B2B',
    shortDesc: 'Espanhol para as Américas e Europa. Fluência com imersão cultural real.',
    longDesc: 'Português e espanhol parecem próximos — e essa proximidade é tanto vantagem quanto armadilha. Nosso curso usa o Método APA para transformar o que você já sabe em fluência real, evitando os "falsos cognatos" e as diferenças de uso que bloqueiam brasileiros. Você aprende o espanhol da América Latina e da Espanha simultaneamente.',
    certifications: ['DELE','SIELE'],
    image: null,
    color: '#FF6B2B',
    rating: 4.8,
    totalStudents: 1876,
    featured: true,
    order: 2,
    modules: [
      { id:'es_m1', title:'Español desde el inicio', phase:'A', weeks:4, desc:'Base fonética e os picos de dificuldade para falantes de português.', lessons:[] },
      { id:'es_m2', title:'Conversación fluida',      phase:'P', weeks:6, desc:'Situações reais com vocabulário que realmente circula.', lessons:[] },
      { id:'es_m3', title:'Negocios y Cultura',       phase:'A', weeks:5, desc:'Espanhol profissional com contexto cultural hispano.', lessons:[] },
    ],
    exercises: [
      {
        id:'ex_es_001', type:'multiple_choice', phase:'A',
        question:'Qual é o "falso cognato" mais perigoso entre português e espanhol?',
        options:['borracha / borracha','embarazada / embriagada','polvo / pulpo','borboleta / mariposa'],
        correct: 1,
        explanation:'"Embarazada" em espanhol significa GRÁVIDA, não embriagada. "Embarazada" = pregnant. "Borracha" existe nos dois com sentidos diferentes também.',
        hint:'Pense em palavras que parecem iguais mas podem causar situações constrangedoras.',
      },
      {
        id:'ex_es_002', type:'fill_blank', phase:'P',
        sentence:'Ayer ___ (yo/ir) al mercado y ___ (comprar) frutas frescas.',
        options:['fui / compré','iba / compraba','voy / compro','fue / compró'],
        correct: 0,
        explanation:'Pretérito indefinido para ações completadas ontem: fui (ir) e compré (comprar). O pretérito imperfecto (iba/compraba) seria para ações habituais no passado.',
      },
    ],
  },
  {
    id: 'crs_fr',
    slug: 'frances',
    language: 'Francês',
    languageCode: 'fr',
    flag: '🇫🇷',
    nativeName: 'Français',
    level: 'A1 → C1',
    duration: '18 meses',
    hoursPerWeek: 4,
    maxStudents: 8,
    price: 309,
    priceLabel: 'R$ 309/mês',
    badge: 'Premium',
    badgeColor: '#7C3AED',
    shortDesc: 'O idioma da diplomacia, da arte e dos negócios internacionais.',
    longDesc: 'Francês é falado em 29 países e é língua oficial da ONU, UNESCO e União Europeia. Nosso método APA foca em fazer você soar natural desde cedo — a pronúncia francesa é o maior bloqueio para brasileiros, e atacamos isso na primeira semana.',
    certifications: ['DELF','DALF','TCF'],
    image: null,
    color: '#7C3AED',
    rating: 4.9,
    totalStudents: 934,
    featured: true,
    order: 3,
    modules: [
      { id:'fr_m1', title:'Phonétique Française',  phase:'A', weeks:5, desc:'Os sons únicos do francês: nasais, liaisons e o R uvular.', lessons:[] },
      { id:'fr_m2', title:'Communication Courante', phase:'P', weeks:7, desc:'Francês para viver: compras, transporte, restaurantes, trabalho.', lessons:[] },
      { id:'fr_m3', title:'Culture & Expression',  phase:'A', weeks:6, desc:'Literatura, cinema e negócios — o francês como ferramenta cultural.', lessons:[] },
    ],
    exercises: [
      {
        id:'ex_fr_001', type:'multiple_choice', phase:'A',
        question:'Qual liaison é OBRIGATÓRIA em "les enfants"?',
        options:['Nenhuma liaison','Liaison do S: "lez-enfants"','Liaison do E: "le-enfants"','Depende da região'],
        correct: 1,
        explanation:'Em francês, a liaison entre determinante e substantivo iniciado por vogal é OBRIGATÓRIA. "Les enfants" → [lez-ɑ̃fɑ̃]. O S final de "les" é pronunciado como Z.',
      },
    ],
  },
  {
    id: 'crs_de',
    slug: 'alemao',
    language: 'Alemão',
    languageCode: 'de',
    flag: '🇩🇪',
    nativeName: 'Deutsch',
    level: 'A1 → B2',
    duration: '24 meses',
    hoursPerWeek: 5,
    maxStudents: 8,
    price: 329,
    priceLabel: 'R$ 329/mês',
    badge: 'Desafiador',
    badgeColor: '#059669',
    shortDesc: 'A língua da engenharia, filosofia e da maior economia da Europa.',
    longDesc: 'Alemão tem reputação de difícil — e merece. Mas com o Método APA, você aprende a gramática no contexto em que ela acontece, não como lista de regras. Os casos (Nominativ, Akkusativ, Dativ, Genitiv) se tornam intuitivos quando você os pratica em frases reais desde o início.',
    certifications: ['Goethe-Zertifikat','TestDaF','DSH'],
    image: null,
    color: '#059669',
    rating: 4.7,
    totalStudents: 512,
    featured: false,
    order: 4,
    modules: [
      { id:'de_m1', title:'Deutsche Grundlagen', phase:'A', weeks:8,  desc:'Cases, gêneros e a lógica do alemão. Com contexto, não decoreba.', lessons:[] },
      { id:'de_m2', title:'Alltagskommunikation', phase:'P', weeks:8,  desc:'Alemão para o cotidiano: trabalho, supermercado, transporte.', lessons:[] },
      { id:'de_m3', title:'Berufsdeutsch',        phase:'A', weeks:8,  desc:'Alemão profissional. Cartas, reuniões, candidatura de emprego.', lessons:[] },
    ],
    exercises: [],
  },
  {
    id: 'crs_it',
    slug: 'italiano',
    language: 'Italiano',
    languageCode: 'it',
    flag: '🇮🇹',
    nativeName: 'Italiano',
    level: 'A1 → C1',
    duration: '15 meses',
    hoursPerWeek: 4,
    maxStudents: 8,
    price: 289,
    priceLabel: 'R$ 289/mês',
    badge: 'Novo',
    badgeColor: '#0891B2',
    shortDesc: 'Arte, gastronomia, moda e cidadania italiana. Tudo começa aqui.',
    longDesc: 'Italiano é considerado o idioma mais musical do mundo — e um dos mais estratégicos para brasileiros descendentes que buscam cidadania. Nosso método APA usa música, cinema e culinária como conteúdo autêntico de aquisição, tornando o aprendizado genuinamente prazeroso.',
    certifications: ['CILS','CELI','PLIDA'],
    image: null,
    color: '#0891B2',
    rating: 4.8,
    totalStudents: 728,
    featured: false,
    order: 5,
    modules: [
      { id:'it_m1', title:'Italiano Basilare',     phase:'A', weeks:4, desc:'Sons, ritmo e as primeiras estruturas com música italiana.', lessons:[] },
      { id:'it_m2', title:'Vita Quotidiana',        phase:'P', weeks:6, desc:'Italiano para viver: gastronomia, família, cultura.', lessons:[] },
      { id:'it_m3', title:'Italiano Professionale', phase:'A', weeks:5, desc:'Negócios e preparação para cidadania italiana.', lessons:[] },
    ],
    exercises: [],
  },
  {
    id: 'crs_zh',
    slug: 'mandarin',
    language: 'Mandarim',
    languageCode: 'zh',
    flag: '🇨🇳',
    nativeName: '普通话',
    level: 'A1 → HSK4',
    duration: '24 meses',
    hoursPerWeek: 5,
    maxStudents: 6,
    price: 359,
    priceLabel: 'R$ 359/mês',
    badge: 'Elite',
    badgeColor: '#DC2626',
    shortDesc: '1.4 bilhão de falantes. O idioma mais estratégico do século XXI.',
    longDesc: 'Mandarim parece impossível — até você entender como ele funciona. É uma língua isolante (sem conjugações, sem gênero, sem casos). O que dificulta são os tons e os caracteres. Nosso Método APA usa técnicas mnemônicas visuais para caracteres e sistema de tons progressivo que vai do reconhecimento para a produção naturalmente.',
    certifications: ['HSK 1-6','HSKK','BCT'],
    image: null,
    color: '#DC2626',
    rating: 4.9,
    totalStudents: 298,
    featured: false,
    order: 6,
    modules: [
      { id:'zh_m1', title:'Pinyin e os 4 Tons',    phase:'A', weeks:4, desc:'O sistema fonético do mandarim. Você aprende a ouvir os tons antes de falar.', lessons:[] },
      { id:'zh_m2', title:'Caracteres Essenciais', phase:'P', weeks:8, desc:'Os 300 caracteres mais frequentes com técnica de memória visual.', lessons:[] },
      { id:'zh_m3', title:'Conversação HSK 1-3',   phase:'A', weeks:12, desc:'Comunicação real: compras, família, trabalho, direções.', lessons:[] },
    ],
    exercises: [
      {
        id:'ex_zh_001', type:'tone_match', phase:'A',
        question:'Qual é a diferença de significado entre os tons de "mā"?',
        options:['1°tom: mãe | 2°tom: cânhamo | 3°tom: cavalo | 4°tom: xingar','1°tom: cânhamo | 2°tom: mãe | 3°tom: xingar | 4°tom: cavalo','1°tom: mãe | 2°tom: xingar | 3°tom: cavalo | 4°tom: cânhamo','Todos significam a mesma coisa com entonações diferentes'],
        correct: 0,
        explanation:'mā (1°, plano) = mãe | má (2°, subindo) = cânhamo | mǎ (3°, desce-sobe) = cavalo | mà (4°, descendo) = xingar. Os tons NÃO são entonação emocional — são parte da palavra.',
      },
    ],
  },
];

// ─── TESTIMONIALS ─────────────────────────────────────────────────
const testimonials = [
  { id:'t1', name:'Rafael Souza',  role:'Engenheiro — Nubank', courseId:'crs_en', courseName:'Inglês', avatar:null, rating:5, text:'Em 8 meses com o Método APA consegui minha primeira entrevista em inglês com empresa americana — e fui aprovado. A Fluxa é diferente de tudo que tentei antes.', result:'Aprovado em empresa americana em 8 meses', featured:true },
  { id:'t2', name:'Camila Ferreira',role:'Médica Residente', courseId:'crs_en', courseName:'Inglês', avatar:null, rating:5, text:'Precisava do inglês para publicar artigos científicos. O método foi cirúrgico — focou exatamente no que eu precisava. Hoje apresento pesquisas em inglês com total confiança.', result:'Artigo publicado em revista internacional', featured:true },
  { id:'t3', name:'Bruno Carvalho', role:'Empreendedor — Agronegócio', courseId:'crs_es', courseName:'Espanhol', avatar:null, rating:5, text:'Expandi meus negócios para Argentina e Chile depois de aprender espanhol na Fluxa. Em 6 meses já fechava reuniões sem intérprete.', result:'Expansão para 2 países em 6 meses', featured:true },
];

// ─── DB INTERFACE ─────────────────────────────────────────────────
const db = {
  users: {
    findAll: () => users,
    findById: (id) => users.find(u => u.id === id) || null,
    findByEmail: (email) => users.find(u => u.email === email?.toLowerCase()) || null,
    create: (data) => {
      const user = {
        id: `usr_${uuidv4().slice(0,8)}`,
        ...data,
        email: data.email.toLowerCase(),
        role: data.role || 'student',
        enrolledCourses: [],
        progress: {},
        createdAt: new Date().toISOString(),
      };
      users.push(user);
      return user;
    },
    update: (id, data) => {
      const idx = users.findIndex(u => u.id === id);
      if (idx === -1) return null;
      users[idx] = { ...users[idx], ...data, updatedAt: new Date().toISOString() };
      return users[idx];
    },
    addSeedUser: (user) => { users.push(user); },
  },
  courses: {
    findAll:      () => [...courses].sort((a,b) => a.order - b.order),
    findById:     (id)   => courses.find(c => c.id === id) || null,
    findBySlug:   (slug) => courses.find(c => c.slug === slug) || null,
    findFeatured: ()     => courses.filter(c => c.featured).sort((a,b) => a.order - b.order),
    getExercises: (courseId) => (courses.find(c => c.id === courseId)?.exercises || []),
  },
  testimonials: {
    findAll:      () => testimonials,
    findFeatured: () => testimonials.filter(t => t.featured),
    findByCourse: (courseId) => testimonials.filter(t => t.courseId === courseId),
  },
  contact: {
    create: (data) => {
      const msg = { id:`msg_${uuidv4().slice(0,8)}`, ...data, status:'pending', createdAt: new Date().toISOString() };
      contactMessages.push(msg);
      return msg;
    },
  },
  enrollments: {
    create: (data) => {
      const e = { id:`enr_${uuidv4().slice(0,8)}`, ...data, status:'active', startedAt: new Date().toISOString() };
      enrollments.push(e);
      return e;
    },
    findByUser: (userId) => enrollments.filter(e => e.userId === userId),
  },
  progress: {
    save: (userId, courseId, lessonId, data) => {
      exerciseResults.push({ id:`res_${uuidv4().slice(0,8)}`, userId, courseId, lessonId, ...data, at: new Date().toISOString() });
    },
    get: (userId, courseId) => exerciseResults.filter(r => r.userId === userId && r.courseId === courseId),
  },
};

module.exports = db;
