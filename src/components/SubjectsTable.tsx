import api from "@/services/api";
import { Table, TableBody, TableCell, TableHead, TableRow } from "@mui/material";
import { createColumnHelper, flexRender, getCoreRowModel, useReactTable } from "@tanstack/react-table";
import { format } from "date-fns";
import { useEffect, useState } from "react";
import useSWR from "swr";

interface SubjectsTableProps {

}

type SubjectsProps = {
    id: number;
    name: string;
    teacher: string;
    created_at: string
}

const SubjectsTable = ({ }: SubjectsTableProps) => {
    const [subjects, setSubjects] = useState<SubjectsProps[]>([]);

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

    const { data } = useSWR(`/disciplinas`, getData<SubjectsProps>);

    useEffect(() => {
        if (data) {
            setSubjects(data)
        }
    }, [data])

    const columnHelper = createColumnHelper<SubjectsProps>()
    const columns = [
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
            cell: info => format(info.getValue(), 'dd/MM/yyyy'),
        })
    ]

    const table = useReactTable({
        data: subjects,
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
    </Table>)
}

export default SubjectsTable;