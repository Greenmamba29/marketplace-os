import { useQuery } from '@tanstack/react-query';
import { Caregiver } from '../types';

const MOCK_CAREGIVERS: Caregiver[] = [
  {
    id: '1',
    name: 'Sarah Johnson',
    role: 'RN',
    specialties: ['Dementia Care', 'Wound Care'],
    experienceYears: 12,
    availability: 'Full-time',
    location: 'Miami, FL',
    radius: 25,
    hourlyRate: 45,
    languages: ['English', 'Spanish'],
    backgroundChecked: true,
    imageUrl: 'https://images.unsplash.com/photo-1559839734-2b71f1536783?auto=format&fit=crop&q=80&w=400',
  },
  {
    id: '2',
    name: 'Michael Chen',
    role: 'CNA',
    specialties: ['Post-Op Recovery', 'Mobility Assistance'],
    experienceYears: 5,
    availability: 'Part-time',
    location: 'Fort Lauderdale, FL',
    radius: 15,
    hourlyRate: 28,
    languages: ['English', 'Mandarin'],
    backgroundChecked: true,
    imageUrl: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=400',
  }
];

export function useStaff() {
  return useQuery({
    queryKey: ['staff'],
    queryFn: async () => {
      await new Promise(r => setTimeout(r, 500));
      return MOCK_CAREGIVERS;
    }
  });
}
