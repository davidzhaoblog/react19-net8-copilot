import { useMutation } from '@tanstack/react-query';
import axios from 'axios';

export const useLogin = () => {
    return useMutation<{ email: string; password: string }, Error, { email: string; password: string }>(async (credentials: { email: string; password: string }) => {
        const { data } = await axios.post<{ email: string; password: string }>('/auth/login', credentials);
        return data;
    });
};

export const useLogout = () => {
    return useMutation({
        mutationFn: async () => {
            await axios.post('/auth/logout');
        },
    });
};

export const useRefreshToken = () => {
    return useMutation({
        mutationFn: async (refreshToken: string) => {
            const { data } = await axios.post('/auth/refresh', { refreshToken });
            return data;
        },
    });
};