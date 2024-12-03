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
      console.error("Failed to fetch news:", error);
    }
  }

  function renderNews(newsItems) {
    newsContainer.innerHTML = "";

    const fragment = document.createDocumentFragment();

    newsItems.forEach((newsItem) => {
      const newsItemElement = createNewsItemElement(newsItem);
      fragment.appendChild(newsItemElement);
    });

    newsContainer.appendChild(fragment);
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

// Recipes
document.addEventListener("DOMContentLoaded", () => {
  fetch("http://127.0.0.1:5501/api/recipes.json")
    .then((response) => response.json())
    .then((recipes) => {
      const recipesContainer = document.getElementById("recipes");
      recipes.forEach((recipe) => {
        const card = document.createElement("div");
        card.className = "recipe-card";
        card.innerHTML = `
        <img src="${recipe.image}"></img>
                  <h2>${recipe.title}</h2>
                  <p>${recipe.description}</p><br>
                  <strong>Nutritional Info:</strong>
                  <p><strong>Protien:</strong>${recipe.nutritionalInfo.protein}</p>
                  <p><strong>Carbs :</strong>${recipe.nutritionalInfo.carbs}</p>
                  <p><strong>Fats :</strong>${recipe.nutritionalInfo.fat}</p>  
              `;
        recipesContainer.appendChild(card);
      });
    })
    .catch((error) => console.error("Error fetching recipes:", error));
});

// BMI

$("#bmiForm").on("submit", function (event) {
  event.preventDefault(); // Prevent form from submitting normally

  const weightKg = $("#weight").val();
  const heightInches = $("#height").val();

  // Validation
  if (!weightKg || (weightKg <= 0 && weightKg >= 200)) {
    Toastify({
      text: "Please enter a valid weight (1-200 kg)",
      duration: 3000,
      close: true,
      gravity: "top",
      position: "right",
      backgroundColor: "#FF6B6B",
    }).showToast();
    return;
  }

  if (!heightInches || (heightInches <= 0 && heightInches >= 100)) {
    Toastify({
      text: "Please enter a valid height (1-100 inches)",
      duration: 3000,
      close: true,
      gravity: "top",
      position: "right",
      backgroundColor: "#FF6B6B",
    }).showToast();
    return;
  }

  // Conversion: kg to lbs (1 kg = 2.20462 lbs)
  const weightLbs = weightKg * 2.20462;

  const settings = {
    async: true,
    crossDomain: true,
    url: `https://smart-body-mass-index-calculator-bmi.p.rapidapi.com/api/BMI/imperial?lbs=${weightLbs.toFixed(
      2
    )}&inches=${heightInches}`,
    method: "GET",
    headers: {
      "x-rapidapi-key": "c712408eb2mshf3605eb7da791aap1465acjsn8ed2de14ff24",
      "x-rapidapi-host": "smart-body-mass-index-calculator-bmi.p.rapidapi.com",
    },
  };

  $.ajax(settings)
    .done(function (response) {
      // Success Toastify
      Toastify({
        text: `BMI Calculated Successfully!`,
        duration: 3000,
        close: true,
        gravity: "top",
        position: "right",
        backgroundColor: "#4CAF50",
      }).showToast();

      // Display detailed BMI result
      $("#bmiResult").html(`
          <p>Your BMI is: ${response.bmi.toFixed(2)}</p>
          <p>Category: ${response.bmiCategoryForAdults.category}</p>
      `);

      // Additional Toastify for BMI Category
      Toastify({
        text: `BMI Category: ${response.bmiCategoryForAdults.category}`,
        duration: 4000,
        close: true,
        gravity: "bottom",
        position: "center",
        backgroundColor: getBMICategoryColor(
          response.bmiCategoryForAdults.category
        ),
      }).showToast();
    })
    .fail(function (xhr, status, error) {
      // Error Toastify
      Toastify({
        text: "Error calculating BMI. Please try again.",
        duration: 3000,
        close: true,
        gravity: "top",
        position: "right",
        backgroundColor: "#FF6B6B",
      }).showToast();

      console.error("BMI Calculation Error:", error);
    });
});

// Helper function to get color based on BMI category
function getBMICategoryColor(category) {
  switch (category.toLowerCase()) {
    case "underweight":
      return "#FFA500"; // Orange
    case "normal weight":
      return "#4CAF50"; // Green
    case "overweight":
      return "#FF9800"; // Deep Orange
    case "obese":
      return "#F44336"; // Red
    default:
      return "#2196F3"; // Blue
  }
}