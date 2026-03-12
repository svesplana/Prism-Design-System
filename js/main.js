/* ========================================
   Prism Design System — Main JS
   ======================================== */

(function () {
  'use strict';

  // ---- Active nav link ----
  function setActiveNav() {
    const path = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.sidebar-item').forEach(link => {
      const href = link.getAttribute('href');
      if (!href) return;
      const linkFile = href.split('/').pop();
      if (linkFile === path || (path === '' && linkFile === 'index.html')) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });
  }

  // ---- Mobile sidebar toggle ----
  function initMobileSidebar() {
    const toggle = document.getElementById('menuToggle');
    const sidebar = document.querySelector('.sidebar');
    const overlay = document.getElementById('sidebarOverlay');
    if (!toggle || !sidebar) return;

    toggle.addEventListener('click', () => {
      sidebar.classList.toggle('open');
      overlay && overlay.classList.toggle('visible');
    });

    overlay && overlay.addEventListener('click', () => {
      sidebar.classList.remove('open');
      overlay.classList.remove('visible');
    });
  }

  // ---- TOC active link on scroll ----
  function initTocScroll() {
    const tocLinks = document.querySelectorAll('.toc-link');
    if (!tocLinks.length) return;

    const sections = Array.from(tocLinks).map(link => {
      const id = link.getAttribute('href').replace('#', '');
      return { link, el: document.getElementById(id) };
    }).filter(s => s.el);

    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          tocLinks.forEach(l => l.classList.remove('active'));
          const active = sections.find(s => s.el === entry.target);
          if (active) active.link.classList.add('active');
        }
      });
    }, { rootMargin: '-60px 0px -70% 0px' });

    sections.forEach(s => observer.observe(s.el));
  }

  // ---- Content tabs ----
  function initContentTabs() {
    document.querySelectorAll('.content-tabs').forEach(tabGroup => {
      const tabs = tabGroup.querySelectorAll('.content-tab');
      tabs.forEach(tab => {
        tab.addEventListener('click', () => {
          const targetId = tab.getAttribute('data-tab');
          const parent = tabGroup.closest('.tab-container') || tabGroup.parentElement;

          tabs.forEach(t => t.classList.remove('active'));
          tab.classList.add('active');

          parent.querySelectorAll('.tab-pane').forEach(pane => {
            pane.classList.toggle('active', pane.getAttribute('data-pane') === targetId);
          });
        });
      });
    });
  }

  // ---- Copy code buttons ----
  function initCopyButtons() {
    document.querySelectorAll('.code-copy-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const block = btn.closest('.code-block');
        if (!block) return;
        const code = block.querySelector('pre code');
        if (!code) return;
        navigator.clipboard.writeText(code.textContent).then(() => {
          const originalHTML = btn.innerHTML;
          btn.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg> Copied!`;
          btn.style.color = '#22C55E';
          setTimeout(() => {
            btn.innerHTML = originalHTML;
            btn.style.color = '';
          }, 2000);
        });
      });
    });
  }

  // ---- Search (simple client-side) ----
  function initSearch() {
    const searchInput = document.getElementById('searchInput');
    if (!searchInput) return;

    searchInput.addEventListener('keydown', e => {
      if (e.key === 'Enter') {
        const query = searchInput.value.trim().toLowerCase();
        if (!query) return;
        // Simple nav: go to components page for component searches
        const componentKeywords = ['button', 'input', 'card', 'badge', 'modal', 'toggle', 'avatar', 'tab', 'accordion', 'carousel', 'toast', 'tooltip', 'dropdown'];
        const foundationKeywords = ['color', 'typography', 'spacing', 'grid', 'motion', 'elevation'];
        if (componentKeywords.some(k => query.includes(k))) {
          window.location.href = 'components.html#' + encodeURIComponent(query.split(' ')[0]);
        } else if (foundationKeywords.some(k => query.includes(k))) {
          window.location.href = 'foundations.html#' + encodeURIComponent(query.split(' ')[0]);
        }
      }
    });

    // Keyboard shortcut: press / or Cmd+K to focus search
    document.addEventListener('keydown', e => {
      if ((e.key === '/' || (e.metaKey && e.key === 'k')) && document.activeElement !== searchInput) {
        e.preventDefault();
        searchInput.focus();
        searchInput.select();
      }
      if (e.key === 'Escape' && document.activeElement === searchInput) {
        searchInput.blur();
        searchInput.value = '';
      }
    });
  }

  // ---- Demo toggle interaction ----
  function initDemoToggles() {
    document.querySelectorAll('.demo-toggle').forEach(toggle => {
      toggle.addEventListener('click', () => {
        toggle.classList.toggle('off');
      });
    });
  }

  // ---- Smooth anchor scroll offset ----
  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', e => {
        const id = anchor.getAttribute('href').replace('#', '');
        const el = document.getElementById(id);
        if (!el) return;
        e.preventDefault();
        const top = el.getBoundingClientRect().top + window.scrollY - 80;
        window.scrollTo({ top, behavior: 'smooth' });
      });
    });
  }

  // ---- Init ----
  document.addEventListener('DOMContentLoaded', () => {
    setActiveNav();
    initMobileSidebar();
    initTocScroll();
    initContentTabs();
    initCopyButtons();
    initSearch();
    initDemoToggles();
    initSmoothScroll();
  });
})();
