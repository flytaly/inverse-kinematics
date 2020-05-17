// Based on "Foundation HTML5 Animation with JavaScript" book

import { Segment } from './segment.js';

function reach(segment, xpos, ypos) {
  const dx = xpos - segment.x;
  const dy = ypos - segment.y;
  segment.rotation = Math.atan2(dy, dx);
  const w = segment.getPin().x - segment.x;
  const h = segment.getPin().y - segment.y;
  return {
    x: xpos - w,
    y: ypos - h,
  };
}

function position(segmentA, segmentB) {
  const { x, y } = segmentB.getPin();
  segmentA.x = x;
  segmentA.y = y;
}

function getAngles(segments, xEnd, yEnd) {
  let finalAngles = [];
  let target;

  segments.forEach((segment, i) => {
    segment.savePosition();
    if (i === 0) {
      target = reach(segment, xEnd, yEnd);
    } else {
      target = reach(segment, target.x, target.y);
      position(segments[i - 1], segment);
    }
  });
  segments.forEach((seg) => {
    finalAngles.push(seg.rotation);
    seg.restorePosition();
  });
  return finalAngles;
}

function setAngles(segments, angles, easing = 1) {
  const lastIdx = segments.length - 1;
  let prevPin = { x: segments[lastIdx].x, y: segments[lastIdx].y };
  for (let i = lastIdx; i >= 0; i--) {
    const seg = segments[i];
    let targetRot = angles[i];
    let { rotation } = seg;
    let dRot = targetRot - rotation;
    if (dRot < -Math.PI) {
      dRot = 2 * Math.PI + dRot;
    }
    rotation = (rotation + dRot * easing) % (2 * Math.PI);
    if (rotation < 0) rotation = 2 * Math.PI + rotation;

    seg.rotation = rotation;

    seg.x = prevPin.x;
    seg.y = prevPin.y;
    prevPin = seg.getPin();
  }
}

function inBounds(x_, y_, { x, y, width, height }) {
  return x_ >= x && x_ <= x + width && y_ >= y && y_ <= y + height;
}

const segmentLength = 70;
const segmentWidth = 16;
const numSegments = 4;
const segments = new Array(numSegments);
const reachWidth = 2 * numSegments * (segmentLength + 5);

let bounds = {};

const a = Math.PI / 5; // angle between lines in "V" letter
const initialAngles = [(3 * Math.PI - a) / 2, (Math.PI + a) / 2, (3 * Math.PI + a) / 2, (Math.PI - a) / 2];
const colors = ['#66ff66', '#6666ff', '#ff6666', '#ffffff'];

new p5((p) => {
  p.setup = () => {
    p.createCanvas(window.innerWidth, window.innerHeight);
    let prevPin = { x: p.width / 2, y: p.height / 2 };
    for (let i = numSegments - 1; i >= 0; i--) {
      const color = colors[i % colors.length];
      const rotation = initialAngles[i % initialAngles.length];
      const segment = new Segment(segmentLength, segmentWidth, color, rotation, prevPin);
      prevPin = segment.getPin();
      segments[i] = segment;
    }
    bounds = {
      x: p.width / 2 - reachWidth / 2,
      y: p.height / 2 - reachWidth / 2,
      width: reachWidth,
      height: reachWidth,
    };
  };

  p.draw = () => {
    p.background(20);

    if (inBounds(p.mouseX, p.mouseY, bounds)) {
      p.fill(50);
      p.rect(bounds.x, bounds.y, bounds.width, bounds.height);
      const angles = getAngles(segments, p.mouseX, p.mouseY);
      setAngles(segments, angles, 0.05);
    } else {
      p.fill(30);
      p.rect(bounds.x, bounds.y, bounds.width, bounds.height);
      setAngles(segments, initialAngles, 0.05);
    }

    segments.forEach((s) => s.draw(p.drawingContext));
  };
});
