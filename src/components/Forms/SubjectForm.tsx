import { useAuth } from '@/hooks/useAuthMe';
import api from '@/services/api';
import { Typography, Grid, TextField, MenuItem, Button } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import useSWR from 'swr';
type TeacherProps = {
  id: number,
  name: string,
}

const SubjectForm = () => {
  const { authData } = useAuth();

  const [teachers, setTeachers] = useState<TeacherProps[]>([]);

  async function getData<T>(key: string): Promise<T[]> {
    const response = await api.get(key, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${authData?.token}`

      }
    })

    if (response.data) {
      return response.data
    }

    return []
  }

  const { data } = useSWR(teachers.length < 1 ? `/teachers` : null, getData<TeacherProps>, { revalidateOnFocus: false, revalidateOnReconnect: false });

  useEffect(() => {
    if (data) {
      setTeachers(data)
    }
  }, [data])

  const { control, handleSubmit, reset } = useForm({
    defaultValues: {
      name: '',
      teacher: ''
    },
  });

  const onSubmit = (data: any) => {
    api.post('/disciplinas', data).then(() => {
      reset()
    })
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Typography variant="h5" gutterBottom>
        Cadastro de Disciplina
      </Typography>
      <Grid container spacing={2}>
        {/* Nome */}
        <Grid item xs={12} sm={6}>
          <Controller
            name="name"
            control={control}
            render={({ field }) => (
              <TextField {...field} label="Nome Disciplina" fullWidth />
            )}
          />
        </Grid>

        {/* Situação */}
        <Grid item xs={12} sm={6}>
          <Controller
            name="teacher"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Professor"
                fullWidth
                select
              >
                <MenuItem value="1">Professor A</MenuItem>
                <MenuItem value="2">Professor B</MenuItem>
                <MenuItem value="3">Professor C</MenuItem>
                <MenuItem value="4">Professor D</MenuItem>
              </TextField>
            )}
          />
        </Grid>
      </Grid>

      {/* Botão de Submit */}
      <Grid item xs={12} style={{ marginTop: '16px' }}>
        <Button type="submit" variant="contained" color="primary">
          Salvar
        </Button>
      </Grid>
    </form>
  );
};

export default SubjectForm;
