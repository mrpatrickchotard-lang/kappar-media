export interface Expert {
  id: string;
  name: string;
  title: string;
  company: string;
  bio: string;
  avatar?: string;
  expertise: string[];
  hourlyRate: number;
  currency: string;
  location: string;
  languages: string[];
  availability: AvailabilitySlot[];
  verified: boolean;
  featured: boolean;
  rating: number;
  reviewCount: number;
  totalCalls: number;
  createdAt: string;
}

export interface AvailabilitySlot {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
  booked: boolean;
  bookingId?: string;
}

export interface Booking {
  id: string;
  expertId: string;
  clientName: string;
  clientEmail: string;
  slotId: string;
  date: string;
  startTime: string;
  endTime: string;
  duration: number;
  hourlyRate: number;
  totalAmount: number;
  status: 'pending' | 'confirmed' | 'in-progress' | 'completed' | 'cancelled';
  paymentStatus: 'pending' | 'held' | 'released' | 'refunded';
  meetingLink?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CallSession {
  bookingId: string;
  startTime: string;
  endTime: string;
  actualDuration: number;
  status: 'waiting' | 'active' | 'ended';
}
