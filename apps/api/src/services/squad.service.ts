import { squadClient } from '../config/squad.config';
import { SquadAccount } from '../models/index';
import { AppError } from '../utils/app.error';
import { logger } from '../config/logger.config';
import { v4 as uuidv4 } from 'uuid';
import type { InitiatePaymentInput } from '../validators/payment.validator';
import { env } from '../config/env.config';

// Shape of a user passed into createVirtualAccount
interface UserPayload {
  id: string;
  fullName: string;
  email: string;
  phone: string;
}

export const squadService = {

  // ── 1. Create Virtual Account ─────────────────────────────────────────────
  // Called internally during registration — not exposed as a route
  async createVirtualAccount(user: UserPayload) {
    try {
      const nameParts = user.fullName.trim().split(' ');
      const firstName = nameParts[0];
      const lastName = nameParts[1] ?? nameParts[0];

      const response = await squadClient.post('/virtual-account', {
        customer_identifier: `SABI_${user.id}`,
        first_name: firstName,
        last_name: lastName,
        mobile_num: user.phone.replace('+234', '0'),
        email: user.email,
        // Sandbox test values — replace with real user data in production
        bvn: '22343211654',
        dob: '01/01/1990',
        address: 'Lagos, Nigeria',
        gender: '1',
        beneficiary_account: env.SQUAD_BENEFICIARY_ACCOUNT ?? '0123456789',
      });

      const data = response.data?.data;

      if (!data?.virtual_account_number) {
        throw new AppError('Squad did not return a virtual account number.', 502);
      }

      // Save to squad_accounts table
      const account = await SquadAccount.create({
        userId: user.id,
        accountNumber: data.virtual_account_number,
        accountName: `${data.first_name} ${data.last_name}`,
        bankName: 'GTBank',
        squadCustomerId: `SABI_${user.id}`,
      });

      logger.info('Squad virtual account created', {
        userId: user.id,
        accountNumber: data.virtual_account_number,
      });

      return account;
    } catch (err) {
      logger.error('Failed to create Squad virtual account', {
        userId: user.id,
        error: (err as Error).message,
      });
      // Don't throw — registration should still succeed even if Squad fails
      return null;
    }
  },

  // ── 2. Initiate Payment (Generate Checkout URL) ───────────────────────────
  async initiatePayment(userId: string, input: InitiatePaymentInput) {
    const transactionRef = `SABI_${userId}_${uuidv4().replace(/-/g, '').slice(0, 12)}`;
    const callbackUrl =
      input.callbackUrl ??
      `${env.CLIENT_BASE_URL}/payment/callback?transactionRef=${encodeURIComponent(transactionRef)}`;

    const response = await squadClient.post('/transaction/initiate', {
      amount: input.amount,                    // in kobo — 10000 = ₦100
      email: input.customerEmail,
      currency: 'NGN',
      initiate_type: 'inline',
      transaction_ref: transactionRef,
      customer_name: input.customerName,
      callback_url: callbackUrl,
      payment_channels: ['card', 'bank', 'transfer'],
    });

    const data = response.data?.data;

    if (!data?.checkout_url) {
      throw new AppError('Failed to generate payment link from Squad.', 502);
    }

    logger.info('Squad payment initiated', { userId, transactionRef });

    return {
      checkoutUrl: data.checkout_url,
      transactionRef: data.transaction_ref,
      callbackUrl,
    };
  },

  // ── 3. Verify Transaction ─────────────────────────────────────────────────
  async verifyTransaction(transactionRef: string) {
    const response = await squadClient.get(
      `/transaction/verify/${transactionRef}`
    );

    const data = response.data?.data;

    if (!data) {
      throw new AppError('Transaction not found.', 404);
    }

    return {
      reference: data.transaction_ref,
      status: data.transaction_status?.toLowerCase(),   // 'success' | 'failed' | 'pending'
      amount: data.transaction_amount,
      currency: data.transaction_currency_id,
      email: data.email,
      paidAt: data.created_at,
    };
  },

  // ── 4. Get Transaction History ────────────────────────────────────────────
  // Squad requires date range — max 1 month gap
  async getTransactions(page = 1, perPage = 20) {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 30);   // last 30 days

    const formatDate = (date: Date) =>
      date.toISOString().split('T')[0];             // YYYY-MM-DD

    const response = await squadClient.get('/transaction', {
      params: {
  currency: 'NGN',
  start_date: formatDate(startDate),
  end_date: formatDate(endDate),
  page,
  perPage,
},});

    const data = response.data?.data ?? [];

    return {
      transactions: data,
      page,
      perPage,
    };
  },

  // ── 5. Get User's Wallet (Virtual Account Details) ────────────────────────
  async getWallet(userId: string) {
    const account = await SquadAccount.findOne({ where: { userId } });

    if (!account) {
      throw new AppError('No wallet found. Please complete onboarding.', 404);
    }

    return account;
  },
};
