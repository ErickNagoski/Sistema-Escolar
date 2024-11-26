import { Modal, Typography } from "@mui/material";

interface GradeModalProps {
    isOpen: boolean;
    onClose: () => {};
    studentId: number;
}

const GradeModal = ({ isOpen, onClose, studentId }: GradeModalProps) => {
    return (<Modal
        open={isOpen}
        onClose={onClose}
    >
        <Typography>Cadastro de notas</Typography>
    </Modal>)
}

export default GradeModal;