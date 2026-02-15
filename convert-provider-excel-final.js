/**
 * Final version: Convert Provider Excel to default-data.json
 * Properly extracts data from structured provider sheets
 */

const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');

const excelFilePath = path.join(__dirname, 'Data Source', 'Provider _ Compliance Dashboard.xlsx');
const outputPath = path.join(__dirname, 'data', 'default-data.json');

const dataDir = path.dirname(outputPath);
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

console.log('Reading Excel file...');
const workbook = XLSX.readFile(excelFilePath);

// Only include actual provider name sheets (exclude all summary/dashboard sheets)
const excludeSheets = [
  'Provider Info', 'CSR', 'In-State Office', 'Resource Pool TRT', 
  'Resource Pool HRT', 'Resource Pool GLP', 'USA', 'Expansion Plan',
  'Insured States', 'Roadmap', 'SteadyMD', 'CPA state rules',
  '2nd CS license', 'State CS Refill Guidelines', 'Sheet123', 'Sheet124', 'Sheet125',
  'RN Info', 'MACSPharm Team Info', 'Provider Licensing by State',
  'RN licensing by state', 'State Rules', 'State License Requirements Tabl',
  'Licensing Requirements - RNs', 'Licensing Requirements - NPs',
  'Licensing Requirements - MDs', 'Licensing Requirements - DOs',
  'PMP', 'DEA', 'CPA', 'CEU - RNs', 'CEUs - NPs', 'CEUs - MDs', 'CEUs - DOs',
  'Sheet135', 'Provider New AppsTo do List', 'ProviderRN Renewals',
  'Provider Licensing by State ' // Note the space
];

const providerSheets = workbook.SheetNames.filter(name => 
  !excludeSheets.includes(name) && 
  name.length < 50 &&
  (name.includes(',') || /^[A-Z][a-z]+\s+[A-Z]/.test(name)) // Has comma or looks like "FirstName LastName"
);

console.log(`\nProcessing ${providerSheets.length} provider sheets...`);

const providers = [];

providerSheets.forEach((sheetName, index) => {
  try {
    const worksheet = workbook.Sheets[sheetName];
    const data = XLSX.utils.sheet_to_json(worksheet, { defval: '', raw: false });
    
    if (data.length === 0) return;
    
    let provider = {
      id: `provider-${index + 1}`,
      sheetName: sheetName
    };
    
    // Extract name from sheet name (e.g., "Lindsay B, NP" -> "Lindsay B")
    const nameFromSheet = sheetName.split(',')[0].trim();
    const nameParts = nameFromSheet.split(/\s+/);
    if (nameParts.length >= 2) {
      provider.firstName = nameParts[0];
      provider.lastName = nameParts.slice(1).join(' ');
    } else if (nameParts.length === 1) {
      provider.firstName = nameParts[0];
    }
    
    // Find column names
    const columns = data.length > 0 ? Object.keys(data[0]) : [];
    const nameColumn = columns.find(c => c.includes('NAME') || c.includes('Name') || c === 'NAME/INFO' || c === '__EMPTY');
    const licenseColumn = columns.find(c => c.includes('LICENSE') || c.includes('License'));
    const statesColumn = columns.find(c => c.includes('States Licensed') || c.includes('License'));
    
    // Parse each row
    data.forEach(row => {
      // Extract from NAME/INFO column
      if (nameColumn && row[nameColumn]) {
        const nameValue = String(row[nameColumn]).trim();
        
        // NPI
        const npiMatch = nameValue.match(/NPI[:\s#]*(\d{10})/i);
        if (npiMatch && npiMatch[1]) {
          provider.npi = npiMatch[1];
        }
        
        // Full name (if not already set)
        if (!provider.firstName && nameValue && !nameValue.includes('NPI') && nameValue.length > 3) {
          const cleanName = nameValue.replace(/NPI[:\s#]*\d{10}/gi, '').trim();
          if (cleanName && /^[A-Z]/.test(cleanName)) {
            const parts = cleanName.split(/\s+/).filter(p => p.length > 0 && !p.match(/^\d+$/));
            if (parts.length >= 2) {
              provider.firstName = parts[0];
              provider.lastName = parts.slice(1).join(' ').replace(/\s*-\s*(NP|MD|DO|RN|FNP).*$/i, '').trim();
            }
          }
        }
        
        // Address
        if (nameValue && /\d+\s+[A-Z][a-z]+/.test(nameValue) && 
            (nameValue.includes('St') || nameValue.includes('Ave') || nameValue.includes('Rd') || 
             nameValue.includes('Dr') || nameValue.includes('Ln') || nameValue.includes('Way'))) {
          const addressLines = nameValue.split('\n').filter(line => 
            /\d+\s+[A-Z]/.test(line) && line.length > 10
          );
          if (addressLines.length > 0 && !provider.address) {
            provider.address = addressLines[0].trim();
          }
        }
      }
      
      // Extract from States Licensed and LICENSE # columns
      if (statesColumn && row[statesColumn]) {
        const stateValue = String(row[statesColumn]).trim();
        const licenseValue = licenseColumn ? String(row[licenseColumn] || '').trim() : '';
        
        // DEA
        if (stateValue.includes('DEA') && licenseValue && licenseValue.length > 0) {
          // Extract DEA number (format: 2 letters + 7 digits)
          const deaMatch = licenseValue.match(/([A-Z]{2}\d{7})/);
          if (deaMatch) {
            provider.dea = deaMatch[1];
          } else if (licenseValue && !licenseValue.includes('DEA')) {
            provider.dea = licenseValue;
          }
        }
      }
      
      // Extract email and phone from any column
      Object.keys(row).forEach(key => {
        const value = String(row[key] || '').trim();
        
        // Email
        if (value.includes('@') && /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/.test(value)) {
          const emailMatch = value.match(/([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/);
          if (emailMatch && !provider.email) {
            provider.email = emailMatch[1];
          }
        }
        
        // Phone
        if ((key.toLowerCase().includes('phone') || key.includes('PH')) && 
            /\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/.test(value)) {
          const phoneMatch = value.match(/(\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4})/);
          if (phoneMatch && !provider.phone) {
            provider.phone = phoneMatch[1];
          }
        }
      });
    });
    
    // Only add if we have meaningful data
    if (provider.npi || (provider.firstName && provider.lastName)) {
      providers.push(provider);
    }
  } catch (error) {
    console.error(`Error processing ${sheetName}:`, error.message);
  }
});

console.log(`\n✅ Extracted ${providers.length} providers`);

// Show samples
if (providers.length > 0) {
  console.log('\nSample providers:');
  providers.slice(0, 5).forEach((p, i) => {
    console.log(`  ${i + 1}. ${p.firstName} ${p.lastName || ''} - NPI: ${p.npi || 'N/A'}, DEA: ${p.dea || 'N/A'}`);
  });
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
console.log('\n📋 The file is ready. Review it and let me know if you need any adjustments!');

