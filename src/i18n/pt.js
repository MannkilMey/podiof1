export default {
  // ============================================
  // COMMON
  // ============================================
  common: {
    loading: 'Carregando...',
    save: 'Salvar',
    cancel: 'Cancelar',
    confirm: 'Confirmar',
    delete: 'Excluir',
    edit: 'Editar',
    close: 'Fechar',
    back: 'Voltar',
    next: 'Próximo',
    skip: 'Pular',
    search: 'Buscar',
    error: 'Erro',
    success: 'Sucesso',
    yes: 'Sim',
    no: 'Não',
    or: 'ou',
    pts: 'pts',
    position: 'Posição',
    points: 'Pontos',
    exact: 'Exatos',
    races: 'Corridas',
    members: 'Membros',
    pending: 'Pendente',
    completed: 'Concluída',
    scheduled: 'Programada',
    cancelled: 'Cancelada',
    noData: 'Nenhum dado disponível',
    comingSoon: 'Em breve'
  },

  // ============================================
  // NAV
  // ============================================
  nav: {
    profile: 'Meu Perfil',
    settings: 'Configurações',
    adminPanel: 'Painel Admin',
    signOut: 'Sair',
    notifications: 'Notificações',
    allGroups: 'Todos os grupos',
    backToGroups: '← Voltar para todos os grupos'
  },

  // ============================================
  // AUTH
  // ============================================
  auth: {
    login: 'Entrar',
    register: 'Criar Conta',
    email: 'E-mail',
    password: 'Senha',
    confirmPassword: 'Confirmar Senha',
    firstName: 'Nome',
    lastName: 'Sobrenome',
    country: 'País',
    birthDate: 'Data de Nascimento',
    gender: 'Gênero',
    genderOptions: {
      preferNot: 'Prefiro não dizer',
      male: 'Masculino',
      female: 'Feminino',
      other: 'Outro'
    },
    loginBtn: 'Entrar',
    registerBtn: 'Criar Conta',
    noAccount: 'Não tem uma conta?',
    hasAccount: 'Já tem uma conta?',
    forgotPassword: 'Esqueceu sua senha?',
    passwordsMismatch: 'As senhas não coincidem',
    passwordTooShort: 'A senha deve ter pelo menos 6 caracteres',
    accountCreated: 'Conta criada! Já pode fazer login 🏁',
    errorCreating: 'Erro ao criar conta',
    errorLogin: 'Erro ao fazer login',
    subtitle: 'Compita com amigos prevendo F1',
    createSubtitle: 'Crie sua conta para competir'
  },

  // ============================================
  // LANDING
  // ============================================
  landing: {
    hero: 'Previsões de Fórmula 1 Grátis com Amigos',
    heroSub: 'Crie seu grupo de previsões F1, convide amigos e compita prevendo os resultados de cada Grande Prêmio.',
    freeTag: '100% Grátis · Previsões ao Vivo',
    startFree: 'Começar Grátis',
    haveAccount: 'Já Tenho Conta'
  },

  // ============================================
  // APP ONBOARDING
  // ============================================
  appOnboarding: {
    slide1Title: 'Preveja a F1',
    slide1Sub: 'Monte seu top 10 antes de cada corrida e prove que sabe mais que seus amigos',
    slide2Title: 'Compita em Grupo',
    slide2Sub: 'Crie grupos privados, convide amigos e acompanhe o ranking em tempo real',
    slide3Title: 'Ganhe Badges',
    slide3Sub: 'Desbloqueie conquistas, suba no ranking e chegue ao pódio do seu grupo',
    slide4Title: 'Comece Agora!',
    slide4Sub: 'Crie sua conta grátis e faça sua primeira previsão',
    createAccount: 'Criar Conta Grátis',
    haveAccount: 'Já Tenho Conta'
  },

  // ============================================
  // DASHBOARD
  // ============================================
  dashboard: {
    loadingGroups: 'Carregando grupos...',
    noGroups: 'Você ainda não tem grupos',
    noGroupsSub: 'Crie seu primeiro grupo de previsões ou entre em um existente com um código de convite.',
    createGroup: 'Criar Grupo',
    joinWithCode: 'Entrar com Código',
    myGroups: 'Meus grupos',
    active: 'ativos',
    admin: 'Admin',
    creator: 'Criador'
  },

  // ============================================
  // GROUP DASHBOARD
  // ============================================
  group: {
    rulesAndPoints: 'Regras e Pontos',
    nextRace: 'Próxima corrida',
    noRaces: 'Nenhuma corrida programada',
    predictionsClose: 'Previsões fecham',
    raceStarts: 'Corrida começa',
    viewAllRaces: 'Ver Todas as Corridas',
    viewMembers: 'Ver Membros do Grupo',
    statistics: 'Estatísticas',
    adminGroup: 'Gerenciar Grupo',
    shareGroup: 'Compartilhar Grupo',
    linkCopied: 'Link copiado! 📋',
    noPrediction: 'Você ainda não enviou sua previsão para esta corrida',
    predictNow: 'Prever Agora →',
    predictionSent: 'Você já enviou sua previsão para {{race}}',
    predictionsClosed: 'As previsões para {{race}} estão fechadas',
    seasonProgress: 'Progresso da Temporada {{year}}',
    racesCount: '{{completed}} / {{total}} corridas',
    racesRemaining: '{{count}} corridas restantes',
    seasonComplete: '✅ Temporada concluída'
  },

  // ============================================
  // TABS
  // ============================================
  tabs: {
    general: 'Geral',
    drivers: 'Pilotos',
    teams: 'Equipes',
    lastRace: 'Última Corrida',
    stats: 'Estatísticas',
    total: 'Total',
    races: 'Corridas',
    sprints: 'Sprints'
  },

  // ============================================
  // LEADERBOARD
  // ============================================
  leaderboard: {
    user: 'Usuário',
    raceDetail: 'Detalhe por Corrida',
    badges: 'Badges',
    bestRace: 'Melhor corrida',
    average: 'Média',
    predictions: 'Previsões',
    loadingDetails: 'Carregando detalhes...',
    predicted: '✓ Previsto'
  },

  // ============================================
  // STANDINGS
  // ============================================
  standings: {
    driver: 'Piloto',
    team: 'Equipe',
    noDataTitle: 'Nenhum dado disponível',
    noDataSub: 'As classificações aparecerão quando houver corridas concluídas'
  },

  // ============================================
  // LAST RACE
  // ============================================
  lastRace: {
    loading: 'Carregando última corrida...',
    noRaces: 'Nenhuma corrida concluída ainda',
    noRacesSub: 'As informações aparecerão quando a primeira corrida for concluída',
    lastCompleted: 'Última Corrida Concluída',
    viewAllPredictions: 'Ver Todas as Previsões do Grupo',
    bestPrediction: 'Melhor Previsão',
    groupAverage: 'Média do Grupo',
    worstPrediction: 'Pior Previsão',
    officialResult: 'Resultado Oficial'
  },

  // ============================================
  // STATS
  // ============================================
  stats: {
    loading: 'Carregando estatísticas...',
    noData: 'Nenhum dado disponível',
    noDataSub: 'As estatísticas aparecerão quando houver corridas concluídas',
    goToStats: 'Ir para Estatísticas',
    viewFull: 'Ver Estatísticas Completas →',
    lastRaces: 'Últimas {{count}} corridas',
    filtersAndMore: 'Filtros por usuário, projeções e mais',
    charts: 'Gráficos',
    analysis: 'Análise',
    deepAnalytics: 'Deep Analytics'
  },

  // ============================================
  // POZO (PRIZE POOL)
  // ============================================
  pozo: {
    title: 'Bolão do Grupo',
    participants: '{{count}} participantes',
    perPerson: '{{amount}} por pessoa',
    place: '{{pos}}° lugar',
    disclaimer: 'PodioF1 não gerencia, armazena ou transfere dinheiro. O bolão é informativo e a gestão é responsabilidade dos participantes.',
    enable: 'Habilitar Bolão do Grupo',
    enableSub: 'Mostra o valor acumulado e a distribuição de prêmios. PodioF1 não gerencia dinheiro, apenas informativo.',
    amountPerPerson: 'Valor por pessoa',
    currency: 'Moeda',
    distribution: 'Distribuição de prêmios',
    saveConfig: 'Salvar Configuração do Bolão',
    configSaved: 'Configuração do bolão salva',
    estimatedTotal: 'Total estimado'
  },

  // ============================================
  // CREATE GROUP MODAL
  // ============================================
  createGroup: {
    title: 'Criar Novo Grupo',
    subtitle: 'Configure seu grupo de previsões F1',
    name: 'Nome do Grupo',
    season: 'Temporada',
    positions: 'Posições para prever',
    deadline: 'Prazo das Previsões',
    deadlineHint: 'As previsões fecharão {{hours}} horas antes do início da corrida',
    deadlineOptions: {
      h24: '24 horas antes (recomendado)',
      h32: '32 horas antes',
      h48: '48 horas antes (2 dias)'
    },
    includeSprints: 'Incluir Corridas Sprint',
    includeSprintsSub: 'A temporada 2026 terá 6 corridas Sprint com formato e pontuação especiais',
    sprintPositions: 'Posições Sprint',
    sprintPoints: 'Sistema de Pontos Sprint',
    scoringSystem: 'Sistema de Pontuação F1 Oficial',
    dualScoring: 'Pontos por piloto sem posição exata',
    dualScoringSub: 'Dá pontos quando você acerta o piloto mesmo que não esteja na posição exata.',
    bonusOptions: 'Bônus Opcionais (Apenas Corridas)',
    bonusFastLapDriver: 'Bônus volta mais rápida piloto (+1 pt)',
    bonusFastLapTeam: 'Bônus volta mais rápida equipe (+1 pt)',
    noSprintBonus: 'Sprints não têm bônus de volta mais rápida',
    creating: 'Criando...',
    createBtn: 'Criar Grupo',
    groupCreated: 'Grupo "{{name}}" criado! Código: {{code}}'
  },

  // ============================================
  // JOIN GROUP MODAL
  // ============================================
  joinGroup: {
    title: 'Entrar no Grupo',
    subtitle: 'Digite o código de convite do grupo',
    code: 'Código de Convite',
    verifying: 'Verificando...',
    joinBtn: 'Entrar',
    invalidCode: 'Código de convite inválido',
    alreadyMember: 'Você já é membro deste grupo',
    joined: 'Você entrou no grupo "{{name}}"!'
  },

  // ============================================
  // PROFILE
  // ============================================
  profile: {
    title: 'Meu Perfil',
    name: 'Nome',
    lastName: 'Sobrenome',
    birthDate: 'Data de Nascimento',
    email: 'E-mail',
    favoriteTeam: 'Equipe Favorita',
    favoriteDriver: 'Piloto Favorito',
    selectTeam: 'Selecionar equipe...',
    selectDriver: 'Selecionar piloto...',
    saveChanges: 'Salvar Alterações',
    saving: 'Salvando...',
    updated: 'Perfil atualizado com sucesso',
    errorUpdating: 'Erro ao atualizar perfil',
    myBadges: 'Meus Badges',
    unlocked: 'desbloqueados',
    generalProgress: 'Progresso geral',
    allCategories: 'Todas',
    noBadgesInCategory: 'Nenhum badge nesta categoria',
    completeTap: 'Toque para completar seu perfil →'
  },

  // ============================================
  // BADGES
  // ============================================
  badges: {
    categories: {
      todas: '🏠 Todas',
      victorias: '🏆 Vitórias',
      rachas: '🔥 Sequências',
      precision: '🎯 Precisão',
      participacion: '📊 Participação',
      especiales: '🏎 Especiais',
      secretos: '🤫 Secretos'
    },
    locked: '🔒 Bloqueado',
    secret: '🤫 Secreto',
    secretDesc: 'Badge secreto — desbloqueie para descobrir'
  },

  // ============================================
  // ONBOARDING MODAL
  // ============================================
  onboarding: {
    birthday: '🎂 Quando é seu aniversário?',
    birthdaySub: 'Para personalizar sua experiência',
    favoriteTeam: '🏎 Qual é sua equipe favorita?',
    favoriteTeamSub: 'Vamos personalizar as cores do seu perfil',
    favoriteDriver: '👤 Quem é seu piloto favorito?',
    favoriteDriverSub: 'Torça por ele em cada corrida!',
    howWatch: '📺 Como você assiste às corridas?',
    howWatchSub: 'Você pode selecionar várias opções',
    howWatchOptions: ['TV aberta', 'TV a cabo/satélite', 'F1 TV Pro', 'Streaming pirata', 'No circuito', 'Resumos depois'],
    sinceWhen: '📅 Há quanto tempo acompanha a F1?',
    sinceWhenSub: 'Queremos te conhecer melhor',
    sinceWhenOptions: ['Menos de 1 ano', '1-3 anos', '3-5 anos', '5-10 anos', 'Mais de 10 anos', 'Minha vida toda'],
    hasVehicle: '🚗 Você tem veículo próprio?',
    hasVehicleSub: 'Informação para funcionalidades futuras',
    hasVehicleOptions: ['Sim, carro', 'Sim, moto', 'Sim, ambos', 'Não tenho'],
    skipBtn: 'Pular',
    continueBtn: 'Continuar →',
    finishBtn: 'Finalizar',
    savingBtn: 'Salvando...',
    of: 'de'
  },

  // ============================================
  // NOTIFICATIONS
  // ============================================
  notifications: {
    predictionReminder: '⏰ Faltam {{hours}}h para o fechamento das previsões!',
    predictionReminderBody: 'Envie sua previsão para {{race}} antes que feche.',
    raceStarting: '🏁 A corrida está prestes a começar!',
    raceStartingBody: '{{race}} começa em breve. Já enviou sua previsão?',
    resultsReady: '📊 Resultados disponíveis!',
    resultsReadyBody: 'Os resultados de {{race}} já saíram. Veja como foi.',
    badgeUnlocked: '🏅 Novo badge desbloqueado!',
    badgeUnlockedBody: 'Você desbloqueou "{{badge}}" em {{group}}.',
    weeklyReminder: '📅 Resumo semanal',
    weeklyReminderBody: 'Você está na posição {{position}} em {{group}}. Continue competindo!'
  },

  // ============================================
  // ADMIN PANEL
  // ============================================
  admin: {
    title: 'Gerenciar Grupo',
    back: '← Voltar',
    groupInfo: 'Informações do Grupo',
    name: 'Nome',
    season: 'Temporada',
    inviteCode: 'Código de Convite',
    pendingRequests: 'Solicitações Pendentes',
    currentMembers: 'Membros',
    approve: 'Aprovar',
    reject: 'Rejeitar',
    remove: 'Remover',
    makeAdmin: 'Tornar Admin',
    removeAdmin: 'Remover Admin',
    confirmRemove: 'Remover membro?',
    confirmRemoveMsg: 'Tem certeza que deseja remover {{name}} do grupo?',
    confirmAdmin: '{{action}} permissões de admin?',
    confirmAdminMsg: 'Tem certeza que deseja {{action}} permissões de administrador para {{name}}?',
    fastestLap: 'Volta Mais Rápida',
    selectFastestDriver: '-- Selecionar piloto com volta mais rápida --',
    manageResults: 'Gerenciar Resultados das Corridas',
    manageResultsSub: 'Insira os resultados das corridas manualmente.',
    editResults: 'Editar Resultados',
    enterResults: 'Inserir Resultados',
    finished: '✓ Concluída',
    sprint: '⚡ SPRINT'
  },

  // ============================================
  // PWA
  // ============================================
  pwa: {
    installTitle: 'Instale o PodioF1',
    installSubAndroid: 'Acesso rápido pela tela inicial',
    installSubIOS: 'Toque no ícone de compartilhar e depois "Adicionar à Tela Inicial"',
    installBtn: 'Instalar',
    notNow: 'Agora não',
    understood: 'Entendi'
  },

  // ============================================
  // PREMIUM
  // ============================================
  premium: {
    title: 'PodioF1 Premium',
    subtitle: 'Leve sua experiência para o próximo nível',
    subscribe: 'Assinar Agora',
    monthly: 'Mensal',
    seasonal: 'Temporada',
    perMonth: 'por mês',
    popular: 'Popular',
    savings: 'Economize {{pct}}%',
    cancelAnytime: 'Cancele quando quiser · Sem compromisso',
    getPremium: 'Seja Premium',
    from: 'A partir de',
    benefits: [
      '📊 Análise avançada de previsões',
      '🔬 Deep Analytics com métricas de pilotos',
      '📥 Exportar dados para Excel',
      '👥 Grupos ilimitados',
      '⭐ Badge exclusivo "Supporter"',
      '🚫 Sem anúncios'
    ]
  },

  // ============================================
  // CURRENCIES
  // ============================================
  currencies: {
    USD: '🇺🇸 USD (Dólar)',
    PYG: '🇵🇾 PYG (Guarani)',
    BRL: '🇧🇷 BRL (Real)',
    ARS: '🇦🇷 ARS (Peso)',
    EUR: '🇪🇺 EUR (Euro)'
  },

  // ============================================
  // ERRORS
  // ============================================
  errors: {
    generic: 'Algo deu errado. Tente novamente.',
    loadingDashboard: 'Erro ao carregar dashboard',
    loadingGroup: 'Erro ao carregar dados do grupo',
    notAdmin: 'Você não tem permissões de administrador',
    createGroup: 'Erro ao criar grupo',
    joinGroup: 'Erro ao entrar no grupo'
  }
};