import React, { useEffect, useState } from 'react'
import { Avatar, Button, Card, CardActions, CardContent, CardHeader, Checkbox, Container, FilledInput, FormControl, FormControlLabel, FormHelperText, IconButton, InputAdornment, InputLabel, LinearProgress, Link, Typography } from '@mui/material';
import { Stack } from '@mui/system';
import { AccountCircle, Visibility, VisibilityOff } from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
// import "src/i18n"
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';

// 1. example code to get google user info
// 1.1. https://blog.logrocket.com/guide-adding-google-login-react-app/
// 2. example code of node.js webapi server side workflow
// 2.1. https://www.dhiwise.com/post/react-google-oauth-the-key-to-secure-and-quick-logins
// 3. example code of node.js webapi server side workflow
// 3.1. https://livefiredev.com/in-depth-guide-sign-in-with-google-in-a-react-js-application/

import { useGoogleLogin, GoogleLogin } from '@react-oauth/google';

import { RootState } from '@/store/CombinedReducers';
import { AppDispatch } from '@/store/Store';
import { ApiErrorMessage } from '@/types/ApiClient';

import { googleCallBack, login, setIsAuthenticated } from '@/slices/msIdentityFrameworkSlice';

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

const formValidations = Yup.object({
    email: Yup.string()
        .required('EmailRequired')
        .email('EmailFormatError'),
    password: Yup.string()
        .required('PasswordRequired')
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/, 'PasswordPatternError')
}).required();

const Login: React.FC = () => {
    const navigate = useNavigate();
    const { t } = useTranslation();
    const dispatch = useDispatch<AppDispatch>();
    
    const auth = useSelector((state: RootState) => state.auth);
    const [submitting, setSubmitting] = useState(false)
    const [waitingForEmailConfirmation, setWaitingForEmailConfirmation] = useState(false)
    const [apiErrorMessage, setApiErrorMessage] = useState<ApiErrorMessage | null>(null)

    // 1. Regular Identity Framework Login
    const { register, control, reset, getValues, setValue, handleSubmit, formState: { isValid, errors } } = useForm<ILogInFormProps>({
        mode: 'onChange',
        reValidateMode: 'onChange',
        defaultValues: logInFormInitValue,
        resolver: yupResolver(formValidations)
    });

    const onSubmit = handleSubmit((data: ILogInFormProps) => {
        const {email, password, rememberMe, from } = data;
        dispatch(login({email, password}));
        setValue('password', '');
    });

    const [showPassword, setShowPassword] = React.useState(false);
    const handleClickShowPassword = () => setShowPassword((show) => !show);
    const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
    };

    // 2. Google LogIn
    const onLoginAsGoogleClicked = useGoogleLogin({
        onSuccess: (response) => {
            console.log(response)
            dispatch(googleCallBack(response));
        },
        onError: (error) => console.log('Login Failed:', error)
    });

    useEffect(() => {
        dispatch(setIsAuthenticated(false));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // // if you want to change page title <html><head><title>...</title></head></html>
    // useEffect(() => {
    //     document.title = t("_APPLICATION_TITLE_") + " " + t("LogIn");
    // }, []);

    useEffect(() => {
        if (auth.isAuthenticated) {
            const queryParams = new URLSearchParams(window.location.search)
            const from = queryParams.get("from");
            navigate(from ?? '/');
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [auth.isAuthenticated]);

    if (!auth.isLoggingIn && !auth.isAuthenticated) {
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
                                disabled={submitting}
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
                                // id="password"
                                type={showPassword ? 'text' : 'password'}
                                // name='password'
                                {...register("password")}
                                error={!!errors.password}
                                fullWidth
                                disabled={submitting}
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
                            disabled={!isValid || submitting}>
                            {t('LogIn')}
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
                    <CardActions disableSpacing>
                        <Button
                            color="secondary"
                            onClick={() => onLoginAsGoogleClicked()}
                            fullWidth
                            variant='outlined'>
                            {t('Login As Google')}
                        </Button>
                    </CardActions>
                </Card >
            </Container>
        );
    }
    else {
        return (<LinearProgress />)
    }
}

export default Login;