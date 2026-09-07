export type PageName =
  | 'home'
  | 'assess'
  | 'athletes'
  | 'dashboard'
  | 'register'
  | 'trial-select'
  | 'trial-jump'
  | 'results'
  | 'profile';

export type AssessmentType = 'sprint' | 'jump' | 'agility';

export type Potential = 'High' | 'Medium' | 'Low';

export interface Athlete {
  id: string;
  name: string;
  age: number;
  gender: string;
  state: string;
  district: string;
  sport: string;
  speed: number;
  power: number;
  agility: number;
  overall: number;
  potential: Potential;
  trialsCompleted: number;
  jumpHeight: number;
  aiConfidence: number;
  registeredDate: string;
}

export interface TrialResult {
  jumpHeight: number;
  aiConfidence: number;
  explosivePower: number;
  speed: number;
  agility: number;
  overall: number;
  potential: Potential;
}

export const DEMO_RESULT: TrialResult = {
  jumpHeight: 41,
  aiConfidence: 88,
  explosivePower: 91,
  speed: 86,
  agility: 88,
  overall: 89,
  potential: 'High',
};

export const ASSESSMENT_TYPES: {
  id: AssessmentType;
  title: string;
  icon: string;
  description: string;
  color: string;
  bg: string;
  border: string;
  text: string;
  recommended?: boolean;
}[] = [
  {
    id: 'sprint',
    title: 'Sprint',
    icon: '⚡',
    description: 'Measure running performance and acceleration.',
    color: 'royal',
    bg: 'bg-royal-50',
    border: 'border-royal-200',
    text: 'text-royal-700',
  },
  {
    id: 'jump',
    title: 'Vertical Jump',
    icon: '🚀',
    description: 'Estimate explosive power using AI pose analysis.',
    color: 'purple',
    bg: 'bg-purple-50',
    border: 'border-purple-200',
    text: 'text-purple-700',
    recommended: true,
  },
  {
    id: 'agility',
    title: 'Agility',
    icon: '🔄',
    description: 'Measure movement and direction changes.',
    color: 'orange',
    bg: 'bg-orange-50',
    border: 'border-orange-200',
    text: 'text-orange-700',
  },
];

export const ATHLETES: Athlete[] = [
  {
    id: 'TS-1024',
    name: 'Rohan Sharma',
    age: 16,
    gender: 'Male',
    state: 'Assam',
    district: 'Kamrup',
    sport: 'Athletics',
    speed: 86,
    power: 91,
    agility: 88,
    overall: 89,
    potential: 'High',
    trialsCompleted: 3,
    jumpHeight: 41,
    aiConfidence: 88,
    registeredDate: '2026-08-15',
  },
  {
    id: 'TS-1041',
    name: 'Priya Das',
    age: 17,
    gender: 'Female',
    state: 'Assam',
    district: 'Barpeta',
    sport: 'Athletics',
    speed: 82,
    power: 85,
    agility: 81,
    overall: 83,
    potential: 'Medium',
    trialsCompleted: 2,
    jumpHeight: 36,
    aiConfidence: 84,
    registeredDate: '2026-08-20',
  },
  {
    id: 'TS-1062',
    name: 'Imran Ali',
    age: 15,
    gender: 'Male',
    state: 'Assam',
    district: 'Jorhat',
    sport: 'Football',
    speed: 89,
    power: 79,
    agility: 92,
    overall: 87,
    potential: 'High',
    trialsCompleted: 4,
    jumpHeight: 38,
    aiConfidence: 90,
    registeredDate: '2026-08-22',
  },
  {
    id: 'TS-1078',
    name: 'Kavya Reddy',
    age: 16,
    gender: 'Female',
    state: 'Telangana',
    district: 'Hyderabad',
    sport: 'Athletics',
    speed: 84,
    power: 88,
    agility: 85,
    overall: 86,
    potential: 'High',
    trialsCompleted: 3,
    jumpHeight: 39,
    aiConfidence: 87,
    registeredDate: '2026-08-25',
  },
  {
    id: 'TS-1093',
    name: 'Arjun Nair',
    age: 18,
    gender: 'Male',
    state: 'Kerala',
    district: 'Kochi',
    sport: 'Football',
    speed: 78,
    power: 74,
    agility: 80,
    overall: 77,
    potential: 'Medium',
    trialsCompleted: 2,
    jumpHeight: 33,
    aiConfidence: 82,
    registeredDate: '2026-08-28',
  },
  {
    id: 'TS-1105',
    name: 'Sneha Patil',
    age: 15,
    gender: 'Female',
    state: 'Maharashtra',
    district: 'Pune',
    sport: 'Athletics',
    speed: 90,
    power: 86,
    agility: 89,
    overall: 88,
    potential: 'High',
    trialsCompleted: 5,
    jumpHeight: 40,
    aiConfidence: 91,
    registeredDate: '2026-09-01',
  },
  {
    id: 'TS-1117',
    name: 'Vikram Singh',
    age: 17,
    gender: 'Male',
    state: 'Punjab',
    district: 'Ludhiana',
    sport: 'Athletics',
    speed: 75,
    power: 70,
    agility: 72,
    overall: 72,
    potential: 'Low',
    trialsCompleted: 1,
    jumpHeight: 30,
    aiConfidence: 79,
    registeredDate: '2026-09-02',
  },
  {
    id: 'TS-1129',
    name: 'Ananya Ghosh',
    age: 16,
    gender: 'Female',
    state: 'West Bengal',
    district: 'Kolkata',
    sport: 'Athletics',
    speed: 87,
    power: 89,
    agility: 86,
    overall: 87,
    potential: 'High',
    trialsCompleted: 3,
    jumpHeight: 42,
    aiConfidence: 89,
    registeredDate: '2026-09-03',
  },
  {
    id: 'TS-1134',
    name: 'Manish Yadav',
    age: 18,
    gender: 'Male',
    state: 'Uttar Pradesh',
    district: 'Varanasi',
    sport: 'Wrestling',
    speed: 72,
    power: 92,
    agility: 75,
    overall: 80,
    potential: 'Medium',
    trialsCompleted: 2,
    jumpHeight: 37,
    aiConfidence: 85,
    registeredDate: '2026-09-04',
  },
  {
    id: 'TS-1148',
    name: 'Fatima Khan',
    age: 15,
    gender: 'Female',
    state: 'Karnataka',
    district: 'Bengaluru',
    sport: 'Athletics',
    speed: 88,
    power: 83,
    agility: 90,
    overall: 87,
    potential: 'High',
    trialsCompleted: 4,
    jumpHeight: 38,
    aiConfidence: 88,
    registeredDate: '2026-09-05',
  },
  {
    id: 'TS-1153',
    name: 'Deepak Kumar',
    age: 17,
    gender: 'Male',
    state: 'Bihar',
    district: 'Patna',
    sport: 'Football',
    speed: 81,
    power: 78,
    agility: 83,
    overall: 81,
    potential: 'Medium',
    trialsCompleted: 2,
    jumpHeight: 35,
    aiConfidence: 83,
    registeredDate: '2026-09-05',
  },
  {
    id: 'TS-1167',
    name: 'Lakshmi Pillai',
    age: 16,
    gender: 'Female',
    state: 'Tamil Nadu',
    district: 'Madurai',
    sport: 'Athletics',
    speed: 85,
    power: 87,
    agility: 84,
    overall: 85,
    potential: 'High',
    trialsCompleted: 3,
    jumpHeight: 40,
    aiConfidence: 86,
    registeredDate: '2026-09-06',
  },
];

export const INDIAN_STATES = [
  'Assam', 'Bihar', 'Karnataka', 'Kerala', 'Maharashtra',
  'Punjab', 'Tamil Nadu', 'Telangana', 'Uttar Pradesh', 'West Bengal',
];

export const DISTRICTS_BY_STATE: Record<string, string[]> = {
  Assam: ['Kamrup', 'Barpeta', 'Jorhat', 'Dibrugarh', 'Nagaon'],
  Bihar: ['Patna', 'Gaya', 'Muzaffarpur', 'Bhagalpur'],
  Karnataka: ['Bengaluru', 'Mysuru', 'Mangaluru', 'Hubli'],
  Kerala: ['Kochi', 'Thiruvananthapuram', 'Kozhikode', 'Thrissur'],
  Maharashtra: ['Pune', 'Mumbai', 'Nagpur', 'Nashik', 'Aurangabad'],
  Punjab: ['Ludhiana', 'Amritsar', 'Jalandhar', 'Patiala'],
  'Tamil Nadu': ['Madurai', 'Chennai', 'Coimbatore', 'Salem'],
  Telangana: ['Hyderabad', 'Warangal', 'Nizamabad', 'Karimnagar'],
  'Uttar Pradesh': ['Varanasi', 'Lucknow', 'Kanpur', 'Agra', 'Meerut'],
  'West Bengal': ['Kolkata', 'Howrah', 'Darjeeling', 'Siliguri'],
};

export const SPORTS = ['Athletics', 'Football', 'Wrestling', 'Cricket', 'Hockey', 'Badminton'];

export const GENDERS = ['Male', 'Female', 'Other'];

export const DISTRICT_LOCATIONS = [
  { district: 'Kamrup', state: 'Assam', x: 82, y: 32 },
  { district: 'Barpeta', state: 'Assam', x: 84, y: 30 },
  { district: 'Jorhat', state: 'Assam', x: 86, y: 34 },
  { district: 'Hyderabad', state: 'Telangana', x: 52, y: 62 },
  { district: 'Kochi', state: 'Kerala', x: 40, y: 72 },
  { district: 'Pune', state: 'Maharashtra', x: 38, y: 58 },
  { district: 'Ludhiana', state: 'Punjab', x: 42, y: 22 },
  { district: 'Kolkata', state: 'West Bengal', x: 72, y: 48 },
  { district: 'Varanasi', state: 'Uttar Pradesh', x: 60, y: 38 },
  { district: 'Bengaluru', state: 'Karnataka', x: 44, y: 68 },
  { district: 'Patna', state: 'Bihar', x: 66, y: 40 },
  { district: 'Madurai', state: 'Tamil Nadu', x: 46, y: 78 },
];
