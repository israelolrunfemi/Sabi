import bcrypt from 'bcryptjs';
import { sequelize } from '../config/database.config';
import { EconomicProfile, User } from '../models/index';
import type { UserType } from '../models/user.model';

type SeedProfile = {
  fullName: string;
  email: string;
  phone: string;
  userType: UserType;
  trustScore: number;
  profile: {
    tradeCategory: string;
    skills: string[];
    description: string;
    yearsExperience: number;
    location: string;
    language: string;
  };
};

const seedProfiles: SeedProfile[] = [
  {
    fullName: 'Amina Bello',
    email: 'amina.trader@sabi.local',
    phone: '08010000001',
    userType: 'TRADER',
    trustScore: 82,
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

const seedPassword = 'Password123!';

const seedProfilesIntoDb = async (): Promise<void> => {
  await sequelize.authenticate();
  await sequelize.sync();

  const hashedPassword = await bcrypt.hash(seedPassword, 12);

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

    const existingProfile = await EconomicProfile.findOne({
      where: { userId: user.id },
    });

    if (existingProfile) {
      await existingProfile.update(seedProfile.profile);
    } else {
      await EconomicProfile.create({
        userId: user.id,
        ...seedProfile.profile,
      });
    }
  }

  console.info(`Seeded ${seedProfiles.length} users with economic profiles.`);
  console.info(`Seed password for every user: ${seedPassword}`);
  console.table(
    seedProfiles.map(({ fullName, email, userType }) => ({
      fullName,
      email,
      userType,
      password: seedPassword,
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
