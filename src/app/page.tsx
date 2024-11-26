import Image from "next/image";
import styles from "./page.module.css";
import MainCard from "@/components/MainCard";
import { Button, Grid, Grid2 } from "@mui/material";
import StudentForm from "@/components/Forms/StudentForm";
import TesteForm from "@/components/Forms/SubjectForm";



export default function Home() {
  return (
    <Grid xs={12}>
      <Grid columns={12} container item justifyContent='space-between' sx={{ backgroundColor: "#f4f5f6" }} padding={2}>
        <Grid xs={2}>
          <Image
            className={styles.logo}
            src="/logo.png"
            alt="Next.js logo"
            width={40}
            height={38}
            priority
          />
        </Grid>
        <Grid container item xs={8}>
          <Grid item xs={2}>
            <Button variant="contained">Alunos</Button>
          </Grid>
          <Grid item xs={2}>
            <Button variant="contained">Disciplinas</Button>
          </Grid>
        </Grid>
        <Grid item xs={2}>
          <Button variant="contained" color="error">Sair</Button>
        </Grid>
      </Grid>

    </Grid>
  );
}
