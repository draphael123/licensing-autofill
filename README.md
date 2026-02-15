# License AutoFill Landing Page

Single-page Next.js landing site for the License AutoFill Chrome extension.

## Tech Stack

- Next.js 14+ (App Router)
- TypeScript
- Tailwind CSS
- Framer Motion

## Development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the site.

## Adding Default Provider Data

To bundle default provider data with the extension:

1. **Prepare your Excel file** with provider data
2. **See HOW_TO_ADD_EXCEL_FILE.md** for step-by-step instructions
3. **Use convert-excel-to-default-data.js** to convert Excel/CSV to JSON
4. **See BUNDLING_DEFAULT_DATA.md** for technical implementation details

## Deployment

This project is configured for Vercel deployment. Simply connect your GitHub repository to Vercel for automatic deployments.

## Repository

[GitHub Repository](https://github.com/draphael123/licensing-autofill)

## Documentation

- **HOW_TO_ADD_EXCEL_FILE.md** - How to add and convert your Excel file
- **BUNDLING_DEFAULT_DATA.md** - Technical guide for bundling default data
- **convert-excel-to-default-data.js** - Conversion script for Excel/CSV files

