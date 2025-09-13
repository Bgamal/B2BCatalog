const { execSync } = require('child_process');

console.log('Testing catalog-next-tests configuration...\n');

try {
  // Test simple working tests first
  console.log('Running simple test...');
  execSync('npm test -- tests/simple.test.js', { 
    stdio: 'inherit', 
    cwd: __dirname 
  });
  
  console.log('\nRunning component tests...');
  execSync('npm test -- tests/components/Logo.test.tsx', { 
    stdio: 'inherit', 
    cwd: __dirname 
  });
  
  console.log('\nRunning utility tests...');
  execSync('npm test -- tests/unit/simple-utils.test.ts', { 
    stdio: 'inherit', 
    cwd: __dirname 
  });
  
  console.log('\nAll tests completed successfully!');
} catch (error) {
  console.error('Test execution failed:', error.message);
  process.exit(1);
}
