import { useState, useEffect } from 'react';
import CustomTable from '../tables/CustomTable';
import './dashboard.css';

function Dashboard() {
  const [sheetData, setSheetData] = useState([]);
  const [completedItems, setCompletedItems] = useState([]);
  const [pendingItems, setPendingItems] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState('April');
  const [pendingSearchTerm, setPendingSearchTerm] = useState('');
  const [completedSearchTerm, setCompletedSearchTerm] = useState('');

  const months = [
    { name: 'April', sheet: 'April 2024' },
    { name: 'May', sheet: 'May 2024' },
    { name: 'June', sheet: 'June 2024' },
  ];

  useEffect(() => {
    fetchSheetData(selectedMonth);
  }, [selectedMonth]);

  useEffect(() => {
    filterItems();
  }, [sheetData, pendingSearchTerm, completedSearchTerm]);

  const fetchSheetData = async (month) => {
    try {
      const sheet = months.find((m) => m.name === month).sheet;
      const response = await fetch(
        `https://sheetdb.io/api/v1/qcjoe0cyhflot?sheet=${sheet}`
      );
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
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
  };

  const filterItems = () => {
    const completed = sheetData.filter(
      (item) => item['Letter Outward Number'] || item['Action taken']
    ).map((item) => ({
      ...item,
      inwardNumber: item['Inward Number'],
      averageDays: calculateAverageDays(item['Inward Date'], item['Letter Outward Date']),
    }));
    const pending = sheetData.filter(
      (item) => !item['Letter Outward Number'] && !item['Action taken']
    );

    setCompletedItems(completed);
    setPendingItems(pending);
  };

  const calculateAverageDays = (inwardDate, outwardDate) => {
    if (!inwardDate || !outwardDate) return null;

    const formatDateString = (dateString) => {
      return dateString.replace(/[./]/g, '/');
    };

    const formattedInwardDate = formatDateString(inwardDate);
    const formattedOutwardDate = formatDateString(outwardDate);

    const [inwardDay, inwardMonth, inwardYear] = formattedInwardDate.split('/').map(Number);
    const [outwardDay, outwardMonth, outwardYear] = formattedOutwardDate.split('/').map(Number);

    const inward = new Date(inwardYear, inwardMonth - 1, inwardDay);
    const outward = new Date(outwardYear, outwardMonth - 1, outwardDay);

    const diffTime = Math.abs(outward - inward);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    return diffDays > 100 ? 'NULL' : diffDays;
  };

  const handleMonthChange = (e) => {
    setSelectedMonth(e.target.value);
  };

  const handlePendingSearchTermChange = (e) => {
    setPendingSearchTerm(e.target.value);
  };

  const handleCompletedSearchTermChange = (e) => {
    setCompletedSearchTerm(e.target.value);
  };

  const pendingColumns = [
    { width: 200, label: 'Inward Number', dataKey: 'Inward Number' },
  ];

  const completedColumns = [
    { width: 200, label: 'Inward Number', dataKey: 'Inward Number' },
    { width: 200, label: 'Average Days', dataKey: 'averageDays', numeric: true },
  ];

  const filteredPendingItems = pendingSearchTerm
    ? pendingItems.filter(item => item['Inward Number'].includes(pendingSearchTerm))
    : pendingItems;

  const filteredCompletedItems = completedSearchTerm
    ? completedItems.filter(item => item['Inward Number'].includes(completedSearchTerm))
    : completedItems;

  return (
    <div className="dashboard-container">
      <div className="dashboard-containerhead">
        <h1 className="dashboard-containerHeading">Dashboard</h1>
        <div className="month-selector">
          <label htmlFor="month">Select Month: </label>
          <select
            id="month"
            value={selectedMonth}
            onChange={handleMonthChange}
            className="dropdown"
          >
            {months.map((month) => (
              <option key={month.name} value={month.name}>
                {month.name}
              </option>
            ))}
          </select>
        </div>
      </div>
      
      <div className="dashboard-summary">
        <button className="summaryContainer">Total Items: {sheetData.length}</button>
        <button className="summaryContainer1">Pending Items: {pendingItems.length}</button>
        <button className="summaryContainer2">Completed Items: {completedItems.length}</button>
      </div>
      <div className="item-list">
        <div className="itemBar">
        
        <input
          type="text"
          placeholder="Search Pending Items by Inward Number"
          value={pendingSearchTerm}
          onChange={handlePendingSearchTermChange}
          className="searchbydata"
        />
      
      
          <h3>Pending Items (Inward Numbers)</h3>
          <CustomTable rows={filteredPendingItems} columns={pendingColumns} />
        </div>
        <div className="itemBar" >
        <input
          type="text"
          placeholder="Search Completed Items by Inward Number"
          value={completedSearchTerm}
          onChange={handleCompletedSearchTermChange}
          className="searchbydata"
        />
          <h3>Completed Items (Inward Numbers and Average Days)</h3>
          <CustomTable rows={filteredCompletedItems} columns={completedColumns} />
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
