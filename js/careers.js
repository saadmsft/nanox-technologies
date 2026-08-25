/* =============================================================
   Nanox Careers — JSON-driven roles renderer
   Source of truth: data/careers.json (rebuilt from GitHub Issues
   via .github/workflows/build-careers.yml)
   ============================================================= */
(function () {
  'use strict';

  const root        = document.querySelector('[data-roles-root]');
  if (!root) return;

  const listEl      = root.querySelector('[data-roles-list]');
  const filtersEl   = root.querySelector('[data-roles-filters]');
  const emptyEl     = root.querySelector('[data-roles-empty]');
  const loadingEl   = root.querySelector('[data-roles-loading]');
  const searchEl    = root.querySelector('[data-roles-search]');
  const resetBtn    = root.querySelector('[data-roles-reset]');
  const jsonldEl    = document.querySelector('[data-roles-jsonld]');

  const state = {
    roles: [],
    filters: { team: null, location: null, seniority: null, q: '' },
  };

  // ------- helpers -------
  const escape = (s) => String(s ?? '').replace(/[&<>"']/g, c => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  }[c]));

  const uniq = (arr) => Array.from(new Set(arr.filter(Boolean)));

  function buildMailto(role) {
    const subject = encodeURIComponent(`Application — ${role.title}`);
    const body    = encodeURIComponent(
      `Hi Nanox team,\n\nI'd like to apply for ${role.title} (${role.location}).\n\nA bit about me:\n\n— Years of relevant experience:\n— LinkedIn / portfolio:\n— Why this role:\n\nThanks!`
    );
    return `mailto:${role.applyEmail || 'careers@nanoxtech.ai'}?subject=${subject}&body=${body}`;
  }

  function arrowSvg() {
    return '<svg class="icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>';
  }

  // ------- filtering -------
  function applyFilters() {
    const { team, location, seniority, q } = state.filters;
    const needle = q.trim().toLowerCase();
    return state.roles.filter(r => {
      if (team      && r.team      !== team)      return false;
      if (location  && r.location  !== location)  return false;
      if (seniority && r.seniority !== seniority) return false;
      if (needle) {
        const hay = `${r.title} ${r.team} ${r.summary} ${(r.responsibilities||[]).join(' ')} ${(r.requirements||[]).join(' ')}`.toLowerCase();
        if (!hay.includes(needle)) return false;
      }
      return true;
    });
  }

  // ------- rendering -------
  function renderFilters() {
    const groups = {
      team:      uniq(state.roles.map(r => r.team)),
      location:  uniq(state.roles.map(r => r.location)),
      seniority: uniq(state.roles.map(r => r.seniority)),
    };
    Object.entries(groups).forEach(([key, values]) => {
      const wrap = filtersEl.querySelector(`[data-filter-group="${key}"]`);
      if (!wrap) return;
      wrap.innerHTML = '';
      values.forEach(v => {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'chip';
        btn.dataset.value = v;
        btn.textContent = v;
        btn.setAttribute('aria-pressed', 'false');
        btn.addEventListener('click', () => {
          state.filters[key] = state.filters[key] === v ? null : v;
          renderChipState();
          renderList();
        });
        wrap.appendChild(btn);
      });
    });
    renderChipState();
  }

  function renderChipState() {
    filtersEl.querySelectorAll('.chip').forEach(chip => {
      const group = chip.parentElement.dataset.filterGroup;
      const active = state.filters[group] === chip.dataset.value;
      chip.classList.toggle('is-active', active);
      chip.setAttribute('aria-pressed', String(active));
    });
  }

  function renderList() {
    const filtered = applyFilters();
    listEl.innerHTML = filtered.map(roleCard).join('');
    emptyEl.hidden = filtered.length !== 0;
    bindRoleToggles();
  }

  function roleCard(role) {
    const meta = [role.team, role.seniority, role.location, role.type, role.salary]
      .filter(Boolean).join(' · ');
    const respHtml = (role.responsibilities || []).map(li => `<li>${escape(li)}</li>`).join('');
    const reqHtml  = (role.requirements    || []).map(li => `<li>${escape(li)}</li>`).join('');
    const posted   = role.postedAt ? new Date(role.postedAt).toLocaleDateString('en-GB', { year: 'numeric', month: 'short', day: 'numeric' }) : '';

    return `
    <article class="role-card" data-role-card data-role-id="${role.id}">
      <button type="button" class="role-card-summary" aria-expanded="false" aria-controls="role-${role.id}-detail">
        <div class="role-card-head">
          <h3 class="role-card-title">${escape(role.title)}</h3>
          <p class="role-card-meta">${escape(meta)}</p>
        </div>
        <span class="role-card-toggle" aria-hidden="true">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>
        </span>
      </button>
      <div class="role-card-detail" id="role-${role.id}-detail" hidden>
        ${role.summary ? `<p class="role-card-summary-text">${escape(role.summary)}</p>` : ''}
        ${respHtml ? `<div class="role-card-section"><h4>What you'll do</h4><ul>${respHtml}</ul></div>` : ''}
        ${reqHtml  ? `<div class="role-card-section"><h4>What we're looking for</h4><ul>${reqHtml}</ul></div>` : ''}
        <div class="role-card-foot">
          ${posted ? `<span class="role-card-posted">Posted ${escape(posted)}</span>` : '<span></span>'}
          <a class="btn btn-primary" href="${escape(buildMailto(role))}">Apply by email${arrowSvg()}</a>
        </div>
      </div>
    </article>`;
  }

  function bindRoleToggles() {
    listEl.querySelectorAll('[data-role-card]').forEach(card => {
      const btn    = card.querySelector('.role-card-summary');
      const detail = card.querySelector('.role-card-detail');
      btn.addEventListener('click', () => {
        const open = card.classList.toggle('is-open');
        btn.setAttribute('aria-expanded', String(open));
        detail.hidden = !open;
      });
    });
  }

  // ------- JSON-LD JobPosting (Google Jobs eligibility) -------
  function renderJsonLd() {
    if (!jsonldEl) return;
    const items = state.roles.map(role => ({
      '@context': 'https://schema.org',
      '@type': 'JobPosting',
      'title': role.title,
      'description': [role.summary, ...(role.responsibilities || []), ...(role.requirements || [])]
                       .filter(Boolean).join('\n'),
      'datePosted': role.postedAt,
      'employmentType': (role.type || '').toUpperCase().replace(/[ -]/g, '_') || 'FULL_TIME',
      'hiringOrganization': {
        '@type': 'Organization',
        'name': 'Nanox Technologies',
        'sameAs': 'https://nanoxtech.ai',
        'logo': 'https://nanoxtech.ai/assets/nanox-logo.png',
      },
      'jobLocationType': /remote/i.test(role.location) ? 'TELECOMMUTE' : undefined,
      'applicantLocationRequirements': /remote/i.test(role.location) ? {
        '@type': 'Country',
        'name': 'Anywhere',
      } : undefined,
      'jobLocation': {
        '@type': 'Place',
        'address': {
          '@type': 'PostalAddress',
          'addressLocality': /dubai/i.test(role.location) ? 'Dubai'
                              : /doha/i.test(role.location) ? 'Doha'
                              : undefined,
          'addressCountry': /dubai/i.test(role.location) ? 'AE'
                             : /doha/i.test(role.location) ? 'QA'
                             : undefined,
        },
      },
      'directApply': true,
    }));
    // Use first role(s) — JSON-LD spec allows array via @graph
    jsonldEl.textContent = JSON.stringify({
      '@context': 'https://schema.org',
      '@graph': items,
    }, null, 2);
  }

  // ------- search -------
  if (searchEl) {
    let t;
    searchEl.addEventListener('input', () => {
      clearTimeout(t);
      t = setTimeout(() => {
        state.filters.q = searchEl.value;
        renderList();
      }, 120);
    });
  }

  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      state.filters = { team: null, location: null, seniority: null, q: '' };
      if (searchEl) searchEl.value = '';
      renderChipState();
      renderList();
    });
  }

  // ------- bootstrap -------
  async function load() {
    if (loadingEl) loadingEl.hidden = false;
    try {
      // Cache-bust on each pageload to pick up just-merged Action commits
      const res  = await fetch(`data/careers.json?t=${Date.now()}`, { cache: 'no-cache' });
      const data = await res.json();
      state.roles = Array.isArray(data.roles) ? data.roles : [];
    } catch (e) {
      state.roles = [];
      console.warn('[careers] failed to load data/careers.json', e);
    } finally {
      if (loadingEl) loadingEl.hidden = true;
    }
    renderFilters();
    renderList();
    renderJsonLd();
  }

  load();
})();
