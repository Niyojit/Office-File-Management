import React from 'react';
import PropTypes from 'prop-types';
import TableCell from '@mui/material/TableCell';
// import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { TableVirtuoso } from 'react-virtuoso';

// Define VirtuosoTableComponents if it's supposed to be used in this file
const VirtuosoTableComponents = {
  TableHead,
  TableRow,
  TableCell,
};

const rowContent = (columns, index, row) => (
  <React.Fragment>
    {columns.map((column) => (
      <TableCell
        key={column.dataKey}
        align={column.numeric || false ? 'right' : 'left'}
      >
        {row[column.dataKey]}
      </TableCell>
    ))}
  </React.Fragment>
);

const CustomTable = ({ rows, columns }) => {
  return (
    <Paper style={{ height: 400, width: '100%' }}>
      <TableVirtuoso
        data={rows}
        components={VirtuosoTableComponents}
        itemContent={(index, row) => rowContent(columns, index, row)}
      />
    </Paper>
  );
};

CustomTable.propTypes = {
  rows: PropTypes.array.isRequired,
  columns: PropTypes.array.isRequired,
};

export default CustomTable;
