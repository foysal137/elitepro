import fs from 'fs';
let content = fs.readFileSync('src/components/Storefront.tsx', 'utf8');

// Replace all \n literals back to real newlines for that line
content = content.replace(/\\n/g, '\n');

fs.writeFileSync('src/components/Storefront.tsx', content);
