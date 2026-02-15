/**
 * Final Clean Provider Excel Converter
 * Uses sheet name as primary source, carefully extracts other data
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
  'Provider Licensing by State '
];

const providerSheets = workbook.SheetNames.filter(name => 
  !excludeSheets.includes(name) && 
  name.length < 50 &&
  (name.includes(',') || /^[A-Z][a-z]+\s+[A-Z]/.test(name))
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
    
    // PRIMARY: Extract name from sheet name (most reliable)
    // e.g., "Lindsay B, NP" -> "Lindsay B"
    // e.g., "Ashley E- NP" -> "Ashley E"  
    // e.g., "Alexis F-H, NP" -> "Alexis F-H"
    const nameFromSheet = sheetName.split(',')[0].trim().replace(/\s*-\s*$/, '');
    const nameParts = nameFromSheet.split(/\s+/);
    if (nameParts.length >= 2) {
      provider.firstName = nameParts[0];
      provider.lastName = nameParts.slice(1).join(' ');
    } else if (nameParts.length === 1) {
      provider.firstName = nameParts[0];
    }
    
    // Find columns
    const columns = data.length > 0 ? Object.keys(data[0]) : [];
    const nameCol = columns.find(c => c.includes('NAME') || c.includes('Name') || c === 'NAME/INFO' || c === '__EMPTY');
    const statesCol = columns.find(c => c.includes('States Licensed') || (c.includes('License') && !c.includes('#')));
    const licenseCol = columns.find(c => (c.includes('LICENSE') || c.includes('License')) && c.includes('#'));
    
    // Parse rows
    data.forEach(row => {
      const nameValue = nameCol ? String(row[nameCol] || '').trim() : '';
      const statesValue = statesCol ? String(row[statesCol] || '').trim() : '';
      const licenseValue = licenseCol ? String(row[licenseCol] || '').trim() : '';
      
      // Extract NPI
      if (nameValue) {
        const npiMatch = nameValue.match(/NPI[:\s#]*(\d{10})/i);
        if (npiMatch && npiMatch[1]) {
          provider.npi = npiMatch[1];
        }
      }
      
      // Extract full name from NAME column ONLY if it's clearly a real name
      // Skip if it starts with common non-name patterns
      if (nameValue && nameValue.length > 5) {
        const skipPatterns = [
          /^(DOB|SS|SS#|phone|email|PH|eml|wk eml|pers eml|POB|Practice address|Mailing|Demographics|Criminial|Military|Maiden|Has|Hair|Mom|Eye)/i,
          /^[A-Z]{2}\s*$/, // Two letter state codes
          /^\d+/, // Starts with number
          /:/, // Contains colon (like "DOB: 11/29/1989")
        ];
        
        const shouldSkip = skipPatterns.some(pattern => pattern.test(nameValue));
        
        if (!shouldSkip && 
            /^[A-Z][a-z]+(\s+[A-Z][a-z]+)+/.test(nameValue) && 
            !nameValue.includes('@') && 
            nameValue.length < 50 &&
            !nameValue.match(/^\d+$/)) {
          
          // This looks like a real full name
          const cleanName = nameValue
            .replace(/\s*-\s*(NP|MD|DO|RN|FNP|FNP-C|DNP).*$/i, '')
            .trim();
          
          const nameParts = cleanName.split(/\s+/).filter(p => 
            p.length > 0 && 
            !p.match(/^\d+$/) && 
            !p.match(/^(St|Ave|Rd|Dr|Ln|Way|Blvd|Ct|Pl|Apt|Suite)/i) &&
            p.length > 1
          );
          
          // Only use if we have at least 2 proper name parts
          if (nameParts.length >= 2 && nameParts[0].length > 2 && nameParts.every(p => /^[A-Z][a-z]+/.test(p))) {
            provider.firstName = nameParts[0];
            provider.lastName = nameParts.slice(1).join(' ');
          }
        }
      }
      
      // Extract DEA number
      if (statesValue && statesValue.includes('DEA') && licenseValue) {
        // DEA format: 2 letters + 7 digits (e.g., MD9419777, ME7323835)
        const deaMatch = licenseValue.match(/([A-Z]{2}\d{7})/);
        if (deaMatch) {
          provider.dea = deaMatch[1];
        } else if (licenseValue && licenseValue.length >= 7 && !licenseValue.includes('DEA')) {
          provider.dea = licenseValue;
        }
      }
      
      // Extract address
      if (nameValue && /\d+\s+[A-Z][a-z]+/.test(nameValue)) {
        const addressPattern = /(\d+\s+[A-Z][a-z\s]+(?:St|Ave|Rd|Dr|Ln|Way|Blvd|Ct|Pl|Cir)[^@\n]*)/i;
        const addressMatch = nameValue.match(addressPattern);
        if (addressMatch && !provider.address) {
          provider.address = addressMatch[1].trim().split('\n')[0];
        }
      }
      
      // Extract email and phone
      Object.keys(row).forEach(key => {
        const value = String(row[key] || '').trim();
        
        // Email
        if (value.includes('@') && /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/.test(value)) {
          const emailMatch = value.match(/([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/);
          if (emailMatch && !provider.email) {
            provider.email = emailMatch[1].toLowerCase();
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
  console.log('\nSample providers (first 5):');
  providers.slice(0, 5).forEach((p, i) => {
    console.log(`\n${i + 1}. ${p.firstName} ${p.lastName || ''}`);
    console.log(`   NPI: ${p.npi || 'N/A'}`);
    console.log(`   DEA: ${p.dea || 'N/A'}`);
    console.log(`   Email: ${p.email || 'N/A'}`);
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
console.log('\n📋 The JSON file is ready to bundle with your extension!');

