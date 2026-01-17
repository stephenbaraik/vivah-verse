import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { toast } from '@/stores/toast-store';

// Types
export interface Booking {
  id: string;
  weddingId: string;
  venueId: string;
  status: 'PENDING' | 'CONFIRMED' | 'CANCELLED';
  totalAmount: number;
  createdAt: string;
  venue?: {
    name: string;
    city: string;
  };
  wedding?: {
    weddingDate: string;
    brideName?: string;
    groomName?: string;
  };
}

interface CreateBookingData {
  weddingId: string;
  venueId: string;
}

// API Functions
async function getBookings(): Promise<Booking[]> {
  const response = await api.get('/bookings');
  return response.data;
}

async function getBooking(id: string): Promise<Booking> {
  const response = await api.get(`/bookings/${id}`);
  return response.data;
}

async function createBooking(data: CreateBookingData): Promise<Booking> {
  const response = await api.post('/bookings', data);
  return response.data;
}

async function cancelBooking(id: string, reason: string): Promise<void> {
  await api.post(`/cancellations/${id}`, { reason });
}

// Hooks
export function useBookings() {
  return useQuery({
    queryKey: ['bookings'],
    queryFn: getBookings,
  });
}

export function useBooking(id: string) {
  return useQuery({
    queryKey: ['bookings', id],
    queryFn: () => getBooking(id),
    enabled: !!id,
  });
}

export function useCreateBooking() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: createBooking,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
      toast.success('Booking created', 'Your venue has been reserved!');
    },
    onError: () => {
      toast.error('Booking failed', 'This date may no longer be available.');
    },
  });
}

export function useCancelBooking() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, reason }: { id: string; reason: string }) => 
      cancelBooking(id, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
      toast.info('Booking cancelled', 'Your refund will be processed shortly.');
    },
    onError: () => {
      toast.error('Cancellation failed', 'Please try again or contact support.');
    },
  });
}
