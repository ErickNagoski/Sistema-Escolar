import { Box, Chip, Grid, Modal, Typography } from "@mui/material";
import GradesTable from "./GradesTable";
import { useEffect, useState } from "react";
import api from "@/services/api";
import useSWR from "swr";

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

    useEffect(() => {
        if (data) {
            setStudentSubjects(data)
        }
    }, [data])


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
            <Grid xs={12}>
                <Typography>Disciplinas do aluno</Typography>
                <Grid >
                    {studentSubjects.map((item, i) => <Chip key={item.id} label={item.name} variant={subjectFilter == item.name ? 'filled' : 'outlined'} onClick={() => setSubjectFilter(item.name)} />)}
                </Grid>
                <Typography>Notas</Typography>
                <Grid xs={12}>
                    <GradesTable matricula={matricula} filter={subjectFilter} />
                </Grid>
            </Grid>
        </Box>
    </Modal>)
}