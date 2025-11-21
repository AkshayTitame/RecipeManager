const homeView = document.getElementById("homeView");
const detailView = document.getElementById("detailView");
const formView = document.getElementById("formView");
const recipeGrid = document.getElementById("recipeGrid");
const recipeDetail = document.getElementById("recipeDetail");

function showView(view) {
  [homeView, detailView, formView].forEach(v => v.classList.add("hidden"));
  view.classList.remove("hidden");
}

function clearGrid() {
  recipeGrid.innerHTML = "";
}

function createRecipeCard(recipe) {
  const card = document.createElement("div");
  card.className = "recipe-card";
  card.dataset.id = recipe.id;

  const img = document.createElement("img");
  img.src = recipe.imageUrl || "assets/placeholder.jpg";
  img.alt = recipe.title;
  card.appendChild(img);

  const h3 = document.createElement("h3");
  h3.textContent = recipe.title;
  card.appendChild(h3);

  const difficulty = document.createElement("p");
  difficulty.textContent = `Difficulty: ${capitalize(recipe.difficulty)}`;
  card.appendChild(difficulty);

  card.addEventListener("click", () => {
    showView(detailView);
    renderRecipeDetail(recipe.id);
  });

  return card;
}

function renderRecipeGrid(recipes) {
  clearGrid();
  if (!recipes || recipes.length === 0) {
    recipeGrid.textContent = "No recipes found.";
    return;
  }
  recipes.forEach(recipe => {
    const card = createRecipeCard(recipe);
    recipeGrid.appendChild(card);
  });
}

function renderRecipeDetail(id) {
  const recipe = getRecipeById(id);
  if (!recipe) {
    recipeDetail.innerHTML = "<p>Recipe not found.</p>";
    return;
  }
  recipeDetail.innerHTML = `
    <h2>${recipe.title}</h2>
    <img src="${recipe.imageUrl || "assets/placeholder.jpg"}" alt="${recipe.title}"/>
    <p><strong>Description:</strong> ${recipe.description || "N/A"}</p>
    <p><strong>Ingredients:</strong></p>
    <ul>${recipe.ingredients.map(i => `<li>${i}</li>`).join("")}</ul>
    <p><strong>Steps:</strong></p>
    <ol>${recipe.steps.map(s => `<li>${s}</li>`).join("")}</ol>
    <p><strong>Prep Time:</strong> ${recipe.prepTime} minutes</p>
    <p><strong>Cook Time:</strong> ${recipe.cookTime} minutes</p>
    <p><strong>Difficulty:</strong> ${capitalize(recipe.difficulty)}</p>
  `;
}

function fillFormForEdit(recipe) {
  if (!recipe) return;
  document.getElementById("titleInput").value = recipe.title;
  document.getElementById("descriptionInput").value = recipe.description || "";
  document.getElementById("ingredientsInput").value = recipe.ingredients.join("\n");
  document.getElementById("stepsInput").value = recipe.steps.join("\n");
  document.getElementById("prepTimeInput").value = recipe.prepTime;
  document.getElementById("cookTimeInput").value = recipe.cookTime;
  document.getElementById("difficultyInput").value = recipe.difficulty;
  document.getElementById("imageUrlInput").value = recipe.imageUrl || "";
}

function clearFormErrors() {
  document.querySelectorAll(".error-msg").forEach(el => (el.textContent = ""));
}

function capitalize(str) {
  if (!str) return "";
  return str.charAt(0).toUpperCase() + str.slice(1);
}
