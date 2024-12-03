import { Box, Button, Chip, Grid, IconButton, Modal, Typography } from "@mui/material";
import GradesTable from "./GradesTable";
import { useEffect, useState } from "react";
import api from "@/services/api";
import useSWR from "swr";
import SubjectForm from "./Forms/SubjectForm";
import { Close } from "@mui/icons-material";

interface GradesModalProps {
    onClose: () => void,
}

export function SubjectModal({ onClose, }: GradesModalProps) {

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
            <Grid xs={12} container>

                <Grid xs={12} item display='flex' justifyContent='flex-end'>
                    <Button variant='outlined' color='error' onClick={onClose}>
                        <Close />
                    </Button>
                </Grid>
                <Grid xs={12} item>
                    <SubjectForm onClose={onClose}/>
                </Grid>
            </Grid>
        </Box>
    </Modal>)
}