# How to Bundle Default Data with the Extension

This guide explains how to include a default data file that gets automatically loaded when users install the extension.

## ⚠️ Important: Updating Default Data

**When you update the default data file (e.g., provide a new Excel file), you can choose:**

### Option A: Replace Providers, Keep Mappings (Recommended for Periodic Updates)
- ✅ **Replace provider list** - Old providers replaced with new Excel data
- ✅ **Preserve all mappings** - Field mappings (like "NPI field → NPI") stay intact
- ✅ **Mappings still work** - Field mappings work with new provider data

### Option B: Merge Everything
- ✅ **Preserve all user-created mappings** - Never overwritten
- ✅ **Merge new default providers** - Added to existing list
- ✅ **Merge new default mappings** - Added without duplicates
- ❌ **Never delete user data** - All user modifications are kept

**Mappings are always preserved** - This means field mappings continue to work even when you update the provider list!

## Quick Start: Using an Excel File

**Yes, you can provide an Excel file!** Here's the simplest workflow:

1. **Prepare your Excel file** with provider data (columns like: First Name, Last Name, NPI, DEA, Email, Address, etc.)
2. **Export to CSV**: In Excel, go to File → Save As → Choose "CSV (Comma delimited) (*.csv)"
3. **Convert CSV to JSON**: Use the conversion script below or an online converter
4. **Place the JSON file** in your extension's `data/` folder as `default-data.json`
5. **Package the extension** - the default data will be included automatically

### Excel to JSON Conversion Script

You can use this simple Node.js script to convert your CSV to the extension's JSON format:

```javascript
// convert-excel-to-default-data.js
const fs = require('fs');
const csv = require('csv-parser');

const csvFilePath = 'your-providers.csv';
const outputPath = 'data/default-data.json';

const providers = [];

fs.createReadStream(csvFilePath)
  .pipe(csv())
  .on('data', (row) => {
    // Convert CSV row to provider object
    providers.push({
      firstName: row['First Name'] || row['firstName'],
      lastName: row['Last Name'] || row['lastName'],
      npi: row['NPI'] || row['npi'],
      dea: row['DEA'] || row['dea'],
      email: row['Email'] || row['email'],
      // Add other fields as needed
    });
  })
  .on('end', () => {
    const defaultData = {
      providers: providers,
      mappings: [], // Add default mappings if you have them
      version: '1.0.0'
    };
    
    fs.writeFileSync(outputPath, JSON.stringify(defaultData, null, 2));
    console.log(`Converted ${providers.length} providers to ${outputPath}`);
  });
```

**To run:** `npm install csv-parser` then `node convert-excel-to-default-data.js`

### Alternative: Online Conversion

1. Export Excel to CSV
2. Use an online CSV to JSON converter (like https://www.convertcsv.com/csv-to-json.htm)
3. Format the JSON to match the structure below
4. Save as `data/default-data.json`

## Extension Directory Structure

Your Chrome extension should have a structure like this:

```
extension/
├── manifest.json
├── background.js (or service worker)
├── popup.html
├── popup.js
├── content.js
├── data/
│   └── default-data.json    ← Your bundled default data file
└── icons/
    └── icon.png
```

## Step 1: Create the Default Data File

Create a file called `default-data.json` (or any name you prefer) in a `data/` folder within your extension directory.

**Example `data/default-data.json`:**

```json
{
  "mappings": [
    {
      "urlPattern": "https://example-state-board.gov/application",
      "fields": [
        {
          "selector": "#firstName",
          "fieldType": "firstName"
        },
        {
          "selector": "#lastName",
          "fieldType": "lastName"
        },
        {
          "selector": "#npi",
          "fieldType": "npi"
        }
      ]
    }
  ],
  "providers": [
    {
      "id": "template-1",
      "firstName": "Template",
      "lastName": "Provider",
      "npi": "0000000000",
      "note": "This is a template - replace with actual provider data"
    }
  ],
  "version": "1.0.0"
}
```

## Step 2: Update manifest.json

Make sure your `manifest.json` includes the data file in the extension package:

```json
{
  "manifest_version": 3,
  "name": "License AutoFill",
  "version": "1.0.0",
  "background": {
    "service_worker": "background.js"
  },
  "permissions": [
    "storage",
    "activeTab"
  ],
  "web_accessible_resources": [
    {
      "resources": ["data/default-data.json"],
      "matches": ["<all_urls>"]
    }
  ]
}
```

## Step 3: Load Default Data on Installation

In your `background.js` (or service worker), add code to load the default data when the extension is first installed:

```javascript
// background.js

// Load default data file
async function loadDefaultData() {
  try {
    const response = await fetch(chrome.runtime.getURL('data/default-data.json'));
    const defaultData = await response.json();
    return defaultData;
  } catch (error) {
    console.error('Error loading default data:', error);
    return null;
  }
}

// Initialize extension with default data
chrome.runtime.onInstalled.addListener(async (details) => {
  if (details.reason === 'install') {
    // First time installation
    const defaultData = await loadDefaultData();
    
    if (defaultData) {
      // Check if user already has data
      const existingData = await chrome.storage.local.get(['mappings', 'providers']);
      
      // Only load defaults if user doesn't have existing data
      if (!existingData.mappings || existingData.mappings.length === 0) {
        await chrome.storage.local.set({
          mappings: defaultData.mappings || [],
          providers: defaultData.providers || [],
          defaultDataVersion: defaultData.version || '1.0.0'
        });
        console.log('Default data loaded successfully');
      }
    }
  } else if (details.reason === 'update') {
    // Extension was updated - you can check if default data needs updating
    const currentVersion = await chrome.storage.local.get('defaultDataVersion');
    const defaultData = await loadDefaultData();
    
    if (defaultData && defaultData.version !== currentVersion.defaultDataVersion) {
      // Merge or update default data
      // Implementation depends on your needs
    }
  }
});
```

## Step 4: Alternative - Load from Content Script

If you prefer to load the data from a content script or popup:

```javascript
// popup.js or content.js

async function initializeDefaultData() {
  // Check if this is first run
  const result = await chrome.storage.local.get('initialized');
  
  if (!result.initialized) {
    // Load default data
    const response = await fetch(chrome.runtime.getURL('data/default-data.json'));
    const defaultData = await response.json();
    
    // Store in Chrome storage
    await chrome.storage.local.set({
      mappings: defaultData.mappings || [],
      providers: defaultData.providers || [],
      initialized: true
    });
  }
}

// Call on popup open or page load
initializeDefaultData();
```

## Step 5: Packaging the Extension

When you create the ZIP file for distribution:

1. Include the `data/default-data.json` file in your extension folder
2. Zip the entire extension directory
3. The default data will be bundled with the extension

## Best Practices

1. **Version Your Data**: Include a version number in your default data file so you can update it in future releases
2. **Don't Overwrite User Data**: Always check if the user already has data before loading defaults
3. **Merge Strategy**: Decide whether defaults should merge with existing data or only load if empty
4. **Keep It Small**: Default data files should be reasonably sized to avoid slow extension loads
5. **Document the Format**: Make sure your default data matches the expected format your extension uses

## Example: Updating Default Data (Preserving User Data)

**Important:** When updating the default data file, you want to preserve existing user data and mappings. Here's how to handle updates safely:

### Strategy 1: Merge New Providers, Preserve All Mappings

```javascript
chrome.runtime.onInstalled.addListener(async (details) => {
  if (details.reason === 'update') {
    const defaultData = await loadDefaultData();
    const current = await chrome.storage.local.get([
      'mappings', 
      'providers', 
      'defaultDataVersion',
      'userProviders' // Track which providers user added
    ]);
    
    // Only update if version changed
    if (defaultData.version !== current.defaultDataVersion) {
      // PRESERVE ALL USER MAPPINGS - never overwrite
      const existingMappings = current.mappings || [];
      const newDefaultMappings = defaultData.mappings || [];
      
      // Merge mappings, avoiding duplicates by URL pattern
      const updatedMappings = [...existingMappings];
      newDefaultMappings.forEach(newMapping => {
        const exists = updatedMappings.some(m => m.urlPattern === newMapping.urlPattern);
        if (!exists) {
          updatedMappings.push(newMapping);
        }
      });
      
      // MERGE PROVIDERS - add new ones, keep existing
      const existingProviders = current.providers || [];
      const newDefaultProviders = defaultData.providers || [];
      const existingProviderIds = new Set(
        existingProviders.map(p => p.id || `${p.firstName}-${p.lastName}-${p.npi}`)
      );
      
      // Add new default providers that don't already exist
      const mergedProviders = [...existingProviders];
      newDefaultProviders.forEach(newProvider => {
        const providerId = newProvider.id || `${newProvider.firstName}-${newProvider.lastName}-${newProvider.npi}`;
        if (!existingProviderIds.has(providerId)) {
          mergedProviders.push(newProvider);
        }
      });
      
      await chrome.storage.local.set({
        mappings: updatedMappings, // All mappings preserved
        providers: mergedProviders, // User providers + new defaults
        defaultDataVersion: defaultData.version
      });
      
      console.log('Default data updated without losing user data');
    }
  }
});
```

### Strategy 2: Update Providers, Never Touch Mappings

If you only want to update the provider list from your Excel file:

```javascript
chrome.runtime.onInstalled.addListener(async (details) => {
  if (details.reason === 'update') {
    const defaultData = await loadDefaultData();
    const current = await chrome.storage.local.get(['mappings', 'providers', 'defaultDataVersion']);
    
    if (defaultData.version !== current.defaultDataVersion) {
      // NEVER TOUCH USER MAPPINGS - they are always preserved
      const existingMappings = current.mappings || [];
      
      // Update providers: merge new defaults with existing
      const existingProviders = current.providers || [];
      const newDefaultProviders = defaultData.providers || [];
      
      // Create a map of existing providers by NPI (or your unique identifier)
      const providerMap = new Map();
      existingProviders.forEach(p => {
        const key = p.npi || `${p.firstName}-${p.lastName}`;
        providerMap.set(key, p);
      });
      
      // Add/update providers from default data
      newDefaultProviders.forEach(newProvider => {
        const key = newProvider.npi || `${newProvider.firstName}-${newProvider.lastName}`;
        if (!providerMap.has(key)) {
          // New provider - add it
          providerMap.set(key, newProvider);
        } else {
          // Provider exists - you can choose to update or skip
          // Option A: Skip (preserve user's version)
          // Option B: Update (replace with new default)
          // providerMap.set(key, newProvider);
        }
      });
      
      const mergedProviders = Array.from(providerMap.values());
      
      await chrome.storage.local.set({
        mappings: existingMappings, // Mappings never change
        providers: mergedProviders, // Updated provider list
        defaultDataVersion: defaultData.version
      });
    }
  }
});
```

### Strategy 3: Track User-Modified Data

For more control, track what users have modified:

```javascript
// On first install
chrome.runtime.onInstalled.addListener(async (details) => {
  if (details.reason === 'install') {
    const defaultData = await loadDefaultData();
    await chrome.storage.local.set({
      mappings: defaultData.mappings || [],
      providers: defaultData.providers || [],
      defaultDataVersion: defaultData.version,
      userModifiedMappings: [], // Track which mappings user created/modified
      userAddedProviders: [] // Track which providers user added
    });
  }
  
  if (details.reason === 'update') {
    const defaultData = await loadDefaultData();
    const current = await chrome.storage.local.get([
      'mappings',
      'providers',
      'defaultDataVersion',
      'userModifiedMappings',
      'userAddedProviders'
    ]);
    
    if (defaultData.version !== current.defaultDataVersion) {
      // Preserve user-modified mappings
      const userMappings = current.mappings.filter(m => 
        current.userModifiedMappings.includes(m.urlPattern)
      );
      
      // Add new default mappings
      const newDefaultMappings = defaultData.mappings || [];
      const existingDefaultMappings = current.mappings.filter(m => 
        !current.userModifiedMappings.includes(m.urlPattern)
      );
      
      // Merge: user mappings + existing defaults + new defaults
      const allMappings = [...userMappings, ...existingDefaultMappings];
      newDefaultMappings.forEach(newMapping => {
        const exists = allMappings.some(m => m.urlPattern === newMapping.urlPattern);
        if (!exists) {
          allMappings.push(newMapping);
        }
      });
      
      // Similar logic for providers...
      
      await chrome.storage.local.set({
        mappings: allMappings,
        defaultDataVersion: defaultData.version
      });
    }
  }
});
```

### Strategy 4: Replace Providers, Keep All Mappings (Recommended for Periodic Updates)

**Use Case:** You update the provider list from Excel periodically and want to replace old providers with new ones, but keep all field mappings intact.

```javascript
chrome.runtime.onInstalled.addListener(async (details) => {
  if (details.reason === 'update') {
    const defaultData = await loadDefaultData();
    const current = await chrome.storage.local.get(['mappings', 'providers', 'defaultDataVersion']);
    
    if (defaultData.version !== current.defaultDataVersion) {
      // REPLACE providers with new default data
      const updatedProviders = defaultData.providers || [];
      
      // PRESERVE ALL MAPPINGS - never touch them
      const existingMappings = current.mappings || [];
      
      await chrome.storage.local.set({
        mappings: existingMappings, // All mappings preserved - NPI field still maps to NPI
        providers: updatedProviders, // Provider list replaced with new Excel data
        defaultDataVersion: defaultData.version
      });
      
      console.log('Providers updated, mappings preserved');
      console.log(`Updated ${updatedProviders.length} providers`);
      console.log(`Preserved ${existingMappings.length} mappings`);
    }
  }
});
```

**How this works:**
- ✅ **Mappings stay intact** - All field mappings (like "NPI field → NPI data") are preserved
- ✅ **Providers are replaced** - Old provider list is replaced with new Excel data
- ✅ **Mappings still work** - When auto-filling, the extension uses the new provider data with the existing mappings

**Example:**
- Before: Provider "John Doe" with NPI "1234567890", mapping says "NPI field → NPI"
- After update: Provider list replaced, but mapping still says "NPI field → NPI"
- Result: Extension still fills NPI field correctly, just with updated provider data

## Key Principles for Updates

1. **Never overwrite user mappings** - User-created mappings should always be preserved
2. **Choose your strategy** - Merge providers OR replace providers (mappings always preserved)
3. **Use unique identifiers** - Use NPI, URL patterns, or IDs to avoid duplicates
4. **Version your data** - Track which version of default data is installed
5. **Give users control** - Consider letting users choose to reset to defaults if needed

## Testing

1. Load the extension in developer mode
2. Check Chrome DevTools → Application → Storage → Local Storage
3. Verify that default data was loaded
4. Test that user-created data isn't overwritten

