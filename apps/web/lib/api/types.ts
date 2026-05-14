export type UserType = "TRADER" | "SEEKER" | "BUYER";

export type UserStatus = "PENDING" | "ACTIVE" | "SUSPENDED";

export type User = {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  userType: UserType;
  status: UserStatus;
  trustScore: number;
  profileImage: string | null;
};

export type EconomicProfile = {
  id?: string;
  userId?: string;
  tradeCategory: string;
  skills: string[];
  description: string;
  yearsExperience: number;
  location: string | null;
  language: string;
};

export type AuthData = {
  user: User;
  accessToken: string;
  refreshToken: string;
};

export type ApiSuccess<T> = {
  success: true;
  message: string;
  data: T;
  meta?: {
    total?: number;
    page?: number;
    perPage?: number;
    totalPages?: number;
  };
};

export type ApiFailure = {
  success: false;
  message: string;
  errors?: Record<string, string[]> | null;
};

export type ApiError = ApiFailure & {
  status: number;
};

export type OnboardingChatData = {
  reply: string;
  isComplete: boolean;
  extractedData: EconomicProfile | null;
};

export type BuyerRequestResult = {
  request: Record<string, unknown>;
  extractedNeed: Record<string, unknown>;
  matches: Array<Record<string, unknown>>;
};

export type WalletData = {
  account: {
    id: string;
    accountNumber: string;
    accountName: string;
    bankName: string;
    balance: string | number;
  };
  balances: {
    available: number;
    escrowHeld: number;
    pendingEarnings: number;
  };
};

