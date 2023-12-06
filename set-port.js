import fs from 'fs';

// Read the .env file
const envFile = fs.readFileSync('.env', 'utf8');
let reactAppPort = 3000; // Default port

// Extract the REACT_APP_PORT value
const match = envFile.match(/^REACT_APP_PORT=(\d+)$/m);
if (match) {
    reactAppPort = match[1];
}

// Set the PORT value
process.env.PORT = reactAppPort.toString();

// Delete the existing .env.local file if it exists
if (fs.existsSync('.env.local')) {
    fs.unlinkSync('.env.local');
}

// Write the updated environment variable to a new .env file
fs.writeFileSync('.env.local', `PORT=${reactAppPort}\n`, { flag: 'a' });

export {};
