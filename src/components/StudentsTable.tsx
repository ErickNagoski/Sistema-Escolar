import api from "@/services/api";
import { Button, Table, TableBody, TableCell, TableHead, TableRow, Tooltip } from "@mui/material";
import { createColumnHelper, flexRender, getCoreRowModel, useReactTable } from "@tanstack/react-table";
import { useEffect, useState } from "react";
import useSWR from "swr";
import TableViewIcon from '@mui/icons-material/TableView';

type StudentProps = {
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
}

export function StudentsTable() {
    const [students, setStudents] = useState<StudentProps[]>([]);
    const [gradesModal, setGradesModal] = useState(false);

    async function getData<T>(key: string): Promise<T[]> {
        const response = await api.get(key)

        if (response.data) {
            return response.data
        }

        return []
    }

    const { data } = useSWR(`/alunos`, getData<StudentProps>);

    useEffect(() => {
        if (data) {
            setStudents(data)
        }
    }, [data])

    const columnHelper = createColumnHelper<StudentProps>()
    const columns = [
        columnHelper.accessor(row => row.id, {
            id: 'actions',
            header: () => '',
            cell: info => <Tooltip title='Notas' placement="top"><Button variant="outlined"><TableViewIcon /></Button></Tooltip>,
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
            cell: info => info.renderValue(),
        }),
        columnHelper.accessor('created_at', {
            header: () => 'Data Matrícula',
            cell: info => info.renderValue(),
        }),
    ]

    const table = useReactTable({
        data: students,
        columns,
        getCoreRowModel: getCoreRowModel(),
    })


    return (<Table>
        <TableHead>
            {table.getHeaderGroups().map(headerGroup => (
                <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map(header => (
                        <TableCell key={header.id} sx={{ textTransform: 'uppercase' }}>
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
    </Table>);
}