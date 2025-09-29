

import { PlaceHolderImages } from './placeholder-images';

function getImageUrl(id: string) {
  return PlaceHolderImages.find((img) => img.id === id)?.imageUrl || '';
}

export type Comment = {
  id: string;
  author: string;
  avatarUrl: string;
  profileUrl: string;
  date: Date;
  text: string;
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
  updates: {
    id: string;
    title: string;
    description: string;
    date: Date;
    imageUrl: string;
    imageHint: string;
  }[];
  expenses: {
    id: 'string';
    item: string;
    amount: number;
    date: Date;
    receiptUrl: string;
    receiptHint: string;
  }[];
  discussion: Comment[];
  wishlist: WishlistItem[];
  gateways?: Gateway[];
};

export let projects: Project[] = [
  {
    id: 'education-for-all-nepal',
    name: 'Education for All Nepal',
    organization: 'Hope Foundation',
    ownerId: 'clarity-chain-admin',
    description:
      'Providing quality education to underprivileged children in rural Nepal.',
    longDescription:
      'This project aims to build and equip schools in remote areas of Nepal, providing access to quality education for children who would otherwise be left behind. Funds will be used for school construction, teacher salaries, and learning materials.',
    imageUrl: getImageUrl('project-education-nepal'),
    imageHint: 'nepal classroom',
    targetAmount: 50000,
    raisedAmount: 32500,
    donors: 450,
    verified: true,
    updates: [
      {
        id: 'update-1',
        title: 'New textbooks arrived!',
        description: 'The first batch of new textbooks has been delivered to the students. Their faces lit up with joy!',
        date: new Date('2023-10-15'),
        imageUrl: getImageUrl('update-photo-1'),
        imageHint: 'happy students',
      },
      {
        id: 'update-2',
        title: 'Foundation for the new school building is complete.',
        description: 'Construction is on schedule! The foundation has been laid, and we are ready for the next phase.',
        date: new Date('2023-09-20'),
        imageUrl: getImageUrl('update-photo-2'),
        imageHint: 'construction site',
      },
    ],
    expenses: [
      {
        id: 'exp-1',
        item: 'School Textbooks Batch 1',
        amount: 1200,
        date: new Date('2023-10-12'),
        receiptUrl: getImageUrl('receipt-1'),
        receiptHint: 'receipt scan',
      },
      {
        id: 'exp-2',
        item: 'Cement and Bricks',
        amount: 3500,
        date: new Date('2023-09-15'),
        receiptUrl: getImageUrl('receipt-2'),
        receiptHint: 'invoice document',
      },
    ],
    discussion: [
      {
        id: 'comment-1',
        author: 'Jane Doe',
        avatarUrl: getImageUrl('avatar-jane-doe'),
        profileUrl: '/profile/user-jane-doe',
        date: new Date('2023-10-18T14:30:00Z'),
        text:
          "This is such a wonderful project! It's great to see the progress with the new school building. Keep up the amazing work.",
      },
      {
        id: 'comment-2',
        author: 'John Smith',
        avatarUrl: getImageUrl('avatar-john-smith'),
        profileUrl: '/profile/user-john-smith',
        date: new Date('2023-10-19T09:00:00Z'),
        text:
          'I agree with Jane. The transparency is key, and seeing the expense receipts for the textbooks and materials builds a lot of trust. Happy to be a donor!',
      },
    ],
    wishlist: [
      {
        id: 'wish-edu-1',
        name: 'Set of Textbooks for a Child',
        description: 'Provides a full set of required textbooks for one primary school student for a year.',
        quantityNeeded: 200,
        quantityDonated: 50,
        costPerItem: 25,
        imageUrl: getImageUrl('update-photo-1'),
        imageHint: 'school books',
        allowInKind: true,
      },
      {
        id: 'wish-edu-2',
        name: 'School Desk and Chair',
        description: 'A sturdy desk and chair for a student to learn comfortably.',
        quantityNeeded: 100,
        quantityDonated: 20,
        costPerItem: 40,
        imageUrl: 'https://picsum.photos/seed/wishlist-desk/400/300',
        imageHint: 'student desk',
        allowInKind: false,
      },
    ],
  },
  {
    id: 'clean-water-initiative',
    name: 'Clean Water Initiative',
    organization: 'AquaLife',
    ownerId: 'clarity-chain-admin',
    description:
      'Building wells to provide access to clean and safe drinking water.',
    longDescription:
      'Access to clean water is a fundamental human right. This project focuses on drilling wells and installing water purification systems in communities that lack safe drinking water, reducing disease and improving overall health.',
    imageUrl: getImageUrl('project-clean-water'),
    imageHint: 'water well',
    targetAmount: 75000,
    raisedAmount: 76100,
    donors: 1200,
    verified: true,
    updates: [],
    expenses: [
        {
            id: 'exp-cw-1',
            item: 'Well Drilling Equipment',
            amount: 15000,
            date: new Date('2023-11-01'),
            receiptUrl: getImageUrl('receipt-1'),
            receiptHint: 'receipt scan',
        }
    ],
    discussion: [],
    wishlist: [],
  },
  {
    id: 'community-health-posts',
    name: 'Community Health Posts',
    organization: 'Health for All',
    ownerId: 'clarity-chain-admin',
    description:
      'Establishing health posts to offer basic medical services in remote villages.',
    longDescription:
      'We are setting up community health posts staffed by trained professionals to provide essential healthcare services, including maternal care, vaccinations, and treatment for common illnesses, directly within remote communities.',
    imageUrl: getImageUrl('project-community-health'),
    imageHint: 'community health',
    targetAmount: 120000,
    raisedAmount: 45000,
    donors: 800,
    verified: false,
    updates: [],
    expenses: [
         {
            id: 'exp-chp-1',
            item: 'Medical Supplies',
            amount: 8000,
            date: new Date('2023-11-05'),
            receiptUrl: getImageUrl('receipt-2'),
            receiptHint: 'invoice document',
        }
    ],
    discussion: [],
    wishlist: [],
  },
  {
    id: 'disaster-relief-fund',
    name: 'Disaster Relief Fund',
    organization: 'Rapid Response Team',
    ownerId: 'clarity-chain-admin',
    description:
      'Providing immediate aid and support to areas affected by natural disasters.',
    longDescription:
      'This fund is dedicated to providing swift and effective relief in the aftermath of natural disasters. Donations help us deliver food, shelter, medical supplies, and other critical aid to those in desperate need.',
    imageUrl: getImageUrl('project-disaster-relief'),
    imageHint: 'disaster relief',
    targetAmount: 250000,
    raisedAmount: 180000,
    donors: 2500,
    verified: true,
    updates: [],
    expenses: [
        {
            id: 'exp-drf-1',
            item: 'Emergency Food Supplies',
            amount: 25000,
            date: new Date('2023-10-20'),
            receiptUrl: getImageUrl('receipt-1'),
            receiptHint: 'receipt scan',
        }
    ],
    discussion: [],
    wishlist: [],
  },
   {
    id: 'rebuild-the-local-library',
    name: 'Rebuild the Local Library',
    organization: 'Current User',
    ownerId: 'current-user',
    description: 'Help us rebuild our beloved community library after the recent fire.',
    longDescription: 'Our community library was a cornerstone of our town, offering a safe space for learning and discovery for all ages. After a tragic fire, we are fundraising to rebuild it from the ground up, with modern amenities and a larger collection of books. Your support will help us bring back this vital community hub.',
    imageUrl: 'https://picsum.photos/seed/library-fire/600/400',
    imageHint: 'library books',
    targetAmount: 85000,
    raisedAmount: 12000,
    donors: 150,
    verified: false,
    updates: [],
    expenses: [],
    discussion: [],
    wishlist: [],
    gateways: [
        { name: 'Esewa', enabled: true, qrValue: 'my-esewa-id', generatedQr: 'https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=my-esewa-id' },
        { name: 'Khalti', enabled: false, qrValue: '', generatedQr: '' },
        { name: 'FonePay', enabled: false, qrValue: '', generatedQr: '' },
        { name: 'PayPal', enabled: true, qrValue: 'paypal.me/my-campaign', generatedQr: 'https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=paypal.me%2Fmy-campaign' },
        { name: 'Stripe', enabled: false, qrValue: '', generatedQr: '' },
        { name: 'Crypto', enabled: false, qrValue: '', generatedQr: '' },
    ]
  },
  {
    id: 'stray-animal-shelter',
    name: 'Stray Animal Shelter Expansion',
    organization: 'Current User',
    ownerId: 'current-user',
    description: 'Help us expand our shelter to care for more stray animals in our city.',
    longDescription: 'Our current stray animal shelter is at full capacity, and we are forced to turn away animals in need every day. This campaign will fund the construction of a new wing, allowing us to rescue, treat, and re-home dozens more stray dogs and cats. Every dollar brings us closer to giving these animals a second chance.',
    imageUrl: 'https://picsum.photos/seed/stray-dog/600/400',
    imageHint: 'stray dog',
    targetAmount: 40000,
    raisedAmount: 38000,
    donors: 600,
    verified: true,
    updates: [],
    expenses: [],
    discussion: [],
    wishlist: [],
    gateways: []
  },
];

export let salaries: {
    id: string;
    employee: string;
    role: string;
    salary: number;
}[] = [
  {
    id: 'sal-1',
    employee: 'Alex Johnson',
    role: 'Project Manager',
    salary: 3000,
  },
  {
    id: 'sal-2',
    employee: 'Maria Garcia',
    role: 'Lead Developer',
    salary: 4000,
  },
  {
    id: 'sal-3',
    employee: 'Sam Chen',
    role: 'Marketing Head',
    salary: 2800,
  },
];

export let equipment: {
    id: string;
    item: string;
    cost: number;
    purchaseDate: Date;
    vendor: string;
    imageUrl?: string;
    imageHint?: string;
}[] = [
  {
    id: 'eq-1',
    item: 'MacBook Pro 16"',
    cost: 2500,
    purchaseDate: new Date('2023-10-01'),
    vendor: 'Apple Store',
    imageUrl: getImageUrl('equipment-macbook'),
    imageHint: 'laptop computer',
  },
  {
    id: 'eq-2',
    item: 'Ergonomic Office Chairs (x5)',
    cost: 750,
    purchaseDate: new Date('2023-09-15'),
    vendor: 'Office Depot',
    imageUrl: getImageUrl('equipment-chair'),
    imageHint: 'office chair',
  },
  {
    id: 'eq-3',
    item: 'Cloud Server Hosting (1yr)',
    cost: 1200,
    purchaseDate: new Date('2023-10-20'),
    vendor: 'Cloud Provider Inc.',
    imageUrl: getImageUrl('equipment-server'),
    imageHint: 'server rack',
  },
];

export let miscExpenses: {
    id: string;
    item: string;
    cost: number;
    purchaseDate: Date;
    vendor: string;
}[] = [
    {
        id: 'misc-1',
        item: 'Office Rent (Q4)',
        cost: 1500,
        purchaseDate: new Date('2023-10-01'),
        vendor: 'City Properties',
    },
    {
        id: 'misc-2',
        item: 'Internet Bill (October)',
        cost: 100,
        purchaseDate: new Date('2023-10-05'),
        vendor: 'FastNet ISP',
    }
]

// Calculate operational costs
const totalSalaryCosts = salaries.reduce((acc, s) => acc + s.salary, 0); // Monthly
const totalEquipmentCosts = equipment.reduce((acc, e) => acc + e.cost, 0);
const totalMiscCosts = miscExpenses.reduce((acc, e) => acc + e.cost, 0);
export const totalOperationalCosts = totalSalaryCosts * 12 + totalEquipmentCosts + totalMiscCosts; // Annualized for target

export let operationalCostsFund = {
    name: 'Operational Costs',
    description: 'Support the core team and infrastructure that make our work possible.',
    targetAmount: 150000, // Static target for now
    raisedAmount: 15750,
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
  
const currentOperationalExpenses = (totalSalaryCosts + totalEquipmentCosts + totalMiscCosts);

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
  monthlyIncrease: 20123,
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
    name: string;
    email?: string;
    avatarUrl: string;
    profileUrl: string;
    bio: string;
    hasPaymentMethod?: boolean;
    isAdmin?: boolean;
}

export let users: User[] = [
    { 
        id: 'current-user', 
        name: 'Current User', 
        email: 'donor@example.com',
        avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=500&h=500&fit=crop', 
        profileUrl: '/profile/current-user',
        bio: 'A passionate supporter of community-driven projects and a firm believer in the power of transparent giving.',
        hasPaymentMethod: false,
        isAdmin: true,
    },
    { 
        id: 'user-jane-doe', 
        name: 'Jane Doe', 
        avatarUrl: getImageUrl('avatar-jane-doe'), 
        profileUrl: '/profile/user-jane-doe',
        bio: 'Loves to contribute to educational projects. Believes in the power of knowledge.',
        hasPaymentMethod: true,
    },
    { 
        id: 'user-john-smith', 
        name: 'John Smith', 
        avatarUrl: getImageUrl('avatar-john-smith'), 
        profileUrl: '/profile/user-john-smith',
        bio: 'Focused on environmental causes and clean water initiatives.',
        hasPaymentMethod: true,
    },
    { 
        id: 'user-ai-chan', 
        name: 'Ai Chan', 
        avatarUrl: getImageUrl('avatar-ai-chan'), 
        profileUrl: '/profile/user-ai-chan',
        bio: 'Supports disaster relief and emergency response efforts.',
        hasPaymentMethod: true,
    },
    { 
        id: 'user-raj-patel', 
        name: 'Raj Patel',
        avatarUrl: getImageUrl('avatar-raj-patel'), 
        profileUrl: '/profile/user-raj-patel',
        bio: 'Interested in community health and wellness projects.',
        hasPaymentMethod: false,
    },
    { 
        id: 'user-anonymous', 
        name: 'Anonymous', 
        avatarUrl: getImageUrl('avatar-anonymous'), 
        profileUrl: '/profile/user-anonymous',
        bio: 'An anonymous donor making a difference.',
        hasPaymentMethod: true,
    },
     { 
        id: 'clarity-chain-admin', 
        name: 'ClarityChain', 
        avatarUrl: getImageUrl('logo-clarity-chain'), 
        profileUrl: '/profile/clarity-chain-admin',
        bio: 'The official account for the ClarityChain organization.',
        hasPaymentMethod: true,
        isAdmin: true,
    },
];

export const currentUser = users.find(u => u.id === 'current-user');

export type Donor = Omit<User, 'email' | 'hasPaymentMethod' | 'isAdmin'>;

export const recentDonations: {
  id: number;
  donor: Donor;
  project: string;
  amount: number;
  date: Date;
}[] = [
  {
    id: 1,
    donor: users.find(u => u.id === 'user-jane-doe')!,
    project: 'Education for All Nepal',
    amount: 50,
    date: new Date('2023-10-29T10:00:00Z'),
  },
  {
    id: 2,
    donor: users.find(u => u.id === 'user-john-smith')!,
    project: 'Clean Water Initiative',
    amount: 100,
    date: new Date('2023-10-29T09:30:00Z'),
  },
  {
    id: 3,
    donor: users.find(u => u.id === 'user-ai-chan')!,
    project: 'Disaster Relief Fund',
    amount: 250,
    date: new Date('2023-10-28T15:00:00Z'),
  },
  {
    id: 4,
    donor: users.find(u => u.id === 'user-raj-patel')!,
    project: 'Community Health Posts',
    amount: 75,
    date: new Date('2023-10-28T12:45:00Z'),
  },
  {
    id: 5,
    donor: users.find(u => u.id === 'user-anonymous')!,
    project: 'Clean Water Initiative',
    amount: 1000,
    date: new Date('2023-10-27T18:20:00Z'),
  },
  {
    id: 6,
    donor: users.find(u => u.id === 'user-jane-doe')!,
    project: 'Operational Costs',
    amount: 25,
    date: new Date('2023-10-26T11:00:00Z'),
  },
    {
    id: 7,
    donor: users.find(u => u.id === 'user-raj-patel')!,
    project: 'Operational Costs',
    amount: 50,
    date: new Date('2023-10-25T14:00:00Z'),
  },
];

export type PhysicalDonation = {
    id: string;
    donorName: string;
    donorEmail: string;
    projectName: string;
    itemName: string;
    quantity: number;
    donationType: 'drop-off' | 'pickup';
    address?: string;
    status: 'Pending' | 'Completed' | 'Cancelled';
    date: Date;
    comments: Comment[];
};
  
export let physicalDonations: PhysicalDonation[] = [
    {
        id: 'pd-1',
        donorName: 'Jane Doe',
        donorEmail: 'jane.doe@example.com',
        projectName: 'Education for All Nepal',
        itemName: 'Set of Textbooks for a Child',
        quantity: 5,
        donationType: 'drop-off',
        status: 'Completed',
        date: new Date('2023-11-10'),
        comments: [
            {
                id: 'pdc-1',
                author: 'Alex Johnson',
                avatarUrl: getImageUrl('avatar-alex-johnson'),
                profileUrl: '/team/alex-johnson',
                date: new Date('2023-11-11T10:00:00Z'),
                text: 'Thank you so much for your generous donation, Jane! These textbooks will make a huge difference.'
            },
            {
                id: 'pdc-2',
                author: 'Jane Doe',
                avatarUrl: getImageUrl('avatar-jane-doe'),
                profileUrl: '/profile/user-jane-doe',
                date: new Date('2023-11-11T12:30:00Z'),
                text: "You're very welcome! Happy to help."
            }
        ]
    },
    {
        id: 'pd-2',
        donorName: 'Raj Patel',
        donorEmail: 'raj.patel@example.com',
        projectName: 'Education for All Nepal',
        itemName: 'Set of Textbooks for a Child',
        quantity: 10,
        donationType: 'pickup',
        address: '456 Oak Avenue, Springfield',
        status: 'Pending',
        date: new Date('2023-11-12'),
        comments: []
    }
];

export type Notification = {
  id: string;
  title: string;
  description: string;
  date: Date;
  read: boolean;
};

export const notifications: Notification[] = [
  {
    id: 'notif-1',
    title: 'New Donation!',
    description: 'You received a $50 donation for "Education for All Nepal".',
    date: new Date(Date.now() - 1000 * 60 * 5), // 5 minutes ago
    read: false,
  },
  {
    id: 'notif-2',
    title: 'Project Update',
    description: '"Clean Water Initiative" has been successfully funded!',
    date: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
    read: false,
  },
  {
    id: 'notif-3',
    title: 'New Team Member',
    description: 'Sam Chen has joined the team as Lead Blockchain Developer.',
    date: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
    read: true,
  },
  {
    id: 'notif-4',
    title: 'Weekly Summary',
    description: 'Your projects raised a total of $1,250 this week.',
    date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3), // 3 days ago
    read: true,
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
    id: 'alex-johnson',
    name: 'Alex Johnson',
    role: 'Founder & CEO',
    avatarUrl: getImageUrl('avatar-alex-johnson'),
    bio:
      'Alex is a passionate social entrepreneur dedicated to leveraging technology for good. With a background in computer science and a heart for philanthropy, he founded ClarityChain to bring trust, transparency, and efficiency back to the non-profit sector. He believes that by showing donors exactly where their money goes, we can inspire a new wave of giving.',
    socials: {
        twitter: 'https://twitter.com/alexjohnson',
        linkedin: 'https://linkedin.com/in/alexjohnson'
    },
    experience: [
        { role: 'Founder & CEO', company: 'ClarityChain', duration: '2022 - Present' },
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
    id: 'maria-garcia',
    name: 'Maria Garcia',
    role: 'Head of Operations',
    avatarUrl: getImageUrl('avatar-maria-garcia'),
    bio:
      "Maria ensures that all our projects run smoothly and efficiently, from initial planning to final impact reporting. With over a decade of experience in non-profit management and on-the-ground fieldwork, she is an expert in logistics, community engagement, and sustainable development. Maria's dedication is the driving force behind our operational excellence.",
    socials: {
        twitter: 'https://twitter.com/mariagarcia',
        linkedin: 'https://linkedin.com/in/mariagarcia'
    },
    experience: [
        { role: 'Head of Operations', company: 'ClarityChain', duration: '2022 - Present' },
        { role: 'Program Director', company: 'Global Aid Network', duration: '2015 - 2022' },
        { role: 'Field Coordinator', company: 'Hope International', duration: '2010 - 2015' },
    ],
    education: [
        { degree: 'M.A. in International Development', institution: 'Georgetown University', year: '2010' },
        { degree: 'B.A. in Sociology', institution: 'University of Texas at Austin', year: '2008' },
    ],
    skills: ['Non-Profit Management', 'Project Coordination', 'Community Outreach', 'Logistics', 'Grant Management'],
  },
  {
    id: 'sam-chen',
    name: 'Sam Chen',
    role: 'Lead Blockchain Developer',
    avatarUrl: getImageUrl('avatar-sam-chen'),
    bio:
      "Sam is the architect behind our transparent ledger technology. He's a firm believer in the power of decentralization to create a fairer and more accountable world. With expertise in smart contracts and distributed systems, Sam built the core of ClarityChain to be secure, auditable, and accessible to everyone, ensuring every donation is tracked from start to finish.",
    socials: {
        twitter: 'https://twitter.com/samchen',
        linkedin: 'https://linkedin.com/in/samchen'
    },
    experience: [
        { role: 'Lead Blockchain Developer', company: 'ClarityChain', duration: '2022 - Present' },
        { role: 'Senior Solidity Developer', company: 'DeFi Systems', duration: '2019 - 2022' },
        { role: 'Backend Engineer', company: 'Fintech Innovations', duration: '2017 - 2019' },
    ],
    education: [
        { degree: 'B.S. in Software Engineering', institution: 'Carnegie Mellon University', year: '2017' },
    ],
    skills: ['Solidity', 'Smart Contracts', 'Ethereum', 'Distributed Systems', 'Cryptography', 'Node.js'],
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
    mission: `Our mission is to bring radical transparency to the world of fundraising and charitable donations. We believe that every donor has the right to know exactly how their contributions are being used to make a difference. ClarityChain provides a secure, auditable, and easy-to-understand platform that tracks funds from the moment they are donated to the point of expenditure, ensuring accountability and rebuilding trust in the non-profit sector.`,
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
    description: 'We are looking for a passionate Community Manager to engage with our users, manage our social media presence, and build a strong, supportive community around ClarityChain. You will be the voice of our organization.',
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
    description: 'We are seeking a talented Frontend Developer to help us improve our platform\'s user experience. You will work on building new features, optimizing performance, and ensuring our UI is intuitive and accessible.',
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
    email: 'support@claritychain.com',
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
    userQrPaymentsEnabled: true,
}
    






    