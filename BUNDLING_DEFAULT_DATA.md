# How to Bundle Default Data with the Extension

This guide explains how to include a default data file that gets automatically loaded when users install the extension.

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

## Example: Updating Default Data

If you need to update the default data in a future version:

```javascript
chrome.runtime.onInstalled.addListener(async (details) => {
  if (details.reason === 'update') {
    const defaultData = await loadDefaultData();
    const current = await chrome.storage.local.get(['mappings', 'defaultDataVersion']);
    
    // Only update if version changed
    if (defaultData.version !== current.defaultDataVersion) {
      // Merge new default mappings with existing user mappings
      const existingMappings = current.mappings || [];
      const newDefaultMappings = defaultData.mappings || [];
      
      // Combine, avoiding duplicates
      const updatedMappings = [...existingMappings];
      newDefaultMappings.forEach(newMapping => {
        const exists = updatedMappings.some(m => m.urlPattern === newMapping.urlPattern);
        if (!exists) {
          updatedMappings.push(newMapping);
        }
      });
      
      await chrome.storage.local.set({
        mappings: updatedMappings,
        defaultDataVersion: defaultData.version
      });
    }
  }
});
```

## Testing

1. Load the extension in developer mode
2. Check Chrome DevTools → Application → Storage → Local Storage
3. Verify that default data was loaded
4. Test that user-created data isn't overwritten

