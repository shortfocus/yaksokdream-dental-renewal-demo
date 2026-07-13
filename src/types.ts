export interface Consultation {
  id: string;
  name: string;
  phone: string;
  preferredTime: string;
  message?: string;
  submittedAt: string;
  isSecure: boolean;
}

export type ProposalKey = 'security' | 'banner' | 'floating' | 'hours' | 'form';

export interface ProposalItem {
  id: ProposalKey;
  title: string;
  category: string;
  asIs: string;
  toBe: string;
  effect: string;
  impactColor: 'red' | 'teal' | 'yellow' | 'blue';
}

export interface ReviewItem {
  id: string;
  author: string;
  treatment: string;
  rating: number;
  content: string;
  date: string;
}

export interface Doctor {
  id: string;
  name: string;
  title: string;
  image: string;
  subtitle: string;
  quote: string;
  credentials: string[];
  badges: string[];
}

