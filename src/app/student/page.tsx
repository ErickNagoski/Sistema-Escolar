"use client"
import { SubjectProps } from "@/components/GradesModal";
import GradesTable from "@/components/GradesTable";
import { HistoricModal } from "@/components/HistoricModal";
import { StudentsTable } from "@/components/StudentsTable";
import SubjectsTable from "@/components/SubjectsTable";
import { useAuth } from "@/hooks/useAuthMe";
import api from "@/services/api";
import { Button, Grid, MenuItem, TextField, Typography } from "@mui/material";
import Image from "next/image";
import { redirect } from "next/navigation";
import { useEffect, useState } from "react";
import useSWR, { useSWRConfig } from "swr";

export default function StudentHome() {
  const { authData, clearAuthData } = useAuth();
  const [historyModal, setHistoryModal] = useState(false);
  const [subjectForm, setSubjectForm] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState<number>();

  const {mutate} = useSWRConfig();
  
  const handleSubjectForm = () => {
    setSubjectForm(!subjectForm)
  }

  const handleHistoryModal = () => {
    setHistoryModal(!historyModal)
  }

  async function getData<T>(key: string): Promise<T[]> {
    const response = await api.get(key, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${authData?.token}`
      }
    })

    return response.data;
  }

  const { data } = useSWR(`/disciplinas`, getData<SubjectProps>, { revalidateOnFocus: false, revalidateOnReconnect: false });

  function saveSubject() {
    api.post('/disciplinas/matricular', { studentId: authData?.user?.id, subjectId: selectedSubject }, {
      headers: {
        Authorization: `Bearer ${authData?.token}`
      }
    }).then(() => {
      setSubjectForm(false);
      mutate(`/disciplinas/aluno/${authData?.user?.matricula}`)
    })
  }

  return (
    <Grid container xs={12} sx={{ backgroundColor: '#f1f1f1' }} >
      <Grid columns={12} container item justifyContent='space-between' sx={{ backgroundColor: "#f4f5f6" }} padding={2}>
        <Grid xs={2}>
          <Image
            //  className={styles.logo}
            src="/logo.png"
            alt="Next.js logo"
            width={40}
            height={38}
            priority
          />
        </Grid>
        <Grid item xs={2}>
          <Button variant="contained" color="error" onClick={() => {
            clearAuthData();
            redirect('/')}}>Sair</Button>
        </Grid>
      </Grid>
      <Grid xs={12} container item padding={2}>
        <Grid xs={12} display='flex' spacing={2}>
          <Grid item xs={4}>
            <Typography>Olá {authData?.user?.name}</Typography>
          </Grid>
          <Grid item xs={3}>
            <Typography>Matrícula:{authData?.user?.matricula}</Typography>
          </Grid>
          <Grid item xs={3}>
            <Button size='small' sx={{ alignSelf: "flex-start" }} variant="outlined" onClick={handleHistoryModal}>Gerar histórico</Button>
          </Grid>
        </Grid>
        <Grid item xs={6}>
          <Typography variant="h5" textAlign='center'>Notas</Typography>
          <GradesTable matricula={authData?.user?.matricula as string} filter="" role={'student'} />
        </Grid>
        <Grid item xs={6}>
          <Typography variant="h5" textAlign='center'>Disciplinas</Typography>

          {subjectForm ? (
            <Grid item xs={12} sx={{ justifyContent: "space-between", display: 'flex', padding: '10px' }}>
              {data && (<TextField
                label="Disciplina"
                select
                onChange={(item) => setSelectedSubject(+item.target.value)}
                sx={{ width: "50%" }}
                size="small"
              >
                {data.map((item) => (
                  <MenuItem key={item.id} value={item.id}>
                    {item.name}
                  </MenuItem>
                ))}
              </TextField>
              )}
              <Button variant="text" color='error' onClick={handleSubjectForm}>cancelar</Button>
              <Button variant="outlined" onClick={saveSubject}>Salvar</Button>
            </Grid>
          ) : (
            <Grid item xs={12} sx={{ justifyContent: "space-between", display: 'flex', padding: '10px' }}>
              <Button variant="outlined" onClick={handleSubjectForm} >Matricular nova disciplina</Button>
            </Grid>
          )}
          <SubjectsTable matricula={authData?.user?.matricula as string} />
        </Grid>
      </Grid>
      {
    historyModal && (<HistoricModal matricula={authData?.user?.matricula as string} onClose={handleHistoryModal} />
    )
  }    </Grid >
  )
}