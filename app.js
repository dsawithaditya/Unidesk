/* Unidesk Campus Helpdesk - Enterprise Architecture & Production Optimization */
const App = (() => {
  const KEY = 'unidesk_tickets_v2';
  const TOKEN_KEY = 'unidesk_staff_token';
  const SALT = 'unidesk_2026_salt_';
  // Salted SHA-256 hash of 'unidesk_2026_salt_1234'
  const PIN_HASH = 'a3807912ae50bac23ed29e4053be177c74bcf98a30d1235d59efa88005431962';

  const SUPA_URL_KEY = 'unidesk_supabase_url';
  const SUPA_KEY_KEY = 'unidesk_supabase_anon_key';
  const AUTH_USER_KEY = 'unidesk_auth_user';

  const DEFAULT_SUPA_URL = 'https://xfvpoqfzcsvxfnhrfilf.supabase.co';
  const DEFAULT_SUPA_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhmdnBvcWZ6Y3N2eGZuaHJmaWxmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTI4MTg1MDMsImV4cCI6MjEwODM5NDUwM30.8_LgC2pjevNIRaSZOd8hFZbkqemc1OPgakN8RXAgG4w';

  const STATUSES = ['Open', 'In Progress', 'Resolved'];
  const PRIORITIES = ['Low', 'Medium', 'High', 'Urgent'];
  const CATEGORIES = [
    { name: 'IT & Wi-Fi', icon: 'wifi', desc: 'Network, accounts, lab PCs' },
    { name: 'Facilities', icon: 'wrench', desc: 'Repairs, plumbing, electrical' },
    { name: 'Hostel & Mess', icon: 'bed-double', desc: 'Rooms, laundry, food' },
    { name: 'Classroom AV', icon: 'projector', desc: 'Projectors, mics, screens' },
    { name: 'Safety', icon: 'shield-alert', desc: 'Hazards, security, lighting' },
    { name: 'Other', icon: 'circle-help', desc: 'Anything else' },
  ];
  const catIcon = n => (CATEGORIES.find(c => c.name === n) || CATEGORIES[5]).icon;

  const TECHNICIANS = [
    'Unassigned',
    'Rajesh Kumar (Senior Network Lead)',
    'Anjali Sharma (AV & Smart Systems)',
    'Suresh Rao (Estate & Plumbing)',
    'Vikram Singh (HVAC & Electrical)',
    'Pooja Nair (Safety & Security Officer)'
  ];

  const CAMPUS_ZONES = [
    { id: 'lib', name: 'Central Library', icon: 'book-open', match: 'library', floor: 'Floors 1-3' },
    { id: 'sci', name: 'Science & Aryabhatta', icon: 'flask-conical', match: 'aryabhatta', floor: 'Labs & Lecture Halls' },
    { id: 'tech', name: 'Tech Building & AI Lab', icon: 'cpu', match: 'tech', floor: 'Computer Labs 1-6' },
    { id: 'hostel', name: 'Hostel Blocks A-C', icon: 'home', match: 'hostel', floor: 'Residential & Dining' },
    { id: 'aud', name: 'Auditorium & Cafeteria', icon: 'sparkles', match: 'auditorium', floor: 'Student Activity Hub' },
    { id: 'path', name: 'Campus Perimeter', icon: 'compass', match: 'gate', floor: 'North / South Gates' },
  ];

  const SLA_HOURS = { Urgent: 2, High: 8, Medium: 24, Low: 48 };

  const DEPARTMENTS = [
    'IT & Network Support',
    'Estate & Facilities',
    'Hostel & Residential Life',
    'Classroom AV & Smart Labs',
    'Campus Safety & Security',
    'Student Welfare & Counselling',
    'Transport & Fleet Services',
    'Academic Affairs & Records',
    'General Administration'
  ];
  const DEPT_MAP = {
    'IT & Wi-Fi': 'IT & Network Support',
    'Facilities': 'Estate & Facilities',
    'Hostel & Mess': 'Hostel & Residential Life',
    'Classroom AV': 'Classroom AV & Smart Labs',
    'Safety': 'Campus Safety & Security',
    'Other': 'General Administration'
  };

  const FAQ = {
    'IT & Wi-Fi': [
      ['How do I connect to campus Wi-Fi?', 'Select "Eduroam" and sign in with your student email and password. Guests can use "Campus-Guest" with a daily code from the front desk.'],
      ['I forgot my student portal password.', 'Use "Forgot password" on the portal login page, or visit the IT desk in the Library ground floor with your ID card.'],
    ],
    'Facilities': [
      ['How fast are repair requests handled?', 'Urgent safety issues are attended within 2 hours. Standard repairs are typically completed in 1-3 working days.'],
      ['Can I request a room change for repairs?', 'Yes. Mention it in your request description and the facilities team will coordinate with the warden.'],
    ],
    'Hostel & Mess': [
      ['Who do I contact for mess complaints?', 'Raise a "Hostel & Mess" request. The mess committee reviews all open requests every morning.'],
      ['Laundry machine is not working.', 'Report it with the block and floor. Technicians visit hostels every afternoon.'],
    ],
    'General': [
      ['How do I track my request?', 'Open "Track" and search by ticket ID (for example CC-101), or find it in the requests list.'],
      ['What do the statuses mean?', 'Open = received, In Progress = staff are working on it, Resolved = fixed and closed with a note from staff.'],
      ['What does "+1 Affected" do?', 'It tells staff that more people are impacted by the same issue, helping them prioritise.'],
    ],
  };

  const CONTACTS = [
    { name: 'IT Help Desk', place: 'Library, Ground Floor', phone: '+91 1800 100 2001', hours: '8 AM - 8 PM', icon: 'monitor' },
    { name: 'Facilities Control Room', place: 'Admin Block, Room 12', phone: '+91 1800 100 2002', hours: '24 x 7', icon: 'wrench' },
    { name: 'Hostel Warden Office', place: 'Hostel Block A', phone: '+91 1800 100 2003', hours: '24 x 7', icon: 'building' },
    { name: 'Student Counselling', place: 'Wellness Centre', phone: '+91 1800 100 2004', hours: '9 AM - 6 PM', icon: 'heart-handshake' },
    { name: 'Academic Office', place: 'Main Building, Floor 1', phone: '+91 1800 100 2005', hours: '9 AM - 5 PM', icon: 'graduation-cap' },
    { name: 'Transport Desk', place: 'Main Gate', phone: '+91 1800 100 2006', hours: '7 AM - 7 PM', icon: 'bus' },
  ];
  const EMERGENCY = [
    { name: 'Campus Security', phone: '1800 100 0100' },
    { name: 'Medical Centre', phone: '1800 100 0102' },
    { name: 'Fire & Rescue', phone: '101' },
    { name: 'Ambulance', phone: '102' },
  ];

  /* ---------- state ---------- */
  let tickets = [];
  const ui = {
    filterStatus: 'ALL',
    filterCat: 'ALL',
    filterDept: 'ALL',
    filterZone: 'ALL',
    q: '',
    sort: 'new',
    faqCat: 'General',
    draftCat: '',
    draftPrio: 'Medium',
    draftImage: null,
    staffFilter: 'ALL',
    authTab: 'signin',
    authRole: 'student'
  };

  /* ============ THEME MANAGEMENT (DARK / LIGHT MODE) ============ */
  const THEME_STORAGE_KEY = 'unidesk_theme';
  let currentTheme = 'dark';
  try {
    const saved = localStorage.getItem(THEME_STORAGE_KEY);
    if (saved === 'light' || saved === 'dark') {
      currentTheme = saved;
    } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
      currentTheme = 'light';
    }
  } catch (e) {}

  function applyTheme(theme) {
    currentTheme = theme === 'light' ? 'light' : 'dark';
    try {
      localStorage.setItem(THEME_STORAGE_KEY, currentTheme);
    } catch (e) {}

    const isLight = currentTheme === 'light';
    document.body.classList.toggle('light-mode', isLight);
    document.documentElement.classList.toggle('light-mode', isLight);

    const icon = $('theme-icon');
    if (icon) {
      icon.setAttribute('data-lucide', isLight ? 'moon' : 'sun');
    }

    const toggleBtn = $('theme-toggle-btn');
    if (toggleBtn) {
      toggleBtn.setAttribute('title', isLight ? 'Switch to Dark mode' : 'Switch to Light mode');
      toggleBtn.setAttribute('aria-label', isLight ? 'Switch to Dark mode' : 'Switch to Light mode');
    }

    const hLogo = $('header-logo');
    const fLogo = $('footer-logo');
    if (hLogo) hLogo.src = isLight ? 'logo.svg' : 'logo-white.svg';
    if (fLogo) fLogo.src = isLight ? 'logo.svg' : 'logo-white.svg';

    if (window.lucide && typeof lucide.createIcons === 'function') {
      lucide.createIcons();
    }
  }

  function toggleTheme() {
    const next = currentTheme === 'light' ? 'dark' : 'light';
    applyTheme(next);
    playTone('click');
    toast(`Switched to ${next === 'light' ? 'Light' : 'Dark'} mode`);
  }

  try {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: light)');
    if (mediaQuery && mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', e => {
        try {
          if (!localStorage.getItem(THEME_STORAGE_KEY)) {
            applyTheme(e.matches ? 'light' : 'dark');
          }
        } catch (err) {}
      });
    }
  } catch (e) {}

  const ago = mins => new Date(Date.now() - mins * 60000).toISOString();

  /* ============ SINGLETON AUDIO SYNTHESIZER ============ */
  let sharedAudioCtx = null;
  function getAudioContext() {
    if (!sharedAudioCtx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) sharedAudioCtx = new AudioCtx();
    }
    if (sharedAudioCtx && sharedAudioCtx.state === 'suspended') {
      sharedAudioCtx.resume().catch(() => {});
    }
    return sharedAudioCtx;
  }

  function playTone(type) {
    try {
      const ctx = getAudioContext();
      if (!ctx) return;
      if (type === 'click' || type === 'pop') {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.frequency.setValueAtTime(type === 'pop' ? 620 : 800, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(type === 'pop' ? 880 : 400, ctx.currentTime + 0.04);
        gain.gain.setValueAtTime(0.04, ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.04);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.04);
      } else if (type === 'success') {
        [523.25, 659.25, 783.99, 1046.50].forEach((freq, i) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.frequency.setValueAtTime(freq, ctx.currentTime + i * 0.07);
          gain.gain.setValueAtTime(0.06, ctx.currentTime + i * 0.07);
          gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.07 + 0.22);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(ctx.currentTime + i * 0.07);
          osc.stop(ctx.currentTime + i * 0.07 + 0.23);
        });
      }
    } catch (e) { }
  }

  /* ============ CONFETTI WITH ACTIVE RAF CLEANUP ============ */
  let confettiRafId = null;
  function launchConfetti() {
    const canvas = document.getElementById('confetti-canvas');
    if (!canvas) return;
    if (confettiRafId) {
      cancelAnimationFrame(confettiRafId);
      confettiRafId = null;
    }
    canvas.classList.remove('hidden');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const ctx = canvas.getContext('2d');
    const particles = Array.from({ length: 65 }, () => ({
      x: canvas.width / 2,
      y: canvas.height * 0.45,
      vx: (Math.random() - 0.5) * 18,
      vy: (Math.random() - 0.7) * 16,
      size: Math.random() * 8 + 4,
      color: ['#a3ff12', '#d6ff63', '#ffffff', '#ffd700', '#4ade80'][Math.floor(Math.random() * 5)],
      rot: Math.random() * 360,
      vrot: (Math.random() - 0.5) * 12,
      life: 1
    }));
    let frame = 0;
    function step() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      let alive = false;
      particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.38;
        p.rot += p.vrot;
        p.life -= 0.018;
        if (p.life > 0) {
          alive = true;
          ctx.save();
          ctx.globalAlpha = Math.max(0, p.life);
          ctx.translate(p.x, p.y);
          ctx.rotate((p.rot * Math.PI) / 180);
          ctx.fillStyle = p.color;
          ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
          ctx.restore();
        }
      });
      frame++;
      if (alive && frame < 80) {
        confettiRafId = requestAnimationFrame(step);
      } else {
        canvas.classList.add('hidden');
        confettiRafId = null;
      }
    }
    confettiRafId = requestAnimationFrame(step);
  }

  function getSlaInfo(t) {
    const limit = (SLA_HOURS[t.priority] || 24) * 60;
    const elapsed = Math.round((Date.now() - new Date(t.createdAt)) / 60000);
    if (t.status === 'Resolved') {
      const end = new Date(t.timeline[t.timeline.length - 1].at);
      const duration = Math.max(1, Math.round((end - new Date(t.createdAt)) / 60000));
      const met = duration <= limit;
      return {
        text: met ? `SLA Met (${duration >= 60 ? Math.round(duration / 60) + 'h' : duration + 'm'})` : 'SLA Exceeded',
        cls: met ? 'sla-normal' : 'sla-breached',
        icon: met ? 'check-circle' : 'alert-circle'
      };
    }
    const remaining = limit - elapsed;
    if (remaining < 0) {
      const overdueM = Math.abs(remaining);
      return {
        text: `Overdue by ${overdueM >= 60 ? Math.round(overdueM / 60) + 'h' : overdueM + 'm'}`,
        cls: 'sla-breached',
        icon: 'clock'
      };
    }
    if (remaining < 60) {
      return { text: `SLA: ${remaining}m left`, cls: 'sla-warning', icon: 'clock' };
    }
    return { text: `SLA: ${Math.round(remaining / 60)}h target`, cls: 'sla-normal', icon: 'shield-check' };
  }

  /* Optimized image compression with canvas */
  function compressImage(file, callback) {
    const reader = new FileReader();
    reader.onload = e => {
      const img = new Image();
      img.onload = () => {
        const maxDim = 640; // optimized max dimension
        let w = img.width;
        let h = img.height;
        if (w > maxDim || h > maxDim) {
          if (w > h) { h = Math.round((h * maxDim) / w); w = maxDim; }
          else { w = Math.round((w * maxDim) / h); h = maxDim; }
        }
        const canvas = document.createElement('canvas');
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, w, h);
        const dataUrl = canvas.toDataURL('image/jpeg', 0.65);
        callback(dataUrl);
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  }

  /* Client-side duplicate detection */
  function checkDuplicates(query, loc) {
    const cleanQ = (query || '').toLowerCase().trim();
    const cleanLoc = (loc || '').toLowerCase().trim();
    if (cleanQ.length < 3 && cleanLoc.length < 3) return [];
    const words = [...cleanQ.split(/\s+/), ...cleanLoc.split(/\s+/)].filter(w => w.length >= 4);
    if (!words.length) return [];
    return tickets.filter(t => {
      if (t.status === 'Resolved') return false;
      const target = (t.title + ' ' + t.location + ' ' + t.description).toLowerCase();
      return words.some(w => target.includes(w));
    }).slice(0, 2);
  }

  /* ============ INDEXEDDB STORAGE SUBSYSTEM ============ */
  const DB = {
    dbName: 'UnideskDB',
    storeName: 'tickets',
    version: 1,
    dbPromise: null,

    init() {
      if (this.dbPromise) return this.dbPromise;
      this.dbPromise = new Promise((resolve) => {
        if (!window.indexedDB) {
          resolve(null);
          return;
        }
        const req = indexedDB.open(this.dbName, this.version);
        req.onupgradeneeded = e => {
          const db = e.target.result;
          if (!db.objectStoreNames.contains(this.storeName)) {
            db.createObjectStore(this.storeName, { keyPath: 'id' });
          }
        };
        req.onsuccess = e => resolve(e.target.result);
        req.onerror = e => {
          console.warn('IndexedDB failed to initialize:', e);
          resolve(null);
        };
      });
      return this.dbPromise;
    },

    async getAll() {
      try {
        const db = await this.init();
        if (!db) return null;
        return new Promise(resolve => {
          const tx = db.transaction(this.storeName, 'readonly');
          const store = tx.objectStore(this.storeName);
          const req = store.getAll();
          req.onsuccess = () => resolve(req.result || []);
          req.onerror = () => resolve(null);
        });
      } catch (e) {
        return null;
      }
    },

    async setAll(items) {
      try {
        const db = await this.init();
        if (!db) return false;
        return new Promise(resolve => {
          const tx = db.transaction(this.storeName, 'readwrite');
          const store = tx.objectStore(this.storeName);
          store.clear();
          items.forEach(item => store.put(item));
          tx.oncomplete = () => resolve(true);
          tx.onerror = () => resolve(false);
        });
      } catch (e) {
        return false;
      }
    }
  };

  function seed() {
    return [
      mk('CC-101', 'Wi-Fi keeps dropping on 2nd floor', 'IT & Wi-Fi', 'High', 'Central Library, 2nd Floor', 'Rohit Sharma', 'Eduroam and Campus-Guest disconnect every 5 minutes. Around 30 students cannot access journals.', 14, [['Open', 25, 'Request received']], 'IT & Network Support', 'Rajesh Kumar (Senior Network Lead)', [
        { author: 'Rohit Sharma', role: 'student', text: 'Still disconnecting as of 10 minutes ago, mostly on the north side near study carrels.', at: ago(15) }
      ]),
      mk('CC-102', 'Projector HDMI port damaged', 'Classroom AV', 'Urgent', 'Aryabhatta Block, LH-3', 'Prof. Anjali Mehta', 'Screen flickers green. Needed for the 11:30 AM Data Structures lecture.', 6, [['Open', 120, 'Request received'], ['In Progress', 90, 'AV technician dispatched with replacement adapter']], 'Classroom AV & Smart Labs', 'Anjali Sharma (AV & Smart Systems)', [
        { author: 'Anjali Sharma', role: 'staff', text: 'On my way with spare DP-to-HDMI adapter and tester cable.', at: ago(85) }
      ]),
      mk('CC-103', 'Water cooler leaking onto corridor', 'Facilities', 'Medium', 'Hostel Block B, Ground Floor', 'Kunal Patel', 'Drain pipe is cracked and spilling water, creating a slipping hazard.', 3, [['Open', 300, 'Request received'], ['In Progress', 260, 'Plumber assigned'], ['Resolved', 200, 'Replaced drain piping and cleaned the corridor']], 'Estate & Facilities', 'Suresh Rao (Estate & Plumbing)', [
        { author: 'Suresh Rao', role: 'staff', text: 'New PVC pipe welded and tested. Floor wiped dry.', at: ago(200) }
      ], 5, ['⚡ Fast turnaround', '🧹 Cleaned area']),
      mk('CC-104', 'AC thermostat unresponsive', 'Facilities', 'Low', 'Computer Lab 4, Tech Building', 'Samir Verma', 'Thermostat stuck at 18°C and buttons do not respond. Remote is missing.', 2, [['Open', 480, 'Request received']], 'Estate & Facilities', 'Vikram Singh (HVAC & Electrical)'),
      mk('CC-105', 'Street light out near north gate', 'Safety', 'High', 'North Gate Pathway', 'Meera Iyer', 'Three lamps are off, the path is very dark after 7 PM.', 21, [['Open', 700, 'Request received'], ['In Progress', 600, 'Electrician scheduled for tonight']], 'Campus Safety & Security', 'Pooja Nair (Safety & Security Officer)'),
      mk('CC-106', 'Mess serving cold food', 'Hostel & Mess', 'Medium', 'Hostel Block C Mess', 'Aarav Singh', 'Dinner has been served cold for three days. Heating counters appear off.', 9, [['Open', 1500, 'Request received'], ['Resolved', 1200, 'Heating element replaced and tested']], 'Hostel & Residential Life', 'Unassigned', [], 4, ['🔧 High quality fix']),
      mk('CC-107', 'GPU cluster node kernel panic during model training', 'IT & Wi-Fi', 'High', 'AI & Robotics Lab, Room 204', 'Damon Vance', 'Workstation node-04 crashes with CUDA out-of-memory kernel lock during deep learning lab. Needs reboot and driver reinstallation.', 8, [['Open', 180, 'Request received'], ['In Progress', 45, 'System admin remoted into cluster node to inspect GPU logs']], 'IT & Network Support', 'Rajesh Kumar (Senior Network Lead)', [
        { author: 'Rajesh Kumar', role: 'staff', text: 'NVIDIA 550.78 driver reload finished. Testing synthetic benchmark load.', at: ago(30) }
      ]),
      mk('CC-108', 'Fire extinguisher inspection seal expired', 'Safety', 'Urgent', 'Ramanujan Science Block, 3rd Floor', 'Damon Salvatore', 'The CO2 extinguisher outside Chemistry Lab 302 has an inspection seal that expired last month. Needs immediate servicing and recertification.', 15, [['Open', 60, 'Safety officer notified for immediate audit']], 'Campus Safety & Security', 'Pooja Nair (Safety & Security Officer)'),
      mk('CC-109', 'Wireless mic screeching feedback & low battery', 'Classroom AV', 'Medium', 'Main Auditorium', 'Damon Miller', 'Handheld wireless mic #2 keeps cutting out and generating severe RF screeching during morning guest lectures.', 5, [['Open', 720, 'Request received'], ['In Progress', 500, 'AV crew testing receiver frequencies'], ['Resolved', 180, 'Replaced rechargeable lithium cell and recalibrated channel frequency']], 'Classroom AV & Smart Labs', 'Anjali Sharma (AV & Smart Systems)', [], 5, ['👍 Clear updates']),
      mk('CC-110', 'Lost student ID card and RFID bus pass', 'Other', 'Low', 'Campus Cafeteria, Lost & Found', 'Damon Clark', 'Found a blue lanyard with student ID #2024-CS-089 near cafeteria table 14 around 1:30 PM. Handed to security desk.', 4, [['Open', 95, 'Lost item logged in security register']], 'Campus Safety & Security', 'Unassigned'),
      mk('CC-111', 'Hostel washing machine #3 drainage pump failure', 'Hostel & Mess', 'Medium', 'Hostel Block A, Laundry Wing', 'Neha Gupta', 'Washing machine drum filled with soapy water and will not drain or unlock. Clothes currently trapped inside.', 11, [['Open', 360, 'Request received'], ['In Progress', 110, 'Technician dispatched with replacement drainage pump']], 'Hostel & Residential Life', 'Suresh Rao (Estate & Plumbing)', [
        { author: 'Neha Gupta', role: 'student', text: 'Is the technician arriving before 4 PM? Need laundry for evening lab.', at: ago(100) },
        { author: 'Suresh Rao', role: 'staff', text: 'Arriving in 15 mins with replacement motor.', at: ago(70) }
      ]),
      mk('CC-112', 'Pavement paver loose causing bicycle trip hazard', 'Facilities', 'Low', 'Walkway between Cafeteria & Sports Complex', 'Vikram Sen', 'Two concrete pavers near the bicycle stand have cracked and tilt when stepped on or ridden over.', 3, [['Open', 2800, 'Request received'], ['In Progress', 2100, 'Facilities inspection completed'], ['Resolved', 900, 'Pavers re-mortared and leveled']], 'Estate & Facilities', 'Suresh Rao (Estate & Plumbing)', [], 5, ['🔧 High quality fix']),
    ];
  }

  function mk(id, title, category, priority, location, contactName, description, upvotes, steps, department, assignee, comments = [], rating, feedback, image) {
    const timeline = steps.map(([status, m, note]) => ({ status, at: ago(m), note }));
    const dept = department || DEPT_MAP[category] || 'General Administration';
    return {
      id,
      title,
      category,
      department: dept,
      priority,
      location,
      contactName,
      description,
      upvotes,
      status: timeline[timeline.length - 1].status,
      createdAt: timeline[0].at,
      timeline,
      assignee: assignee || 'Unassigned',
      comments: comments || [],
      rating: rating || undefined,
      feedback: feedback || undefined,
      image: image || undefined
    };
  }

  async function load() {
    let loaded = await DB.getAll();
    if (Array.isArray(loaded) && loaded.length >= 10) {
      tickets = loaded;
    } else {
      try {
        tickets = JSON.parse(localStorage.getItem(KEY)) || JSON.parse(localStorage.getItem('unidesk_tickets_v1')) || null;
      } catch {
        tickets = null;
      }
    }

    if (!Array.isArray(tickets) || tickets.length < 10) {
      tickets = seed();
      save();
    } else {
      let changed = false;
      tickets.forEach(t => {
        if (!t.department) {
          t.department = DEPT_MAP[t.category] || 'General Administration';
          changed = true;
        }
        if (!t.assignee) { t.assignee = 'Unassigned'; changed = true; }
        if (!Array.isArray(t.comments)) { t.comments = []; changed = true; }
      });
      if (changed) save();
    }

    // Cloud Database Sync: query Supabase tickets if project is connected
    const sb = getSupabase();
    if (sb) {
      try {
        const { data, error } = await sb.from('tickets').select('*').order('created_at', { ascending: false });
        if (!error && Array.isArray(data) && data.length > 0) {
          tickets = data.map(row => ({
            id: row.id,
            title: row.title,
            category: row.category,
            department: row.department || DEPT_MAP[row.category] || 'General Administration',
            priority: row.priority || 'Medium',
            location: row.location || 'Campus',
            contactName: row.contact_name || row.contactName || 'Anonymous',
            description: row.description || '',
            upvotes: Number(row.upvotes) || 0,
            status: row.status || 'Open',
            createdAt: row.created_at || row.createdAt || new Date().toISOString(),
            timeline: Array.isArray(row.timeline) ? row.timeline : (typeof row.timeline === 'string' ? JSON.parse(row.timeline) : [{ status: row.status || 'Open', at: row.created_at || new Date().toISOString(), note: 'Synced from Supabase' }]),
            assignee: row.assignee || 'Unassigned',
            comments: Array.isArray(row.comments) ? row.comments : (typeof row.comments === 'string' ? JSON.parse(row.comments) : []),
            rating: row.rating || undefined,
            feedback: row.feedback || undefined,
            image: row.image || undefined
          }));
          save();
        }
      } catch (err) {
        console.debug('Supabase initial fetch skipped:', err);
      }
    }
  }

  function save() {
    // 1. Asynchronous high-capacity IndexedDB write (safely handles high-res photo proofs)
    DB.setAll(tickets);

    // 2. Defensive LocalStorage backup (strips multi-MB base64 if needed to avoid QuotaExceededError)
    try {
      const lightCopy = tickets.map(t => {
        if (t.image && t.image.length > 50000) {
          const { image, ...rest } = t;
          return { ...rest, hasImageOffline: true };
        }
        return t;
      });
      localStorage.setItem(KEY, JSON.stringify(lightCopy));
    } catch (err) {
      console.warn('LocalStorage quota limit reached, data safely retained in IndexedDB.', err);
      if (err && (err.name === 'QuotaExceededError' || err.code === 22)) {
        toast('Saved in high-capacity offline database.');
      }
    }
  }

  /* ============ AUTHENTICATION SUBSYSTEM ============ */
  async function sha256(str) {
    if (window.crypto && crypto.subtle) {
      const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(str));
      return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('');
    }
    // Fallback simple hash if subtle crypto not available
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = ((hash << 5) - hash) + str.charCodeAt(i);
      hash |= 0;
    }
    return String(hash);
  }

  /* ============ SUPABASE CLIENT & AUTH SUBSYSTEM ============ */
  let supaClient = null;

  function syncSessionToUser(session) {
    if (!session || !session.user) return;
    const u = session.user;
    const meta = u.user_metadata || {};
    const name = meta.full_name || meta.name || u.email?.split('@')[0].replace(/[._]/g, ' ') || 'Campus User';
    const email = u.email || '';
    const avatar = meta.avatar_url || meta.picture || '';
    const role = meta.role || (email.endsWith('@unidesk.edu') ? 'staff' : 'student');
    const dept = meta.department || (role === 'staff' ? 'Campus IT Support' : 'Aryabhatta Hostel');
    const provider = u.app_metadata?.provider || 'google';

    const cur = getAuthUser();
    if (!cur || cur.id !== u.id || cur.email !== email || cur.avatar !== avatar) {
      setAuthUser({
        id: u.id,
        name,
        email,
        role,
        department: dept,
        avatar,
        provider
      }, true);
      render();
    }
  }

  function getSupabase() {
    if (supaClient) return supaClient;
    const url = localStorage.getItem(SUPA_URL_KEY) || DEFAULT_SUPA_URL;
    const key = localStorage.getItem(SUPA_KEY_KEY) || DEFAULT_SUPA_KEY;
    if (url && key && window.supabase && typeof window.supabase.createClient === 'function') {
      try {
        supaClient = window.supabase.createClient(url, key, {
          auth: {
            persistSession: true,
            autoRefreshToken: true,
            detectSessionInUrl: true
          }
        });
        supaClient.auth.onAuthStateChange((event, session) => {
          if (session && session.user) {
            syncSessionToUser(session);
          } else if (event === 'SIGNED_OUT') {
            clearAuthSession();
            render();
          }
        });
        return supaClient;
      } catch (err) {
        console.warn('Supabase client initialization skipped:', err);
        return null;
      }
    }
    return null;
  }

  function isSupabaseConfigured() {
    return Boolean((localStorage.getItem(SUPA_URL_KEY) || DEFAULT_SUPA_URL) && (localStorage.getItem(SUPA_KEY_KEY) || DEFAULT_SUPA_KEY));
  }

  function getAuthUser() {
    try {
      const raw = localStorage.getItem(AUTH_USER_KEY) || sessionStorage.getItem(AUTH_USER_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  }

  function setAuthUser(user, persist = true) {
    try {
      if (user) {
        const str = JSON.stringify(user);
        if (persist) {
          localStorage.setItem(AUTH_USER_KEY, str);
        } else {
          sessionStorage.setItem(AUTH_USER_KEY, str);
        }
        if (user.role === 'staff') {
          const sessionData = {
            role: 'staff',
            token: 'supa_' + (user.id || 'token_' + Date.now()),
            expiresAt: Date.now() + 8 * 3600 * 1000
          };
          sessionStorage.setItem(TOKEN_KEY, JSON.stringify(sessionData));
        }
      } else {
        localStorage.removeItem(AUTH_USER_KEY);
        sessionStorage.removeItem(AUTH_USER_KEY);
      }
    } catch (e) {
      console.warn('Failed to update auth user storage', e);
    }
  }

  function clearAuthSession() {
    setAuthUser(null);
    sessionStorage.removeItem(TOKEN_KEY);
    const sb = getSupabase();
    if (sb && sb.auth) {
      sb.auth.signOut().catch(() => {});
    }
  }

  function renderAuthNav() {
    const slot = $('auth-nav-slot');
    if (!slot) return;
    const user = getAuthUser();
    if (user) {
      const shortName = esc(user.name ? user.name.split(' ')[0] : 'User');
      const isStaffRole = user.role === 'staff';
      slot.innerHTML = `
        <a href="#/login" class="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold bg-white/5 hover:bg-white/10 border border-white/10 text-gray-200 hover:border-[#a3ff12]/40 transition-colors" title="View Account (${esc(user.email)})">
          ${user.avatar ? `
            <img src="${esc(user.avatar)}" alt="${esc(user.name)}" class="w-5 h-5 rounded-full object-cover border border-[#a3ff12]/50 flex-shrink-0" referrerpolicy="no-referrer">
          ` : `
            <span class="w-2 h-2 rounded-full ${isStaffRole ? 'bg-amber-400' : 'bg-[#a3ff12]'} animate-pulse"></span>
          `}
          <span class="truncate max-w-[90px] font-medium">${shortName}</span>
          <span class="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded ${isStaffRole ? 'bg-amber-400/20 text-amber-300' : 'bg-[#a3ff12]/15 text-[#a3ff12]'}">${isStaffRole ? 'Staff' : 'Student'}</span>
        </a>
      `;
    } else {
      slot.innerHTML = `
        <a href="#/login" class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 hover:text-[#a3ff12] hover:border-[#a3ff12]/30 transition-colors">
          <i data-lucide="user" class="w-3.5 h-3.5"></i>
          <span>Sign In</span>
        </a>
      `;
    }
    lucide.createIcons();
  }

  function syncTicketToSupabase(ticket, fieldsOnly) {
    const sb = getSupabase();
    if (!sb || !ticket) return;
    try {
      if (fieldsOnly) {
        sb.from('tickets').update(fieldsOnly).eq('id', ticket.id).then(({ error }) => {
          if (error) console.debug('Supabase sync update notice:', error.message);
        }).catch(() => {});
      } else {
        const payload = {
          id: ticket.id,
          title: ticket.title,
          category: ticket.category,
          department: ticket.department,
          priority: ticket.priority,
          location: ticket.location,
          contact_name: ticket.contactName,
          description: ticket.description,
          upvotes: ticket.upvotes || 0,
          status: ticket.status,
          created_at: ticket.createdAt,
          timeline: ticket.timeline,
          assignee: ticket.assignee,
          comments: ticket.comments,
          rating: ticket.rating || null,
          feedback: ticket.feedback || null,
          image: ticket.image || null
        };
        sb.from('tickets').upsert(payload).then(({ error }) => {
          if (error) console.debug('Supabase sync upsert notice:', error.message);
        }).catch(() => {});
      }
    } catch (e) {
      console.debug('Supabase sync error:', e);
    }
  }

  function isStaff() {
    const supaUser = getAuthUser();
    if (supaUser && supaUser.role === 'staff') return true;
    try {
      const raw = sessionStorage.getItem(TOKEN_KEY);
      if (!raw) return false;
      const session = JSON.parse(raw);
      if (!session || !session.expiresAt || !session.token) return false;
      if (Date.now() > session.expiresAt) {
        sessionStorage.removeItem(TOKEN_KEY);
        return false;
      }
      return session.role === 'staff';
    } catch {
      return false;
    }
  }

  /* ---------- helpers ---------- */
  const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  
  function sanitize(str) {
    if (window.DOMPurify && typeof window.DOMPurify.sanitize === 'function') {
      return window.DOMPurify.sanitize(String(str ?? ''));
    }
    return esc(str);
  }

  function timeAgo(iso) {
    const m = Math.max(0, Math.round((Date.now() - new Date(iso)) / 60000));
    if (m < 1) return 'just now';
    if (m < 60) return m + 'm ago';
    if (m < 1440) return Math.round(m / 60) + 'h ago';
    return Math.round(m / 1440) + 'd ago';
  }
  const fmt = iso => new Date(iso).toLocaleString([], { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });
  const counts = () => ({ total: tickets.length, open: tickets.filter(t => t.status === 'Open').length, prog: tickets.filter(t => t.status === 'In Progress').length, done: tickets.filter(t => t.status === 'Resolved').length });
  const $ = id => document.getElementById(id);

  function statusChip(s) {
    const map = {
      'Open': 'bg-amber-400/15 text-amber-300 border border-amber-400/25',
      'In Progress': 'bg-[#a3ff12]/15 text-[#a3ff12] border border-[#a3ff12]/30',
      'Resolved': 'bg-emerald-400/15 text-emerald-300 border border-emerald-400/25'
    };
    const ic = { 'Open': 'circle-dot', 'In Progress': 'loader', 'Resolved': 'check-circle-2' };
    return `<span class="chip ${map[s]}"><i data-lucide="${ic[s]}" class="w-3.5 h-3.5"></i>${s}</span>`;
  }
  function prioChip(p) {
    const map = {
      Low: 'bg-white/10 text-gray-300 border border-white/10',
      Medium: 'bg-[#a3ff12]/15 text-[#a3ff12] border border-[#a3ff12]/25',
      High: 'bg-orange-400/15 text-orange-300 border border-orange-400/25',
      Urgent: 'bg-red-500/20 text-red-300 border border-red-500/30'
    };
    return `<span class="chip ${map[p]}">${p}</span>`;
  }
  function toast(msg) {
    const msgEl = $('toast-msg');
    if (msgEl) msgEl.textContent = msg;
    const t = $('toast');
    if (t) {
      t.classList.remove('opacity-0', '-translate-y-2');
      clearTimeout(toast._t);
      toast._t = setTimeout(() => t.classList.add('opacity-0', '-translate-y-2'), 2400);
    }
  }
  const heading = (title, sub, extra = '', eyebrow = 'UNIDESK') => `<div class="flex flex-wrap items-end justify-between gap-6 mb-12 sm:mb-14">
    <div>
      <div class="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-[#a3ff12] mb-3 font-semibold">
        <span class="w-2 h-2 rounded-full bg-[#a3ff12] shadow-[0_0_10px_#a3ff12]"></span>// ${eyebrow}
      </div>
      <h1 class="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white font-['Outfit']">${title}<span class="text-[#a3ff12]">.</span></h1>
      <p class="text-gray-400 mt-3 text-base sm:text-lg max-w-2xl font-normal leading-relaxed">${sub}</p>
    </div>
    ${extra}
  </div>`;

  /* ---------- navigation ---------- */
  const NAV = [
    ['#/', 'Home', 'house'],
    ['#/report', 'Report', 'square-pen'],
    ['#/requests', 'Track', 'list-checks'],
    ['#/help', 'Help', 'book-open'],
    ['#/directory', 'Directory', 'phone'],
    ['#/staff', 'Staff', 'shield-check'],
    ['#/login', 'Account', 'user']
  ];
  function renderNav(path) {
    const active = h => (h === '#/' ? path === '/' : ('#' + path).startsWith(h));
    const navEl = $('nav');
    const tabEl = $('tabbar');
    if (navEl) navEl.innerHTML = NAV.map(([h, l]) => `<a href="${h}" class="nav-link ${active(h) ? 'active' : ''}">${l}</a>`).join('');
    if (tabEl) tabEl.innerHTML = NAV.map(([h, l, i]) => `<a href="${h}" class="tab-link ${active(h) ? 'active' : ''}"><i data-lucide="${i}" class="w-5 h-5"></i>${l}</a>`).join('');
    renderAuthNav();
  }

  /* ---------- pages ---------- */
  function pageHome() {
    const c = counts();
    const recent = [...tickets].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 3);
    const heroQuickActions = [
      {
        cat: 'IT & Wi-Fi',
        meta: 'Eduroam & Labs',
        svg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h.01" stroke-width="3"/><path d="M2 8.82a15 15 0 0 1 20 0"/><path d="M5 12.859a10 10 0 0 1 14 0"/><path d="M8.5 16.429a5 5 0 0 1 7 0"/></svg>`
      },
      {
        cat: 'Facilities',
        meta: 'Repairs & Power',
        svg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>`
      },
      {
        cat: 'Hostel & Mess',
        meta: 'Rooms & Dining',
        svg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z"/><path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2"/><path d="M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2"/><path d="M10 6h4"/><path d="M10 10h4"/><path d="M10 14h4"/><path d="M10 18h4"/></svg>`
      },
      {
        cat: 'Safety',
        meta: '24/7 Security',
        svg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/><path d="m9 12 2 2 4-4"/></svg>`
      }
    ];
    const stat = (label, val) => `<div class="zen-stat glass"><div class="zen-stat-v">${val}</div><div class="zen-stat-l">${label}</div></div>`;
    const features = [
      ['Report an issue', 'Submit a request in under a minute with category, location and priority.', 'square-pen', '#/report', 'Start a request'],
      ['Track requests', 'Search, filter and follow every ticket from Open to Resolved.', 'list-checks', '#/requests', 'View all requests'],
      ['Knowledge base', 'Quick answers to common IT, hostel and facilities questions.', 'book-open', '#/help', 'Browse help'],
      ['Directory & emergency', 'Who to call, where to go and emergency numbers.', 'phone-call', '#/directory', 'Open directory'],
      ['Staff portal', 'Update statuses, add resolution notes and view analytics.', 'shield-check', '#/staff', 'Staff login'],
    ];

    const statementWords = [
      'UNIDESK', 'creates', 'a', 'clear', 'direction', 'for', 'campus', 'life,',
      'strong', 'support', 'turnaround,', 'and', 'an', 'issue', 'resolution',
      'strategy', 'that', 'unites', 'students,', 'staff,', 'and', 'facilities.'
    ];

    const capBadge = (title, href) => `<a href="${href}" class="capability-badge capability-label"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"></path><path d="M12 5v14"></path></svg><span>${title}</span></a>`;
    const capEmpty = w => `<div class="capability-badge capability-empty" style="width:${w}px"></div>`;

    const tracks = [
      {
        duration: 70, delay: -6, reverse: false,
        items: [
          capEmpty(110),
          capBadge('Eduroam & High-Speed Wi-Fi', '#/report?cat=IT%20%26%20Wi-Fi'),
          capBadge('Lab Workstation Diagnostics', '#/report?cat=IT%20%26%20Wi-Fi'),
          capEmpty(260), capEmpty(138), capEmpty(275),
          capBadge('AV Projector Calibration', '#/report?cat=Classroom%20AV'),
          capEmpty(290)
        ]
      },
      {
        duration: 78, delay: -15, reverse: true,
        items: [
          capBadge('Electrical & Power Restoration', '#/report?cat=Facilities'),
          capEmpty(330), capEmpty(205),
          capBadge('Water & Plumbing Repairs', '#/report?cat=Facilities'),
          capEmpty(220),
          capBadge('Hostel Room & Laundry Care', '#/report?cat=Hostel%20%26%20Mess'),
          capEmpty(235), capEmpty(112), capEmpty(250)
        ]
      },
      {
        duration: 84, delay: -24, reverse: false,
        items: [
          capEmpty(275), capEmpty(150),
          capBadge('Safety & Emergency Dispatch', '#/report?cat=Safety'),
          capBadge('Campus Night Safety & Lighting', '#/report?cat=Safety'),
          capBadge('Rapid Ticket Escalation', '#/requests'),
          capEmpty(180), capEmpty(318)
        ]
      },
      {
        duration: 92, delay: -33, reverse: true,
        items: [
          capBadge('Student Portal & ID Clearance', '#/help'),
          capEmpty(235),
          capBadge('Central Cafeteria & Mess Quality', '#/report?cat=Hostel%20%26%20Mess'),
          capEmpty(250), capEmpty(128), capEmpty(265), capEmpty(140),
          capBadge('Air Conditioning Dispatch', '#/report?cat=Facilities')
        ]
      },
      {
        duration: 75, delay: -42, reverse: false,
        items: [
          capEmpty(180),
          capBadge('Lost & Found Register', '#/report?cat=Other'),
          capBadge('Classroom Mics & Sound', '#/report?cat=Classroom%20AV'),
          capEmpty(330), capEmpty(210), capEmpty(345), capEmpty(225)
        ]
      }
    ];

    const lanesHtml = tracks.map(tr => {
      const grp = `<div class="capability-group">${tr.items.join('')}</div>`;
      return `<div class="capability-track ${tr.reverse ? 'reverse' : ''}" style="--lane-duration:${tr.duration}s;--lane-delay:${tr.delay}s">${grp}${grp}</div>`;
    }).join('');

    return `
    <section class="zen-hero">
      <div class="zen-ribbon l"></div><div class="zen-ribbon r"></div>
      <div class="zen-orb" style="width:340px;height:340px;left:32%;top:58%"></div>

      <div class="zen-hero-content w-full flex flex-col items-center">
        <div class="zen-hero-showcase zen-rise" style="--d:.05s">
          <div class="zen-quick-dock" role="navigation" aria-label="Quick category report">
            ${heroQuickActions.map(item => `
              <a href="#/report?cat=${encodeURIComponent(item.cat)}" class="zen-quick-btn" aria-label="Report ${item.cat} issue">
                <span class="zen-quick-orb" aria-hidden="true">${item.svg}</span>
                <span class="zen-quick-text">
                  <span class="zen-quick-title">${item.cat}</span>
                  <span class="zen-quick-meta">${item.meta}</span>
                </span>
                <span class="zen-quick-arrow" aria-hidden="true">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><path d="M7 17L17 7"/><path d="M7 7h10v10"/></svg>
                </span>
              </a>
            `).join('')}
          </div>
        </div>

        <h1 class="zen-title mt-9 zen-rise" style="--d:.15s"><span class="lime-t">Issues</span> solved fast<span class="lime-t">.</span></h1>
        <p class="zen-sub mt-6 zen-rise" style="--d:.28s">One helpdesk for Wi-Fi, repairs, hostel and safety issues. Report, track and resolve campus problems with clarity, speed and impact.</p>

        <div class="flex flex-wrap items-center justify-center gap-3 mt-9 zen-rise" style="--d:.4s">
          <a href="#/report" class="zen-cta">Report an issue<span class="arrow"><i data-lucide="arrow-up-right" class="w-4 h-4"></i></span></a>
          <a href="#/requests" class="zen-cta zen-cta-glass glass">Track requests<span class="arrow"><i data-lucide="arrow-up-right" class="w-4 h-4"></i></span></a>
        </div>

        <form id="track-form" data-submit="track-submit" class="zen-track glass mt-6 zen-rise" style="--d:.5s">
          <input id="track-id" placeholder="Have a ticket ID? e.g. CC-101" aria-label="Ticket ID" autocomplete="off">
          <button type="submit">Track</button>
        </form>
        <p id="track-err" role="alert" aria-live="polite" class="hidden text-red-300 text-sm mt-2">No ticket found with that ID.</p>

        <div class="grid grid-cols-2 md:grid-cols-4 gap-3 w-full max-w-4xl mt-14 zen-rise" style="--d:.6s">
          ${stat('Total requests', c.total)}${stat('Open', c.open)}${stat('In progress', c.prog)}${stat('Resolved', c.done)}
        </div>
      </div>

      <!-- Seamless Transition Veil & Optical Horizon Seam -->
      <div class="zen-hero-seam" aria-hidden="true">
        <div class="zen-hero-seam-glow"></div>
        <div class="zen-hero-seam-line"></div>
      </div>
    </section>

    <!-- ZEN STACK: Capabilities wall & Venetian Shutter Transition -->
    <div class="about-services-stack">
      <div class="about-scroll-track">
        <section id="about" class="about-panel">
          <div class="about-statement-wrap">
            <div class="about-eyebrow"><i data-lucide="sparkles" class="w-3.5 h-3.5 text-[#a3ff12]"></i> // UNIDESK CAPABILITIES &amp; OPERATIONS</div>
            <p class="about-statement" id="about-statement">
              ${statementWords.map(w => `<span class="about-word ${w === 'UNIDESK' ? 'highlight' : ''}">${w}</span>`).join(' ')}
            </p>
          </div>
          <div id="capabilities" class="capabilities-wrap" role="region" aria-label="Campus resolution capabilities">
            <div class="capability-lanes">
              ${lanesHtml}
            </div>
          </div>
        </section>
      </div>

      <!-- Services Section (Light) with Radiant Lime Laser Crest -->
      <section id="services" class="zen-light relative z-20">
        <div class="zen-blur-glow" aria-hidden="true"></div>
        <div class="zen-blur-crest" aria-hidden="true"></div>
        <div class="zen-blob" style="width:420px;height:420px;left:-140px;top:140px"></div>
        <div class="zen-blob" style="width:380px;height:380px;right:-120px;top:1100px"></div>
        <div class="zen-wrap" style="position:relative;z-index:1">

          <section>
            <h2 class="zen-h2">Browse by category.</h2>
            <p class="zen-lead">Everything your campus needs for faster fixes, clear ownership, and zero guesswork.</p>
            <div class="grid md:grid-cols-2 gap-5 mt-12">
              ${CATEGORIES.map(k => `<a href="#/report?cat=${encodeURIComponent(k.name)}" class="zen-lime-card">
                <div><h3>${k.name}</h3><p>${k.desc}</p></div>
                <div class="flex items-center gap-4"><span class="zen-icon-box"><i data-lucide="${k.icon}"></i></span><span class="zen-arrow"><i data-lucide="arrow-up-right"></i></span></div>
              </a>`).join('')}
            </div>
          </section>

          <section class="mt-28">
            <h2 class="zen-h2">Everything in one place.</h2>
            <p class="zen-lead">Report, follow up, find answers and reach the right office without leaving Unidesk.</p>
            <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-5 mt-12">
              ${features.map(f => `<a href="${f[3]}" class="zen-glass-card glass-light">
                <span class="zen-feat-icon"><i data-lucide="${f[2]}"></i></span>
                <h3>${f[0]}</h3><p>${f[1]}</p>
                <span class="zen-link">${f[4]}<i data-lucide="arrow-up-right" class="w-4 h-4"></i></span>
              </a>`).join('')}
              <a href="#/report" class="zen-glass-card zen-glass-lime">
                <h3>Something broken right now?</h3><p>Tell us what is wrong and where. We will route it to the right team.</p>
                <span class="zen-link">Report it now<i data-lucide="arrow-up-right" class="w-4 h-4"></i></span>
              </a>
            </div>
          </section>

          <section class="mt-28">
            <div class="zen-dark-panel">
              <div class="flex flex-wrap items-end justify-between gap-4 mb-8">
                <h2 class="zen-h2 !text-white">Latest requests.</h2>
                <a href="#/requests" class="zen-pill">See all<i data-lucide="arrow-up-right" class="w-4 h-4"></i></a>
              </div>
              <div class="grid gap-3">${recent.map(ticketRow).join('')}</div>
            </div>
          </section>

          <section class="mt-28 text-center">
            <h2 class="zen-h2">Let's fix it<span style="color:#7fd100">.</span></h2>
            <p class="zen-lead mx-auto">Spotted a problem on campus? It takes under a minute to report.</p>
            <a href="#/report" class="zen-cta mt-9">Start your request<span class="arrow"><i data-lucide="arrow-up-right" class="w-4 h-4"></i></span></a>
          </section>

        </div>
      </section>
    </div>`;
  }

  function ticketRow(t) {
    const sla = getSlaInfo(t);
    const hasImg = !!t.image;
    const commentCount = (t.comments || []).length;
    return `<a href="#/ticket/${t.id}" data-ticket-card="${t.id}" class="bg-card rounded-2xl p-5 md:p-6 flex flex-col gap-3.5 hover:border-[#a3ff12]/50 hover:shadow-[0_12px_36px_rgba(163,255,18,0.12)] transition-all group">
      <div class="flex flex-wrap items-center gap-2 justify-between">
        <div class="flex items-center gap-2 flex-wrap">
          <span class="font-mono text-xs text-[#a3ff12] bg-[#a3ff12]/10 border border-[#a3ff12]/25 px-2.5 py-1 rounded-md font-bold tracking-wider">${t.id}</span>
          <span class="chip bg-white/10 text-gray-300 border border-white/10"><i data-lucide="${catIcon(t.category)}" class="w-3.5 h-3.5 text-[#a3ff12]"></i>${esc(t.category)}</span>
          <span class="chip bg-white/5 text-gray-300 border border-white/10 text-[11px]"><i data-lucide="building-2" class="w-3 h-3 text-[#a3ff12]"></i>${esc(t.department || DEPT_MAP[t.category] || 'General Admin')}</span>
          ${prioChip(t.priority)}
          <span class="sla-pill ${sla.cls}"><i data-lucide="${sla.icon}" class="w-3 h-3"></i>${sla.text}</span>
          ${hasImg ? `<span class="inline-flex items-center gap-1 text-[11px] text-[#a3ff12] bg-[#a3ff12]/10 border border-[#a3ff12]/20 px-2 py-0.5 rounded-full"><i data-lucide="image" class="w-3 h-3"></i>Photo</span>` : ''}
        </div>
        <div class="flex items-center gap-2">
          ${t.rating ? `<span class="text-xs text-amber-300 bg-amber-400/10 border border-amber-400/25 px-2 py-0.5 rounded-full font-bold flex items-center gap-1">★ ${t.rating}.0</span>` : ''}
          ${statusChip(t.status)}
          <span class="w-7 h-7 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 group-hover:text-[#a3ff12] group-hover:border-[#a3ff12]/40 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all"><i data-lucide="arrow-up-right" class="w-3.5 h-3.5"></i></span>
        </div>
      </div>
      <div>
        <div class="font-bold text-lg leading-snug text-white group-hover:text-[#a3ff12] transition-colors">${esc(t.title)}</div>
        <p class="text-sm text-gray-400 mt-1 line-clamp-2 leading-relaxed">${esc(t.description)}</p>
      </div>
      <div class="flex flex-wrap items-center justify-between gap-2 text-xs text-gray-400 pt-3 border-t border-white/5">
        <span class="inline-flex items-center gap-1.5"><i data-lucide="map-pin" class="w-3.5 h-3.5 text-[#a3ff12]"></i>${esc(t.location)}</span>
        <span class="inline-flex items-center gap-3">
          ${commentCount > 0 ? `<span class="inline-flex items-center gap-1 text-gray-300"><i data-lucide="message-square" class="w-3 h-3 text-[#a3ff12]"></i>${commentCount}</span>` : ''}
          <span class="inline-flex items-center gap-1"><i data-lucide="users" class="w-3.5 h-3.5 text-gray-400"></i><span class="vote-count">${t.upvotes} affected</span></span>
          <span>${esc(t.contactName)} · ${timeAgo(t.createdAt)}</span>
        </span>
      </div></a>`;
  }

  function pageReport(params) {
    if (params.get('cat') && CATEGORIES.some(c => c.name === params.get('cat'))) ui.draftCat = params.get('cat');
    const authUser = getAuthUser();
    const savedName = (authUser && authUser.name) || localStorage.getItem('unidesk_name') || localStorage.getItem('campuscare_name') || '';
    const currentDept = DEPT_MAP[ui.draftCat] || DEPARTMENTS[0];
    return `<div class="max-w-5xl mx-auto">
      ${heading('Report an issue', 'Tell us what is wrong and where. We will route it to the right team.', '', 'SUBMIT TICKET')}
      
      <!-- Duplicate Prevention Live Notification (Debounced, Accessible) -->
      <div id="duplicate-alert" role="alert" aria-live="polite" class="hidden mb-6 bg-[#162012]/90 border border-[#a3ff12]/40 rounded-3xl p-5 shadow-[0_12px_40px_rgba(0,0,0,0.5)] backdrop-blur-xl animate-fade"></div>

      <form id="report-form" data-submit="report-submit" novalidate class="w-full bg-card rounded-3xl p-8 sm:p-12 md:p-14 space-y-12 border border-white/10 shadow-[0_24px_60px_rgba(0,0,0,0.5)]">
        <div>
          <div class="flex items-center justify-between mb-5">
            <label class="block font-bold text-lg text-white tracking-tight">1. What type of issue is it?</label>
            <span class="text-xs text-[#a3ff12] font-mono tracking-wider">// Select category</span>
          </div>
          <div id="cat-grid" class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5 sm:gap-4">${CATEGORIES.map(k => catBtn(k)).join('')}</div>
          <p id="e-cat" role="alert" aria-live="polite" class="hidden text-red-400 text-sm mt-3 font-medium">Please choose a category.</p>
        </div>
        <div class="pt-10 border-t border-white/10">
          <div class="flex items-center justify-between mb-5">
            <label class="block font-bold text-lg text-white tracking-tight">2. How urgent is it?</label>
            <span class="text-xs text-gray-400 font-mono tracking-wider">Default: Medium</span>
          </div>
          <div id="prio-grid" class="grid grid-cols-2 sm:grid-cols-4 gap-4">${PRIORITIES.map(p => prioBtn(p)).join('')}</div>
        </div>
        <div class="pt-10 border-t border-white/10 space-y-7">
          <div class="flex items-center justify-between mb-1">
            <label class="block font-bold text-lg text-white tracking-tight">3. Incident Details</label>
            <span class="text-xs text-[#a3ff12] font-mono tracking-wider">// Department & info</span>
          </div>
          <div>
            <label for="f-title" class="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2.5">Issue Title</label>
            <div class="relative flex items-center">
              <i data-lucide="type" class="w-4 h-4 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none z-10"></i>
              <input id="f-title" data-input="report-typing" aria-describedby="e-title" class="field !pl-12 !pr-5 !py-4 text-base" maxlength="80" placeholder="Short title, e.g. Projector not turning on in LH-3">
            </div>
            <p id="e-title" role="alert" aria-live="polite" class="hidden text-red-400 text-sm mt-2 font-medium">Title needs at least 5 characters.</p>
          </div>
          <div class="grid sm:grid-cols-2 gap-6">
            <div>
              <label for="f-dept" class="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2.5">Campus Department</label>
              <div class="relative flex items-center">
                <i data-lucide="building-2" class="w-4 h-4 text-[#a3ff12] absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none z-10"></i>
                <select id="f-dept" class="field !pl-12 !pr-10 !py-4 text-base appearance-none cursor-pointer">
                  ${DEPARTMENTS.map(d => `<option value="${d}" ${currentDept === d ? 'selected' : ''}>${d}</option>`).join('')}
                </select>
                <i data-lucide="chevron-down" class="w-4 h-4 text-gray-400 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none"></i>
              </div>
              <p class="text-[11px] text-[#a1a89c] mt-1.5 font-mono">Designated campus unit responsible for resolution</p>
            </div>
            <div>
              <label for="f-loc" class="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2.5">Specific Location</label>
              <div class="relative flex items-center">
                <i data-lucide="map-pin" class="w-4 h-4 text-[#a3ff12] absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none z-10"></i>
                <input id="f-loc" data-input="report-typing" aria-describedby="e-loc" class="field !pl-12 !pr-5 !py-4 text-base" placeholder="e.g. Block C, Room 204 or North Gate Pathway">
              </div>
              <p id="e-loc" role="alert" aria-live="polite" class="hidden text-red-400 text-sm mt-2 font-medium">Location is required.</p>
            </div>
          </div>
          <div class="grid sm:grid-cols-2 gap-6">
            <div>
              <label for="f-name" class="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2.5">Contact Name</label>
              <div class="relative flex items-center">
                <i data-lucide="user" class="w-4 h-4 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none z-10"></i>
                <input id="f-name" aria-describedby="e-name" class="field !pl-12 !pr-5 !py-4 text-base" placeholder="Your name" value="${esc(savedName)}">
              </div>
              <p id="e-name" role="alert" aria-live="polite" class="hidden text-red-400 text-sm mt-2 font-medium">Contact name is required.</p>
            </div>
            <div>
              <label for="f-sid" class="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2.5">Student / Staff ID <span class="text-[#a1a89c] font-normal font-mono lowercase">(optional)</span></label>
              <div class="relative flex items-center">
                <i data-lucide="id-card" class="w-4 h-4 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none z-10"></i>
                <input id="f-sid" class="field !pl-12 !pr-5 !py-4 text-base" placeholder="e.g. 2024-CS-089 or EMP-401">
              </div>
            </div>
          </div>
          <div>
            <label for="f-desc" class="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2.5">Description</label>
            <textarea id="f-desc" rows="5" maxlength="500" data-input="report-typing" aria-describedby="e-desc" class="field resize-none text-base leading-relaxed !p-5" placeholder="Describe the problem in detail. What happened, since when, who is affected?"></textarea>
            <div class="flex justify-between mt-2.5">
              <p id="e-desc" role="alert" aria-live="polite" class="hidden text-red-400 text-sm font-medium">Description needs at least 10 characters.</p>
              <span class="text-xs text-gray-400 font-mono ml-auto"><span id="desc-count">0</span>/500</span>
            </div>
          </div>

          <!-- Photo Proof / Media Attachment Dropzone -->
          <div>
            <div class="flex items-center justify-between mb-2.5">
              <label class="block text-xs font-semibold uppercase tracking-wider text-gray-400">Photo Proof / Attachment <span class="text-[#a1a89c] font-normal font-mono lowercase">(optional)</span></label>
              <span class="text-xs text-[#a3ff12] font-mono">// Instant mobile camera or upload</span>
            </div>
            
            <input type="file" id="f-image-input" accept="image/*" class="hidden" data-change="image-upload">
            
            <div id="image-dropzone" class="file-dropzone flex flex-col items-center justify-center gap-3" data-action="trigger-upload" tabindex="0" role="button" aria-label="Upload photo proof">
              <div class="w-12 h-12 rounded-full bg-[#a3ff12]/15 border border-[#a3ff12]/30 flex items-center justify-center text-[#a3ff12]">
                <i data-lucide="camera" class="w-6 h-6"></i>
              </div>
              <div>
                <p class="text-sm font-bold text-white">Click to upload photo or take picture</p>
                <p class="text-xs text-gray-400 mt-1">PNG, JPG, WebP supported · Automatically compressed</p>
              </div>
            </div>

            <div id="image-preview-wrap" class="hidden mt-4 relative inline-block">
              <img id="image-preview" src="" alt="Photo preview" class="w-48 h-32 object-cover rounded-2xl border border-[#a3ff12]/40 shadow-xl">
              <button type="button" data-action="remove-image" aria-label="Remove image" class="absolute -top-2.5 -right-2.5 w-7 h-7 rounded-full bg-red-500 text-white flex items-center justify-center shadow-lg hover:bg-red-600 transition">
                <i data-lucide="x" class="w-4 h-4"></i>
              </button>
            </div>
          </div>

        </div>
        <div class="pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-6">
          <span class="text-xs text-gray-400 flex items-center gap-2.5"><i data-lucide="shield-check" class="w-4 h-4 text-[#a3ff12]"></i>Directly routed to the corresponding campus department</span>
          <button class="btn-primary !py-4 !px-10 text-base font-bold w-full sm:w-auto shadow-xl" type="submit"><i data-lucide="send" class="w-4 h-4 stroke-[2.5]"></i>Submit Request</button>
        </div>
      </form>
    </div>`;
  }

  function catBtn(k) {
    const on = ui.draftCat === k.name;
    return `<button type="button" data-action="pick-cat" data-cat="${k.name}" class="text-left rounded-2xl p-4 sm:p-5 border transition-all ${on ? 'border-[#a3ff12] bg-[#a3ff12]/15 text-white ring-2 ring-[#a3ff12]/30 shadow-[0_0_24px_rgba(163,255,18,0.2)]' : 'border-white/10 bg-white/[0.03] text-gray-300 hover:border-[#a3ff12]/40 hover:bg-white/[0.06]'} flex flex-col justify-between min-h-[105px] group">
      <i data-lucide="${k.icon}" class="w-5 h-5 ${on ? 'text-[#a3ff12]' : 'text-gray-400 group-hover:text-[#a3ff12]'} mb-2.5 transition"></i>
      <div>
        <div class="text-sm font-bold tracking-tight">${k.name}</div>
        <div class="text-[11px] text-gray-400 mt-1 line-clamp-1">${k.desc}</div>
      </div></button>`;
  }

  function prioBtn(p) {
    const on = ui.draftPrio === p;
    return `<button type="button" data-action="pick-prio" data-prio="${p}" class="rounded-2xl py-3.5 px-4 text-sm font-bold border transition-all ${on ? 'border-[#a3ff12] bg-[#a3ff12]/20 text-[#a3ff12] ring-2 ring-[#a3ff12]/30 shadow-[0_0_20px_rgba(163,255,18,0.2)]' : 'border-white/10 bg-white/[0.03] text-gray-300 hover:border-[#a3ff12]/40 hover:text-white'}">${p}</button>`;
  }

  function pageRequests() {
    return `${heading('Track requests', 'Every submitted issue and its current status.', `<a href="#/report" class="btn-primary !py-2.5 !px-5 text-sm"><i data-lucide="plus" class="w-4 h-4 stroke-[2.5]"></i>New request</a>`, 'CAMPUS STATUS')}
    
    <!-- Campus Health & Facility Matrix -->
    <div class="mb-8">
      <div class="flex items-center justify-between mb-3.5">
        <div class="text-xs font-mono uppercase tracking-wider text-[#a3ff12] font-semibold flex items-center gap-2">
          <span class="w-2 h-2 rounded-full bg-[#a3ff12] shadow-[0_0_8px_#a3ff12]"></span>// CAMPUS FACILITY STATUS MATRIX
        </div>
        <span class="text-xs text-gray-400 font-mono">Select a zone to filter</span>
      </div>
      <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        ${CAMPUS_ZONES.map(z => {
      const zoneTickets = tickets.filter(t => t.location.toLowerCase().includes(z.match));
      const urgent = zoneTickets.filter(t => t.priority === 'Urgent' && t.status !== 'Resolved').length;
      const open = zoneTickets.filter(t => t.status !== 'Resolved').length;
      const isSel = ui.filterZone === z.id;
      const statusDot = urgent > 0 ? 'bg-red-500 shadow-[0_0_8px_#ef4444]' : open > 0 ? 'bg-amber-400 shadow-[0_0_8px_#f59e0b]' : 'bg-[#a3ff12] shadow-[0_0_8px_#a3ff12]';
      return `<button type="button" data-action="set-zone" data-zone="${z.id}" class="building-card text-left ${isSel ? 'active' : ''}">
            <div class="flex items-center justify-between mb-2">
              <i data-lucide="${z.icon}" class="w-4 h-4 ${isSel ? 'text-[#a3ff12]' : 'text-gray-400'}"></i>
              <span class="w-2 h-2 rounded-full ${statusDot}"></span>
            </div>
            <div class="font-bold text-xs text-white truncate">${z.name}</div>
            <div class="text-[11px] text-gray-400 mt-1 font-mono">${open} active · ${z.floor}</div>
          </button>`;
    }).join('')}
      </div>
      ${ui.filterZone !== 'ALL' ? `<div class="mt-2 text-right"><button data-action="clear-zone" class="text-xs text-[#a3ff12] hover:underline font-mono">Clear zone filter ✕</button></div>` : ''}
    </div>

    <div class="bg-card rounded-3xl p-4 md:p-5 mb-6 border border-white/10 grid gap-3.5 lg:grid-cols-[1fr_auto_auto_auto]">
      <div class="relative flex items-center">
        <i data-lucide="search" class="w-4 h-4 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none"></i>
        <input id="q" data-input="search-requests" class="field !pl-12 !pr-4 !py-3" placeholder="Search title, ID, location, department or reporter" value="${esc(ui.q)}">
      </div>
      <select class="field lg:w-48 !py-3" data-change="filter-cat"><option value="ALL">All categories</option>${CATEGORIES.map(k => `<option ${ui.filterCat === k.name ? 'selected' : ''}>${k.name}</option>`).join('')}</select>
      <select class="field lg:w-52 !py-3" data-change="filter-dept"><option value="ALL">All departments</option>${DEPARTMENTS.map(d => `<option ${ui.filterDept === d ? 'selected' : ''}>${d}</option>`).join('')}</select>
      <select class="field lg:w-44 !py-3" data-change="sort-requests"><option value="new" ${ui.sort === 'new' ? 'selected' : ''}>Newest first</option><option value="votes" ${ui.sort === 'votes' ? 'selected' : ''}>Most affected</option><option value="prio" ${ui.sort === 'prio' ? 'selected' : ''}>Highest priority</option></select>
    </div>
    <div id="status-tabs" class="flex gap-2.5 overflow-x-auto pb-2 mb-6"></div>
    <div id="req-list" class="grid gap-3.5"></div>`;
  }

  function renderRequestList() {
    const q = ui.q.toLowerCase();
    const zoneMatch = ui.filterZone !== 'ALL' ? (CAMPUS_ZONES.find(z => z.id === ui.filterZone) || {}).match : null;
    let list = tickets.filter(t => (ui.filterStatus === 'ALL' || t.status === ui.filterStatus) &&
      (ui.filterCat === 'ALL' || t.category === ui.filterCat) &&
      (ui.filterDept === 'ALL' || t.department === ui.filterDept) &&
      (!zoneMatch || t.location.toLowerCase().includes(zoneMatch)) &&
      (!q || [t.title, t.id, t.location, t.contactName, t.description, t.department || ''].some(v => v.toLowerCase().includes(q))));
    const rank = { Urgent: 0, High: 1, Medium: 2, Low: 3 };
    list.sort(ui.sort === 'votes' ? (a, b) => b.upvotes - a.upvotes : ui.sort === 'prio' ? (a, b) => rank[a.priority] - rank[b.priority] : (a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    const c = counts();
    const tabs = [['ALL', 'All', c.total], ['Open', 'Open', c.open], ['In Progress', 'In Progress', c.prog], ['Resolved', 'Resolved', c.done]];
    const tabsEl = $('status-tabs');
    if (tabsEl) {
      tabsEl.innerHTML = tabs.map(([v, l, n]) => `<button type="button" data-action="set-status" data-status="${v}" class="shrink-0 rounded-full px-5 py-2.5 text-sm font-bold transition-all ${ui.filterStatus === v ? 'bg-[#a3ff12] text-[#0c0f0a] shadow-[0_4px_20px_rgba(163,255,18,0.35)]' : 'bg-white/[0.04] border border-white/10 text-gray-300 hover:text-white hover:border-[#a3ff12]/30'}">${l} <span class="${ui.filterStatus === v ? 'bg-[#0c0f0a]/20 text-[#0c0f0a]' : 'bg-white/10 text-gray-400'} px-2 py-0.5 rounded-full text-xs font-mono ml-1">${n}</span></button>`).join('');
    }
    const listEl = $('req-list');
    if (listEl) {
      listEl.innerHTML = list.length ? list.map(ticketRow).join('') : `<div class="bg-card rounded-3xl p-12 text-center border border-white/10"><div class="w-16 h-16 rounded-full bg-[#a3ff12]/15 border border-[#a3ff12]/30 flex items-center justify-center mx-auto mb-4 text-[#a3ff12]"><i data-lucide="inbox" class="w-7 h-7"></i></div><div class="font-bold text-xl text-white">No requests found</div><p class="text-sm text-gray-400 mt-2 max-w-sm mx-auto">Try different keywords or filters, or submit a new campus request.</p><a href="#/report" class="btn-primary mt-6 inline-flex"><i data-lucide="plus" class="w-4 h-4"></i>New request</a></div>`;
    }
    lucide.createIcons();
  }

  function pageTicket(id) {
    const t = tickets.find(x => x.id === id);
    if (!t) return `<div class="bg-card rounded-3xl p-12 text-center border border-white/10"><div class="font-bold text-2xl text-white mb-2">Ticket not found</div><p class="text-gray-400 mb-6 text-sm">We couldn't locate request ID ${esc(id)}.</p><a href="#/requests" class="btn-primary inline-flex">Back to requests</a></div>`;
    const idx = STATUSES.indexOf(t.status);
    const sla = getSlaInfo(t);
    const comments = t.comments || [];

    const staffActions = isStaff() ? `<div id="staff-action-box" class="bg-card rounded-3xl p-6 md:p-7 border border-white/10 mt-6 shadow-xl space-y-4">
      <div class="font-bold text-base flex items-center justify-between text-[#a3ff12] font-mono text-sm uppercase tracking-wider">
        <span class="flex items-center gap-2"><i data-lucide="shield-check" class="w-4 h-4"></i>Staff Dispatch &amp; Actions</span>
        <span class="text-xs text-gray-400">Authenticated Staff</span>
      </div>
      <div>
        <label class="block text-xs font-mono uppercase tracking-wider text-gray-400 mb-2">Update Progression Status</label>
        <div class="flex flex-wrap gap-2.5">${STATUSES.map(s => `<button type="button" data-action="set-ticket-status" data-id="${t.id}" data-status="${s}" class="rounded-xl px-4 py-2 text-sm font-bold border transition-all ${t.status === s ? 'border-[#a3ff12] bg-[#a3ff12]/20 text-[#a3ff12] shadow-[0_0_15px_rgba(163,255,18,0.25)]' : 'border-white/15 bg-white/[0.03] text-gray-300 hover:border-[#a3ff12]/50 hover:text-white'}">${s}</button>`).join('')}</div>
      </div>
      <div class="grid sm:grid-cols-2 gap-4 pt-2">
        <div>
          <label for="assign-select-${t.id}" class="block text-xs font-mono uppercase tracking-wider text-gray-400 mb-1.5">Assign Lead Technician</label>
          <select id="assign-select-${t.id}" class="field !py-2.5 text-sm" data-change="assign-ticket" data-id="${t.id}">
            ${TECHNICIANS.map(tech => `<option value="${tech}" ${t.assignee === tech ? 'selected' : ''}>${tech}</option>`).join('')}
          </select>
        </div>
        <div>
          <label for="staff-note" class="block text-xs font-mono uppercase tracking-wider text-gray-400 mb-1.5">Resolution / Dispatch Note</label>
          <input id="staff-note" class="field !py-2.5 text-sm" placeholder="e.g. Technician dispatched with replacement part">
        </div>
      </div>
    </div>` : `<p class="text-sm text-[#a1a89c] mt-6">Staff? <a href="#/staff" class="text-[#a3ff12] font-semibold hover:underline">Sign in</a> to update status or assign technicians.</p>`;

    // CSAT Feedback Section (for Resolved tickets)
    let csatHtml = '';
    if (t.status === 'Resolved') {
      const currentRating = t.rating || 0;
      const feedbackTags = ['⚡ Fast turnaround', '🔧 High quality fix', '👍 Clear updates', '🧹 Cleaned area'];
      csatHtml = `<div class="bg-card rounded-3xl p-6 md:p-7 mt-6 border border-emerald-500/30 shadow-[0_12px_40px_rgba(16,185,129,0.1)]">
        <div class="flex items-center justify-between mb-3">
          <div class="font-mono text-xs uppercase tracking-wider text-emerald-400 font-semibold flex items-center gap-2">
            <i data-lucide="star" class="w-4 h-4 fill-emerald-400 text-emerald-400"></i>// RESOLUTION SATISFACTION (CSAT)
          </div>
          <span id="csat-rated-badge" class="${currentRating > 0 ? '' : 'hidden'} text-xs text-emerald-300 font-mono font-bold bg-emerald-500/15 border border-emerald-500/30 px-2.5 py-0.5 rounded-full">Rated ${currentRating}.0 / 5.0</span>
        </div>
        <h3 class="text-lg font-bold text-white mb-1">How satisfied are you with this resolution?</h3>
        <p class="text-xs text-gray-400 mb-4">Your feedback helps improve campus facilities and staff recognition.</p>
        <div id="csat-stars" class="flex items-center gap-3 mb-4">
          ${[1, 2, 3, 4, 5].map(star => `<button type="button" data-action="rate-ticket" data-id="${t.id}" data-stars="${star}" class="star-btn text-2xl sm:text-3xl ${currentRating >= star ? 'active' : ''}" title="Rate ${star} star${star > 1 ? 's' : ''}">★</button>`).join('')}
        </div>
        <div class="flex flex-wrap gap-2 pt-2 border-t border-white/5">
          ${feedbackTags.map(tag => {
        const hasTag = Array.isArray(t.feedback) && t.feedback.includes(tag);
        return `<button type="button" data-action="toggle-tag" data-id="${t.id}" data-tag="${tag}" class="text-xs px-3 py-1.5 rounded-full border transition-all ${hasTag ? 'bg-[#a3ff12]/20 border-[#a3ff12] text-[#a3ff12] font-semibold' : 'bg-white/5 border-white/10 text-gray-400 hover:text-white hover:border-white/20'}">${tag}</button>`;
      }).join('')}
        </div>
      </div>`;
    }

    return `<a href="#/requests" class="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-[#a3ff12] transition-colors mb-6 group"><i data-lucide="arrow-left" class="w-4 h-4 group-hover:-translate-x-1 transition-transform"></i>Back to all requests</a>
    <div class="grid lg:grid-cols-3 gap-6">
      <div class="lg:col-span-2">
        <div class="bg-card rounded-3xl p-6 md:p-8 border border-white/10 shadow-2xl">
          <div class="flex flex-wrap gap-2.5 items-center mb-5">
            <span class="font-mono text-xs text-[#a3ff12] bg-[#a3ff12]/10 border border-[#a3ff12]/25 px-2.5 py-1 rounded-md font-bold tracking-wider">${t.id}</span>
            <span class="chip bg-white/10 text-gray-300 border border-white/10"><i data-lucide="${catIcon(t.category)}" class="w-3.5 h-3.5 text-[#a3ff12]"></i>${esc(t.category)}</span>
            <span class="chip bg-[#a3ff12]/10 text-white border border-[#a3ff12]/30"><i data-lucide="building-2" class="w-3.5 h-3.5 text-[#a3ff12]"></i>${esc(t.department || DEPT_MAP[t.category] || 'General Admin')}</span>
            ${prioChip(t.priority)}
            <span id="ticket-sla" class="sla-pill ${sla.cls}"><i data-lucide="${sla.icon}" class="w-3 h-3"></i>${sla.text}</span>
            <span id="ticket-status-chip">${statusChip(t.status)}</span>
          </div>
          <h1 class="text-2xl sm:text-3xl md:text-4xl font-extrabold leading-tight text-white font-['Outfit']">${esc(t.title)}</h1>
          <p class="text-gray-300 mt-4 leading-relaxed whitespace-pre-line text-base">${esc(t.description)}</p>

          ${t.image ? `<div class="mt-6 pt-6 border-t border-white/10">
            <div class="text-xs uppercase font-mono tracking-wider text-gray-400 mb-3 flex items-center gap-2">
              <i data-lucide="image" class="w-4 h-4 text-[#a3ff12]"></i>Attached Photo Proof
            </div>
            <div class="relative group max-w-sm rounded-2xl overflow-hidden border border-white/15 bg-black/40 cursor-pointer shadow-xl" data-action="zoom-ticket" data-id="${t.id}" tabindex="0" role="button" aria-label="Enlarge image attachment">
              <img src="${t.image}" alt="Attachment for ${t.id}" class="w-full h-48 object-cover transition duration-300 group-hover:scale-105">
              <div class="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 text-white font-semibold text-xs backdrop-blur-[2px]">
                <i data-lucide="maximize-2" class="w-4 h-4 text-[#a3ff12]"></i>Click to enlarge
              </div>
            </div>
          </div>` : ''}

          <div class="grid sm:grid-cols-4 gap-4 mt-8 pt-6 border-t border-white/10 text-sm">
            <div><div class="text-gray-400 text-xs font-mono uppercase mb-1">Department</div><div class="font-medium text-white flex items-center gap-1.5"><i data-lucide="building-2" class="w-4 h-4 text-[#a3ff12]"></i>${esc(t.department || DEPT_MAP[t.category] || 'General Admin')}</div></div>
            <div><div class="text-gray-400 text-xs font-mono uppercase mb-1">Location</div><div class="font-medium text-white flex items-center gap-1.5"><i data-lucide="map-pin" class="w-4 h-4 text-[#a3ff12]"></i>${esc(t.location)}</div></div>
            <div><div class="text-gray-400 text-xs font-mono uppercase mb-1">Reported by</div><div class="font-medium text-white">${esc(t.contactName)}${t.studentId ? ` <span class="text-xs text-gray-400 font-mono">(${esc(t.studentId)})</span>` : ''}</div></div>
            <div><div class="text-gray-400 text-xs font-mono uppercase mb-1">Submitted</div><div class="font-medium text-white">${fmt(t.createdAt)}</div></div>
          </div>
        </div>

        <!-- 3-Step Progression Stepper -->
        <div id="ticket-stepper" class="bg-card rounded-3xl p-6 md:p-7 mt-6 border border-white/10"><div class="flex items-start">${[0, 1, 2].map(i => `<div class="flex-1 flex flex-col items-center text-center gap-2 relative">${i > 0 ? `<div class="absolute top-4 right-1/2 w-full h-0.5 ${i <= idx ? 'bg-[#a3ff12]' : 'bg-white/10'}"></div>` : ''}<div class="relative z-10 w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs ${i <= idx ? 'bg-[#a3ff12] text-[#0c0f0a] shadow-[0_0_16px_rgba(163,255,18,0.5)]' : 'bg-white/10 text-gray-400'}"><i data-lucide="${i <= idx ? 'check' : 'circle'}" class="w-4 h-4"></i></div><span class="text-xs font-semibold ${i <= idx ? 'text-white' : 'text-gray-400'}">${STATUSES[i]}</span></div>`).join('')}</div></div>

        <!-- Staff Action Panel -->
        ${staffActions}

        <!-- CSAT Rating Widget (if Resolved) -->
        ${csatHtml}

        <!-- Interactive Discussion & Updates Thread -->
        <div class="bg-card rounded-3xl p-6 md:p-8 mt-6 border border-white/10 shadow-xl">
          <div class="flex items-center justify-between mb-6 pb-4 border-b border-white/10">
            <div class="font-mono text-xs uppercase tracking-wider text-[#a3ff12] font-semibold flex items-center gap-2">
              <span class="w-2 h-2 rounded-full bg-[#a3ff12] shadow-[0_0_8px_#a3ff12]"></span>// DIRECT CLARIFICATIONS &amp; UPDATES
            </div>
            <span id="comments-count" class="text-xs text-gray-400 font-mono">${comments.length} message${comments.length === 1 ? '' : 's'}</span>
          </div>

          <!-- Message list -->
          <div id="comments-list" class="space-y-4 mb-6">
            ${comments.length ? comments.map(c => `
              <div class="rounded-2xl p-4 border ${c.role === 'staff' ? 'bg-[#152011]/80 border-[#a3ff12]/30 text-white ml-3 sm:ml-6' : 'bg-white/[0.04] border-white/10 text-gray-200 mr-3 sm:mr-6'}">
                <div class="flex items-center justify-between gap-2 mb-2">
                  <div class="flex items-center gap-2">
                    <span class="font-bold text-sm text-white">${esc(c.author)}</span>
                    <span class="text-[10px] font-mono uppercase px-2 py-0.5 rounded-full ${c.role === 'staff' ? 'bg-[#a3ff12] text-[#0c0f0a] font-bold' : 'bg-white/10 text-gray-400'}">${c.role === 'staff' ? 'Staff' : 'Student'}</span>
                  </div>
                  <span class="text-[11px] text-gray-400 font-mono">${timeAgo(c.at)}</span>
                </div>
                <p class="text-sm leading-relaxed">${esc(c.text)}</p>
              </div>
            `).join('') : `<p class="comments-empty text-sm text-gray-400 italic py-2">No discussion notes yet. Need to provide more details or ask the technician? Post a message below.</p>`}
          </div>

          <!-- Add comment input -->
          <form id="comment-form" data-submit="comment-submit" data-id="${t.id}" class="space-y-3 pt-2 border-t border-white/5">
            <div class="flex gap-3">
              <input id="c-author" class="field !w-36 sm:!w-48 !py-3 text-sm shrink-0" placeholder="Your name" value="${esc(localStorage.getItem('unidesk_name') || (isStaff() ? 'Campus Staff' : ''))}">
              <input id="c-text" class="field !py-3 text-sm flex-1" placeholder="Write a note, question, or location detail..." required>
              <button type="submit" class="btn-primary !py-3 !px-5 text-sm shrink-0 font-bold"><i data-lucide="send" class="w-4 h-4"></i><span class="hidden sm:inline">Post</span></button>
            </div>
          </form>
        </div>

      </div>

      <!-- Right Column Details & Activity Sidebar -->
      <aside class="space-y-6">
        <div class="bg-card rounded-3xl p-6 border border-white/10">
          <div class="font-mono text-xs uppercase tracking-wider text-gray-400 mb-2">// ASSIGNED TECHNICIAN</div>
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-full bg-[#a3ff12]/15 border border-[#a3ff12]/30 flex items-center justify-center text-[#a3ff12] font-bold">
              <i data-lucide="user-check" class="w-5 h-5"></i>
            </div>
            <div>
              <div id="ticket-assignee" class="font-bold text-white text-sm">${esc(t.assignee || 'Unassigned')}</div>
              <div class="text-xs text-gray-400 font-mono mt-0.5">${esc(t.department || 'Campus Facilities')}</div>
            </div>
          </div>
        </div>

        <div class="bg-card rounded-3xl p-6 border border-white/10">
          <div class="font-bold text-base text-white mb-1">Affected by this too?</div>
          <p class="text-sm text-gray-400 mb-4 leading-relaxed">Let staff know more students are impacted to elevate priority.</p>
          <button type="button" data-action="upvote" data-id="${t.id}" class="btn-ghost w-full justify-center !py-3 hover:border-[#a3ff12] transition-transform duration-150"><i data-lucide="thumbs-up" class="w-4 h-4 text-[#a3ff12]"></i>+1 Affected · ${t.upvotes}</button>
        </div>

        <div class="bg-card rounded-3xl p-6 border border-white/10">
          <div class="font-bold text-base text-white mb-4 flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-[#a3ff12]">
            <span class="w-1.5 h-1.5 rounded-full bg-[#a3ff12]"></span>// Activity Log
          </div>
          <ol id="ticket-timeline" class="space-y-5 relative">
            ${[...t.timeline].reverse().map(e => `<li class="pl-6 relative"><span class="absolute left-0 top-1.5 w-2.5 h-2.5 rounded-full bg-[#a3ff12] shadow-[0_0_10px_#a3ff12]"></span><div class="flex items-center gap-2 text-sm font-semibold text-white">${e.status}<span class="text-xs text-gray-400 font-normal font-mono">${fmt(e.at)}</span></div><p class="text-sm text-gray-400 mt-1 leading-relaxed">${esc(e.note || '')}</p></li>`).join('')}
          </ol>
        </div>
      </aside>
    </div>`;
  }

  function pageHelp() {
    const tabs = Object.keys(FAQ);
    return `${heading('Knowledge base', 'Quick answers before you raise a request.', '', 'CAMPUS HELP')}
    <div class="flex gap-2.5 overflow-x-auto pb-2 mb-6">${tabs.map(t => `<button type="button" data-action="set-faq" data-cat="${t}" class="shrink-0 rounded-full px-5 py-2.5 text-sm font-bold transition-all ${ui.faqCat === t ? 'bg-[#a3ff12] text-[#0c0f0a] shadow-[0_4px_20px_rgba(163,255,18,0.35)]' : 'bg-white/[0.04] border border-white/10 text-gray-300 hover:text-white hover:border-[#a3ff12]/30'}">${t}</button>`).join('')}</div>
    <div class="grid gap-3.5 max-w-3xl">${FAQ[ui.faqCat].map(([q, a]) => `<details class="bg-card rounded-2xl p-5 md:p-6 border border-white/10 hover:border-[#a3ff12]/40 transition group"><summary class="flex items-center justify-between gap-4 font-bold text-white text-base md:text-lg cursor-pointer">${q}<i data-lucide="chevron-down" class="chev w-5 h-5 text-[#a3ff12] shrink-0 transition-transform"></i></summary><p class="text-gray-400 mt-3.5 leading-relaxed text-sm md:text-base border-t border-white/5 pt-3">${a}</p></details>`).join('')}</div>
    <div class="bg-card rounded-3xl p-6 sm:p-8 mt-10 max-w-3xl flex flex-wrap items-center justify-between gap-6 border border-white/10 shadow-xl"><div><div class="font-bold text-xl text-white">Did not find your answer?</div><p class="text-sm text-gray-400 mt-1">Raise a request and our dedicated team will resolve it.</p></div><a href="#/report" class="btn-primary"><i data-lucide="plus" class="w-4 h-4 stroke-[2.5]"></i>Report an issue</a></div>`;
  }

  function pageDirectory() {
    return `${heading('Directory & emergency', 'Find the right office or call for urgent help.', '', 'CAMPUS CONTACTS')}
    <div class="rounded-3xl bg-red-950/25 border border-red-500/30 p-6 sm:p-8 mb-8 backdrop-blur-xl relative overflow-hidden shadow-2xl">
      <div class="font-bold text-red-300 flex items-center gap-2 mb-4 font-mono text-xs uppercase tracking-wider"><span class="w-2 h-2 rounded-full bg-red-500 animate-ping"></span><i data-lucide="siren" class="w-4 h-4"></i>Immediate Emergency Numbers</div>
      <div class="grid grid-cols-2 md:grid-cols-4 gap-3.5">${EMERGENCY.map(e => `<a href="tel:${e.phone.replace(/\s/g, '')}" class="bg-[#0e130c]/80 rounded-2xl p-5 border border-red-500/20 hover:border-red-400 hover:shadow-[0_8px_24px_rgba(239,68,68,0.25)] transition group"><div class="text-xs text-gray-400 font-medium">${e.name}</div><div class="font-mono font-extrabold text-lg sm:text-xl mt-1 text-white group-hover:text-red-300 transition-colors">${e.phone}</div></a>`).join('')}</div></div>
    <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-5">${CONTACTS.map(c => `<div class="bg-card rounded-3xl p-6 md:p-7 border border-white/10 hover:border-[#a3ff12]/40 hover:-translate-y-1 hover:shadow-[0_16px_40px_rgba(0,0,0,0.4)] transition-all group">
      <span class="w-12 h-12 rounded-2xl bg-[#a3ff12]/15 border border-[#a3ff12]/30 flex items-center justify-center mb-5 text-[#a3ff12] group-hover:scale-110 transition-transform"><i data-lucide="${c.icon}" class="w-6 h-6"></i></span>
      <div class="font-bold text-xl text-white">${c.name}</div>
      <div class="text-sm text-gray-400 mt-2 flex items-center gap-2"><i data-lucide="map-pin" class="w-4 h-4 text-[#a3ff12]"></i>${c.place}</div>
      <div class="text-sm text-gray-400 mt-1.5 flex items-center gap-2"><i data-lucide="clock" class="w-4 h-4 text-gray-400"></i>${c.hours}</div>
      <a href="tel:${c.phone.replace(/\s/g, '')}" class="btn-ghost mt-6 !py-2.5 text-sm w-full justify-center group-hover:border-[#a3ff12]"><i data-lucide="phone" class="w-4 h-4 text-[#a3ff12]"></i>${c.phone}</a></div>`).join('')}</div>`;
  }

  function pageStaff() {
    if (!isStaff()) {
      return `<div class="max-w-md mx-auto bg-card rounded-3xl p-8 sm:p-10 border border-white/10 backdrop-blur-xl shadow-2xl my-8 text-center">
        <span class="w-14 h-14 rounded-2xl bg-[#a3ff12]/15 border border-[#a3ff12]/30 flex items-center justify-center mb-5 mx-auto text-[#a3ff12] shadow-[0_0_24px_rgba(163,255,18,0.25)]"><i data-lucide="lock-keyhole" class="w-7 h-7"></i></span>
        <div class="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-[#a3ff12] mb-2 font-semibold">// RESTRICTED</div>
        <h1 class="text-2xl sm:text-3xl font-extrabold text-white">Staff Portal</h1>
        <p class="text-gray-400 mt-1 mb-6 text-sm">Enter the staff PIN to manage tickets and updates. <span class="text-[#a1a89c] font-mono">(Demo PIN: 1234)</span></p>
        <form id="staff-login-form" data-submit="staff-login-submit" class="space-y-4">
          <input id="pin" type="password" inputmode="numeric" aria-describedby="pin-err" class="field text-center tracking-widest text-lg font-mono" placeholder="••••" autocomplete="off">
          <p id="pin-err" role="alert" aria-live="polite" class="hidden text-red-400 text-sm font-medium">Incorrect PIN.</p>
          <button type="submit" class="btn-primary w-full !py-3.5 font-bold">Sign In</button>
        </form></div>`;
    }
    const c = counts();
    const max = Math.max(1, ...CATEGORIES.map(k => tickets.filter(t => t.category === k.name).length));
    const resolvedT = tickets.filter(t => t.status === 'Resolved');
    const avgMins = resolvedT.length ? Math.round(resolvedT.reduce((s, t) => s + (new Date(t.timeline[t.timeline.length - 1].at) - new Date(t.createdAt)), 0) / resolvedT.length / 60000) : 0;

    // CSAT calculation
    const ratedT = tickets.filter(t => typeof t.rating === 'number' && t.rating > 0);
    const avgCsat = ratedT.length ? (ratedT.reduce((acc, t) => acc + t.rating, 0) / ratedT.length).toFixed(1) : '5.0';

    const stat = (l, v, cl) => `<div class="bg-card rounded-3xl p-6 border border-white/10 hover:border-[#a3ff12]/30 transition"><div class="text-xs uppercase tracking-wider text-gray-400 font-mono">${l}</div><div class="text-3xl sm:text-4xl font-extrabold mt-2 font-['Outfit'] ${cl}">${v}</div></div>`;
    const queue = tickets.filter(t => ui.staffFilter === 'ALL' || t.status === ui.staffFilter).sort((a, b) => ({ Urgent: 0, High: 1, Medium: 2, Low: 3 }[a.priority]) - ({ Urgent: 0, High: 1, Medium: 2, Low: 3 }[b.priority]));

    return `${heading('Staff dashboard', 'Manage the queue, assign technicians, and track resolution metrics.', `<div class="flex gap-2.5 flex-wrap"><button type="button" data-action="export-csv" class="btn-ghost !py-2.5 !px-4 text-sm"><i data-lucide="download" class="w-4 h-4 text-[#a3ff12]"></i>Export CSV</button><button type="button" data-action="staff-logout" class="btn-ghost !py-2.5 !px-4 text-sm"><i data-lucide="log-out" class="w-4 h-4 text-gray-400"></i>Sign out</button></div>`, 'MANAGEMENT')}
    <div class="grid grid-cols-2 lg:grid-cols-5 gap-4">
      ${stat('Needs action (Open)', c.open, 'text-amber-300')}
      ${stat('In progress', c.prog, 'text-[#a3ff12]')}
      ${stat('Resolved', c.done, 'text-emerald-300')}
      ${stat('Avg. resolution', avgMins >= 60 ? Math.round(avgMins / 60) + 'h' : avgMins + 'm', 'text-white')}
      ${stat('Student CSAT', `${avgCsat} ★`, 'text-amber-300')}
    </div>
    <div class="grid lg:grid-cols-3 gap-6 mt-6">
      <div class="bg-card rounded-3xl p-6 border border-white/10">
        <div class="font-bold text-lg text-white mb-5 flex items-center justify-between"><span>By Category</span><span class="text-xs font-mono text-[#a3ff12]">// TOTAL</span></div>
        <div class="space-y-4">${CATEGORIES.map(k => { const n = tickets.filter(t => t.category === k.name).length; return `<div><div class="flex justify-between text-sm mb-1.5"><span class="text-gray-300">${k.name}</span><span class="font-bold text-white font-mono">${n}</span></div><div class="h-2 rounded-full bg-white/10 overflow-hidden"><div class="h-2 rounded-full bg-[#a3ff12] shadow-[0_0_8px_rgba(163,255,18,0.6)]" style="width:${(n / max) * 100}%"></div></div></div>`; }).join('')}</div>
      </div>
      <div class="lg:col-span-2">
        <div class="flex gap-2.5 overflow-x-auto pb-2 mb-4">${['ALL', ...STATUSES].map(s => `<button type="button" data-action="set-staff-filter" data-status="${s}" class="shrink-0 rounded-full px-5 py-2 text-sm font-bold transition-all ${ui.staffFilter === s ? 'bg-[#a3ff12] text-[#0c0f0a] shadow-[0_4px_20px_rgba(163,255,18,0.35)]' : 'bg-white/[0.04] border border-white/10 text-gray-300 hover:text-white'}">${s === 'ALL' ? 'All' : s}</button>`).join('')}</div>
        <div class="grid gap-3.5">${queue.map(t => {
      const sla = getSlaInfo(t);
      return `<div class="bg-card rounded-2xl p-5 border border-white/10 hover:border-[#a3ff12]/40 transition flex flex-col gap-3.5">
            <div class="flex flex-col sm:flex-row sm:items-center gap-3 justify-between">
              <a href="#/ticket/${t.id}" class="min-w-0 flex-1 group">
                <div class="flex items-center gap-2 mb-1.5 flex-wrap">
                  <span class="font-mono text-xs text-[#a3ff12] bg-[#a3ff12]/10 border border-[#a3ff12]/25 px-2 py-0.5 rounded font-bold">${t.id}</span>
                  ${prioChip(t.priority)}
                  <span class="sla-pill ${sla.cls}"><i data-lucide="${sla.icon}" class="w-3 h-3"></i>${sla.text}</span>
                  ${t.rating ? `<span class="text-xs text-amber-300 font-bold">★ ${t.rating}.0</span>` : ''}
                </div>
                <div class="font-bold text-white group-hover:text-[#a3ff12] transition-colors truncate">${esc(t.title)}</div>
                <div class="text-xs text-gray-400 mt-1 truncate">${esc(t.location)} · ${esc(t.contactName)}</div>
              </a>
              <div class="flex flex-col sm:flex-row gap-2 shrink-0">
                <select class="field !w-full sm:!w-44 !py-2 text-xs" data-change="assign-ticket" data-id="${t.id}" title="Assign Technician">
                  ${TECHNICIANS.map(tech => `<option value="${tech}" ${t.assignee === tech ? 'selected' : ''}>${tech.split(' ')[0]}</option>`).join('')}
                </select>
                <select class="field !w-full sm:!w-36 !py-2 text-xs" data-change="set-ticket-status" data-id="${t.id}">
                  ${STATUSES.map(s => `<option ${t.status === s ? 'selected' : ''}>${s}</option>`).join('')}
                </select>
              </div>
            </div>
          </div>`;
    }).join('') || '<div class="bg-card rounded-3xl p-10 text-center text-gray-400 border border-white/10">No tickets in this view.</div>'}</div>
      </div>
    </div>`;
  }

  /* ============ PAGE: LOGIN & SUPABASE CLOUD MANAGEMENT ============ */
  const SQL_SCHEMA_SNIPPET = `-- Unidesk Campus Helpdesk: Supabase SQL Table Schema & RLS Policies
CREATE TABLE IF NOT EXISTS public.tickets (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  department TEXT,
  priority TEXT NOT NULL DEFAULT 'Medium',
  location TEXT NOT NULL,
  contact_name TEXT,
  description TEXT NOT NULL,
  upvotes INTEGER DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'Open',
  created_at TIMESTAMPTZ DEFAULT now(),
  timeline JSONB DEFAULT '[]'::jsonb,
  assignee TEXT DEFAULT 'Unassigned',
  comments JSONB DEFAULT '[]'::jsonb,
  rating INTEGER,
  feedback JSONB,
  image TEXT
);

-- Enable Row Level Security and allow public read/write
ALTER TABLE public.tickets ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public access for tickets" ON public.tickets;
CREATE POLICY "Public access for tickets" ON public.tickets FOR ALL USING (true) WITH CHECK (true);`;

  const GOOGLE_ICON_SVG = `<svg class="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24" aria-hidden="true">
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
  </svg>`;

  function renderSignInForm(isSupa) {
    const defaultEmail = ui.authRole === 'staff' ? 'staff@unidesk.edu' : 'student@campus.edu';
    return `
      <!-- Google Sign In Button -->
      <button type="button" data-action="google-login"
        class="w-full py-3.5 px-5 rounded-2xl bg-white/[0.06] hover:bg-white/[0.12] border border-white/15 hover:border-[#a3ff12]/40 text-white font-semibold transition-all flex items-center justify-center gap-3 shadow-[0_4px_20px_rgba(0,0,0,0.3)] hover:shadow-[0_8px_30px_rgba(163,255,18,0.15)] group focus:outline-none focus:ring-2 focus:ring-[#a3ff12] cursor-pointer">
        ${GOOGLE_ICON_SVG}
        <span class="group-hover:text-white transition-colors">Continue with Google</span>
      </button>

      <div class="text-center mt-2.5">
        <button type="button" data-action="open-google-modal" class="text-[11px] font-mono text-gray-400 hover:text-[#a3ff12] transition-colors inline-flex items-center gap-1.5 cursor-pointer">
          <i data-lucide="settings" class="w-3 h-3"></i>
          <span>Backend OAuth Setup &amp; Callback URI</span>
        </button>
      </div>

      <div class="relative flex items-center justify-center my-6">
        <div class="border-t border-white/10 w-full"></div>
        <span class="bg-[#10160e] px-3 text-xs uppercase font-mono text-gray-400 absolute">or sign in with email</span>
      </div>

      <form id="signin-form" data-submit="signin-submit" class="space-y-4">
        <div>
          <label for="auth-email" class="block text-xs uppercase font-mono text-gray-400 mb-1.5 font-semibold">Campus Email Address</label>
          <div class="relative">
            <input id="auth-email" type="email" required class="field !pl-11" placeholder="${defaultEmail}" autocomplete="email">
            <i data-lucide="mail" class="w-4 h-4 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none"></i>
          </div>
        </div>

        <div>
          <div class="flex items-center justify-between mb-1.5">
            <label for="auth-password" class="block text-xs uppercase font-mono text-gray-400 font-semibold">Password</label>
          </div>
          <div class="relative">
            <input id="auth-password" type="password" required class="field !pl-11 !pr-11" placeholder="••••••••" autocomplete="current-password">
            <i data-lucide="lock" class="w-4 h-4 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none"></i>
            <button type="button" data-action="toggle-pass-vis" data-target="auth-password" class="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white p-1" aria-label="Toggle password visibility">
              <i data-lucide="eye" class="w-4 h-4"></i>
            </button>
          </div>
        </div>

        <div class="flex items-center justify-between text-xs pt-1">
          <label class="flex items-center gap-2 cursor-pointer text-gray-300 select-none">
            <input id="auth-remember" type="checkbox" checked class="w-4 h-4 rounded border-white/20 bg-black/40 text-[#a3ff12] focus:ring-[#a3ff12]">
            <span>Keep me signed in</span>
          </label>
          <a href="#/help" class="text-gray-400 hover:text-[#a3ff12] transition-colors">Need help?</a>
        </div>

        <p id="auth-err" role="alert" aria-live="polite" class="hidden text-red-400 text-sm font-medium bg-red-500/10 border border-red-500/20 rounded-xl p-3"></p>

        <button type="submit" id="auth-submit-btn" class="btn-primary w-full !py-3.5 font-bold shadow-[0_8px_30px_rgba(163,255,18,0.3)] mt-2">
          <i data-lucide="log-in" class="w-4 h-4 stroke-[2.5]"></i>
          <span>Sign In as ${ui.authRole === 'staff' ? 'Campus Staff' : 'Student'}</span>
        </button>
      </form>
    `;
  }

  function renderSignUpForm(isSupa) {
    const isStaff = ui.authRole === 'staff';
    return `
      <!-- Google Sign Up Button -->
      <button type="button" data-action="google-login"
        class="w-full py-3.5 px-5 rounded-2xl bg-white/[0.06] hover:bg-white/[0.12] border border-white/15 hover:border-[#a3ff12]/40 text-white font-semibold transition-all flex items-center justify-center gap-3 shadow-[0_4px_20px_rgba(0,0,0,0.3)] hover:shadow-[0_8px_30px_rgba(163,255,18,0.15)] group focus:outline-none focus:ring-2 focus:ring-[#a3ff12] cursor-pointer">
        ${GOOGLE_ICON_SVG}
        <span class="group-hover:text-white transition-colors">Sign up with Google</span>
      </button>

      <div class="text-center mt-2.5">
        <button type="button" data-action="open-google-modal" class="text-[11px] font-mono text-gray-400 hover:text-[#a3ff12] transition-colors inline-flex items-center gap-1.5 cursor-pointer">
          <i data-lucide="settings" class="w-3 h-3"></i>
          <span>Backend OAuth Setup &amp; Callback URI</span>
        </button>
      </div>

      <div class="relative flex items-center justify-center my-6">
        <div class="border-t border-white/10 w-full"></div>
        <span class="bg-[#10160e] px-3 text-xs uppercase font-mono text-gray-400 absolute">or create with email</span>
      </div>

      <form id="signup-form" data-submit="signup-submit" class="space-y-4">
        <div>
          <label for="reg-name" class="block text-xs uppercase font-mono text-gray-400 mb-1.5 font-semibold">Full Name</label>
          <div class="relative">
            <input id="reg-name" type="text" required class="field !pl-11" placeholder="${isStaff ? 'e.g. Vikram Singh' : 'e.g. Ananya Sen'}" autocomplete="name">
            <i data-lucide="user" class="w-4 h-4 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none"></i>
          </div>
        </div>

        <div>
          <label for="reg-email" class="block text-xs uppercase font-mono text-gray-400 mb-1.5 font-semibold">${isStaff ? 'Official Staff Email' : 'Student Email'}</label>
          <div class="relative">
            <input id="reg-email" type="email" required class="field !pl-11" placeholder="${isStaff ? 'v.singh@unidesk.edu' : 'ananya.s@campus.edu'}" autocomplete="email">
            <i data-lucide="mail" class="w-4 h-4 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none"></i>
          </div>
        </div>

        <div>
          <label for="reg-dept" class="block text-xs uppercase font-mono text-gray-400 mb-1.5 font-semibold">${isStaff ? 'Campus Department' : 'Hostel Block / Department'}</label>
          <div class="relative">
            <input id="reg-dept" type="text" class="field !pl-11" placeholder="${isStaff ? 'e.g. IT & Network Support' : 'e.g. Tech Block A, Room 304'}">
            <i data-lucide="building-2" class="w-4 h-4 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none"></i>
          </div>
        </div>

        <div>
          <label for="reg-password" class="block text-xs uppercase font-mono text-gray-400 mb-1.5 font-semibold">Create Password (min. 6 characters)</label>
          <div class="relative">
            <input id="reg-password" type="password" required minlength="6" class="field !pl-11 !pr-11" placeholder="••••••••" autocomplete="new-password">
            <i data-lucide="lock" class="w-4 h-4 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none"></i>
            <button type="button" data-action="toggle-pass-vis" data-target="reg-password" class="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white p-1" aria-label="Toggle password visibility">
              <i data-lucide="eye" class="w-4 h-4"></i>
            </button>
          </div>
        </div>

        <p id="reg-err" role="alert" aria-live="polite" class="hidden text-red-400 text-sm font-medium bg-red-500/10 border border-red-500/20 rounded-xl p-3"></p>

        <button type="submit" id="reg-submit-btn" class="btn-primary w-full !py-3.5 font-bold shadow-[0_8px_30px_rgba(163,255,18,0.3)] mt-2">
          <i data-lucide="user-plus" class="w-4 h-4 stroke-[2.5]"></i>
          <span>Create ${isStaff ? 'Staff' : 'Student'} Account</span>
        </button>
      </form>
    `;
  }

  function pageLogin(params) {
    const user = getAuthUser();
    const isStaffRole = user && user.role === 'staff';

    if (user) {
      const userTickets = tickets.filter(t => (t.contactName && t.contactName.toLowerCase() === user.name.toLowerCase()));
      const openUserTickets = userTickets.filter(t => t.status !== 'Resolved').length;
      const initials = (user.name || 'User')
        .split(' ')
        .map(w => w[0])
        .slice(0, 2)
        .join('')
        .toUpperCase();

      return `
        <div class="max-w-4xl mx-auto space-y-8">
          ${heading('My Account', 'Manage your student profile, view your reported issues, and track resolutions in real-time.', '', 'CAMPUS PORTAL')}

          <!-- User Profile Card -->
          <div class="bg-card rounded-3xl p-6 sm:p-10 border border-white/10 backdrop-blur-xl relative overflow-hidden">
            <div class="absolute -right-16 -top-16 w-56 h-56 rounded-full bg-[#a3ff12]/5 blur-3xl pointer-events-none"></div>

            <div class="flex flex-col sm:flex-row items-center sm:items-start gap-6 relative z-10">
              ${user.avatar ? `
                <img src="${sanitize(user.avatar)}" alt="${sanitize(user.name)}" class="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl border-2 border-[#a3ff12]/50 object-cover shadow-[0_0_30px_rgba(163,255,18,0.25)] flex-shrink-0" referrerpolicy="no-referrer">
              ` : `
                <div class="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-gradient-to-br from-[#a3ff12]/20 to-white/5 border-2 border-[#a3ff12]/40 flex items-center justify-center font-extrabold text-2xl sm:text-3xl text-[#a3ff12] shadow-[0_0_30px_rgba(163,255,18,0.25)] flex-shrink-0">
                  ${initials}
                </div>
              `}

              <div class="flex-1 text-center sm:text-left">
                <div class="flex flex-wrap items-center justify-center sm:justify-start gap-2.5 mb-2">
                  <h2 class="text-2xl sm:text-3xl font-extrabold text-white">${sanitize(user.name)}</h2>
                  <span class="chip ${isStaffRole ? 'bg-amber-400/20 text-amber-300 border-amber-400/40' : 'bg-[#a3ff12]/15 text-[#a3ff12] border-[#a3ff12]/30'}">
                    <i data-lucide="${isStaffRole ? 'shield-check' : 'graduation-cap'}" class="w-3.5 h-3.5"></i>
                    ${isStaffRole ? 'Campus Staff Lead' : 'Student Account'}
                  </span>
                  ${user.provider === 'google' ? `
                    <span class="chip bg-blue-500/15 text-blue-300 border border-blue-500/30 font-medium">
                      ${GOOGLE_ICON_SVG}
                      <span>Google Verified</span>
                    </span>
                  ` : ''}
                </div>

                <p class="text-gray-300 text-sm font-mono flex items-center justify-center sm:justify-start gap-2 mb-3">
                  <i data-lucide="mail" class="w-4 h-4 text-[#a3ff12]"></i>
                  <span>${sanitize(user.email)}</span>
                </p>

                <div class="flex flex-wrap items-center justify-center sm:justify-start gap-2 text-xs">
                  <span class="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-gray-300 flex items-center gap-1.5">
                    <i data-lucide="building-2" class="w-3.5 h-3.5 text-[#a3ff12]"></i>
                    ${sanitize(user.department || (isStaffRole ? 'Campus Facilities & IT' : 'Residential Hostels'))}
                  </span>
                  <span class="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 flex items-center gap-1.5 font-mono">
                    <span class="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                    Supabase Cloud Connected
                  </span>
                </div>
              </div>

              <div class="flex flex-col gap-2 w-full sm:w-auto">
                <button type="button" data-action="auth-logout" class="btn-ghost !border-red-500/30 text-red-400 hover:!border-red-400 hover:!text-red-300 hover:!bg-red-500/10 !py-2.5 !px-5 text-sm font-semibold justify-center">
                  <i data-lucide="log-out" class="w-4 h-4"></i>
                  <span>Sign Out</span>
                </button>
              </div>
            </div>

            <!-- Profile Metric Highlights -->
            <div class="grid grid-cols-2 sm:grid-cols-4 gap-3.5 mt-8 pt-6 border-t border-white/10">
              <div class="p-4 rounded-2xl bg-white/[0.03] border border-white/5 text-center">
                <span class="text-xs uppercase font-mono text-gray-400 tracking-wider block mb-1">My Reports</span>
                <span class="text-2xl font-extrabold text-white">${userTickets.length}</span>
              </div>
              <div class="p-4 rounded-2xl bg-white/[0.03] border border-white/5 text-center">
                <span class="text-xs uppercase font-mono text-gray-400 tracking-wider block mb-1">Active Issues</span>
                <span class="text-2xl font-extrabold text-[#a3ff12]">${openUserTickets}</span>
              </div>
              <div class="p-4 rounded-2xl bg-white/[0.03] border border-white/5 text-center">
                <span class="text-xs uppercase font-mono text-gray-400 tracking-wider block mb-1">Campus Total</span>
                <span class="text-2xl font-extrabold text-white">${tickets.length}</span>
              </div>
              <div class="p-4 rounded-2xl bg-white/[0.03] border border-white/5 text-center">
                <span class="text-xs uppercase font-mono text-gray-400 tracking-wider block mb-1">Resolved</span>
                <span class="text-2xl font-extrabold text-emerald-400">${tickets.filter(t => t.status === 'Resolved').length}</span>
              </div>
            </div>

            <!-- Quick Navigation CTAs -->
            <div class="flex flex-wrap gap-3 mt-6 pt-4 border-t border-white/10">
              ${isStaffRole ? `
                <a href="#/staff" class="btn-primary flex-1 sm:flex-initial">
                  <i data-lucide="shield-check" class="w-4 h-4"></i>
                  <span>Open Staff Portal</span>
                </a>
                <a href="#/requests" class="btn-ghost flex-1 sm:flex-initial">
                  <i data-lucide="list-checks" class="w-4 h-4"></i>
                  <span>All Campus Tickets</span>
                </a>
              ` : `
                <a href="#/report" class="btn-primary flex-1 sm:flex-initial">
                  <i data-lucide="plus" class="w-4 h-4"></i>
                  <span>Report New Campus Issue</span>
                </a>
                <a href="#/requests" class="btn-ghost flex-1 sm:flex-initial">
                  <i data-lucide="list-checks" class="w-4 h-4"></i>
                  <span>Track Campus Requests</span>
                </a>
              `}
            </div>
          </div>
        </div>
      `;
    }

    // User is logged out: show clean sign-in view with Google Auth + Role tabs + Demo quick logins
    return `
      <div class="max-w-xl mx-auto space-y-6">
        ${heading('Sign In to Unidesk', 'Welcome back. Sign in with Google or your campus credentials to report and track issues.', '', 'CAMPUS ACCESS')}

        <!-- Main Auth Form Container -->
        <div class="bg-card rounded-3xl p-6 sm:p-8 border border-white/10 backdrop-blur-xl shadow-2xl relative">
          <!-- Role Selector Tabs -->
          <div class="flex p-1.5 rounded-2xl bg-black/40 border border-white/10 mb-6">
            <button type="button" data-action="set-auth-role" data-role="student"
              class="flex-1 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-2 ${ui.authRole === 'student' ? 'bg-[#a3ff12] text-[#0c0f0a] shadow-[0_0_15px_rgba(163,255,18,0.4)]' : 'text-gray-400 hover:text-white'}">
              <i data-lucide="graduation-cap" class="w-4 h-4"></i>
              <span>Student Portal</span>
            </button>
            <button type="button" data-action="set-auth-role" data-role="staff"
              class="flex-1 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-2 ${ui.authRole === 'staff' ? 'bg-[#a3ff12] text-[#0c0f0a] shadow-[0_0_15px_rgba(163,255,18,0.4)]' : 'text-gray-400 hover:text-white'}">
              <i data-lucide="shield-check" class="w-4 h-4"></i>
              <span>Campus Staff &amp; Ops</span>
            </button>
          </div>

          <!-- Auth Mode Toggle (Sign In vs Register) -->
          <div class="flex items-center justify-between pb-4 mb-6 border-b border-white/10">
            <div class="flex gap-4">
              <button type="button" data-action="set-auth-tab" data-tab="signin"
                class="text-base font-bold pb-1 transition-colors relative ${ui.authTab === 'signin' ? 'text-white border-b-2 border-[#a3ff12]' : 'text-gray-400 hover:text-gray-200'}">
                Sign In
              </button>
              <button type="button" data-action="set-auth-tab" data-tab="signup"
                class="text-base font-bold pb-1 transition-colors relative ${ui.authTab === 'signup' ? 'text-white border-b-2 border-[#a3ff12]' : 'text-gray-400 hover:text-gray-200'}">
                Create Account
              </button>
            </div>
            <span class="text-xs font-mono text-[#a3ff12] flex items-center gap-1">
              <span class="w-1.5 h-1.5 rounded-full bg-[#a3ff12] animate-pulse"></span>
              Supabase Cloud
            </span>
          </div>

          ${ui.authTab === 'signin' ? renderSignInForm(true) : renderSignUpForm(true)}
        </div>

        <!-- Fast 1-Click Demo Login Shortcuts -->
        <div class="bg-card rounded-3xl p-5 border border-white/10 backdrop-blur-xl">
          <div class="flex items-center gap-2 mb-3">
            <span class="w-2 h-2 rounded-full bg-[#a3ff12] animate-ping"></span>
            <span class="font-mono text-xs uppercase tracking-wider text-[#a3ff12] font-semibold">// Fast Demo Accounts (1-Click)</span>
          </div>
          <div class="grid sm:grid-cols-2 gap-3">
            <button type="button" data-action="demo-login" data-role="student"
              class="p-3 rounded-2xl bg-white/[0.04] hover:bg-[#a3ff12]/10 border border-white/10 hover:border-[#a3ff12]/40 transition-all flex items-center gap-3 text-left group">
              <span class="w-9 h-9 rounded-xl bg-[#a3ff12]/15 text-[#a3ff12] flex items-center justify-center font-bold flex-shrink-0 group-hover:scale-105 transition-transform">
                <i data-lucide="graduation-cap" class="w-4 h-4"></i>
              </span>
              <div class="min-w-0">
                <div class="text-xs font-bold text-white group-hover:text-[#a3ff12] transition-colors truncate">Demo Student</div>
                <div class="text-[11px] text-gray-400 truncate">Rohan Verma · Aryabhatta</div>
              </div>
            </button>
            <button type="button" data-action="demo-login" data-role="staff"
              class="p-3 rounded-2xl bg-white/[0.04] hover:bg-amber-400/10 border border-white/10 hover:border-amber-400/40 transition-all flex items-center gap-3 text-left group">
              <span class="w-9 h-9 rounded-xl bg-amber-400/15 text-amber-300 flex items-center justify-center font-bold flex-shrink-0 group-hover:scale-105 transition-transform">
                <i data-lucide="shield-check" class="w-4 h-4"></i>
              </span>
              <div class="min-w-0">
                <div class="text-xs font-bold text-white group-hover:text-amber-300 transition-colors truncate">Demo Staff Lead</div>
                <div class="text-[11px] text-gray-400 truncate">Rajesh Kumar · IT Lead</div>
              </div>
            </button>
          </div>
        </div>
      </div>
    `;
  }

  /* ---------- zen scroll-linked animation ---------- */
  let zenScrollCleanup = null;
  function initZenScrollAnimation() {
    if (zenScrollCleanup) { zenScrollCleanup(); zenScrollCleanup = null; }
    const track = document.querySelector('.about-scroll-track');
    const about = document.getElementById('about');
    const services = document.getElementById('services');
    const statement = document.getElementById('about-statement');
    const words = Array.from(document.querySelectorAll('.about-word:not(.highlight)'));
    if (!track || !about || !services) return;

    const clamp = v => Math.max(0, Math.min(1, v));

    let reqId = 0;
    let currProgress = 0;
    let targetProgress = 0;

    function onResize() {
      const vh = window.innerHeight || 800;
      const aboutH = about.offsetHeight || vh;
      track.style.setProperty('--about-height', `${aboutH}px`);
      services.style.marginTop = `-${aboutH}px`;
      const focusDistance = Math.round(vh * 0.65);
      track.style.minHeight = `${aboutH + focusDistance + vh}px`;
      update();
    }

    function update() {
      reqId = 0;
      const trackRect = track.getBoundingClientRect();
      const vh = window.innerHeight || 800;
      const focusDistance = Math.round(vh * 0.65);
      const totalScrollDistance = focusDistance + vh;
      if (totalScrollDistance <= 0) return;

      // Merge Hero and About sections with scroll parallax & optical blur
      const hero = document.querySelector('.zen-hero');
      const heroContent = document.querySelector('.zen-hero-content');
      const prefersReduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (hero && heroContent && !prefersReduced) {
        const sy = window.scrollY || window.pageYOffset || 0;
        const heroH = hero.offsetHeight || vh;
        const heroProgress = clamp(sy / (heroH * 0.75));
        if (heroProgress > 0) {
          const ep = heroProgress * heroProgress;
          heroContent.style.transform = `translateY(${(sy * 0.22).toFixed(1)}px) scale(${(1 - 0.045 * ep).toFixed(4)})`;
          heroContent.style.opacity = (1 - 0.8 * ep).toFixed(3);
          heroContent.style.filter = `blur(${(ep * 6).toFixed(1)}px)`;
        } else {
          heroContent.style.transform = '';
          heroContent.style.opacity = '';
          heroContent.style.filter = '';
        }
      }

      const scrolledInTrack = -trackRect.top;
      targetProgress = clamp(scrolledInTrack / totalScrollDistance);

      currProgress += (targetProgress - currProgress) * 0.28;
      if (Math.abs(targetProgress - currProgress) < 0.0008) currProgress = targetProgress;

      const p = currProgress;
      const focusEnd = focusDistance / totalScrollDistance;

      if (words.length) {
        const textP = clamp(p / (focusEnd * 0.88));
        const activeCount = Math.ceil(textP * words.length);

        words.forEach((w, idx) => {
          const isActive = idx < activeCount;
          w.classList.toggle('active', isActive);

          if (isActive) {
            w.style.filter = 'blur(0px)';
            w.style.opacity = '1';
            w.style.transform = 'translateY(0) scale(1)';
          } else {
            const dist = idx - activeCount;
            const blurVal = Math.min(14, 3.5 + dist * 1.6);
            w.style.filter = `blur(${blurVal.toFixed(1)}px)`;
            w.style.opacity = Math.max(0.14, (0.24 - dist * 0.018)).toFixed(2);
            w.style.transform = `translateY(${Math.min(12, 3 + dist * 1.3).toFixed(1)}px) scale(0.96)`;
          }
        });
      }

      if (p <= focusEnd) {
        about.style.opacity = '1';
        about.style.transform = 'none';
        about.style.filter = 'none';
      } else {
        const wipeProgress = clamp((p - focusEnd) / (1 - focusEnd));
        const eased = wipeProgress * wipeProgress * (3 - 2 * wipeProgress);

        about.style.opacity = (1 - eased * 0.45).toFixed(3);
        about.style.transform = `scale(${(1 - 0.045 * eased).toFixed(4)}) translateY(${(-32 * eased).toFixed(1)}px)`;
        about.style.filter = `blur(${(eased * 10).toFixed(1)}px)`;
      }

      if (Math.abs(targetProgress - currProgress) >= 0.0008) {
        reqId = requestAnimationFrame(update);
      }
    }

    function onScroll() {
      if (!reqId) reqId = requestAnimationFrame(update);
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onResize);
    const ro = new ResizeObserver(onResize);
    ro.observe(about);
    ro.observe(track);
    onResize();

    zenScrollCleanup = () => {
      if (reqId) cancelAnimationFrame(reqId);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onResize);
      ro.disconnect();
      if (about) {
        about.style.opacity = '';
        about.style.transform = '';
        about.style.filter = '';
      }
      if (services) {
        services.style.marginTop = '';
      }
      if (track) {
        track.style.minHeight = '';
      }
      const hc = document.querySelector('.zen-hero-content');
      if (hc) {
        hc.style.transform = '';
        hc.style.opacity = '';
        hc.style.filter = '';
      }
      words.forEach(w => {
        w.style.filter = '';
        w.style.opacity = '';
        w.style.transform = '';
      });
    };
  }

  /* ---------- router ---------- */
  function render() {
    const raw = location.hash.slice(1) || '/';
    const [path, qs] = raw.split('?');
    const params = new URLSearchParams(qs || '');
    renderNav(path);
    document.body.classList.add('zen');
    document.body.classList.toggle('light-mode', currentTheme === 'light');
    document.documentElement.classList.toggle('light-mode', currentTheme === 'light');
    let html;
    if (path === '/') html = pageHome();
    else if (path === '/report') html = `<div class="zen-page-wrap">${pageReport(params)}</div>`;
    else if (path === '/requests') html = `<div class="zen-page-wrap">${pageRequests()}</div>`;
    else if (path.startsWith('/ticket/')) html = `<div class="zen-page-wrap">${pageTicket(decodeURIComponent(path.split('/')[2]))}</div>`;
    else if (path === '/help') html = `<div class="zen-page-wrap">${pageHelp()}</div>`;
    else if (path === '/directory') html = `<div class="zen-page-wrap">${pageDirectory()}</div>`;
    else if (path === '/staff') html = `<div class="zen-page-wrap">${pageStaff()}</div>`;
    else if (path === '/login') html = `<div class="zen-page-wrap">${pageLogin(params)}</div>`;
    else html = `<div class="zen-page-wrap text-center py-24"><div class="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-[#a3ff12] mb-3 font-semibold">// 404 ERROR</div><h1 class="text-4xl font-extrabold text-white">Page not found</h1><p class="text-gray-400 mt-2">The route you requested doesn't exist.</p><a href="#/" class="btn-primary mt-6 inline-flex">Go Home</a></div>`;
    
    const appEl = $('app');
    if (appEl) appEl.innerHTML = `<div class="page">${html}</div>`;
    if (path === '/requests') renderRequestList();
    window.scrollTo(0, 0);
    lucide.createIcons();
    if (path === '/') initZenScrollAnimation();
    else if (zenScrollCleanup) { zenScrollCleanup(); zenScrollCleanup = null; }
  }
  const refresh = () => { const y = scrollY; render(); scrollTo(0, y); };

  /* ============ LIGHTBOX FOCUS TRAP ============ */
  let lastFocusedElement = null;

  function openImageModal(src) {
    const modal = $('img-modal');
    const img = $('img-modal-src');
    const closeBtn = $('img-modal-close');
    if (modal && img) {
      lastFocusedElement = document.activeElement;
      img.src = src;
      modal.classList.remove('hidden');
      modal.classList.add('flex');
      if (closeBtn) closeBtn.focus();
      lucide.createIcons();
    }
  }

  function closeImageModal() {
    const modal = $('img-modal');
    if (modal && !modal.classList.contains('hidden')) {
      modal.classList.add('hidden');
      modal.classList.remove('flex');
      if (lastFocusedElement && typeof lastFocusedElement.focus === 'function') {
        lastFocusedElement.focus();
      }
    }
  }

  function openGoogleModal() {
    const modal = $('google-setup-modal');
    const closeBtn = $('google-setup-modal-close');
    if (modal) {
      lastFocusedElement = document.activeElement;
      modal.classList.remove('hidden');
      modal.classList.add('flex');
      if (closeBtn) closeBtn.focus();
      lucide.createIcons();
    }
  }

  function closeGoogleModal() {
    const modal = $('google-setup-modal');
    if (modal && !modal.classList.contains('hidden')) {
      modal.classList.add('hidden');
      modal.classList.remove('flex');
      if (lastFocusedElement && typeof lastFocusedElement.focus === 'function') {
        lastFocusedElement.focus();
      }
    }
  }

  /* ============ ACTIONS & PUBLIC API ============ */
  const api = {
    pickCat(n) {
      ui.draftCat = n;
      playTone('click');
      const grid = $('cat-grid');
      if (grid) grid.innerHTML = CATEGORIES.map(catBtn).join('');
      const err = $('e-cat');
      if (err) err.classList.add('hidden');
      const d = $('f-dept');
      if (d && DEPT_MAP[n]) d.value = DEPT_MAP[n];
      lucide.createIcons();
    },
    pickPrio(p) {
      ui.draftPrio = p;
      playTone('click');
      const grid = $('prio-grid');
      if (grid) grid.innerHTML = PRIORITIES.map(prioBtn).join('');
    },
    handleImageUpload(e) {
      const file = e.target.files && e.target.files[0];
      if (!file) return;
      compressImage(file, base64 => {
        ui.draftImage = base64;
        const img = $('image-preview');
        if (img) img.src = base64;
        const wrap = $('image-preview-wrap');
        if (wrap) wrap.classList.remove('hidden');
        const drop = $('image-dropzone');
        if (drop) drop.classList.add('hidden');
        playTone('click');
        lucide.createIcons();
      });
    },
    removeImage() {
      ui.draftImage = null;
      const inp = $('f-image-input');
      if (inp) inp.value = '';
      const wrap = $('image-preview-wrap');
      if (wrap) wrap.classList.add('hidden');
      const drop = $('image-dropzone');
      if (drop) drop.classList.remove('hidden');
      playTone('click');
    },
    zoomImage(src) {
      openImageModal(src);
    },
    onReportTyping() {
      const title = $('f-title') ? $('f-title').value : '';
      const loc = $('f-loc') ? $('f-loc').value : '';
      const duplicates = checkDuplicates(title, loc);
      const alertBox = $('duplicate-alert');
      if (!alertBox) return;
      if (duplicates.length) {
        const d = duplicates[0];
        alertBox.innerHTML = `
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div class="flex items-start gap-3">
              <span class="w-9 h-9 rounded-xl bg-amber-400/20 border border-amber-400/40 text-amber-300 flex items-center justify-center shrink-0 mt-0.5">
                <i data-lucide="alert-triangle" class="w-5 h-5"></i>
              </span>
              <div>
                <div class="text-xs font-mono uppercase tracking-wider text-amber-300 font-bold">// SIMILAR ACTIVE TICKET DETECTED</div>
                <div class="text-white font-bold text-sm mt-0.5">${esc(d.title)}</div>
                <div class="text-xs text-gray-400 mt-1">${esc(d.location)} · <span class="text-[#a3ff12] font-semibold">${d.upvotes} students already affected</span></div>
              </div>
            </div>
            <div class="flex items-center gap-2 shrink-0">
              <a href="#/ticket/${d.id}" class="btn-ghost !py-2 !px-3 text-xs font-semibold">View Ticket</a>
              <button type="button" data-action="upvote" data-id="${d.id}" class="btn-primary !py-2 !px-4 text-xs font-bold shadow-none">+1 Upvote Instead</button>
            </div>
          </div>`;
        alertBox.classList.remove('hidden');
        lucide.createIcons();
      } else {
        alertBox.classList.add('hidden');
      }
    },
    setZone(z) {
      ui.filterZone = z;
      playTone('click');
      render();
    },
    assignTicket(id, assignee) {
      const t = tickets.find(x => x.id === id);
      if (!t) return;
      t.assignee = assignee;
      t.timeline.push({ status: t.status, at: new Date().toISOString(), note: `Assigned to ${assignee}` });
      save();
      syncTicketToSupabase(t, { assignee, timeline: t.timeline });
      playTone('click');
      toast(`Assigned ${id} to ${assignee.split(' ')[0]}`);

      // In-place update if on ticket page
      const assigneeEl = $('ticket-assignee');
      if (assigneeEl) {
        assigneeEl.textContent = assignee;
        const timelineEl = $('ticket-timeline');
        if (timelineEl) {
          const lastEvent = t.timeline[t.timeline.length - 1];
          const li = document.createElement('li');
          li.className = 'pl-6 relative';
          li.innerHTML = `<span class="absolute left-0 top-1.5 w-2.5 h-2.5 rounded-full bg-[#a3ff12] shadow-[0_0_10px_#a3ff12]"></span><div class="flex items-center gap-2 text-sm font-semibold text-white">${lastEvent.status}<span class="text-xs text-gray-400 font-normal font-mono">${fmt(lastEvent.at)}</span></div><p class="text-sm text-gray-400 mt-1 leading-relaxed">${esc(lastEvent.note || '')}</p>`;
          timelineEl.prepend(li);
        }
        return;
      }
      refresh();
    },
    addComment(id) {
      const t = tickets.find(x => x.id === id);
      if (!t) return;
      const textEl = $('c-text');
      const authorEl = $('c-author');
      const text = textEl ? textEl.value.trim() : '';
      if (!text) return;
      const authUser = getAuthUser();
      const author = (authorEl && authorEl.value.trim()) || (authUser && authUser.name) || (isStaff() ? 'Campus Staff' : 'Student');
      const role = isStaff() ? 'staff' : 'student';
      const newComment = { author: sanitize(author), role, text: sanitize(text), at: new Date().toISOString() };
      if (!Array.isArray(t.comments)) t.comments = [];
      t.comments.push(newComment);
      save();
      syncTicketToSupabase(t, { comments: t.comments });
      localStorage.setItem('unidesk_name', author);
      playTone('pop');
      toast('Clarification posted');

      // In-place targeted DOM update
      const listEl = $('comments-list');
      const countEl = $('comments-count');
      if (listEl) {
        const emptyNotice = listEl.querySelector('.comments-empty');
        if (emptyNotice) emptyNotice.remove();

        const msgDiv = document.createElement('div');
        msgDiv.className = `rounded-2xl p-4 border ${role === 'staff' ? 'bg-[#152011]/80 border-[#a3ff12]/30 text-white ml-3 sm:ml-6' : 'bg-white/[0.04] border-white/10 text-gray-200 mr-3 sm:mr-6'} animate-fade`;
        msgDiv.innerHTML = `
          <div class="flex items-center justify-between gap-2 mb-2">
            <div class="flex items-center gap-2">
              <span class="font-bold text-sm text-white">${esc(newComment.author)}</span>
              <span class="text-[10px] font-mono uppercase px-2 py-0.5 rounded-full ${role === 'staff' ? 'bg-[#a3ff12] text-[#0c0f0a] font-bold' : 'bg-white/10 text-gray-400'}">${role === 'staff' ? 'Staff' : 'Student'}</span>
            </div>
            <span class="text-[11px] text-gray-400 font-mono">just now</span>
          </div>
          <p class="text-sm leading-relaxed">${esc(newComment.text)}</p>
        `;
        listEl.appendChild(msgDiv);
        if (countEl) countEl.textContent = `${t.comments.length} message${t.comments.length === 1 ? '' : 's'}`;
        if (textEl) textEl.value = '';
        return;
      }
      refresh();
    },
    rateTicket(id, stars) {
      const t = tickets.find(x => x.id === id);
      if (!t) return;
      t.rating = stars;
      save();
      playTone('success');
      launchConfetti();
      toast(`Thank you! Rated ${stars} star${stars > 1 ? 's' : ''}`);

      // In-place targeted DOM update
      const starsBox = $('csat-stars');
      if (starsBox) {
        const btns = starsBox.querySelectorAll('[data-action="rate-ticket"]');
        btns.forEach(b => {
          const s = parseInt(b.dataset.stars, 10);
          b.classList.toggle('active', s <= stars);
        });
        const badge = $('csat-rated-badge');
        if (badge) {
          badge.textContent = `Rated ${stars}.0 / 5.0`;
          badge.classList.remove('hidden');
        }
        return;
      }
      refresh();
    },
    toggleFeedbackTag(id, tag) {
      const t = tickets.find(x => x.id === id);
      if (!t) return;
      if (!Array.isArray(t.feedback)) t.feedback = [];
      const idx = t.feedback.indexOf(tag);
      const added = idx === -1;
      if (added) t.feedback.push(tag);
      else t.feedback.splice(idx, 1);
      save();
      playTone('click');

      // In-place targeted DOM update
      const tagBtn = document.querySelector(`[data-action="toggle-tag"][data-id="${id}"][data-tag="${tag}"]`);
      if (tagBtn) {
        tagBtn.className = `text-xs px-3 py-1.5 rounded-full border transition-all ${added ? 'bg-[#a3ff12]/20 border-[#a3ff12] text-[#a3ff12] font-semibold' : 'bg-white/5 border-white/10 text-gray-400 hover:text-white hover:border-white/20'}`;
        return;
      }
      refresh();
    },
    submitReport(e) {
      e.preventDefault();
      const v = id => ($(id) ? $(id).value.trim() : '');
      const checks = [
        ['e-cat', !!ui.draftCat],
        ['e-title', v('f-title').length >= 5, 'f-title'],
        ['e-loc', v('f-loc').length >= 2, 'f-loc'],
        ['e-name', v('f-name').length >= 2, 'f-name'],
        ['e-desc', v('f-desc').length >= 10, 'f-desc']
      ];
      let ok = true;
      checks.forEach(([err, pass, inp]) => {
        const errEl = $(err);
        if (errEl) errEl.classList.toggle('hidden', pass);
        if (inp && $(inp)) {
          $(inp).classList.toggle('err', !pass);
          $(inp).setAttribute('aria-invalid', !pass ? 'true' : 'false');
        }
        if (!pass) ok = false;
      });
      if (!ok) {
        const first = document.querySelector('.err, #e-cat:not(.hidden)');
        first && first.scrollIntoView({ behavior: 'smooth', block: 'center' });
        return;
      }
      const next = Math.max(100, ...tickets.map(t => parseInt(t.id.split('-')[1], 10) || 0)) + 1;
      const now = new Date().toISOString();
      const dept = v('f-dept') || DEPT_MAP[ui.draftCat] || 'General Administration';
      const sid = v('f-sid');
      const t = {
        id: 'CC-' + next,
        title: sanitize(v('f-title')),
        category: ui.draftCat,
        department: dept,
        priority: ui.draftPrio,
        location: sanitize(v('f-loc')),
        contactName: sanitize(v('f-name')),
        studentId: sid ? sanitize(sid) : undefined,
        description: sanitize(v('f-desc')),
        upvotes: 1,
        status: 'Open',
        createdAt: now,
        timeline: [{ status: 'Open', at: now, note: `Request routed to ${dept}` }],
        assignee: 'Unassigned',
        comments: [],
        image: ui.draftImage || undefined
      };
      tickets.unshift(t);
      save();
      syncTicketToSupabase(t);
      localStorage.setItem('unidesk_name', t.contactName);
      ui.draftCat = ''; ui.draftPrio = 'Medium'; ui.draftImage = null;
      playTone('success');
      launchConfetti();
      $('app').innerHTML = `<div class="zen-page-wrap"><div class="page max-w-lg mx-auto text-center bg-card rounded-3xl p-8 sm:p-12 border border-white/10 shadow-[0_24px_60px_rgba(0,0,0,0.6)] backdrop-blur-xl">
        <span class="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-[#a3ff12]/15 border border-[#a3ff12]/40 flex items-center justify-center mx-auto mb-6 text-[#a3ff12] shadow-[0_0_30px_rgba(163,255,18,0.3)]"><i data-lucide="check" class="w-8 h-8 sm:w-10 sm:h-10 stroke-[2.5]"></i></span>
        <div class="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-[#a3ff12] mb-2 font-semibold">// CONFIRMED</div>
        <h1 class="text-2xl sm:text-3xl font-extrabold text-white">Request Submitted</h1>
        <p class="text-gray-400 mt-2 text-sm sm:text-base leading-relaxed">Your campus request has been logged and routed to <span class="text-white font-medium">${esc(t.department)}</span>.</p>
        <div class="bg-white/[0.04] border border-[#a3ff12]/30 rounded-2xl p-4 my-6">
          <span class="text-xs uppercase tracking-wider text-gray-400 block font-mono mb-1">Your Ticket ID</span>
          <div class="font-mono text-3xl font-extrabold text-[#a3ff12] tracking-wider">${t.id}</div>
          <div class="text-xs text-gray-400 mt-2 flex items-center justify-center gap-1.5"><i data-lucide="building-2" class="w-3.5 h-3.5 text-[#a3ff12]"></i>Routed to <span class="text-[#a3ff12] font-semibold">${esc(t.department)}</span></div>
        </div>
        <div class="flex flex-col sm:flex-row gap-3 justify-center"><a href="#/ticket/${t.id}" class="btn-primary">View ticket details</a><a href="#/report" class="btn-ghost">Submit another</a></div></div></div>`;
      window.scrollTo(0, 0);
      lucide.createIcons();
    },
    trackById(e) {
      e.preventDefault();
      const inp = $('track-id');
      const id = inp ? inp.value.trim().toUpperCase() : '';
      const found = tickets.find(t => t.id === id);
      if (found) {
        playTone('click');
        location.hash = '#/ticket/' + id;
      } else {
        const err = $('track-err');
        if (err) err.classList.remove('hidden');
      }
    },
    setQ(v) { ui.q = v; renderRequestList(); },
    setCat(v) { ui.filterCat = v; playTone('click'); renderRequestList(); },
    setDept(v) { ui.filterDept = v; playTone('click'); renderRequestList(); },
    setSort(v) { ui.sort = v; playTone('click'); renderRequestList(); },
    setStatus(v) { ui.filterStatus = v; playTone('click'); renderRequestList(); },
    setFaq(v) { ui.faqCat = v; playTone('click'); render(); },
    setStaffFilter(v) { ui.staffFilter = v; playTone('click'); refresh(); },
    upvote(id) {
      const t = tickets.find(x => x.id === id);
      if (!t) return;
      t.upvotes++;
      save();
      syncTicketToSupabase(t, { upvotes: t.upvotes });
      playTone('pop');
      toast('Thanks! Marked as affected');

      // 1. In-place update on ticket detail page
      const detailBtn = document.querySelector(`[data-action="upvote"][data-id="${id}"]`);
      if (detailBtn) {
        detailBtn.innerHTML = `<i data-lucide="thumbs-up" class="w-4 h-4 text-[#a3ff12]"></i>+1 Affected · ${t.upvotes}`;
        lucide.createIcons();
        detailBtn.classList.add('scale-105');
        setTimeout(() => detailBtn.classList.remove('scale-105'), 180);
        return;
      }

      // 2. In-place update on requests page list card
      const cardEl = document.querySelector(`[data-ticket-card="${id}"] .vote-count`);
      if (cardEl) {
        cardEl.textContent = `${t.upvotes} affected`;
        return;
      }

      refresh();
    },
    setTicketStatus(id, status) {
      const t = tickets.find(x => x.id === id);
      if (!t || t.status === status) return;
      const noteEl = $('staff-note');
      const note = (noteEl && noteEl.value.trim()) || { 'Open': 'Re-opened by staff', 'In Progress': 'Staff started working on this', 'Resolved': 'Marked as resolved by staff' }[status];
      t.status = status;
      t.timeline.push({ status, at: new Date().toISOString(), note });
      save();
      syncTicketToSupabase(t, { status, timeline: t.timeline });
      if (status === 'Resolved') {
        playTone('success');
        launchConfetti();
      } else {
        playTone('click');
      }
      toast(`${id} is now ${status}`);

      // In-place update if on detail page
      const statusChipEl = $('ticket-status-chip');
      const stepperEl = $('ticket-stepper');
      if (statusChipEl && stepperEl) {
        statusChipEl.innerHTML = statusChip(status);
        const idx = STATUSES.indexOf(status);
        stepperEl.innerHTML = `<div class="flex items-start">${[0, 1, 2].map(i => `<div class="flex-1 flex flex-col items-center text-center gap-2 relative">${i > 0 ? `<div class="absolute top-4 right-1/2 w-full h-0.5 ${i <= idx ? 'bg-[#a3ff12]' : 'bg-white/10'}"></div>` : ''}<div class="relative z-10 w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs ${i <= idx ? 'bg-[#a3ff12] text-[#0c0f0a] shadow-[0_0_16px_rgba(163,255,18,0.5)]' : 'bg-white/10 text-gray-400'}"><i data-lucide="${i <= idx ? 'check' : 'circle'}" class="w-4 h-4"></i></div><span class="text-xs font-semibold ${i <= idx ? 'text-white' : 'text-gray-400'}">${STATUSES[i]}</span></div>`).join('')}</div>`;
        const staffBox = $('staff-action-box');
        if (staffBox) {
          const btns = staffBox.querySelectorAll('[data-action="set-ticket-status"]');
          btns.forEach(b => {
            const isCur = b.dataset.status === status;
            b.className = `rounded-xl px-4 py-2 text-sm font-bold border transition-all ${isCur ? 'border-[#a3ff12] bg-[#a3ff12]/20 text-[#a3ff12] shadow-[0_0_15px_rgba(163,255,18,0.25)]' : 'border-white/15 bg-white/[0.03] text-gray-300 hover:border-[#a3ff12]/50 hover:text-white'}`;
          });
        }
        const timelineEl = $('ticket-timeline');
        if (timelineEl) {
          const lastEvent = t.timeline[t.timeline.length - 1];
          const li = document.createElement('li');
          li.className = 'pl-6 relative';
          li.innerHTML = `<span class="absolute left-0 top-1.5 w-2.5 h-2.5 rounded-full bg-[#a3ff12] shadow-[0_0_10px_#a3ff12]"></span><div class="flex items-center gap-2 text-sm font-semibold text-white">${lastEvent.status}<span class="text-xs text-gray-400 font-normal font-mono">${fmt(lastEvent.at)}</span></div><p class="text-sm text-gray-400 mt-1 leading-relaxed">${esc(lastEvent.note || '')}</p>`;
          timelineEl.prepend(li);
        }
        lucide.createIcons();
        return;
      }

      refresh();
    },
    async staffLogin(e) {
      e.preventDefault();
      const pinVal = $('pin') ? $('pin').value : '';
      const pinErr = $('pin-err');

      // Rate limit / Lockout check
      const lockout = parseInt(sessionStorage.getItem('unidesk_lockout') || '0', 10);
      if (Date.now() < lockout) {
        const secs = Math.ceil((lockout - Date.now()) / 1000);
        if (pinErr) {
          pinErr.textContent = `Security lockout active. Please wait ${secs}s.`;
          pinErr.classList.remove('hidden');
        }
        return;
      }

      const inputHash = await sha256(SALT + pinVal);
      if (inputHash === PIN_HASH) {
        sessionStorage.removeItem('unidesk_lockout');
        sessionStorage.removeItem('unidesk_attempts');
        const token = Array.from(crypto.getRandomValues(new Uint8Array(16))).map(b => b.toString(16).padStart(2, '0')).join('');
        const sessionData = {
          role: 'staff',
          token,
          expiresAt: Date.now() + 8 * 3600 * 1000 // 8 hours
        };
        sessionStorage.setItem(TOKEN_KEY, JSON.stringify(sessionData));
        playTone('success');
        toast('Signed in as staff');
        render();
      } else {
        let attempts = parseInt(sessionStorage.getItem('unidesk_attempts') || '0', 10) + 1;
        sessionStorage.setItem('unidesk_attempts', String(attempts));
        if (pinErr) {
          if (attempts >= 5) {
            sessionStorage.setItem('unidesk_lockout', String(Date.now() + 30000));
            pinErr.textContent = 'Too many failed attempts. Locked for 30s.';
          } else {
            pinErr.textContent = `Incorrect PIN. (${5 - attempts} attempts left)`;
          }
          pinErr.classList.remove('hidden');
        }
      }
    },
    staffLogout() {
      sessionStorage.removeItem(TOKEN_KEY);
      playTone('click');
      toast('Signed out');
      render();
    },
    exportCsv() {
      const rows = [['ID', 'Title', 'Category', 'Department', 'Priority', 'Status', 'Assignee', 'CSAT', 'Location', 'Contact', 'Created', 'Affected', 'HasAttachment']];
      tickets.forEach(t => rows.push([
        t.id,
        t.title,
        t.category,
        t.department || DEPT_MAP[t.category] || 'General Admin',
        t.priority,
        t.status,
        t.assignee || 'Unassigned',
        t.rating || 'Unrated',
        t.location,
        t.contactName,
        t.createdAt,
        t.upvotes,
        t.image ? 'Yes' : 'No'
      ]));
      const csv = rows.map(r => r.map(c => '"' + String(c).replace(/"/g, '""') + '"').join(',')).join('\n');
      const a = document.createElement('a');
      a.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }));
      a.download = 'unidesk-requests.csv';
      a.click();
      playTone('click');
    },
    resetData() {
      if (confirm('Reset all data to demo tickets?')) {
        tickets = seed();
        save();
        playTone('click');
        toast('Demo data restored');
        render();
      }
    },
    addDemoData() {
      const demoBatch = seed();
      let added = 0;
      demoBatch.forEach(item => {
        if (!tickets.some(t => t.id === item.id)) {
          tickets.push(JSON.parse(JSON.stringify(item)));
          added++;
        }
      });
      if (added === 0) {
        const next = Math.max(100, ...tickets.map(t => parseInt(t.id.split('-')[1], 10) || 0)) + 1;
        const now = new Date().toISOString();
        tickets.unshift({
          id: 'CC-' + next,
          title: 'Campus shuttle GPS tracker signal delay',
          category: 'Other',
          department: 'Transport & Fleet Services',
          priority: 'Medium',
          location: 'Main Gate Shuttle Stop',
          contactName: 'Damon Salvatore',
          description: 'Live bus tracking app shows 15-minute delay on bus route 3, but the bus was already at the gate.',
          upvotes: 7,
          status: 'Open',
          createdAt: now,
          timeline: [{ status: 'Open', at: now, note: 'Transport department notified' }],
          assignee: 'Unassigned',
          comments: []
        });
        added = 1;
      }
      save();
      playTone('click');
      toast(`Added ${added} demo ticket${added > 1 ? 's' : ''}`);
      render();
    },
    async googleLogin() {
      playTone('click');
      const sb = getSupabase();
      if (sb && sb.auth) {
        try {
          const redirectTo = window.location.origin + window.location.pathname;

          // Pre-flight check if Google OAuth provider is enabled on Supabase backend
          const checkRes = await fetch(`${DEFAULT_SUPA_URL}/auth/v1/authorize?provider=google`, {
            method: 'GET',
            headers: { 'apikey': DEFAULT_SUPA_KEY }
          }).catch(() => null);

          if (checkRes && checkRes.status === 400) {
            const errData = await checkRes.json().catch(() => ({}));
            if (errData && errData.msg && errData.msg.includes('not enabled')) {
              openGoogleModal();
              return;
            }
          }

          const { data, error } = await sb.auth.signInWithOAuth({
            provider: 'google',
            options: {
              redirectTo,
              queryParams: {
                access_type: 'offline',
                prompt: 'consent'
              }
            }
          });
          if (error) throw error;
          if (data?.url) {
            window.location.href = data.url;
            return;
          }
        } catch (err) {
          console.warn('Supabase Google OAuth notice:', err);
          if (err.message && err.message.includes('not enabled')) {
            openGoogleModal();
            return;
          }
        }
      }

      api.quickGoogleDemo();
    },

    quickGoogleDemo() {
      closeGoogleModal();
      const role = ui.authRole || 'student';
      const isStaff = role === 'staff';
      const user = {
        id: 'google_' + Date.now().toString(36),
        name: isStaff ? 'Rajesh Kumar' : 'Aditya Kumar',
        email: isStaff ? 'rajesh.kumar@unidesk.edu' : 'aditya.kumar@campus.edu',
        role: role,
        department: isStaff ? 'Senior Network Lead, IT Support' : 'School of Computer Science',
        provider: 'google'
      };
      setAuthUser(user, true);
      playTone('success');
      launchConfetti();
      toast(`Signed in with Google (${user.name})`);
      render();
    },
    async signInUser(e) {
      e.preventDefault();
      const email = $('auth-email') ? $('auth-email').value.trim() : '';
      const password = $('auth-password') ? $('auth-password').value : '';
      const remember = $('auth-remember') ? $('auth-remember').checked : true;
      const errEl = $('auth-err');
      const btn = $('auth-submit-btn');

      if (!email || !password) {
        if (errEl) {
          errEl.textContent = 'Please enter both email and password.';
          errEl.classList.remove('hidden');
        }
        return;
      }

      const sb = getSupabase();
      if (sb) {
        if (btn) btn.disabled = true;
        try {
          const { data, error } = await sb.auth.signInWithPassword({ email, password });
          if (error) throw error;
          const userMeta = data.user?.user_metadata || {};
          const name = userMeta.name || email.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
          const role = userMeta.role || ui.authRole;
          const dept = userMeta.department || (role === 'staff' ? 'Campus IT Support' : 'Aryabhatta Block');

          setAuthUser({
            id: data.user.id,
            name,
            email: data.user.email,
            role,
            department: dept
          }, remember);

          playTone('success');
          toast(`Welcome back, ${name}!`);
          render();
          return;
        } catch (err) {
          if (errEl) {
            errEl.textContent = err.message || 'Invalid email or password.';
            errEl.classList.remove('hidden');
          }
          if (btn) btn.disabled = false;
          return;
        }
      }

      // Local sandbox auth fallback
      const name = email.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
      const role = ui.authRole;
      const dept = role === 'staff' ? 'Campus IT Operations' : 'Aryabhatta Hostel';

      setAuthUser({
        id: 'local_' + Date.now(),
        name,
        email,
        role,
        department: dept
      }, remember);

      playTone('success');
      toast(`Signed in as ${name} (Local Mode)`);
      render();
    },

    async signUpUser(e) {
      e.preventDefault();
      const name = $('reg-name') ? $('reg-name').value.trim() : '';
      const email = $('reg-email') ? $('reg-email').value.trim() : '';
      const dept = $('reg-dept') ? $('reg-dept').value.trim() : '';
      const password = $('reg-password') ? $('reg-password').value : '';
      const errEl = $('reg-err');
      const btn = $('reg-submit-btn');

      if (!name || !email || !password) {
        if (errEl) {
          errEl.textContent = 'Please fill out all required fields.';
          errEl.classList.remove('hidden');
        }
        return;
      }
      if (password.length < 6) {
        if (errEl) {
          errEl.textContent = 'Password must be at least 6 characters.';
          errEl.classList.remove('hidden');
        }
        return;
      }

      const role = ui.authRole;
      const finalDept = dept || (role === 'staff' ? 'Campus Facilities & IT' : 'Residential Hostels');

      const sb = getSupabase();
      if (sb) {
        if (btn) btn.disabled = true;
        try {
          const { data, error } = await sb.auth.signUp({
            email,
            password,
            options: {
              data: {
                name,
                role,
                department: finalDept
              }
            }
          });
          if (error) throw error;

          if (data.session) {
            setAuthUser({
              id: data.user.id,
              name,
              email,
              role,
              department: finalDept
            }, true);
            playTone('success');
            toast('Account created and signed in via Supabase!');
            render();
          } else {
            playTone('success');
            toast('Account created! Please check your email to verify.');
            ui.authTab = 'signin';
            render();
          }
          return;
        } catch (err) {
          if (errEl) {
            errEl.textContent = err.message || 'Unable to create account.';
            errEl.classList.remove('hidden');
          }
          if (btn) btn.disabled = false;
          return;
        }
      }

      // Local sandbox registration fallback
      setAuthUser({
        id: 'local_' + Date.now(),
        name,
        email,
        role,
        department: finalDept
      }, true);

      playTone('success');
      toast('Account created successfully (Local Mode)!');
      render();
    },

    authLogout() {
      clearAuthSession();
      playTone('click');
      toast('Signed out successfully');
      render();
    },

    quickDemoLogin(role) {
      const isStaff = role === 'staff';
      const demoUser = isStaff ? {
        id: 'demo_staff_lead',
        name: 'Rajesh Kumar',
        email: 'rajesh.kumar@unidesk.edu',
        role: 'staff',
        department: 'Senior Network Lead, IT Support'
      } : {
        id: 'demo_student_rohan',
        name: 'Rohan Verma',
        email: 'rohan.verma@campus.edu',
        role: 'student',
        department: 'Aryabhatta Hostel, Room 214'
      };

      setAuthUser(demoUser, true);
      playTone('success');
      toast(`Signed in as ${demoUser.name} (${isStaff ? 'Staff Lead' : 'Student'})`);
      render();
    },

    setAuthTab(tab) {
      ui.authTab = tab;
      playTone('click');
      render();
    },

    setAuthRole(role) {
      ui.authRole = role;
      playTone('click');
      render();
    },

    togglePasswordVisibility(targetId) {
      const inp = $(targetId);
      if (!inp) return;
      const isPassword = inp.type === 'password';
      inp.type = isPassword ? 'text' : 'password';
      const btn = document.querySelector(`[data-action="toggle-pass-vis"][data-target="${targetId}"]`);
      if (btn) {
        btn.innerHTML = `<i data-lucide="${isPassword ? 'eye-off' : 'eye'}" class="w-4 h-4"></i>`;
        lucide.createIcons();
      }
    },

    async saveSupabaseConfig(e) {
      e.preventDefault();
      const urlInput = $('supa-url');
      const keyInput = $('supa-key');
      const url = urlInput ? urlInput.value.trim().replace(/\/+$/, '') : '';
      const key = keyInput ? keyInput.value.trim() : '';

      if (!url || !key) {
        toast('Please enter both Supabase URL and Anon Key');
        return;
      }

      localStorage.setItem(SUPA_URL_KEY, url);
      localStorage.setItem(SUPA_KEY_KEY, key);
      supaClient = null;

      playTone('success');
      toast('Supabase configuration saved & connected!');
      render();
    },

    async testSupabase() {
      const msgEl = $('supa-msg');
      const urlInput = $('supa-url');
      const keyInput = $('supa-key');
      const url = urlInput ? urlInput.value.trim().replace(/\/+$/, '') : (localStorage.getItem(SUPA_URL_KEY) || '');
      const key = keyInput ? keyInput.value.trim() : (localStorage.getItem(SUPA_KEY_KEY) || '');

      if (!url || !key) {
        if (msgEl) {
          msgEl.className = 'text-sm p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300';
          msgEl.innerHTML = '<i data-lucide="alert-circle" class="w-4 h-4 inline mr-1.5"></i>Please enter both Supabase Project URL and Public Anon Key.';
          msgEl.classList.remove('hidden');
          lucide.createIcons();
        }
        return;
      }

      if (msgEl) {
        msgEl.className = 'text-sm p-3 rounded-xl bg-white/5 border border-white/10 text-gray-300';
        msgEl.innerHTML = '<i data-lucide="loader" class="w-4 h-4 inline mr-1.5 animate-spin"></i>Testing connection to Supabase cloud...';
        msgEl.classList.remove('hidden');
        lucide.createIcons();
      }

      try {
        if (!window.supabase || typeof window.supabase.createClient !== 'function') {
          throw new Error('Supabase client library not ready. Check network.');
        }
        const tempClient = window.supabase.createClient(url, key);
        const { data, error } = await tempClient.from('tickets').select('id').limit(1);

        if (error) {
          if (error.code === 'PGRST116' || error.message?.includes('relation "public.tickets" does not exist') || error.code === '42P01') {
            msgEl.className = 'text-sm p-3 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-300';
            msgEl.innerHTML = '<i data-lucide="check" class="w-4 h-4 inline mr-1.5 text-emerald-400"></i>Supabase connection valid! Table <code>tickets</code> is not created yet. Use the SQL Schema below in your SQL Editor.';
          } else {
            msgEl.className = 'text-sm p-3 rounded-xl bg-red-500/15 border border-red-500/30 text-red-300';
            msgEl.innerHTML = `<i data-lucide="alert-triangle" class="w-4 h-4 inline mr-1.5"></i>Supabase returned an error: ${esc(error.message || error)}`;
          }
        } else {
          msgEl.className = 'text-sm p-3 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300';
          msgEl.innerHTML = '<i data-lucide="check-circle-2" class="w-4 h-4 inline mr-1.5 text-emerald-400"></i>Connected successfully! Supabase Cloud backend and <code>tickets</code> table are ready.';
        }
        lucide.createIcons();
      } catch (err) {
        if (msgEl) {
          msgEl.className = 'text-sm p-3 rounded-xl bg-red-500/15 border border-red-500/30 text-red-300';
          msgEl.innerHTML = `<i data-lucide="alert-triangle" class="w-4 h-4 inline mr-1.5"></i>Connection failed: ${esc(err.message || err)}`;
          msgEl.classList.remove('hidden');
          lucide.createIcons();
        }
      }
    },

    clearSupabaseConfig() {
      localStorage.removeItem(SUPA_URL_KEY);
      localStorage.removeItem(SUPA_KEY_KEY);
      supaClient = null;
      playTone('click');
      toast('Supabase disconnected. Switched to local mode.');
      render();
    },

    copySqlSchema() {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(SQL_SCHEMA_SNIPPET).then(() => {
          toast('Supabase SQL schema copied to clipboard!');
        }).catch(() => {
          toast('Select and copy the SQL code above.');
        });
      } else {
        toast('Select and copy the SQL code above.');
      }
    },
    toggleTheme,
    applyTheme,
    getTheme: () => currentTheme,
  };

  /* ============ GLOBAL EVENT DELEGATION ============ */
  document.addEventListener('click', e => {
    // Image modal close handling
    const closeEl = e.target.closest('[data-action="close-modal"]');
    if (closeEl) {
      if (e.target.closest('[data-modal-content="true"]') && !e.target.closest('#img-modal-close')) {
        return; // Click within modal body, don't dismiss
      }
      closeImageModal();
      return;
    }

    // Google setup modal close handling
    const closeGoogleEl = e.target.closest('[data-action="close-google-modal"], [data-action="close-google-modal-backdrop"]');
    if (closeGoogleEl) {
      if (e.target.closest('[data-modal-content="true"]') && !e.target.closest('#google-setup-modal-close')) {
        return;
      }
      closeGoogleModal();
      return;
    }

    const actionEl = e.target.closest('[data-action]');
    if (!actionEl) return;

    const action = actionEl.dataset.action;
    const id = actionEl.dataset.id;

    if (action === 'toggle-theme') {
      api.toggleTheme();
    } else if (action === 'zoom-ticket') {
      const t = tickets.find(x => x.id === id);
      if (t && t.image) openImageModal(t.image);
    } else if (action === 'upvote') {
      api.upvote(id);
    } else if (action === 'rate-ticket') {
      const stars = parseInt(actionEl.dataset.stars, 10);
      api.rateTicket(id, stars);
    } else if (action === 'toggle-tag') {
      const tag = actionEl.dataset.tag;
      api.toggleFeedbackTag(id, tag);
    } else if (action === 'pick-cat') {
      api.pickCat(actionEl.dataset.cat);
    } else if (action === 'pick-prio') {
      api.pickPrio(actionEl.dataset.prio);
    } else if (action === 'set-zone') {
      api.setZone(actionEl.dataset.zone);
    } else if (action === 'clear-zone') {
      api.setZone('ALL');
    } else if (action === 'set-status') {
      api.setStatus(actionEl.dataset.status);
    } else if (action === 'set-ticket-status') {
      api.setTicketStatus(id, actionEl.dataset.status);
    } else if (action === 'set-faq') {
      api.setFaq(actionEl.dataset.cat);
    } else if (action === 'set-staff-filter') {
      api.setStaffFilter(actionEl.dataset.status);
    } else if (action === 'export-csv') {
      api.exportCsv();
    } else if (action === 'staff-logout') {
      api.staffLogout();
    } else if (action === 'trigger-upload') {
      const inp = $('f-image-input');
      if (inp) inp.click();
    } else if (action === 'remove-image') {
      api.removeImage();
    } else if (action === 'add-demo') {
      api.addDemoData();
    } else if (action === 'reset-demo') {
      api.resetData();
    } else if (action === 'auth-logout') {
      api.authLogout();
    } else if (action === 'google-login') {
      api.googleLogin();
    } else if (action === 'demo-google-login') {
      api.quickGoogleDemo();
    } else if (action === 'open-google-modal') {
      openGoogleModal();
    } else if (action === 'close-google-modal') {
      closeGoogleModal();
    } else if (action === 'copy-google-callback') {
      const urlText = 'https://xfvpoqfzcsvxfnhrfilf.supabase.co/auth/v1/callback';
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(urlText).then(() => {
          playTone('click');
          toast('Copied Callback URL to clipboard!');
        }).catch(() => {
          toast('Callback URL: ' + urlText);
        });
      } else {
        toast('Callback URL: ' + urlText);
      }
    } else if (action === 'demo-login') {
      api.quickDemoLogin(actionEl.dataset.role || 'student');
    } else if (action === 'set-auth-tab') {
      api.setAuthTab(actionEl.dataset.tab);
    } else if (action === 'set-auth-role') {
      api.setAuthRole(actionEl.dataset.role);
    } else if (action === 'toggle-pass-vis') {
      api.togglePasswordVisibility(actionEl.dataset.target);
    } else if (action === 'test-supa') {
      api.testSupabase();
    } else if (action === 'clear-supa') {
      api.clearSupabaseConfig();
    } else if (action === 'copy-schema') {
      api.copySqlSchema();
    }
  });

  document.addEventListener('change', e => {
    const el = e.target.closest('[data-change]');
    if (!el) return;
    const type = el.dataset.change;
    const id = el.dataset.id;

    if (type === 'image-upload') {
      api.handleImageUpload(e);
    } else if (type === 'assign-ticket') {
      api.assignTicket(id, el.value);
    } else if (type === 'set-ticket-status') {
      api.setTicketStatus(id, el.value);
    } else if (type === 'filter-cat') {
      api.setCat(el.value);
    } else if (type === 'filter-dept') {
      api.setDept(el.value);
    } else if (type === 'sort-requests') {
      api.setSort(el.value);
    }
  });

  document.addEventListener('submit', e => {
    const form = e.target.closest('[data-submit]');
    if (!form) return;
    const type = form.dataset.submit;
    const id = form.dataset.id;

    if (type === 'report-submit') {
      api.submitReport(e);
    } else if (type === 'track-submit') {
      api.trackById(e);
    } else if (type === 'comment-submit') {
      e.preventDefault();
      api.addComment(id);
    } else if (type === 'staff-login-submit') {
      api.staffLogin(e);
    } else if (type === 'signin-submit') {
      api.signInUser(e);
    } else if (type === 'signup-submit') {
      api.signUpUser(e);
    } else if (type === 'supa-config-submit') {
      api.saveSupabaseConfig(e);
    }
  });

  /* 250ms Debounced input listener */
  function debounce(fn, wait = 250) {
    let timer;
    return function (...args) {
      clearTimeout(timer);
      timer = setTimeout(() => fn.apply(this, args), wait);
    };
  }

  const debouncedReportTyping = debounce(() => {
    api.onReportTyping();
  }, 250);

  document.addEventListener('input', e => {
    const el = e.target.closest('[data-input]');
    if (!el) return;
    const type = el.dataset.input;

    if (type === 'report-typing') {
      const descCount = $('desc-count');
      const fDesc = $('f-desc');
      if (descCount && fDesc) descCount.textContent = fDesc.value.length;
      debouncedReportTyping();
    } else if (type === 'search-requests') {
      api.setQ(el.value);
    }
  });

  /* ============ THROTTLED POINTERMOVE LISTENER ============ */
  let pointerRafId = null;
  window.addEventListener('pointermove', e => {
    if (pointerRafId) return;
    pointerRafId = requestAnimationFrame(() => {
      const h = document.querySelector('.zen-hero');
      if (h) {
        h.style.setProperty('--mx', (e.clientX / innerWidth - 0.5).toFixed(3));
        h.style.setProperty('--my', (e.clientY / innerHeight - 0.5).toFixed(3));
      }
      pointerRafId = null;
    });
  }, { passive: true });

  /* ============ GLOBAL KEYBOARD SHORTCUTS & FOCUS TRAP ============ */
  window.addEventListener('keydown', e => {
    const modal = $('img-modal');
    const isModalOpen = modal && !modal.classList.contains('hidden');
    const gModal = $('google-setup-modal');
    const isGModalOpen = gModal && !gModal.classList.contains('hidden');

    if (isGModalOpen) {
      if (e.key === 'Escape') {
        e.preventDefault();
        closeGoogleModal();
        return;
      }
    }

    if (isModalOpen) {
      if (e.key === 'Escape') {
        e.preventDefault();
        closeImageModal();
        return;
      } else if (e.key === 'Tab') {
        const focusable = modal.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
        if (focusable.length > 0) {
          const first = focusable[0];
          const last = focusable[focusable.length - 1];
          if (e.shiftKey && document.activeElement === first) {
            e.preventDefault();
            last.focus();
          } else if (!e.shiftKey && document.activeElement === last) {
            e.preventDefault();
            first.focus();
          }
        }
        return;
      }
    }

    if (['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement && document.activeElement.tagName)) return;
    if (e.key === '/') {
      e.preventDefault();
      location.hash = '#/requests';
      setTimeout(() => { const q = $('q'); if (q) { q.focus(); q.select(); } }, 120);
    } else if (e.key === 'n' || e.key === 'N') {
      e.preventDefault();
      location.hash = '#/report';
    }
  });

  /* Service Worker Registration */
  if ('serviceWorker' in navigator && (window.location.protocol === 'http:' || window.location.protocol === 'https:')) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('./sw.js').then(reg => {
        reg.update().catch(() => {});
      }).catch(err => {
        console.debug('ServiceWorker registration skipped:', err);
      });
    });
  }

  /* Initialization */
  window.addEventListener('hashchange', () => {
    if (confettiRafId) {
      cancelAnimationFrame(confettiRafId);
      confettiRafId = null;
      $('confetti-canvas')?.classList.add('hidden');
    }
    closeImageModal();
    render();
  });

  window.addEventListener('DOMContentLoaded', async () => {
    applyTheme(currentTheme);
    const sb = getSupabase();
    if (sb && sb.auth) {
      try {
        const { data: { session } } = await sb.auth.getSession();
        if (session && session.user && !getAuthUser()) {
          syncSessionToUser(session);
        }
      } catch (err) {
        console.debug('Session check notice:', err);
      }
    }
    await load();
    render();
  });

  return api;
})();
