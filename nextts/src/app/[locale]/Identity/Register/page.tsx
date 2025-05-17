'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
    Box,
    Typography,
    TextField,
    Button,
    Paper,
    Grid,
    Link as MuiLink,
    Alert,
    CircularProgress,
    Checkbox,
    FormControlLabel
} from '@mui/material';
import Link from 'next/link';
import authService from '@/services/authService';

// Define validation schema
const registerSchema = z.object({
    email: z.string()
        .email('Please enter a valid email address'),
    userName: z.string()
        .min(3, 'Username must be at least 3 characters')
        .max(50, 'Username must be less than 50 characters'),
    firstName: z.string().optional(),
    lastName: z.string().optional(),
    password: z.string()
        .min(6, 'Password must be at least 6 characters')
        .max(100, 'Password must be less than 100 characters'),
    confirmPassword: z.string(),
    acceptTerms: z.boolean()
        .refine(val => val === true, {
            message: 'You must accept the terms and conditions',
        }),
}).refine(data => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
});

type RegisterFormInputs = z.infer<typeof registerSchema>;

export default function RegisterPage() {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm<RegisterFormInputs>({
        resolver: zodResolver(registerSchema),
        defaultValues: {
            email: '',
            userName: '',
            firstName: '',
            lastName: '',
            password: '',
            confirmPassword: '',
            acceptTerms: false
        }
    });

    const onSubmit: SubmitHandler<RegisterFormInputs> = async (data) => {
        setIsSubmitting(true);
        setError(null);
        setSuccess(false);

        try {
            // Check if email is available
            const emailCheck = await authService.checkEmailAvailable(data.email);
            if (!emailCheck.available) {
                setError('Email is already registered. Please use a different email address.');
                setIsSubmitting(false);
                return;
            }

            // Register user
            const result = await authService.register({
                email: data.email,
                userName: data.userName,
                firstName: data.firstName,
                lastName: data.lastName,
                password: data.password,
                confirmPassword: data.confirmPassword
            });

            if (result.success) {
                setSuccess(true);
                // Navigate to login page after a short delay
                setTimeout(() => {
                    router.push('/Identity/Login?registered=true');
                }, 3000);
            } else {
                setError(result.error || 'Registration failed. Please try again.');
            }
        } catch (err) {
            setError('An unexpected error occurred. Please try again.');
            console.error('Registration error:', err);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Box className="flex justify-center items-center min-h-screen py-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
            <Paper elevation={3} className="p-8 max-w-xl w-full">
                <Box className="mb-6 text-center">
                    <Typography variant="h4" component="h1" className="font-bold">
                        Create a new account
                    </Typography>
                    <Typography variant="body2" color="textSecondary" className="mt-2">
                        Or{' '}
                        <Link href="/Identity/Login" passHref>
                            <MuiLink underline="hover" className="font-medium text-blue-600 hover:text-blue-500">
                                sign in to your existing account
                            </MuiLink>
                        </Link>
                    </Typography>
                </Box>

                {error && (
                    <Alert severity="error" className="mb-4">
                        {error}
                    </Alert>
                )}

                {success && (
                    <Alert severity="success" className="mb-4">
                        Registration successful! You will be redirected to the login page shortly.
                    </Alert>
                )}

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <Grid container spacing={2}>
                        <Grid size={12}>
                            <TextField
                                label="Email address"
                                type="email"
                                fullWidth
                                autoComplete="email"
                                {...register('email')}
                                error={!!errors.email}
                                helperText={errors.email?.message}
                                disabled={isSubmitting || success}
                            />
                        </Grid>

                        <Grid size={12}>
                            <TextField
                                label="Username"
                                fullWidth
                                autoComplete="username"
                                {...register('userName')}
                                error={!!errors.userName}
                                helperText={errors.userName?.message}
                                disabled={isSubmitting || success}
                            />
                        </Grid>

                        <Grid size={12}>
                            <TextField
                                label="First name (optional)"
                                fullWidth
                                autoComplete="given-name"
                                {...register('firstName')}
                                error={!!errors.firstName}
                                helperText={errors.firstName?.message}
                                disabled={isSubmitting || success}
                            />
                        </Grid>

                        <Grid size={12}>
                            <TextField
                                label="Last name (optional)"
                                fullWidth
                                autoComplete="family-name"
                                {...register('lastName')}
                                error={!!errors.lastName}
                                helperText={errors.lastName?.message}
                                disabled={isSubmitting || success}
                            />
                        </Grid>

                        <Grid size={12}>
                            <TextField
                                label="Password"
                                type="password"
                                fullWidth
                                autoComplete="new-password"
                                {...register('password')}
                                error={!!errors.password}
                                helperText={errors.password?.message}
                                disabled={isSubmitting || success}
                            />
                        </Grid>

                        <Grid size={12}>
                            <TextField
                                label="Confirm password"
                                type="password"
                                fullWidth
                                autoComplete="new-password"
                                {...register('confirmPassword')}
                                error={!!errors.confirmPassword}
                                helperText={errors.confirmPassword?.message}
                                disabled={isSubmitting || success}
                            />
                        </Grid>

                        <Grid size={12}>
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        color="primary"
                                        {...register('acceptTerms')}
                                        disabled={isSubmitting || success}
                                    />
                                }
                                label={
                                    <Typography variant="body2">
                                        I agree to the{' '}
                                        <Link href="/terms" passHref>
                                            <MuiLink underline="hover" className="text-blue-600 hover:text-blue-500">
                                                Terms of Service
                                            </MuiLink>
                                        </Link>
                                        {' '}and{' '}
                                        <Link href="/privacy" passHref>
                                            <MuiLink underline="hover" className="text-blue-600 hover:text-blue-500">
                                                Privacy Policy
                                            </MuiLink>
                                        </Link>
                                    </Typography>
                                }
                            />
                            {errors.acceptTerms && (
                                <Typography color="error" variant="caption" className="mt-1 ml-8 block">
                                    {errors.acceptTerms.message}
                                </Typography>
                            )}
                        </Grid>
                    </Grid>

                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        color="primary"
                        size="large"
                        disabled={isSubmitting || success}
                        className="py-3 mt-6"
                    >
                        {isSubmitting ? <CircularProgress size={24} /> : 'Register'}
                    </Button>
                </form>
            </Paper>
        </Box>
    );
}