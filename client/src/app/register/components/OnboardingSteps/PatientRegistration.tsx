"use client";
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select } from '@/components/ui/select';
import axiosInstance from '@/lib/axios';
import { setAuthCookies } from '@/lib/cookies';
import { useRouter } from 'next/navigation';
import { PatientRegistrationData, RegistrationResponse } from '@/types/auth';

const patientSchema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Password must contain at least one uppercase letter, one lowercase letter, and one number'),
  dateOfBirth: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format'),
  gender: z.enum(['male', 'female', 'other']),
  phoneNumber: z.string().regex(/^\+?[1-9]\d{9,14}$/, 'Invalid phone number'),
  address: z.string().min(10, 'Address must be at least 10 characters'),
});

interface Props {
  step: number;
  setStep: (step: number) => void;
}

export default function PatientRegistration({ step, setStep }: Props) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PatientRegistrationData>({
    resolver: zodResolver(patientSchema),
  });

  const onSubmit = async (data: PatientRegistrationData) => {
    try {
      setIsLoading(true);
      setError('');
      
      const response = await axiosInstance.post<RegistrationResponse>('/patients/register', data);
      
      if (response.data.success) {
        const { token, patientId } = response.data.data;
        setAuthCookies(token, patientId);
        router.push('/dashboard'); // Redirect to dashboard after successful registration
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {error && (
        <div className="p-4 bg-red-50 text-red-600 rounded-lg">
          {error}
        </div>
      )}

      {step === 1 && (
        <>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Input
                {...register('firstName')}
                placeholder="First Name"
                error={errors.firstName?.message}
              />
            </div>
            <div>
              <Input
                {...register('lastName')}
                placeholder="Last Name"
              />
              {errors.lastName && (
                <p className="text-red-500 text-sm mt-1">{errors.lastName.message}</p>
              )}
            </div>
          </div>
          <Input
            {...register('email')}
            type="email"
            placeholder="Email"
            error={errors.email?.message}
          />
          <Input
            {...register('password')}
            type="password"
            placeholder="Password"
            error={errors.password?.message}
          />
        </>
      )}

      {step === 2 && (
        <>
          <Input
            {...register('dateOfBirth')}
            type="date"
            placeholder="Date of Birth"
            error={errors.dateOfBirth?.message}
          />
          <Select
            {...register('gender')}
            error={errors.gender?.message}
          >
            <option value="">Select Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </Select>
        </>
      )}

      {step === 3 && (
        <>
          <Input
            {...register('phoneNumber')}
            placeholder="Phone Number"
            error={errors.phoneNumber?.message}
          />
          <textarea
            {...register('address')}
            placeholder="Address"
            className="w-full p-2 border rounded"
            rows={4}
          />
          {errors.address && (
            <p className="text-red-500 text-sm">{errors.address.message}</p>
          )}
        </>
      )}
    </form>
  );
}