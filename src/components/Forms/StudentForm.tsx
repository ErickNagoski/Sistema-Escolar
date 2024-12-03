import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import {
    TextField,
    Button,
    MenuItem,
    Grid,
    Typography,
} from '@mui/material';
import api from '@/services/api';
import { useAuth } from '@/hooks/useAuthMe';

const cursos = [
    { id: 1, nome: 'Engenharia de Software' },
    { id: 2, nome: 'Administração' },
    { id: 3, nome: 'Direito' },
    { id: 4, nome: 'Medicina' },
];

const StudentForm = ({ onClose }: { onClose: () => void }) => {
    const { authData } = useAuth();

    const { control, handleSubmit } = useForm({
        defaultValues: {
            nome: '',
            data_nascimento: '',
            cpf: '',
            email: '',
            telefone: '',
            endereco: '',
            matricula: '',
            data_matricula: '',
            situacao: '',
            curso_id: '',
        },
    });

    const onSubmit = (data: any) => {
        api.post('/alunos', data, {
            headers: {
                Authorization: `Bearer ${authData?.token}`
            }
        }).then(() => { onClose })
    };


    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <Typography variant="h4" gutterBottom>
                Cadastro de Aluno
            </Typography>
            <Grid container spacing={2}>
                {/* Nome */}
                <Grid item xs={12} sm={6}>
                    <Controller
                        name="nome"
                        control={control}
                        render={({ field }) => (
                            <TextField {...field} label="Nome Completo" fullWidth />
                        )}
                    />
                </Grid>

                {/* Data de Nascimento */}
                <Grid item xs={12} sm={6}>
                    <Controller
                        name="data_nascimento"
                        control={control}
                        render={({ field }) => (
                            <TextField
                                {...field}
                                label="Data de Nascimento"
                                type="date"
                                InputLabelProps={{ shrink: true }}
                                fullWidth
                            />
                        )}
                    />
                </Grid>

                {/* CPF */}
                <Grid item xs={12} sm={6}>
                    <Controller
                        name="cpf"
                        control={control}
                        render={({ field }) => (
                            <TextField {...field} label="CPF" fullWidth />
                        )}
                    />
                </Grid>

                {/* Email */}
                <Grid item xs={12} sm={6}>
                    <Controller
                        name="email"
                        control={control}
                        render={({ field }) => (
                            <TextField {...field} label="E-mail" type="email" fullWidth />
                        )}
                    />
                </Grid>

                {/* Telefone */}
                <Grid item xs={12} sm={6}>
                    <Controller
                        name="telefone"
                        control={control}
                        render={({ field }) => (
                            <TextField {...field} label="Telefone" fullWidth />
                        )}
                    />
                </Grid>

                {/* Endereço */}
                <Grid item xs={12}>
                    <Controller
                        name="endereco"
                        control={control}
                        render={({ field }) => (
                            <TextField {...field} label="Endereço" fullWidth />
                        )}
                    />
                </Grid>

                {/* Matrícula */}
                <Grid item xs={12} sm={6}>
                    <Controller
                        name="matricula"
                        control={control}
                        render={({ field }) => (
                            <TextField {...field} label="Matrícula" fullWidth />
                        )}
                    />
                </Grid>

                {/* Data de Matrícula */}
                <Grid item xs={12} sm={6}>
                    <Controller
                        name="data_matricula"
                        control={control}
                        render={({ field }) => (
                            <TextField
                                {...field}
                                label="Data de Matrícula"
                                type="date"
                                InputLabelProps={{ shrink: true }}
                                fullWidth
                            />
                        )}
                    />
                </Grid>

                {/* Situação */}
                <Grid item xs={12} sm={6}>
                    <Controller
                        name="situacao"
                        control={control}
                        render={({ field }) => (
                            <TextField
                                {...field}
                                label="Situação"
                                fullWidth
                                select
                            >
                                <MenuItem value="Ativo">Ativo</MenuItem>
                                <MenuItem value="Inativo">Inativo</MenuItem>
                                <MenuItem value="Transferido">Transferido</MenuItem>
                                <MenuItem value="Evadido">Evadido</MenuItem>
                            </TextField>
                        )}
                    />
                </Grid>


                {/* Curso */}
                <Grid item xs={12} sm={6}>
                    <Controller
                        name="curso_id"
                        control={control}
                        render={({ field }) => (
                            <TextField {...field} label="Curso" select fullWidth>
                                {cursos.map((curso) => (
                                    <MenuItem key={curso.id} value={curso.id}>
                                        {curso.nome}
                                    </MenuItem>
                                ))}
                            </TextField>
                        )}
                    />
                </Grid>
            </Grid>

            {/* Botão de Submit */}
            <Grid item xs={12} style={{ marginTop: '16px' }}>
                <Button type="submit" variant="contained" color="success">
                    Salvar cadastro
                </Button>
            </Grid>
        </form>
    );
}

export default StudentForm;