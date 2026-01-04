const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

// Simple test runner
const runTests = async () => {
    const testDir = __dirname;
    const files = fs.readdirSync(testDir).filter(f => f.endsWith('.test.js'));

    console.log(`Running ${files.length} test files...`);

    let failed = 0;

    for (const file of files) {
        console.log(`\n--- ${file} ---`);
        try {
            require(path.join(testDir, file));
        } catch (e) {
            console.error(`FAILED: ${file}`);
            console.error(e);
            failed++;
        }
    }

    if (failed > 0) {
        console.error(`\n${failed} tests failed.`);
        process.exit(1);
    } else {
        console.log("\nAll tests passed!");
    }
};

runTests();
