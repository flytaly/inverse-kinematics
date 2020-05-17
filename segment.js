export class Segment {
  constructor(width, height, color = '#ffffff', rotation = 0, { x = 0, y = 0 } = {}) {
    this.x = x;
    this.y = y;
    this.initialX = x;
    this.initialY = y;
    this.width = width;
    this.height = height;
    this.rotation = rotation;
    this.initialRotation = rotation;
    this.scaleX = 1;
    this.scaleY = 1;
    this.color = color;
    this.lineWidth = 1;
  }

  draw(context) {
    var h = this.height,
      d = this.width + h, //top-right diagonal
      cr = h / 2; //corner radius
    context.save();
    context.translate(this.x, this.y);
    context.rotate(this.rotation);
    context.scale(this.scaleX, this.scaleY);
    context.lineWidth = this.lineWidth;
    context.fillStyle = this.color;
    context.beginPath();
    context.moveTo(0, -cr);
    context.lineTo(d - 2 * cr, -cr);
    context.quadraticCurveTo(-cr + d, -cr, -cr + d, 0);
    context.lineTo(-cr + d, h - 2 * cr);
    context.quadraticCurveTo(-cr + d, -cr + h, d - 2 * cr, -cr + h);
    context.lineTo(0, -cr + h);
    context.quadraticCurveTo(-cr, -cr + h, -cr, h - 2 * cr);
    context.lineTo(-cr, 0);
    context.quadraticCurveTo(-cr, -cr, 0, -cr);
    context.closePath();
    context.fill();
    if (this.lineWidth > 0) {
      context.stroke();
    }
    //draw the 2 "pins"
    context.beginPath();
    context.arc(0, 0, 2, 0, Math.PI * 2, true);
    context.closePath();
    context.stroke();

    context.beginPath();
    context.arc(this.width, 0, 2, 0, Math.PI * 2, true);
    context.closePath();
    context.stroke();

    context.restore();
  }
  getPin() {
    return {
      x: this.x + Math.cos(this.rotation) * this.width,
      y: this.y + Math.sin(this.rotation) * this.width,
    };
  }
  // save position properties
  savePosition() {
    this.savedX = this.x;
    this.savedY = this.y;
    this.savedRot = this.rotation;
  }

  restorePosition() {
    this.x = this.savedX;
    this.y = this.savedY;
    this.rotation = this.savedRot;
  }
}
