"use client";
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Card, CardContent } from "@/components/ui/card";
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { UserIcon, Phone, MapPin, Heart, UserPlus } from "lucide-react";
import axiosInstance from '@/lib/axios';
import { setAuthCookies } from '@/lib/cookies';
import { useRouter } from 'next/navigation';
import { PatientRegistrationData, RegistrationResponse } from '@/types/auth';

const patientSchema = z.object({
  username: z.string().min(4, 'Username must be at least 4 characters'),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])/, 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'),
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string()
    .regex(/^\+?[1-9]\d{9,14}$/, 'Phone number must start with a "+" followed by 9 to 14 digits.'),
  dateOfBirth: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format'),
  gender: z.enum(['male', 'female', 'other']),
  address: z.object({
    street: z.string().min(5, 'Street address is required'),
    city: z.string().min(2, 'City is required'),
    state: z.string().min(2, 'State is required'),
    postalCode: z.string().min(4, 'Valid postal code is required'),
    country: z.string().min(2, 'Country is required')
  }),
  emergencyContact: z.object({
    name: z.string().min(2, 'Emergency contact name is required'),
    phone: z.string().regex(/^\+?[1-9]\d{9,14}$/, 'Invalid emergency contact phone number'),
    relationship: z.string().min(2, 'Relationship is required')
  }),
  bloodType: z.enum(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']),
  healthInsuranceId: z.string().min(8, 'Valid health insurance ID is required'),
  nationalId: z.string().min(8, 'Valid national ID is required')
});

type Props = {
  step: number;
  setStep: (step: number) => void;
  handleNext: () => void;
  handleBack: () => void;
};

export default function PatientRegistration({ step, setStep }: Props) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const {
    register,
    handleSubmit,
    trigger,
    formState: { errors },
    watch,
    setValue,
  } = useForm<PatientRegistrationData>({
    resolver: zodResolver(patientSchema),
    mode: 'onSubmit',
  });

  const validateStep1 = async () => {
    const result = await trigger([
      'username',
      'password',
      'firstName',
      'lastName',
      'email',
      'nationalId',
    ]);
    if (result) {
      setStep(2);
    }
  };

  const validateStep2 = async () => {
    const result = await trigger([
      'dateOfBirth',
      'gender',
      'bloodType',
      'healthInsuranceId',
    ]);
    if (result) {
      setStep(3);
    }
  };

  const onSubmit = async (data: PatientRegistrationData) => {
    try {
      setIsLoading(true);
      setError('');
      
      const formattedData = {
        ...data,
        phone: data.phone.startsWith('+') ? data.phone : `+${data.phone}`,
        emergencyContact: {
          ...data.emergencyContact,
          phone: data.emergencyContact.phone.startsWith('+') ? 
            data.emergencyContact.phone : 
            `+${data.emergencyContact.phone}`
        }
      };

      const response = await axiosInstance.post<RegistrationResponse>('/patient/register', formattedData);
      
      if (response.data.success) {
        const { token, patientId } = response.data.data;
        setAuthCookies(token, patientId);
        router.push('/patient/dashboard');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const Step1 = ({ register, errors, validateStep1 }: any) => (
    <div className="space-y-4">
      <div className="flex items-center gap-3 mb-6">
        <UserIcon className="h-6 w-6 text-blue-600" />
        <h2 className="text-xl font-semibold text-blue-800 dark:text-blue-300">Account Information</h2>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="username">Username</Label>
          <Input 
            {...register('username')}
            placeholder="Choose a username"
            className="border-blue-200 focus:border-blue-400"
          />
          {errors.username && (
            <p className="text-red-500 text-sm mt-1">{errors.username.message}</p>
          )}
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input 
            {...register('password')}
            type="password"
            placeholder="Create a password"
            className="border-blue-200 focus:border-blue-400"
          />
          {errors.password && (
            <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
          )}
        </div>
      </div>

      <div className="flex items-center gap-3 mt-8 mb-4">
        <UserPlus className="h-6 w-6 text-blue-600" />
        <h2 className="text-xl font-semibold text-blue-800 dark:text-blue-300">Personal Information</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="firstName">First Name</Label>
          <Input 
            {...register('firstName')}
            placeholder="Enter first name"
            className="border-blue-200 focus:border-blue-400"
          />
          {errors.firstName && (
            <p className="text-red-500 text-sm mt-1">{errors.firstName.message}</p>
          )}
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="lastName">Last Name</Label>
          <Input 
            {...register('lastName')}
            placeholder="Enter last name"
            className="border-blue-200 focus:border-blue-400"
          />
          {errors.lastName && (
            <p className="text-red-500 text-sm mt-1">{errors.lastName.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input 
            {...register('email')}
            type="email"
            placeholder="Enter email address"
            className="border-blue-200 focus:border-blue-400"
          />
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="nationalId">National ID</Label>
          <Input 
            {...register('nationalId')}
            placeholder="Enter national ID"
            className="border-blue-200 focus:border-blue-400"
          />
          {errors.nationalId && (
            <p className="text-red-500 text-sm mt-1">{errors.nationalId.message}</p>
          )}
        </div>
      </div>
      <div className="flex justify-end mt-6">
        <Button
          type="button"
          onClick={validateStep1}
          className="bg-blue-600 hover:bg-blue-700"
        >
          Next Step
        </Button>
      </div>
    </div>
  );

  const Step2 = ({ register, errors, validateStep2, setValue }: any) => (
    <div className="space-y-4">
      <div className="flex items-center gap-3 mb-6">
        <Heart className="h-6 w-6 text-blue-600" />
        <h2 className="text-xl font-semibold text-blue-800 dark:text-blue-300">Health Information</h2>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="dateOfBirth">Date of Birth</Label>
          <Input 
            {...register('dateOfBirth')}
            type="date"
            className="border-blue-200 focus:border-blue-400"
          />
          {errors.dateOfBirth && (
            <p className="text-red-500 text-sm mt-1">{errors.dateOfBirth.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="gender">Gender</Label>
          <Select onValueChange={(value) => setValue('gender', value as 'male' | 'female' | 'other')}>
            <SelectTrigger className="border-blue-200 bg-white dark:bg-gray-800">
              <SelectValue placeholder="Select gender" />
            </SelectTrigger>
            <SelectContent className="bg-white dark:bg-gray-800">
              <SelectItem value="male" className="hover:bg-blue-50 dark:hover:bg-blue-900/30">Male</SelectItem>
              <SelectItem value="female" className="hover:bg-blue-50 dark:hover:bg-blue-900/30">Female</SelectItem>
              <SelectItem value="other" className="hover:bg-blue-50 dark:hover:bg-blue-900/30">Other</SelectItem>
            </SelectContent>
          </Select>
          {errors.gender && (
            <p className="text-red-500 text-sm mt-1">{errors.gender.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="bloodType">Blood Type</Label>
          <Select onValueChange={(value) => setValue('bloodType', value as 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-')}>
            <SelectTrigger className="border-blue-200 bg-white dark:bg-gray-800">
              <SelectValue placeholder="Select blood type" />
            </SelectTrigger>
            <SelectContent className="bg-white dark:bg-gray-800">
              {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map((type) => (
                <SelectItem 
                  key={type} 
                  value={type}
                  className="hover:bg-blue-50 dark:hover:bg-blue-900/30"
                >
                  {type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.bloodType && (
            <p className="text-red-500 text-sm mt-1">{errors.bloodType.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="healthInsuranceId">Health Insurance ID</Label>
          <Input 
            {...register('healthInsuranceId')}
            placeholder="Enter health insurance ID"
            className="border-blue-200 focus:border-blue-400"
          />
          {errors.healthInsuranceId && (
            <p className="text-red-500 text-sm mt-1">{errors.healthInsuranceId.message}</p>
          )}
        </div>
      </div>
      <div className="flex justify-between mt-6">
        <Button
          type="button"
          onClick={() => setStep(1)}
          variant="outline"
          className="border-blue-600 text-blue-600"
        >
          Previous Step
        </Button>
        <Button
          type="button"
          onClick={validateStep2}
          className="bg-blue-600 hover:bg-blue-700"
        >
          Next Step
        </Button>
      </div>
    </div>
  );

  const Step3 = ({ register, errors, isLoading, onSubmit, setStep }: any) => (
    <div className="space-y-4">
      <div className="flex items-center gap-3 mb-6">
        <MapPin className="h-6 w-6 text-blue-600" />
        <h2 className="text-xl font-semibold text-blue-800 dark:text-blue-300">Contact Information</h2>
      </div>
      
      <div className="grid grid-cols-1 gap-4">
        <div className="space-y-2">
          <Label htmlFor="phone">Phone Number</Label>
          <Input 
            {...register('phone')}
            placeholder="Enter phone number"
            className="border-blue-200 focus:border-blue-400"
          />
          {errors.phone && (
            <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="address.street">Street Address</Label>
          <Input 
            {...register('address.street')}
            placeholder="Enter street address"
            className="border-blue-200 focus:border-blue-400"
          />
          {errors.address?.street && (
            <p className="text-red-500 text-sm mt-1">{errors.address.street.message}</p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="address.city">City</Label>
            <Input 
              {...register('address.city')}
              placeholder="Enter city"
              className="border-blue-200 focus:border-blue-400"
            />
            {errors.address?.city && (
              <p className="text-red-500 text-sm mt-1">{errors.address.city.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="address.state">State</Label>
            <Input 
              {...register('address.state')}
              placeholder="Enter state"
              className="border-blue-200 focus:border-blue-400"
            />
            {errors.address?.state && (
              <p className="text-red-500 text-sm mt-1">{errors.address.state.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="address.postalCode">Postal Code</Label>
            <Input 
              {...register('address.postalCode')}
              placeholder="Enter postal code"
              className="border-blue-200 focus:border-blue-400"
            />
            {errors.address?.postalCode && (
              <p className="text-red-500 text-sm mt-1">{errors.address.postalCode.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="address.country">Country</Label>
            <Input 
              {...register('address.country')}
              placeholder="Enter country"
              className="border-blue-200 focus:border-blue-400"
            />
            {errors.address?.country && (
              <p className="text-red-500 text-sm mt-1">{errors.address.country.message}</p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3 mt-8 mb-4">
          <Phone className="h-6 w-6 text-blue-600" />
          <h2 className="text-xl font-semibold text-blue-800 dark:text-blue-300">Emergency Contact</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="emergencyContact.name">Contact Name</Label>
            <Input 
              {...register('emergencyContact.name')}
              placeholder="Enter emergency contact name"
              className="border-blue-200 focus:border-blue-400"
            />
            {errors.emergencyContact?.name && (
              <p className="text-red-500 text-sm mt-1">{errors.emergencyContact.name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="emergencyContact.phone">Contact Phone</Label>
            <Input 
              {...register('emergencyContact.phone')}
              placeholder="Enter emergency contact phone"
              className="border-blue-200 focus:border-blue-400"
            />
            {errors.emergencyContact?.phone && (
              <p className="text-red-500 text-sm mt-1">{errors.emergencyContact.phone.message}</p>
            )}
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="emergencyContact.relationship">Relationship</Label>
            <Input 
              {...register('emergencyContact.relationship')}
              placeholder="Enter relationship to emergency contact"
              className="border-blue-200 focus:border-blue-400"
            />
            {errors.emergencyContact?.relationship && (
              <p className="text-red-500 text-sm mt-1">{errors.emergencyContact.relationship.message}</p>
            )}
          </div>
        </div>
      </div>
      <div className="flex justify-between mt-6">
        <Button
          type="button"
          onClick={() => setStep(2)}
          variant="outline"
          className="border-blue-600 text-blue-600"
        >
          Previous Step
        </Button>
        <Button
          type="submit"
          disabled={isLoading}
          className="bg-blue-600 hover:bg-blue-700"
        >
          {isLoading ? 'Registering...' : 'Complete Registration'}
        </Button>
      </div>
    </div>
  );

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Card className="border-blue-100 dark:border-blue-900">
        <CardContent className="p-6">
          {error && (
            <div className="p-4 mb-6 bg-red-50 text-red-600 rounded-lg">
              {error}
            </div>
          )}
          
          {step === 1 && <Step1 register={register} errors={errors} validateStep1={validateStep1} />}
          {step === 2 && <Step2 register={register} errors={errors} validateStep2={validateStep2} setValue={setValue} />}
          {step === 3 && <Step3 register={register} errors={errors} isLoading={isLoading} onSubmit={onSubmit} setStep={setStep} />}
        </CardContent>
      </Card>
    </form>
  );
}