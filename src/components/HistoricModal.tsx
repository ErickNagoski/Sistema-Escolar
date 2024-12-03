import { Box, Button, Grid, Modal, Typography } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import api from "@/services/api";
import useSWR from "swr";
import { Close } from "@mui/icons-material";
import { useAuth } from "@/hooks/useAuthMe";
import { useReactToPrint } from 'react-to-print';
import { StudentProps } from "./StudentsTable";
import { format } from "date-fns";

interface GradesModalProps {
    onClose: () => void,
    matricula: string
}

type HistoryProps = {
    grade: string;
    dt_grade: string;
    subject: string;
    teacher: string;
}

export function HistoricModal({ onClose, matricula }: GradesModalProps) {
    const { authData } = useAuth();
    const Ref = useRef<HTMLDivElement | null>(null);

    const [history, setHistory] = useState<HistoryProps[]>([]);
    const [student, setStudent] = useState<StudentProps>();

    async function getData<T>(key: string): Promise<T[]> {
        const response = await api.get(key, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${authData?.token}`
            }
        });

        if (response.data) {
            return response.data;
        }

        return [];
    }

    const { data } = useSWR(`/grades/student/${matricula}/history`, getData<HistoryProps>, { revalidateOnFocus: false, revalidateOnReconnect: false });

    useEffect(() => {
        if (data) {
            setHistory(data);
        }
    }, [data]);

    const { data: studentSwr } = useSWR(`/alunos/${matricula}`, getData<StudentProps>, { revalidateOnFocus: false, revalidateOnReconnect: false });
    useEffect(() => {
        if (studentSwr && studentSwr.length > 0) {
            setStudent(studentSwr[0]);
        }
    }, [studentSwr]);

    const handlePrint = useReactToPrint({
        pageStyle: `
            @page { size: A4; margin: 20mm; }
            body { font-family: Arial, sans-serif; font-size: 12px; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #f4f4f4; font-weight: bold; }
            .header { text-align: center; margin-bottom: 20px; }
            .footer { text-align: center; margin-top: 20px; }
        `,
        contentRef: Ref
    });

    return (
        <Modal
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
                borderRadius: 2,
                overflowY: 'auto',
                maxHeight: '90vh'
            }}>
                <Grid container rowSpacing={2}>
                    <Grid item xs={12} container justifyContent="flex-end">
                        <Button onClick={onClose} color="error"><Close /></Button>
                    </Grid>

                    <Grid item xs={12}>
                        <Button variant="contained" color="primary" onClick={() => handlePrint()}>Imprimir</Button>
                    </Grid>

                    <Grid item xs={12}>
                        <div ref={Ref} style={{
                            padding: '20px',
                            backgroundColor: '#fff',
                            color: '#000',
                            fontSize: '12px',
                            lineHeight: '1.6',
                            fontFamily: 'Arial, sans-serif',
                            boxShadow: '0 0 10px rgba(0,0,0,0.1)',
                            borderRadius: '5px',
                        }}>
                            <div className="header">
                                <Typography variant="h6">Histórico Escolar</Typography>
                                <Typography variant="body1">Aluno: {student?.name}</Typography>
                                <Typography variant="body1">Matrícula: {student?.matricula}</Typography>
                                {student?.created_at && (<Typography variant="body1">Data de Matrícula: {format(student?.created_at as string, 'dd/MM/yyyy')}</Typography>
                                )}                            </div>
                            <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
                                <thead>
                                    <tr>
                                        <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left' }}>Disciplina</th>
                                        <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left' }}>Professor</th>
                                        <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left' }}>Nota</th>
                                        <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left' }}>Data</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {history.map((item, index) => (
                                        <tr key={index}>
                                            <td style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left' }}>{item.subject}</td>
                                            <td style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left' }}>{item.teacher}</td>
                                            <td style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left' }}>{item.grade}</td>
                                            <td style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left' }}>{item.dt_grade ? format(new Date(item.dt_grade), 'dd/MM/yyyy') : ''}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            <div className="footer">
                                <Typography variant="body2">Gerado em: {format(new Date(), 'dd/MM/yyyy')}</Typography>
                            </div>
                        </div>
                    </Grid>
                </Grid>
            </Box>
        </Modal>
    );
}
