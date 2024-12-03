import { useAuth } from "@/hooks/useAuthMe";
import api from "@/services/api";
import { Skeleton, Table, TableBody, TableCell, TableHead, TableRow } from "@mui/material";
import { createColumnHelper, flexRender, getCoreRowModel, useReactTable } from "@tanstack/react-table";
import { format } from "date-fns";
import { useEffect, useMemo, useState } from "react";
import useSWR from "swr";

interface SubjectsTableProps {
    matricula: string
}

type SubjectsProps = {
    id: number;
    name: string;
    teacher: string;
    created_at: string
}

const SubjectsTable = ({ matricula }: SubjectsTableProps) => {
    const { authData } = useAuth();
    const [subjects, setSubjects] = useState<SubjectsProps[]>([]);

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

    const { data, isLoading } = useSWR(matricula ? `/disciplinas/aluno/${matricula}` : `/disciplinas`, getData<SubjectsProps>);

    useEffect(() => {
        if (data) {
            setSubjects(data)
        }
    }, [data])

    const columnHelper = createColumnHelper<SubjectsProps>()
    const columns = useMemo(() => [
        columnHelper.accessor('id', {
            header: () => 'Id',
            cell: info => info.renderValue(),
        }),
        columnHelper.accessor('name', {
            header: () => 'Nome',
            cell: info => info.renderValue(),
        }),
        columnHelper.accessor('teacher', {
            header: () => 'Professor',
            cell: info => info.renderValue(),
        }),
        columnHelper.accessor('created_at', {
            header: () => 'Data cadastro',
            cell: info => info.getValue() ? format(info.getValue(), 'dd/MM/yyyy') : '',
        })
    ]
        , [subjects])
    const table = useReactTable({
        data: subjects,
        columns,
        getCoreRowModel: getCoreRowModel(),
    })

    if (isLoading) {
        return <Skeleton width='100%' height={300} />
    }


    return (<Table sx={{ border: '1px solid #cce2ff' }}>
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
    </Table>)
}

export default SubjectsTable;