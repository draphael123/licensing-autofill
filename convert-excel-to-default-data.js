/**
 * Convert Excel/CSV file to default-data.json for extension bundling
 * 
 * Usage:
 * 1. Export your Excel file to CSV
 * 2. Update csvFilePath below to point to your CSV file
 * 3. Run: node convert-excel-to-default-data.js
 */

const fs = require('fs');
const path = require('path');

// Configuration - Update these paths
const csvFilePath = 'your-providers.csv'; // Your CSV file path
const outputPath = 'data/default-data.json'; // Output JSON file

// Field mapping - adjust column names to match your CSV headers
const fieldMapping = {
  'First Name': 'firstName',
  'Last Name': 'lastName',
  'NPI': 'npi',
  'DEA': 'dea',
  'Email': 'email',
  'Phone': 'phone',
  'Specialty': 'specialty',
  'License Number': 'licenseNumber',
  'State': 'state',
  // Add more field mappings as needed
};

function parseCSV(csvContent) {
  const lines = csvContent.split('\n').filter(line => line.trim());
  if (lines.length === 0) return [];
  
  // Parse header row
  const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
  
  // Parse data rows
  const providers = [];
  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(',').map(v => v.trim().replace(/"/g, ''));
    const provider = {};
    
    headers.forEach((header, index) => {
      const value = values[index] || '';
      // Map CSV header to JSON field name
      const jsonField = fieldMapping[header] || header.toLowerCase().replace(/\s+/g, '');
      if (value) {
        provider[jsonField] = value;
      }
    });
    
    if (Object.keys(provider).length > 0) {
      providers.push(provider);
    }
  }
  
  return providers;
}

// Main conversion function
function convertCSVToDefaultData() {
  try {
    // Read CSV file
    if (!fs.existsSync(csvFilePath)) {
      console.error(`Error: CSV file not found at ${csvFilePath}`);
      console.log('Please update csvFilePath in this script to point to your CSV file.');
      process.exit(1);
    }
    
    const csvContent = fs.readFileSync(csvFilePath, 'utf-8');
    const providers = parseCSV(csvContent);
    
    // Create default data structure
    const defaultData = {
      providers: providers,
      mappings: [], // Add default mappings here if you have them
      version: '1.0.0',
      createdAt: new Date().toISOString()
    };
    
    // Create data directory if it doesn't exist
    const dataDir = path.dirname(outputPath);
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
    
    // Write JSON file
    fs.writeFileSync(outputPath, JSON.stringify(defaultData, null, 2));
    
    console.log('✅ Conversion successful!');
    console.log(`   Converted ${providers.length} providers`);
    console.log(`   Output: ${outputPath}`);
    console.log('\n📋 Next steps:');
    console.log('   1. Review the generated JSON file');
    console.log('   2. Add any default mappings if needed');
    console.log('   3. Place the file in your extension\'s data/ folder');
    console.log('   4. Package your extension');
    
  } catch (error) {
    console.error('Error converting CSV to JSON:', error.message);
    process.exit(1);
  }
}

// Run conversion
convertCSVToDefaultData();

