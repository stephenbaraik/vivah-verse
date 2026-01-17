'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  Building2, 
  Upload, 
  CheckCircle,
  AlertCircle 
} from 'lucide-react';
import { 
  Button, 
  Card, 
  CardHeader, 
  CardTitle, 
  CardContent,
  Input,
  Stepper,
  StatusBadge
} from '@/components/ui';

const STEPS = [
  { id: 'business', label: 'Business Info' },
  { id: 'documents', label: 'Documents' },
  { id: 'bank', label: 'Bank Details' },
  { id: 'review', label: 'Review' },
];

const DOCUMENT_TYPES = [
  { id: 'pan', label: 'PAN Card', required: true },
  { id: 'gst', label: 'GST Certificate', required: true },
  { id: 'fssai', label: 'FSSAI License', required: false },
  { id: 'fire', label: 'Fire Safety Certificate', required: false },
];

export default function VendorOnboardingPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    businessName: '',
    gstin: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    contactPerson: '',
    phone: '',
    email: '',
  });
  const [documents, setDocuments] = useState<Record<string, File | null>>({});
  const [uploading, setUploading] = useState<string | null>(null);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFileUpload = (docId: string, file: File | null) => {
    setUploading(docId);
    // Simulate upload
    setTimeout(() => {
      setDocuments(prev => ({ ...prev, [docId]: file }));
      setUploading(null);
    }, 1000);
  };

  const handleSubmit = () => {
    // Submit for review
    router.push('/vendor');
  };

  return (
    <div className="min-h-screen bg-cloud py-8">
      <div className="max-w-3xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-full bg-rani/10 flex items-center justify-center mx-auto mb-4">
            <Building2 className="w-8 h-8 text-rani" />
          </div>
          <h1 className="text-2xl font-serif font-semibold text-charcoal">
            Vendor Registration
          </h1>
          <p className="text-muted mt-2">
            Complete your profile to start receiving bookings
          </p>
        </div>

        {/* Stepper */}
        <div className="mb-8 overflow-x-auto">
          <Stepper steps={STEPS} currentStep={currentStep} />
        </div>

        {/* Step 1: Business Info */}
        {currentStep === 1 && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Business Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <Input
                      label="Business Name"
                      value={formData.businessName}
                      onChange={(e) => handleInputChange('businessName', e.target.value)}
                      placeholder="Enter your business name"
                    />
                  </div>
                  <Input
                    label="GSTIN"
                    value={formData.gstin}
                    onChange={(e) => handleInputChange('gstin', e.target.value)}
                    placeholder="22AAAAA0000A1Z5"
                  />
                  <Input
                    label="Contact Person"
                    value={formData.contactPerson}
                    onChange={(e) => handleInputChange('contactPerson', e.target.value)}
                    placeholder="Full name"
                  />
                  <Input
                    label="Phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    placeholder="+91 98765 43210"
                  />
                  <Input
                    label="Email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    placeholder="business@example.com"
                  />
                  <div className="md:col-span-2">
                    <Input
                      label="Address"
                      value={formData.address}
                      onChange={(e) => handleInputChange('address', e.target.value)}
                      placeholder="Full address"
                    />
                  </div>
                  <Input
                    label="City"
                    value={formData.city}
                    onChange={(e) => handleInputChange('city', e.target.value)}
                    placeholder="City"
                  />
                  <Input
                    label="State"
                    value={formData.state}
                    onChange={(e) => handleInputChange('state', e.target.value)}
                    placeholder="State"
                  />
                  <Input
                    label="PIN Code"
                    value={formData.pincode}
                    onChange={(e) => handleInputChange('pincode', e.target.value)}
                    placeholder="400001"
                  />
                </div>
                <div className="flex justify-end mt-6">
                  <Button onClick={() => setCurrentStep(2)}>
                    Continue to Documents
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Step 2: Documents */}
        {currentStep === 2 && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Upload Documents</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {DOCUMENT_TYPES.map(doc => (
                    <div
                      key={doc.id}
                      className={`p-4 border-2 border-dashed rounded-lg transition-colors ${
                        documents[doc.id] ? 'border-success bg-success/5' : 'border-divider'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          {documents[doc.id] ? (
                            <CheckCircle className="w-5 h-5 text-success" />
                          ) : (
                            <Upload className="w-5 h-5 text-muted" />
                          )}
                          <div>
                            <p className="font-medium text-charcoal">
                              {doc.label}
                              {doc.required && (
                                <span className="text-error ml-1">*</span>
                              )}
                            </p>
                            {documents[doc.id] && (
                              <p className="text-sm text-success">
                                {documents[doc.id]!.name}
                              </p>
                            )}
                          </div>
                        </div>
                        <label className="cursor-pointer">
                          <input
                            type="file"
                            className="hidden"
                            accept=".pdf,.jpg,.png"
                            onChange={(e) => {
                              const file = e.target.files?.[0] || null;
                              handleFileUpload(doc.id, file);
                            }}
                          />
                          <span className={`px-4 py-2 rounded-lg text-sm font-medium ${
                            uploading === doc.id
                              ? 'bg-divider text-muted'
                              : 'bg-rani/10 text-rani hover:bg-rani/20'
                          }`}>
                            {uploading === doc.id ? 'Uploading...' : documents[doc.id] ? 'Replace' : 'Upload'}
                          </span>
                        </label>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex items-center gap-2 mt-4 p-3 bg-gold/10 rounded-lg">
                  <AlertCircle className="w-5 h-5 text-gold flex-shrink-0" />
                  <p className="text-sm text-charcoal">
                    Files should be in PDF, JPG, or PNG format (max 5MB each)
                  </p>
                </div>

                <div className="flex justify-between mt-6">
                  <Button variant="ghost" onClick={() => setCurrentStep(1)}>
                    Back
                  </Button>
                  <Button onClick={() => setCurrentStep(3)}>
                    Continue to Bank Details
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Step 3: Bank Details */}
        {currentStep === 3 && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Bank Account Details</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <Input
                      label="Account Holder Name"
                      placeholder="As per bank records"
                    />
                  </div>
                  <Input
                    label="Account Number"
                    placeholder="Enter account number"
                  />
                  <Input
                    label="Confirm Account Number"
                    placeholder="Re-enter account number"
                  />
                  <Input
                    label="IFSC Code"
                    placeholder="SBIN0001234"
                  />
                  <Input
                    label="Bank Name"
                    placeholder="Auto-filled from IFSC"
                    disabled
                  />
                </div>

                <div className="flex justify-between mt-6">
                  <Button variant="ghost" onClick={() => setCurrentStep(2)}>
                    Back
                  </Button>
                  <Button onClick={() => setCurrentStep(4)}>
                    Review & Submit
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Step 4: Review */}
        {currentStep === 4 && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Review Your Application</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="p-4 bg-rose-soft rounded-lg">
                    <h3 className="font-medium text-charcoal mb-2">Business Info</h3>
                    <p className="text-sm text-muted">{formData.businessName || 'The Grand Palace'}</p>
                    <p className="text-sm text-muted">{formData.city || 'Mumbai'}, {formData.state || 'Maharashtra'}</p>
                  </div>

                  <div className="p-4 bg-rose-soft rounded-lg">
                    <h3 className="font-medium text-charcoal mb-2">Documents</h3>
                    <div className="flex flex-wrap gap-2">
                      {DOCUMENT_TYPES.map(doc => (
                        <StatusBadge
                          key={doc.id}
                          status={documents[doc.id] ? 'approved' : 'pending'}
                          label={doc.label}
                          size="sm"
                        />
                      ))}
                    </div>
                  </div>

                  <div className="p-4 bg-gold/10 border border-gold/20 rounded-lg">
                    <h3 className="font-medium text-charcoal mb-2">What happens next?</h3>
                    <ul className="text-sm text-muted space-y-1">
                      <li>• Our team will review your application within 2-3 business days</li>
                      <li>• You&apos;ll receive an email once your account is verified</li>
                      <li>• After verification, you can start listing your venues</li>
                    </ul>
                  </div>
                </div>

                <div className="flex justify-between mt-6">
                  <Button variant="ghost" onClick={() => setCurrentStep(3)}>
                    Back
                  </Button>
                  <Button onClick={handleSubmit}>
                    Submit for Review
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>
    </div>
  );
}
