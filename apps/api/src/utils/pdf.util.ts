import PDFDocument from 'pdfkit';

interface TrustScoreBreakdown {
  total: number;
  transactionScore: number;
  ratingScore: number;
  tenureScore: number;
  vouchingScore: number;
  profileScore: number;
}

interface TransactionSummary {
  totalTransactions: number;
  totalVolume: number;
  completionRate: number;
  recentTransactions: {
    date: string;
    amount: number;
    type: string;
    status: string;
    description: string;
  }[];
}

interface ExportData {
  user: {
    fullName: string;
    email: string;
    phone: string;
    userType: string;
    createdAt: Date;
    economicProfile: {
      tradeCategory: string;
      skills: string[];
      location: string | null;
      yearsExperience: number;
      description: string | null;
    } | null;
  };
  trustScore: TrustScoreBreakdown;
  transactions: TransactionSummary;
}

const money = (amount: number): string => {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    maximumFractionDigits: 0,
  }).format(amount);
};

export const generateFinancialReportPDF = async (data: ExportData): Promise<Buffer> => {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ margin: 50, size: 'A4' });
    const buffers: Buffer[] = [];

    doc.on('data', (chunk: Buffer) => buffers.push(chunk));
    doc.on('end', () => resolve(Buffer.concat(buffers)));
    doc.on('error', reject);

    const green = '#1B4332';
    const accent = '#40916C';
    const light = '#D8F3DC';
    const gray = '#4A5568';
    const black = '#1A202C';

    doc.rect(0, 0, 595, 100).fill(green);
    doc.fillColor('#FFFFFF').fontSize(28).font('Helvetica-Bold').text('SABI', 50, 30);
    doc.fontSize(11).font('Helvetica').text('Informal Economy Platform', 50, 62);
    doc.fontSize(11).text('Financial Identity Report', 380, 45);
    doc.fontSize(9).text(`Generated: ${new Date().toLocaleDateString('en-NG')}`, 380, 62);

    doc.rect(0, 100, 595, 28).fill(accent);
    doc
      .fillColor('#FFFFFF')
      .fontSize(10)
      .font('Helvetica-Bold')
      .text('VERIFIED SABI MEMBER - Report generated from platform activity', 50, 109);

    doc.fillColor(black).fontSize(14).font('Helvetica-Bold').text('Personal Information', 50, 150);
    doc.moveTo(50, 168).lineTo(545, 168).stroke(accent);

    const infoRow = (label: string, value: string, x: number, y: number) => {
      doc.fillColor(gray).fontSize(9).font('Helvetica').text(label, x, y);
      doc.fillColor(black).fontSize(10).font('Helvetica-Bold').text(value, x, y + 12, {
        width: 220,
      });
    };

    infoRow('Full Name', data.user.fullName, 50, 178);
    infoRow('Member Since', new Date(data.user.createdAt).toLocaleDateString('en-NG'), 300, 178);
    infoRow('Trade Category', data.user.economicProfile?.tradeCategory ?? 'N/A', 50, 218);
    infoRow('Location', data.user.economicProfile?.location ?? 'N/A', 300, 218);
    infoRow('Years of Experience', `${data.user.economicProfile?.yearsExperience ?? 0} years`, 50, 258);
    infoRow('Phone', data.user.phone, 300, 258);

    doc.fillColor(black).fontSize(14).font('Helvetica-Bold').text('Trust Score', 50, 320);
    doc.moveTo(50, 338).lineTo(545, 338).stroke(accent);
    doc.roundedRect(50, 355, 150, 80, 4).fill(light);
    doc.fillColor(green).fontSize(34).font('Helvetica-Bold').text(String(data.trustScore.total), 80, 373);
    doc.fillColor(gray).fontSize(9).font('Helvetica').text('Overall score / 100', 78, 410);

    const scoreLine = (label: string, value: number, y: number) => {
      doc.fillColor(gray).fontSize(9).font('Helvetica').text(label, 240, y);
      doc.fillColor(black).font('Helvetica-Bold').text(`${value}/100`, 460, y);
      doc.rect(240, y + 14, 250, 6).fill('#E2E8F0');
      doc.rect(240, y + 14, Math.max(0, Math.min(value, 100)) * 2.5, 6).fill(accent);
    };

    scoreLine('Transaction history', data.trustScore.transactionScore, 355);
    scoreLine('Customer ratings', data.trustScore.ratingScore, 385);
    scoreLine('Platform tenure', data.trustScore.tenureScore, 415);
    scoreLine('Community vouching', data.trustScore.vouchingScore, 445);
    scoreLine('Profile completeness', data.trustScore.profileScore, 475);

    doc.fillColor(black).fontSize(14).font('Helvetica-Bold').text('Transaction Summary', 50, 530);
    doc.moveTo(50, 548).lineTo(545, 548).stroke(accent);
    infoRow('Total Transactions', String(data.transactions.totalTransactions), 50, 560);
    infoRow('Total Volume', money(data.transactions.totalVolume), 220, 560);
    infoRow('Completion Rate', `${data.transactions.completionRate}%`, 400, 560);

    doc.fillColor(black).fontSize(12).font('Helvetica-Bold').text('Recent Transactions', 50, 625);
    let y = 650;
    data.transactions.recentTransactions.forEach((transaction) => {
      if (y > 760) return;
      doc.fillColor(black).fontSize(9).font('Helvetica-Bold').text(transaction.date, 50, y, { width: 80 });
      doc.fillColor(gray).font('Helvetica').text(transaction.description, 135, y, { width: 210 });
      doc.fillColor(black).text(transaction.status, 350, y, { width: 70 });
      doc.text(money(transaction.amount), 430, y, { width: 100, align: 'right' });
      y += 22;
    });

    if (data.transactions.recentTransactions.length === 0) {
      doc.fillColor(gray).fontSize(10).font('Helvetica').text('No transactions recorded yet.', 50, 650);
    }

    doc
      .fillColor(gray)
      .fontSize(8)
      .font('Helvetica')
      .text(
        'This document is an informational platform activity report. It is not a bank statement, credit bureau report, or loan approval.',
        50,
        790,
        { width: 495, align: 'center' }
      );

    doc.end();
  });
};
