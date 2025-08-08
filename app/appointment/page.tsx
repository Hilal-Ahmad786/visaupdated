'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { CalendarIcon, ClockIcon, VideoCameraIcon, PhoneIcon, MapPinIcon } from '@heroicons/react/24/outline'
import AdPlaceholder from '@/components/AdPlaceholder'
import ConversionButton from '@/components/ConversionButton'
import { conversions } from '@/lib/conversions'

interface AppointmentFormData {
  name: string
  email: string
  phone: string
  service: string
  date: string
  time: string
  type: 'office' | 'video' | 'phone'
  message: string
}

const timeSlots = [
  '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
  '12:00', '14:00', '14:30', '15:00', '15:30', '16:00',
  '16:30', '17:00', '17:30'
]

export default function AppointmentPage() {
  const [selectedType, setSelectedType] = useState<'office' | 'video' | 'phone'>('office')
  const { register, handleSubmit, formState: { errors }, watch } = useForm<AppointmentFormData>()
  
  const selectedDate = watch('date')

  const onSubmit = (data: AppointmentFormData) => {
    conversions.track('appointment_book', {
      value: 75,
      customParams: {
        appointment_type: data.type,
        service: data.service
      }
    })
    console.log(data)
    alert('Appointment booked successfully! We will contact you shortly.')
  }

  return (
    <>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary/10 to-accent/10 py-16">
        <div className="container">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Book an Appointment</h1>
            <p className="text-xl text-secondary">
              Schedule a consultation with our visa experts. Choose between office visit, 
              video call, or phone consultation.
            </p>
          </div>
        </div>
      </section>

      {/* Ad Placeholder */}
      <section className="py-4">
        <div className="container">
          <AdPlaceholder width="728px" height="90px" label="Top Ad" />
        </div>
      </section>

      {/* Appointment Form */}
      <section className="py-16">
        <div className="container">
          <div className="max-w-4xl mx-auto">
            {/* Appointment Type Selection */}
            <div className="mb-8">
              <h2 className="text-2xl font-semibold mb-6">Select Appointment Type</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <button
                  type="button"
                  onClick={() => setSelectedType('office')}
                  className={`card p-6 text-center cursor-pointer transition-all ${
                    selectedType === 'office' ? 'ring-2 ring-primary bg-primary/5' : ''
                  }`}
                >
                  <MapPinIcon className="h-8 w-8 mx-auto mb-3 text-primary" />
                  <h3 className="font-semibold mb-2">Office Visit</h3>
                  <p className="text-sm text-secondary">Visit us at our Istanbul office</p>
                </button>
                
                <button
                  type="button"
                  onClick={() => setSelectedType('video')}
                  className={`card p-6 text-center cursor-pointer transition-all ${
                    selectedType === 'video' ? 'ring-2 ring-primary bg-primary/5' : ''
                  }`}
                >
                  <VideoCameraIcon className="h-8 w-8 mx-auto mb-3 text-primary" />
                  <h3 className="font-semibold mb-2">Video Call</h3>
                  <p className="text-sm text-secondary">Consultation via Zoom/Skype</p>
                </button>
                
                <button
                  type="button"
                  onClick={() => setSelectedType('phone')}
                  className={`card p-6 text-center cursor-pointer transition-all ${
                    selectedType === 'phone' ? 'ring-2 ring-primary bg-primary/5' : ''
                  }`}
                >
                  <PhoneIcon className="h-8 w-8 mx-auto mb-3 text-primary" />
                  <h3 className="font-semibold mb-2">Phone Call</h3>
                  <p className="text-sm text-secondary">Discuss over the phone</p>
                </button>
              </div>
            </div>

            {/* Appointment Form */}
            <form onSubmit={handleSubmit(onSubmit)} className="card">
              <h2 className="text-2xl font-semibold mb-6">Appointment Details</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="form-label">Full Name *</label>
                  <input
                    {...register('name', { required: 'Name is required' })}
                    className="form-input w-full"
                    placeholder="Your name"
                  />
                  {errors.name && (
                    <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
                  )}
                </div>
                
                <div>
                  <label className="form-label">Email *</label>
                  <input
                    type="email"
                    {...register('email', { 
                      required: 'Email is required',
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: 'Invalid email address'
                      }
                    })}
                    className="form-input w-full"
                    placeholder="your@email.com"
                  />
                  {errors.email && (
                    <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
                  )}
                </div>
                
                <div>
                  <label className="form-label">Phone *</label>
                  <input
                    {...register('phone', { required: 'Phone is required' })}
                    className="form-input w-full"
                    placeholder="Your phone number"
                  />
                  {errors.phone && (
                    <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>
                  )}
                </div>
                
                <div>
                  <label className="form-label">Service Required *</label>
                  <select
                    {...register('service', { required: 'Please select a service' })}
                    className="form-input w-full"
                  >
                    <option value="">Select service</option>
                    <option value="tourist">Tourist Visa</option>
                    <option value="business">Business Visa</option>
                    <option value="student">Student Visa</option>
                    <option value="family">Family Reunion</option>
                    <option value="consultation">General Consultation</option>
                  </select>
                  {errors.service && (
                    <p className="text-red-500 text-sm mt-1">{errors.service.message}</p>
                  )}
                </div>
                
                <div>
                  <label className="form-label">Preferred Date *</label>
                  <input
                    type="date"
                    {...register('date', { required: 'Date is required' })}
                    className="form-input w-full"
                    min={new Date().toISOString().split('T')[0]}
                  />
                  {errors.date && (
                    <p className="text-red-500 text-sm mt-1">{errors.date.message}</p>
                  )}
                </div>
                
                <div>
                  <label className="form-label">Preferred Time *</label>
                  <select
                    {...register('time', { required: 'Time is required' })}
                    className="form-input w-full"
                    disabled={!selectedDate}
                  >
                    <option value="">Select time</option>
                    {timeSlots.map(slot => (
                      <option key={slot} value={slot}>{slot}</option>
                    ))}
                  </select>
                  {errors.time && (
                    <p className="text-red-500 text-sm mt-1">{errors.time.message}</p>
                  )}
                </div>
                
                <div className="md:col-span-2">
                  <label className="form-label">Additional Message</label>
                  <textarea
                    {...register('message')}
                    className="form-input w-full h-32 resize-none"
                    placeholder="Tell us more about your visa needs..."
                  />
                </div>
              </div>
              
              <input type="hidden" {...register('type')} value={selectedType} />
              
              <div className="mt-6">
                <ConversionButton
                  type="submit"
                  conversionName="appointment_submit"
                  conversionValue={75}
                  location="appointment_form"
                  className="btn btn-primary w-full"
                >
                  Book Appointment
                </ConversionButton>
              </div>
            </form>

            {/* Important Information */}
            <div className="mt-8 card bg-muted">
              <h3 className="font-semibold mb-4">Important Information</h3>
              <ul className="space-y-2 text-sm text-secondary">
                <li>• Appointments are subject to availability and confirmation</li>
                <li>• You will receive a confirmation email within 2 hours</li>
                <li>• For urgent matters, please call us directly at +90 212 123 4567</li>
                <li>• Free consultation for first-time clients (30 minutes)</li>
                <li>• Please arrive 10 minutes early for office appointments</li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}