// Test script to check component imports
const fs = require('fs');

const components = [
  { name: 'Login', path: '/pages/Login' },
  { name: 'Signup', path: '/pages/Signup' },
  { name: 'Dashboard', path: '/pages/Dashboard' },
  { name: 'Profile', path: '/pages/Profile' },
  { name: 'Budgets', path: '/pages/Budgets' },
  { name: 'Transactions', path: '/pages/Transactions' },
  { name: 'Goals', path: '/pages/Goals' },
  { name: 'CashCoach', path: '/pages/CashCoach' },
  { name: 'Layout', path: '/components/Layout' },
];

console.log('Testing component imports...\n');

components.forEach(component => {
  try {
    const filePath = `src${component.path}.tsx`;
    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, 'utf8');
      
      // Check for default export
      const defaultExportMatch = content.match(/export\s+default\s+(\w+)/);
      const functionMatch = content.match(new RegExp(`const\\s+${component.name}[\\s:=].*=>|function\\s+${component.name}`));
      
      console.log(`${component.name}:`);
      console.log(`  ✓ File exists: ${filePath}`);
      console.log(`  ✓ Default export: ${defaultExportMatch ? defaultExportMatch[1] : 'MISSING'}`);
      console.log(`  ✓ Component function: ${functionMatch ? 'Found' : 'MISSING'}`);
      
      // Check for problematic exports
      const hasEmptyExport = content.includes('export {};');
      const hasTypeExport = content.includes('export type {};');
      if (hasEmptyExport || hasTypeExport) {
        console.log(`  ⚠️  Problematic export found!`);
      }
      
    } else {
      console.log(`${component.name}: ❌ FILE NOT FOUND: ${filePath}`);
    }
    console.log('');
  } catch (error) {
    console.log(`${component.name}: ❌ ERROR: ${error.message}`);
  }
});
