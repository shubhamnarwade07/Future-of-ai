/**
 * Digital Marketing Blog - Interactive Features & SEO Helpers
 */

document.addEventListener('DOMContentLoaded', () => {
  initThemeToggle();
  initReadingProgress();
  initTableOfContentsSpy();
  initFaqAccordion();
  initShareAndCopy();
  initNewsletter();
  initSeoLiveCalculator();
});

/* ==========================================================================
   Theme Switcher (Dark / Light Mode)
   ========================================================================== */
function initThemeToggle() {
  const themeToggleBtn = document.getElementById('theme-toggle');
  if (!themeToggleBtn) return;

  // Check saved preference or system preference
  const savedTheme = localStorage.getItem('theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const initialTheme = savedTheme || (prefersDark ? 'dark' : 'light');

  setTheme(initialTheme);

  themeToggleBtn.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
    const nextTheme = currentTheme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
  });
}

function setTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem('theme', theme);

  const themeIcon = document.getElementById('theme-icon');
  if (themeIcon) {
    if (theme === 'light') {
      // Moon icon for switching to dark
      themeIcon.innerHTML = `
        <svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"/>
        </svg>`;
      themeIcon.setAttribute('aria-label', 'Switch to dark theme');
    } else {
      // Sun icon for switching to light
      themeIcon.innerHTML = `
        <svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"/>
        </svg>`;
      themeIcon.setAttribute('aria-label', 'Switch to light theme');
    }
  }
}

/* ==========================================================================
   Reading Progress Bar
   ========================================================================== */
function initReadingProgress() {
  const progressBar = document.getElementById('reading-progress');
  const article = document.querySelector('article');
  if (!progressBar || !article) return;

  window.addEventListener('scroll', () => {
    const articleTop = article.offsetTop;
    const articleHeight = article.offsetHeight;
    const windowHeight = window.innerHeight;
    const scrollY = window.scrollY;

    const totalScrollable = articleHeight - windowHeight + 100;
    const currentProgress = scrollY - articleTop;

    if (currentProgress < 0) {
      progressBar.style.width = '0%';
    } else if (currentProgress > totalScrollable) {
      progressBar.style.width = '100%';
    } else {
      const percentage = (currentProgress / totalScrollable) * 100;
      progressBar.style.width = `${Math.min(100, Math.max(0, percentage))}%`;
    }
  }, { passive: true });
}

/* ==========================================================================
   Sticky Table of Contents Intersection Observer Spy
   ========================================================================== */
function initTableOfContentsSpy() {
  const tocLinks = document.querySelectorAll('.toc-link');
  const headings = document.querySelectorAll('.article-content h2, .article-content h3');
  if (!tocLinks.length || !headings.length) return;

  const observerOptions = {
    root: null,
    rootMargin: '-80px 0px -65% 0px',
    threshold: 0
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        if (!id) return;

        tocLinks.forEach(link => {
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
            link.setAttribute('aria-current', 'true');
          } else {
            link.classList.remove('active');
            link.removeAttribute('aria-current');
          }
        });
      }
    });
  }, observerOptions);

  headings.forEach(heading => {
    if (heading.id) {
      observer.observe(heading);
    }
  });
}

/* ==========================================================================
   FAQ Accordions
   ========================================================================== */
function initFaqAccordion() {
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const button = item.querySelector('.faq-question');
    if (!button) return;

    button.addEventListener('click', () => {
      const isOpen = item.classList.contains('active');

      // Close all other open items
      faqItems.forEach(otherItem => {
        if (otherItem !== item && otherItem.classList.contains('active')) {
          otherItem.classList.remove('active');
          const otherBtn = otherItem.querySelector('.faq-question');
          if (otherBtn) otherBtn.setAttribute('aria-expanded', 'false');
        }
      });

      // Toggle clicked item
      item.classList.toggle('active', !isOpen);
      button.setAttribute('aria-expanded', String(!isOpen));
    });
  });
}

/* ==========================================================================
   Social Share & Copy Link with Toast
   ========================================================================== */
function initShareAndCopy() {
  const copyBtn = document.getElementById('copy-link-btn');
  if (copyBtn) {
    copyBtn.addEventListener('click', async (e) => {
      e.preventDefault();
      try {
        await navigator.clipboard.writeText(window.location.href);
        showToast('Link copied to clipboard!');
      } catch (err) {
        showToast('URL: ' + window.location.href);
      }
    });
  }

  const shareButtons = document.querySelectorAll('[data-share]');
  shareButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      const platform = btn.getAttribute('data-share');
      const url = encodeURIComponent(window.location.href);
      const title = encodeURIComponent(document.title);

      if (platform === 'twitter') {
        window.open(`https://twitter.com/intent/tweet?url=${url}&text=${title}`, '_blank', 'width=600,height=400');
      } else if (platform === 'linkedin') {
        window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${url}`, '_blank', 'width=600,height=500');
      } else if (platform === 'facebook') {
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, '_blank', 'width=600,height=400');
      }
    });
  });
}

function showToast(message) {
  let toast = document.getElementById('toast-notice');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'toast-notice';
    toast.className = 'toast-notice';
    document.body.appendChild(toast);
  }

  toast.innerHTML = `
    <svg width="20" height="20" fill="none" stroke="#10b981" stroke-width="2" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
    </svg>
    <span>${message}</span>
  `;

  toast.classList.add('show');
  setTimeout(() => {
    toast.classList.remove('show');
  }, 3200);
}

/* ==========================================================================
   Newsletter Subscription Demo
   ========================================================================== */
function initNewsletter() {
  const form = document.getElementById('newsletter-form');
  const input = document.getElementById('newsletter-email');
  const msg = document.getElementById('newsletter-msg');
  if (!form || !input || !msg) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = input.value.trim();
    if (email && email.includes('@')) {
      msg.textContent = '🎉 Thank you! You are now subscribed to SEO Insights.';
      msg.className = 'newsletter-msg success';
      input.value = '';
    }
  });
}

/* ==========================================================================
   Live SEO Analysis Mini-Calculator (On-page interaction)
   ========================================================================== */
function initSeoLiveCalculator() {
  const input = document.getElementById('seo-keyword-input');
  const analyzeBtn = document.getElementById('seo-analyze-btn');
  const densityResult = document.getElementById('calc-density');
  const occurrencesResult = document.getElementById('calc-occurrences');
  const statusResult = document.getElementById('calc-status');

  if (!input || !analyzeBtn || !densityResult) return;

  const runAnalysis = () => {
    const keyword = input.value.trim().toLowerCase();
    if (!keyword) return;

    const articleText = (document.querySelector('.article-content')?.innerText || '').toLowerCase();
    const words = articleText.match(/\b[a-z0-9_-]+\b/gi) || [];
    const totalWords = words.length;

    if (totalWords === 0) return;

    // Count occurrences of phrase or keyword
    const regex = new RegExp(`\\b${escapeRegExp(keyword)}\\b`, 'gi');
    const matches = articleText.match(regex);
    const count = matches ? matches.length : 0;
    const density = ((count / totalWords) * 100).toFixed(2);

    occurrencesResult.textContent = count;
    densityResult.textContent = `${density}%`;

    if (density >= 1.0 && density <= 2.5) {
      statusResult.textContent = 'Optimal (1-2.5%)';
      statusResult.style.color = '#10b981';
    } else if (density < 1.0) {
      statusResult.textContent = 'Low (<1.0%)';
      statusResult.style.color = '#f59e0b';
    } else {
      statusResult.textContent = 'High (>2.5%)';
      statusResult.style.color = '#ef4444';
    }
  };

  analyzeBtn.addEventListener('click', runAnalysis);
  input.addEventListener('keyup', (e) => {
    if (e.key === 'Enter') runAnalysis();
  });
}

function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
