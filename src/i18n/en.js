export default {
  // ============================================
  // COMMON
  // ============================================
  common: {
    loading: 'Loading...',
    save: 'Save',
    cancel: 'Cancel',
    confirm: 'Confirm',
    delete: 'Delete',
    edit: 'Edit',
    close: 'Close',
    back: 'Back',
    next: 'Next',
    skip: 'Skip',
    search: 'Search',
    error: 'Error',
    success: 'Success',
    yes: 'Yes',
    no: 'No',
    or: 'or',
    pts: 'pts',
    position: 'Position',
    points: 'Points',
    exact: 'Exact',
    races: 'Races',
    members: 'Members',
    pending: 'Pending',
    completed: 'Completed',
    scheduled: 'Scheduled',
    cancelled: 'Cancelled',
    noData: 'No data available',
    comingSoon: 'Coming soon'
  },

  // ============================================
  // NAV
  // ============================================
  nav: {
    profile: 'My Profile',
    settings: 'Settings',
    adminPanel: 'Admin Panel',
    signOut: 'Sign Out',
    notifications: 'Notifications',
    allGroups: 'All groups',
    backToGroups: '← Back to all groups'
  },

  // ============================================
  // AUTH
  // ============================================
  auth: {
    login: 'Sign In',
    register: 'Create Account',
    email: 'Email',
    password: 'Password',
    confirmPassword: 'Confirm Password',
    firstName: 'First Name',
    lastName: 'Last Name',
    country: 'Country',
    birthDate: 'Date of Birth',
    gender: 'Gender',
    genderOptions: {
      preferNot: 'Prefer not to say',
      male: 'Male',
      female: 'Female',
      other: 'Other'
    },
    loginBtn: 'Sign In',
    registerBtn: 'Create Account',
    noAccount: "Don't have an account?",
    hasAccount: 'Already have an account?',
    forgotPassword: 'Forgot your password?',
    passwordsMismatch: "Passwords don't match",
    passwordTooShort: 'Password must be at least 6 characters',
    accountCreated: 'Account created! You can now sign in 🏁',
    errorCreating: 'Error creating account',
    errorLogin: 'Error signing in',
    subtitle: 'Compete with friends predicting F1',
    createSubtitle: 'Create your account to compete'
  },

  // ============================================
  // LANDING
  // ============================================
  landing: {
    hero: 'Free Formula 1 Predictions with Friends',
    heroSub: 'Create your F1 prediction group, invite friends and compete by predicting each Grand Prix result.',
    freeTag: '100% Free · Live Predictions',
    startFree: 'Start Free',
    haveAccount: 'I Have an Account'
  },

  // ============================================
  // APP ONBOARDING
  // ============================================
  appOnboarding: {
    slide1Title: 'Predict F1',
    slide1Sub: 'Build your top 10 before each race and prove you know more than your friends',
    slide2Title: 'Compete in Groups',
    slide2Sub: 'Create private groups, invite friends and follow the real-time ranking',
    slide3Title: 'Win Badges',
    slide3Sub: 'Unlock achievements, climb the ranking and reach the podium of your group',
    slide4Title: 'Start Now!',
    slide4Sub: 'Create your free account and make your first prediction',
    createAccount: 'Create Free Account',
    haveAccount: 'I Have an Account'
  },

  // ============================================
  // DASHBOARD
  // ============================================
  dashboard: {
    loadingGroups: 'Loading groups...',
    noGroups: "You don't have any groups yet",
    noGroupsSub: 'Create your first prediction group or join one with an invite code.',
    createGroup: 'Create Group',
    joinWithCode: 'Join with Code',
    myGroups: 'My groups',
    active: 'active',
    admin: 'Admin',
    creator: 'Creator'
  },

  // ============================================
  // GROUP DASHBOARD
  // ============================================
  group: {
    rulesAndPoints: 'Rules & Points',
    nextRace: 'Next race',
    noRaces: 'No races scheduled',
    predictionsClose: 'Predictions close',
    raceStarts: 'Race starts',
    viewAllRaces: 'View All Races',
    viewMembers: 'View Group Members',
    statistics: 'Statistics',
    adminGroup: 'Manage Group',
    shareGroup: 'Share Group',
    linkCopied: 'Link copied to clipboard! 📋',
    noPrediction: "You haven't submitted your prediction for this race",
    predictNow: 'Predict Now →',
    predictionSent: 'You already submitted your prediction for {{race}}',
    predictionsClosed: 'Predictions for {{race}} are closed',
    seasonProgress: '{{year}} Season Progress',
    racesCount: '{{completed}} / {{total}} races',
    racesRemaining: '{{count}} races remaining',
    seasonComplete: '✅ Season completed'
  },

  // ============================================
  // TABS
  // ============================================
  tabs: {
    general: 'General',
    drivers: 'Drivers',
    teams: 'Teams',
    lastRace: 'Last Race',
    stats: 'Statistics',
    total: 'Total',
    races: 'Races',
    sprints: 'Sprints'
  },

  // ============================================
  // LEADERBOARD
  // ============================================
  leaderboard: {
    user: 'User',
    raceDetail: 'Race Detail',
    badges: 'Badges',
    bestRace: 'Best race',
    average: 'Average',
    predictions: 'Predictions',
    loadingDetails: 'Loading details...',
    predicted: '✓ Predicted'
  },

  // ============================================
  // STANDINGS
  // ============================================
  standings: {
    driver: 'Driver',
    team: 'Team',
    noDataTitle: 'No data available',
    noDataSub: 'Standings will appear when races are completed'
  },

  // ============================================
  // LAST RACE
  // ============================================
  lastRace: {
    loading: 'Loading last race...',
    noRaces: 'No races completed yet',
    noRacesSub: 'Information will appear when the first race is completed',
    lastCompleted: 'Last Completed Race',
    viewAllPredictions: 'View All Group Predictions',
    bestPrediction: 'Best Prediction',
    groupAverage: 'Group Average',
    worstPrediction: 'Worst Prediction',
    officialResult: 'Official Result'
  },

  // ============================================
  // STATS
  // ============================================
  stats: {
    loading: 'Loading statistics...',
    noData: 'No data available',
    noDataSub: 'Statistics will appear when races are completed',
    goToStats: 'Go to Statistics',
    viewFull: 'View Full Statistics →',
    lastRaces: 'Last {{count}} races',
    filtersAndMore: 'User filters, projections and more',
    charts: 'Charts',
    analysis: 'Analysis',
    deepAnalytics: 'Deep Analytics'
  },

  // ============================================
  // POZO (PRIZE POOL)
  // ============================================
  pozo: {
    title: 'Group Prize Pool',
    participants: '{{count}} participants',
    perPerson: '{{amount}} per person',
    place: '{{pos}} place',
    disclaimer: 'PodioF1 does not manage, store or transfer money. The prize pool is informational and management is the responsibility of participants.',
    enable: 'Enable Group Prize Pool',
    enableSub: 'Shows the accumulated amount and prize distribution. PodioF1 does not manage money, informational only.',
    amountPerPerson: 'Amount per person',
    currency: 'Currency',
    distribution: 'Prize distribution',
    saveConfig: 'Save Prize Pool Settings',
    configSaved: 'Prize pool settings saved',
    estimatedTotal: 'Estimated total'
  },

  // ============================================
  // CREATE GROUP MODAL
  // ============================================
  createGroup: {
    title: 'Create New Group',
    subtitle: 'Set up your F1 prediction group',
    name: 'Group Name',
    season: 'Season',
    positions: 'Positions to predict',
    deadline: 'Prediction Deadline',
    deadlineHint: 'Predictions will close {{hours}} hours before race start',
    deadlineOptions: {
      h24: '24 hours before (recommended)',
      h32: '32 hours before',
      h48: '48 hours before (2 days)'
    },
    includeSprints: 'Include Sprint Races',
    includeSprintsSub: 'The 2026 season will have 6 Sprint races with special format and scoring',
    sprintPositions: 'Sprint Positions',
    sprintPoints: 'Sprint Scoring System',
    scoringSystem: 'Official F1 Scoring System',
    dualScoring: 'Points for correct driver without exact position',
    dualScoringSub: 'Awards points when you predict the right driver even if not in the exact position.',
    bonusOptions: 'Optional Bonuses (Races Only)',
    bonusFastLapDriver: 'Fastest lap driver bonus (+1 pt)',
    bonusFastLapTeam: 'Fastest lap team bonus (+1 pt)',
    noSprintBonus: 'Sprints have no fastest lap bonus',
    creating: 'Creating...',
    createBtn: 'Create Group',
    groupCreated: 'Group "{{name}}" created! Code: {{code}}'
  },

  // ============================================
  // JOIN GROUP MODAL
  // ============================================
  joinGroup: {
    title: 'Join Group',
    subtitle: 'Enter the group invite code',
    code: 'Invite Code',
    verifying: 'Verifying...',
    joinBtn: 'Join',
    invalidCode: 'Invalid invite code',
    alreadyMember: 'You are already a member of this group',
    joined: 'You joined the group "{{name}}"!'
  },

  // ============================================
  // PROFILE
  // ============================================
  profile: {
    title: 'My Profile',
    name: 'First Name',
    lastName: 'Last Name',
    birthDate: 'Date of Birth',
    email: 'Email',
    favoriteTeam: 'Favorite Team',
    favoriteDriver: 'Favorite Driver',
    selectTeam: 'Select team...',
    selectDriver: 'Select driver...',
    saveChanges: 'Save Changes',
    saving: 'Saving...',
    updated: 'Profile updated successfully',
    errorUpdating: 'Error updating profile',
    myBadges: 'My Badges',
    unlocked: 'unlocked',
    generalProgress: 'General progress',
    allCategories: 'All',
    noBadgesInCategory: 'No badges in this category',
    completeTap: 'Tap to complete your profile →'
  },

  // ============================================
  // BADGES
  // ============================================
  badges: {
    categories: {
      todas: '🏠 All',
      victorias: '🏆 Victories',
      rachas: '🔥 Streaks',
      precision: '🎯 Precision',
      participacion: '📊 Participation',
      especiales: '🏎 Special',
      secretos: '🤫 Secrets'
    },
    locked: '🔒 Locked',
    secret: '🤫 Secret',
    secretDesc: 'Secret badge — unlock it to discover'
  },

  // ============================================
  // ONBOARDING MODAL
  // ============================================
  onboarding: {
    birthday: '🎂 When is your birthday?',
    birthdaySub: 'To personalize your experience',
    favoriteTeam: '🏎 What is your favorite team?',
    favoriteTeamSub: "We'll customize your profile colors",
    favoriteDriver: '👤 Who is your favorite driver?',
    favoriteDriverSub: 'Support them in every race!',
    howWatch: '📺 How do you watch races?',
    howWatchSub: 'You can select multiple options',
    howWatchOptions: ['Free TV', 'Cable/Satellite TV', 'F1 TV Pro', 'Streaming', 'At the circuit', 'Highlights after'],
    sinceWhen: '📅 How long have you been following F1?',
    sinceWhenSub: 'We want to know you better',
    sinceWhenOptions: ['Less than 1 year', '1-3 years', '3-5 years', '5-10 years', 'More than 10 years', 'My whole life'],
    hasVehicle: '🚗 Do you own a vehicle?',
    hasVehicleSub: 'Information for future features',
    hasVehicleOptions: ['Yes, a car', 'Yes, a motorcycle', 'Yes, both', 'No'],
    skipBtn: 'Skip',
    continueBtn: 'Continue →',
    finishBtn: 'Finish',
    savingBtn: 'Saving...',
    of: 'of'
  },

  // ============================================
  // NOTIFICATIONS
  // ============================================
  notifications: {
    predictionReminder: '⏰ {{hours}}h until predictions close!',
    predictionReminderBody: 'Submit your prediction for {{race}} before it closes.',
    raceStarting: '🏁 The race is about to start!',
    raceStartingBody: '{{race}} starts soon. Did you submit your prediction?',
    resultsReady: '📊 Results are ready!',
    resultsReadyBody: 'Results for {{race}} are in. See how you did.',
    badgeUnlocked: '🏅 New badge unlocked!',
    badgeUnlockedBody: 'You unlocked "{{badge}}" in {{group}}.',
    weeklyReminder: '📅 Weekly summary',
    weeklyReminderBody: "You're in position {{position}} in {{group}}. Keep competing!"
  },

  // ============================================
  // ADMIN PANEL
  // ============================================
  admin: {
    title: 'Manage Group',
    back: '← Back',
    groupInfo: 'Group Information',
    name: 'Name',
    season: 'Season',
    inviteCode: 'Invite Code',
    pendingRequests: 'Pending Requests',
    currentMembers: 'Members',
    approve: 'Approve',
    reject: 'Reject',
    remove: 'Remove',
    makeAdmin: 'Make Admin',
    removeAdmin: 'Remove Admin',
    confirmRemove: 'Remove member?',
    confirmRemoveMsg: 'Are you sure you want to remove {{name}} from the group?',
    confirmAdmin: '{{action}} admin permissions?',
    confirmAdminMsg: 'Are you sure you want to {{action}} admin permissions for {{name}}?',
    fastestLap: 'Fastest Lap',
    selectFastestDriver: '-- Select fastest lap driver --',
    manageResults: 'Manage Race Results',
    manageResultsSub: 'Enter race results manually.',
    editResults: 'Edit Results',
    enterResults: 'Enter Results',
    finished: '✓ Finished',
    sprint: '⚡ SPRINT'
  },

  // ============================================
  // PWA
  // ============================================
  pwa: {
    installTitle: 'Install PodioF1',
    installSubAndroid: 'Quick access from your home screen',
    installSubIOS: 'Tap the share icon and then "Add to Home Screen"',
    installBtn: 'Install',
    notNow: 'Not now',
    understood: 'Got it'
  },

  // ============================================
  // PREMIUM
  // ============================================
  premium: {
    title: 'PodioF1 Premium',
    subtitle: 'Take your experience to the next level',
    subscribe: 'Subscribe Now',
    monthly: 'Monthly',
    seasonal: 'Season',
    perMonth: 'per month',
    popular: 'Popular',
    savings: 'Save {{pct}}%',
    cancelAnytime: 'Cancel anytime · No commitments',
    getPremium: 'Go Premium',
    from: 'From',
    benefits: [
      '📊 Advanced prediction analysis',
      '🔬 Deep Analytics with driver metrics',
      '📥 Export data to Excel',
      '👥 Unlimited groups',
      '⭐ Exclusive "Supporter" badge',
      '🚫 No ads'
    ]
  },

  // ============================================
  // CURRENCIES
  // ============================================
  currencies: {
    USD: '🇺🇸 USD (Dollar)',
    PYG: '🇵🇾 PYG (Guaraní)',
    BRL: '🇧🇷 BRL (Real)',
    ARS: '🇦🇷 ARS (Peso)',
    EUR: '🇪🇺 EUR (Euro)'
  },

  // ============================================
  // ERRORS
  // ============================================
  errors: {
    generic: 'Something went wrong. Try again.',
    loadingDashboard: 'Error loading dashboard',
    loadingGroup: 'Error loading group data',
    notAdmin: "You don't have admin permissions",
    createGroup: 'Error creating group',
    joinGroup: 'Error joining group'
  }
};