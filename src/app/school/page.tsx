"use client"

import StudentForm from "@/components/Forms/StudentForm";
import { StudentsTable } from "@/components/StudentsTable";
import { SubjectModal } from "@/components/SubjectsModal";
import SubjectsTable from "@/components/SubjectsTable";
import { useAuth } from "@/hooks/useAuthMe";
import { Close } from "@mui/icons-material";
import { Grid, Button, Typography } from "@mui/material";
import Image from "next/image";
import { redirect } from "next/navigation";
import { useEffect, useState } from "react";

export default function Home() {
  const { authData, clearAuthData } = useAuth();

  const [subjectModal, setSubjectModal] = useState(false);
  const [studentModal, setStudentModal] = useState(false);

  const handleSubjectModal = () => {
    setSubjectModal(!subjectModal)
  }

  const handleStudentModal = () => {
    setStudentModal(!studentModal)
  }

  useEffect(()=>{
    console.log('useEffect')
    if(!authData){
      redirect('/')
    }
  },[authData])


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
          <Button variant="contained" color="error" onClick={clearAuthData}>Sair</Button>
        </Grid>
      </Grid>
      <Grid container xs={12} rowSpacing={2} padding={5}>
        <Grid container item padding={2} marginY={1} rowSpacing={2} sx={{ backgroundColor: "#fff", borderRadius: '5px' }}>
          <Grid xs={12} item>
            <Typography textAlign='center' fontWeight='bolder'>Disciplinas</Typography>
          </Grid>
          <Grid xs={12} justifyContent='flex-end' display='flex'>
            <Button variant="contained" color="primary" onClick={handleSubjectModal}>Cadastrar diciplina</Button>
          </Grid>
          <Grid xs={12} item>
            <SubjectsTable />
          </Grid>
        </Grid>
        <Grid container item padding={2} marginY={1} rowSpacing={2} sx={{ backgroundColor: "#fff", borderRadius: '5px' }} >
          <Grid xs={12} item>
            <Typography textAlign='center' fontWeight='bolder'>Alunos</Typography>
          </Grid>
          <Grid xs={12} justifyContent='flex-end' display='flex'>
            {!studentModal ?
              (<Button variant="contained" color="primary" onClick={handleStudentModal}>Cadastrar aluno</Button>) :
              (<Button variant="contained" color="error" onClick={handleStudentModal} endIcon={<Close />}>Cancelar cadastro</Button>)
            }
          </Grid>
          <Grid item xs={12}>
            {studentModal && (
              <Grid item xs={12} padding={2} margin={1}>
                <StudentForm />
              </Grid>)}
            <StudentsTable />
          </Grid>
        </Grid>
      </Grid>

      {subjectModal && (<SubjectModal onClose={handleSubjectModal} />)}

    </Grid>
  );
}
