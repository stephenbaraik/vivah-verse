import { Injectable } from '@nestjs/common';
import { VenuesService } from '../venues/venues.service';

type ParsedContext = {
  city?: string;
  date?: string;
  guests?: number;
  budget?: number;
  intent: 'venue' | 'date' | 'budget' | 'general';
};

type ConciergeContext = {
  city?: string;
  date?: string;
  guests?: number | string;
  budget?: number | string;
};

export type ConciergeRecommendation = {
  id: string;
  type: 'venue' | 'vendor' | 'date' | 'budget' | 'package';
  title: string;
  description: string;
  confidence: number;
  editable?: boolean;
  value?: string;
};

export type ConciergeChatResponse = {
  message: string;
  confidence: number;
  extracted: {
    city?: string;
    date?: string;
    guests?: number;
    budget?: number;
    intent: ParsedContext['intent'];
  };
  recommendations: ConciergeRecommendation[];
};

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

function isoDate(d: Date) {
  return d.toISOString().slice(0, 10);
}

@Injectable()
export class RecommendationsService {
  constructor(private venuesService: VenuesService) {}

  async chat(input: {
    message: string;
    context?: ConciergeContext;
  }): Promise<ConciergeChatResponse> {
    const parsed = this.parseMessage(input.message, input.context);

    const recommendations: ConciergeRecommendation[] = [];

    if (parsed.intent === 'date') {
      const dates = this.suggestDates(parsed.date, input.message);
      for (const d of dates) {
        recommendations.push({
          id: `date_${d}`,
          type: 'date',
          title: `Suggested date: ${d}`,
          description: 'A popular weekend date with good vendor availability.',
          confidence: 78,
          editable: true,
          value: d,
        });
      }
    }

    if (parsed.intent === 'budget' && parsed.budget) {
      const b = parsed.budget;
      const venue = Math.round(b * 0.45);
      const decor = Math.round(b * 0.2);
      const photoVideo = Math.round(b * 0.15);
      const food = Math.round(b * 0.15);
      const buffer = Math.max(0, b - (venue + decor + photoVideo + food));
      recommendations.push({
        id: `budget_${b}`,
        type: 'budget',
        title: `Budget split for ₹${b.toLocaleString('en-IN')}`,
        description: `Venue ~₹${venue.toLocaleString('en-IN')}, Decor ~₹${decor.toLocaleString('en-IN')}, Photo/Video ~₹${photoVideo.toLocaleString('en-IN')}, Catering ~₹${food.toLocaleString('en-IN')}, Buffer ~₹${buffer.toLocaleString('en-IN')}.`,
        confidence: 72,
        editable: true,
        value: String(b),
      });
    }

    // Vendor/service recommendations (links into frontend service categories)
    const serviceCategories = this.inferServiceCategories(input.message);
    if (serviceCategories.length > 0) {
      for (const cat of serviceCategories.slice(0, 3)) {
        recommendations.push({
          id: `vendor_${cat}`,
          type: 'vendor',
          title: `Explore ${this.serviceLabel(cat)} vendors`,
          description: parsed.city
            ? `Shortlist top-rated ${this.serviceLabel(cat)} vendors in ${parsed.city}.`
            : `Browse trusted ${this.serviceLabel(cat)} vendors and compare packages.`,
          confidence: 74,
          editable: false,
          value: cat,
        });
      }
    }

    // Package tier recommendation
    const tier = this.recommendPackageTier(parsed.guests, parsed.budget);
    if (tier) {
      recommendations.push({
        id: `package_${tier}`,
        type: 'package',
        title: `Recommended package: ${this.packageLabel(tier)}`,
        description: this.packageDescription(
          tier,
          parsed.guests,
          parsed.budget,
        ),
        confidence: 70,
        editable: false,
        value: tier,
      });
    }

    // Venue recommendations (availability-aware) when we have at least intent=venue or enough context
    if (
      parsed.intent === 'venue' ||
      parsed.city ||
      parsed.date ||
      parsed.guests ||
      parsed.budget
    ) {
      const maxPrice = parsed.budget ? parsed.budget : undefined;
      const result = await this.venuesService.searchVenues({
        city: parsed.city,
        date: parsed.date,
        guests: parsed.guests,
        minPrice: undefined,
        maxPrice,
      });

      const top = result.data.slice(0, 3);
      top.forEach((v, idx) => {
        const confidence = clamp(
          88 - idx * 6 + (parsed.date ? 3 : 0) + (parsed.guests ? 3 : 0),
          55,
          95,
        );
        recommendations.push({
          id: `venue_${v.id}`,
          type: 'venue',
          title: v.name,
          description: `${v.city} • Up to ${v.capacity} guests • From ₹${Math.round(v.basePrice).toLocaleString('en-IN')}.`,
          confidence,
          editable: false,
          value: v.id,
        });
      });
    }

    const confidence = clamp(
      55 +
        (parsed.city ? 10 : 0) +
        (parsed.date ? 12 : 0) +
        (parsed.guests ? 8 : 0) +
        (parsed.budget ? 8 : 0),
      55,
      92,
    );

    const message = this.composeAssistantMessage(parsed, recommendations);

    return {
      message,
      confidence,
      extracted: {
        city: parsed.city,
        date: parsed.date,
        guests: parsed.guests,
        budget: parsed.budget,
        intent: parsed.intent,
      },
      recommendations,
    };
  }

  private inferServiceCategories(message: string): string[] {
    const lower = message.toLowerCase();

    const categories: string[] = [];
    const push = (cat: string) => {
      if (!categories.includes(cat)) categories.push(cat);
    };

    if (/decor|decoration|mandap|stage|lighting/.test(lower)) push('decor');
    if (/cater|catering|food|menu|plate|buffet/.test(lower)) push('catering');
    if (
      /photo|photography|camera|candid|cinematic|video|videography|drone/.test(
        lower,
      )
    )
      push('photography');
    if (/dj|music|band|sangeet|entertainment|sound/.test(lower))
      push('entertainment');
    if (/mehendi|henna|floral|flowers|garland/.test(lower)) push('florals');
    if (/transport|car|fleet|logistics|baraat/.test(lower)) push('transport');

    // If user asks for "vendors" but doesn't specify, suggest common ones.
    if (categories.length === 0 && /vendor|vendors|services/.test(lower)) {
      push('decor');
      push('photography');
      push('catering');
    }

    return categories;
  }

  private serviceLabel(category: string) {
    switch (category) {
      case 'decor':
        return 'Decor & Design';
      case 'catering':
        return 'Catering & Cuisine';
      case 'photography':
        return 'Photography & Video';
      case 'entertainment':
        return 'Entertainment';
      case 'florals':
        return 'Florals & Mehendi';
      case 'transport':
        return 'Transport & Logistics';
      default:
        return category;
    }
  }

  private recommendPackageTier(
    guests?: number,
    budget?: number,
  ): 'budget' | 'premium' | 'luxury' | null {
    // Heuristic: treat budget as INR.
    if (!guests && !budget) return null;

    if ((budget && budget >= 4000000) || (guests && guests >= 400))
      return 'luxury';
    if ((budget && budget >= 1500000) || (guests && guests >= 150))
      return 'premium';
    return 'budget';
  }

  private packageLabel(tier: 'budget' | 'premium' | 'luxury') {
    switch (tier) {
      case 'budget':
        return 'Essential';
      case 'premium':
        return 'Premium';
      case 'luxury':
        return 'Luxury';
    }
  }

  private packageDescription(
    tier: 'budget' | 'premium' | 'luxury',
    guests?: number,
    budget?: number,
  ) {
    const parts: string[] = [];
    if (guests) parts.push(`~${guests} guests`);
    if (budget) parts.push(`₹${budget.toLocaleString('en-IN')} budget`);
    const ctx = parts.length ? ` (based on ${parts.join(', ')})` : '';

    if (tier === 'luxury') {
      return `Best for grand celebrations with premium venue + designer decor + top-tier photo/video${ctx}.`;
    }
    if (tier === 'premium') {
      return `A balanced package: premium venue, royal decor, multi-cuisine catering, and pro photo/video${ctx}.`;
    }
    return `A smart, budget-friendly start: good venue options, elegant decor, and essential services${ctx}.`;
  }

  private composeAssistantMessage(
    parsed: ParsedContext,
    recs: ConciergeRecommendation[],
  ) {
    const bits: string[] = [];

    if (parsed.city) bits.push(`in ${parsed.city}`);
    if (parsed.guests) bits.push(`for ~${parsed.guests} guests`);
    if (parsed.date) bits.push(`on ${parsed.date}`);
    if (parsed.budget)
      bits.push(`within ₹${parsed.budget.toLocaleString('en-IN')}`);

    const context = bits.length ? ` ${bits.join(', ')}` : '';

    if (recs.length === 0) {
      return `Tell me your city, guest count, date, and budget, and I’ll suggest the best options.${context}`;
    }

    const venueCount = recs.filter((r) => r.type === 'venue').length;
    const dateCount = recs.filter((r) => r.type === 'date').length;
    const budgetCount = recs.filter((r) => r.type === 'budget').length;

    const summary: string[] = [];
    if (venueCount)
      summary.push(`${venueCount} venue option${venueCount > 1 ? 's' : ''}`);
    if (dateCount)
      summary.push(`${dateCount} date suggestion${dateCount > 1 ? 's' : ''}`);
    if (budgetCount) summary.push('a budget split');

    return `Here are ${summary.join(', ')}${context}. Want me to refine by vibe (royal/palace, beach, garden), or by distance from a specific area?`;
  }

  private parseMessage(
    message: string,
    context?: ConciergeContext,
  ): ParsedContext {
    const lower = message.toLowerCase();

    const intent: ParsedContext['intent'] =
      /date|november|december|january|february|march|april|may|june|july|august|september|october/.test(
        lower,
      )
        ? 'date'
        : /budget|under|within|lakh|₹|rs\.?/.test(lower)
          ? 'budget'
          : /venue|hall|resort|banquet/.test(lower)
            ? 'venue'
            : 'general';

    const parsed: ParsedContext = { intent };

    // Guests: “500 guests” / “500 people”
    const guestMatch = lower.match(/(\d{2,5})\s*(guests|people|pax)/);
    if (guestMatch) parsed.guests = Number(guestMatch[1]);

    // Budget: “₹5,00,000” or “5 lakh”
    const inrMatch = lower.match(/(?:₹|rs\.?\s*)\s*([0-9][0-9,]{2,})/);
    if (inrMatch) {
      parsed.budget = Number(inrMatch[1].replace(/,/g, ''));
    } else {
      const lakhMatch = lower.match(/(\d+(?:\.\d+)?)\s*(lakh|lakhs)/);
      if (lakhMatch) {
        parsed.budget = Math.round(Number(lakhMatch[1]) * 100000);
      }
    }

    // City: “in Mumbai” / “near Mumbai” (single token heuristic)
    const cityMatch = message.match(/\b(?:in|near)\s+([A-Za-z]{3,})\b/);
    if (cityMatch) parsed.city = cityMatch[1];

    // Date: YYYY-MM-DD
    const iso = lower.match(/\b(\d{4}-\d{2}-\d{2})\b/);
    if (iso) parsed.date = iso[1];

    // Context overrides
    if (context?.city) parsed.city = context.city;
    if (context?.date) parsed.date = context.date;
    if (context?.guests !== undefined) {
      const g = Number(context.guests);
      if (!Number.isNaN(g)) parsed.guests = g;
    }
    if (context?.budget !== undefined) {
      const b = Number(String(context.budget).replace(/,/g, ''));
      if (!Number.isNaN(b)) parsed.budget = b;
    }

    return parsed;
  }

  private suggestDates(
    explicitIso: string | undefined,
    message: string,
  ): string[] {
    // If user already gave a date, just echo a couple nearby weekends.
    if (explicitIso) {
      const base = new Date(explicitIso);
      const out: string[] = [];
      for (let i = 0; i < 3; i++) {
        const d = new Date(base);
        d.setDate(base.getDate() + i * 7);
        out.push(isoDate(d));
      }
      return out;
    }

    // Month name → next occurrence of that month (or current year if still ahead)
    const lower = message.toLowerCase();
    const monthNames: Record<string, number> = {
      january: 0,
      february: 1,
      march: 2,
      april: 3,
      may: 4,
      june: 5,
      july: 6,
      august: 7,
      september: 8,
      october: 9,
      november: 10,
      december: 11,
    };

    const monthKey = Object.keys(monthNames).find((m) => lower.includes(m));
    const now = new Date();
    const targetMonth = monthKey ? monthNames[monthKey] : now.getMonth();

    let year = now.getFullYear();
    if (
      targetMonth < now.getMonth() ||
      (targetMonth === now.getMonth() && now.getDate() > 10)
    ) {
      year += 1;
    }

    // Pick first 3 Saturdays in that month
    const out: string[] = [];
    const first = new Date(year, targetMonth, 1);
    const last = new Date(year, targetMonth + 1, 0);

    for (
      let d = new Date(first);
      d <= last && out.length < 3;
      d.setDate(d.getDate() + 1)
    ) {
      if (d.getDay() === 6) out.push(isoDate(d));
    }

    return out;
  }
}
