import { spawn, execSync } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');

console.log('\n🏨  Starting Hotel Management System (HMS) Full-Stack Dev Environment...\n');
console.log('  🌐 Frontend Web Application: \x1b[32mhttp://localhost:3000/\x1b[0m');
console.log('  🏨 Backend REST API:         \x1b[36mhttp://localhost:5000/api\x1b[0m');
console.log('  ❤️  API Health Check:         \x1b[36mhttp://localhost:5000/api/health\x1b[0m\n');

// 1. Start Backend with tsx watch
const backendProcess = spawn('npm run dev --workspace=backend', {
  cwd: rootDir,
  shell: true,
  stdio: 'pipe'
});

backendProcess.stdout.on('data', (data) => {
  const lines = data.toString().trim().split('\n');
  lines.forEach(line => {
    if (line) console.log(`\x1b[36m[BACKEND]\x1b[0m ${line}`);
  });
});

backendProcess.stderr.on('data', (data) => {
  const lines = data.toString().trim().split('\n');
  lines.forEach(line => {
    if (line) console.error(`\x1b[31m[BACKEND ERROR]\x1b[0m ${line}`);
  });
});

// 2. Start Frontend with Vite
const frontendProcess = spawn('npm run dev --workspace=frontend', {
  cwd: rootDir,
  shell: true,
  stdio: 'pipe'
});

frontendProcess.stdout.on('data', (data) => {
  const lines = data.toString().trim().split('\n');
  lines.forEach(line => {
    if (line) console.log(`\x1b[32m[FRONTEND]\x1b[0m ${line}`);
  });
});

frontendProcess.stderr.on('data', (data) => {
  const lines = data.toString().trim().split('\n');
  lines.forEach(line => {
    if (line) console.error(`\x1b[33m[FRONTEND INFO]\x1b[0m ${line}`);
  });
});

const killProcessTree = (pid) => {
  if (!pid) return;
  try {
    if (process.platform === 'win32') {
      execSync(`taskkill /pid ${pid} /T /F`, { stdio: 'ignore' });
    } else {
      process.kill(-pid, 'SIGKILL');
    }
  } catch {
    // Process already exited
  }
};

const cleanup = () => {
  console.log('\n🛑 Shutting down dev servers...');
  if (backendProcess?.pid) killProcessTree(backendProcess.pid);
  if (frontendProcess?.pid) killProcessTree(frontendProcess.pid);
  process.exit(0);
};

process.on('SIGINT', cleanup);
process.on('SIGTERM', cleanup);
process.on('exit', () => {
  if (backendProcess?.pid) killProcessTree(backendProcess.pid);
  if (frontendProcess?.pid) killProcessTree(frontendProcess.pid);
});
