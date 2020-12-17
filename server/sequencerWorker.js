const { Worker } = require('worker_threads');

const sequencer = new Worker(`${__dirname}/sequencer.js`);

sequencer.on('message', (message) => {
  console.log(message);
});

sequencer.on('error', (error) => {
  console.error(error);
  process.exit(1);
});

sequencer.on('exit', (code) => {
  if (code !== 0) {
    console.error(`worker stopped with exit code ${code}`);
    process.exit(1);
  }
});

module.exports = sequencer;
