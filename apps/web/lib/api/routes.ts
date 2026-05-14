export const apiRoutes = {
  health: "/health",
  auth: {
    register: "/auth/register",
    login: "/auth/login",
    refresh: "/auth/refresh",
    me: "/auth/me",
  },
  users: {
    list: "/users",
    byId: (id: string) => `/users/${id}`,
    meProfile: "/users/me/profile",
    me: "/users/me",
    meEconomicProfile: "/users/me/economic-profile",
    meFinancialReport: "/users/me/financial-report.pdf",
  },
  onboard: {
    chat: "/onboard/chat",
    complete: "/onboard/complete",
  },
  buyerRequests: {
    analyse: "/buyer-requests/analyse",
    list: "/buyer-requests",
  },
  gigs: {
    browse: "/gigs/browse",
    recommended: "/gigs/recommended",
    myApplications: "/gigs/my-applications",
    apply: (opportunityId: string) => `/gigs/${opportunityId}/apply`,
    applications: (opportunityId: string) => `/gigs/${opportunityId}/applications`,
    hireApplicant: (applicationId: string) => `/gigs/applications/${applicationId}/hire`,
    completeApplication: (applicationId: string) => `/gigs/applications/${applicationId}/complete`,
  },
  matches: {
    generate: "/matches/generate",
    list: "/matches",
    status: (id: string) => `/matches/${id}/status`,
  },
  payments: {
    initiate: "/payments/initiate",
    verify: (transactionRef: string) => `/payments/verify/${transactionRef}`,
    transactions: "/payments/transactions",
    wallet: "/payments/wallet",
    escrows: "/payments/escrow",
    startEscrow: (escrowId: string) => `/payments/escrow/${escrowId}/start`,
    releaseEscrow: (escrowId: string) => `/payments/escrow/${escrowId}/release`,
    refundEscrow: (escrowId: string) => `/payments/escrow/${escrowId}/refund`,
  },
  trust: {
    me: "/trust/me",
    recalculateMe: "/trust/me/recalculate",
    byUserId: (userId: string) => `/trust/${userId}`,
  },
  trustScore: {
    me: "/trust-score/me",
    recalculateMe: "/trust-score/me/recalculate",
    byUserId: (userId: string) => `/trust-score/${userId}`,
  },
  vouches: {
    create: "/vouches",
    remove: (id: string) => `/vouches/${id}`,
    mineReceived: "/vouches/me/received",
    mineGiven: "/vouches/me/given",
    byUserId: (userId: string) => `/vouches/users/${userId}/received`,
  },
  export: {
    financialReport: "/export/financial-report",
    financialReportPdf: "/export/financial-report.pdf",
  },
} as const;

export type ApiRouteMap = typeof apiRoutes;

