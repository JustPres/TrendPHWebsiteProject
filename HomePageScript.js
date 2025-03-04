 // Modern theme toggle
const themeToggle = document.getElementById('themeToggle');
const currentTheme = localStorage.getItem('theme') || 'dark';

document.documentElement.setAttribute('data-theme', currentTheme);

themeToggle.addEventListener('click', () => {
  const newTheme = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', newTheme);
  localStorage.setItem('theme', newTheme);
});

// Load all trending topics
async function loadTrends() {
  try {
    const response = await fetch('data/trends.json');
    const trends = await response.json();
    displayTrends(trends);
  } catch (error) {
    console.error("Failed to load trends:", error);
  }
}

// Display trends on page
function displayTrends(trends) {
  const grid = document.getElementById('trendsGrid');

  trends.forEach(trend => {
    const card = document.createElement('div');
    card.className = 'trend-card';
    card.innerHTML = `
      <h3>${trend.title}</h3>
      <div class="keywords">
        ${trend.keywords.map(kw => `<span>#${kw}</span>`).join('')}
      </div>
      <small>${new Date(trend.date).toLocaleDateString()}</small>
    `;

    // Click handler for modal popup
    card.addEventListener('click', () => {
      // Show modal and blur
      document.getElementById('blurOverlay').style.display = 'block';
      document.getElementById('modal').style.display = 'block';
      document.body.classList.add('no-scroll'); // Prevent background scroll

      // Populate modal content
      document.getElementById('modalContent').innerHTML = `
        <h2>${trend.title}</h2>
        <div class="article-meta">
          <span>Author: ${trend.author}</span>
          <span>Trend Score: ${trend.trend_score}/100</span>
        </div>
        ${trend.content}
      `;
    });

    grid.appendChild(card);
  });
}

// Close modal
document.getElementById('closeBtn').addEventListener('click', closeModal);
document.getElementById('blurOverlay').addEventListener('click', closeModal);

function closeModal() {
  document.getElementById('blurOverlay').style.display = 'none';
  document.getElementById('modal').style.display = 'none';
  document.body.classList.remove('no-scroll');
}

// Initialize when page loads
window.addEventListener('DOMContentLoaded', loadTrends);
const backToTop = document.getElementById('backToTop');

window.addEventListener('scroll', () => {
  if (window.scrollY > 300) {
    backToTop.style.display = 'block';
  } else {
    backToTop.style.display = 'none';
  }
});

backToTop.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});