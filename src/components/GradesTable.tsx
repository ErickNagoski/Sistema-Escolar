import api from "@/services/api";
import { Tooltip, Button, Table, TableHead, TableRow, TableCell, TableBody } from "@mui/material";
import { createColumnHelper, useReactTable, getCoreRowModel, flexRender } from "@tanstack/react-table";
import { useEffect, useState } from "react"
import useSWR from "swr";
import EditIcon from '@mui/icons-material/Edit';
import { format } from "date-fns";

type GradeProps = {
    id: number;
    subject_name: string;
    grade: number;
    created_at: string
}


const GradesTable = ({ matricula, filter }: { matricula: string, filter: string }) => {
    const [grades, setGrades] = useState<GradeProps[]>([]);

    async function getData<T>(key: string): Promise<T[]> {
        const response = await api.get(key, {
            headers: {
                'Content-Type': 'application/json',
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
        }
    }, [filter])

    const columnHelper = createColumnHelper<GradeProps>()
    const columns = [
        columnHelper.accessor(row => row.id, {
            id: 'actions',
            header: () => '',
            cell: info => <Tooltip title='Notas' placement="top"><Button variant="outlined"><EditIcon /></Button></Tooltip>,
        }),
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
        }),
    ]

    const table = useReactTable({
        data: grades,
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

export default GradesTable;