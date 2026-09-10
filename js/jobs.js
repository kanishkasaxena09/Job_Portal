/* ==========================================================================
   Job & Placement Portal - Jobs Module
   Shared rendering helpers for job cards used across pages.
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initBookmarkButtons();
});

/* ==========================================================================
   Helper: Format Number with Indian digit grouping
   ========================================================================== */
function formatIndianNumber(amount) {
  return Number(amount).toLocaleString('en-IN');
}

/* ==========================================================================
   Helper: Format Salary in INR
   ========================================================================== */
function formatSalaryINR(amount) {
  return '₹' + formatIndianNumber(amount);
}

/* ==========================================================================
   Render a Job Card HTML
   ========================================================================== */
function renderJobCard(job) {
  const company = PortalData.getCompanyForJob(job.id);
  const categoryName = PortalData.getCategoryName(job.category);
  const salary = formatSalaryINR(job.salaryMin) + ' - ' + formatSalaryINR(job.salaryMax);

  return `
    <article class="card job-card" data-job-id="${job.id}">
      <div class="job-card__header">
        <div class="job-card__logo">
          <img src="${company ? company.logo : 'https://via.placeholder.com/52'}" alt="${company ? company.name : 'Company'} logo" loading="lazy">
        </div>
        <div class="job-card__info">
          <p class="job-card__company">${company ? company.name : 'Company'}</p>
          <h4 class="job-card__title">
            <a href="job-details.html?id=${job.id}">${job.title}</a>
          </h4>
        </div>
        <button class="job-card__bookmark" aria-label="Save job" data-bookmark="${job.id}">
          <i class="far fa-bookmark"></i>
        </button>
      </div>

      <div class="job-card__meta">
        <span class="job-card__meta-item">
          <i class="fas fa-map-marker-alt"></i>
          ${job.location}
        </span>
        <span class="job-card__meta-item">
          <i class="fas fa-clock"></i>
          ${job.type}
        </span>
        <span class="job-card__meta-item">
          <i class="fas fa-briefcase"></i>
          ${job.workStyle}
        </span>
        <span class="job-card__meta-item">
          <i class="fas fa-graduation-cap"></i>
          ${categoryName}
        </span>
      </div>

      <div class="job-card__tags">
        ${job.tags.slice(0, 3).map(tag => `<span class="tag">${tag}</span>`).join('')}
        ${job.tags.length > 3 ? `<span class="tag">+${job.tags.length - 3} more</span>` : ''}
      </div>

      <div class="job-card__footer">
        <p class="job-card__salary">${salary}/year</p>
        <p class="job-card__posted">Posted ${timeAgo(job.posted)}</p>
      </div>
    </article>
  `;
}

/* ==========================================================================
   Render Multiple Job Cards into a Container
   ========================================================================== */
function renderJobCards(containerSelector, jobs) {
  const container = document.querySelector(containerSelector);
  if (!container) return;

  if (!jobs || jobs.length === 0) {
    container.innerHTML = `
      <div class="no-results">
        <i class="fas fa-search no-results__icon"></i>
        <h3>No jobs found</h3>
        <p>Try adjusting your search or filters to find the right job.</p>
      </div>
    `;
    return;
  }

  container.innerHTML = jobs.map(renderJobCard).join('');
  initBookmarkButtons();
}

/* ==========================================================================
   Bookmark / Save Job Functionality
   ========================================================================== */
function initBookmarkButtons() {
  document.querySelectorAll('[data-bookmark]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();

      const icon = btn.querySelector('i');
      const isSaved = icon.classList.contains('fas');

      // Toggle bookmark state
      icon.classList.toggle('fas', !isSaved);
      icon.classList.toggle('far', isSaved);

      // Update localStorage
      const jobId = btn.getAttribute('data-bookmark');
      const savedJobs = JSON.parse(localStorage.getItem('savedJobs') || '[]');

      if (!isSaved) {
        if (!savedJobs.includes(jobId)) {
          savedJobs.push(jobId);
        }
        btn.classList.add('job-card__bookmark--saved');
        icon.style.color = '#00b4d8';
      } else {
        const index = savedJobs.indexOf(jobId);
        if (index > -1) {
          savedJobs.splice(index, 1);
        }
        btn.classList.remove('job-card__bookmark--saved');
        icon.style.color = '';
      }

      localStorage.setItem('savedJobs', JSON.stringify(savedJobs));
    });
  });
}

/* ==========================================================================
   Restore Saved Bookmarks from localStorage
   ========================================================================== */
function restoreBookmarks() {
  const savedJobs = JSON.parse(localStorage.getItem('savedJobs') || '[]');

  document.querySelectorAll('[data-bookmark]').forEach(btn => {
    const jobId = btn.getAttribute('data-bookmark');
    const icon = btn.querySelector('i');

    if (savedJobs.includes(jobId)) {
      icon.classList.remove('far');
      icon.classList.add('fas');
      icon.style.color = '#00b4d8';
      btn.classList.add('job-card__bookmark--saved');
    }
  });
}

/* ==========================================================================
   Jobs Search Form (used on jobs.html)
   ========================================================================== */
function initJobSearch() {
  const form = document.querySelector('#jobSearchForm');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const searchInput = document.querySelector('#searchKeyword').value;
    const locationInput = document.querySelector('#searchLocation').value;

    let results = PortalData.searchJobs(searchInput);
    if (locationInput) {
      results = results.filter(job =>
        job.location.toLowerCase().includes(locationInput.toLowerCase())
      );
    }

    renderJobCards('#jobsGrid', results);
  });
}