'use client';

import { useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { 
  Box, 
  Typography, 
  TextField, 
  Button, 
  Paper,
  Link as MuiLink,
  Alert,
  CircularProgress
} from '@mui/material';
import Link from 'next/link';
import authService from '@/services/authService';

// Define validation schema
const forgotPasswordSchema = z.object({
  email: z.string()
    .email('Please enter a valid email address')
});

type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPasswordPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const { 
    register, 
    handleSubmit, 
    formState: { errors } 
  } = useForm<ForgotPasswordInput>({
    resolver: zodResolver(forgotPasswordSchema)
  });

  const onSubmit: SubmitHandler<ForgotPasswordInput> = async (data) => {
    setIsSubmitting(true);
    setError(null);
    setSuccess(false);

    try {
      const result = await authService.forgotPassword({ email: data.email });

      if (result.success) {
        setSuccess(true);
      } else {
        setError(result.error || 'Unable to process your request. Please try again.');
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
      console.error('Forgot password error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Box className="flex justify-center items-center min-h-screen py-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <Paper elevation={3} className="p-8 max-w-md w-full">
        <Box className="mb-6 text-center">
          <Typography variant="h4" component="h1" className="font-bold">
            Forgot your password?
          </Typography>
          <Typography variant="body2" color="textSecondary" className="mt-2">
            Enter your email address and we'll send you a link to reset your password.
          </Typography>
        </Box>

        {error && (
          <Alert severity="error" className="mb-4">
            {error}
          </Alert>
        )}

        {success ? (
          <Box>
            <Alert severity="success" className="mb-4">
              Please check your email for password reset instructions.
            </Alert>
            <Box className="mt-4 text-center">
              <Link href="/Identity/Login" passHref>
                <Button variant="outlined">
                  Return to login
                </Button>
              </Link>
            </Box>
          </Box>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <Box>
              <TextField
                label="Email address"
                type="email"
                fullWidth
                autoComplete="email"
                {...register('email')}
                error={!!errors.email}
                helperText={errors.email?.message}
                disabled={isSubmitting}
              />
            </Box>

            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              size="large"
              disabled={isSubmitting}
              className="py-3"
            >
              {isSubmitting ? <CircularProgress size={24} /> : 'Send reset link'}
            </Button>

            <Box className="mt-4 text-center">
              <Link href="/Identity/Login" passHref>
                <MuiLink underline="hover" className="text-sm font-medium text-blue-600 hover:text-blue-500">
                  Remember your password? Sign in
                </MuiLink>
              </Link>
            </Box>
          </form>
        )}
      </Paper>
    </Box>
  );
}