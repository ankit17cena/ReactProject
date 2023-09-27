import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, TextField, Collapse } from '@mui/material';

const MenuTable = ({ data }) => {
    const [rows, setRows] = useState(() => {
        const storedRows = localStorage.getItem('editedRows');
        return storedRows ? JSON.parse(storedRows) : data;
    });
    const [expandedRows, setExpandedRows] = useState([]);
    const [sortOrder, setSortOrder] = useState('asc');
    const originalRows = data;

    const handlePriceChange = (id, price) => {
        if (price < 0) {
            price = 0;
        }
        const updatedRows = rows.map((row) => {
            if (row.id === id) {
                return { ...row, price };
            }
            return row;
        });
        setRows(updatedRows);
    };

    const handleSave = () => {
        localStorage.setItem('editedRows', JSON.stringify(rows));
    };

    const handleReset = () => {
        setRows(originalRows);
        localStorage.setItem('editedRows', JSON.stringify(originalRows));
    };

    const toggleRowExpansion = (id) => {
        if (expandedRows.includes(id)) {
            setExpandedRows(expandedRows.filter((rowId) => rowId !== id));
        } else {
            setExpandedRows([...expandedRows, id]);
        }
    };

    const handleSortByPrice = () => {
        const sortedRows = [...rows];
        sortedRows.sort((a, b) => {
            const priceA = parseFloat(a.price);
            const priceB = parseFloat(b.price);

            if (sortOrder === 'asc') {
                return priceA - priceB;
            } else {
                return priceB - priceA;
            }
        });

        setRows(sortedRows);
        setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    };

    return (
        <div>
            <div style={{ position: 'sticky', top: 0, zIndex: 1, background: 'white' }}>
                <Button variant="contained" color="primary" onClick={handleSave} style={{ marginRight: '5px', marginTop: '1px' }}>
                    Save
                </Button>
                <Button variant="contained" color="secondary" onClick={handleReset} style={{ marginRight: '5px', marginTop: '1px' }}>
                    Reset
                </Button>
                <Button variant="outlined" style={{ backgroundColor: 'green', color: 'white', marginTop: '1px' }} onClick={handleSortByPrice}>
                    Sort by Price {sortOrder === 'asc' ? '↑' : '↓'}
                </Button>
            </div>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Category</TableCell>
                            <TableCell>Name</TableCell>
                            <TableCell>Price</TableCell>
                            <TableCell>Label</TableCell>
                            <TableCell>Image</TableCell>
                            <TableCell>Description</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {rows.map((row) => (
                            <React.Fragment key={row.id}>
                                <TableRow>
                                    <TableCell>
                                        <Button
                                            onClick={() => toggleRowExpansion(row.id)}
                                            variant="text"
                                        >
                                            {row.category}
                                        </Button>
                                    </TableCell>
                                    <TableCell>{row.name}</TableCell>
                                    <TableCell>
                                        <TextField
                                            type="number"
                                            value={row.price}
                                            onChange={(e) =>
                                                handlePriceChange(row.id, e.target.value)
                                            }
                                            variant="outlined"
                                        />
                                    </TableCell>
                                    <TableCell>{row.label || 'NA'}</TableCell>
                                    <TableCell>
                                        <img src={row.image} alt={row.name} style={{ maxWidth: '100px' }} />
                                    </TableCell>
                                    <TableCell>{row.description}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell colSpan={6}>
                                        <Collapse in={expandedRows.includes(row.id)}>
                                            {rows
                                                .filter((subRow) => subRow.category === row.category)
                                                .map((subRow) => (
                                                    <TableRow key={subRow.id}>
                                                        <TableCell />
                                                        <TableCell>{subRow.name}</TableCell>
                                                        <TableCell>
                                                            <TextField
                                                                type="number"
                                                                value={subRow.price}
                                                                onChange={(e) =>
                                                                    handlePriceChange(subRow.id, e.target.value)
                                                                }
                                                                variant="outlined"
                                                            />
                                                        </TableCell>
                                                        <TableCell>{subRow.label || 'NA'}</TableCell>
                                                        <TableCell>
                                                            <img src={subRow.image} alt={subRow.name} style={{ maxWidth: '100px' }} />
                                                        </TableCell>
                                                        <TableCell>{subRow.description}</TableCell>
                                                    </TableRow>
                                                ))}
                                        </Collapse>
                                    </TableCell>
                                </TableRow>
                            </React.Fragment>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    );
};

export default MenuTable;