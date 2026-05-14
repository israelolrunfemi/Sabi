import bcrypt from 'bcryptjs';
import { sequelize } from '../config/database.config';
import {
  BuyerRequest,
  EconomicProfile,
  EscrowPayment,
  GigApplication,
  Match,
  Opportunity,
  Rating,
  SquadAccount,
  Transaction,
  User,
  Vouch,
} from '../models/index';
import type { UserType } from '../models/user.model';
import type { OpportunityStatus, OpportunityType } from '../models/opportunity.model';
import type { ApplicationStatus } from '../models/gig-application.model';
import type { EscrowPaymentStatus } from '../models/escrow-payment.model';

type SeedProfile = {
  fullName: string;
  email: string;
  phone: string;
  userType: UserType;
  trustScore: number;
  walletBalance: number;
  accountNumber: string;
  profile: {
    tradeCategory: string;
    skills: string[];
    description: string;
    yearsExperience: number;
    location: string;
    language: string;
  };
};

type SeedOpportunity = {
  key: string;
  posterEmail: string;
  title: string;
  description: string;
  type: OpportunityType;
  category: string;
  location: string;
  budget: number;
  status: OpportunityStatus;
};

type SeedApplication = {
  opportunityKey: string;
  seekerEmail: string;
  coverNote: string;
  status: ApplicationStatus;
};

type SeedEscrowPayment = {
  reference: string;
  buyerEmail: string;
  traderEmail: string;
  amount: number;
  status: EscrowPaymentStatus;
  description: string;
};

const seedPassword = 'Password123!';

const seedProfiles: SeedProfile[] = [
  {
    fullName: 'Amina Bello',
    email: 'amina.trader@sabi.local',
    phone: '08010000001',
    userType: 'TRADER',
    trustScore: 82,
    walletBalance: 25000,
    accountNumber: '900000001',
    profile: {
      tradeCategory: 'Food Trading',
      skills: ['Bulk rice sales', 'Market sourcing', 'Customer negotiation'],
      description: 'Wholesale and retail food trader serving neighborhood shops and food vendors.',
      yearsExperience: 7,
      location: 'Mile 12 Market, Lagos',
      language: 'English, Yoruba',
    },
  },
  {
    fullName: 'Chinedu Okafor',
    email: 'chinedu.seeker@sabi.local',
    phone: '08010000002',
    userType: 'SEEKER',
    trustScore: 68,
    walletBalance: 12000,
    accountNumber: '900000002',
    profile: {
      tradeCategory: 'Electrical Repairs',
      skills: ['House wiring', 'Inverter installation', 'Fault diagnosis'],
      description: 'Skilled electrician looking for repair, installation, and maintenance jobs.',
      yearsExperience: 4,
      location: 'Yaba, Lagos',
      language: 'English, Igbo',
    },
  },
  {
    fullName: 'Fatima Musa',
    email: 'fatima.buyer@sabi.local',
    phone: '08010000003',
    userType: 'BUYER',
    trustScore: 74,
    walletBalance: 150000,
    accountNumber: '900000003',
    profile: {
      tradeCategory: 'Event Procurement',
      skills: ['Vendor coordination', 'Price comparison', 'Bulk purchasing'],
      description: 'Regular buyer sourcing trusted vendors and service providers for events.',
      yearsExperience: 5,
      location: 'Wuse, Abuja',
      language: 'English, Hausa',
    },
  },
  {
    fullName: 'Tunde Adebayo',
    email: 'tunde.fashion@sabi.local',
    phone: '08010000004',
    userType: 'TRADER',
    trustScore: 79,
    walletBalance: 18000,
    accountNumber: '900000004',
    profile: {
      tradeCategory: 'Fashion Design',
      skills: ['Native wear tailoring', 'Alterations', 'Pattern cutting'],
      description: 'Tailor producing custom outfits for individual and small business clients.',
      yearsExperience: 9,
      location: 'Surulere, Lagos',
      language: 'English, Yoruba',
    },
  },
  {
    fullName: 'Grace Ekanem',
    email: 'grace.catering@sabi.local',
    phone: '08010000005',
    userType: 'SEEKER',
    trustScore: 71,
    walletBalance: 10000,
    accountNumber: '900000005',
    profile: {
      tradeCategory: 'Catering',
      skills: ['Small chops', 'Outdoor catering', 'Menu planning'],
      description: 'Caterer available for parties, corporate lunches, and home meal prep.',
      yearsExperience: 6,
      location: 'Port Harcourt, Rivers',
      language: 'English',
    },
  },
  {
    fullName: 'Ibrahim Garba',
    email: 'ibrahim.logistics@sabi.local',
    phone: '08010000006',
    userType: 'BUYER',
    trustScore: 66,
    walletBalance: 95000,
    accountNumber: '900000006',
    profile: {
      tradeCategory: 'Logistics',
      skills: ['Dispatch booking', 'Route planning', 'Delivery tracking'],
      description: 'Small business buyer frequently sourcing dispatch riders and delivery partners.',
      yearsExperience: 3,
      location: 'Kano Municipal, Kano',
      language: 'English, Hausa',
    },
  },
];

const seedOpportunities: SeedOpportunity[] = [
  {
    key: 'event-rice-supply',
    posterEmail: 'fatima.buyer@sabi.local',
    title: 'Supply 20 bags of rice for weekend event',
    description: 'Need a reliable food trader to supply clean 50kg rice bags before Saturday morning.',
    type: 'TRADE',
    category: 'Food Trading',
    location: 'Wuse, Abuja',
    budget: 72000,
    status: 'OPEN',
  },
  {
    key: 'native-wear-tailoring',
    posterEmail: 'ibrahim.logistics@sabi.local',
    title: 'Sew 8 native wear outfits for staff',
    description: 'Looking for a tailor to sew simple matching native wear with neat finishing.',
    type: 'JOB',
    category: 'Fashion Design',
    location: 'Kano Municipal, Kano',
    budget: 64000,
    status: 'OPEN',
  },
  {
    key: 'office-wiring-check',
    posterEmail: 'fatima.buyer@sabi.local',
    title: 'Check office wiring and replace faulty sockets',
    description: 'Small office needs wiring inspection, socket replacement, and inverter load advice.',
    type: 'JOB',
    category: 'Electrical Repairs',
    location: 'Yaba, Lagos',
    budget: 45000,
    status: 'FILLED',
  },
  {
    key: 'small-chops-catering',
    posterEmail: 'ibrahim.logistics@sabi.local',
    title: 'Cater small chops for 40 guests',
    description: 'Need small chops, puff puff, spring rolls, and delivery for a birthday event.',
    type: 'JOB',
    category: 'Catering',
    location: 'Port Harcourt, Rivers',
    budget: 55000,
    status: 'OPEN',
  },
];

const seedApplications: SeedApplication[] = [
  {
    opportunityKey: 'office-wiring-check',
    seekerEmail: 'chinedu.seeker@sabi.local',
    coverNote: 'I can inspect the wiring, replace sockets, and advise on inverter load balancing.',
    status: 'HIRED',
  },
  {
    opportunityKey: 'small-chops-catering',
    seekerEmail: 'grace.catering@sabi.local',
    coverNote: 'I can handle the full small chops order and deliver on event day.',
    status: 'APPLIED',
  },
  {
    opportunityKey: 'event-rice-supply',
    seekerEmail: 'grace.catering@sabi.local',
    coverNote: 'I can help coordinate vendor delivery and quality checks for the rice order.',
    status: 'SHORTLISTED',
  },
];

const seedEscrowPayments: SeedEscrowPayment[] = [
  {
    reference: 'ESCROW_DEMO_FUNDED_RICE',
    buyerEmail: 'fatima.buyer@sabi.local',
    traderEmail: 'amina.trader@sabi.local',
    amount: 20000,
    status: 'FUNDED',
    description: 'Funded rice supply test escrow',
  },
  {
    reference: 'ESCROW_DEMO_PROGRESS_TAILOR',
    buyerEmail: 'ibrahim.logistics@sabi.local',
    traderEmail: 'tunde.fashion@sabi.local',
    amount: 30000,
    status: 'IN_PROGRESS',
    description: 'Tailoring order in progress',
  },
  {
    reference: 'ESCROW_DEMO_COMPLETED_RICE',
    buyerEmail: 'fatima.buyer@sabi.local',
    traderEmail: 'amina.trader@sabi.local',
    amount: 15000,
    status: 'COMPLETED',
    description: 'Completed rice delivery escrow',
  },
];

const daysFromNow = (days: number): Date => {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date;
};

const requireUser = (usersByEmail: Map<string, User>, email: string): User => {
  const user = usersByEmail.get(email);
  if (!user) throw new Error(`Seed user not found: ${email}`);
  return user;
};

const findOrCreateTransaction = async (
  squadReference: string,
  payload: {
    userId: string;
    amount: number;
    type: 'CREDIT' | 'DEBIT';
    status: 'PENDING' | 'SUCCESS' | 'FAILED';
    counterpartyId?: string | null;
    description: string;
    metadata?: object | null;
  }
) => {
  const [transaction, created] = await Transaction.findOrCreate({
    where: { squadReference },
    defaults: {
      squadReference,
      userId: payload.userId,
      amount: payload.amount,
      type: payload.type,
      status: payload.status,
      counterpartyId: payload.counterpartyId ?? null,
      description: payload.description,
      metadata: payload.metadata ?? null,
    },
  });

  if (!created) {
    await transaction.update({
      userId: payload.userId,
      amount: payload.amount,
      type: payload.type,
      status: payload.status,
      counterpartyId: payload.counterpartyId ?? null,
      description: payload.description,
      metadata: payload.metadata ?? null,
    });
  }

  return transaction;
};

const seedProfilesIntoDb = async (): Promise<void> => {
  await sequelize.authenticate();
  await sequelize.sync();

  const hashedPassword = await bcrypt.hash(seedPassword, 12);
  const usersByEmail = new Map<string, User>();

  for (const seedProfile of seedProfiles) {
    const [user, created] = await User.findOrCreate({
      where: { email: seedProfile.email },
      defaults: {
        fullName: seedProfile.fullName,
        email: seedProfile.email,
        phone: seedProfile.phone,
        password: hashedPassword,
        userType: seedProfile.userType,
        status: 'ACTIVE',
        trustScore: seedProfile.trustScore,
      },
    });

    if (!created) {
      await user.update({
        fullName: seedProfile.fullName,
        phone: seedProfile.phone,
        password: hashedPassword,
        userType: seedProfile.userType,
        status: 'ACTIVE',
        trustScore: seedProfile.trustScore,
      });
    }

    const [profile] = await EconomicProfile.findOrCreate({
      where: { userId: user.id },
      defaults: {
        userId: user.id,
        ...seedProfile.profile,
      },
    });
    await profile.update(seedProfile.profile);

    const [account] = await SquadAccount.findOrCreate({
      where: { userId: user.id },
      defaults: {
        userId: user.id,
        accountNumber: seedProfile.accountNumber,
        accountName: seedProfile.fullName,
        bankName: 'Sabi Demo Bank',
        balance: seedProfile.walletBalance,
        squadCustomerId: `SABI_${user.id}`,
      },
    });
    await account.update({
      accountNumber: seedProfile.accountNumber,
      accountName: seedProfile.fullName,
      bankName: 'Sabi Demo Bank',
      balance: seedProfile.walletBalance,
      squadCustomerId: `SABI_${user.id}`,
    });

    await findOrCreateTransaction(`SEED_FUND_${seedProfile.accountNumber}`, {
      userId: user.id,
      amount: seedProfile.walletBalance,
      type: 'CREDIT',
      status: 'SUCCESS',
      description: 'Seed wallet funding for local API testing',
      metadata: { source: 'profiles.seed.ts', action: 'WALLET_FUNDING' },
    });

    usersByEmail.set(seedProfile.email, user);
  }

  const opportunitiesByKey = new Map<string, Opportunity>();
  for (const seedOpportunity of seedOpportunities) {
    const poster = requireUser(usersByEmail, seedOpportunity.posterEmail);
    const existing = await Opportunity.findOne({
      where: {
        posterId: poster.id,
        title: seedOpportunity.title,
      },
    });

    const payload = {
      posterId: poster.id,
      title: seedOpportunity.title,
      description: seedOpportunity.description,
      type: seedOpportunity.type,
      category: seedOpportunity.category,
      location: seedOpportunity.location,
      budget: seedOpportunity.budget,
      status: seedOpportunity.status,
      expiresAt: daysFromNow(30),
    };

    const opportunity = existing ? await existing.update(payload) : await Opportunity.create(payload);
    opportunitiesByKey.set(seedOpportunity.key, opportunity);
  }

  for (const seedApplication of seedApplications) {
    const opportunity = opportunitiesByKey.get(seedApplication.opportunityKey);
    if (!opportunity) throw new Error(`Seed opportunity not found: ${seedApplication.opportunityKey}`);

    const seeker = requireUser(usersByEmail, seedApplication.seekerEmail);
    const [application] = await GigApplication.findOrCreate({
      where: {
        opportunityId: opportunity.id,
        seekerId: seeker.id,
      },
      defaults: {
        opportunityId: opportunity.id,
        seekerId: seeker.id,
        coverNote: seedApplication.coverNote,
        status: seedApplication.status,
        squadEscrowRef:
          seedApplication.status === 'HIRED' ? `GIG_ESCROW_${opportunity.id.slice(0, 8)}` : null,
        completedAt: seedApplication.status === 'COMPLETED' ? new Date() : null,
      },
    });
    await application.update({
      coverNote: seedApplication.coverNote,
      status: seedApplication.status,
      squadEscrowRef:
        seedApplication.status === 'HIRED' ? `GIG_ESCROW_${opportunity.id.slice(0, 8)}` : null,
      completedAt: seedApplication.status === 'COMPLETED' ? new Date() : null,
    });
  }

  const buyerRequests = [
    {
      buyerEmail: 'fatima.buyer@sabi.local',
      rawDescription: 'I need a trusted food trader who can supply rice for a weekend event.',
      category: 'food',
      estimatedBudget: 72000,
      extractedNeed: {
        serviceNeeded: 'Bulk rice supply',
        category: 'food',
        specificRequirements: ['20 bags', 'delivery before Saturday', 'clean 50kg bags'],
        estimatedBudget: 72000,
        urgency: 'high',
      },
      status: 'MATCHED' as const,
    },
    {
      buyerEmail: 'ibrahim.logistics@sabi.local',
      rawDescription: 'Need a tailor for matching native wear outfits for my staff.',
      category: 'tailoring',
      estimatedBudget: 64000,
      extractedNeed: {
        serviceNeeded: 'Native wear tailoring',
        category: 'tailoring',
        specificRequirements: ['8 outfits', 'simple matching design', 'neat finishing'],
        estimatedBudget: 64000,
        urgency: 'normal',
      },
      status: 'MATCHED' as const,
    },
  ];

  for (const request of buyerRequests) {
    const buyer = requireUser(usersByEmail, request.buyerEmail);
    const [buyerRequest] = await BuyerRequest.findOrCreate({
      where: {
        buyerId: buyer.id,
        rawDescription: request.rawDescription,
      },
      defaults: {
        buyerId: buyer.id,
        imageUrl: null,
        rawDescription: request.rawDescription,
        extractedNeed: request.extractedNeed,
        category: request.category,
        estimatedBudget: request.estimatedBudget,
        status: request.status,
      },
    });
    await buyerRequest.update({
      extractedNeed: request.extractedNeed,
      category: request.category,
      estimatedBudget: request.estimatedBudget,
      status: request.status,
    });
  }

  for (const escrowSeed of seedEscrowPayments) {
    const buyer = requireUser(usersByEmail, escrowSeed.buyerEmail);
    const trader = requireUser(usersByEmail, escrowSeed.traderEmail);

    const [escrow] = await EscrowPayment.findOrCreate({
      where: { reference: escrowSeed.reference },
      defaults: {
        reference: escrowSeed.reference,
        buyerId: buyer.id,
        traderId: trader.id,
        amount: escrowSeed.amount,
        status: escrowSeed.status,
        description: escrowSeed.description,
        metadata: { source: 'profiles.seed.ts' },
        fundedAt: new Date(),
        releasedAt: escrowSeed.status === 'COMPLETED' ? new Date() : null,
        refundedAt: null,
      },
    });

    await escrow.update({
      buyerId: buyer.id,
      traderId: trader.id,
      amount: escrowSeed.amount,
      status: escrowSeed.status,
      description: escrowSeed.description,
      metadata: { source: 'profiles.seed.ts' },
      releasedAt: escrowSeed.status === 'COMPLETED' ? new Date() : null,
      refundedAt: null,
    });

    await findOrCreateTransaction(`${escrowSeed.reference}_HOLD`, {
      userId: buyer.id,
      amount: escrowSeed.amount,
      type: 'DEBIT',
      status: 'SUCCESS',
      counterpartyId: trader.id,
      description: `Seed escrow hold: ${escrowSeed.description}`,
      metadata: {
        escrowPaymentId: escrow.id,
        escrowReference: escrow.reference,
        action: 'ESCROW_HOLD',
      },
    });

    if (escrowSeed.status === 'COMPLETED') {
      await findOrCreateTransaction(`${escrowSeed.reference}_RELEASE`, {
        userId: trader.id,
        amount: escrowSeed.amount,
        type: 'CREDIT',
        status: 'SUCCESS',
        counterpartyId: buyer.id,
        description: `Seed escrow release: ${escrowSeed.description}`,
        metadata: {
          escrowPaymentId: escrow.id,
          escrowReference: escrow.reference,
          action: 'ESCROW_RELEASE',
        },
      });
    }
  }

  const wiringOpportunity = opportunitiesByKey.get('office-wiring-check');
  if (wiringOpportunity) {
    const chinedu = requireUser(usersByEmail, 'chinedu.seeker@sabi.local');
    const [match] = await Match.findOrCreate({
      where: {
        seekerId: chinedu.id,
        opportunityId: wiringOpportunity.id,
      },
      defaults: {
        seekerId: chinedu.id,
        opportunityId: wiringOpportunity.id,
        score: 88,
        reasoning: 'Strong match for office wiring, fault diagnosis, and inverter advice.',
        keyStrengths: ['House wiring', 'Fault diagnosis', 'Local availability'],
        potentialGaps: ['May need helper for larger rewiring jobs'],
        status: 'ACCEPTED',
      },
    });
    await match.update({
      score: 88,
      reasoning: 'Strong match for office wiring, fault diagnosis, and inverter advice.',
      keyStrengths: ['House wiring', 'Fault diagnosis', 'Local availability'],
      potentialGaps: ['May need helper for larger rewiring jobs'],
      status: 'ACCEPTED',
    });
  }

  const vouchees = [
    {
      voucherEmail: 'fatima.buyer@sabi.local',
      voucheeEmail: 'amina.trader@sabi.local',
      message: 'Reliable supplier and clear communicator.',
    },
    {
      voucherEmail: 'ibrahim.logistics@sabi.local',
      voucheeEmail: 'tunde.fashion@sabi.local',
      message: 'Delivers neat finishing and keeps timelines.',
    },
  ];

  for (const vouchSeed of vouchees) {
    const voucher = requireUser(usersByEmail, vouchSeed.voucherEmail);
    const vouchee = requireUser(usersByEmail, vouchSeed.voucheeEmail);
    const [vouch] = await Vouch.findOrCreate({
      where: { voucherId: voucher.id, voucheeId: vouchee.id },
      defaults: {
        voucherId: voucher.id,
        voucheeId: vouchee.id,
        message: vouchSeed.message,
      },
    });
    await vouch.update({ message: vouchSeed.message });
  }

  const ratingSeeds = [
    {
      raterEmail: 'fatima.buyer@sabi.local',
      rateeEmail: 'amina.trader@sabi.local',
      score: 5,
      comment: 'Good quality rice and prompt delivery.',
    },
    {
      raterEmail: 'ibrahim.logistics@sabi.local',
      rateeEmail: 'tunde.fashion@sabi.local',
      score: 4,
      comment: 'Neat work and good communication.',
    },
  ];

  for (const ratingSeed of ratingSeeds) {
    const rater = requireUser(usersByEmail, ratingSeed.raterEmail);
    const ratee = requireUser(usersByEmail, ratingSeed.rateeEmail);
    const existing = await Rating.findOne({
      where: {
        raterId: rater.id,
        rateeId: ratee.id,
        comment: ratingSeed.comment,
      },
    });

    if (existing) {
      await existing.update({ score: ratingSeed.score });
    } else {
      await Rating.create({
        raterId: rater.id,
        rateeId: ratee.id,
        transactionId: null,
        score: ratingSeed.score,
        comment: ratingSeed.comment,
      });
    }
  }

  console.info(`Seeded ${seedProfiles.length} users with profiles and funded Squad accounts.`);
  console.info(`Seeded ${seedOpportunities.length} gigs, ${seedApplications.length} applications, and ${seedEscrowPayments.length} escrow payments.`);
  console.info(`Seed password for every user: ${seedPassword}`);
  console.table(
    seedProfiles.map(({ fullName, email, userType, walletBalance, accountNumber }) => ({
      fullName,
      email,
      userType,
      password: seedPassword,
      accountNumber,
      walletBalance,
    }))
  );
};

seedProfilesIntoDb()
  .catch((error) => {
    console.error('Failed to seed profiles:', error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await sequelize.close();
  });
