import api from "@/services/api";
import { Tooltip, Button, Table, TableHead, TableRow, TableCell, TableBody, Box, Typography, Stack, TextField } from "@mui/material";
import { createColumnHelper, useReactTable, getCoreRowModel, flexRender } from "@tanstack/react-table";
import { useEffect, useMemo, useState } from "react"
import useSWR, { useSWRConfig } from "swr";
import EditIcon from '@mui/icons-material/Edit';
import { format } from "date-fns";
import { DeleteForever } from "@mui/icons-material";
import { useAuth } from "@/hooks/useAuthMe";

type GradeProps = {
    id: number;
    subject_name: string;
    grade: number;
    created_at: string
}


const GradesTable = ({ matricula, filter, role }: { matricula: string, filter: string, role?: string }) => {
    const { authData } = useAuth();

    const [grades, setGrades] = useState<GradeProps[]>([]);
    const { mutate } = useSWRConfig();

    async function updateMyData(rowIndex: any, columnId: any, value: any, id: number): Promise<void> {
        await api.patch(`/grades/${id}`, { grade: Number(value) }).then(() => {
            setGrades(old =>
                old.map((row, index) => {
                    if (index === rowIndex) {
                        return {
                            ...old[rowIndex],
                            [columnId]: value,
                        };
                    }
                    return row;
                }),
            );
        }).catch((e) => {
            console.log(e)
            window.alert('Não foi possível editar a nota!')
        })


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

    const { data } = useSWR(`/grades/student/${matricula}`, getData<GradeProps>);

    useEffect(() => {
        if (data) {
            setGrades(data)
        }
    }, [data])

    useEffect(() => {
        if (filter != '' && data) {
            setGrades(data.filter(item => item.subject_name == filter))
        } else {
            setGrades(data || [])
        }
    }, [filter])

    async function deleteGrade(id: number) {
        api.delete(`/grades/${id}`).then(() => mutate(`/grades/student/${matricula}`))
    }

    const columnHelper = createColumnHelper<GradeProps>()
    const columns = useMemo(() => role == 'student' ? [
        columnHelper.accessor('subject_name', {
            header: () => 'Disciplina',
            cell: info => info.renderValue(),
        }),
        columnHelper.accessor('grade', {
            header: () => 'Nota',
            cell: info => info.renderValue(),
        }),
        columnHelper.accessor('created_at', {
            header: () => 'Data de atualização',
            cell: info => format(info.getValue(), 'dd/MM/yyyy'),
        })
    ] : [
        columnHelper.accessor('subject_name', {
            header: () => 'Disciplina',
            cell: info => info.renderValue(),
        }),
        columnHelper.accessor('grade', {
            header: () => 'Nota',
            cell: info => {
                const [edit, setEdit] = useState(false);
                return (<Stack direction='row' spacing={1} alignItems='center'>
                    {!edit ? (<Typography>{info.getValue()}</Typography>) :
                        (<TextField label='Nota' size="small" type="number" sx={{ padding: 0, width: 80 }} onBlur={(e) => updateMyData(info.row.index, info.column.id, e.target.value, info.row.original.id)} />)}

                    <Tooltip title='Editar' placement="top">
                        <EditIcon onClick={() => setEdit(!edit)} />
                    </Tooltip>
                </Stack>)
            },
        }),
        columnHelper.accessor('created_at', {
            header: () => 'Data de atualização',
            cell: info => format(info.getValue(), 'dd/MM/yyyy'),
        }),
        columnHelper.accessor(row => row.id, {
            id: 'delete',
            header: () => '',
            cell: info => <Tooltip title='Deletar' placement="top"><Button variant="outlined" color='error' onClick={() => deleteGrade(info.row.original.id)}><DeleteForever /></Button></Tooltip>,
            enableHiding: true
        }),
    ], [grades])

    const table = useReactTable({
        data: grades,
        columns,
        getCoreRowModel: getCoreRowModel(),
        // state: { columnVisibility }
    })


    return (
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
        </Table>);
}

export default GradesTable;