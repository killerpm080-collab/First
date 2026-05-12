#!/usr/bin/env node

const { spawn } = require('child_process');
const path = require('path');

// Start the backend server
console.log('Starting AI Digital Marketplace...');
console.log('================================');

const server = spawn('npx', ['tsx', 'server/index.ts'], {
  cwd: __dirname,
  stdio: 'inherit',
  shell: true
});

server.on('error', (err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});

process.on('SIGINT', () => {
  console.log('\nShutting down...');
  server.kill('SIGINT');
  process.exit(0);
});
