// Generated by CoffeeScript 1.4.0
var FrameBuffer;

FrameBuffer = (function() {

  function FrameBuffer() {
    var id;
    id = "framebuffer" + FrameBuffer.globalCount;
    this.canvas = ($("<canvas/>", {
      id: id
    }))[0];
    this.ctx = this.canvas.getContext('2d');
    FrameBuffer.globalCount++;
  }

  FrameBuffer.globalCount = 0;

  FrameBuffer.prototype.test = function() {
    this.ctx.fillRect(0, 0, 100, 100);
    return this.ctx.fill();
  };

  return FrameBuffer;

})();
