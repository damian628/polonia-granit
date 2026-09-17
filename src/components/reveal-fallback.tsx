import Script from 'next/script';

/**
 * Fallback animacji wejścia dla przeglądarek bez scroll-driven animations
 * (głównie Firefox i starsze Safari). W Chrome, Edge i Safari 26+ ten skrypt
 * natychmiast się kończy i nie robi nic.
 *
 * `next/script` zamiast surowego `<script>`: React 19 nie wykonuje tagów
 * `<script>` wyrenderowanych w komponencie i zgłasza błąd w overlayu.
 */
const script = `
(function () {
  if (window.CSS && CSS.supports && CSS.supports('animation-timeline: view()')) return;
  if (window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  var SELECTOR = '.reveal, .reveal-fade, .reveal-zoom';
  var observer = new IntersectionObserver(function (entries) {
    for (var i = 0; i < entries.length; i++) {
      if (entries[i].isIntersecting) {
        entries[i].target.classList.add('is-visible');
        observer.unobserve(entries[i].target);
      }
    }
  }, { rootMargin: '0px 0px -8% 0px', threshold: 0.04 });

  function scan() {
    var nodes = document.querySelectorAll(SELECTOR);
    for (var i = 0; i < nodes.length; i++) {
      if (!nodes[i].classList.contains('is-visible')) observer.observe(nodes[i]);
    }
  }

  // Udostępniamy skan globalnie, żeby galeria mogła go wywołać
  // po przefiltrowaniu i dorzuceniu nowych kafli do drzewa.
  window.__revealScan = scan;

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', scan);
  } else {
    scan();
  }

  // Zmiany w drzewie zbieramy do jednej klatki - inaczej przy filtrowaniu
  // galerii skan odpalałby się kilkadziesiąt razy z rzędu.
  var pending = false;
  new MutationObserver(function () {
    if (pending) return;
    pending = true;
    requestAnimationFrame(function () {
      pending = false;
      scan();
    });
  }).observe(document.documentElement, { childList: true, subtree: true });
})();
`;

export function RevealFallback() {
  return (
    <Script id="reveal-fallback" strategy="afterInteractive">
      {script}
    </Script>
  );
}
