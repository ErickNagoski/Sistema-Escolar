import api from "@/services/api";
import { Box, Button, Skeleton, Table, TableBody, TableCell, TableHead, TableRow, Tooltip } from "@mui/material";
import { createColumnHelper, flexRender, getCoreRowModel, useReactTable } from "@tanstack/react-table";
import { useEffect, useState } from "react";
import useSWR from "swr";
import TableViewIcon from '@mui/icons-material/TableView';
import { GradesModal } from "./GradesModal";
import { format } from "date-fns";
import { useAuth } from "@/hooks/useAuthMe";

export type StudentProps = {
    id: number;
    user_id: number;
    matricula: string,
    course_id: number;
    name: string;
    bithday: string;
    cpf: string;
    email: string;
    phone: string;
    address: string;
    situation: string;
    created_at: string;
    updated_at: string;
    subjects: number
}

export function StudentsTable() {
    const { authData } = useAuth();

    const [students, setStudents] = useState<StudentProps[]>([]);
    const [gradesModal, setGradesModal] = useState(false);
    const [selectedStudent, setSelectedStudent] = useState<StudentProps | null>(null);

    const handleGradesModal = () => {
        setGradesModal(!gradesModal)
    }

    async function getData<T>(key: string): Promise<T[]> {
        const response = await api.get(key, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${authData?.token}`

            }
        })

        if (response.data) {
            return response.data
        }

        return []
    }

    const { data, isLoading } = useSWR(`/alunos`, getData<StudentProps>);

    useEffect(() => {
        if (data) {
            setStudents(data)
        }
    }, [data])

    const columnHelper = createColumnHelper<StudentProps>()
    const columns = [
        columnHelper.accessor(row => row.id, {
            id: 'actions',
            header: () => 'notas',
            cell: info => <Tooltip title={info.row.original.subjects == 0 ? 'Aluno sem disciplinas' : 'Notas'} placement="top">
                <Box>
                    <Button
                        variant="outlined"
                        onClick={() => {
                            setSelectedStudent(info.row.original);
                            handleGradesModal()
                        }}
                        disabled={info.row.original.subjects == 0}
                    >
                        <TableViewIcon />
                    </Button>
                </Box>
            </Tooltip>,
        }),
        columnHelper.accessor('matricula', {
            header: () => 'Matrícula',
            cell: info => info.renderValue(),
        }),
        columnHelper.accessor('name', {
            header: () => 'name',
            cell: info => info.renderValue(),
        }),
        columnHelper.accessor('cpf', {
            header: () => 'cpf',
            cell: info => info.renderValue(),
        }),
        columnHelper.accessor('email', {
            header: () => 'E-mail',
            cell: info => info.renderValue(),
        }),
        columnHelper.accessor('phone', {
            header: () => 'Telefone',
            cell: info => info.renderValue(),
        }),
        columnHelper.accessor('situation', {
            header: () => 'Situação',
            cell: info => info.renderValue(),
        }),
        columnHelper.accessor('bithday', {
            header: () => 'Nascimento',
            cell: info => info.getValue() ? format(info.getValue(), 'dd/MM/yyyy') : '',
        }),
        columnHelper.accessor('created_at', {
            header: () => 'Data Matrícula',
            cell: info => info.getValue() ? format(info.getValue(), 'dd/MM/yyyy') : '',
        }),
    ]

    const table = useReactTable({
        data: students,
        columns,
        getCoreRowModel: getCoreRowModel(),
    })

    if (isLoading) {
        return <Skeleton width='100%' height={300} />
    }

    return (
        <Box>
            <Table sx={{ border: '1px solid #cce2ff' }}>
                <TableHead sx={{ backgroundColor: "#cce2ff" }}>
                    {table.getHeaderGroups().map(headerGroup => (
                        <TableRow key={headerGroup.id}>
                            {headerGroup.headers.map(header => (
                                <TableCell key={header.id} sx={{ textTransform: 'uppercase', fontWeight: '600' }}>
                                    {header.isPlaceholder
                                        ? null
                                        : flexRender(
                                            header.column.columnDef.header,
                                            header.getContext()
                                        )}
                                </TableCell>
                            ))}
                        </TableRow>
                    ))}
                </TableHead>
                <TableBody>
                    {table.getRowModel().rows.map(row => (
                        <TableRow key={row.id}>
                            {row.getVisibleCells().map(cell => (
                                <TableCell key={cell.id}>
                                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                </TableCell>
                            ))}
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
            {gradesModal && (<GradesModal onClose={handleGradesModal} matricula={selectedStudent ? selectedStudent?.matricula : ''} />)}
        </Box>);
}