/**
 * Convert Provider Excel file to default-data.json
 * Extracts provider data from individual provider sheets
 */

const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');

const excelFilePath = path.join(__dirname, 'Data Source', 'Provider _ Compliance Dashboard.xlsx');
const outputPath = path.join(__dirname, 'data', 'default-data.json');

// Create data directory if it doesn't exist
const dataDir = path.dirname(outputPath);
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

console.log('Reading Excel file...');
const workbook = XLSX.readFile(excelFilePath);

// Provider sheet names (individual provider sheets)
// These are sheets that contain individual provider information
const providerSheetPatterns = [
  /^[A-Z][a-z]+\s+[A-Z]/,  // Pattern like "Lindsay B, NP"
  /^[A-Z][a-z]+\s+[A-Z][a-z]+/,  // Pattern like "Rachel Razi"
];

// Get all sheet names
const allSheets = workbook.SheetNames;
console.log(`\nFound ${allSheets.length} sheets`);

// Filter to provider sheets (exclude summary/dashboard sheets)
const providerSheets = allSheets.filter(sheetName => {
  // Exclude known non-provider sheets
  const excludeSheets = [
    'Provider Info', 'CSR', 'In-State Office', 'Resource Pool TRT', 
    'Resource Pool HRT', 'Resource Pool GLP', 'USA', 'Expansion Plan',
    'Insured States', 'Roadmap', 'SteadyMD', 'CPA state rules',
    '2nd CS license', 'State CS Refill Guidelines', 'Sheet123', 'Sheet124', 'Sheet125'
  ];
  
  if (excludeSheets.includes(sheetName)) return false;
  
  // Include sheets that look like provider names
  return providerSheetPatterns.some(pattern => pattern.test(sheetName)) ||
         sheetName.includes(',') || // Has comma (like "Name, Title")
         sheetName.length < 30; // Short names are likely providers
});

console.log(`\nProvider sheets found: ${providerSheets.length}`);
providerSheets.forEach(name => console.log(`  - ${name}`));

// Extract provider data from each sheet
const providers = [];

providerSheets.forEach(sheetName => {
  const worksheet = workbook.Sheets[sheetName];
  const data = XLSX.utils.sheet_to_json(worksheet, { defval: '' });
  
  if (data.length === 0) return;
  
  // Extract provider information
  let provider = {
    id: `provider-${providers.length + 1}`,
    sheetName: sheetName
  };
  
  // Look for common patterns in the data
  data.forEach(row => {
    // Extract NPI
    Object.keys(row).forEach(key => {
      const value = String(row[key] || '').trim();
      
      // NPI patterns
      if (key.includes('NPI') || key.includes('npi') || value.includes('NPI:')) {
        const npiMatch = value.match(/NPI[:\s]*(\d{10})/i) || value.match(/(\d{10})/);
        if (npiMatch && npiMatch[1]) {
          provider.npi = npiMatch[1];
        }
      }
      
      // Name extraction
      if (key.includes('NAME') || key.includes('Name') || key === '__EMPTY') {
        if (value && !value.includes('NPI') && value.length > 3 && !value.match(/^\d+$/)) {
          // Clean up name
          const cleanName = value.replace(/NPI[:\s]*\d{10}/gi, '').trim();
          if (cleanName && !provider.firstName && !provider.lastName) {
            const nameParts = cleanName.split(/\s+/).filter(p => p.length > 0);
            if (nameParts.length >= 2) {
              provider.firstName = nameParts[0];
              provider.lastName = nameParts.slice(1).join(' ');
            } else if (nameParts.length === 1) {
              provider.firstName = nameParts[0];
            }
          }
        }
      }
      
      // Email
      if (key.includes('email') || key.includes('Email') || value.includes('@')) {
        const emailMatch = value.match(/([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/);
        if (emailMatch) {
          provider.email = emailMatch[1];
        }
      }
      
      // Phone
      if (key.includes('phone') || key.includes('Phone') || key.includes('PH')) {
        const phoneMatch = value.match(/(\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4})/);
        if (phoneMatch) {
          provider.phone = phoneMatch[1];
        }
      }
      
      // DEA
      if (key.includes('DEA') && value && value.length > 0) {
        provider.dea = value;
      }
      
      // Address (look for street addresses)
      if (value && /\d+\s+[A-Z]/.test(value) && value.length > 10) {
        if (!provider.address) {
          provider.address = value;
        }
      }
    });
  });
  
  // If we found at least an NPI or name, add the provider
  if (provider.npi || provider.firstName || provider.lastName) {
    // Clean up provider name from sheet name if needed
    if (!provider.firstName && sheetName.includes(',')) {
      const nameFromSheet = sheetName.split(',')[0].trim();
      const nameParts = nameFromSheet.split(/\s+/);
      if (nameParts.length >= 2) {
        provider.firstName = nameParts[0];
        provider.lastName = nameParts.slice(1).join(' ');
      }
    }
    
    providers.push(provider);
  }
});

console.log(`\n✅ Extracted ${providers.length} providers`);

// Show sample
if (providers.length > 0) {
  console.log('\nSample provider:');
  console.log(JSON.stringify(providers[0], null, 2));
}

// Create default data structure
const defaultData = {
  providers: providers,
  mappings: [],
  version: '1.0.0',
  createdAt: new Date().toISOString(),
  sourceFile: 'Provider _ Compliance Dashboard.xlsx',
  totalProviders: providers.length
};

// Write JSON file
fs.writeFileSync(outputPath, JSON.stringify(defaultData, null, 2));

console.log(`\n✅ Conversion complete!`);
console.log(`   Output: ${outputPath}`);
console.log(`   Total providers: ${providers.length}`);
console.log('\n📋 Next steps:');
console.log('   1. Review the generated JSON file');
console.log('   2. Verify provider data is correct');
console.log('   3. Add any missing fields manually if needed');
console.log('   4. Place the file in your extension\'s data/ folder');

