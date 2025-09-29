

import { PlaceHolderImages } from './placeholder-images';

function getImageUrl(id: string) {
  return PlaceHolderImages.find((img) => img.id === id)?.imageUrl || '';
}

export type Comment = {
  id: string;
  author: string;
  avatarUrl: string;
  profileUrl: string;
  date: string; // Use string to prevent timezone issues
  text: string;
  replyTo?: string; // Author name of the comment being replied to
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
        amount: number;
    }
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
}

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
};

export let projects: Project[] = [];


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
    }
]

// Calculate operational costs
const totalSalaryCosts = salaries.reduce((acc, s) => {
    // Basic conversion for calculation, in a real app this would use live rates
    const nprAmount = s.currency === 'USD' ? s.salary * 133 : s.salary;
    return acc + nprAmount;
}, 0); // Monthly in NPR
const totalEquipmentCosts = equipment.reduce((acc, e) => acc + e.cost, 0);
const totalMiscCosts = miscExpenses.reduce((acc, e) => acc + e.cost, 0);
export const totalOperationalCosts = totalSalaryCosts * 12 + totalEquipmentCosts + totalMiscCosts; // Annualized for target

export let operationalCostsFund = {
    id: 'operational-costs',
    name: 'Operational Costs',
    description: 'Support the core team and infrastructure that make our work possible.',
    targetAmount: 15000000, // Static target for now
    raisedAmount: 1575000,
    donors: 88,
    imageUrl: getImageUrl('team-photo'),
    imageHint: 'team meeting',
};

// Calculate project expenses by category
const educationExpenses = projects
  .filter(p => p.id === 'education-for-all-nepal')
  .reduce((sum, p) => sum + p.expenses.reduce((acc, exp) => acc + exp.amount, 0), 0);

const healthExpenses = projects
  .filter(p => ['clean-water-initiative', 'community-health-posts'].includes(p.id))
  .reduce((sum, p) => sum + p.expenses.reduce((acc, exp) => acc + exp.amount, 0), 0);

const reliefExpenses = projects
  .filter(p => p.id === 'disaster-relief-fund')
  .reduce((sum, p) => sum + p.expenses.reduce((acc, exp) => acc + exp.amount, 0), 0);
  
const currentOperationalExpenses = (totalSalaryCosts * 12) + totalEquipmentCosts + totalMiscCosts; // Use annualized salary for this calculation

// Calculate totals for dashboard stats
const totalRaised = projects.reduce((acc, p) => acc + p.raisedAmount, 0) + operationalCostsFund.raisedAmount;
const totalProjectExpenses = projects.reduce(
  (acc, p) => acc + p.expenses.reduce((sum, e) => sum + e.amount, 0),
  0
);
const totalSpending = totalProjectExpenses + currentOperationalExpenses;
const fundsInHand = totalRaised - totalSpending;


export let dashboardStats = {
  totalFunds: totalRaised,
  monthlyIncrease: 2012300,
  totalDonors: 4950,
  newDonors: 213,
  projectsFunded: 4,
  countries: 1,
  totalSpent: totalSpending,
  fundsInHand: fundsInHand,
  spendingBreakdown: [
    { name: 'Education', value: educationExpenses, key: 'education' },
    { name: 'Health', value: healthExpenses, key: 'health' },
    { name: 'Relief', value: reliefExpenses, key: 'relief' },
    { name: 'Operational', value: currentOperationalExpenses, key: 'operational' },
  ],
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
}

export let users: User[] = [
    { 
        id: 'current-user', 
        uid: 'current-user',
        name: 'Aayush KC', 
        email: 'aayush.kc@example.com',
        avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=500&h=500&fit=crop', 
        profileUrl: '/profile/current-user',
        bio: 'A passionate supporter of community-driven projects and a firm believer in the power of transparent giving.',
        hasPaymentMethod: false,
        isAdmin: true,
        friends: ['user-sita-rai', 'user-hari-thapa'],
        aiCredits: 100,
        isProMember: true,
    },
    { 
        id: 'user-sita-rai', 
        uid: 'user-sita-rai',
        name: 'Sita Rai', 
        email: 'sita.rai@example.com',
        avatarUrl: getImageUrl('avatar-jane-doe'), 
        profileUrl: '/profile/user-sita-rai',
        bio: 'Loves to contribute to educational projects. Believes in the power of knowledge.',
        hasPaymentMethod: true,
        canCreateCampaigns: true,
        friends: ['current-user'],
        aiCredits: 5,
        isProMember: false,
    },
    { 
        id: 'user-hari-thapa', 
        uid: 'user-hari-thapa',
        name: 'Hari Thapa', 
        email: 'hari.thapa@example.com',
        avatarUrl: getImageUrl('avatar-john-smith'), 
        profileUrl: '/profile/user-hari-thapa',
        bio: 'Focused on environmental causes and clean water initiatives.',
        hasPaymentMethod: true,
        friends: ['current-user', 'user-maya-gurung'],
        aiCredits: 15,
        isProMember: true,
    },
    { 
        id: 'user-maya-gurung', 
        uid: 'user-maya-gurung',
        name: 'Maya Gurung', 
        email: 'maya.gurung@example.com',
        avatarUrl: getImageUrl('avatar-ai-chan'), 
        profileUrl: '/profile/user-maya-gurung',
        bio: 'Supports disaster relief and emergency response efforts.',
        hasPaymentMethod: true,
        friends: ['user-hari-thapa'],
        aiCredits: 0,
        isProMember: false,
    },
    { 
        id: 'user-bikram-shah', 
        uid: 'user-bikram-shah',
        name: 'Bikram Shah',
        email: 'bikram.shah@example.com',
        avatarUrl: getImageUrl('avatar-raj-patel'), 
        profileUrl: '/profile/user-bikram-shah',
        bio: 'Interested in community health and wellness projects.',
        hasPaymentMethod: false,
        friends: [],
        aiCredits: 0,
        isProMember: false,
    },
    { 
        id: 'user-anonymous', 
        uid: 'user-anonymous',
        name: 'Anonymous', 
        avatarUrl: getImageUrl('avatar-anonymous'), 
        profileUrl: '/profile/user-anonymous',
        bio: 'An anonymous donor making a difference.',
        hasPaymentMethod: true,
        friends: [],
        aiCredits: 0,
        isProMember: false,
    },
     { 
        id: 'milijuli-sewa-admin',
        uid: 'milijuli-sewa-admin',
        name: 'milijuli sewa Admin', 
        email: 'admin@milijulisewa.com',
        avatarUrl: getImageUrl('logo-milijuli-sewa'), 
        profileUrl: '/profile/milijuli-sewa-admin',
        bio: 'The official account for the milijuli sewa organization.',
        hasPaymentMethod: true,
        isAdmin: true,
        friends: [],
        aiCredits: 999,
        isProMember: true,
    },
    {
        id: 'sunita-sharma',
        uid: 'sunita-sharma',
        name: 'Sunita Sharma',
        email: 'sunita.sharma@example.com',
        avatarUrl: 'https://images.unsplash.com/photo-1615216367249-b3a535893f66?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwyfHxuZXBhbGklMjB3b21hbnxlbnwwfHx8fDE3NTg4NzQ2MDd8MA&ixlib=rb-4.1.0&q=80&w=1080',
        profileUrl: '/team/sunita-sharma',
        bio: 'Sunita is a community engagement specialist from Kathmandu, passionate about connecting people and causes.',
        friends: [],
        aiCredits: 10,
        isProMember: false,
    },
    {
        id: 'rohan-maharjan',
        uid: 'rohan-maharjan',
        name: 'Rohan Maharjan',
        avatarUrl: getImageUrl('avatar-sam-chen'),
        profileUrl: '/team/rohan-maharjan',
        bio:
        "Rohan is the architect behind our platform. He's a firm believer in the power of technology to create a fairer and more accountable world. With expertise in modern web technologies and distributed systems, Rohan built the core of milijuli sewa to be secure, scalable, and accessible to everyone, ensuring every donation is tracked from start to finish.",
        friends: [],
        aiCredits: 10,
        isProMember: false,
    },
    {
        id: 'priya-adhikari',
        uid: 'priya-adhikari',
        name: 'Priya Adhikari',
        avatarUrl: getImageUrl('avatar-maria-garcia'),
        profileUrl: '/team/priya-adhikari',
        bio:
      "Priya ensures that all our projects run smoothly and efficiently, from initial planning to final impact reporting. With over a decade of experience in non-profit management and on-the-ground fieldwork in Nepal, she is an expert in logistics, community engagement, and sustainable development. Priya's dedication is the driving force behind our operational excellence.",
        friends: [],
        aiCredits: 10,
        isProMember: false,
    }
];

export const currentUser = users.find(u => u.id === 'current-user');

export type Donor = Omit<User, 'email' | 'hasPaymentMethod' | 'isAdmin' | 'friends'>;

export type Donation = {
  id: number;
  donor: Donor;
  project: string;
  amount: number;
  date: string; // Use string to prevent timezone issues
  isAnonymous?: boolean;
};

// This represents a larger, more complete list of donations for the whole platform
function createDonationData(): Donation[] {
    const donorPool = users.filter(u => u.id !== 'milijuli-sewa-admin');
    
    // Create a static, deterministic list of donations
    const staticDonations: Omit<Donation, 'donor'|'id'>[] = [
      { project: 'Education for All Nepal', amount: 5000, date: '2024-05-20T10:00:00Z', isAnonymous: false },
      { project: 'Stray Animal Shelter Expansion', amount: 7500, date: '2024-05-19T14:30:00Z', isAnonymous: false },
      { project: 'Education for All Nepal', amount: 2000, date: '2024-05-18T09:00:00Z', isAnonymous: true },
      { project: 'Clean Water Initiative', amount: 10000, date: '2024-05-20T11:00:00Z', isAnonymous: false },
      { project: 'Clean Water Initiative', amount: 15000, date: '2024-05-19T18:00:00Z', isAnonymous: false },
      { project: 'Community Health Posts', amount: 8000, date: '2024-05-20T12:00:00Z', isAnonymous: false },
      { project: 'Disaster Relief Fund', amount: 25000, date: '2024-05-20T13:00:00Z', isAnonymous: true },
      { project: 'Disaster Relief Fund', amount: 50000, date: '2024-05-19T20:00:00Z', isAnonymous: false },
      { project: 'Rebuild the Local Library', amount: 3000, date: '2024-05-20T14:00:00Z', isAnonymous: false },
      { project: 'Stray Animal Shelter Expansion', amount: 12000, date: '2024-05-19T22:00:00Z', isAnonymous: false },
      { project: 'Operational Costs', amount: 1000, date: '2024-05-20T15:00:00Z', isAnonymous: true },
      { project: 'Operational Costs', amount: 2500, date: '2024-05-18T16:00:00Z', isAnonymous: false },
      { project: 'Operational Costs', amount: 500, date: '2024-05-17T11:00:00Z', isAnonymous: false },
    ];

    return staticDonations.map((donation, index) => ({
        ...donation,
        id: index + 1,
        donor: donation.isAnonymous ? users.find(u => u.id === 'user-anonymous')! : donorPool[index % donorPool.length],
    }));
}


export const allDonations: Donation[] = createDonationData();

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
};
  
export let physicalDonations: PhysicalDonation[] = [
    {
        id: 'pd-1',
        donorName: 'Sita Rai',
        donorEmail: 'sita.rai@example.com',
        projectName: 'Education for All Nepal',
        itemName: 'Set of Textbooks for a Child',
        quantity: 5,
        donationType: 'drop-off',
        status: 'Completed',
        date: '2023-11-10T10:00:00Z',
        address: '123 Transparency Lane\nKathmandu, Nepal',
        comments: [
            {
                id: 'pdc-1',
                author: 'Aayush KC',
                avatarUrl: getImageUrl('avatar-alex-johnson'),
                profileUrl: '/team/aayush-kc',
                date: '2023-11-11T10:00:00Z',
                text: 'Thank you so much for your generous donation, Sita! These textbooks will make a huge difference.'
            },
            {
                id: 'pdc-2',
                author: 'Sita Rai',
                avatarUrl: getImageUrl('avatar-jane-doe'),
                profileUrl: '/profile/user-sita-rai',
                date: '2023-11-11T12:30:00Z',
                text: "You're very welcome! Happy to help."
            }
        ]
    },
    {
        id: 'pd-2',
        donorName: 'Bikram Shah',
        donorEmail: 'bikram.shah@example.com',
        projectName: 'Education for All Nepal',
        itemName: 'Set of Textbooks for a Child',
        quantity: 10,
        donationType: 'pickup',
        address: '456 Oak Avenue, Springfield',
        status: 'Pending',
        date: '2023-11-12T10:00:00Z',
        comments: []
    }
];

export type Notification = {
  id: string;
  title: string;
  description: string;
  date: string; // Use string to prevent timezone issues
  read: boolean;
  href: string;
};

export const notifications: Notification[] = [
  {
    id: 'notif-1',
    title: 'New Donation!',
    description: 'You received a NPR 5,000 donation for "Education for All Nepal".',
    date: '2024-07-27T10:00:00Z', // 5 minutes ago
    read: false,
    href: '/projects/education-for-all-nepal?tab=donors',
  },
  {
    id: 'notif-2',
    title: 'Project Update',
    description: '"Clean Water Initiative" has been successfully funded!',
    date: '2024-07-27T08:05:00Z', // 2 hours ago
    read: false,
    href: '/projects/clean-water-initiative',
  },
  {
    id: 'notif-5',
    title: 'You were mentioned',
    description: 'Aayush KC mentioned you in a comment on "Education for All Nepal".',
    date: '2024-07-27T02:05:00Z', // 8 hours ago
    read: false,
    href: '/projects/education-for-all-nepal?tab=discussion',
  },
  {
    id: 'notif-6',
    title: 'New Reply',
    description: 'Aayush KC replied to your comment on "Education for All Nepal".',
    date: '2024-07-27T02:05:00Z', // 8 hours ago
    read: true,
    href: '/projects/education-for-all-nepal?tab=discussion',
  },
  {
    id: 'notif-3',
    title: 'New Team Member',
    description: 'Rohan Maharjan has joined the team as Lead Full-Stack Developer.',
    date: '2024-07-26T10:05:00Z', // 1 day ago
    read: true,
    href: '/team/rohan-maharjan',
  },
  {
    id: 'notif-4',
    title: 'Weekly Summary',
    description: 'Your projects raised a total of NPR 125,000 this week.',
    date: '2024-07-24T10:05:00Z', // 3 days ago
    read: true,
    href: '/my-campaigns',
  },
];


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
      'Aayush is a passionate social entrepreneur dedicated to leveraging technology for good. With a background in computer science and a heart for philanthropy, he founded milijuli sewa to bring trust, transparency, and efficiency back to the non-profit sector. He believes that by showing donors exactly where their money goes, we can inspire a new wave of giving.',
    socials: {
        twitter: 'https://twitter.com/aayushkc',
        linkedin: 'https://linkedin.com/in/aayushkc'
    },
    experience: [
        { role: 'Founder & CEO', company: 'milijuli sewa', duration: '2022 - Present' },
        { role: 'Senior Software Engineer', company: 'Tech for Good Inc.', duration: '2018 - 2022' },
        { role: 'Software Engineer', company: 'Innovate Solutions', duration: '2015 - 2018' },
    ],
    education: [
        { degree: 'M.S. in Computer Science', institution: 'Stanford University', year: '2015' },
        { degree: 'B.S. in Computer Science', institution: 'University of California, Berkeley', year: '2013' },
    ],
    skills: ['Social Entrepreneurship', 'Blockchain', 'Full-Stack Development', 'Strategic Planning', 'Fundraising'],
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
        linkedin: 'https://linkedin.com/in/priyaadhikari'
    },
    experience: [
        { role: 'Head of Operations (Nepal)', company: 'milijuli sewa', duration: '2022 - Present' },
        { role: 'Program Director', company: 'Himalayan Aid', duration: '2015 - 2022' },
        { role: 'Field Coordinator', company: 'Hope International, Nepal', duration: '2010 - 2015' },
    ],
    education: [
        { degree: 'M.A. in International Development', institution: 'Kathmandu University', year: '2010' },
        { degree: 'B.A. in Sociology', institution: 'Tribhuvan University', year: '2008' },
    ],
    skills: ['Non-Profit Management', 'Project Coordination', 'Community Outreach', 'Logistics (Nepal)', 'Grant Management'],
  },
  {
    id: 'rohan-maharjan',
    name: 'Rohan Maharjan',
    role: 'Lead Full-Stack Developer',
    avatarUrl: getImageUrl('avatar-sam-chen'),
    bio:
      "Rohan is the architect behind our platform. He's a firm believer in the power of technology to create a fairer and more accountable world. With expertise in modern web technologies and distributed systems, Rohan built the core of milijuli sewa to be secure, scalable, and accessible to everyone, ensuring every donation is tracked from start to finish.",
    socials: {
        twitter: 'https://twitter.com/rohanmaharjan',
        linkedin: 'https://linkedin.com/in/rohanmaharjan'
    },
    experience: [
        { role: 'Lead Full-Stack Developer', company: 'milijuli sewa', duration: '2022 - Present' },
        { role: 'Senior Software Engineer', company: 'ConnectSphere', duration: '2019 - 2022' },
        { role: 'Backend Engineer', company: 'Fintech Innovations', duration: '2017 - 2019' },
    ],
    education: [
        { degree: 'B.S. in Software Engineering', institution: 'Carnegie Mellon University', year: '2017' },
    ],
    skills: ['Next.js', 'React', 'Node.js', 'TypeScript', 'System Architecture', 'Firebase'],
  },
  {
    id: 'sunita-sharma',
    name: 'Sunita Sharma',
    role: 'Community Manager (Nepal)',
    avatarUrl: 'https://images.unsplash.com/photo-1615216367249-b3a535893f66?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwyfHxuZXBhbGklMjB3b21hbnxlbnwwfHx8fDE3NTg4NzQ2MDd8MA&ixlib=rb-4.1.0&q=80&w=1080',
    bio:
      'Sunita is the voice of milijuli sewa in Nepal. She works directly with our local project partners and user community, providing support, gathering feedback, and sharing their stories. Her passion for community building and her deep understanding of the local context are invaluable to our mission.',
    socials: {
        twitter: 'https://twitter.com/sunitasharma',
        linkedin: 'https://linkedin.com/in/sunitasharma'
    },
    experience: [
        { role: 'Community Manager (Nepal)', company: 'milijuli sewa', duration: '2023 - Present' },
        { role: 'Social Media Coordinator', company: 'SastoDeal', duration: '2020 - 2023' },
        { role: 'Communications Intern', company: 'UNESCO Nepal', duration: '2019 - 2020' },
    ],
    education: [
        { degree: 'B.A. in Journalism and Mass Communication', institution: 'Ratna Rajya Laxmi Campus, Kathmandu', year: '2019' },
    ],
    skills: ['Community Engagement', 'Social Media Management', 'Content Creation', 'Event Planning', 'Nepali & English Fluency'],
  },
];


export function getTeamMember(id: string) {
  return teamMembers.find((member) => member.id === id);
}

export let values = [
  {
    title: 'Transparency',
    description:
      'We are committed to complete openness in how funds are raised, managed, and spent. Every transaction is public.',
  },
  {
    title: 'Accountability',
    description:
      'We hold ourselves to the highest standards, ensuring that all stakeholders can verify our actions and their impact.',
  },
  {
    title: 'Impact',
    description:
      'Our ultimate goal is to maximize the positive impact of every donation, creating lasting change in communities.',
  },
];

export let aboutContent = {
    mission: `Our mission is to bring radical transparency to the world of fundraising and charitable donations. We believe that every donor has the right to know exactly how their contributions are being used to make a difference. milijuli sewa provides a secure, auditable, and easy-to-understand platform that tracks funds from the moment they are donated to the point of expenditure, ensuring accountability and rebuilding trust in the non-profit sector.`,
    tagline: 'Driving transparency and trust in charitable giving through technology.',
}

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
    description: 'We are looking for a passionate Community Manager to engage with our users, manage our social media presence, and build a strong, supportive community around milijuli sewa. You will be the voice of our organization.',
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
    description: 'Join our team as a Fundraising Volunteer and help us connect with donors who share our vision. You will assist in online campaigns, outreach, and events to help us grow our impact.',
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
    description: "We are seeking a talented Frontend Developer to help us improve our platform's user experience. You will work on building new features, optimizing performance, and ensuring our UI is intuitive and accessible.",
    requirements: [
        'Proficient in React, Next.js, and TypeScript.',
        'Experience with Tailwind CSS and modern styling practices.',
        'A strong eye for design and user experience.',
        'Familiarity with web3 concepts is a plus.',
    ],
    featured: false,
  }
];

export type FAQ = {
  id: string;
  question: string;
  answer: string;
};

let faqs: FAQ[] = [
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

// In-memory store for FAQs to allow for mutation on the admin page.
// In a real app, this would be a database.
let faqStore = [...faqs];
export const getFaqs = () => [...faqStore];
export const setFaqs = (newFaqs: FAQ[]) => {
  faqStore = newFaqs;
}


export let contactInfo = {
    email: 'support@milijulisewa.com',
    phone: '+1234567890',
    address: '123 Transparency Lane\nKathmandu, Nepal',
};


export let socialLinks = {
    whatsapp: '+1234567890',
    viber: '+1234567890',
    instagram: 'https://instagram.com/your-profile',
    messenger: 'your.username'
}
  
export let paymentGateways: Gateway[] = [
    { name: 'Esewa', enabled: true, qrValue: 'esewa-id', generatedQr: 'https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=esewa-id' },
    { name: 'Khalti', enabled: true, qrValue: 'khalti-id', generatedQr: 'https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=khalti-id' },
    { name: 'FonePay', enabled: true, qrValue: 'fonepay-id', generatedQr: 'https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=fonepay-id' },
    { name: 'PayPal', enabled: false, qrValue: '', generatedQr: '' },
    { name: 'Stripe', enabled: true, qrValue: 'stripe-id', generatedQr: 'https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=stripe-id' },
    { name: 'Crypto', enabled: false, qrValue: '', generatedQr: '' },
];

export let platformSettings = {
    appName: 'milijuli sewa',
    appLogoUrl: '',
    userQrPaymentsEnabled: true,
    campaignCreationEnabled: true,
    showOperationalCostsTotal: true,
    aiSummaryEnabled: true,
}
    

    
