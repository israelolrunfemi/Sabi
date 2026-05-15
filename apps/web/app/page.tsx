import Navbar from '@/components/Navbar';
import { Hero } from '@/components/Hero';
import { Features } from '@/components/Features';
import { Pricing } from '@/components/Pricing';
import { FAQ } from '@/components/FAQ';
import { CTA } from '@/components/CTA';
import { Footer } from '@/components/Footer';

export const metadata = {
  title: 'Sabi - Financial Access for the Informal Economy',
  description: 'Sabi digitally onboards Nigeria\'s informal traders, artisans, and job seekers to opportunities and financial access via AI-powered matching and Squad payments.',
};

const Home = () => {
  return (
    <div className="min-h-screen bg-slate-950">
      <Navbar />
      <Hero />
      <Features />
      <Pricing />
      <FAQ />
      <CTA />
      <Footer />
    </div>
  );
};

export default Home;