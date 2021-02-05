import { makeStyles, Table, TableCell, TableContainer, TableHead, TableRow, Paper, TableBody, TablePagination, Typography } from '@material-ui/core'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Controls from '../../components/controls/Controls';
import { getStores } from '../../reduxStore/actions/storeActions'

import EditIcon from '@material-ui/icons/Edit';
import BackArrow from '../../components/BackArrow';

const useStyles = makeStyles((theme) => ({
    table: {
        minWidth: 650,
        maxWidth: 1080,
    },

    cell: {
        backgroundColor: theme.palette.action.focus,
        fontWeight: "bold",
    },
    pag: {
        minWidth: 650,
        maxWidth: 1080,
        margin: "1rem auto",
    },
}));

const StoresPage = ({ history }) => {
    const dispatch = useDispatch()
    const classes = useStyles()
    const { stores, filtered } = useSelector(state => state.storesData)


    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };
    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };
    const emptyRows =
        rowsPerPage -
        Math.min(
            rowsPerPage,
            (filtered.length > 0 ? filtered : stores) - page * rowsPerPage
        );


    useEffect(() => {
        dispatch(getStores())
        return () => {

        }
    }, [dispatch])


    return (
        <div style={{
            maxWidth: "1080px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "1rem auto",
            flexDirection: "column",
        }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                <BackArrow />
                <Typography variant='h5'>All Stores</Typography>
                <Typography></Typography>
            </div>

            <TableContainer component={Paper}>
                <Table className={classes.table}>
                    <TableHead>
                        <TableRow>
                            <TableCell className={classes.cell}>Name</TableCell>
                            <TableCell className={classes.cell}>Address</TableCell>
                            <TableCell className={classes.cell}>Phone</TableCell>
                            <TableCell className={classes.cell}>Status</TableCell>
                            <TableCell className={classes.cell}>Owner</TableCell>
                            <TableCell className={classes.cell}>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {(filtered.length > 0 ? filtered : stores)
                            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                            .map((store) => (
                                <TableRow key={store.id}>
                                    <TableCell className="capitalize">
                                        {store.name}
                                    </TableCell>
                                    <TableCell className="capitalize">
                                        {store.street} {store.city}
                                    </TableCell>
                                    <TableCell>{store.phone}</TableCell>
                                    <TableCell>
                                        {store.status}
                                    </TableCell>
                                    <TableCell>{store.owner}</TableCell>
                                    <TableCell>
                                        <Controls.Button
                                            StartIcon={<EditIcon />}
                                            text="Details"
                                            size="small"
                                            onClick={() => history.push(`/admin/store/details/${store.id}`)}
                                        />
                                    </TableCell>
                                </TableRow>
                            ))}
                        {emptyRows > 0 && (
                            <TableRow style={{ height: 33 * emptyRows }}>
                                <TableCell colSpan={7} />
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
                <TablePagination
                    className={classes.pag}
                    rowsPerPageOptions={[5, 10, 15, 20, 30]}
                    component="div"
                    count={(filtered.length > 0 ? filtered : stores).length}
                    page={page}
                    onChangePage={handleChangePage}
                    rowsPerPage={rowsPerPage}
                    onChangeRowsPerPage={handleChangeRowsPerPage}
                />
            </TableContainer>

        </div>
    )
}

export default StoresPage
