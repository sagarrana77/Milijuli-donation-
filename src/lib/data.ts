import { PlaceHolderImages } from './placeholder-images';

function getImageUrl(id: string) {
  return PlaceHolderImages.find((img) => img.id === id)?.imageUrl || '';
}

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
  updates: {
    id: string;
    title: string;
    date: Date;
    imageUrl: string;
    imageHint: string;
  }[];
  expenses: {
    id: string;
    item: string;
    amount: number;
    date: Date;
    receiptUrl: string;
    receiptHint: string;
  }[];
  discussion: {
    id: string;
    author: string;
    avatarUrl: string;
    date: Date;
    text: string;
  }[];
};

export const projects: Project[] = [
  {
    id: 'education-for-all-nepal',
    name: 'Education for All Nepal',
    organization: 'Hope Foundation',
    description: 'Providing quality education to underprivileged children in rural Nepal.',
    longDescription:
      'This project aims to build and equip schools in remote areas of Nepal, providing access to quality education for children who would otherwise be left behind. Funds will be used for school construction, teacher salaries, and learning materials.',
    imageUrl: getImageUrl('project-education-nepal'),
    imageHint: 'nepal classroom',
    targetAmount: 50000,
    raisedAmount: 32500,
    donors: 450,
    verified: true,
    updates: [
        { id: 'update-1', title: "New textbooks arrived!", date: new Date('2023-10-15'), imageUrl: getImageUrl('update-photo-1'), imageHint: 'happy students' },
        { id: 'update-2', title: "Foundation for the new school building is complete.", date: new Date('2023-09-20'), imageUrl: getImageUrl('update-photo-2'), imageHint: 'construction site' }
    ],
    expenses: [
        { id: 'exp-1', item: 'School Textbooks Batch 1', amount: 1200, date: new Date('2023-10-12'), receiptUrl: getImageUrl('receipt-1'), receiptHint: 'receipt scan' },
        { id: 'exp-2', item: 'Cement and Bricks', amount: 3500, date: new Date('2023-09-15'), receiptUrl: getImageUrl('receipt-2'), receiptHint: 'invoice document' }
    ],
    discussion: [
      {
        id: 'comment-1',
        author: 'Jane Doe',
        avatarUrl: getImageUrl('avatar-jane-doe'),
        date: new Date('2023-10-18T14:30:00Z'),
        text: "This is such a wonderful project! It's great to see the progress with the new school building. Keep up the amazing work."
      },
      {
        id: 'comment-2',
        author: 'John Smith',
        avatarUrl: getImageUrl('avatar-john-smith'),
        date: new Date('2023-10-19T09:00:00Z'),
        text: "I agree with Jane. Transparency is key, and seeing the expense receipts for the textbooks and materials builds a lot of trust. Happy to be a donor!"
      }
    ]
  },
  {
    id: 'clean-water-initiative',
    name: 'Clean Water Initiative',
    organization: 'AquaLife',
    description: 'Building wells to provide access to clean and safe drinking water.',
    longDescription:
      'Access to clean water is a fundamental human right. This project focuses on drilling wells and installing water purification systems in communities that lack safe drinking water, reducing disease and improving overall health.',
    imageUrl: getImageUrl('project-clean-water'),
    imageHint: 'water well',
    targetAmount: 75000,
    raisedAmount: 76100,
    donors: 1200,
    verified: true,
    updates: [],
    expenses: [],
    discussion: []
  },
  {
    id: 'community-health-posts',
    name: 'Community Health Posts',
    organization: 'Health for All',
    description: 'Establishing health posts to offer basic medical services in remote villages.',
    longDescription:
      'We are setting up community health posts staffed by trained professionals to provide essential healthcare services, including maternal care, vaccinations, and treatment for common illnesses, directly within remote communities.',
    imageUrl: getImageUrl('project-community-health'),
    imageHint: 'community health',
    targetAmount: 120000,
    raisedAmount: 45000,
    donors: 800,
    verified: false,
    updates: [],
    expenses: [],
    discussion: []
  },
  {
    id: 'disaster-relief-fund',
    name: 'Disaster Relief Fund',
    organization: 'Rapid Response Team',
    description: 'Providing immediate aid and support to areas affected by natural disasters.',
    longDescription:
      'This fund is dedicated to providing swift and effective relief in the aftermath of natural disasters. Donations help us deliver food, shelter, medical supplies, and other critical aid to those in desperate need.',
    imageUrl: getImageUrl('project-disaster-relief'),
    imageHint: 'disaster relief',
    targetAmount: 250000,
    raisedAmount: 180000,
    donors: 2500,
    verified: true,
    updates: [],
    expenses: [],
    discussion: []
  },
];

export const dashboardStats = {
  totalFunds: 333600,
  monthlyIncrease: 20123,
  totalDonors: 4950,
  newDonors: 213,
  projectsFunded: 4,
  countries: 1,
};

export const recentDonations = [
  {
    id: 1,
    donor: { name: 'Jane Doe', avatarUrl: getImageUrl('avatar-jane-doe') },
    project: 'Education for All Nepal',
    amount: 50,
    date: new Date('2023-10-29T10:00:00Z'),
  },
  {
    id: 2,
    donor: { name: 'John Smith', avatarUrl: getImageUrl('avatar-john-smith') },
    project: 'Clean Water Initiative',
    amount: 100,
    date: new Date('2023-10-29T09:30:00Z'),
  },
  {
    id: 3,
    donor: { name: 'Ai Chan', avatarUrl: getImageUrl('avatar-ai-chan') },
    project: 'Disaster Relief Fund',
    amount: 250,
    date: new Date('2023-10-28T15:00:00Z'),
  },
  {
    id: 4,
    donor: { name: 'Raj Patel', avatarUrl: getImageUrl('avatar-raj-patel') },
    project: 'Community Health Posts',
    amount: 75,
    date: new Date('2023-10-28T12:45:00Z'),
  },
   {
    id: 5,
    donor: { name: 'Anonymous', avatarUrl: getImageUrl('avatar-anonymous') },
    project: 'Clean Water Initiative',
    amount: 1000,
    date: new Date('2023-10-27T18:20:00Z'),
  },
];

export const expenseData = [
  { name: 'Education', value: 40, fill: 'var(--color-chart-1)' },
  { name: 'Admin', value: 20, fill: 'var(--color-chart-2)' },
  { name: 'Relief', value: 30, fill: 'var(--color-chart-3)' },
  { name: 'Health', value: 10, fill: 'var(--color-chart-4)' },
];