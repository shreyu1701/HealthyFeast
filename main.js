// hamburger meno toggle
document.addEventListener("DOMContentLoaded", () => {
  const hamburger = document.querySelector(".hamburger");
  const navLinks = document.querySelector(".nav-links");

  hamburger.addEventListener("click", () => {
    navLinks.classList.toggle("show");
  });
});

document.addEventListener("DOMContentLoaded", function () {
  const newsContainer = document.getElementById("newsContainer");
  const searchInput = document.getElementById("newsSearch");
  const filterSelect = document.getElementById("newsFilter");
  let allNews = []; // Store original news data

  // Fetch news from the API
  async function fetchNews() {
    try {
      const response = await fetch("/api/news.json");
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const newsData = await response.json();
      allNews = newsData;
      renderNews(newsData);
      setupSearchAndFilter();
    } catch (error) {
      handleErrorState(error);
    }
  }

  // Render news items with advanced rendering
  function renderNews(newsItems) {
    // Clear existing content
    newsContainer.innerHTML = "";

    // Create document fragment for performance
    const fragment = document.createDocumentFragment();

    // Render news items
    newsItems.forEach((newsItem) => {
      const newsItemElement = createNewsItemElement(newsItem);
      fragment.appendChild(newsItemElement);
    });

    // Append all items at once
    newsContainer.appendChild(fragment);

    // Add animation to news items
    animateNewsItems();
  }

  // Create individual news item element
  function createNewsItemElement(newsItem) {
    const newsItemElement = document.createElement("div");
    newsItemElement.classList.add("news-item");
    newsItemElement.dataset.id = newsItem.id;
    newsItemElement.dataset.category = extractCategory(newsItem.title);

    newsItemElement.innerHTML = `
          <div class="news-image-container">
              <img 
                  src="${newsItem.image}" 
                  alt="${newsItem.title}" 
                  loading="lazy" 
                  class="news-image"
              >
              <div class="news-image-overlay">
                  <span class="category-tag">${extractCategory(
                    newsItem.title
                  )}</span>
              </div>
          </div>
          <div class="news-content">
              <h3 class="news-title">${newsItem.title}</h3>
              <p class="news-description">${truncateText(
                newsItem.description,
                100
              )}</p>
              <div class="news-meta">
                  <span class="news-date">${formatDate(newsItem.date)}</span>
                  <span class="news-id">ID: ${newsItem.id}</span>
              </div>
              <button class="read-more" data-id="${
                newsItem.id
              }">Read More</button>
          </div>
      `;

    // Add event listeners
    addNewsItemEventListeners(newsItemElement, newsItem);

    return newsItemElement;
  }

  // Setup search and filter functionality
  function setupSearchAndFilter() {
    // Search functionality
    searchInput.addEventListener("input", function () {
      const searchTerm = this.value.toLowerCase();
      filterNews(searchTerm);
    });

    // Category filter
    filterSelect.addEventListener("change", function () {
      const selectedCategory = this.value;
      filterNewsByCategory(selectedCategory);
    });
  }

  // Filter news based on search term
  function filterNews(searchTerm) {
    const filteredNews = allNews.filter(
      (newsItem) =>
        newsItem.title.toLowerCase().includes(searchTerm) ||
        newsItem.description.toLowerCase().includes(searchTerm)
    );
    renderNews(filteredNews);
  }

  // Filter news by category
  function filterNewsByCategory(category) {
    if (category === "all") {
      renderNews(allNews);
    } else {
      const filteredNews = allNews.filter(
        (newsItem) =>
          extractCategory(newsItem.title).toLowerCase() ===
          category.toLowerCase()
      );
      renderNews(filteredNews);
    }
  }

  // Add event listeners to news items
  function addNewsItemEventListeners(newsItemElement, newsItem) {
    // Read More button
    const readMoreBtn = newsItemElement.querySelector(".read-more");
    readMoreBtn.addEventListener("click", () => openNewsModal(newsItem));

    // Hover effects
    newsItemElement.addEventListener("mouseenter", () => {
      newsItemElement.classList.add("news-item-hover");
    });

    newsItemElement.addEventListener("mouseleave", () => {
      newsItemElement.classList.remove("news-item-hover");
    });
  }

  // Open news modal with full details
  function openNewsModal(newsItem) {
    const modal = document.createElement("div");
    modal.classList.add("news-modal");
    modal.innerHTML = `
          <div class="news-modal-content">
              <span class="close-modal">&times;</span>
              <img src="${newsItem.image}" alt="${
      newsItem.title
    }" class="modal-image">
              <h2>${newsItem.title}</h2>
              <p>${newsItem.description}</p>
              <div class="modal-meta">
                  <span>Date: ${formatDate(newsItem.date)}</span>
                  <span>ID: ${newsItem.id}</span>
              </div>
          </div>
      `;

    // Close modal functionality
    const closeModal = modal.querySelector(".close-modal");
    closeModal.addEventListener("click", () => {
      document.body.removeChild(modal);
    });

    document.body.appendChild(modal);
  }

  // Animate news items on load
  function animateNewsItems() {
    const newsItems = document.querySelectorAll(".news-item");
    newsItems.forEach((item, index) => {
      item.style.opacity = "0";
      item.style.transform = "translateY(20px)";

      setTimeout(() => {
        item.style.transition = "all 0.5s ease";
        item.style.opacity = "1";
        item.style.transform = "translateY(0)";
      }, index * 100);
    });
  }

  // Error handling
  function handleErrorState(error) {
    newsContainer.innerHTML = `
          <div class="error-message">
              <h3>Oops! Something went wrong</h3>
              <p>${error.message}</p>
              <button id="retryButton">Retry</button>
          </div>
      `;

    const retryButton = document.getElementById("retryButton");
    retryButton.addEventListener("click", fetchNews);
  }

  // Utility Functions
  function truncateText(text, length) {
    return text.length > length ? text.substring(0, length) + "..." : text;
  }

  function formatDate(dateString) {
    const options = {
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  }

  function extractCategory(title) {
    const categories = ["Health", "Technology", "Science"];

    const foundCategory = categories.find((category) =>
      title.toLowerCase().includes(category.toLowerCase())
    );

    return foundCategory || "General";
  }

  // Initial fetch
  fetchNews();
});
