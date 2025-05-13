function toggleMenu() {
  var menuOptions = document.getElementById("menuOptions");
  var searchContainer = document.querySelector(".search-container");
  var menuIcon = document.getElementById("menuIcon");
  var closeIcon = document.getElementById("closeIcon");

  // Toggle visibility of menu and close icons
  menuIcon.style.display =
    menuIcon.style.display === "flex" || menuIcon.style.display === ""
      ? "none"
      : "flex";
  closeIcon.style.display =
    closeIcon.style.display === "none" || closeIcon.style.display === ""
      ? "flex"
      : "none";

  if (
    menuOptions.style.display === "none" ||
    menuOptions.style.display === ""
  ) {
    menuOptions.style.display = "flex";
    searchContainer.style.display = "none";
  } else {
    menuOptions.style.display = "none";
    searchContainer.style.display = "flex";
  }
}

document.addEventListener("DOMContentLoaded", function () {
  // Check if the current page is recipe-details.html
  if (window.location.pathname.includes("recipe-details.html")) {
    displayRecipeDetails();
  }
  const bmiCategory = localStorage.getItem("bmiResult");
  if (bmiCategory) {
    const bmiResult = JSON.parse(bmiCategory);
    const bmiResultElement = document.getElementById("bmiResult");
    bmiResultElement.textContent = `Your BMI is: ${
      bmiResult.bmi
    } (${bmiResult.category.toUpperCase()})`; // Display BMI value
  }
});


document.addEventListener('DOMContentLoaded', () => {
  const toggleButton = document.getElementById('darkModeToggle');
  const isDarkMode = localStorage.getItem('dark-mode') === 'true';

  if (isDarkMode) {
    document.body.classList.add('dark-mode');
  }

  toggleButton.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    localStorage.setItem('dark-mode', document.body.classList.contains('dark-mode'));
  });
});

function redirectToSearch() {
  window.location.href = "search-results.html";
}

function aboutPage() {
  window.location.href = "about-us.html";
}

document.addEventListener('DOMContentLoaded', () => {
  const searchInput = document.getElementById('searchInput');
  
  // Add event listener for the Enter key
  searchInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
      search();
    }
  });
});


function showSuggestions(input) {
  const suggestions = ["Spaghetti, Garlic, Olive oil, Red pepper flakes, Parsley", "Tomatoes, Fresh mozzarella, Basil, Olive oil, Balsamic vinegar, Salt", "Shrimp, Lemon, Garlic, Butter, Parsley", "Bread, Butter, Cheddar cheese, Garlic powder, Tomato", "Tomatoes, Onion, Garlic, Basil, Vegetable broth", "Cucumber, Tomatoes, Red onion, Feta cheese, Kalamata olives, Olive oil", "Bread, Avocado, Lemon juice, Salt, Red pepper flakes", "Bell peppers, Ground beef, Rice, Onion, Tomato sauce, Cheese", "Romaine lettuce, Grilled chicken breast, Parmesan cheese, Caesar dressing, Croutons", "Salmon fillets, Lemon, Garlic, Olive oil, Dill", "Banana, Berries (strawberries, blueberries), Yogurt, Honey, Milk", "Flour, Eggs, Milk, Baking powder, Sugar", "Pizza dough, Tomato sauce, Fresh mozzarella, Basil, Olive oil", "Chicken breast, Bell peppers, Onion, Fajita seasoning, Tortillas", "Flour, Butter, Sugar, Brown sugar, Eggs, Chocolate chips"];
  const suggestionsList = document.getElementById("suggestionsList");
  suggestionsList.innerHTML = ""; // Clear previous suggestions

  suggestions.forEach(suggestion => {
      if (suggestion.toLowerCase().includes(input.toLowerCase())) {
          const listItem = document.createElement("li");
          listItem.textContent = suggestion;
          listItem.addEventListener("click", function() {
              document.getElementById("searchInput").value = suggestion;
              document.getElementById("suggestionsContainer").style.display = "none"; // Hide suggestions after click
          });
          suggestionsList.appendChild(listItem);
      }
  });

  const suggestionsContainer = document.getElementById("suggestionsContainer");
  if (input.trim() !== "") {
      suggestionsContainer.style.display = "block"; // Show suggestions if input is not empty
  } else {
      suggestionsContainer.style.display = "none"; // Hide suggestions if input is empty
  }
}

function search() {
  const searchInput = document.getElementById("searchInput").value.trim().toLowerCase();
  if (searchInput !== "") {
      const bmiCategory = localStorage.getItem("bmiResult");
      if (bmiCategory) {
          const bmiResult = JSON.parse(bmiCategory);
          const jsonFile = `${bmiResult.category}_recipes.json`;

          fetch(jsonFile)
              .then((response) => response.json())
              .then((recipes) => {
                  const matchingRecipes = recipes.filter((recipe) =>
                      recipe.ingredients.some((ingredient) =>
                          searchInput.includes(ingredient.toLowerCase())
                      )
                  );

                  // Store the filtered recipes in localStorage
                  localStorage.setItem(
                      "searchResults",
                      JSON.stringify(matchingRecipes)
                  );

                  // Redirect to the search results page
                  window.location.href = "search-results.html";
              })
              .catch((error) => console.error("Error loading recipes:", error));
      } else {
          // Handle case where BMI category is not available
          Swal.fire({
              title: "Warning",
              text: "Please input your weight and height to calculate your BMI...",
              icon: "warning",
              confirmButtonText: "OK",
          });
      }
  } else {
      // Handle case where no search term is entered
      Swal.fire({
          title: "Error!",
          text: "Please input specific ingredients.",
          icon: "error",
          confirmButtonText: "OK",
      });
  }
}


function findRecipesByQuery(recipes, searchQuery) {
  return recipes.filter((recipe) =>
    recipe.ingredients.some((ingredient) => searchQuery.includes(ingredient))
  );
}

function displayResultsOnSearchResultsPage() {
  const searchResultsContainer = document.getElementById("results-container");
  const searchResults = JSON.parse(localStorage.getItem("searchResults"));

  if (searchResults) {
    const ul = document.createElement("ul");

    searchResults.forEach((recipe) => {
      const li = document.createElement("li");
      // Make the recipe name clickable with corresponding image and ingredients
      li.innerHTML = `
              <div class="recipe-card">
                  <img src="images/${recipe.name
                    .toLowerCase()
                    .replace(/\s+/g, "-")}.jpg" alt="${
        recipe.name
      } Image" class="recipe-image">
                  <div class="recipe-details">
                      <a href="recipe-details.html?recipe=${encodeURIComponent(
                        JSON.stringify(recipe)
                      )}"><strong style="color: black; text-shadow: 0 0 4px white;">${recipe.name}</strong></a>
                      <p class="recipe-ingredients">${recipe.ingredients.join(
                        ", "
                      )}</p>
                  </div>
              </div>`;
      ul.appendChild(li);
    });

    searchResultsContainer.appendChild(ul);
  } else {
    searchResultsContainer.innerHTML = "<p>No matching recipes found.</p>";
  }
}

document.addEventListener(
  "DOMContentLoaded",
  displayResultsOnSearchResultsPage
);

function displayRecipeDetails() {
  const recipeDetailsContainer = document.getElementById(
    "recipe-details-container"
  );
  const recipeParam = new URLSearchParams(window.location.search).get("recipe");

  if (recipeParam && !recipeDetailsContainer.innerHTML.trim()) {
    const recipe = JSON.parse(decodeURIComponent(recipeParam));

    const detailsDiv = document.createElement("div");
    detailsDiv.classList.add("recipe-details");

    // Add the image to the right
    detailsDiv.innerHTML = `<div class="recipe-image">
                    <img src="images/${recipe.name
                      .toLowerCase()
                      .replace(/\s+/g, "-")}.jpg" alt="${recipe.name} Image" class="CME">
                                </div>`;

    // Add recipe name and other details
    detailsDiv.innerHTML += `
            <div class="recipe-info">
                <h2>${recipe.name}</h2>
                <p><strong>Ingredients:</strong></p>
                <ul>${recipe.quantity
                  .map((quantity) => `<li>${quantity}</li>`)
                  .join("")}</ul>
                <p><strong>Instructions:</strong></p>
                <ol>${recipe.instructions
                  .map((instruction) => `<li>${instruction}</li>`)
                  .join("")}</ol>
                <p><strong>Calories:<ol>${recipe.calories}<ol></strong></p>
            </div>`;

    recipeDetailsContainer.appendChild(detailsDiv);
  } else if (!recipeParam) {
    // Handle case where no recipe details are provided
    recipeDetailsContainer.innerHTML = "<p>No recipe details found.</p>";
  }
}

// Call the displayRecipeDetails function when the recipe-details.html page loads
document.addEventListener("DOMContentLoaded", displayRecipeDetails);

document.addEventListener("DOMContentLoaded", function () {
  const container = document.getElementById("horizontalScrollContainer");
  const bottomContainer = document.getElementById(
    "bottomHorizontalScrollContainer"
  );

  container.addEventListener("wheel", handleScroll);
  bottomContainer.addEventListener("wheel", handleScroll);

  function handleScroll(event) {
    event.preventDefault();
    const scrollAmount = event.deltaY || event.deltaX;
    const containerScrollLeft = container.scrollLeft;
    const boxWidth = container.querySelector(".placeholder-box").offsetWidth;
    const newPosition =
      Math.round(containerScrollLeft / boxWidth) * boxWidth + scrollAmount;
    container.scrollTo({
      left: newPosition,
      behavior: "smooth",
    });
  }
});

function redirectToHome() {
  window.location.href = "index.html";
}

function redirectToHealthCare() {
  window.location.href = "health-care-results.html";
}

function redirectToAboutUs() {
  window.location.href = "about-us.html";
}

function calculateBMI() {
  const weightInput = document.getElementById("weight");
  const heightInput = document.getElementById("height");
  const resultElement = document.getElementById("result");

  const weight = parseFloat(weightInput.value);
  const height = parseFloat(heightInput.value) / 100; // Convert height to meters

  if (isNaN(weight) || isNaN(height) || height <= 0 || weight <= 0) {
    // Notify the user with an error message using Swal.fire
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: "Please enter valid weight and height values.",
    });
  } else {
    const bmi = weight / (height * height);
    resultElement.textContent = `Your BMI is: ${bmi.toFixed(2)}`;

    // Determine BMI category
    let category = "";
    if (bmi < 18.5) {
      category = "underweight";
    } else if (bmi < 22.9) {
      category = "normal";
    } else if (bmi < 24.9) {
      category = "overweight at risk";
    } else if (bmi < 29.9) {
      category = "obese i";
    } else {
      category = "obese ii";
    }

    // Notify the user with the BMI category

    Swal.fire({
      icon: "info",
      title: "BMI Result",
      text: `Your BMI category is: ${category.toUpperCase()}`,
    });

    // Save BMI result and category to local storage
    localStorage.setItem(
      "bmiResult",
      JSON.stringify({ bmi: bmi.toFixed(2), category })
    );
  }
}

function displayAlertUnder() {
  Swal.fire({
    title: "What is Underweight?",
    text: "When your BMI classification is underweight, this will mean that you will need to increase the portions of your meals to gain a healthy weight. The recipes that will be recommended to you are recipes that will help you gain a healthy weight.",
    icon: "question",
    confirmButtonText: "Okay",
  });
}

function displayAlertNormal() {
  Swal.fire({
    title: "What is Normal weight?",
    text: "When your BMI is normal, you are using this app to maintain that weight. The recipes that will be recommended to you are recipes that will help you maintain weight.",
    icon: "question",
    confirmButtonText: "Okay",
  });
}

function displayAlertOver() {
  Swal.fire({
    title: "What is Overweight",
    text: "When your BMI classification is overweight, this means that you need to reduce the portion of your meals. The recipes that will be recommended to you are recipes that will help you reduce weight.",
    icon: "question",
    confirmButtonText: "Okay",
  });
}

function displayAlertObese1() {
  Swal.fire({
    title: "What is Obese I",
    text: "Your BMI classification of obese I, may be the lowest level of obesity but still carries significant health risks. Losing weight is advised.",
    icon: "question",
    confirmButtonText: "Okay",
  });
}

function displayAlertObese2() {
  Swal.fire({
    title: "What is Obese II",
    text: "Obese II is the severe level of obesity. Losing weight is crucially adviced. Reduce the portion of meal with high fat content.",
    icon: "question",
    confirmButtonText: "Okay",
  });
}

function showPreview(imagePath) {
  var modal = document.getElementById("previewModal");
  var modalImg = document.getElementById("previewImage");
  modal.style.display = "block";
  modalImg.src = imagePath;
}

function closePreview() {
  var modal = document.getElementById("previewModal");
  modal.style.display = "none";
}

function setRecommendedIntakes() {
  const ageInput = document.getElementById("age");
  const age = parseInt(ageInput.value);
  const gender = document.getElementById("gender").value;

  // Fetch recommended intakes based on age and gender
  fetch("recommendations.json")
    .then((response) => response.json())
    .then((data) => {
      const ageGroup = data.ageGroups.find((group) => {
        const [minAge, maxAge] = group.ageRange.split("-");
        return age >= parseInt(minAge) && age <= parseInt(maxAge);
      });

      if (ageGroup) {
        const recommendedEnergy = ageGroup[gender].energyIntake;
        const recommendedWater = ageGroup[gender].waterIntake;

        document.getElementById(
          "recommendedEnergy"
        ).textContent = `Calories: ${recommendedEnergy} kcal`;
        document.getElementById(
          "recommendedWater"
        ).textContent = `Water: ${recommendedWater} mL`;

        // Save recommended intakes to local storage
        localStorage.setItem("recommendedEnergy", recommendedEnergy);
        localStorage.setItem("recommendedWater", recommendedWater);

        // Initialize remaining intakes to 0
        localStorage.setItem("remainingEnergy", 0);
        localStorage.setItem("remainingWater", 0);

        // Display remaining intakes
        updateRemainingIntakes();

        Swal.fire({
          icon: "success",
          title: "Success",
        });
      } else {
        console.error(
          "No recommended intakes found for the specified age and gender."
        );
      }
    })
    .catch((error) => {
      console.error("Error fetching recommended intakes:", error);
    });
}

function subtractConsumedEnergy() {
  const consumedEnergy =
    parseInt(document.getElementById("consumedEnergy").value) || 0;
  let remainingEnergy = parseInt(localStorage.getItem("remainingEnergy")) || 0;
  const recommendedEnergy =
    parseInt(localStorage.getItem("recommendedEnergy")) || 0;
  remainingEnergy += consumedEnergy; // Add consumed energy to remaining energy
  localStorage.setItem(
    "remainingEnergy",
    remainingEnergy
  ); // Cap remaining energy to recommendedEnergy
  updateRemainingIntakes();

  Swal.fire({
    icon: "success",
    title: "Success",
    text: `Remaining energy: ${
      remainingEnergy
    }/${recommendedEnergy} kcal`,
  });
}

function subtractConsumedWater() {
  const consumedWater =
    parseInt(document.getElementById("consumedWater").value) || 0;
  let remainingWater = parseInt(localStorage.getItem("remainingWater")) || 0;
  const recommendedWater =
    parseInt(localStorage.getItem("recommendedWater")) || 0;
  remainingWater += consumedWater; // Add consumed water to remaining water
  localStorage.setItem(
    "remainingWater",
    remainingWater
  ); // Cap remaining water to recommendedWater
  updateRemainingIntakes();

  Swal.fire({
    icon: "success",
    title: "Success",
    text: `Remaining water: ${
      remainingWater
    }/${recommendedWater} mL`,
  });
}


// Function to update the progress meter based on consumed and recommended intake
function updateProgressMeter(consumed, recommended, meterId) {
  const meter = document.getElementById(meterId);
  const percentage = (consumed / recommended) * 100;
  meter.style.width = percentage + "%";
}

// Function to update the remaining intakes
function updateRemainingIntakes() {
  const remainingEnergy = parseInt(localStorage.getItem("remainingEnergy")) || 0;
  const recommendedEnergy = parseInt(localStorage.getItem("recommendedEnergy")) || 0;
  const remainingWater = parseInt(localStorage.getItem("remainingWater")) || 0;
  const recommendedWater = parseInt(localStorage.getItem("recommendedWater")) || 0;

  // Update remaining energy display
  document.getElementById("remainingEnergy").textContent = `${remainingEnergy}/ ${recommendedEnergy} kcal`;

  // Update remaining water display
  document.getElementById("remainingWater").textContent = `${remainingWater}/ ${recommendedWater} mL`;

  // Update progress meter for energy
  updateProgressMeter(remainingEnergy, recommendedEnergy, "consumedEnergyMeter");

  // Update progress meter for water
  updateProgressMeter(remainingWater, recommendedWater, "consumedWaterMeter");
}

// Call the updateRemainingIntakes function when the page loads
document.addEventListener("DOMContentLoaded", updateRemainingIntakes); 

function openTab(evt, tabName) {
  var i, tabcontent, tablinks;
  tabcontent = document.getElementsByClassName("tabcontent");
  for (i = 0; i < tabcontent.length; i++) {
    tabcontent[i].style.display = "none";
  }
  tablinks = document.getElementsByClassName("tablinks");
  for (i = 0; i < tablinks.length; i++) {
    tablinks[i].className = tablinks[i].className.replace(" active", "");
  }
  document.getElementById(tabName).style.display = "block";
  evt.currentTarget.className += " active";
}

// Open the default tab on page load
document.getElementById("defaultOpen").click();

