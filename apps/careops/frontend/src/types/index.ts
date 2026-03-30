export interface Caregiver {
  id: string;
  name: string;
  role: 'CNA' | 'HHA' | 'RN' | 'LPN';
  specialties: string[];
  experienceYears: number;
  availability: 'Full-time' | 'Part-time' | 'Contract';
  location: string;
  radius: number;
  hourlyRate: number;
  languages: string[];
  backgroundChecked: boolean;
  imageUrl: string;
}

export interface Placement {
  id: string;
  patientType: string;
  careLevel: string;
  status: 'pending' | 'active' | 'completed';
  caregiverId?: string;
  createdAt: string;
}
