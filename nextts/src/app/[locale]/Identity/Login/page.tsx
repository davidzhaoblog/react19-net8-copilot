'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
    Box,
    Typography,
    TextField,
    Button,
    Paper,
    Checkbox,
    FormControlLabel,
    Link as MuiLink,
    Alert,
    CircularProgress
} from '@mui/material';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';

// Define validation schema
const loginSchema = z.object({
    email: z.string()
        .email('Please enter a valid email address'),
    password: z.string()
        .min(6, 'Password must be at least 6 characters'),
    rememberMe: z.boolean().optional()
});

type LoginFormInputs = z.infer<typeof loginSchema>;

export default function LoginPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const returnUrl = searchParams.get('returnUrl') || '/';
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { login, isAuthenticated } = useAuth();

    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm<LoginFormInputs>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: '',
            password: '',
            rememberMe: false
        }
    });

    // Redirect if already authenticated
    if (isAuthenticated) {
        router.push(returnUrl);
    }

    const onSubmit: SubmitHandler<LoginFormInputs> = async (data) => {
        setIsSubmitting(true);
        setError(null);

        try {
            const result = await login(data.email, data.password, data.rememberMe || false);

            if (result.success) {
                router.push(returnUrl);
            } else {
                setError(result.error || 'Invalid email or password.');
            }
        } catch (err) {
            setError('An unexpected error occurred. Please try again.');
            console.error('Login error:', err);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Box className="flex justify-center items-start min-h-screen py-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
            <Paper elevation={3} className="p-8 max-w-md w-full">
                <Box className="mb-6 text-center">
                    <Typography variant="h4" component="h1" className="font-bold">
                        Sign in to your account
                    </Typography>
                    <Typography variant="body2" color="textSecondary" className="mt-2">
                        Or{' '}
                        <MuiLink href="/Identity/Register" component={Link} underline="hover" className="font-medium text-blue-600 hover:text-blue-500">
                            create a new account
                        </MuiLink>
                    </Typography>
                </Box>

                {error && (
                    <Alert severity="error" className="mb-4">
                        {error}
                    </Alert>
                )}

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

                    <Box>
                        <TextField
                            label="Password"
                            type="password"
                            fullWidth
                            autoComplete="current-password"
                            {...register('password')}
                            error={!!errors.password}
                            helperText={errors.password?.message}
                            disabled={isSubmitting}
                        />
                    </Box>

                    <Box className="flex items-center justify-between">
                        <FormControlLabel
                            control={
                                <Checkbox
                                    color="primary"
                                    {...register('rememberMe')}
                                    disabled={isSubmitting}
                                />
                            }
                            label="Remember me"
                        />
                        <MuiLink href="/Identity/ForgotPassword" component={Link} underline="hover" className="text-sm font-medium text-blue-600 hover:text-blue-500">
                            Forgot your password?
                        </MuiLink>
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
                        {isSubmitting ? <CircularProgress size={24} /> : 'Sign in'}
                    </Button>
                </form>

                <Box className="mt-6">
                    <Typography variant="body2" color="textSecondary" align="center">
                        Need help?{' '}
                        <MuiLink href="/Contact" underline="hover" className="font-medium text-blue-600 hover:text-blue-500">
                            Contact support
                        </MuiLink>
                    </Typography>
                </Box>
            </Paper>
        </Box>
    );
}