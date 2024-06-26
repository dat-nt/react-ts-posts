import "./PostsTable.css";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { Post } from "../types/Post";
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    TablePagination,
    Box,
    CircularProgress,
} from "@mui/material";

const PostsTable: React.FC = () => {
    const [posts, setPosts] = useState<Post[]>([]);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [loading, setLoading] = useState(true);

    const delay = (ms: number) => {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const response = await axios.get("https://jsonplaceholder.typicode.com/posts");
                setPosts(response.data);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching posts:", error);
            }
        };

        delay(1000).then(() => fetchPosts());
    }, []);

    const startIndex = page * rowsPerPage;
    const endIndex = page * rowsPerPage + rowsPerPage;
    const currentPosts = posts.slice(startIndex, endIndex);

    const handleChangePage = (
        _event: React.MouseEvent<HTMLButtonElement, MouseEvent> | null,
        newPage: number
    ) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    return (
        <Paper>
            <TableContainer sx={{ maxHeight: 600 }}>
                <Table stickyHeader>
                    <TableHead>
                        <TableRow>
                            <TableCell className="header-cell" >ID</TableCell>
                            <TableCell className="header-cell" sx={{ width: 60 }}>
                                User ID
                            </TableCell>
                            <TableCell className="header-cell">Title</TableCell>
                            <TableCell className="header-cell">Body</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={4} align="center">
                                    <Box display="flex" justifyContent="center" alignItems="center">
                                        <CircularProgress size={20} />
                                        <Box component="h3" ml={2}>Loading...</Box>
                                    </Box>
                                </TableCell>
                            </TableRow>
                        ) : (
                            currentPosts.map((post) => (
                                <TableRow key={post.id} className="table-row">
                                    <TableCell>{post.id}</TableCell>
                                    <TableCell>{post.userId}</TableCell>
                                    <TableCell>{post.title}</TableCell>
                                    <TableCell>{post.body}</TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </TableContainer>

            <TablePagination
                rowsPerPageOptions={[5, 10, 20, { label: "All", value: posts.length }]}
                component="div"
                count={posts.length}
                rowsPerPage={rowsPerPage}
                page={page}
                showFirstButton
                showLastButton
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
            />
        </Paper>
    )
}

export default PostsTable;
