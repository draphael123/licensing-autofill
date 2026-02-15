/**
 * Convert Excel file directly to default-data.json
 * Reads the Excel file from Data Source folder
 */

const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');

// File paths
const excelFilePath = path.join(__dirname, 'Data Source', 'Provider _ Compliance Dashboard.xlsx');
const outputPath = path.join(__dirname, 'data', 'default-data.json');

// Create data directory if it doesn't exist
const dataDir = path.dirname(outputPath);
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

console.log('Reading Excel file...');
console.log(`File: ${excelFilePath}`);

// Read the Excel file
const workbook = XLSX.readFile(excelFilePath);

// Get the first sheet name
const sheetName = workbook.SheetNames[0];
console.log(`\nSheet found: ${sheetName}`);

// Convert sheet to JSON
const worksheet = workbook.Sheets[sheetName];
const data = XLSX.utils.sheet_to_json(worksheet);

console.log(`\nFound ${data.length} rows`);
console.log('\nColumn names found:');
if (data.length > 0) {
  console.log(Object.keys(data[0]).join(', '));
}

// Show first row as example
if (data.length > 0) {
  console.log('\nFirst row sample:');
  console.log(JSON.stringify(data[0], null, 2));
}

// Field mapping - adjust based on your actual column names
// This is a common mapping, but we'll need to adjust based on your file
const fieldMapping = {
  // Common variations - we'll map these
  'First Name': 'firstName',
  'First_Name': 'firstName',
  'firstName': 'firstName',
  'First': 'firstName',
  
  'Last Name': 'lastName',
  'Last_Name': 'lastName',
  'lastName': 'lastName',
  'Last': 'lastName',
  
  'NPI': 'npi',
  'NPI Number': 'npi',
  'NPI_Number': 'npi',
  'npi': 'npi',
  
  'DEA': 'dea',
  'DEA Number': 'dea',
  'DEA_Number': 'dea',
  'dea': 'dea',
  
  'Email': 'email',
  'Email Address': 'email',
  'Email_Address': 'email',
  'email': 'email',
  
  'Phone': 'phone',
  'Phone Number': 'phone',
  'Phone_Number': 'phone',
  'phone': 'phone',
  
  'Specialty': 'specialty',
  'specialty': 'specialty',
  
  'License Number': 'licenseNumber',
  'License_Number': 'licenseNumber',
  'License': 'licenseNumber',
  'licenseNumber': 'licenseNumber',
  
  'State': 'state',
  'state': 'state',
};

// Convert data to provider format
function mapField(excelColumnName) {
  // Try exact match first
  if (fieldMapping[excelColumnName]) {
    return fieldMapping[excelColumnName];
  }
  
  // Try case-insensitive match
  const lowerKey = excelColumnName.toLowerCase().trim();
  for (const [key, value] of Object.entries(fieldMapping)) {
    if (key.toLowerCase() === lowerKey) {
      return value;
    }
  }
  
  // Return cleaned version of original name
  return excelColumnName.toLowerCase().replace(/\s+/g, '').replace(/[^a-z0-9]/g, '');
}

const providers = data.map((row, index) => {
  const provider = {};
  
  // Map all fields
  Object.keys(row).forEach(excelColumn => {
    const jsonField = mapField(excelColumn);
    const value = row[excelColumn];
    
    // Only include non-empty values
    if (value !== undefined && value !== null && value !== '') {
      provider[jsonField] = String(value).trim();
    }
  });
  
  // Add an ID if not present
  if (!provider.id) {
    provider.id = `provider-${index + 1}`;
  }
  
  return provider;
});

// Create default data structure
const defaultData = {
  providers: providers,
  mappings: [], // Add default mappings here if needed
  version: '1.0.0',
  createdAt: new Date().toISOString(),
  sourceFile: 'Provider _ Compliance Dashboard.xlsx'
};

// Write JSON file
fs.writeFileSync(outputPath, JSON.stringify(defaultData, null, 2));

console.log('\n✅ Conversion successful!');
console.log(`   Converted ${providers.length} providers`);
console.log(`   Output: ${outputPath}`);
console.log('\n📋 Next steps:');
console.log('   1. Review the generated JSON file');
console.log('   2. Check that field mappings are correct');
console.log('   3. Add any default mappings if needed');
console.log('   4. Place the file in your extension\'s data/ folder');

