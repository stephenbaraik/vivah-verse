'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, MapPin, Users, Save, Loader2 } from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Button, DatePicker } from '@/components/ui';
import { WeddingsService } from '@/services/weddings.service';
import { useToast } from '@/stores/toast-store';
import type { Wedding } from '@/types/api';

interface EditWeddingModalProps {
  wedding: Wedding;
  isOpen: boolean;
  onClose: () => void;
  onSaved?: () => void;
}

const CITIES = [
  'Mumbai', 'Delhi', 'Bangalore', 'Jaipur', 'Udaipur', 
  'Goa', 'Chennai', 'Kolkata', 'Hyderabad', 'Pune',
  'Ahmedabad', 'Jodhpur', 'Agra', 'Kerala', 'Rishikesh'
];

export function EditWeddingModal({ wedding, isOpen, onClose, onSaved }: EditWeddingModalProps) {
  const queryClient = useQueryClient();
  const { addToast } = useToast();
  
  const [weddingDate, setWeddingDate] = useState<Date | undefined>(
    wedding.weddingDate ? new Date(wedding.weddingDate) : undefined
  );
  const [location, setLocation] = useState(wedding.location || '');
  const [guestCount, setGuestCount] = useState(wedding.guestCount?.toString() || '');
  const [showDatePicker, setShowDatePicker] = useState(false);

  // Reset form when modal opens
  useEffect(() => {
    if (!(isOpen && wedding)) return;

    const frame = requestAnimationFrame(() => {
      setWeddingDate(wedding.weddingDate ? new Date(wedding.weddingDate) : undefined);
      setLocation(wedding.location || '');
      setGuestCount(wedding.guestCount?.toString() || '');
    });

    return () => cancelAnimationFrame(frame);
  }, [isOpen, wedding]);

  const updateMutation = useMutation({
    mutationFn: (data: { weddingDate?: string; location?: string; guestCount?: number }) =>
      WeddingsService.update(wedding.id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wedding'] });
      queryClient.invalidateQueries({ queryKey: ['weddings'] });
      addToast({ type: 'success', message: 'Wedding details updated!' });
      onSaved?.();
      onClose();
    },
    onError: (error: Error & { response?: { data?: { message?: string } } }) => {
      addToast({
        type: 'error',
        message: error.response?.data?.message || 'Failed to update wedding',
      });
    },
  });

  const handleSave = () => {
    if (!weddingDate) {
      addToast({ type: 'error', message: 'Please select a wedding date' });
      return;
    }

    // Format date as YYYY-MM-DDT00:00:00.000Z to avoid timezone issues
    const year = weddingDate.getFullYear();
    const month = String(weddingDate.getMonth() + 1).padStart(2, '0');
    const day = String(weddingDate.getDate()).padStart(2, '0');
    const dateString = `${year}-${month}-${day}T00:00:00.000Z`;

    updateMutation.mutate({
      weddingDate: dateString,
      location: location || undefined,
      guestCount: guestCount ? parseInt(guestCount, 10) : undefined,
    });
  };

  const formattedDate = weddingDate?.toLocaleDateString('en-IN', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          onClick={onClose}
        />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative bg-white rounded-2xl shadow-xl max-w-lg w-full mx-4 max-h-[90vh] overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-divider">
            <h2 className="text-xl font-serif font-semibold text-charcoal">
              Edit Wedding Details
            </h2>
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-rose-soft transition-colors"
            >
              <X className="w-5 h-5 text-muted" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6 max-h-[60vh] overflow-y-auto">
            {/* Wedding Date */}
            <div>
              <label className="block text-sm font-medium text-charcoal mb-2">
                <Calendar className="w-4 h-4 inline mr-2" />
                Wedding Date
              </label>
              {showDatePicker ? (
                <div className="relative">
                  <DatePicker
                    value={weddingDate}
                    onChange={(date) => {
                      setWeddingDate(date);
                      setShowDatePicker(false);
                    }}
                    minDate={new Date()}
                    className="w-full"
                  />
                  <button
                    onClick={() => setShowDatePicker(false)}
                    className="absolute top-2 right-2 p-1 rounded-full bg-white hover:bg-gray-100"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setShowDatePicker(true)}
                  className="w-full p-3 text-left border border-divider rounded-xl hover:border-rani transition-colors"
                >
                  {formattedDate || 'Select date...'}
                </button>
              )}
            </div>

            {/* Location */}
            <div>
              <label className="block text-sm font-medium text-charcoal mb-2">
                <MapPin className="w-4 h-4 inline mr-2" />
                Location
              </label>
              <select
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full p-3 border border-divider rounded-xl focus:border-rani focus:ring-2 focus:ring-rani/20 transition-colors"
              >
                <option value="">Select a location</option>
                {CITIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            {/* Guest Count */}
            <div>
              <label className="block text-sm font-medium text-charcoal mb-2">
                <Users className="w-4 h-4 inline mr-2" />
                Expected Guests
              </label>
              <input
                type="number"
                value={guestCount}
                onChange={(e) => setGuestCount(e.target.value)}
                placeholder="Enter guest count"
                min={50}
                max={5000}
                className="w-full p-3 border border-divider rounded-xl focus:border-rani focus:ring-2 focus:ring-rani/20 transition-colors"
              />
            </div>

            {/* Note about date changes */}
            <div className="p-4 bg-amber-50 rounded-xl border border-amber-200">
              <p className="text-sm text-amber-800">
                <strong>Note:</strong> Changing your wedding date may affect existing bookings. 
                Please contact venues directly if you have confirmed bookings.
              </p>
            </div>
          </div>

          {/* Footer */}
          <div className="p-6 border-t border-divider bg-gray-50 flex gap-3">
            <Button
              variant="secondary"
              onClick={onClose}
              className="flex-1"
              disabled={updateMutation.isPending}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              className="flex-1"
              disabled={updateMutation.isPending}
            >
              {updateMutation.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Save Changes
                </>
              )}
            </Button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

export default EditWeddingModal;
