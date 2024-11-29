"use client"

import React from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { TextField, Button, Typography, Box, Grid, Paper } from '@mui/material';
import api from '@/services/api';
import { AuthData, useAuth } from '@/hooks/useAuthMe';
import { redirect } from 'next/navigation';

interface LoginFormInputs {
  email: string;
  password: string;
}

const LoginPage = () => {
  const { setAuthData } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormInputs>();

  const onSubmit: SubmitHandler<LoginFormInputs> = (data) => {
    api.post<AuthData>(`/auth`, data).then((res) => {
      if (res.data) {
        setAuthData(res.data)
      }

      res.data.role == 'school' ? redirect(`/school`) : redirect(`/student`)

    })
  };

  return (
    <Grid container component="main" sx={{ height: '100vh' }}>
      <Grid
        item
        xs={false}
        sm={4}
        md={7}
        sx={{
          backgroundImage: 'url(/background.jpg)', // Substitua pela sua imagem
          backgroundRepeat: 'no-repeat',
          backgroundColor: (t) =>
            t.palette.mode === 'light' ? t.palette.grey[50] : t.palette.grey[900],
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />
      <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
        <Box
          sx={{
            my: 8,
            mx: 4,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Typography component="h1" variant="h5">
            Login
          </Typography>
          <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email"
              autoComplete="email"
              autoFocus
              {...register('email', {
                required: 'O email é obrigatório.',
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: 'Digite um email válido.',
                },
              })}
              error={!!errors.email}
              helperText={errors.email?.message}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              label="Senha"
              type="password"
              id="password"
              autoComplete="current-password"
              {...register('password', {
                required: 'A senha é obrigatória.',
                minLength: {
                  value: 6,
                  message: 'A senha deve ter pelo menos 6 caracteres.',
                },
              })}
              error={!!errors.password}
              helperText={errors.password?.message}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Entrar
            </Button>
          </Box>
        </Box>
      </Grid>
    </Grid>
  );
};

export default LoginPage;
