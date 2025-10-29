const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Import models
const User = require('../models/User');
const EFiledCase = require('../models/EFiledCase');
const Meeting = require('../models/Meeting');

// Demo data
const demoUsers = [
  {
    email: 'judge1@court.gov',
    password: 'demo123',
    fullName: 'Judge Sarah Williams',
    role: 'judge',
    profile: {
      phoneNumber: '+1-555-0101',
      address: '123 Court House Square, Legal City, LC 12345',
      courtId: 'COURT001',
      jurisdiction: ['civil', 'criminal', 'family']
    }
  },
  {
    email: 'judge2@court.gov',
    password: 'demo123',
    fullName: 'Judge Michael Chen',
    role: 'judge',
    profile: {
      phoneNumber: '+1-555-0102',
      address: '456 Justice Ave, Legal City, LC 12346',
      courtId: 'COURT002',
      jurisdiction: ['commercial', 'civil']
    }
  },
  {
    email: 'lawyer1@lawfirm.com',
    password: 'demo123',
    fullName: 'Attorney Jennifer Davis',
    role: 'lawyer',
    profile: {
      phoneNumber: '+1-555-0201',
      address: '789 Law Street, Legal City, LC 12347',
      barNumber: 'BAR12345',
      specialization: ['civil litigation', 'corporate law'],
      yearsOfExperience: 8,
      cases: { active: 15, completed: 42 },
      ratings: { average: 4.7, total: 28 }
    }
  },
  {
    email: 'lawyer2@associates.com',
    password: 'demo123',
    fullName: 'Attorney Robert Johnson',
    role: 'lawyer',
    profile: {
      phoneNumber: '+1-555-0202',
      address: '321 Legal Plaza, Legal City, LC 12348',
      barNumber: 'BAR67890',
      specialization: ['criminal defense', 'family law'],
      yearsOfExperience: 12,
      cases: { active: 8, completed: 67 },
      ratings: { average: 4.9, total: 45 }
    }
  },
  {
    email: 'plaintiff1@email.com',
    password: 'demo123',
    fullName: 'Maria Rodriguez',
    role: 'litigant',
    profile: {
      phoneNumber: '+1-555-0301',
      address: '555 Main Street, Legal City, LC 12349'
    }
  },
  {
    email: 'defendant1@email.com',
    password: 'demo123',
    fullName: 'John Smith',
    role: 'litigant',
    profile: {
      phoneNumber: '+1-555-0302',
      address: '777 Oak Avenue, Legal City, LC 12350'
    }
  },
  {
    email: 'admin@legalease.com',
    password: 'demo123',
    fullName: 'Admin User',
    role: 'admin',
    profile: {
      phoneNumber: '+1-555-0001',
      address: 'Legal-Ease HQ, Tech City, TC 54321'
    }
  }
];

const demoCases = [
  {
    litigant: {
      name: 'Maria Rodriguez',
      mobileNumber: '+1-555-301-0001',
      aadharNumber: '123456789012',
      address: '555 Main Street, Legal City',
      state: 'Legal State',
      district: 'Legal District'
    },
    case: {
      courtType: 'District Court',
      caseType: 'Civil',
      causeOfAction: 'Property Damage',
      dateOfAction: new Date('2024-01-10'),
      subject: 'Construction defects causing property damage',
      valuation: '$50,000',
      causeAgainstWhom: 'Smith Construction Co.',
      actDetails: 'Breach of construction contract',
      sectionDetails: 'Section 73 of Indian Contract Act',
      relief: 'Compensation for damages and repair costs'
    },
    status: 'approved',
    filingDate: new Date('2024-01-15'),
    caseNumber: 'CIVIL-2024-001'
  },
  {
    litigant: {
      name: 'John Smith',
      mobileNumber: '+1-555-302-0002',
      aadharNumber: '123456789013',
      address: '777 Oak Avenue, Legal City',
      state: 'Legal State',
      district: 'Legal District'
    },
    case: {
      courtType: 'District Court',
      caseType: 'Criminal',
      causeOfAction: 'Theft',
      dateOfAction: new Date('2024-01-25'),
      subject: 'Theft of retail merchandise',
      valuation: '$2,500',
      causeAgainstWhom: 'State vs David Thompson',
      actDetails: 'Theft under Section 379 IPC',
      sectionDetails: 'Section 379 of Indian Penal Code',
      relief: 'Criminal prosecution'
    },
    status: 'processing',
    filingDate: new Date('2024-02-01'),
    caseNumber: 'CRIMINAL-2024-002'
  },
  {
    litigant: {
      name: 'Sarah Johnson',
      mobileNumber: '+1-555-303-0003',
      aadharNumber: '123456789014',
      address: '888 Pine Street, Legal City',
      state: 'Legal State',
      district: 'Legal District'
    },
    case: {
      courtType: 'Family Court',
      caseType: 'Family',
      causeOfAction: 'Divorce',
      dateOfAction: new Date('2024-03-01'),
      subject: 'Divorce proceedings with child custody',
      valuation: '$100,000',
      causeAgainstWhom: 'Mark Johnson',
      actDetails: 'Irreconcilable differences',
      sectionDetails: 'Section 13 of Hindu Marriage Act',
      relief: 'Divorce decree and child custody'
    },
    status: 'approved',
    filingDate: new Date('2024-03-10'),
    caseNumber: 'FAMILY-2024-003'
  },
  {
    litigant: {
      name: 'Tech Corp Representative',
      mobileNumber: '+1-555-304-0004',
      aadharNumber: '123456789015',
      address: '999 Business Ave, Legal City',
      state: 'Legal State',
      district: 'Legal District'
    },
    case: {
      courtType: 'Commercial Court',
      caseType: 'Commercial',
      causeOfAction: 'Contract Breach',
      dateOfAction: new Date('2023-12-15'),
      subject: 'Software licensing contract dispute',
      valuation: '$500,000',
      causeAgainstWhom: 'DataSystems LLC',
      actDetails: 'Breach of software licensing agreement',
      sectionDetails: 'Section 73 of Indian Contract Act',
      relief: 'Damages and specific performance'
    },
    status: 'approved',
    filingDate: new Date('2024-01-05'),
    caseNumber: 'COMMERCIAL-2024-004'
  },
  {
    litigant: {
      name: 'Green Energy Solutions Rep',
      mobileNumber: '+1-555-305-0005',
      aadharNumber: '123456789016',
      address: '111 Solar Street, Legal City',
      state: 'Legal State',
      district: 'Legal District'
    },
    case: {
      courtType: 'District Court',
      caseType: 'Civil',
      causeOfAction: 'Administrative Action',
      dateOfAction: new Date('2024-03-15'),
      subject: 'Zoning permit dispute for solar farm construction',
      valuation: '$2,000,000',
      causeAgainstWhom: 'Local Planning Council',
      actDetails: 'Unlawful denial of zoning permit',
      sectionDetails: 'Administrative Law provisions',
      relief: 'Mandamus for permit approval'
    },
    status: 'pending',
    filingDate: new Date('2024-03-20'),
    caseNumber: 'CIVIL-2024-005'
  }
];

const demoMeetings = [
  {
    title: 'Rodriguez vs. Smith - Settlement Conference',
    caseNumber: 'CIVIL-2024-001',
    scheduledAt: new Date('2024-12-15T10:00:00Z'),
    startTime: '10:00 AM',
    duration: '90 minutes',
    participants: {
      judge: 'judge1@court.gov',
      lawyers: ['lawyer1@lawfirm.com', 'lawyer2@associates.com'],
      litigants: ['plaintiff1@email.com', 'defendant1@email.com']
    },
    meetingLink: 'meeting-civil-001-settlement',
    status: 'scheduled'
  },
  {
    title: 'State vs. Thompson - Arraignment',
    caseNumber: 'CRIMINAL-2024-002',
    scheduledAt: new Date('2024-12-10T14:00:00Z'),
    startTime: '2:00 PM',
    duration: '45 minutes',
    participants: {
      judge: 'judge1@court.gov',
      lawyers: ['lawyer2@associates.com'],
      litigants: ['defendant1@email.com']
    },
    meetingLink: 'meeting-criminal-002-arraignment',
    status: 'scheduled'
  },
  {
    title: 'Johnson vs. Johnson - Mediation Session',
    caseNumber: 'FAMILY-2024-003',
    scheduledAt: new Date('2024-12-20T09:00:00Z'),
    startTime: '9:00 AM',
    duration: '120 minutes',
    participants: {
      judge: 'judge2@court.gov',
      lawyers: ['lawyer1@lawfirm.com', 'lawyer2@associates.com'],
      litigants: ['plaintiff1@email.com', 'defendant1@email.com']
    },
    meetingLink: 'meeting-family-003-mediation',
    status: 'scheduled'
  }
];

async function seedDatabase() {
  try {
    console.log('🌱 Starting database seeding...');
    
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Clear existing data
    console.log('🧹 Clearing existing data...');
    await User.deleteMany({});
    await EFiledCase.deleteMany({});
    await Meeting.deleteMany({});

    // Create users
    console.log('👥 Creating demo users...');
    const createdUsers = [];
    for (const userData of demoUsers) {
      const hashedPassword = await bcrypt.hash(userData.password, 10);
      const user = new User({
        ...userData,
        password: hashedPassword
      });
      await user.save();
      createdUsers.push(user);
      console.log(`   ✅ Created ${user.role}: ${user.fullName}`);
    }

    // Create cases
    console.log('📁 Creating demo cases...');
    const createdCases = [];
    for (const caseData of demoCases) {
      const efiledCase = new EFiledCase(caseData);
      await efiledCase.save();
      createdCases.push(efiledCase);
      console.log(`   ✅ Created case: ${efiledCase.caseNumber}`);
    }

    // Create meetings
    console.log('📅 Creating demo meetings...');
    for (const meetingData of demoMeetings) {
      const meeting = new Meeting(meetingData);
      await meeting.save();
      console.log(`   ✅ Created meeting: ${meeting.title}`);
    }

    console.log('\n🎉 Database seeding completed successfully!');
    console.log('\n📊 Summary:');
    console.log(`   Users created: ${createdUsers.length}`);
    console.log(`   Cases created: ${createdCases.length}`);
    console.log(`   Meetings created: ${demoMeetings.length}`);

    console.log('\n🔑 Demo Login Credentials:');
    console.log('   Judge: judge1@court.gov / demo123');
    console.log('   Lawyer: lawyer1@lawfirm.com / demo123');
    console.log('   Litigant: plaintiff1@email.com / demo123');
    console.log('   Admin: admin@legalease.com / demo123');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
}

// Run the seeding function
seedDatabase();