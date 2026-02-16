/**
 * Doctor Talos's Traveling Show — Boot Sequence
 *
 * On first visit per session: typewriter boot sequence.
 * On subsequent navigations: instant reveal.
 */
(function () {
  var overlay = document.getElementById('boot-overlay');
  var content = document.getElementById('main-content');

  if (!overlay || !content) return;

  var hasSeenBoot = sessionStorage.getItem('talos_boot_seen');

  if (hasSeenBoot) {
    overlay.style.display = 'none';
    content.classList.add('revealed');
    return;
  }

  sessionStorage.setItem('talos_boot_seen', '1');

  var bootLines = [
    '> TALOS_OS v2.077',
    '> initializing neural mesh...',
    '> loading personality matrix... [DR_TALOS]',
    '> status: SUN_DECAY at 97.3%',
    '> warning: entropy levels critical',
    '> establishing uplink...',
    '> connection secured.',
    '',
    '> welcome, user.',
    '> the show is about to begin.'
  ];

  var bootTextEl = overlay.querySelector('.boot-text');
  if (!bootTextEl) return;

  bootTextEl.innerHTML = '';

  var lineIndex = 0;
  var lineDelay = 120;

  function typeLine() {
    if (lineIndex >= bootLines.length) {
      // Done typing — fade out overlay, reveal content
      setTimeout(function () {
        overlay.classList.add('done');
        content.classList.add('revealed');
        setTimeout(function () {
          overlay.style.display = 'none';
        }, 500);
      }, 400);
      return;
    }

    var line = bootLines[lineIndex];
    var el = document.createElement('div');

    if (line === '') {
      el.innerHTML = '&nbsp;';
    } else {
      el.textContent = line;
    }

    bootTextEl.appendChild(el);
    lineIndex++;
    setTimeout(typeLine, lineDelay);
  }

  typeLine();
})();
