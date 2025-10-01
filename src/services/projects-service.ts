
/**
 * @fileOverview A service for fetching project data from Firestore.
 */
'use server';

import { db } from '@/lib/firebase';
import { collection, getDocs, doc, getDoc, query, where, orderBy, getCountFromServer } from 'firebase/firestore';
import { teamMembers, type TeamMember, type Project, users, getImageUrl, allDonations } from '@/lib/mock-data';

/**
 * Fetches all projects from the Firestore 'projects' collection.
 * @returns A promise that resolves to an array of all projects.
 */
export async function getProjects(): Promise<Project[]> {
  try {
    const projects: Project[] = [
      {
        id: 'education-for-all-nepal',
        name: 'Education for All Nepal',
        organization: 'Hope & Future Foundation',
        description:
          'Providing quality education to 500 underprivileged children in rural Nepal by building schools and providing supplies.',
        longDescription:
          'In the remote villages of Nepal, countless children lack access to basic education. This project aims to construct a new, earthquake-resistant school, provide essential learning materials like books and uniforms, and fund teacher salaries for one year. By investing in education, we are investing in the future of these communities, empowering the next generation to break the cycle of poverty. Your donation will directly contribute to building classrooms, purchasing supplies, and creating a safe and nurturing learning environment.',
        imageUrl: getImageUrl('project-education-nepal'),
        imageHint: 'nepal classroom',
        targetAmount: 5000000,
        raisedAmount: 4250000,
        donors: 1245,
        verified: true,
        ownerId: 'milijuli-sewa-admin',
        updates: [
          {
            id: 'update-1',
            title: 'Foundation Laid!',
            description:
              "Construction has officially begun! The foundation for the new school building was laid this week. We're excited to see this project take shape. Thank you to all our donors for making this possible.",
            date: '2023-11-15T10:00:00Z',
            imageUrl: getImageUrl('update-photo-2'),
            imageHint: 'construction site',
            pinned: true,
            comments: [],
          },
          {
            id: 'update-2',
            title: 'Books and Supplies Arrived!',
            description:
              'We received a large shipment of new textbooks, notebooks, and writing materials. These supplies are now ready to be distributed to students as soon as the classrooms are complete.',
            date: '2023-10-25T14:00:00Z',
            imageUrl: getImageUrl('update-photo-1'),
            imageHint: 'school supplies',
            comments: [],
          },
        ],
        expenses: [
          {
            id: 'exp-1',
            item: 'Purchase of 1000 textbooks',
            amount: 150000,
            date: '2023-10-20T10:00:00Z',
            receiptUrl: getImageUrl('receipt-1'),
            receiptHint: 'receipt scan',
          },
          {
            id: 'exp-2',
            item: 'Cement and Rebar for Foundation',
            amount: 325000,
            date: '2023-11-10T10:00:00Z',
            receiptUrl: getImageUrl('receipt-2'),
            receiptHint: 'invoice document',
          },
        ],
        discussion: [
          {
            id: 'comment-1',
            author: 'Jane Doe',
            authorId: 'user-jane-doe',
            avatarUrl: getImageUrl('avatar-jane-doe'),
            profileUrl: '/profile/user-jane-doe',
            date: '2023-11-16T10:00:00Z',
            text: 'This is such a wonderful project! So happy to see the progress.',
            status: 'approved',
          },
          {
            id: 'comment-2',
            author: 'John Smith',
            authorId: 'user-john-smith',
            avatarUrl: getImageUrl('avatar-john-smith'),
            profileUrl: '/profile/user-john-smith',
            date: '2023-11-17T11:30:00Z',
            text: 'Keep up the great work! Can\'t wait to see the finished school.',
            replyTo: 'Jane Doe',
            status: 'approved',
          },
        ],
        wishlist: [
          { id: 'wish-1', name: 'School Benches', description: 'Durable wooden benches for classrooms', quantityNeeded: 50, quantityDonated: 10, costPerItem: 3000, allowInKind: true, imageHint: 'school bench' },
          { id: 'wish-2', name: 'Whiteboards', description: 'Large whiteboards for teaching', quantityNeeded: 10, quantityDonated: 2, costPerItem: 5000, allowInKind: true, imageHint: 'whiteboard classroom' },
          { id: 'wish-3', name: 'School Backpacks', description: 'Sturdy backpacks for students', quantityNeeded: 500, quantityDonated: 150, costPerItem: 800, allowInKind: true, imageHint: 'school backpack' },
        ],
        createdAt: '2023-09-01T12:00:00Z'
      },
      {
        id: 'clean-water-initiative',
        name: 'Clean Water Initiative',
        organization: 'AquaLife Global',
        description:
          'Bringing clean and safe drinking water to 10 remote communities by installing deep-water wells and purification systems.',
        longDescription:
          'Access to clean water is a fundamental human right, yet millions lack it. Our Clean Water Initiative focuses on installing sustainable deep-water wells in arid regions. Each well can serve an entire community, providing safe water for drinking, sanitation, and agriculture. We also train local technicians to maintain the wells, ensuring a long-term solution. Your support helps us drill wells, install hand pumps, and conduct water quality testing.',
        imageUrl: getImageUrl('project-clean-water'),
        imageHint: 'water well',
        targetAmount: 3500000,
        raisedAmount: 3600000,
        donors: 850,
        verified: true,
        ownerId: 'milijuli-sewa-admin',
        updates: [
          { id: 'update-cw-1', title: 'First Well Complete!', description: 'The first of ten wells has been successfully installed in the village of Ramgiri. The community now has access to clean, safe drinking water for the first time.', date: '2023-11-20T10:00:00Z', comments: [] }
        ],
        expenses: [],
        discussion: [],
        wishlist: [
          { id: 'wish-cw-1', name: 'Water Filters', description: 'High-quality ceramic water filters for households.', quantityNeeded: 200, quantityDonated: 5, costPerItem: 1500, allowInKind: true, imageHint: 'water filter' },
          { id: 'wish-cw-2', name: 'Hand Pump Spare Parts', description: 'A kit of spare parts for well maintenance.', quantityNeeded: 10, quantityDonated: 1, costPerItem: 10000, allowInKind: false, imageHint: 'metal parts' },
        ],
        createdAt: '2023-08-15T12:00:00Z'
      },
      {
        id: 'community-health-posts',
        name: 'Community Health Posts',
        organization: 'Health for All',
        description:
          'Establishing 5 new community health posts in underserved areas to provide primary healthcare services.',
        longDescription:
          'Many rural communities are hours away from the nearest hospital. This project establishes small, accessible health posts staffed by trained community health workers. These posts provide vital services like vaccinations, maternal health check-ups, and treatment for common illnesses. By bringing healthcare closer to home, we can save lives and improve the overall well-being of thousands. Your donation funds the construction of these posts and the initial stock of medical supplies.',
        imageUrl: getImageUrl('project-community-health'),
        imageHint: 'community health',
        targetAmount: 4000000,
        raisedAmount: 2100000,
        donors: 620,
        verified: true,
        ownerId: 'milijuli-sewa-admin',
        updates: [],
        expenses: [],
        discussion: [],
        wishlist: [],
        createdAt: '2023-09-10T12:00:00Z'
      },
      {
        id: 'disaster-relief-fund',
        name: 'Disaster Relief Fund',
        organization: 'Rapid Response Team',
        description:
          'An emergency fund to provide immediate aid—food, shelter, and medical supplies—in the event of a natural disaster.',
        longDescription:
          'When disaster strikes, every second counts. This is an ongoing, evergreen fund that allows us to respond immediately to natural disasters like earthquakes, floods, and landslides in Nepal. Funds are used to procure and distribute essential supplies such as food, clean water, temporary shelter, and first aid kits. By maintaining a ready fund, we can deploy aid within hours, providing a critical lifeline to affected communities when they need it most. All expenditures are logged with complete transparency.',
        imageUrl: getImageUrl('project-disaster-relief'),
        imageHint: 'disaster relief',
        targetAmount: 10000000,
        raisedAmount: 1850000,
        donors: 350,
        verified: true,
        ownerId: 'milijuli-sewa-admin',
        updates: [],
        expenses: [],
        discussion: [],
        wishlist: [],
        createdAt: '2023-07-01T12:00:00Z'
      },
      {
        id: 'art-for-all',
        name: 'Art for All',
        organization: 'Raj Patel',
        description: 'A community-driven project to provide free art classes and supplies for children in local neighborhoods.',
        longDescription: 'Art is a powerful tool for expression, creativity, and healing. However, many children in our community lack access to basic art supplies and guidance. "Art for All" is a user-created campaign that aims to change that. We will set up weekly art workshops in local community centers, providing a safe and inspiring space for children to explore their creativity. Your donations will directly fund the purchase of paints, canvases, paper, and other materials, and help us cover the small operational costs of running these workshops.',
        imageUrl: getImageUrl('project-art-for-all'),
        imageHint: 'children art',
        targetAmount: 150000,
        raisedAmount: 25000,
        donors: 15,
        verified: false,
        ownerId: 'user-raj-patel',
        updates: [
          { id: 'update-art-1', title: 'First Workshop a Success!', description: 'We held our first art workshop last weekend, and it was a huge success! Over 30 children attended and created some amazing artwork. Thank you to everyone who has supported us so far!', date: '2023-11-25T10:00:00Z', imageUrl: getImageUrl('update-art-class'), imageHint: 'child painting', comments: [] }
        ],
        expenses: [],
        discussion: [
            { id: 'comment-art-1', author: 'John Smith', authorId: 'user-john-smith', avatarUrl: getImageUrl('avatar-john-smith'), profileUrl: '/profile/user-john-smith', date: '2023-11-26T10:00:00Z', text: 'This is amazing, Raj! So glad to be a small part of it.', status: 'approved' }
        ],
        wishlist: [
            { id: 'wish-art-1', name: 'Watercolor Paint Sets', description: 'Sets of non-toxic watercolor paints for kids.', quantityNeeded: 50, quantityDonated: 5, costPerItem: 500, imageUrl: getImageUrl('wishlist-paints'), imageHint: 'watercolor paints', allowInKind: true },
            { id: 'wish-art-2', name: 'Drawing Canvases (8x10)', description: 'Small canvases for painting projects.', quantityNeeded: 100, quantityDonated: 10, costPerItem: 150, imageUrl: getImageUrl('wishlist-canvas'), imageHint: 'art canvas', allowInKind: true },
        ],
        createdAt: '2023-11-01T12:00:00Z'
      }
    ];

    return projects;
  } catch (error) {
    console.error("Error fetching projects: ", error);
    return [];
  }
}

/**
 * Fetches a single project by its ID from the Firestore 'projects' collection.
 * @param id The ID of the project to fetch.
 * @returns A promise that resolves to the project object or undefined if not found.
 */
export async function getProject(id: string): Promise<Project | undefined> {
  try {
    const projects = await getProjects();
    const project = projects.find(p => p.id === id);

    if (project) {
      return project;
    } else {
      console.log(`No project found with id: ${id}`);
      return undefined;
    }
  } catch (error) {
    console.error("Error fetching project: ", error);
    return undefined;
  }
}

/**
 * Fetches a single team member by their ID.
 * @param id The ID of the team member to fetch.
 * @returns A promise that resolves to the team member object or undefined if not found.
 */
export async function getTeamMember(id: string): Promise<TeamMember | undefined> {
  // In a real app, this might fetch from a 'teamMembers' collection in Firestore.
  // For this demo, we're filtering an in-memory array.
  return teamMembers.find((member) => member.id === id);
}


/**
 * Fetches the count of pending (unverified) projects.
 * @returns A promise that resolves to the number of pending projects.
 */
export async function getPendingCampaignsCount(): Promise<number> {
    try {
        const projects = await getProjects();
        return projects.filter(p => !p.verified && p.ownerId !== 'milijuli-sewa-admin').length;
    } catch (error) {
        console.error("Error fetching pending campaigns count: ", error);
        return 0;
    }
}
