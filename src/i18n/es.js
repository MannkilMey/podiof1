export default {
  // ============================================
  // COMMON
  // ============================================
  common: {
    loading: 'Cargando...',
    save: 'Guardar',
    cancel: 'Cancelar',
    confirm: 'Confirmar',
    delete: 'Eliminar',
    edit: 'Editar',
    close: 'Cerrar',
    back: 'Volver',
    next: 'Siguiente',
    skip: 'Saltar',
    search: 'Buscar',
    error: 'Error',
    success: 'Éxito',
    yes: 'Sí',
    no: 'No',
    or: 'o',
    pts: 'pts',
    position: 'Posición',
    points: 'Puntos',
    exact: 'Exactos',
    races: 'Carreras',
    members: 'Miembros',
    pending: 'Pendiente',
    completed: 'Completada',
    scheduled: 'Programada',
    cancelled: 'Cancelada',
    noData: 'No hay datos disponibles',
    comingSoon: 'Próximamente'
  },

  // ============================================
  // NAV
  // ============================================
  nav: {
    profile: 'Mi perfil',
    settings: 'Configuración',
    adminPanel: 'Panel de Admin',
    signOut: 'Cerrar sesión',
    notifications: 'Notificaciones',
    allGroups: 'Todos los grupos',
    backToGroups: '← Volver a todos los grupos'
  },

  // ============================================
  // AUTH
  // ============================================
  auth: {
    login: 'Iniciar Sesión',
    register: 'Crear Cuenta',
    email: 'Email',
    password: 'Contraseña',
    confirmPassword: 'Confirmar Contraseña',
    firstName: 'Nombre',
    lastName: 'Apellido',
    country: 'País',
    birthDate: 'Fecha de Nacimiento',
    gender: 'Sexo',
    genderOptions: {
      preferNot: 'Prefiero no decir',
      male: 'Masculino',
      female: 'Femenino',
      other: 'Otro'
    },
    loginBtn: 'Entrar',
    registerBtn: 'Crear Cuenta',
    noAccount: '¿No tienes cuenta?',
    hasAccount: '¿Ya tienes cuenta?',
    forgotPassword: '¿Olvidaste tu contraseña?',
    passwordsMismatch: 'Las contraseñas no coinciden',
    passwordTooShort: 'La contraseña debe tener al menos 6 caracteres',
    accountCreated: '¡Cuenta creada! Ya puedes iniciar sesión 🏁',
    errorCreating: 'Error al crear cuenta',
    errorLogin: 'Error al iniciar sesión',
    subtitle: 'Compite con amigos prediciendo F1',
    createSubtitle: 'Crea tu cuenta para competir'
  },

  // ============================================
  // LANDING
  // ============================================
  landing: {
    hero: 'Predicciones de Formula 1 Gratis con Amigos',
    heroSub: 'Crea tu grupo de predicciones F1, invita a tus amigos y compite prediciendo los resultados de cada Gran Premio.',
    freeTag: '100% Gratis · Predicciones en Vivo',
    startFree: 'Comenzar Gratis',
    haveAccount: 'Ya Tengo Cuenta'
  },

  // ============================================
  // APP ONBOARDING
  // ============================================
  appOnboarding: {
    slide1Title: 'Predecí la F1',
    slide1Sub: 'Armá tu top 10 antes de cada carrera y demostrá que sabés más que tus amigos',
    slide2Title: 'Competí en Grupo',
    slide2Sub: 'Creá grupos privados, invitá amigos y seguí el ranking en tiempo real',
    slide3Title: 'Ganá Badges',
    slide3Sub: 'Desbloqueá logros, subí en el ranking y aspirá al podio de tu grupo',
    slide4Title: '¡Empezá Ahora!',
    slide4Sub: 'Creá tu cuenta gratis y hacé tu primera predicción',
    createAccount: 'Crear Cuenta Gratis',
    haveAccount: 'Ya Tengo Cuenta'
  },

  // ============================================
  // DASHBOARD
  // ============================================
  dashboard: {
    loadingGroups: 'Cargando grupos...',
    noGroups: 'No tienes grupos todavía',
    noGroupsSub: 'Crea tu primer grupo de predicciones o únete a uno existente con un código de invitación.',
    createGroup: 'Crear Grupo',
    joinWithCode: 'Unirse con Código',
    myGroups: 'Mis grupos',
    active: 'activos',
    admin: 'Admin',
    creator: 'Creador'
  },

  // ============================================
  // GROUP DASHBOARD
  // ============================================
  group: {
    rulesAndPoints: 'Reglas y Puntos',
    nextRace: 'Próxima carrera',
    noRaces: 'No hay carreras programadas',
    predictionsClose: 'Predicciones cierran',
    raceStarts: 'Carrera inicia',
    viewAllRaces: 'Ver Todas las Carreras',
    viewMembers: 'Ver Miembros del Grupo',
    statistics: 'Estadísticas',
    adminGroup: 'Administrar Grupo',
    shareGroup: 'Compartir Grupo',
    linkCopied: '¡Link copiado al portapapeles! 📋',
    noPrediction: 'Aún no has enviado tu predicción para esta carrera',
    predictNow: 'Predecir Ahora →',
    predictionSent: 'Ya enviaste tu predicción para {{race}}',
    predictionsClosed: 'Las predicciones para {{race}} están cerradas',
    seasonProgress: 'Progreso de la Temporada {{year}}',
    racesCount: '{{completed}} / {{total}} carreras',
    racesRemaining: '{{count}} carreras pendientes',
    seasonComplete: '✅ Temporada completada'
  },

  // ============================================
  // TABS
  // ============================================
  tabs: {
    general: 'General',
    drivers: 'Pilotos',
    teams: 'Equipos',
    lastRace: 'Última Carrera',
    stats: 'Estadísticas',
    total: 'Total',
    races: 'Carreras',
    sprints: 'Sprints'
  },

  // ============================================
  // LEADERBOARD
  // ============================================
  leaderboard: {
    user: 'Usuario',
    raceDetail: 'Detalle por Carrera',
    badges: 'Badges',
    bestRace: 'Mejor carrera',
    average: 'Promedio',
    predictions: 'Predicciones',
    loadingDetails: 'Cargando detalles...',
    predicted: '✓ Predicho'
  },

  // ============================================
  // STANDINGS
  // ============================================
  standings: {
    driver: 'Piloto',
    team: 'Equipo',
    noDataTitle: 'No hay datos disponibles',
    noDataSub: 'Las clasificaciones aparecerán cuando haya carreras completadas'
  },

  // ============================================
  // LAST RACE
  // ============================================
  lastRace: {
    loading: 'Cargando última carrera...',
    noRaces: 'No hay carreras completadas aún',
    noRacesSub: 'La información aparecerá cuando se complete la primera carrera',
    lastCompleted: 'Última Carrera Completada',
    viewAllPredictions: 'Ver Todas las Predicciones del Grupo',
    bestPrediction: 'Mejor Predicción',
    groupAverage: 'Promedio del Grupo',
    worstPrediction: 'Peor Predicción',
    officialResult: 'Resultado Oficial'
  },

  // ============================================
  // STATS
  // ============================================
  stats: {
    loading: 'Cargando estadísticas...',
    noData: 'No hay datos disponibles',
    noDataSub: 'Las estadísticas aparecerán cuando haya carreras completadas',
    goToStats: 'Ir a Estadísticas',
    viewFull: 'Ver Estadísticas Completas →',
    lastRaces: 'Últimas {{count}} carreras',
    filtersAndMore: 'Filtros por usuario, proyecciones y más',
    charts: 'Gráficos',
    analysis: 'Análisis',
    deepAnalytics: 'Deep Analytics'
  },

  // ============================================
  // POZO (PRIZE POOL)
  // ============================================
  pozo: {
    title: 'Pozo del Grupo',
    participants: '{{count}} participantes',
    perPerson: '{{amount}} por persona',
    place: '{{pos}}° lugar',
    disclaimer: 'PodioF1 no gestiona, almacena ni transfiere dinero. El pozo es informativo y la gestión es responsabilidad de los participantes.',
    enable: 'Habilitar Pozo del Grupo',
    enableSub: 'Muestra el monto acumulado y la distribución de premios. PodioF1 no gestiona dinero, es solo informativo.',
    amountPerPerson: 'Monto por persona',
    currency: 'Moneda',
    distribution: 'Distribución de premios',
    saveConfig: 'Guardar Configuración del Pozo',
    configSaved: 'Configuración del pozo guardada',
    estimatedTotal: 'Total estimado'
  },

  // ============================================
  // CREATE GROUP MODAL
  // ============================================
  createGroup: {
    title: 'Crear Nuevo Grupo',
    subtitle: 'Configura tu grupo de predicciones F1',
    name: 'Nombre del Grupo',
    season: 'Temporada',
    positions: 'Posiciones a predecir',
    deadline: 'Cierre de Predicciones',
    deadlineHint: 'Las predicciones se cerrarán {{hours}} horas antes del inicio de cada carrera',
    deadlineOptions: {
      h24: '24 horas antes (recomendado)',
      h32: '32 horas antes',
      h48: '48 horas antes (2 días)'
    },
    includeSprints: 'Incluir Carreras Sprint',
    includeSprintsSub: 'La temporada 2026 tendrá 6 carreras Sprint con formato y puntuación especiales',
    sprintPositions: 'Posiciones Sprint',
    sprintPoints: 'Sistema de Puntos Sprint',
    scoringSystem: 'Sistema de Puntaje F1 Oficial',
    dualScoring: 'Puntuación por piloto sin posición exacta',
    dualScoringSub: 'Otorga puntos cuando aciertas el piloto aunque no esté en la posición exacta.',
    bonusOptions: 'Bonus Opcionales (Solo Carreras)',
    bonusFastLapDriver: 'Bonus vuelta rápida piloto (+1 pt)',
    bonusFastLapTeam: 'Bonus vuelta rápida escudería (+1 pt)',
    noSprintBonus: 'Los Sprint no tienen bonus de vuelta rápida',
    creating: 'Creando...',
    createBtn: 'Crear Grupo',
    groupCreated: '¡Grupo "{{name}}" creado! Código: {{code}}'
  },

  // ============================================
  // JOIN GROUP MODAL
  // ============================================
  joinGroup: {
    title: 'Unirse a Grupo',
    subtitle: 'Ingresa el código de invitación del grupo',
    code: 'Código de Invitación',
    verifying: 'Verificando...',
    joinBtn: 'Unirse',
    invalidCode: 'Código de invitación inválido',
    alreadyMember: 'Ya eres miembro de este grupo',
    joined: '¡Te uniste al grupo "{{name}}"!'
  },

  // ============================================
  // PROFILE
  // ============================================
  profile: {
    title: 'Mi Perfil',
    name: 'Nombre',
    lastName: 'Apellido',
    birthDate: 'Fecha de Nacimiento',
    email: 'Email',
    favoriteTeam: 'Escudería Favorita',
    favoriteDriver: 'Piloto Favorito',
    selectTeam: 'Seleccionar escudería...',
    selectDriver: 'Seleccionar piloto...',
    saveChanges: 'Guardar Cambios',
    saving: 'Guardando...',
    updated: 'Perfil actualizado correctamente',
    errorUpdating: 'Error al actualizar perfil',
    myBadges: 'Mis Badges',
    unlocked: 'desbloqueados',
    generalProgress: 'Progreso general',
    allCategories: 'Todas',
    noBadgesInCategory: 'No hay badges en esta categoría',
    completeTap: 'Tocá para completar tu perfil →'
  },

  // ============================================
  // BADGES
  // ============================================
  badges: {
    categories: {
      todas: '🏠 Todas',
      victorias: '🏆 Victorias',
      rachas: '🔥 Rachas',
      precision: '🎯 Precisión',
      participacion: '📊 Participación',
      especiales: '🏎 Especiales',
      secretos: '🤫 Secretos'
    },
    locked: '🔒 Bloqueado',
    secret: '🤫 Secreto',
    secretDesc: 'Badge secreto — desbloquéalo para descubrir'
  },

  // ============================================
  // ONBOARDING MODAL
  // ============================================
  onboarding: {
    birthday: '🎂 ¿Cuándo es tu cumpleaños?',
    birthdaySub: 'Para personalizar tu experiencia',
    favoriteTeam: '🏎 ¿Cuál es tu escudería favorita?',
    favoriteTeamSub: 'Personalizaremos los colores de tu perfil',
    favoriteDriver: '👤 ¿Quién es tu piloto favorito?',
    favoriteDriverSub: '¡Apoyalo en cada carrera!',
    howWatch: '📺 ¿Cómo ves las carreras?',
    howWatchSub: 'Podés elegir varias opciones',
    howWatchOptions: ['TV abierta', 'TV cable/satélite', 'F1 TV Pro', 'Streaming pirata', 'En el circuito', 'Resúmenes después'],
    sinceWhen: '📅 ¿Desde cuándo seguís F1?',
    sinceWhenSub: 'Queremos conocerte mejor',
    sinceWhenOptions: ['Menos de 1 año', '1-3 años', '3-5 años', '5-10 años', 'Más de 10 años', 'Toda mi vida'],
    hasVehicle: '🚗 ¿Tenés vehículo propio?',
    hasVehicleSub: 'Información para futuras funcionalidades',
    hasVehicleOptions: ['Sí, auto', 'Sí, moto', 'Sí, ambos', 'No tengo'],
    skipBtn: 'Saltar',
    continueBtn: 'Continuar →',
    finishBtn: 'Finalizar',
    savingBtn: 'Guardando...',
    of: 'de'
  },

  // ============================================
  // NOTIFICATIONS
  // ============================================
  notifications: {
    predictionReminder: '⏰ ¡Faltan {{hours}}h para el cierre de predicciones!',
    predictionReminderBody: 'Enviá tu predicción para {{race}} antes de que cierre.',
    raceStarting: '🏁 ¡La carrera está por empezar!',
    raceStartingBody: '{{race}} comienza pronto. ¿Ya enviaste tu predicción?',
    resultsReady: '📊 ¡Resultados disponibles!',
    resultsReadyBody: 'Los resultados de {{race}} ya están. Mirá cómo te fue.',
    badgeUnlocked: '🏅 ¡Nuevo badge desbloqueado!',
    badgeUnlockedBody: 'Desbloqueaste "{{badge}}" en {{group}}.',
    weeklyReminder: '📅 Resumen semanal',
    weeklyReminderBody: 'Estás en el puesto {{position}} de {{group}}. ¡Seguí compitiendo!'
  },

  // ============================================
  // ADMIN PANEL
  // ============================================
  admin: {
    title: 'Administrar Grupo',
    back: '← Volver',
    groupInfo: 'Información del Grupo',
    name: 'Nombre',
    season: 'Temporada',
    inviteCode: 'Código de Invitación',
    pendingRequests: 'Solicitudes Pendientes',
    currentMembers: 'Miembros',
    approve: 'Aprobar',
    reject: 'Rechazar',
    remove: 'Eliminar',
    makeAdmin: 'Hacer Admin',
    removeAdmin: 'Quitar Admin',
    confirmRemove: '¿Eliminar miembro?',
    confirmRemoveMsg: '¿Estás seguro de que quieres eliminar a {{name}} del grupo?',
    confirmAdmin: '¿{{action}} permisos de admin?',
    confirmAdminMsg: '¿Estás seguro de que quieres {{action}} permisos de administrador a {{name}}?',
    fastestLap: 'Vuelta Rápida',
    selectFastestDriver: '-- Seleccionar piloto con vuelta rápida --',
    manageResults: 'Gestionar Resultados de Carreras',
    manageResultsSub: 'Ingresa los resultados de las carreras manualmente.',
    editResults: 'Editar Resultados',
    enterResults: 'Ingresar Resultados',
    finished: '✓ Finalizada',
    sprint: '⚡ SPRINT'
  },

  // ============================================
  // PWA
  // ============================================
  pwa: {
    installTitle: 'Instalá PodioF1',
    installSubAndroid: 'Acceso rápido desde tu pantalla de inicio',
    installSubIOS: 'Tocá el ícono de compartir y luego "Agregar a inicio"',
    installBtn: 'Instalar',
    notNow: 'Ahora no',
    understood: 'Entendido'
  },

  // ============================================
  // PREMIUM
  // ============================================
  premium: {
    title: 'PodioF1 Premium',
    subtitle: 'Llevá tu experiencia al siguiente nivel',
    subscribe: 'Suscribirme Ahora',
    monthly: 'Mensual',
    seasonal: 'Temporada',
    perMonth: 'por mes',
    popular: 'Popular',
    savings: 'Ahorrás {{pct}}%',
    cancelAnytime: 'Cancelá cuando quieras · Sin compromisos',
    getPremium: 'Hacete Premium',
    from: 'Desde',
    benefits: [
      '📊 Análisis avanzado de predicciones',
      '🔬 Deep Analytics con métricas de pilotos',
      '📥 Exportar datos a Excel',
      '👥 Grupos ilimitados',
      '⭐ Badge exclusivo "Supporter"',
      '🚫 Sin publicidad'
    ]
  },

  // ============================================
  // CURRENCIES
  // ============================================
  currencies: {
    USD: '🇺🇸 USD (Dólar)',
    PYG: '🇵🇾 PYG (Guaraní)',
    BRL: '🇧🇷 BRL (Real)',
    ARS: '🇦🇷 ARS (Peso Arg)',
    EUR: '🇪🇺 EUR (Euro)'
  },

  // ============================================
  // ERRORS
  // ============================================
  errors: {
    generic: 'Algo salió mal. Intentá de nuevo.',
    loadingDashboard: 'Error al cargar el dashboard',
    loadingGroup: 'Error al cargar datos del grupo',
    notAdmin: 'No tienes permisos de administrador',
    createGroup: 'Error al crear grupo',
    joinGroup: 'Error al unirse al grupo'
  }
};