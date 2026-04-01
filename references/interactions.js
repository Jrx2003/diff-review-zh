// =============================================================
// DIFF-REVIEW INTERACTIONS
// 可复用的交互功能
// =============================================================

// ── NAVIGATION ───────────────────────────────────────────────
function scrollToModule(index) {
  const module = document.getElementById(`module-${index}`);
  if (module) {
    module.scrollIntoView({ behavior: 'smooth' });
  }
}

function initNavigation() {
  const modules = document.querySelectorAll('.module');
  const navDots = document.querySelectorAll('.nav-dot');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const index = Array.from(modules).indexOf(entry.target);
        navDots.forEach((dot, i) => {
          dot.classList.toggle('active', i === index);
        });
      }
    });
  }, { rootMargin: '-50% 0px -50% 0px', threshold: 0 });

  modules.forEach(module => observer.observe(module));

  // Keyboard navigation
  document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
      e.preventDefault();
      const current = document.querySelector('.nav-dot.active');
      const next = current?.nextElementSibling;
      if (next) next.click();
    } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
      e.preventDefault();
      const current = document.querySelector('.nav-dot.active');
      const prev = current?.previousElementSibling;
      if (prev) prev.click();
    }
  });
}

// ── CHAT SIMULATION ──────────────────────────────────────────
class ChatSimulation {
  constructor(containerId, options = {}) {
    this.container = document.getElementById(containerId);
    this.currentStep = 1;
    this.totalSteps = options.totalSteps || 8;
    this.progressEl = document.getElementById(options.progressId || 'chat-progress');
  }

  nextStep() {
    if (this.currentStep < this.totalSteps) {
      this.currentStep++;
      const msg = this.container.querySelector(`[data-step="${this.currentStep}"]`);
      if (msg) {
        msg.style.display = 'flex';
        msg.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
      this.updateProgress();
    }
  }

  reset() {
    for (let i = 2; i <= this.totalSteps; i++) {
      const msg = this.container.querySelector(`[data-step="${i}"]`);
      if (msg) msg.style.display = 'none';
    }
    this.currentStep = 1;
    this.updateProgress();
  }

  updateProgress() {
    if (this.progressEl) {
      this.progressEl.textContent = `步骤 ${this.currentStep}/${this.totalSteps}`;
    }
  }
}

// ── FLOW ANIMATION ───────────────────────────────────────────
class FlowAnimation {
  constructor(logId, actorsSelector) {
    this.logEl = document.getElementById(logId);
    this.actors = document.querySelectorAll(actorsSelector);
    this.steps = [];
    this.currentIndex = 0;
  }

  setSteps(steps) {
    this.steps = steps;
    this.reset();
  }

  nextStep() {
    if (this.currentIndex < this.steps.length - 1) {
      this.currentIndex++;
      const step = this.steps[this.currentIndex];

      // Update active actor
      this.actors.forEach(el => el.classList.remove('active'));
      const actor = document.querySelector(`[data-actor="${step.actor}"]`);
      if (actor) actor.classList.add('active');

      // Add log line
      const line = document.createElement('span');
      line.className = 'flow-log-line';
      line.innerHTML = step.log;
      this.logEl.appendChild(line);
      this.logEl.scrollTop = this.logEl.scrollHeight;
    }
  }

  reset() {
    this.currentIndex = 0;
    this.actors.forEach(el => el.classList.remove('active'));
    const firstActor = document.querySelector(`[data-actor="${this.steps[0]?.actor}"]`);
    if (firstActor) firstActor.classList.add('active');
    this.logEl.innerHTML = this.steps[0]?.log || '';
  }
}

// ── TOOLTIPS ─────────────────────────────────────────────────
function initTooltips() {
  let activeTooltip = null;

  document.querySelectorAll('.term').forEach(term => {
    const tip = document.createElement('span');
    tip.className = 'term-tooltip';
    tip.textContent = term.dataset.definition;

    term.addEventListener('mouseenter', (e) => {
      const rect = term.getBoundingClientRect();
      tip.style.left = (rect.left + rect.width/2 - 150) + 'px';
      tip.style.top = (rect.top - 60) + 'px';
      document.body.appendChild(tip);
      requestAnimationFrame(() => tip.classList.add('visible'));
      activeTooltip = tip;
    });

    term.addEventListener('mouseleave', () => {
      tip.classList.remove('visible');
      setTimeout(() => tip.remove(), 150);
      activeTooltip = null;
    });
  });
}

// ── FILE TREE ────────────────────────────────────────────────
function initFileTree() {
  document.querySelectorAll('.ft-folder > .ft-name').forEach(folder => {
    folder.addEventListener('click', () => {
      folder.parentElement.classList.toggle('collapsed');
    });
  });
}

// ── DRAG TO SCROLL ───────────────────────────────────────────
function initDragToScroll() {
  document.querySelectorAll('.code-panel').forEach(panel => {
    let isDown = false;
    let startX;
    let scrollLeft;

    panel.addEventListener('mousedown', (e) => {
      isDown = true;
      panel.style.cursor = 'grabbing';
      startX = e.pageX - panel.offsetLeft;
      scrollLeft = panel.scrollLeft;
    });

    panel.addEventListener('mouseleave', () => {
      isDown = false;
      panel.style.cursor = 'grab';
    });

    panel.addEventListener('mouseup', () => {
      isDown = false;
      panel.style.cursor = 'grab';
    });

    panel.addEventListener('mousemove', (e) => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - panel.offsetLeft;
      const walk = (x - startX) * 2;
      panel.scrollLeft = scrollLeft - walk;
    });
  });
}

// ── INITIALIZE ALL ───────────────────────────────────────────
function initDiffReview() {
  initNavigation();
  initTooltips();
  initFileTree();
  initDragToScroll();
}

// Auto-initialize on DOM ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initDiffReview);
} else {
  initDiffReview();
}
