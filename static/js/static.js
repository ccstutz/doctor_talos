/**
 * Margin Static Noise — intermittent green/magenta bursts
 * Only renders in the margins (outside the terminal content area).
 */
(function () {
  var canvas = document.getElementById('static-noise');
  if (!canvas) return;

  var ctx = canvas.getContext('2d');
  var colors = [
    [0, 255, 65],    // green
    [0, 200, 40],    // dim green
    [255, 0, 255],   // magenta
    [200, 0, 200]    // dim magenta
  ];

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  resize();
  window.addEventListener('resize', resize);

  function getMargins() {
    var terminal = document.querySelector('.terminal');
    if (!terminal) return { left: 0, right: canvas.width };
    var rect = terminal.getBoundingClientRect();
    return { left: rect.left, right: rect.right };
  }

  function drawStatic() {
    var margins = getMargins();
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    var pixelSize = 2;
    var density = 0.15;

    // Left margin
    for (var y = 0; y < canvas.height; y += pixelSize) {
      for (var x = 0; x < margins.left; x += pixelSize) {
        if (Math.random() < density) {
          var c = colors[Math.floor(Math.random() * colors.length)];
          var a = Math.random() * 0.6 + 0.2;
          ctx.fillStyle = 'rgba(' + c[0] + ',' + c[1] + ',' + c[2] + ',' + a + ')';
          ctx.fillRect(x, y, pixelSize, pixelSize);
        }
      }
    }

    // Right margin
    for (var y = 0; y < canvas.height; y += pixelSize) {
      for (var x = margins.right; x < canvas.width; x += pixelSize) {
        if (Math.random() < density) {
          var c = colors[Math.floor(Math.random() * colors.length)];
          var a = Math.random() * 0.6 + 0.2;
          ctx.fillStyle = 'rgba(' + c[0] + ',' + c[1] + ',' + c[2] + ',' + a + ')';
          ctx.fillRect(x, y, pixelSize, pixelSize);
        }
      }
    }
  }

  function flash() {
    drawStatic();
    canvas.classList.add('flash');

    // Hold for a brief moment, then fade
    var duration = 100 + Math.random() * 200;
    setTimeout(function () {
      canvas.classList.remove('flash');
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }, duration);

    // Sometimes do a quick double-flash
    if (Math.random() < 0.3) {
      setTimeout(function () {
        drawStatic();
        canvas.classList.add('flash');
        setTimeout(function () {
          canvas.classList.remove('flash');
          ctx.clearRect(0, 0, canvas.width, canvas.height);
        }, 80);
      }, duration + 100);
    }

    // Schedule next flash — random interval between 4-12 seconds
    var next = 4000 + Math.random() * 8000;
    setTimeout(flash, next);
  }

  // Start after a short delay
  setTimeout(flash, 2000 + Math.random() * 3000);
})();
