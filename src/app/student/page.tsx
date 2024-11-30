"use client"
import GradesTable from "@/components/GradesTable";
import { StudentsTable } from "@/components/StudentsTable";
import SubjectsTable from "@/components/SubjectsTable";
import { useAuth } from "@/hooks/useAuthMe";
import { Button, Grid, Typography } from "@mui/material";
import Image from "next/image";

export default function StudentHome() {
  const { authData, clearAuthData } = useAuth();

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
      <Grid xs={12} container item padding={2}>
        <Grid xs={12} display='flex' spacing={2}>
          <Grid item xs={4}>
            <Typography>Olá {authData?.user?.name}</Typography>
          </Grid>
          <Grid item xs={3}>
            <Typography>Matrícula:{authData?.user?.matricula}</Typography>
          </Grid>
        </Grid>
        <Grid item xs={6}>
          <Typography variant="h5" textAlign='center'>Notas</Typography>
          <GradesTable matricula={authData?.user?.matricula as string} filter="" role={'student'} />
        </Grid>
        <Grid item xs={6}>
          <Typography variant="h5" textAlign='center'>Disciplinas</Typography>
          <SubjectsTable matricula={authData?.user?.matricula as string} />
        </Grid>
      </Grid>
    </Grid>
  )
}