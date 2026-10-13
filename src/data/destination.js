
export type Destination = {
  id: string;
  name: string;
  category: string;
  description: string;
  emoji: string;
  rating: number;
  budget: string;
};

export const destinations: Destination[] = [
  {
    id: 'goa',
    name: 'Goa',
    category: 'Beach',
    description: 'Golden beaches, sunsets and coastal cafes.',
    emoji: '🏝️',
    rating: 4.8,
    budget: '₹₹₹',
  },
  {
    id: 'manali',
    name: 'Manali',
    category: 'Nature',
    description: 'Mountain views, pine forests and adventure.',
    emoji: '🏔️',
    rating: 4.7,
    budget: '₹₹',
  },
  {
    id: 'jaipur',
    name: 'Jaipur',
    category: 'Culture',
    description: 'Historic forts, palaces and colorful markets.',
    emoji: '🏰',
    rating: 4.6,
    budget: '₹₹',
  },
  {
    id: 'mumbai',
    name: 'Mumbai',
    category: 'City',
    description: 'Street food, iconic landmarks and nightlife.',
    emoji: '🌆',
    rating: 4.5,
    budget: '₹₹₹',
  },
  {
    id: 'munnar',
    name: 'Munnar',
    category: 'Nature',
    description: 'Rolling green hills and beautiful tea gardens.',
    emoji: '🌿',
    rating: 4.8,
    budget: '₹₹',
  },
  {
    id: 'lonavala',
    name: 'Lonavala',
    category: 'Nature',
    description: 'Waterfalls, scenic viewpoints and hill trails.',
    emoji: '⛰️',
    rating: 4.5,
    budget: '₹₹',
  },
  {
    id: 'udaipur',
    name: 'Udaipur',
    category: 'Culture',
    description: 'Lakeside views, heritage hotels and palaces.',
    emoji: '🛶',
    rating: 4.7,
    budget: '₹₹₹',
  },
  {
    id: 'andaman',
    name: 'Andaman Islands',
    category: 'Beach',
    description: 'Clear waters, coral reefs and island escapes.',
    emoji: '🐠',
    rating: 4.9,
    budget: '₹₹₹',
  },
  {
    id: 'rishikesh',
    name: 'Rishikesh',
    category: 'Adventure',
    description: 'River rafting, yoga and mountain adventures.',
    emoji: '🛶',
    rating: 4.6,
    budget: '₹₹',
  },
  {
    id: 'delhi',
    name: 'New Delhi',
    category: 'City',
    description: 'Historic monuments, street food and museums.',
    emoji: '🏛️',
    rating: 4.4,
    budget: '₹₹',
  },
];
