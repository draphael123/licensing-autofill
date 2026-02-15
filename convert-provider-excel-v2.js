/**
 * Convert Provider Excel file to default-data.json (Improved Version)
 * Extracts provider data from individual provider sheets with better parsing
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

// Exclude these sheets (not individual providers)
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
  'Sheet135', 'Provider New AppsTo do List', 'ProviderRN Renewals'
];

// Get provider sheets (individual provider names)
const providerSheets = workbook.SheetNames.filter(name => 
  !excludeSheets.includes(name) && name.length < 50
);

console.log(`\nFound ${providerSheets.length} provider sheets`);

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
    
    // Extract name from sheet name
    const nameMatch = sheetName.match(/^([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)/);
    if (nameMatch) {
      const fullName = nameMatch[1];
      const nameParts = fullName.split(/\s+/);
      if (nameParts.length >= 2) {
        provider.firstName = nameParts[0];
        provider.lastName = nameParts.slice(1).join(' ');
      } else {
        provider.firstName = fullName;
      }
    }
    
    // Parse data rows
    data.forEach(row => {
      Object.keys(row).forEach(key => {
        const value = String(row[key] || '').trim();
        if (!value) return;
        
        // NPI extraction
        if (value.includes('NPI') || key.includes('NPI')) {
          const npiMatch = value.match(/NPI[:\s#]*(\d{10})/i) || value.match(/(\d{10})/);
          if (npiMatch && npiMatch[1] && npiMatch[1].length === 10) {
            provider.npi = npiMatch[1];
          }
        }
        
        // Name extraction from NAME/INFO column
        if ((key.includes('NAME') || key.includes('Name') || key === 'NAME/INFO') && 
            value && !value.includes('NPI') && value.length > 3) {
          const cleanValue = value.replace(/NPI[:\s#]*\d{10}/gi, '').trim();
          if (cleanValue && cleanValue.length > 3 && !cleanValue.match(/^\d+$/)) {
            // Check if it looks like a name
            if (/^[A-Z][a-z]+/.test(cleanValue) && !provider.firstName) {
              const nameParts = cleanValue.split(/\s+/).filter(p => p.length > 0);
              if (nameParts.length >= 2) {
                provider.firstName = nameParts[0];
                provider.lastName = nameParts.slice(1).join(' ').replace(/\s*-\s*(NP|MD|DO|RN|FNP).*$/i, '').trim();
              }
            }
          }
        }
        
        // Email
        if (value.includes('@') && /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/.test(value)) {
          const emailMatch = value.match(/([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/);
          if (emailMatch) {
            provider.email = emailMatch[1];
          }
        }
        
        // Phone
        if ((key.includes('phone') || key.includes('Phone') || key.includes('PH')) && 
            /\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/.test(value)) {
          const phoneMatch = value.match(/(\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4})/);
          if (phoneMatch) {
            provider.phone = phoneMatch[1];
          }
        }
        
        // DEA - look in States Licensed column when it says "DEA"
        if (key.includes('States Licensed') || key.includes('License')) {
          if (value.includes('DEA')) {
            // Look for DEA number in LICENSE # column of same row
            const licenseKey = Object.keys(row).find(k => k.includes('LICENSE') || k.includes('License'));
            if (licenseKey && row[licenseKey]) {
              const deaValue = String(row[licenseKey]).trim();
              if (deaValue && deaValue.length > 0 && !provider.dea) {
                provider.dea = deaValue;
              }
            }
          }
        }
        
        // Address - look for street addresses
        if (value && /\d+\s+[A-Z][a-z]+/.test(value) && value.length > 15 && 
            (value.includes('St') || value.includes('Ave') || value.includes('Rd') || 
             value.includes('Dr') || value.includes('Ln') || value.includes('Way'))) {
          if (!provider.address) {
            provider.address = value.split('\n')[0]; // Take first line
          }
        }
      });
    });
    
    // Only add if we have at least a name or NPI
    if ((provider.firstName || provider.lastName) || provider.npi) {
      providers.push(provider);
    }
  } catch (error) {
    console.error(`Error processing sheet ${sheetName}:`, error.message);
  }
});

console.log(`\n✅ Extracted ${providers.length} providers`);

// Show samples
if (providers.length > 0) {
  console.log('\nFirst 3 providers:');
  providers.slice(0, 3).forEach((p, i) => {
    console.log(`\n${i + 1}. ${p.firstName} ${p.lastName || ''} (NPI: ${p.npi || 'N/A'})`);
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
console.log('\n📋 Review the file and let me know if you need any adjustments!');

