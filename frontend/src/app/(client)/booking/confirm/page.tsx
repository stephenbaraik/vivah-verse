"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useSearchParams, useRouter } from "next/navigation";
import { Calendar, MapPin, Users, CreditCard, ArrowLeft, Loader2 } from "lucide-react";
import { useVenue } from "@/features/venues";
import { useMyWeddings } from "@/features/wedding";
import { BookingsService } from "@/services/bookings.service";
import { PaymentsService, openRazorpayCheckout } from "@/services/payments.service";
import { useToast } from "@/stores/toast-store";
import { useAuthStore } from "@/stores/auth-store";
import { Button, Card, CardContent, Skeleton } from "@/components/ui";
import { BookingProgress } from "@/components/booking/booking-progress";
import { formatDate, formatCurrency } from "@/lib/utils";

const BOOKING_STEPS = [
  { id: "wedding", label: "Select wedding" },
  { id: "confirm", label: "Confirm" },
  { id: "payment", label: "Payment" },
];

const DRAFT_KEY = "vivah.bookingDraft.v1";

export const dynamic = 'force-dynamic';

type BookingDraft = { venueId: string; weddingId: string; updatedAt?: number };

function BookingSummary({ venue, wedding, guestCount }: { venue: any; wedding: any; guestCount: number }) {
  const estimatedTotal = venue.pricePerPlate * guestCount;
  return (
    <Card>
      <CardContent className="p-0">
        <div className="h-40 bg-charcoal/10 relative overflow-hidden rounded-t-lg">
          {venue.images?.[0] && <Image src={venue.images[0]} alt={venue.name} fill className="object-cover" />}
        </div>
        <div className="p-4 space-y-4">
          <div>
            <h3 className="font-serif font-semibold text-lg text-charcoal">{venue.name}</h3>
            <p className="text-sm text-muted flex items-center gap-1">
              <MapPin className="w-3 h-3" /> {venue.city}
            </p>
          </div>
          <div className="border-t border-divider pt-4 space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="flex items-center gap-2 text-muted">
                <Calendar className="w-4 h-4" /> Wedding Date
              </span>
              <span className="font-medium text-charcoal">{formatDate(wedding.weddingDate)}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="flex items-center gap-2 text-muted">
                <Users className="w-4 h-4" /> Guest Count
              </span>
              <span className="font-medium text-charcoal">{guestCount} guests</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="flex items-center gap-2 text-muted">
                <CreditCard className="w-4 h-4" /> Price per Plate
              </span>
              <span className="font-medium text-charcoal">{formatCurrency(venue.pricePerPlate)}</span>
            </div>
          </div>
          <div className="border-t border-divider pt-4">
            <div className="flex items-center justify-between">
              <span className="font-medium text-charcoal">Estimated Total</span>
              <span className="text-xl font-serif font-semibold text-rose">{formatCurrency(estimatedTotal)}</span>
            </div>
            <p className="text-xs text-muted mt-1">Final amount may vary based on selections</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function ConfirmPage() {
  const router = useRouter();
  const { addToast } = useToast();
  const { user } = useAuthStore();

  const [venueId, setVenueId] = useState<string | null>(null);
  const [weddingId, setWeddingId] = useState<string | null>(null);

  useEffect(() => {
    const sp = new URLSearchParams(window.location.search);
    setVenueId(sp.get("venueId"));
    setWeddingId(sp.get("weddingId"));
  }, []);

  const { data: venue, isLoading: venueLoading } = useVenue(venueId ?? "");
  const { data: weddings, isLoading: weddingsLoading } = useMyWeddings();

  const [isProcessing, setIsProcessing] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [selectedAddOns, setSelectedAddOns] = useState<string[]>([]);
  const [addOns, setAddOns] = useState<any[]>([]);

  const wedding = weddings?.find((w: any) => w.id === weddingId);
  const guestCount = wedding?.guestCount ?? 500;
  const estimatedTotal = venue ? venue.pricePerPlate * guestCount : 0;
  const upfrontAmount = Math.round(estimatedTotal * 0.35);
  const remainingAmount = estimatedTotal - upfrontAmount;

  useEffect(() => {
    if (!venueId || !weddingId) return;
    try {
      const draft: BookingDraft = { venueId: venueId as string, weddingId: weddingId as string, updatedAt: Date.now() };
      localStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
    } catch {}
  }, [venueId, weddingId]);

  useEffect(() => {
    async function fetchAddOns() {
      if (!venueId) return;
      try {
        const res = await fetch(`/api/venues/${venueId}/addons`);
        if (res.ok) setAddOns(await res.json());
      } catch {}
    }
    fetchAddOns();
  }, [venueId]);

  const handleConfirm = async () => {
    if (!venue || !wedding || !weddingId || !venueId) return;
    setIsProcessing(true);
    try {
      const booking = await BookingsService.create({ weddingId, venueId });
      const paymentData = await PaymentsService.initiate({ bookingId: booking.id, amount: upfrontAmount });
      if (paymentData.testMode) {
        await PaymentsService.confirm(paymentData.paymentId, paymentData.razorpayOrderId);
        router.push(`/booking/confirmation?id=${booking.id}`);
        return;
      }
      openRazorpayCheckout({
        orderId: paymentData.razorpayOrderId,
        keyId: paymentData.razorpayKeyId,
        amount: paymentData.amount,
        description: `Booking for ${venue.name} (35% upfront)`,
        prefill: { name: user?.name, email: user?.email, contact: user?.phone },
        onSuccess: async (response: any) => {
          try {
            await PaymentsService.verify({ razorpayOrderId: response.razorpay_order_id, razorpayPaymentId: response.razorpay_payment_id, razorpaySignature: response.razorpay_signature });
            router.push(`/booking/confirmation?id=${booking.id}`);
          } catch {
            router.push(`/booking/confirmation?id=${booking.id}`);
          }
        },
        onError: (error: any) => {
          addToast({ type: "error", message: error.message || "Payment was cancelled" });
          setIsProcessing(false);
        },
      });
    } catch (err: any) {
      addToast({ type: "error", message: err?.response?.data?.message || "Failed to create booking" });
      setIsProcessing(false);
    }
  };

  if (!venueId || !weddingId) {
    return (
      <div className="text-center py-20">
        <p className="text-muted">Missing booking information</p>
        <Button variant="secondary" onClick={() => router.push("/venues")}>Browse Venues</Button>
      </div>
    );
  }

  if (venueLoading || weddingsLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-md mx-auto px-4 py-8">
          <Skeleton className="h-8 w-48 mb-8" />
        </div>
      </div>
    );
  }

  if (!venue || !wedding) {
    return (
      <div className="text-center py-20">
        <p className="text-muted">Booking information not found</p>
        <Button variant="secondary" onClick={() => router.push("/venues")} className="mt-4">Browse Venues</Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-md mx-auto px-4 py-8">
        <div className="mb-4">
          <BookingProgress steps={BOOKING_STEPS} currentStep={1} variant="compact" />
        </div>

        <button onClick={() => router.back()} className="flex items-center gap-2 text-muted hover:text-charcoal mb-6">
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </button>

        <div className="mb-6">
          <h1 className="text-2xl font-serif font-semibold text-charcoal">Confirm Booking</h1>
          <p className="text-muted text-sm mt-1">Review your booking details before payment</p>
        </div>

        <BookingSummary venue={venue} wedding={wedding} guestCount={guestCount} />

        {addOns.length > 0 && (
          <div className="mb-6">
            <h3 className="text-sm font-medium mb-2">Add-ons</h3>
            <div className="space-y-2">
              {addOns.map((addon: any) => (
                <label key={addon.id} className="flex items-center gap-2">
                  <input type="checkbox" checked={selectedAddOns.includes(addon.id)} onChange={(e) => setSelectedAddOns((p) => (e.target.checked ? [...p, addon.id] : p.filter((id) => id !== addon.id)))} className="accent-rose" />
                  <span className="text-sm font-medium">{addon.name}</span>
                  <span className="text-xs text-muted ml-2">{addon.price ? formatCurrency(addon.price) : ""}</span>
                </label>
              ))}
            </div>
          </div>
        )}

        <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded">
          <div className="flex justify-between text-sm">
            <span>Upfront (due now):</span>
            <span className="font-semibold text-rose">{formatCurrency(upfrontAmount)}</span>
          </div>
          <div className="flex justify-between text-sm mt-1">
            <span>Remaining (due before event):</span>
            <span className="font-semibold">{formatCurrency(remainingAmount)}</span>
          </div>
          <p className="text-xs text-muted mt-2">You pay 35% now to secure your booking. The remaining 65% is due before your wedding date.</p>
        </div>

        <div className="mt-4">
          <label className="flex items-center gap-2 mb-3">
            <input type="checkbox" checked={agreed} onChange={(e) => setAgreed(e.target.checked)} className="accent-rose" />
            <span className="text-sm text-muted">I agree to the terms and want to proceed with booking</span>
          </label>
          <Button size="lg" disabled={!agreed || isProcessing} onClick={handleConfirm} className="w-full">
            {isProcessing ? <Loader2 className="animate-spin w-5 h-5 mr-2" /> : null}
            Confirm &amp; Pay
          </Button>
        </div>
      </div>
    </div>
  );
}
