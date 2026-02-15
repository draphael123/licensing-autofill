# How to Add Your Excel File

This guide explains the practical steps to add your Excel file and convert it to the default data for the extension.

## Option 1: Share the Excel File (Recommended)

**If you want me to help convert it:**

1. **Prepare your Excel file** with provider data
   - Include columns like: First Name, Last Name, NPI, DEA, Email, Address, etc.
   - Make sure the first row contains column headers

2. **Share the file** - You can:
   - Upload it to the repository
   - Share it via a file sharing service
   - Or just tell me where it is and I can help you convert it

3. **I'll convert it** - I can:
   - Read your Excel file structure
   - Convert it to the proper JSON format
   - Update the conversion script to match your column names
   - Generate the `data/default-data.json` file ready to bundle

## Option 2: Convert It Yourself

**If you want to do it yourself:**

### Step 1: Export Excel to CSV

1. Open your Excel file
2. Go to **File → Save As**
3. Choose **CSV (Comma delimited) (*.csv)** as the file type
4. Save it (e.g., as `providers.csv`)

### Step 2: Update the Conversion Script

1. Open `convert-excel-to-default-data.js`
2. Update the file path:
   ```javascript
   const csvFilePath = 'providers.csv'; // Your CSV file name
   ```
3. Update field mappings to match your column names:
   ```javascript
   const fieldMapping = {
     'First Name': 'firstName',      // Match your Excel column name
     'Last Name': 'lastName',
     'NPI': 'npi',
     'DEA': 'dea',
     'Email': 'email',
     // Add all your column names here
   };
   ```

### Step 3: Run the Conversion

1. Make sure you're in the project directory
2. Run:
   ```bash
   node convert-excel-to-default-data.js
   ```
3. The script will create `data/default-data.json`

### Step 4: Verify the Output

1. Check `data/default-data.json` to make sure it looks correct
2. Verify all your providers are included
3. Check that field names match what the extension expects

## Option 3: Use Online Converter

1. Export Excel to CSV
2. Use an online CSV to JSON converter (like https://www.convertcsv.com/csv-to-json.htm)
3. Format the JSON to match this structure:
   ```json
   {
     "providers": [
       {
         "firstName": "John",
         "lastName": "Doe",
         "npi": "1234567890",
         "dea": "DEA1234567",
         "email": "john.doe@example.com"
       }
     ],
     "mappings": [],
     "version": "1.0.0"
   }
   ```
4. Save as `data/default-data.json`

## What I Need From You

If you want me to help convert it, please provide:

1. **The Excel file** (or CSV export)
2. **Column names** - What are your column headers? (e.g., "First Name", "NPI", etc.)
3. **Any special requirements** - Are there any fields that need special handling?

## Quick Start

**Easiest way:**
1. Export your Excel to CSV
2. Share the CSV file with me
3. Tell me what your column names are
4. I'll convert it and set everything up

Or if you prefer to do it yourself:
1. Export Excel to CSV
2. Update `convert-excel-to-default-data.js` with your file path and column names
3. Run `node convert-excel-to-default-data.js`
4. Check `data/default-data.json`

## Next Steps After Conversion

Once you have `data/default-data.json`:

1. **Place it in your extension folder** under `data/default-data.json`
2. **Update the extension code** to load it (see BUNDLING_DEFAULT_DATA.md)
3. **Package the extension** - the default data will be included
4. **Test it** - Install the extension and verify the default data loads

## Need Help?

Just share your Excel file (or CSV) and I can:
- Convert it to the proper format
- Update the conversion script for your specific structure
- Generate the ready-to-use JSON file
- Help you integrate it into the extension

