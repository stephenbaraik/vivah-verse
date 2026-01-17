import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const venueImages = {
  'The Grand Palace': [
    'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=800',
    'https://images.unsplash.com/photo-1583422409516-2895a77efded?w=800',
  ],
  'Lakeside Retreat': [
    'https://images.unsplash.com/photo-1596178065887-1198b6148b2b?w=800',
    'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800',
  ],
  'The Orchid Banquets': [
    'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=800',
    'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=800',
  ],
  'Royal Gardens': [
    'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=800',
    'https://images.unsplash.com/photo-1478146896981-b80fe463b330?w=800',
  ],
  'Beachside Bliss': [
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800',
    'https://images.unsplash.com/photo-1473186578172-c141e6798cf4?w=800',
  ],
  'The Heritage Haveli': [
    'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800',
    'https://images.unsplash.com/photo-1545569341-9eb8b30979d9?w=800',
  ],
  'Silicon Valley Club': [
    'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800',
    'https://images.unsplash.com/photo-1587271339700-f0a5c954e08b?w=800',
  ],
  'Nizam Gardens': [
    'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800',
    'https://images.unsplash.com/photo-1471967183320-ee018f6e114a?w=800',
  ],
  'Marina Bay Resort': [
    'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800',
    'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800',
  ],
  'Backwater Bliss': [
    'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=800',
    'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800',
  ],
  'The Fort Palace': [
    'https://images.unsplash.com/photo-1548013146-72479768bada?w=800',
    'https://images.unsplash.com/photo-1609137144813-7d9921338f24?w=800',
  ],
  'Park View Lawns': [
    'https://images.unsplash.com/photo-1505236858219-8359eb29e329?w=800',
    'https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?w=800',
  ],
};

async function updateVenueImages() {
  console.log('🖼️  Updating venue images...\n');

  for (const [venueName, images] of Object.entries(venueImages)) {
    await prisma.venue.updateMany({
      where: { name: venueName },
      data: { images },
    });
    console.log(`  ✅ Updated images for: ${venueName}`);
  }

  console.log('\n✨ All venue images updated!\n');
}

updateVenueImages()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
