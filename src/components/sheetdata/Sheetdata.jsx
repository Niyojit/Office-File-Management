import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  useMediaQuery,
} from '@mui/material';
import './sheetdata.css';

function SheetData() {
  const [sheetData, setSheetData] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10); // Added state for rows per page
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMonth, setSelectedMonth] = useState('April');
  const [totalInwardNumbers, setTotalInwardNumbers] = useState(0);
  const inputRef = useRef(null);

  const months = useMemo(() => [
    { name: 'April', sheet: 'April 2024' },
    { name: 'May', sheet: 'May 2024' },
    { name: 'June', sheet: 'June 2024' },
  ], []);

  const fetchSheetData = useCallback(async (month) => {
    try {
      const sheet = months.find((m) => m.name === month).sheet;
      const response = await fetch(
        `https://sheetdb.io/api/v1/qcjoe0cyhflot?sheet=${sheet}`
      );
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      console.log('Fetched data:', data);
      const normalizedData = data.map((row) => {
        const normalizedRow = {};
        for (let key in row) {
          const trimmedKey = key.trim();
          normalizedRow[trimmedKey] = row[key];
        }
        return normalizedRow;
      });
      setSheetData(normalizedData);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }, [months]);

  useEffect(() => {
    fetchSheetData(selectedMonth);
  }, [selectedMonth, fetchSheetData]);

  const handleMonthChange = (e) => {
    setSelectedMonth(e.target.value);
    setPage(0);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setPage(0);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const filteredData = sheetData.filter((row) => {
    const inwardNumber = row['Inward Number'];
    return (
      inwardNumber &&
      typeof inwardNumber === 'string' &&
      inwardNumber.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  useEffect(() => {
    setTotalInwardNumbers(filteredData.length);
  }, [sheetData, filteredData.length]);

  const columns = [
    { id: 'Inward Number', label: 'Inward Number', minWidth: 50 },
    { id: 'Inward Date', label: 'Inward Date', minWidth: 60 },
    { id: 'Letter Outward Number', label: 'Letter Outward Number', minWidth: 50 },
    { id: 'Letter Outward Date', label: 'Letter Outward Date', minWidth: 50 },
    { id: 'Type Of Letter', label: 'Type Of Letter', minWidth: 50 },
    { id: 'Received From', label: 'Received From', minWidth: 50 },
    { id: 'Subject', label: 'Subject', minWidth: 40 },
    { id: 'Order by Chief Officer', label: 'Order by Chief Officer', minWidth: 50 },
    { id: 'Employee Name', label: 'Employee Name', minWidth: 50 },
    { id: 'Time Given For Action', label: 'Time Given For Action', minWidth: 50 },
    { id: 'Action taken', label: 'Action Taken', minWidth: 40 },
    { id: 'Date of review', label: 'Date of review', minWidth: 30 },
    { id: 'Feedback', label: 'Feedback', minWidth: 20 },
  ];

  const isLargeScreen = useMediaQuery('(min-width:1200px)');
  const isSmallScreen = useMediaQuery('(max-width:600px)');

  return (
    <div className="data-container">
      <div className="header">
        <div className="search">
          <input
            ref={inputRef}
            type="text"
            placeholder="Search by Inward number"
            value={searchQuery}
            onChange={handleSearchChange}
            className={`search-bar ${isSmallScreen ? 'small-screen' : ''}`}
          />
          {filteredData.length === 0 && (
            <div className="not-found">Outward number not found</div>
          )}
        </div>
        <select
          value={selectedMonth}
          onChange={handleMonthChange}
          className={`month-dropdown ${isSmallScreen ? 'small-screen' : ''}`}
        >
          {months.map((month) => (
            <option key={month.name} value={month.name}>
              {month.name}
            </option>
          ))}
        </select>
        <button className={`total-item-btn ${isSmallScreen ? 'small-screen' : ''}`}>
          Total Items: {totalInwardNumbers}
        </button>
      </div>
      {isLargeScreen ? (
        <Paper sx={{ width: '100%', overflow: 'hidden' }}>
          <TableContainer sx={{ maxHeight: 440 }} className="tablecontent">
            <Table stickyHeader aria-label="sticky table">
              <TableHead>
                <TableRow>
                  {columns.map((column) => (
                    <TableCell
                      key={column.id}
                      style={{ minWidth: column.minWidth }}
                      className="table-header-cell"
                    >
                      {column.label}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredData
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row, index) => (
                    <TableRow hover role="checkbox" tabIndex={-1} key={index}>
                      {columns.map((column) => {
                        const value = row[column.id];
                        return <TableCell key={column.id}>{value}</TableCell>;
                      })}
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[10, 25, 100]} // Set the options here
            component="div"
            count={filteredData.length}
            rowsPerPage={rowsPerPage} // Use state here
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage} // Handle change here
          />
        </Paper>
      ) : (
        <div className="responsive-box-container">
          {filteredData
            .slice(page * 10, page * 10 + 10)
            .map((row, rowIndex) => {
              // Check if both inward number and inward date are not present
              const hasInwardNumber = row['Inward Number'];
              const hasInwardDate = row['Inward Date'];

              // If both inward number and inward date are not present, skip rendering the row
              if (!hasInwardNumber && !hasInwardDate) {
                return null;
              }

              return (
                <div className="row-box" key={rowIndex}>
                  {columns.map((column, colIndex) => (
                    <div className="cell-box" key={colIndex}>
                      <div className={`label ${isSmallScreen ? 'small-screen' : ''}`}>
                        {column.label}
                      </div>
                      <div className={`value ${isSmallScreen ? 'small-screen' : ''}`}>
                        {row[column.id]}
                      </div>
                    </div>
                  ))}
                </div>
              );
            })}
          <TablePagination
            rowsPerPageOptions={[]} // No rows per page options for responsive view
            component="div"
            count={Math.ceil(filteredData.length / 10)} // Correct the count for pagination
            rowsPerPage={10}
            page={page}
            onPageChange={handleChangePage}
          />
        </div>
      )}
    </div>
  );
}

export default SheetData;
