import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { Avatar, Button, Card, CardActions, CardContent, CardHeader, Checkbox, Container, FilledInput, FormControl, FormControlLabel, FormHelperText, IconButton, InputAdornment, InputLabel, Link, Typography } from '@mui/material';
import { Stack } from '@mui/system';
import { AccountCircle, Visibility, VisibilityOff } from '@mui/icons-material';

import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

import { useGoogleCallbackMutation, useLoginMutation } from '@/store/slices/authApi';
import { useTranslation } from 'react-i18next';
import { useGoogleLogin } from '@react-oauth/google'; // Import GoogleLogin component

interface ILogInFormProps {
    email: string;
    password: string;
    rememberMe?: boolean | undefined;
    from?: string | undefined;
}

const logInFormInitValue = {
    email: '',
    password: ''
} as unknown as ILogInFormProps;

const formValidations = z.object({
    email: z.string()
        .nonempty({ message: 'EmailRequired' })
        .email({ message: 'EmailFormatError' }),
    password: z.string()
        .nonempty({ message: 'PasswordRequired' })
        .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/, { message: 'PasswordPatternError' })
});

const Login: React.FC = () => {
    const navigate = useNavigate();
    const { t } = useTranslation();
    
    const [googleCallback, { }] = useGoogleCallbackMutation();

    const [login, { isLoading }] = useLoginMutation();
    const { register, handleSubmit, setValue, formState: { isValid, errors } } = useForm<ILogInFormProps>({
        mode: 'onChange',
        reValidateMode: 'onChange',
        defaultValues: logInFormInitValue,
        resolver: zodResolver(formValidations)
    });

    const onSubmit = handleSubmit(async (data: ILogInFormProps) => {
        try {
            const response = await login(data).unwrap();
            console.log('Login successful:', response);
            navigate('/');
        } catch (error) {
            console.error('Login failed:', error);
        } finally {
            setValue('password', '');
        }
    });

    const [showPassword, setShowPassword] = useState(false);
    const handleClickShowPassword = () => setShowPassword((show) => !show);
    const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
    };

    const onLoginAsGoogleClicked = useGoogleLogin({
        onSuccess: (response) => {
            googleCallback(response)
                .unwrap()
                .then((result) => {
                    console.log('Google Login successful:', result);
                    navigate('/');
                })
                .catch((error) => {
                    console.error('Google Login failed:', error);
                });
            console.log('Google Login successful:', response);
            navigate('/');
        },
        onError: (error) => console.log('Login Failed:', error)
    });

    return (
        <Container component='main' maxWidth='xs'>
            <Card component="form" noValidate onSubmit={onSubmit}>
                <CardHeader
                    title={
                        <Typography component='h1' variant='h4'>
                            {t('LogIn')}
                        </Typography>
                    }
                    avatar={
                        <Avatar>
                            <AccountCircle style={{ fontSize: 45 }} />
                        </Avatar>
                    }
                />
                <CardContent>
                    <FormControl fullWidth >
                        <InputLabel htmlFor="email">{t("Email")}</InputLabel>
                        <FilledInput
                            required
                            id="email"
                            type='email'
                            {...register("email")}
                            autoComplete='email'
                            error={!!errors.email}
                            fullWidth
                            autoFocus
                            disabled={isLoading}
                        />
                        {!!errors.email?.message && <FormHelperText>
                            {t(errors.email.message)}
                        </FormHelperText>}
                    </FormControl>
                </CardContent>

                <CardContent>
                    <FormControl fullWidth >
                        <InputLabel htmlFor="password">{t("Password")}</InputLabel>
                        <FilledInput
                            required
                            type={showPassword ? 'text' : 'password'}
                            {...register("password")}
                            error={!!errors.password}
                            fullWidth
                            disabled={isLoading}
                            endAdornment={
                                <InputAdornment position="end">
                                    <IconButton
                                        aria-label="toggle password visibility"
                                        onClick={handleClickShowPassword}
                                        onMouseDown={handleMouseDownPassword}
                                        edge="end"
                                    >
                                        {showPassword ? <VisibilityOff /> : <Visibility />}
                                    </IconButton>
                                </InputAdornment>
                            }
                        />
                        {!!errors.password?.message && <FormHelperText>
                            {t(errors.password.message)}
                        </FormHelperText>}
                    </FormControl>
                </CardContent>
                <CardActions disableSpacing>
                    <Stack direction='row' justifyContent="space-between" alignItems="center" spacing={2} sx={{ width: '100%' }} >
                        <FormControlLabel
                            label={
                                <Typography component='span' variant='caption'>
                                    {t('RememberMe')}
                                </Typography>
                            }
                            {...register("rememberMe")}
                            control={
                                <Checkbox />
                            }
                        />
                        <Link href='/forgotyourpassword' variant='caption'>
                            {t('ForgotYourPassword')}
                        </Link>
                    </Stack>
                </CardActions>
                <CardActions disableSpacing>
                    <Button
                        type='submit'
                        fullWidth
                        variant='contained'
                        disabled={!isValid || isLoading}>
                        {t('LogIn')}
                    </Button>
                </CardActions>
                <CardActions disableSpacing>
                    <Button
                        color="secondary"
                        onClick={() => onLoginAsGoogleClicked()}
                        fullWidth
                        variant='outlined'>
                        {t('Login As Google')}
                    </Button>
                </CardActions>
                <CardActions disableSpacing>
                    <Button
                        color="secondary"
                        href='/register'
                        fullWidth
                        variant='outlined'>
                        {t('Register')}
                    </Button>
                </CardActions>
            </Card >
        </Container>
    );
};

export default Login;