/**
 * Doctor Talos's Traveling Show — Curtain Rise Animation
 *
 * On first visit per session: full curtain-pull reveal.
 * On subsequent navigations within the same session: quick fade-in only.
 */
(function () {
  var curtain = document.getElementById('curtain');
  var content = document.getElementById('main-content');

  if (!curtain || !content) return;

  var hasSeenCurtain = sessionStorage.getItem('talos_curtain_seen');

  if (hasSeenCurtain) {
    // Skip curtain, just reveal content
    curtain.style.display = 'none';
    content.classList.add('revealed');
    return;
  }

  // First visit this session — do the full show
  sessionStorage.setItem('talos_curtain_seen', '1');

  // Small delay, then open curtains
  setTimeout(function () {
    curtain.classList.add('open');
  }, 600);

  // Reveal content after curtains part
  setTimeout(function () {
    content.classList.add('revealed');
  }, 1400);

  // Remove curtain from DOM after animation
  setTimeout(function () {
    curtain.classList.add('done');
    setTimeout(function () {
      curtain.style.display = 'none';
    }, 700);
  }, 2500);
})();
