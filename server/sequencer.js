const workerThreads = require('worker_threads');
const easymidi = require('easymidi');
const transformations = require('./transformations')

// TODO
const bpm = 100;
const bps = bpm/60;
const tickSize = 1e9/bps;

const output = new easymidi.Output(__filename, true);

let state = null;
workerThreads.parentPort.on('message', s => {
  state = s;
})

function onTick(tick) {
  if (!state) return;

  for (const id in state.channels) {
    const channel = state.channels[id];
    let pattern = state.pattern;

    // TODO apply transformations
    for (const transformation of channel.transformations) {
      pattern = transformations.applyTransformation(transformation, pattern);
    }

    // TODO apply scale
    const value = pattern.steps[tick % pattern.steps.length]
    if (value === null) {
      continue;
    }

    // TODO cc
    // TODO velocity
    // TODO duration
    const note_ = value + pattern.octave * 12;
    const velocity = 127;
    const duration = 50;
    note(note_, velocity, channel.channel, duration);
  }

  // note(64+oct, 50)
}

function note(note, velocity, channel, duration) {
  console.log('sequencer.note', note, velocity, channel, duration);

  const message = {
    note,
    velocity: 127,
    channel
  };

  output.send('noteon', message);
  setTimeout(() => {
    output.send('noteoff', message);
  }, duration);
}

// function cc (controller, value) {
//   console.log('sequencer.cc');
//
//   output.send('cc', {
//     controller,
//     value,
//     channel: 0
//   });
// }

setImmediate(tick);

let currentTick = 0;
let prevTime = process.hrtime.bigint();

function tick() {
  const curTime = process.hrtime.bigint();
  if (curTime - prevTime >= tickSize) {
    onTick(currentTick++);
    prevTime = process.hrtime.bigint();
  }

  setImmediate(tick);
}
