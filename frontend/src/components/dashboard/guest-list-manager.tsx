'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users,
  UserPlus,
  UserCheck,
  UserX,
  Search,
  Filter,
  Mail,
  Phone,
  Check,
  X,
  HelpCircle,
  Edit3,
  Trash2,
} from 'lucide-react';
import { Button, Input } from '@/components/ui';
import { cn } from '@/lib/utils';

type RSVPStatus = 'confirmed' | 'pending' | 'declined';
type GuestSide = 'bride' | 'groom' | 'mutual';

interface Guest {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  side: GuestSide;
  rsvp: RSVPStatus;
  plusOne?: boolean;
  dietaryRestrictions?: string;
  tableNumber?: number;
}

interface GuestListManagerProps {
  guests?: Guest[];
  onAddGuest?: () => void;
  onEditGuest?: (guest: Guest) => void;
  onDeleteGuest?: (guestId: string) => void;
  onSendReminder?: (guestIds: string[]) => void;
}

const MOCK_GUESTS: Guest[] = [
  { id: '1', name: 'Priya Sharma', email: 'priya@email.com', phone: '+91 98765 43210', side: 'bride', rsvp: 'confirmed', plusOne: true },
  { id: '2', name: 'Rahul Mehta', email: 'rahul@email.com', side: 'groom', rsvp: 'confirmed', tableNumber: 3 },
  { id: '3', name: 'Anita Patel', phone: '+91 98765 11111', side: 'bride', rsvp: 'pending' },
  { id: '4', name: 'Vikram Singh', email: 'vikram@email.com', side: 'groom', rsvp: 'pending', plusOne: true },
  { id: '5', name: 'Neha Gupta', email: 'neha@email.com', side: 'mutual', rsvp: 'confirmed' },
  { id: '6', name: 'Amit Kumar', phone: '+91 98765 22222', side: 'groom', rsvp: 'declined' },
  { id: '7', name: 'Kavita Reddy', email: 'kavita@email.com', side: 'bride', rsvp: 'pending' },
  { id: '8', name: 'Suresh Nair', email: 'suresh@email.com', side: 'mutual', rsvp: 'confirmed', dietaryRestrictions: 'Vegetarian' },
];

export function GuestListManager({
  guests = MOCK_GUESTS,
  onAddGuest,
  onEditGuest,
  onDeleteGuest,
  onSendReminder,
}: GuestListManagerProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterSide, setFilterSide] = useState<GuestSide | 'all'>('all');
  const [filterRsvp, setFilterRsvp] = useState<RSVPStatus | 'all'>('all');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedGuests, setSelectedGuests] = useState<Set<string>>(new Set());

  const stats = useMemo(() => {
    const confirmed = guests.filter(g => g.rsvp === 'confirmed').length;
    const pending = guests.filter(g => g.rsvp === 'pending').length;
    const declined = guests.filter(g => g.rsvp === 'declined').length;
    const plusOnes = guests.filter(g => g.rsvp === 'confirmed' && g.plusOne).length;
    
    return {
      total: guests.length,
      confirmed,
      pending,
      declined,
      attending: confirmed + plusOnes,
    };
  }, [guests]);

  const filteredGuests = useMemo(() => {
    return guests.filter(guest => {
      const matchesSearch = guest.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        guest.email?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesSide = filterSide === 'all' || guest.side === filterSide;
      const matchesRsvp = filterRsvp === 'all' || guest.rsvp === filterRsvp;
      
      return matchesSearch && matchesSide && matchesRsvp;
    });
  }, [guests, searchQuery, filterSide, filterRsvp]);

  const toggleGuestSelection = (guestId: string) => {
    const newSelected = new Set(selectedGuests);
    if (newSelected.has(guestId)) {
      newSelected.delete(guestId);
    } else {
      newSelected.add(guestId);
    }
    setSelectedGuests(newSelected);
  };

  const getRsvpIcon = (status: RSVPStatus) => {
    switch (status) {
      case 'confirmed':
        return <Check className="w-4 h-4 text-success" />;
      case 'pending':
        return <HelpCircle className="w-4 h-4 text-amber-500" />;
      case 'declined':
        return <X className="w-4 h-4 text-error" />;
    }
  };

  const getRsvpColor = (status: RSVPStatus) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-700';
      case 'pending':
        return 'bg-amber-100 text-amber-700';
      case 'declined':
        return 'bg-red-100 text-red-700';
    }
  };

  const getSideColor = (side: GuestSide) => {
    switch (side) {
      case 'bride':
        return 'text-rani';
      case 'groom':
        return 'text-blue-600';
      case 'mutual':
        return 'text-purple-600';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl border border-divider overflow-hidden"
    >
      {/* Header */}
      <div className="p-6 border-b border-divider">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-charcoal flex items-center gap-2">
              <Users className="w-5 h-5 text-rani" />
              Guest List
            </h3>
            <p className="text-sm text-muted mt-1">
              {stats.attending} confirmed attendees
            </p>
          </div>
          {onAddGuest && (
            <Button onClick={onAddGuest} size="sm">
              <UserPlus className="w-4 h-4 mr-1" />
              Add Guest
            </Button>
          )}
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-4 gap-3">
          <div className="text-center p-3 bg-gray-50 rounded-xl">
            <Users className="w-5 h-5 text-charcoal mx-auto mb-1" />
            <p className="text-lg font-bold text-charcoal">{stats.total}</p>
            <p className="text-xs text-muted">Total</p>
          </div>
          <div className="text-center p-3 bg-green-50 rounded-xl">
            <UserCheck className="w-5 h-5 text-success mx-auto mb-1" />
            <p className="text-lg font-bold text-success">{stats.confirmed}</p>
            <p className="text-xs text-muted">Confirmed</p>
          </div>
          <div className="text-center p-3 bg-amber-50 rounded-xl">
            <HelpCircle className="w-5 h-5 text-amber-500 mx-auto mb-1" />
            <p className="text-lg font-bold text-amber-600">{stats.pending}</p>
            <p className="text-xs text-muted">Pending</p>
          </div>
          <div className="text-center p-3 bg-red-50 rounded-xl">
            <UserX className="w-5 h-5 text-error mx-auto mb-1" />
            <p className="text-lg font-bold text-error">{stats.declined}</p>
            <p className="text-xs text-muted">Declined</p>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="p-4 border-b border-divider space-y-3">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
            <Input
              type="text"
              placeholder="Search guests..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button
            variant={showFilters ? 'primary' : 'secondary'}
            size="sm"
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter className="w-4 h-4" />
          </Button>
        </div>

        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="flex flex-wrap gap-2 pt-2">
                <select
                  value={filterSide}
                  onChange={(e) => setFilterSide(e.target.value as GuestSide | 'all')}
                  className="px-3 py-1.5 text-sm border border-divider rounded-lg bg-white"
                >
                  <option value="all">All Sides</option>
                  <option value="bride">Bride&apos;s Side</option>
                  <option value="groom">Groom&apos;s Side</option>
                  <option value="mutual">Mutual</option>
                </select>
                <select
                  value={filterRsvp}
                  onChange={(e) => setFilterRsvp(e.target.value as RSVPStatus | 'all')}
                  className="px-3 py-1.5 text-sm border border-divider rounded-lg bg-white"
                >
                  <option value="all">All RSVP</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="pending">Pending</option>
                  <option value="declined">Declined</option>
                </select>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Bulk Actions */}
        {selectedGuests.size > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-between p-2 bg-rose-soft rounded-lg"
          >
            <span className="text-sm text-charcoal">
              {selectedGuests.size} guest{selectedGuests.size > 1 ? 's' : ''} selected
            </span>
            <div className="flex gap-2">
              {onSendReminder && (
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => onSendReminder(Array.from(selectedGuests))}
                >
                  <Mail className="w-4 h-4 mr-1" />
                  Send Reminder
                </Button>
              )}
              <Button
                size="sm"
                variant="secondary"
                onClick={() => setSelectedGuests(new Set())}
              >
                Clear
              </Button>
            </div>
          </motion.div>
        )}
      </div>

      {/* Guest List */}
      <div className="max-h-96 overflow-y-auto">
        {filteredGuests.length === 0 ? (
          <div className="p-8 text-center text-muted">
            <Users className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            <p>No guests found</p>
          </div>
        ) : (
          <div className="divide-y divide-divider">
            {filteredGuests.map((guest) => (
              <motion.div
                key={guest.id}
                layout
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className={cn(
                  'p-4 hover:bg-rose-soft/30 transition-colors',
                  selectedGuests.has(guest.id) && 'bg-rose-soft/50'
                )}
              >
                <div className="flex items-center gap-3">
                  {/* Selection Checkbox */}
                  <button
                    onClick={() => toggleGuestSelection(guest.id)}
                    className={cn(
                      'w-5 h-5 rounded border-2 flex items-center justify-center transition-colors',
                      selectedGuests.has(guest.id)
                        ? 'bg-rani border-rani'
                        : 'border-gray-300 hover:border-rani'
                    )}
                  >
                    {selectedGuests.has(guest.id) && (
                      <Check className="w-3 h-3 text-white" />
                    )}
                  </button>

                  {/* Guest Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-charcoal truncate">
                        {guest.name}
                      </span>
                      {guest.plusOne && (
                        <span className="text-xs px-1.5 py-0.5 bg-purple-100 text-purple-700 rounded">
                          +1
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-3 mt-1 text-xs text-muted">
                      <span className={getSideColor(guest.side)}>
                        {guest.side === 'bride' ? "Bride's side" : guest.side === 'groom' ? "Groom's side" : 'Mutual'}
                      </span>
                      {guest.email && (
                        <span className="flex items-center gap-1">
                          <Mail className="w-3 h-3" />
                          {guest.email}
                        </span>
                      )}
                      {guest.phone && (
                        <span className="flex items-center gap-1">
                          <Phone className="w-3 h-3" />
                          {guest.phone}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* RSVP Status */}
                  <div className={cn(
                    'flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium',
                    getRsvpColor(guest.rsvp)
                  )}>
                    {getRsvpIcon(guest.rsvp)}
                    <span className="capitalize">{guest.rsvp}</span>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1">
                    {onEditGuest && (
                      <button
                        onClick={() => onEditGuest(guest)}
                        className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
                      >
                        <Edit3 className="w-4 h-4 text-muted" />
                      </button>
                    )}
                    {onDeleteGuest && (
                      <button
                        onClick={() => onDeleteGuest(guest.id)}
                        className="p-1.5 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4 text-error" />
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-divider bg-gray-50">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted">
            Showing {filteredGuests.length} of {guests.length} guests
          </span>
          {stats.pending > 0 && onSendReminder && (
            <Button
              variant="secondary"
              size="sm"
              onClick={() => onSendReminder(guests.filter(g => g.rsvp === 'pending').map(g => g.id))}
            >
              <Mail className="w-4 h-4 mr-1" />
              Send All Reminders
            </Button>
          )}
        </div>
      </div>
    </motion.div>
  );
}

export default GuestListManager;
