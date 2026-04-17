/* ═══ Signup Flow Navigation ═══
   Click-through mockup of a 9-step signup/login flow.
   - Steps 1-7: click anywhere advances to next step
   - Step 8: only the "Login" hotspot advances (with a longer fade-in on step 9)
   - Step 9: end state, no further interaction

   Each step is reflected in the URL as ?step=N so the browser back/forward
   buttons naturally navigate between screens.
*/

(function () {
  const MAX_STEP = 10;
  let step = 1;

  const screens = document.querySelectorAll('.flow-screen');
  const clickCapture = document.querySelector('.flow-click-capture');
  const hotspots = document.querySelectorAll('.flow-hotspot');

  function readStepFromUrl() {
    const params = new URLSearchParams(window.location.search);
    const n = parseInt(params.get('step'), 10);
    if (!Number.isFinite(n) || n < 1 || n > MAX_STEP) return 1;
    return n;
  }

  function updateUI(options = {}) {
    screens.forEach(img => {
      const isActive = parseInt(img.dataset.step, 10) === step;
      img.classList.toggle('fade-long', options.longFade === true && isActive);
      img.classList.toggle('active', isActive);
    });

    // Click capture is enabled on steps 1-7 and 9 (click anywhere advances).
    // Step 8 requires the Login hotspot. Step 10 is the end state.
    const captureEnabled = (step >= 1 && step <= 7) || step === 9;
    clickCapture.classList.toggle('enabled', captureEnabled);

    // Hotspots only enabled when data-step matches the current step
    hotspots.forEach(h => {
      const targetStep = parseInt(h.dataset.step, 10);
      h.classList.toggle('enabled', targetStep === step);
    });
  }

  function goToStep(n, options = {}) {
    if (n < 1 || n > MAX_STEP) return;
    step = n;
    updateUI(options);
  }

  function advance() {
    if (step >= MAX_STEP) return;
    const next = step + 1;
    const longFade = next === 9;
    goToStep(next, { longFade });
    // Push a new history entry so the back button returns to the previous step
    const url = next === 1
      ? window.location.pathname
      : window.location.pathname + '?step=' + next;
    history.pushState({ step: next }, '', url);
  }

  // Click-capture: advance on any click (steps 1-7)
  clickCapture.addEventListener('click', () => {
    if (clickCapture.classList.contains('enabled')) advance();
  });

  // Hotspot: only advances when it matches the current step
  hotspots.forEach(h => {
    h.addEventListener('click', () => {
      if (h.classList.contains('enabled')) advance();
    });
  });

  // Browser back/forward buttons
  window.addEventListener('popstate', (e) => {
    const n = (e.state && e.state.step) || readStepFromUrl();
    const longFade = n === 9;
    goToStep(n, { longFade });
  });

  // Initialize from URL (supports direct-link to a specific step)
  const initialStep = readStepFromUrl();
  step = initialStep;
  // Replace the current history entry so back button goes to whatever page
  // the user was on before (e.g. product.html), not another step=1 entry
  history.replaceState({ step: initialStep }, '',
    initialStep === 1 ? window.location.pathname : window.location.pathname + '?step=' + initialStep
  );
  updateUI({ longFade: initialStep === 9 });
})();
