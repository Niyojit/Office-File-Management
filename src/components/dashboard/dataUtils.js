export const parseDate = (dateString) => {
    if (!dateString) return null;
    const parts = dateString.split(/[./]/); // Supports both '/' and '.' as separators
    if (parts.length !== 3) return null;
  
    const [day, month, year] = parts.map(part => parseInt(part, 10));
    return new Date(year, month - 1, day);
  };
  
  export const calculateAverageDays = (row) => {
    const inwardDate = parseDate(row['Inward Date']);
    const outwardDate = parseDate(row['Letter Outward Date']);
    if (!inwardDate || !outwardDate) return null;
  
    const differenceInTime = outwardDate - inwardDate;
    const differenceInDays = differenceInTime / (1000 * 3600 * 24);
    return differenceInDays;
  };
  
  export const fetchSheetData = async (month) => {
    const response = await fetch(`https://sheetdb.io/api/v1/qcjoe0cyhflot?sheet=${month}`);
    const data = await response.json();
    return data.map(row => {
      const normalizedRow = {};
      for (let key in row) {
        const trimmedKey = key.trim();
        normalizedRow[trimmedKey] = row[key];
      }
      return normalizedRow;
    });
  };
  