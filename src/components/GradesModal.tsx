import { Box, Button, Chip, Grid, MenuItem, Modal, TextField, Typography } from "@mui/material";
import GradesTable from "./GradesTable";
import { useEffect, useState } from "react";
import api from "@/services/api";
import useSWR, { useSWRConfig } from "swr";
import { Controller, useForm } from "react-hook-form";
import { StudentProps } from "./StudentsTable";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Close } from "@mui/icons-material";

interface GradesModalProps {
    onClose: () => void,
    matricula: string
}

type SubjectProps = {
    id: number,
    name: string,
    teacher: string
}

export function GradesModal({ onClose, matricula }: GradesModalProps) {
    const [studentSubjects, setStudentSubjects] = useState<SubjectProps[]>([]);
    const [subjectFilter, setSubjectFilter] = useState<string>('');
    const [student, setStudent] = useState<StudentProps>();

    const { mutate } = useSWRConfig();

    async function getData<T>(key: string): Promise<T[]> {
        const response = await api.get(key, {
            headers: {
                'Content-Type': 'application/json',
            }
        })

        if (response.data) {
            return response.data
        }

        return []
    }

    const { data } = useSWR(studentSubjects.length < 1 ? `/disciplinas/aluno/${matricula}` : null, getData<SubjectProps>, { revalidateOnFocus: false, revalidateOnReconnect: false });
    const { data: studentSwr } = useSWR(`/alunos/${matricula}`, getData<StudentProps>, { revalidateOnFocus: false, revalidateOnReconnect: false });

    useEffect(() => {
        if (studentSwr && studentSwr.length > 0) {
            setStudent(studentSwr[0])
        }
    }, [studentSwr])

    useEffect(() => {
        if (data) {
            setStudentSubjects(data)
        }
    }, [data])

    const handleFilter = (subject: string) => {
        if (subjectFilter == subject) {
            setSubjectFilter('');
        } else {
            setSubjectFilter(subject)
        }
    }
    const schema = yup.object({
        grade: yup
            .number()
            .required("Nota é obrigatória")
            .min(0, "Nota deve ser no mínimo 0")
            .max(10, "Nota deve ser no máximo 10"),
        subjectId: yup
            .number()
            .required("Disciplina é obrigatória")
            .typeError("Disciplina é obrigatória"),
    });

    const { control, handleSubmit, formState: { errors } } = useForm({
        resolver: yupResolver(schema),
        defaultValues: {
            grade: 0,
            subjectId: 0
        },
    });

    const onSubmit = (data: any) => {
        if (student) {
            api.post('/grades', { ...data, studentId: student.id }).then(() => mutate(`/grades/student/${matricula}`))
        } else {
            window.alert('Estudante não identificado!')
        }
    };


    return (<Modal
        open={true}
        onClose={onClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
    >
        <Box sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 800,
            bgcolor: 'background.paper',
            border: '2px solid #000',
            boxShadow: 24,
            p: 4,
        }}>
            <Grid xs={12} container rowSpacing={2}>
                <Grid item container xs={12}>
                    <Grid item xs={7}>
                        <Typography>Aluno: {student?.name}</Typography>
                        <Typography>Matrícula: {student?.matricula}</Typography>
                    </Grid>
                    <Grid item xs={5} alignItems='flex-end' direction='column' display='flex'>
                        <Button onClick={onClose} color='error'><Close /></Button>
                        <Button size='small' sx={{alignSelf:"flex-start"}}  variant="outlined">Gerar histórico</Button>
                    </Grid>
                </Grid>
                <Grid item>
                    <Typography fontWeight='600'>Disciplinas do aluno</Typography>
                </Grid>
                <Grid item xs={12} sx={{ borderBottom: "1px solid #f1f1f1" }} paddingY={1}>
                    {studentSubjects.map((item, i) =>
                        <Chip
                            key={item.id}
                            label={item.name}
                            variant={subjectFilter == item.name ? 'filled' : 'outlined'}
                            onClick={() => handleFilter(item.name)}
                            sx={{ marginRight: 1 }} />)}
                </Grid>
                <Grid item container rowSpacing={2} xs={12} >
                    <Grid item xs={12}>
                        <Typography fontWeight='600'>Cadastrar nota</Typography>
                    </Grid>
                    <Grid xs={12} item >
                        <form onSubmit={handleSubmit(onSubmit)}>
                            <Grid
                                xs={12}
                                container
                                item
                                columnSpacing={1}
                                display="flex"
                                alignItems="center"
                            >
                                <Grid item xs={4}>
                                    <Controller
                                        name="grade"
                                        control={control}
                                        render={({ field }) => (
                                            <TextField
                                                {...field}
                                                type="number"
                                                label="Nota"
                                                fullWidth
                                                size="small"
                                                error={!!errors.grade}
                                                helperText={errors.grade?.message}
                                            />
                                        )}
                                    />
                                </Grid>
                                <Grid item xs={6}>
                                    <Controller
                                        name="subjectId"
                                        control={control}
                                        render={({ field }) => (
                                            <TextField
                                                {...field}
                                                label="Disciplina"
                                                select
                                                fullWidth
                                                size="small"
                                                error={!!errors.subjectId}
                                                helperText={errors.subjectId?.message}
                                            >
                                                {studentSubjects.map((item) => (
                                                    <MenuItem key={item.id} value={item.id}>
                                                        {item.name}
                                                    </MenuItem>
                                                ))}
                                            </TextField>
                                        )}
                                    />
                                </Grid>
                                <Grid item xs={2}>
                                    <Button type="submit" variant="contained" color="success">
                                        Salvar
                                    </Button>
                                </Grid>
                            </Grid>
                        </form>
                    </Grid>
                </Grid>

                <Grid xs={12} item>
                    <Typography variant="h5" textAlign='center' fontWeight={600}>Notas</Typography>
                    <GradesTable matricula={matricula} filter={subjectFilter} />
                </Grid>
            </Grid>
        </Box>
    </Modal >)
}