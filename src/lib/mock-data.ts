
import { PlaceHolderImages } from './placeholder-images';

export function getImageUrl(id: string) {
  return PlaceHolderImages.find((img) => img.id === id)?.imageUrl || '';
}

export type Comment = {
  id: string;
  author: string;
  authorId: string;
  avatarUrl: string;
  profileUrl: string;
  date: string; // Use string to prevent timezone issues
  text: string;
  replyTo?: string; // Author name of the comment being replied to
  status: 'approved' | 'pending' | 'hidden';
};

export type Update = {
  id: string;
  title: string;
  description: string;
  date: string; // Use string to prevent timezone issues
  imageUrl?: string;
  imageHint?: string;
  pinned?: boolean;
  isTransfer?: boolean; // To distinguish transfer updates
  transferDetails?: {
    amount: number;
    fromProject?: string;
    toProject?: string;
  };
  isInKindDonation?: boolean;
  inKindDonationDetails?: {
    donorName: string;
    itemName: string;
    quantity: number;
  };
  isExpense?: boolean;
  expenseDetails?: {
    item: string;
    amount: number;
  };
  isMonetaryDonation?: boolean;
  monetaryDonationDetails?: {
    donorName: string;
    donorAvatarUrl: string;
    donorProfileUrl: string;
    donorId: string;
    amount: number;
  };
  comments?: Comment[];
};

export type WishlistItem = {
  id: string;
  name: string;
  description: string;
  quantityNeeded: number;
  quantityDonated: number;
  costPerItem: number;
  imageUrl?: string;
  imageHint?: string;
  allowInKind?: boolean;
};

export type Gateway = {
  name: string;
  enabled: boolean;
  qrValue: string;
  generatedQr: string;
};

export type Project = {
  id: string;
  name: string;
  organization: string;
  description: string;
  longDescription: string;
  imageUrl: string;
  imageHint: string;
  targetAmount: number;
  raisedAmount: number;
  donors: number;
  verified: boolean;
  ownerId?: string; // New field to link project to a user
  updates: Update[];
  expenses: {
    id: string;
    item: string;
    amount: number;
    date: string; // Use string to prevent timezone issues
    receiptUrl: string;
    receiptHint: string;
  }[];
  discussion: Comment[];
  wishlist: WishlistItem[];
  gateways?: Gateway[];
  metaDescription?: string;
  keywords?: string[];
  createdAt: string;
};

export let salaries: {
  id: string;
  employee: string;
  role: string;
  salary: number;
  currency: 'NPR' | 'USD';
}[] = [
  {
    id: 'sal-1',
    employee: 'Aayush KC',
    role: 'Founder & CEO',
    salary: 4000,
    currency: 'USD',
  },
  {
    id: 'sal-2',
    employee: 'Priya Adhikari',
    role: 'Head of Operations (Nepal)',
    salary: 150000,
    currency: 'NPR',
  },
  {
    id: 'sal-3',
    employee: 'Rohan Maharjan',
    role: 'Lead Full-Stack Developer',
    salary: 3500,
    currency: 'USD',
  },
  {
    id: 'sal-4',
    employee: 'Sunita Sharma',
    role: 'Community Manager (Nepal)',
    salary: 80000,
    currency: 'NPR',
  },
  {
    id: 'sal-5',
    employee: 'David Kim',
    role: 'Marketing Lead',
    salary: 2800,
    currency: 'USD',
  },
];

export let equipment: {
  id: string;
  item: string;
  cost: number;
  purchaseDate: string; // Use string to prevent timezone issues
  vendor: string;
  imageUrl?: string;
  imageHint?: string;
}[] = [
  {
    id: 'eq-1',
    item: 'MacBook Pro 16"',
    cost: 332500,
    purchaseDate: '2023-10-01T10:00:00Z',
    vendor: 'Apple Store',
    imageUrl: getImageUrl('equipment-macbook'),
    imageHint: 'laptop computer',
  },
  {
    id: 'eq-2',
    item: 'Ergonomic Office Chairs (x5)',
    cost: 99750,
    purchaseDate: '2023-09-15T10:00:00Z',
    vendor: 'Office Depot',
    imageUrl: getImageUrl('equipment-chair'),
    imageHint: 'office chair',
  },
  {
    id: 'eq-3',
    item: 'Cloud Server Hosting (1yr)',
    cost: 159600,
    purchaseDate: '2023-10-20T10:00:00Z',
    vendor: 'Cloud Provider Inc.',
    imageUrl: getImageUrl('equipment-server'),
    imageHint: 'server rack',
  },
];

export let miscExpenses: {
  id: string;
  item: string;
  cost: number;
  purchaseDate: string; // Use string to prevent timezone issues
  vendor: string;
}[] = [
  {
    id: 'misc-1',
    item: 'Office Rent (Q4)',
    cost: 199500,
    purchaseDate: '2023-10-01T10:00:00Z',
    vendor: 'City Properties',
  },
  {
    id: 'misc-2',
    item: 'Internet Bill (October)',
    cost: 13300,
    purchaseDate: '2023-10-05T10:00:00Z',
    vendor: 'FastNet ISP',
  },
  {
    id: 'misc-3',
    item: 'Legal Consultation',
    cost: 66500,
    purchaseDate: '2023-11-10T10:00:00Z',
    vendor: 'Law Associates',
  },
];

export let operationalCostsFund = {
  id: 'operational-costs',
  name: 'Operational Costs',
  description:
    'Our mission is to foster trust and empowering change through radical transparency. Your contribution supports the core team and infrastructure that makes our work possible, ensuring every donation can be tracked with integrity.',
  targetAmount: 15000000, // Static target for now
  raisedAmount: 1575000,
  donors: 88,
  imageUrl: getImageUrl('team-photo'),
  imageHint: 'team meeting',
};

export type User = {
  id: string;
  uid: string;
  name: string;
  email?: string;
  avatarUrl: string;
  profileUrl: string;
  bio: string;
  hasPaymentMethod?: boolean;
  isAdmin?: boolean;
  canCreateCampaigns?: boolean;
  friends?: string[];
  aiCredits?: number;
  isProMember?: boolean;
  isOnline?: boolean;
  lastSeen?: string;
};

export type Donor = Omit<
  User,
  'email' | 'hasPaymentMethod' | 'isAdmin' | 'friends'
>;

export type Donation = {
  id: string;
  donor: Donor;
  project: string;
  amount: number;
  date: string; // Use string to prevent timezone issues
  isAnonymous?: boolean;
  status: 'pending' | 'confirmed' | 'failed';
  paymentMethod: 'QR' | 'Card' | 'Bank';
};

export type PhysicalDonation = {
  id: string;
  donorName: string;
  donorEmail: string;
  projectName: string;
  itemName: string;
  quantity: number;
  donationType: 'drop-off' | 'pickup' | 'received';
  address?: string;
  status: 'Pending' | 'Completed' | 'Cancelled';
  date: string; // Use string to prevent timezone issues
  comments: Comment[];
  donorId?: string;
  featured?: boolean;
};

export type Notification = {
  id: string;
  title: string;
  description: string;
  date: string; // Use string to prevent timezone issues
  read: boolean;
  href: string;
};

export type TeamMember = {
  id: string;
  name: string;
  role: string;
  avatarUrl: string;
  bio: string;
  socials: {
    twitter: string;
    linkedin: string;
  };
  experience: {
    role: string;
    company: string;
    duration: string;
  }[];
  education: {
    degree: string;
    institution: string;
    year: string;
  }[];
  skills: string[];
};

export let teamMembers: TeamMember[] = [
  {
    id: 'aayush-kc',
    name: 'Aayush KC',
    role: 'Founder & CEO',
    avatarUrl: getImageUrl('avatar-alex-johnson'),
    bio:
      'Aayush is a passionate social entrepreneur dedicated to leveraging technology for good. With a background in computer science and a heart for philanthropy, he founded milijuli donation sewa to bring trust, transparency, and efficiency back to the non-profit sector. He believes that by showing donors exactly where their money goes, we can inspire a new wave of giving.',
    socials: {
      twitter: 'https://twitter.com/aayushkc',
      linkedin: 'https://linkedin.com/in/aayushkc',
    },
    experience: [
      {
        role: 'Founder & CEO',
        company: 'milijuli donation sewa',
        duration: '2022 - Present',
      },
      {
        role: 'Senior Software Engineer',
        company: 'Tech for Good Inc.',
        duration: '2018 - 2022',
      },
      {
        role: 'Software Engineer',
        company: 'Innovate Solutions',
        duration: '2015 - 2018',
      },
    ],
    education: [
      {
        degree: 'M.S. in Computer Science',
        institution: 'Stanford University',
        year: '2015',
      },
      {
        degree: 'B.S. in Computer Science',
        institution: 'University of California, Berkeley',
        year: '2013',
      },
    ],
    skills: [
      'Social Entrepreneurship',
      'Blockchain',
      'Full-Stack Development',
      'Strategic Planning',
      'Fundraising',
    ],
  },
  {
    id: 'priya-adhikari',
    name: 'Priya Adhikari',
    role: 'Head of Operations (Nepal)',
    avatarUrl: getImageUrl('avatar-maria-garcia'),
    bio:
      "Priya ensures that all our projects run smoothly and efficiently, from initial planning to final impact reporting. With over a decade of experience in non-profit management and on-the-ground fieldwork in Nepal, she is an expert in logistics, community engagement, and sustainable development. Priya's dedication is the driving force behind our operational excellence.",
    socials: {
      twitter: 'https://twitter.com/priyaadhikari',
      linkedin: 'https://linkedin.com/in/priyaadhikari',
    },
    experience: [
      {
        role: 'Head of Operations (Nepal)',
        company: 'milijuli donation sewa',
        duration: '2022 - Present',
      },
      {
        role: 'Program Director',
        company: 'Himalayan Aid',
        duration: '2015 - 2022',
      },
      {
        role: 'Field Coordinator',
        company: 'Hope International, Nepal',
        duration: '2010 - 2015',
      },
    ],
    education: [
      {
        degree: 'M.A. in International Development',
        institution: 'Kathmandu University',
        year: '2010',
      },
      {
        degree: 'B.A. in Sociology',
        institution: 'Tribhuvan University',
        year: '2008',
      },
    ],
    skills: [
      'Non-Profit Management',
      'Project Coordination',
      'Community Outreach',
      'Logistics (Nepal)',
      'Grant Management',
    ],
  },
  {
    id: 'rohan-maharjan',
    name: 'Rohan Maharjan',
    role: 'Lead Full-Stack Developer',
    avatarUrl: getImageUrl('avatar-sam-chen'),
    bio:
      "Rohan is the architect behind our platform. He's a firm believer in the power of technology to create a fairer and more accountable world. With expertise in modern web technologies and distributed systems, Rohan built the core of milijuli donation sewa to be secure, scalable, and accessible to everyone, ensuring every donation is tracked from start to finish.",
    socials: {
      twitter: 'https://twitter.com/rohanmaharjan',
      linkedin: 'https://linkedin.com/in/rohanmaharjan',
    },
    experience: [
      {
        role: 'Lead Full-Stack Developer',
        company: 'milijuli donation sewa',
        duration: '2022 - Present',
      },
      {
        role: 'Senior Software Engineer',
        company: 'ConnectSphere',
        duration: '2019 - 2022',
      },
      {
        role: 'Backend Engineer',
        company: 'Fintech Innovations',
        duration: '2017 - 2019',
      },
    ],
    education: [
      {
        degree: 'B.S. in Software Engineering',
        institution: 'Carnegie Mellon University',
        year: '2017',
      },
    ],
    skills: ['Next.js', 'React', 'Node.js', 'TypeScript', 'System Architecture', 'Firebase'],
  },
  {
    id: 'sunita-sharma',
    name: 'Sunita Sharma',
    role: 'Community Manager (Nepal)',
    avatarUrl:
      'https://images.unsplash.com/photo-1615216367249-b3a535893f66?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwyfHxuZXBhbGklMjB3b21hbnxlbnwwfHx8fDE3NTg4NzQ2MDd8MA&ixlib=rb-4.1.0&q=80&w=1080',
    bio:
      'Sunita is the voice of milijuli donation sewa in Nepal. She works directly with our local project partners and user community, providing support, gathering feedback, and sharing their stories. Her passion for community building and her deep understanding of the local context are invaluable to our mission.',
    socials: {
      twitter: 'https://twitter.com/sunitasharma',
      linkedin: 'https://linkedin.com/in/sunitasharma',
    },
    experience: [
      {
        role: 'Community Manager (Nepal)',
        company: 'milijuli donation sewa',
        duration: '2023 - Present',
      },
      {
        role: 'Social Media Coordinator',
        company: 'SastoDeal',
        duration: '2020 - 2023',
      },
      {
        role: 'Communications Intern',
        company: 'UNESCO Nepal',
        duration: '2019 - 2020',
      },
    ],
    education: [
      {
        degree: 'B.A. in Journalism and Mass Communication',
        institution: 'Ratna Rajya Laxmi Campus, Kathmandu',
        year: '2019',
      },
    ],
    skills: [
      'Community Engagement',
      'Social Media Management',
      'Content Creation',
      'Event Planning',
      'Nepali & English Fluency',
    ],
  },
   {
    id: 'david-kim',
    name: 'David Kim',
    role: 'Marketing Lead',
    avatarUrl: getImageUrl('avatar-david-kim'),
    bio: "David spearheads our global marketing efforts, focusing on growing our community of donors and project creators. He's an expert in digital storytelling and data-driven marketing, dedicated to sharing the impact of transparent giving with the world.",
    socials: {
      twitter: 'https://twitter.com/davidkim',
      linkedin: 'https://linkedin.com/in/davidkim',
    },
    experience: [
      { role: 'Marketing Lead', company: 'milijuli donation sewa', duration: '2023 - Present' },
      { role: 'Digital Marketing Manager', company: 'Global Impact Now', duration: '2019 - 2023' },
      { role: 'Marketing Specialist', company: 'StartUp Reach', duration: '2017 - 2019' },
    ],
    education: [
      { degree: 'MBA, Marketing', institution: 'Kellogg School of Management', year: '2017' },
      { degree: 'B.A. in Communications', institution: 'University of Southern California', year: '2014' },
    ],
    skills: ['Digital Marketing', 'Content Strategy', 'SEO/SEM', 'Brand Management', 'Data Analysis'],
  },
];

export let values: { title: string; description: string }[] = [
  {
    title: 'Absolute Transparency',
    description:
      'We believe that transparency is non-negotiable. Every financial transaction, from donation to expense, is publicly recorded and verifiable.',
  },
  {
    title: 'Donor Empowerment',
    description:
      "We empower donors with the information they need to make informed decisions and see the tangible results of their generosity. Your trust is our most valued asset.",
  },
  {
    title: 'Community-Centric',
    description:
      'We prioritize projects that are deeply rooted in the communities they serve, ensuring that solutions are sustainable, culturally appropriate, and create lasting impact.',
  },
  {
    title: 'Innovation for Good',
    description:
      'We constantly explore and implement new technologies, not for their own sake, but to solve real-world problems in the non-profit sector and enhance the effectiveness of giving.',
  },
];

export let aboutContent = {
  tagline: 'Fostering trust and empowering change through radical transparency.',
  mission:
    'Our mission is to rebuild the foundation of trust in philanthropy. We believe that every donor has the right to know exactly how their contribution is being used to create change. By leveraging cutting-edge technology and an unwavering commitment to openness, we provide a platform where donations are tracked, expenses are verified, and impact is clearly visible. We empower non-profits to showcase their incredible work with integrity and enable donors to give with absolute confidence, creating a world where every act of generosity is transparent, accountable, and profoundly impactful.',
};


export type JobOpening = {
  id: string;
  title: string;
  type: 'Full-time' | 'Part-time' | 'Volunteer';
  location: string;
  description: string;
  requirements: string[];
  featured?: boolean;
};

export let jobOpenings: JobOpening[] = [
  {
    id: 'job-1',
    title: 'Community Manager',
    type: 'Full-time',
    location: 'Kathmandu, Nepal',
    description:
      'We are looking for a passionate Community Manager to engage with our users, manage our social media presence, and build a strong, supportive community around milijuli donation sewa. You will be the voice of our organization.',
    requirements: [
      '2+ years of experience in community management or social media marketing.',
      'Excellent written and verbal communication skills in English and Nepali.',
      'Proven ability to grow and manage online communities.',
      'A strong passion for social causes and transparency.',
    ],
    featured: true,
  },
  {
    id: 'job-2',
    title: 'Fundraising Volunteer',
    type: 'Volunteer',
    location: 'Remote',
    description:
      'Join our team as a Fundraising Volunteer and help us connect with donors who share our vision. You will assist in online campaigns, outreach, and events to help us grow our impact.',
    requirements: [
      'Strong communication and interpersonal skills.',
      'A passion for fundraising and making a difference.',
      'Self-motivated and able to work independently.',
      'No prior experience required, just a willingness to learn and contribute.',
    ],
    featured: true,
  },
  {
    id: 'job-3',
    title: 'Frontend Developer',
    type: 'Part-time',
    location: 'Remote',
    description:
      "We are seeking a talented Frontend Developer to help us improve our platform's user experience. You will work on building new features, optimizing performance, and ensuring our UI is intuitive and accessible.",
    requirements: [
      'Proficient in React, Next.js, and TypeScript.',
      'Experience with Tailwind CSS and modern styling practices.',
      'A strong eye for design and user experience.',
      'Familiarity with web3 concepts is a plus.',
    ],
    featured: false,
  },
];

export type FAQ = {
  id: string;
  question: string;
  answer: string;
};

export let faqs: FAQ[] = [
  {
    id: 'faq-1',
    question: 'How do I know my donation is secure?',
    answer:
      'We use industry-standard encryption and partner with trusted payment gateways to ensure every transaction is secure. Additionally, all verified projects use our blockchain ledger to track funds, providing an immutable record of where your money goes.',
  },
  {
    id: 'faq-2',
    question: 'Can I get a refund for my donation?',
    answer:
      'Donations are generally non-refundable. However, in exceptional circumstances, such as a project failing to start, we will work to reallocate the funds to a similar project or offer credits. Please contact support for any specific issues.',
  },
  {
    id: 'faq-3',
    question: "How does a project get a 'Verified' badge?",
    answer:
      "A 'Verified' badge indicates that the organization has undergone a basic due diligence process by our team. This confirms that it is a legally registered entity with a stated mission. To become verified, organizations must provide proof of legal registration and identity verification for their leaders.",
  },
  {
    id: 'faq-4',
    question: 'What does the "Verified Transparent" badge mean?',
    answer:
      'This is our highest standard of accountability. A "Verified Transparent" project has committed to full on-chain financial transparency. This means every donation, expense, and transfer of funds is recorded on a public blockchain, which is cryptographically secured and cannot be altered. Donors can independently audit all financial activity from start to finish.',
  },
];

export let contactInfo = {
  email: 'support@milijulisewa.com',
  phone: '+1234567890',
  address: '123 Transparency Lane\nKathmandu, Nepal',
};

export let socialLinks = {
  whatsapp: '+1234567890',
  viber: '+1234567890',
  instagram: 'https://instagram.com/your-profile',
  messenger: 'your.username',
};

export let paymentGateways: Gateway[] = [
  {
    name: 'Esewa',
    enabled: true,
    qrValue: 'esewa-id',
    generatedQr:
      'https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=esewa-id',
  },
  {
    name: 'Khalti',
    enabled: true,
    qrValue: 'khalti-id',
    generatedQr:
      'https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=khalti-id',
  },
  {
    name: 'FonePay',
    enabled: true,
    qrValue: 'fonepay-id',
    generatedQr:
      'https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=fonepay-id',
  },
  { name: 'PayPal', enabled: false, qrValue: '', generatedQr: '' },
  {
    name: 'Stripe',
    enabled: true,
    qrValue: 'stripe-id',
    generatedQr:
      'https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=stripe-id',
  },
  { name: 'Crypto', enabled: false, qrValue: '', generatedQr: '' },
];

export let platformSettings = {
  appName: 'milijuli donation sewa',
  appLogoUrl: '',
  loginImages: [
    { imageUrl: getImageUrl('project-education-nepal'), label: 'Education for All' },
    { imageUrl: getImageUrl('project-clean-water'), label: 'Clean Water Initiative' },
    { imageUrl: getImageUrl('project-community-health'), label: 'Community Health' },
    { imageUrl: getImageUrl('project-disaster-relief'), label: 'Disaster Relief' },
  ],
  userQrPaymentsEnabled: true,
  campaignCreationEnabled: true,
  showOperationalCostsTotal: true,
  showOperationalCostsTarget: false, // Default to false as requested
  aiSummaryEnabled: true,
};

export let users: User[] = [
    { id: 'admin-user', uid: 'admin-user', name: 'Admin User', email: 'admin@example.com', avatarUrl: getImageUrl('avatar-alex-johnson'), profileUrl: '/profile/admin-user', bio: 'Application administrator.', hasPaymentMethod: true, isAdmin: true, canCreateCampaigns: true, friends: [], aiCredits: 9999, isProMember: true, isOnline: true },
    { id: 'aayush-kc', uid: 'aayush-kc', name: 'Aayush KC', email: 'aayush.kc@example.com', avatarUrl: getImageUrl('avatar-alex-johnson'), profileUrl: '/profile/aayush-kc', bio: 'Founder & CEO of milijuli donation sewa. Passionate about transparency and social impact.', hasPaymentMethod: true, isAdmin: true, canCreateCampaigns: true, friends: ['priya-adhikari', 'rohan-maharjan', 'user-jane-doe'], aiCredits: 999, isProMember: true, isOnline: true },
    { id: 'priya-adhikari', uid: 'priya-adhikari', name: 'Priya Adhikari', avatarUrl: getImageUrl('avatar-maria-garcia'), profileUrl: '/profile/priya-adhikari', bio: 'Head of Operations in Nepal, ensuring projects run smoothly and create lasting change.', friends: ['aayush-kc', 'sunita-sharma'], aiCredits: 50, isProMember: true, canCreateCampaigns: true, isAdmin: true, isOnline: false, lastSeen: '2023-11-29T10:00:00Z' },
    { id: 'rohan-maharjan', uid: 'rohan-maharjan', name: 'Rohan Maharjan', avatarUrl: getImageUrl('avatar-sam-chen'), profileUrl: '/profile/rohan-maharjan', bio: 'Lead developer building the future of transparent fundraising.', friends: ['aayush-kc', 'david-kim'], aiCredits: 50, isProMember: true, canCreateCampaigns: true, isAdmin: true, isOnline: true },
    { id: 'sunita-sharma', uid: 'sunita-sharma', name: 'Sunita Sharma', avatarUrl: getImageUrl('avatar-sunita-sharma'), profileUrl: '/profile/sunita-sharma', bio: 'Community Manager, connecting with our partners and users in Nepal.', friends: ['priya-adhikari', 'user-raj-patel'], aiCredits: 50, isProMember: true, canCreateCampaigns: true, isOnline: true },
    { id: 'david-kim', uid: 'david-kim', name: 'David Kim', avatarUrl: getImageUrl('avatar-david-kim'), profileUrl: '/profile/david-kim', bio: 'Marketing Lead, spreading the word about transparent giving.', friends: ['rohan-maharjan'], aiCredits: 50, isProMember: true, canCreateCampaigns: true, isOnline: false, lastSeen: '2023-11-29T12:00:00Z' },
    { id: 'user-jane-doe', uid: 'user-jane-doe', name: 'Jane Doe', email: 'jane.doe@example.com', avatarUrl: getImageUrl('avatar-jane-doe'), profileUrl: '/profile/user-jane-doe', bio: 'Supporting causes that matter, one donation at a time.', hasPaymentMethod: true, friends: ['user-john-smith', 'aayush-kc'], aiCredits: 10, isProMember: false, isOnline: false, lastSeen: '2023-11-28T18:00:00Z' },
    { id: 'user-john-smith', uid: 'user-john-smith', name: 'John Smith', email: 'john.smith@example.com', avatarUrl: getImageUrl('avatar-john-smith'), profileUrl: '/profile/user-john-smith', bio: 'Happy to contribute to transparent and impactful projects.', friends: ['user-jane-doe'], aiCredits: 25, isProMember: true, isOnline: true },
    { id: 'user-ai-chan', uid: 'user-ai-chan', name: 'Ai Chan', email: 'ai.chan@example.com', avatarUrl: getImageUrl('avatar-ai-chan'), profileUrl: '/profile/user-ai-chan', bio: 'Believer in technology for social good.', hasPaymentMethod: true, friends: [], canCreateCampaigns: true, aiCredits: 100, isProMember: true, isOnline: true },
    { id: 'user-raj-patel', uid: 'user-raj-patel', name: 'Raj Patel', email: 'raj.patel@example.com', avatarUrl: getImageUrl('avatar-raj-patel'), profileUrl: '/profile/user-raj-patel', bio: "Let's build a better world together. Creator of the 'Art for All' campaign.", friends: ['sunita-sharma'], aiCredits: 0, isProMember: false, canCreateCampaigns: true, isOnline: false, lastSeen: '2023-11-30T08:00:00Z' },
    { id: 'user-anonymous', uid: 'user-anonymous', name: 'Anonymous', avatarUrl: getImageUrl('avatar-anonymous'), profileUrl: '/profile/user-anonymous', bio: 'A generous donor who prefers to remain anonymous.', isOnline: false },
]

export let currentUser = users.find(u => u.email === 'admin@example.com');
if (currentUser) {
    currentUser.isAdmin = true;
}


export const allDonations: Donation[] = [
  { id: 'don-1', donor: users.find(u => u.id === 'user-jane-doe')!, project: 'Education for All Nepal', amount: 5000, date: '2023-10-01T10:00:00Z', status: 'confirmed', paymentMethod: 'Card' },
  { id: 'don-2', donor: users.find(u => u.id === 'user-john-smith')!, project: 'Education for All Nepal', amount: 10000, date: '2023-10-02T11:30:00Z', status: 'confirmed', paymentMethod: 'Card' },
  { id: 'don-3', donor: users.find(u => u.id === 'user-ai-chan')!, project: 'Clean Water Initiative', amount: 7500, date: '2023-10-03T14:00:00Z', status: 'confirmed', paymentMethod: 'Bank' },
  { id: 'don-4', donor: users.find(u => u.id === 'user-raj-patel')!, project: 'Operational Costs', amount: 2000, date: '2023-10-04T09:00:00Z', status: 'confirmed', paymentMethod: 'QR' },
  { id: 'don-5', donor: users.find(u => u.id === 'aayush-kc')!, project: 'Disaster Relief Fund', amount: 25000, date: '2023-10-05T18:00:00Z', status: 'confirmed', paymentMethod: 'Card' },
  { id: 'don-6', donor: users.find(u => u.id === 'user-jane-doe')!, project: 'Community Health Posts', amount: 3000, date: '2023-10-06T12:00:00Z', status: 'confirmed', paymentMethod: 'QR' },
  { id: 'don-7', donor: users.find(u => u.id === 'priya-adhikari')!, project: 'Operational Costs', amount: 15000, date: '2023-10-07T15:00:00Z', status: 'confirmed', paymentMethod: 'Bank' },
  { id: 'don-8', donor: users.find(u => u.id === 'user-john-smith')!, project: 'Art for All', amount: 5000, date: '2023-11-15T10:00:00Z', status: 'confirmed', paymentMethod: 'Card' },
  { id: 'don-9', donor: users.find(u => u.id === 'user-ai-chan')!, project: 'Art for All', amount: 10000, date: '2023-11-16T11:00:00Z', status: 'confirmed', paymentMethod: 'QR' },
];

export let physicalDonations: PhysicalDonation[] = [
  { id: 'pd-1', donorName: 'Jane Doe', donorId: 'user-jane-doe', donorEmail: 'jane.doe@example.com', projectName: 'Education for All Nepal', itemName: 'School Benches', quantity: 10, donationType: 'pickup', address: '123 Maple Street, Anytown', status: 'Pending', date: '2023-10-28T10:00:00Z', comments: [] },
  { id: 'pd-2', donorName: 'John Smith', donorId: 'user-john-smith', donorEmail: 'john.smith@example.com', projectName: 'Clean Water Initiative', itemName: 'Water Filters', quantity: 5, donationType: 'drop-off', status: 'Completed', date: '2023-10-25T14:00:00Z', comments: [], featured: true },
  { id: 'pd-3', donorName: 'Ai Chan', donorId: 'user-ai-chan', donorEmail: 'ai.chan@example.com', projectName: 'Education for All Nepal', itemName: 'School Backpacks', quantity: 50, donationType: 'drop-off', status: 'Completed', date: '2023-11-01T09:00:00Z', comments: [], featured: true },
  { id: 'pd-4', donorName: 'Raj Patel', donorId: 'user-raj-patel', donorEmail: 'raj.patel@example.com', projectName: 'Art for All', itemName: 'Watercolor Paint Sets', quantity: 20, donationType: 'pickup', address: '456 Oak Avenue, Sometown', status: 'Completed', date: '2023-11-20T10:00:00Z', comments: [], featured: true },
  { id: 'pd-5', donorName: 'Jane Doe', donorId: 'user-jane-doe', donorEmail: 'jane.doe@example.com', projectName: 'Art for All', itemName: 'Drawing Canvases (8x10)', quantity: 30, donationType: 'drop-off', status: 'Pending', date: '2023-11-22T10:00:00Z', comments: [] },
  { id: 'pd-6', donorName: 'Aayush KC', donorId: 'aayush-kc', donorEmail: 'aayush.kc@example.com', projectName: 'Education for All Nepal', itemName: 'Whiteboards', quantity: 2, donationType: 'drop-off', status: 'Completed', date: '2023-11-05T10:00:00Z', comments: [], featured: true },
  { id: 'pd-7', donorName: 'David Kim', donorId: 'david-kim', donorEmail: 'david.kim@example.com', projectName: 'Disaster Relief Fund', itemName: 'Tarps', quantity: 100, donationType: 'received', status: 'Completed', date: '2023-11-28T10:00:00Z', comments: [] },
  { id: 'pd-8', donorName: 'Priya Adhikari', donorId: 'priya-adhikari', donorEmail: 'priya.adhikari@example.com', projectName: 'Community Health Posts', itemName: 'First-Aid Kits', quantity: 25, donationType: 'received', status: 'Completed', date: '2023-12-01T10:00:00Z', comments: [] },
  { id: 'pd-9', donorName: 'Rohan Maharjan', donorId: 'rohan-maharjan', donorEmail: 'rohan.maharjan@example.com', projectName: 'Clean Water Initiative', itemName: 'Water Filters', quantity: 10, donationType: 'pickup', address: '789 Pine Lane, Their Town', status: 'Cancelled', date: '2023-12-02T10:00:00Z', comments: [] },
  { id: 'pd-10', donorName: 'Sunita Sharma', donorId: 'sunita-sharma', donorEmail: 'sunita.sharma@example.com', projectName: 'Education for All Nepal', itemName: 'School Backpacks', quantity: 30, donationType: 'drop-off', status: 'Pending', date: '2023-12-05T10:00:00Z', comments: [] },
];
