/* ============================================================
   NOVA GYM — Sistema de gestión
   Datos de clientes y cuotas persistidos en localStorage.
   ============================================================ */

const PLANES = {
  mensual: { label: 'Mensual',  monto: 50000, prefix: 'mes' },
  semanal: { label: 'Semanal',  monto: 22000, prefix: 'sem' },
  diario:  { label: 'Diario',   monto: 12000, prefix: 'día' },
};

const DIA_MS = 86400000;

/* ---------- helpers de fecha (zona local, seguros) ---------- */
function aISO(d) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const da = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${da}`;
}
function parseISO(iso) {
  const [y, m, d] = String(iso).split('-').map(Number);
  return new Date(y, m - 1, d);
}
function hoyISO() {
  return aISO(new Date());
}
function sumarDiasISO(iso, dias) {
  const d = parseISO(iso);
  d.setDate(d.getDate() + dias);
  return aISO(d);
}
function sumarIntervaloISO(iso, plan) {
  const d = parseISO(iso);
  if (plan === 'mensual') { d.setMonth(d.getMonth() + 1); }
  else if (plan === 'semanal') { d.setDate(d.getDate() + 7); }
  else { d.setDate(d.getDate() + 1); }
  return aISO(d);
}
function diasHastaISO(iso) {
  const hoy = new Date(); hoy.setHours(0, 0, 0, 0);
  const t = parseISO(iso);
  return Math.round((t - hoy) / DIA_MS);
}
const fmtFecha = (iso) => {
  if (!iso) return '—';
  const [y, m, d] = iso.split('-');
  return `${d}/${m}/${y}`;
};
const fmtDia = (iso) => {
  if (!iso) return '—';
  return new Intl.DateTimeFormat('es-AR', { weekday: 'short', day: 'numeric', month: 'short' }).format(parseISO(iso));
};

/* ---------- rutinas ---------- */
const RUTINAS = [
  {
    id: 'fuerza',
    tag: 'Fuerza',
    titulo: 'Rutina de Fuerza',
    descripcion: 'Maximizá la capacidad de generar tensión con cargas altas y ejercicios compuestos.',
    objetivo: 'Fuerza',
    frecuencia: '3 a 4 días por semana',
    nivel: 'Intermedio / Avanzado',
    duracion: '60-75 min',
    dias: [
      { nombre: 'Día A — Tren inferior', ejercicios: [
        { e: 'Sentadilla trasera', s: '5', r: '5', rest: '2-3 min' },
        { e: 'Peso muerto rumano', s: '4', r: '8', rest: '2 min' },
        { e: 'Prensa de piernas', s: '4', r: '10', rest: '90 s' },
        { e: 'Hip thrust con barra', s: '3', r: '10', rest: '90 s' },
        { e: 'Pantorrillas de pie', s: '4', r: '12', rest: '60 s' },
      ]},
      { nombre: 'Día B — Tren superior', ejercicios: [
        { e: 'Press de banca', s: '5', r: '5', rest: '2-3 min' },
        { e: 'Remo con barra', s: '4', r: '8', rest: '2 min' },
        { e: 'Press militar con barra', s: '4', r: '6', rest: '2 min' },
        { e: 'Dominadas (o jalón al pecho)', s: '4', r: 'máx', rest: '90 s' },
        { e: 'Curl de bíceps con barra', s: '3', r: '10', rest: '60 s' },
      ]},
      { nombre: 'Día C — Fuerza general', ejercicios: [
        { e: 'Peso muerto', s: '5', r: '3-5', rest: '3 min' },
        { e: 'Press inclinado con mancuernas', s: '4', r: '8', rest: '2 min' },
        { e: 'Fondos en paralelas', s: '4', r: '8-10', rest: '90 s' },
        { e: 'Remo en máquina', s: '4', r: '10', rest: '90 s' },
        { e: 'Abdominales con carga', s: '3', r: '12', rest: '60 s' },
      ]},
    ],
    tips: 'Aumentá la carga solo cuando completes series y repeticiones con técnica perfecta. Dejá 48 h de descanso entre sesiones del mismo patrón de movimiento.',
  },
  {
    id: 'hipertrofia',
    tag: 'Hipertrofia',
    titulo: 'Rutina de Hipertrofia',
    descripcion: 'Crecimiento muscular con volumen equilibrado y una división clara por grupos musculares.',
    objetivo: 'Hipertrofia',
    frecuencia: '4 a 5 días por semana',
    nivel: 'Todos los niveles',
    duracion: '70-90 min',
    dias: [
      { nombre: 'Día A — Empuje (push)', ejercicios: [
        { e: 'Press de banca', s: '4', r: '8-10', rest: '90 s' },
        { e: 'Press militar con mancuernas', s: '4', r: '10-12', rest: '90 s' },
        { e: 'Aperturas en banco plano', s: '3', r: '12-15', rest: '60 s' },
        { e: 'Elevaciones laterales', s: '4', r: '15', rest: '60 s' },
        { e: 'Extensión de tríceps en polea', s: '3', r: '12', rest: '60 s' },
      ]},
      { nombre: 'Día B — Tirón (pull)', ejercicios: [
        { e: 'Dominadas (o jalón)', s: '4', r: '8-10', rest: '90 s' },
        { e: 'Remo con barra', s: '4', r: '10', rest: '90 s' },
        { e: 'Remo con mancuerna a una mano', s: '3', r: '12', rest: '60 s' },
        { e: 'Curl de bíceps alternado', s: '4', r: '12', rest: '60 s' },
        { e: 'Curl martillo', s: '3', r: '12', rest: '60 s' },
      ]},
      { nombre: 'Día C — Piernas', ejercicios: [
        { e: 'Sentadilla trasera', s: '4', r: '8-10', rest: '2 min' },
        { e: 'Peso muerto rumano', s: '4', r: '10-12', rest: '90 s' },
        { e: 'Prensa 45°', s: '4', r: '12', rest: '90 s' },
        { e: 'Extensión de cuádriceps', s: '3', r: '15', rest: '60 s' },
        { e: 'Curl femoral acostado', s: '3', r: '15', rest: '60 s' },
        { e: 'Pantorrillas sentado', s: '4', r: '15-20', rest: '45 s' },
      ]},
      { nombre: 'Día D — Cuerpo completo (opcional)', ejercicios: [
        { e: 'Sentadilla frontal', s: '3', r: '8', rest: '90 s' },
        { e: 'Press inclinado con mancuernas', s: '3', r: '10', rest: '90 s' },
        { e: 'Remo en polea baja', s: '3', r: '12', rest: '60 s' },
        { e: 'Hip thrust', s: '3', r: '12', rest: '60 s' },
        { e: 'Elevaciones laterales', s: '3', r: '15', rest: '45 s' },
      ]},
    ],
    tips: 'Mantené las repeticiones altas con pesos que te permitan terminar la serie con 2 repeticiones de reserva. Progresión con sobrecarga progresiva cada 2-3 semanas.',
  },
  {
    id: 'resistencia',
    tag: 'Resistencia',
    titulo: 'Rutina de Resistencia',
    descripcion: 'Mejorá tu capacidad cardiovascular y la tolerancia al esfuerzo con cargas moderadas y circuitos.',
    objetivo: 'Resistencia',
    frecuencia: '3 a 5 días por semana',
    nivel: 'Todos los niveles',
    duracion: '45-60 min',
    dias: [
      { nombre: 'Día A — Full body en circuito', ejercicios: [
        { e: 'Sentadilla con salto', s: '3', r: '20', rest: '45 s' },
        { e: 'Flexiones de brazos', s: '3', r: '15', rest: '45 s' },
        { e: 'Burpees', s: '3', r: '12', rest: '45 s' },
        { e: 'Remo en máquina (hiit)', s: '3', r: '10', rest: '45 s' },
        { e: 'Mountain climbers', s: '3', r: '40', rest: '45 s' },
      ]},
      { nombre: 'Día B — Cardio base', ejercicios: [
        { e: 'Bicicleta fija', s: '1', r: '20 min', rest: 'ritmo conversacional' },
        { e: 'Cinta (inclinación)', s: '1', r: '20 min', rest: 'subida progresiva' },
        { e: 'Remo técnico', s: '1', r: '10 min', rest: 'ritmo suave' },
      ]},
      { nombre: 'Día C — Fuerza resistencia', ejercicios: [
        { e: 'Sentadilla goblet', s: '4', r: '15-20', rest: '45 s' },
        { e: 'Peso muerto rumano con mancuernas', s: '4', r: '15', rest: '45 s' },
        { e: 'Press hombros con mancuernas', s: '4', r: '15', rest: '45 s' },
        { e: 'Remo con banda', s: '4', r: '20', rest: '45 s' },
        { e: 'Plancha', s: '3', r: '60 s', rest: '45 s' },
      ]},
    ],
    tips: 'Trabajá en zonas de esfuerzo moderado-alto (RPE 7-8). Sumá sesiones de cardio continuo 2-3 veces por semana al circuito.',
  },
  {
    id: 'definicion',
    tag: 'Definición',
    titulo: 'Rutina de Definición',
    descripcion: 'Reducí grasa corporal manteniendo masa muscular: combiná fuerza, cardio y hábitos de alimentación.',
    objetivo: 'Definición',
    frecuencia: '4-5 días de fuerza + 2-3 de cardio',
    nivel: 'Intermedio / Avanzado',
    duracion: '60-80 min',
    dias: [
      { nombre: 'Día A — Tren inferior', ejercicios: [
        { e: 'Sentadilla trasera', s: '4', r: '10', rest: '90 s' },
        { e: 'Peso muerto rumano', s: '4', r: '12', rest: '90 s' },
        { e: 'Zancadas caminando', s: '3', r: '12 (c/pierna)', rest: '60 s' },
        { e: 'Curl femoral', s: '3', r: '15', rest: '60 s' },
        { e: 'Pantorrillas', s: '4', r: '20', rest: '45 s' },
      ]},
      { nombre: 'Día B — Tren superior', ejercicios: [
        { e: 'Press de banca', s: '4', r: '8-10', rest: '90 s' },
        { e: 'Remo con barra', s: '4', r: '10', rest: '90 s' },
        { e: 'Press inclinado mancuernas', s: '3', r: '12', rest: '60 s' },
        { e: 'Jalón al pecho', s: '3', r: '12', rest: '60 s' },
        { e: 'Super serie: bíceps + tríceps', s: '3', r: '12', rest: '45 s' },
      ]},
      { nombre: 'Día C — Full body + cardio final', ejercicios: [
        { e: 'Sentadilla frontal', s: '3', r: '10', rest: '60 s' },
        { e: 'Press militar', s: '3', r: '10', rest: '60 s' },
        { e: 'Remo en máquina', s: '3', r: '12', rest: '60 s' },
        { e: 'Hip thrust', s: '3', r: '12', rest: '60 s' },
        { e: 'HIIT en cinta (1 min esfuerzo / 1 min suave)', s: '1', r: '15 min', rest: '—' },
      ]},
    ],
    tips: 'El déficit calórico moderado (300-500 kcal) es clave. Mantené la proteína alta y no bajes demasiado las cargas: el estímulo de fuerza evita la pérdida muscular.',
  },
];

/* ---------- datos demo ---------- */
function generarDemoGastos() {
  const hoy = hoyISO();
  const d = (off) => sumarDiasISO(hoy, off);
  return [
    { id: 1,  fecha: d(-2),  categoria: 'servicios', descripcion: 'Luz', monto: 46200 },
    { id: 2,  fecha: d(-3),  categoria: 'insumos',   descripcion: 'Agua potable (bidones + descartables)', monto: 15800 },
    { id: 3,  fecha: d(-5),  categoria: 'alquiler',  descripcion: 'Alquiler del local', monto: 250000 },
    { id: 4,  fecha: d(-6),  categoria: 'insumos',   descripcion: 'Reposición de limpieza', monto: 12400 },
    { id: 5,  fecha: d(-9),  categoria: 'maquinas',  descripcion: 'Mantenimiento prensa + poleas', monto: 18500 },
    { id: 6,  fecha: d(-12), categoria: 'servicios', descripcion: 'Internet y cámaras', monto: 21800 },
    { id: 7,  fecha: d(-16), categoria: 'otros',     descripcion: 'Publicidad en redes', monto: 12000 },
    { id: 8,  fecha: d(-33), categoria: 'alquiler',  descripcion: 'Alquiler del local', monto: 250000 },
    { id: 9,  fecha: d(-35), categoria: 'servicios', descripcion: 'Luz', monto: 44100 },
    { id: 10, fecha: d(-38), categoria: 'insumos',   descripcion: 'Agua potable (bidones)', monto: 15000 },
    { id: 11, fecha: d(-60), categoria: 'alquiler',  descripcion: 'Alquiler del local', monto: 250000 },
    { id: 12, fecha: d(-62), categoria: 'maquinas',  descripcion: 'Barras y discos nuevos', monto: 185000 },
  ];
}
function generarDemo() {
  const hoy = hoyISO();
  const pago = (f, plan, monto) => ({ fecha: f, periodo: PLANES[plan].label, monto });
  const fichas = [
    { dni: '30.111.222', fechaNacimiento: '1994-03-12', domicilio: 'Av. San Martín 120', ocupacion: 'Docente',
      tutorNombre: '', tutorTelefono: '', emergencia: 'si', emergenciaCual: 'SAME 107',
      famDiabetes: true, famCardiopatia: false, famMuerteSubita: false,
      alergias: 'no', alergiasCual: '', convulsiones: 'no', operaciones: 'no', operacionesCual: '',
      lesionEsguinces: false, lesionLuxaciones: false, lesionDesgarros: false, lesionFracturas: false,
      lesionNinguna: true, lesionOtra: false, lesionOtraCual: '',
      comoConocio: 'recomendacion', objetivo: 'Hipertrofia y fuerza', observaciones: '',
      medidas: [
        { fecha: sumarDiasISO(hoy, -70), peso: 62, espalda: 95, cintura: 72, abdomen: 78, gluteo: 96, pierna: 55 },
        { fecha: sumarDiasISO(hoy, -5), peso: 63.5, espalda: 97, cintura: 71, abdomen: 76, gluteo: 97, pierna: 56 },
      ] },
    { dni: '35.222.333', fechaNacimiento: '2001-07-25', domicilio: 'Belgrano 45', ocupacion: 'Estudiante',
      tutorNombre: 'Ana Ferreyra', tutorTelefono: '+54 9 3644 200002', emergencia: 'no', emergenciaCual: '',
      famDiabetes: false, famCardiopatia: true, famMuerteSubita: false,
      alergias: 'si', alergiasCual: 'Polen', convulsiones: 'no', operaciones: 'si', operacionesCual: 'Apendicitis (2019)',
      lesionEsguinces: true, lesionLuxaciones: false, lesionDesgarros: false, lesionFracturas: false,
      lesionNinguna: false, lesionOtra: false, lesionOtraCual: '',
      comoConocio: 'redes', objetivo: 'Bajar de peso', observaciones: 'Prefiere turno tarde.',
      medidas: [
        { fecha: sumarDiasISO(hoy, -8), peso: 80, espalda: 104, cintura: 92, abdomen: 98, gluteo: 104, pierna: 62 },
      ] },
  ];
  const clientes = [
    { id: 1, nombre: 'Luciana', apellido: 'Ramírez', telefono: '+54 9 3644 100001', email: 'luciana.ramirez@mail.com',
      plan: 'mensual', precio: 50000, fechaInicio: sumarDiasISO(hoy, -75), proximaCuota: sumarDiasISO(hoy, 25), pagada: true,
      ultimoPago: sumarDiasISO(hoy, -5), notas: 'Objetivo: hipertrofia. Turno noche.',
      pagos: [pago(sumarDiasISO(hoy, -5), 'mensual', 50000), pago(sumarDiasISO(hoy, -35), 'mensual', 50000)] },
    { id: 2, nombre: 'Marcos', apellido: 'Ferreyra', telefono: '+54 9 3644 100002', email: 'marcos@mail.com',
      plan: 'semanal', precio: 22000, fechaInicio: sumarDiasISO(hoy, -10), proximaCuota: sumarDiasISO(hoy, 3), pagada: true,
      ultimoPago: sumarDiasISO(hoy, -4), notas: '',
      pagos: [pago(sumarDiasISO(hoy, -4), 'semanal', 22000)] },
    { id: 3, nombre: 'Camila', apellido: 'Sosa', telefono: '+54 9 3644 100003', email: 'camila.sosa@mail.com',
      plan: 'mensual', precio: 50000, fechaInicio: sumarDiasISO(hoy, -40), proximaCuota: sumarDiasISO(hoy, -10), pagada: false,
      ultimoPago: sumarDiasISO(hoy, -40), notas: 'Debe la cuota desde hace 10 días.',
      pagos: [pago(sumarDiasISO(hoy, -40), 'mensual', 50000)] },
    { id: 4, nombre: 'Diego', apellido: 'Pérez', telefono: '+54 9 3644 100004', email: 'diego.perez@mail.com',
      plan: 'semanal', precio: 22000, fechaInicio: sumarDiasISO(hoy, -23), proximaCuota: sumarDiasISO(hoy, 5), pagada: true,
      ultimoPago: sumarDiasISO(hoy, -2), notas: '',
      pagos: [pago(sumarDiasISO(hoy, -2), 'semanal', 22000), pago(sumarDiasISO(hoy, -9), 'semanal', 22000), pago(sumarDiasISO(hoy, -16), 'semanal', 22000)] },
    { id: 5, nombre: 'Agustina', apellido: 'Torres', telefono: '+54 9 3644 100005', email: 'agustina@mail.com',
      plan: 'mensual', precio: 50000, fechaInicio: sumarDiasISO(hoy, -92), proximaCuota: sumarDiasISO(hoy, 30), pagada: true,
      ultimoPago: hoyISO(), notas: 'Entrena fuerza y mañana.',
      pagos: [pago(hoyISO(), 'mensual', 50000), pago(sumarDiasISO(hoy, -30), 'mensual', 50000), pago(sumarDiasISO(hoy, -60), 'mensual', 50000)] },
    { id: 6, nombre: 'Franco', apellido: 'Gómez', telefono: '+54 9 3644 100006', email: 'franco.gomez@mail.com',
      plan: 'diario', precio: 12000, fechaInicio: sumarDiasISO(hoy, -15), proximaCuota: sumarDiasISO(hoy, -1), pagada: false,
      ultimoPago: sumarDiasISO(hoy, -2), notas: 'Pasa turno libre, casi siempre al día.',
      pagos: [pago(sumarDiasISO(hoy, -2), 'diario', 12000)] },
    { id: 7, nombre: 'Sofía', apellido: 'Maidana', telefono: '+54 9 3644 100007', email: 'sofia@mail.com',
      plan: 'mensual', precio: 50000, fechaInicio: sumarDiasISO(hoy, -20), proximaCuota: sumarDiasISO(hoy, 20), pagada: true,
      ultimoPago: sumarDiasISO(hoy, -10), notas: '',
      pagos: [pago(sumarDiasISO(hoy, -10), 'mensual', 50000)] },
    { id: 8, nombre: 'Iván', apellido: 'Ríos', telefono: '+54 9 3644 100008', email: 'ivan.rios@mail.com',
      plan: 'semanal', precio: 22000, fechaInicio: sumarDiasISO(hoy, -6), proximaCuota: sumarDiasISO(hoy, 6), pagada: true,
      ultimoPago: sumarDiasISO(hoy, -1), notas: 'Nuevo ingreso.',
      pagos: [pago(sumarDiasISO(hoy, -1), 'semanal', 22000)] },
  ];
  return clientes.map((c, i) => ({ ...c, ...fichas[i % fichas.length] }));
}

/* ---------- ficha de salud ---------- */
const COMO_CONOCIO = {
  recomendacion: 'Recomendación de un amigo/familiar',
  redes: 'Redes sociales',
  calle: 'Pasó por la calle',
  persona: 'Lo vio en persona',
  otro: 'Otro',
};
const FAMILIARES = [
  ['famDiabetes', 'Diabetes'],
  ['famCardiopatia', 'Cardiopatía'],
  ['famMuerteSubita', 'Muerte súbita'],
];
const LESIONES = [
  ['lesionEsguinces', 'Esguinces'],
  ['lesionLuxaciones', 'Luxaciones'],
  ['lesionDesgarros', 'Desgarros'],
  ['lesionFracturas', 'Fracturas'],
  ['lesionNinguna', 'Ninguna'],
  ['lesionOtra', 'Otra'],
];

function saludInicial() {
  return {
    dni: '', fechaNacimiento: '', domicilio: '', ocupacion: '',
    tutorNombre: '', tutorTelefono: '',
    emergencia: '', emergenciaCual: '',
    famDiabetes: false, famCardiopatia: false, famMuerteSubita: false,
    alergias: '', alergiasCual: '',
    convulsiones: '',
    operaciones: '', operacionesCual: '',
    lesionEsguinces: false, lesionLuxaciones: false, lesionDesgarros: false,
    lesionFracturas: false, lesionNinguna: false, lesionOtra: false, lesionOtraCual: '',
    comoConocio: '', objetivo: '', observaciones: '',
    medidas: [],
  };
}

/* ---------- componente principal ---------- */
document.addEventListener('alpine:init', () => {
  Alpine.data('gymApp', () => ({
    /* navegación */
    view: 'inicio',
    mobileOpen: false,
    toast: null,
    toastTimer: null,

    /* rutinas */
    rutinas: RUTINAS,
    filtroRutina: 'todas',
    rutinaActiva: null,
    rutinaFormAbierto: false,
    editandoRutina: null,
    formRutina: null,

    /* clientes */
    clientes: [],
    cargado: false,
    buscar: '',
    filtroEstado: 'todos',
    formAbierto: false,
    editando: null,
    form: null,
    pagoCliente: null,
    detalle: null,
    eliminarPendiente: null,

    /* finanzas */
    gastos: [],
    mesFiltro: 'todos',
    gastoFormAbierto: false,
    editandoGasto: null,
    formGasto: null,

    init() {
      this.form = this.nuevoForm();
      this.formGasto = this.nuevoFormGasto();
      this.formRutina = this.nuevoFormRutina();
      const h = (location.hash || '').replace('#', '');
      if (h === 'clientes' || h === 'rutinas' || h === 'finanzas') {
        this.view = h;
      }
      const raw = localStorage.getItem('nova_gym_clientes_v1');
      if (raw) {
        try { this.clientes = JSON.parse(raw); } catch { this.clientes = []; }
      }
      const rawG = localStorage.getItem('nova_gym_gastos_v1');
      if (rawG) {
        try { this.gastos = JSON.parse(rawG); } catch { this.gastos = []; }
      }
      const rawR = localStorage.getItem('nova_gym_rutinas_v1');
      if (rawR) {
        try { this.rutinas = JSON.parse(rawR); } catch { this.rutinas = JSON.parse(JSON.stringify(RUTINAS)); }
      } else {
        this.rutinas = JSON.parse(JSON.stringify(RUTINAS));
      }
      this.cargado = true;
    },

    /* --------------- navegación --------------- */
    irA(v) {
      this.view = v;
      this.mobileOpen = false;
      if (history.replaceState) history.replaceState(null, '', v === 'inicio' ? '#' : '#' + v);
      window.scrollTo({ top: 0, behavior: 'instant' });
    },
    anclar(id) {
      if (this.view !== 'inicio') {
        this.view = 'inicio';
        setTimeout(() => {
          const el = document.getElementById(id);
          if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 60);
      } else {
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    },
    mostrarToast(msg) {
      this.toast = msg;
      clearTimeout(this.toastTimer);
      this.toastTimer = setTimeout(() => (this.toast = null), 2600);
    },

    /* --------------- rutinas --------------- */
    slugObj(v) {
      return String(v || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim();
    },
    objetivosRutinas() {
      const set = {};
      this.rutinas.forEach((r) => {
        const slug = this.slugObj(r.objetivo);
        if (!slug) return;
        if (!set[slug]) set[slug] = r.objetivo;
      });
      return Object.entries(set).map(([slug, label]) => ({ slug, label }));
    },
    rutinasFiltradas() {
      if (this.filtroRutina === 'todas') return this.rutinas;
      return this.rutinas.filter((r) => this.slugObj(r.objetivo) === this.filtroRutina);
    },
    abrirRutina(r) { this.rutinaActiva = r; },
    cerrarRutina() { this.rutinaActiva = null; },

    /* --------------- rutinas · gestión --------------- */
    nuevoFormRutina() {
      return {
        tag: '', titulo: '', descripcion: '', objetivo: 'Fuerza',
        frecuencia: '', nivel: '', duracion: '', tips: '',
        dias: [],
      };
    },
    abrirFormRutina(r) {
      this.editandoRutina = r;
      this.formRutina = r
        ? {
            tag: r.tag || '', titulo: r.titulo || '', descripcion: r.descripcion || '',
            objetivo: r.objetivo || 'Fuerza', frecuencia: r.frecuencia || '',
            nivel: r.nivel || '', duracion: r.duracion || '', tips: r.tips || '',
            dias: (r.dias || []).map((d) => ({
              nombre: d.nombre || '',
              ejercicios: (d.ejercicios || []).map((ex) => ({ e: ex.e, s: ex.s, r: ex.r, rest: ex.rest })),
            })),
          }
        : this.nuevoFormRutina();
      this.rutinaFormAbierto = true;
    },
    agregarDiaRutina() {
      this.formRutina.dias.push({ nombre: '', ejercicios: [] });
    },
    quitarDiaRutina(i) {
      this.formRutina.dias.splice(i, 1);
    },
    agregarEjercicioRutina(i) {
      this.formRutina.dias[i].ejercicios.push({ e: '', s: '', r: '', rest: '' });
    },
    quitarEjercicioRutina(i, j) {
      this.formRutina.dias[i].ejercicios.splice(j, 1);
    },
    guardarRutina() {
      const f = this.formRutina;
      if (!f.titulo.trim()) {
        this.mostrarToast('Completá el título de la rutina.');
        return;
      }
      const dias = (f.dias || [])
        .filter((d) => d.nombre.trim() && (d.ejercicios || []).some((e) => e.e.trim() || e.s.trim() || e.r.trim()))
        .map((d) => ({
          nombre: d.nombre.trim(),
          ejercicios: (d.ejercicios || [])
            .filter((e) => e.e.trim() || e.s.trim() || e.r.trim())
            .map((e) => ({ e: e.e.trim(), s: e.s.trim(), r: e.r.trim(), rest: (e.rest || '').trim() })),
        }));
      if (!dias.length) {
        this.mostrarToast('Agregá al menos un día con sus ejercicios.');
        return;
      }
      const comunes = {
        tag: (f.tag || '').trim() || f.objetivo,
        titulo: f.titulo.trim(),
        descripcion: (f.descripcion || '').trim(),
        objetivo: f.objetivo,
        frecuencia: (f.frecuencia || '').trim(),
        nivel: (f.nivel || '').trim(),
        duracion: (f.duracion || '').trim(),
        tips: (f.tips || '').trim(),
        dias,
      };
      if (this.editandoRutina) {
        Object.assign(this.editandoRutina, comunes);
        this.mostrarToast('Rutina actualizada');
      } else {
        this.rutinas.unshift({ id: 'r' + Date.now(), ...comunes });
        this.mostrarToast('Rutina creada');
      }
      this.persistirRutinas();
      this.rutinaFormAbierto = false;
    },
    eliminarRutina(r) {
      if (!confirm('¿Eliminar esta rutina?')) return;
      this.rutinas = this.rutinas.filter((x) => x.id !== r.id);
      if (this.rutinaActiva && this.rutinaActiva.id === r.id) this.rutinaActiva = null;
      this.persistirRutinas();
      this.mostrarToast('Rutina eliminada');
    },
    restaurarRutinas() {
      if (!confirm('¿Restaurar las rutinas predeterminadas? Se descartan los cambios.')) return;
      this.rutinas = JSON.parse(JSON.stringify(RUTINAS));
      this.persistirRutinas();
      this.mostrarToast('Rutinas base restauradas');
    },
    persistirRutinas() {
      localStorage.setItem('nova_gym_rutinas_v1', JSON.stringify(this.rutinas));
    },

    /* --------------- cuotas / estado --------------- */
    diasRestantes(c) {
      return diasHastaISO(c.proximaCuota);
    },
    estadoCliente(c) {
      const d = diasHastaISO(c.proximaCuota);
      if (!c.pagada || d < 0) return 'vencida';
      if (d <= 7) return 'proxima';
      return 'aldia';
    },
    estadoLabel(c) {
      const e = this.estadoCliente(c);
      if (e === 'aldia') return 'Al día';
      if (e === 'proxima') return 'Próximo a vencer';
      return 'Vencida';
    },
    estadoBadge(e) {
      if (e === 'aldia') return 'badge-aldia';
      if (e === 'proxima') return 'badge-proxima';
      return 'badge-vencida';
    },
    proximaDelta(c) {
      const d = diasHastaISO(c.proximaCuota);
      if (d === 0) return 'vence hoy';
      if (d === 1) return 'vence mañana';
      if (d > 1) return `faltan ${d} días`;
      if (d === -1) return 'venció ayer';
      return `venció hace ${Math.abs(d)} días`;
    },

    stats() {
      const c = this.clientes;
      return {
        total: c.length,
        alDia: c.filter((x) => this.estadoCliente(x) === 'aldia').length,
        proximas: c.filter((x) => this.estadoCliente(x) === 'proxima').length,
        vencidas: c.filter((x) => this.estadoCliente(x) === 'vencida').length,
        mora: c.filter((x) => this.estadoCliente(x) === 'vencida').reduce((s, x) => s + (x.precio || 0), 0),
      };
    },

    clientesFiltrados() {
      const q = this.buscar.trim().toLowerCase();
      return this.clientes.filter((c) => {
        const cumpleEstado = this.filtroEstado === 'todos' || this.estadoCliente(c) === this.filtroEstado;
        if (!cumpleEstado) return false;
        if (!q) return true;
        const texto = `${c.nombre} ${c.apellido} ${c.telefono} ${c.email}`.toLowerCase();
        return texto.includes(q);
      });
    },

    /* --------------- formulario cliente --------------- */
    nuevoForm() {
      return {
        nombre: '', apellido: '', telefono: '', email: '',
        plan: 'mensual', precio: PLANES.mensual.monto,
        fechaInicio: hoyISO(), notas: '',
        ...saludInicial(),
      };
    },
    abrirForm(cliente) {
      const base = this.nuevoForm();
      if (cliente) {
        this.editando = cliente;
        const f = {};
        Object.keys(base).forEach((k) => {
          if (k === 'medidas') {
            f.medidas = (cliente.medidas || []).map((m) => ({ ...m }));
          } else {
            const v = cliente[k];
            f[k] = v !== undefined && v !== null ? v : base[k];
          }
        });
        this.form = f;
      } else {
        this.editando = null;
        this.form = base;
      }
      this.formAbierto = true;
    },
    planChanged() {
      this.form.precio = PLANES[this.form.plan].monto;
    },
    guardarCliente() {
      const f = this.form;
      if (!f.nombre.trim() || !f.apellido.trim()) {
        this.mostrarToast('Completá nombre y apellido.');
        return;
      }
      const comunes = {
        nombre: f.nombre.trim(), apellido: f.apellido.trim(),
        telefono: (f.telefono || '').trim(), email: (f.email || '').trim(),
        plan: f.plan, precio: Number(f.precio) || PLANES[f.plan].monto,
        fechaInicio: f.fechaInicio || hoyISO(), notas: (f.notas || '').trim(),
        medidas: this.limpiarMedidas(f.medidas),
      };
      ['dni', 'fechaNacimiento', 'domicilio', 'ocupacion', 'tutorNombre', 'tutorTelefono',
        'emergenciaCual', 'alergiasCual', 'operacionesCual', 'lesionOtraCual', 'objetivo', 'observaciones']
        .forEach((k) => { comunes[k] = (f[k] || '').trim(); });
      comunes.emergencia = f.emergencia || '';
      comunes.alergias = f.alergias || '';
      comunes.convulsiones = f.convulsiones || '';
      comunes.operaciones = f.operaciones || '';
      comunes.comoConocio = f.comoConocio || '';
      ['famDiabetes', 'famCardiopatia', 'famMuerteSubita', 'lesionEsguinces',
        'lesionLuxaciones', 'lesionDesgarros', 'lesionFracturas', 'lesionNinguna', 'lesionOtra']
        .forEach((k) => { comunes[k] = !!f[k]; });

      if (this.editando) {
        Object.assign(this.editando, comunes);
        this.persistir();
        this.mostrarToast('Cliente actualizado');
      } else {
        const nuevo = {
          id: Date.now(),
          ...comunes,
          proximaCuota: sumarIntervaloISO(comunes.fechaInicio, f.plan),
          ultimoPago: null, pagada: false, pagos: [],
        };
        this.clientes.unshift(nuevo);
        this.persistir();
        this.mostrarToast('Cliente creado. Recordá registrar su primera cuota.');
      }
      this.formAbierto = false;
    },
    numMed(v) { return v === '' || v === null || v === undefined ? null : Number(v); },
    limpiarMedidas(lista) {
      return (lista || [])
        .filter((m) => m && [m.peso, m.espalda, m.cintura, m.abdomen, m.gluteo, m.pierna]
          .some((v) => v !== '' && v !== null && v !== undefined))
        .map((m) => ({
          fecha: m.fecha || hoyISO(),
          peso: this.numMed(m.peso), espalda: this.numMed(m.espalda), cintura: this.numMed(m.cintura),
          abdomen: this.numMed(m.abdomen), gluteo: this.numMed(m.gluteo), pierna: this.numMed(m.pierna),
        }));
    },
    agregarMedida() {
      if (!this.form.medidas) this.form.medidas = [];
      this.form.medidas.push({ fecha: hoyISO(), peso: null, espalda: null, cintura: null, abdomen: null, gluteo: null, pierna: null });
    },
    quitarMedida(i) { this.form.medidas.splice(i, 1); },
    medidaValor(m, campo) {
      const v = m ? m[campo] : null;
      return v === null || v === undefined || v === '' ? '—' : v;
    },
    siNo(v) { return v === 'si' ? 'Sí' : v === 'no' ? 'No' : ''; },
    comoConocioLabel(v) { return COMO_CONOCIO[v] || ''; },
    familiaresTexto(c) {
      const out = FAMILIARES.filter(([k]) => c && c[k]).map(([, l]) => l);
      return out.length ? out.join(', ') : 'Sin antecedentes declarados';
    },
    lesionesTexto(c) {
      const out = LESIONES.filter(([k]) => c && c[k]).map(([, l]) => l);
      if (c && c.lesionOtra && c.lesionOtraCual) {
        const i = out.indexOf('Otra');
        if (i > -1) out[i] = 'Otra: ' + c.lesionOtraCual;
      }
      return out.length ? out.join(', ') : 'Sin lesiones declaradas';
    },
    tieneFicha(c) {
      return !!(c && (c.dni || c.fechaNacimiento || c.domicilio || c.ocupacion || c.tutorNombre ||
        c.tutorTelefono || c.emergencia || c.alergias || c.convulsiones || c.operaciones ||
        c.comoConocio || c.objetivo || c.observaciones || c.famDiabetes || c.famCardiopatia ||
        c.famMuerteSubita || c.lesionEsguinces || c.lesionLuxaciones || c.lesionDesgarros ||
        c.lesionFracturas || c.lesionNinguna || c.lesionOtra || (c.medidas && c.medidas.length)));
    },
    fichaDatos(c) {
      if (!c) return [];
      const out = [];
      const add = (label, valor) => {
        if (valor !== undefined && valor !== null && String(valor).trim() !== '') out.push({ label, valor: String(valor) });
      };
      add('DNI', c.dni);
      add('Nacimiento', c.fechaNacimiento ? fmtFecha(c.fechaNacimiento) : '');
      add('Domicilio', c.domicilio);
      add('Ocupación', c.ocupacion);
      add('Teléfono', c.telefono);
      add('Email', c.email);
      add('Tutor', c.tutorNombre);
      add('Teléfono del tutor', c.tutorTelefono);
      add('Servicio de emergencia', this.siNo(c.emergencia) + (c.emergencia === 'si' && c.emergenciaCual ? ' — ' + c.emergenciaCual : ''));
      add('Alergias', this.siNo(c.alergias) + (c.alergias === 'si' && c.alergiasCual ? ' — ' + c.alergiasCual : ''));
      add('Convulsiones', this.siNo(c.convulsiones));
      add('Operaciones', this.siNo(c.operaciones) + (c.operaciones === 'si' && c.operacionesCual ? ' — ' + c.operacionesCual : ''));
      add('Antecedentes familiares', (c.famDiabetes || c.famCardiopatia || c.famMuerteSubita) ? this.familiaresTexto(c) : '');
      add('Lesiones (últimos 2 meses)', (c.lesionEsguinces || c.lesionLuxaciones || c.lesionDesgarros || c.lesionFracturas || c.lesionNinguna || c.lesionOtra) ? this.lesionesTexto(c) : '');
      add('Cómo conoció el gimnasio', this.comoConocioLabel(c.comoConocio));
      add('Objetivo', c.objetivo);
      add('Observaciones', c.observaciones);
      return out;
    },
    pedirEliminar(c) { this.eliminarPendiente = c; },
    eliminarCliente() {
      const el = this.eliminarPendiente;
      if (!el) return;
      this.clientes = this.clientes.filter((c) => c.id !== el.id);
      this.persistir();
      this.mostrarToast('Cliente eliminado');
      this.eliminarPendiente = null;
      if (this.detalle && this.detalle.id === el.id) this.detalle = null;
    },

    /* --------------- cobros / pago --------------- */
    abrirPago(c) {
      this.pagoCliente = c;
    },
    nuevaCuotaPago() {
      const c = this.pagoCliente;
      return sumarIntervaloISO(hoyISO(), c.plan);
    },
    registrarPago() {
      const c = this.pagoCliente;
      if (!c) return;
      const hoy = hoyISO();
      c.ultimoPago = hoy;
      c.proximaCuota = sumarIntervaloISO(hoy, c.plan);
      c.pagada = true;
      c.pagos = c.pagos || [];
      c.pagos.unshift({ fecha: hoy, periodo: PLANES[c.plan].label, monto: c.precio });
      this.persistir();
      this.mostrarToast(`Cuota ${PLANES[c.plan].label.toLowerCase()} registrada: $${c.precio.toLocaleString('es-AR')}`);
      this.pagoCliente = null;
    },
    abrirDetalle(c) { this.detalle = c; },
    quitarPago(cliente, pago) {
      if (!confirm(`¿Anular este pago de $${(pago.monto || 0).toLocaleString('es-AR')} del ${fmtFecha(pago.fecha)}?`)) return;
      const arr = cliente.pagos || [];
      const i = arr.indexOf(pago);
      if (i > -1) arr.splice(i, 1);
      cliente.pagos = arr;
      this.persistir();
      this.mostrarToast('Pago anulado');
    },

    /* --------------- finanzas --------------- */
    claveMes(iso) { return String(iso || '').slice(0, 7); },
    labelMes(clave) {
      if (clave === 'todos') return 'Todos los meses';
      const [y, m] = clave.split('-').map(Number);
      return new Intl.DateTimeFormat('es-AR', { month: 'long', year: 'numeric' }).format(new Date(y, m - 1, 1));
    },
    labelMesCorto(clave) {
      const [y, m] = clave.split('-').map(Number);
      return new Intl.DateTimeFormat('es-AR', { month: 'short', year: '2-digit' }).format(new Date(y, m - 1, 1));
    },
    mesesOpciones() {
      const out = [];
      const d = new Date();
      d.setDate(1);
      for (let i = 0; i < 13; i++) {
        out.push(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`);
        d.setMonth(d.getMonth() - 1);
      }
      return out;
    },
    ingresosMes(clave) {
      const out = [];
      this.clientes.forEach((c) => {
        (c.pagos || []).forEach((p) => {
          if (clave !== 'todos' && this.claveMes(p.fecha) !== clave) return;
          out.push({ fecha: p.fecha, cliente: `${c.nombre} ${c.apellido}`, periodo: p.periodo, monto: p.monto || 0, ref: { c, p } });
        });
      });
      return out.sort((a, b) => String(b.fecha).localeCompare(String(a.fecha)));
    },
    gastosMes(clave) {
      return this.gastos
        .filter((g) => clave === 'todos' || this.claveMes(g.fecha) === clave)
        .sort((a, b) => String(b.fecha).localeCompare(String(a.fecha)));
    },
    totalIngresos(clave) { return this.ingresosMes(clave).reduce((s, p) => s + p.monto, 0); },
    totalGastos(clave) { return this.gastosMes(clave).reduce((s, g) => s + g.monto, 0); },
    balance(clave) { return this.totalIngresos(clave) - this.totalGastos(clave); },
    cuotasCobradas(clave) { return this.ingresosMes(clave).length; },
    ultimosMeses(n) {
      return this.mesesOpciones()
        .slice(0, n)
        .reverse()
        .map((m) => ({ clave: m, label: this.labelMesCorto(m), ingreso: this.totalIngresos(m), egreso: this.totalGastos(m) }));
    },
    chartMax() {
      return Math.max(1, ...this.ultimosMeses(6).map((b) => Math.max(b.ingreso, b.egreso)));
    },
    barAlto(v) {
      return v > 0 ? Math.max(8, (v / this.chartMax()) * 100) : 2;
    },
    categoriaLabel(cat) {
      return ({ alquiler: 'Alquiler', servicios: 'Servicios', maquinas: 'Máquinas', insumos: 'Insumos', otros: 'Otros' })[cat] || cat;
    },
    categoriaBadge(cat) {
      if (cat === 'alquiler') return 'cat-alquiler';
      if (cat === 'servicios') return 'cat-servicios';
      if (cat === 'maquinas') return 'cat-maquinas';
      if (cat === 'insumos') return 'cat-insumos';
      return 'cat-otros';
    },

    /* --------------- gastos --------------- */
    nuevoFormGasto() {
      return { fecha: hoyISO(), categoria: 'alquiler', descripcion: '', monto: null };
    },
    abrirFormGasto(g) {
      this.editandoGasto = g;
      this.formGasto = g
        ? { fecha: g.fecha, categoria: g.categoria, descripcion: g.descripcion, monto: g.monto }
        : this.nuevoFormGasto();
      this.gastoFormAbierto = true;
    },
    guardarGasto() {
      const f = this.formGasto;
      const monto = Number(f.monto);
      if (!monto || monto <= 0) {
        this.mostrarToast('Ingresá un monto válido.');
        return;
      }
      const descripcion = (f.descripcion || '').trim() || this.categoriaLabel(f.categoria);
      if (this.editandoGasto) {
        Object.assign(this.editandoGasto, { fecha: f.fecha, categoria: f.categoria, descripcion, monto });
      } else {
        this.gastos.unshift({ id: Date.now(), fecha: f.fecha, categoria: f.categoria, descripcion, monto });
      }
      this.persistirGastos();
      this.gastoFormAbierto = false;
      this.mostrarToast('Gasto guardado');
    },
    eliminarGasto(g) {
      if (!confirm('¿Eliminar este gasto?')) return;
      this.gastos = this.gastos.filter((x) => x.id !== g.id);
      this.persistirGastos();
      this.mostrarToast('Gasto eliminado');
    },

    /* --------------- persistencia --------------- */
    persistir() {
      localStorage.setItem('nova_gym_clientes_v1', JSON.stringify(this.clientes));
    },
    persistirGastos() {
      localStorage.setItem('nova_gym_gastos_v1', JSON.stringify(this.gastos));
    },
    cargarDemo() {
      this.clientes = generarDemo();
      if (!this.gastos.length) this.gastos = generarDemoGastos();
      this.persistir();
      this.persistirGastos();
      this.mostrarToast('Datos de ejemplo cargados');
    },
    cargarDemoGastos() {
      this.gastos = generarDemoGastos();
      this.persistirGastos();
      this.mostrarToast('Gastos de ejemplo cargados');
    },
    vaciarDatos() {
      if (!confirm('¿Vaciar todos los clientes y gastos? Esta acción no se puede deshacer.')) return;
      this.clientes = [];
      this.gastos = [];
      this.persistir();
      this.persistirGastos();
      this.mostrarToast('Base de datos vaciada');
    },
    vaciarGastos() {
      if (!confirm('¿Eliminar todos los gastos?')) return;
      this.gastos = [];
      this.persistirGastos();
      this.mostrarToast('Gastos vaciados');
    },
  }));
});

/* exponer utilidades para las expresiones de Alpine */
window.PLANES = PLANES;
window.fmtFecha = fmtFecha;
window.fmtDia = fmtDia;
window.hoyISO = hoyISO;