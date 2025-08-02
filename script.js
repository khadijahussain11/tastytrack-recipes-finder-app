
const recipesContainer = document.getElementById("recipes-container");
const searchInput = document.getElementById("searchInput");
const searchBtn = document.getElementById("search-Btn");
// const mainContainer = document.querySelectorAll(".main-recipes-container");

const API_BASE = "https://www.themealdb.com/api/json/v1/1/search.php?s=";
function displayRecipes(recipes) {
  recipesContainer.innerHTML = ""; 

  if (!recipes || recipes.length === 0) {
    recipesContainer.innerHTML = `<p>No recipes found.</p>`;
    return;
  }

  recipes.forEach((meal) => {
    const card = document.createElement("div");
    card.className = "recipe-card";
    card.innerHTML = `
      <img src="${meal.strMealThumb}" alt="${meal.strMeal}" />
      <h3>${meal.strMeal}</h3>
       <button class="view-more-btn">View More</button>
    `;
    const viewMoreBtn = card.querySelector(".view-more-btn");
viewMoreBtn.addEventListener("click", () => showModal(meal));
    recipesContainer.appendChild(card);
       
  });
}


window.addEventListener("DOMContentLoaded", async () => {
  try {
    const res = await fetch(API_BASE + "chicken");
    const data = await res.json();
    displayRecipes(data.meals || []);
  } catch (err) {
    console.error("Error fetching latest recipes:", err);
  }
});


searchBtn.addEventListener("click", async () => {
  const query = searchInput.value.trim();
  if (!query) return;

  try {
    const res = await fetch(API_BASE + query);
    const data = await res.json();
    displayRecipes(data.meals || []);
  } catch (err) {
    console.error("Error searching recipes:", err);
  }
});



function showModal(meal) {
  const modal = document.createElement("div");
  modal.className = "modal-overlay";
  modal.innerHTML = `
    <div class="modal-content">
      <span class="close-btn">&times;</span>
      <h2>${meal.strMeal}</h2>
      <img src="${meal.strMealThumb}" alt="${meal.strMeal}" />
      <p><strong>Category:</strong> ${meal.strCategory}</p>
      <p><strong>Area:</strong> ${meal.strArea}</p>
      <h3>Ingredients:</h3>
      <ul>
        ${getIngredientsList(meal)}
      </ul>
      <h3>Instructions:</h3>
      <p>${meal.strInstructions}</p>
      ${
        meal.strYoutube
          ? `<p><a href="${meal.strYoutube}" target="_blank">Watch on YouTube</a></p>`
          : ""
      }
    </div>
  `;
  document.body.appendChild(modal);

  
  modal.querySelector(".close-btn").onclick = () => modal.remove();
  modal.onclick = (e) => {
    if (e.target.className === "modal-overlay") modal.remove();
  };
}


function getIngredientsList(meal) {
  let ingredients = "";
  for (let i = 1; i <= 20; i++) {
    const ingredient = meal[`strIngredient${i}`];
    const measure = meal[`strMeasure${i}`];
    if (ingredient && ingredient.trim()) {
      ingredients += `<li>${ingredient} - ${measure}</li>`;
    }
  }
  return ingredients;
}
