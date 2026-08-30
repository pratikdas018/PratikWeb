import { spawn } from 'node:child_process';

const npmCommand = process.platform === 'win32' ? 'npm.cmd' : 'npm';

const commands = [
  {
    name: 'assistant',
    args: ['--prefix', '../portfolio-assistant-backend', 'run', 'dev']
  },
  {
    name: 'frontend',
    args: ['run', 'dev:frontend']
  }
];

let shuttingDown = false;

const children = commands.map(({ name, args }) => {
  const child = spawn(npmCommand, args, {
    stdio: 'inherit',
    shell: process.platform === 'win32'
  });

  child.on('exit', (code, signal) => {
    if (shuttingDown) {
      return;
    }

    shuttingDown = true;
    stopChildren();
    process.exit(code ?? (signal ? 1 : 0));
  });

  child.on('error', (error) => {
    console.error(`[${name}] ${error.message}`);
    if (!shuttingDown) {
      shuttingDown = true;
      stopChildren();
      process.exit(1);
    }
  });

  return child;
});

function stopChildren() {
  for (const child of children) {
    if (!child.killed) {
      child.kill();
    }
  }
}

process.on('SIGINT', () => {
  shuttingDown = true;
  stopChildren();
});

process.on('SIGTERM', () => {
  shuttingDown = true;
  stopChildren();
});
