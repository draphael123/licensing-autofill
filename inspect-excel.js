/**
 * Inspect Excel file structure to understand the data format
 */

const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');

const excelFilePath = path.join(__dirname, 'Data Source', 'Provider _ Compliance Dashboard.xlsx');
const workbook = XLSX.readFile(excelFilePath);

console.log('Excel File Analysis\n');
console.log('='.repeat(50));

// List all sheets
console.log('\nSheets found:');
workbook.SheetNames.forEach((name, index) => {
  console.log(`  ${index + 1}. ${name}`);
});

// Analyze each sheet
workbook.SheetNames.forEach(sheetName => {
  console.log(`\n${'='.repeat(50)}`);
  console.log(`\nAnalyzing sheet: "${sheetName}"`);
  console.log('='.repeat(50));
  
  const worksheet = workbook.Sheets[sheetName];
  
  // Get the range
  const range = XLSX.utils.decode_range(worksheet['!ref'] || 'A1');
  console.log(`\nRange: ${worksheet['!ref']}`);
  console.log(`Rows: ${range.e.r + 1}, Columns: ${range.e.c + 1}`);
  
  // Show first 10 rows
  console.log('\nFirst 10 rows:');
  for (let row = 0; row <= Math.min(9, range.e.r); row++) {
    const rowData = [];
    for (let col = 0; col <= Math.min(10, range.e.c); col++) {
      const cellAddress = XLSX.utils.encode_cell({ r: row, c: col });
      const cell = worksheet[cellAddress];
      const value = cell ? (cell.v !== undefined ? cell.v : '') : '';
      rowData.push(value);
    }
    console.log(`Row ${row + 1}:`, rowData.slice(0, 5).join(' | '));
  }
  
  // Try to convert to JSON to see structure
  const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1, defval: '' });
  console.log('\nFirst 5 rows as JSON (array format):');
  jsonData.slice(0, 5).forEach((row, index) => {
    console.log(`Row ${index + 1}:`, JSON.stringify(row.slice(0, 5)));
  });
  
  // Try with first row as headers
  const jsonWithHeaders = XLSX.utils.sheet_to_json(worksheet, { defval: '' });
  if (jsonWithHeaders.length > 0) {
    console.log('\nFirst row as headers (object format):');
    console.log('Column names:', Object.keys(jsonWithHeaders[0]).slice(0, 10));
    console.log('\nFirst data row:');
    console.log(JSON.stringify(jsonWithHeaders[0], null, 2));
  }
});

