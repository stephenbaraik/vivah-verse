'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Save, 
  X, 
  Plus,
  Check,
  AlertCircle
} from 'lucide-react';
import { 
  Button, 
  Card, 
  CardHeader, 
  CardTitle, 
  CardContent,
  Input,
  Toggle
} from '@/components/ui';

const AMENITIES = [
  'Parking', 'AC', 'WiFi', 'Lawn', 'Pool', 'Helipad', 'Valet',
  'Bridal Room', 'DJ Allowed', 'Outdoor Catering', 'Decoration'
];

const CUISINE_TYPES = [
  'North Indian', 'South Indian', 'Chinese', 'Continental',
  'Jain', 'Mughlai', 'Italian', 'Thai', 'Multi-Cuisine'
];

export default function VenueEditPage() {
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [images, setImages] = useState<string[]>([
    '/venue-1.jpg',
    '/venue-2.jpg',
  ]);
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>(['Parking', 'AC', 'WiFi']);
  const [selectedCuisines, setSelectedCuisines] = useState<string[]>(['North Indian', 'Multi-Cuisine']);
  const [formData, setFormData] = useState({
    name: 'The Grand Imperial Palace',
    description: 'A majestic heritage property offering royal wedding experiences with stunning architecture and impeccable service.',
    address: 'Lake Palace Road',
    city: 'Udaipur',
    state: 'Rajasthan',
    pincode: '313001',
    capacity: '800',
    pricePerPlate: '2500',
    isActive: true,
  });

  const handleSave = async () => {
    setSaving(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const toggleAmenity = (amenity: string) => {
    setSelectedAmenities(prev =>
      prev.includes(amenity)
        ? prev.filter(a => a !== amenity)
        : [...prev, amenity]
    );
  };

  const toggleCuisine = (cuisine: string) => {
    setSelectedCuisines(prev =>
      prev.includes(cuisine)
        ? prev.filter(c => c !== cuisine)
        : [...prev, cuisine]
    );
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-6">
      {/* Header with Save */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-serif font-semibold text-charcoal">
            Edit Venue
          </h1>
          <p className="text-muted">Update your venue listing details</p>
        </div>
        <div className="flex items-center gap-3">
          {saved && (
            <motion.span
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-success flex items-center gap-1"
            >
              <Check className="w-4 h-4" />
              Saved
            </motion.span>
          )}
          <Button
            onClick={handleSave}
            isLoading={saving}
            leftIcon={!saving && <Save className="w-4 h-4" />}
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Info */}
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Input
                  label="Venue Name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                />
                <div>
                  <label className="block text-sm font-medium text-charcoal mb-1.5">
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    rows={4}
                    className="w-full px-4 py-3 rounded-lg border border-divider focus:ring-2 focus:ring-gold/50 focus:border-gold transition-all resize-none"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="Max Capacity"
                    type="number"
                    value={formData.capacity}
                    onChange={(e) => setFormData(prev => ({ ...prev, capacity: e.target.value }))}
                  />
                  <Input
                    label="Price per Plate (₹)"
                    type="number"
                    value={formData.pricePerPlate}
                    onChange={(e) => setFormData(prev => ({ ...prev, pricePerPlate: e.target.value }))}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Images */}
          <Card>
            <CardHeader>
              <CardTitle>Photos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {images.map((img, idx) => (
                  <div key={idx} className="relative aspect-video rounded-lg bg-divider overflow-hidden group">
                    <div className="w-full h-full bg-gradient-to-br from-rani/20 to-gold/20" />
                    <button
                      onClick={() => removeImage(idx)}
                      className="absolute top-2 right-2 w-8 h-8 rounded-full bg-white/90 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="w-4 h-4 text-charcoal" />
                    </button>
                    {idx === 0 && (
                      <span className="absolute bottom-2 left-2 px-2 py-1 bg-rani text-white text-xs rounded">
                        Cover
                      </span>
                    )}
                  </div>
                ))}
                <label className="aspect-video rounded-lg border-2 border-dashed border-divider hover:border-rani flex flex-col items-center justify-center cursor-pointer transition-colors">
                  <input type="file" className="hidden" accept="image/*" />
                  <Plus className="w-8 h-8 text-muted mb-2" />
                  <span className="text-sm text-muted">Add Photo</span>
                </label>
              </div>
              <p className="text-sm text-muted mt-4">
                First image will be used as cover. Drag to reorder.
              </p>
            </CardContent>
          </Card>

          {/* Location */}
          <Card>
            <CardHeader>
              <CardTitle>Location</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <Input
                    label="Address"
                    value={formData.address}
                    onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                  />
                </div>
                <Input
                  label="City"
                  value={formData.city}
                  onChange={(e) => setFormData(prev => ({ ...prev, city: e.target.value }))}
                />
                <Input
                  label="State"
                  value={formData.state}
                  onChange={(e) => setFormData(prev => ({ ...prev, state: e.target.value }))}
                />
                <Input
                  label="PIN Code"
                  value={formData.pincode}
                  onChange={(e) => setFormData(prev => ({ ...prev, pincode: e.target.value }))}
                />
              </div>
            </CardContent>
          </Card>

          {/* Amenities */}
          <Card>
            <CardHeader>
              <CardTitle>Amenities</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {AMENITIES.map(amenity => (
                  <button
                    key={amenity}
                    onClick={() => toggleAmenity(amenity)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                      selectedAmenities.includes(amenity)
                        ? 'bg-rani text-white'
                        : 'bg-divider text-muted hover:bg-cloud'
                    }`}
                  >
                    {selectedAmenities.includes(amenity) && (
                      <Check className="w-3 h-3 inline mr-1" />
                    )}
                    {amenity}
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Cuisines */}
          <Card>
            <CardHeader>
              <CardTitle>Cuisine Types</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {CUISINE_TYPES.map(cuisine => (
                  <button
                    key={cuisine}
                    onClick={() => toggleCuisine(cuisine)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                      selectedCuisines.includes(cuisine)
                        ? 'bg-gold text-white'
                        : 'bg-divider text-muted hover:bg-cloud'
                    }`}
                  >
                    {selectedCuisines.includes(cuisine) && (
                      <Check className="w-3 h-3 inline mr-1" />
                    )}
                    {cuisine}
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Status */}
          <Card>
            <CardHeader>
              <CardTitle>Listing Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-charcoal">Active</p>
                  <p className="text-sm text-muted">Visible to customers</p>
                </div>
                <Toggle
                  checked={formData.isActive}
                  onChange={(checked) => setFormData(prev => ({ ...prev, isActive: checked }))}
                />
              </div>
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <Card>
            <CardHeader>
              <CardTitle>Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-muted">Views (30d)</span>
                  <span className="font-semibold text-charcoal">1,234</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted">Inquiries (30d)</span>
                  <span className="font-semibold text-charcoal">48</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted">Bookings (30d)</span>
                  <span className="font-semibold text-charcoal">12</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted">Rating</span>
                  <span className="font-semibold text-charcoal">4.8 ⭐</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Tips */}
          <Card variant="accent">
            <CardContent className="pt-6">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-rani flex-shrink-0" />
                <div>
                  <p className="font-medium text-charcoal">Listing Tips</p>
                  <ul className="text-sm text-muted mt-2 space-y-1">
                    <li>• Add at least 5 high-quality photos</li>
                    <li>• Include detailed descriptions</li>
                    <li>• Keep pricing up to date</li>
                    <li>• Respond to inquiries quickly</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
