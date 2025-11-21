let currentEditedId = null;

const searchInput = document.getElementById("searchInput");
const difficultyFilter = document.getElementById("difficultyFilter");
const addRecipeBtn = document.getElementById("addRecipeBtn");
const backToHomeBtn = document.getElementById("backToHomeBtn");
const editRecipeBtn = document.getElementById("editRecipeBtn");
const deleteRecipeBtn = document.getElementById("deleteRecipeBtn");
const cancelFormBtn = document.getElementById("cancelFormBtn");
const recipeForm = document.getElementById("recipeForm");
const formTitle = document.getElementById("formTitle");
const darkModeToggle = document.getElementById("darkModeToggle");

function getInitialRecipe() {
  return {
    id: "_init",
    title: "Paneer Butter Masala",
    description:
      "A creamy, rich North Indian curry made with paneer, butter, tomato gravy, and aromatic spices.",
    ingredients: [
      "Paneer – 250g (cubed)",
      "Butter – 2 tbsp",
      "Oil – 1 tbsp",
      "Onion – 2 medium (chopped)",
      "Tomatoes – 3 (pureed)",
      "Ginger-garlic paste – 1 tbsp",
      "Cashews – 10 (soaked)",
      "Cream – 3 tbsp",
      "Red chilli powder – 1 tsp",
      "Turmeric – 1/2 tsp",
      "Garam masala – 1 tsp",
      "Sugar – 1/2 tsp",
      "Kasuri methi – 1 tsp",
      "Salt – to taste",
    ],
    steps: [
      "Heat butter and oil in a pan, add onions and sauté until golden.",
      "Add ginger-garlic paste and cook for 1 minute.",
      "Add tomato puree and cook until oil separates.",
      "Blend this mixture with cashews into a smooth gravy.",
      "Pour the gravy back into the pan and add spices.",
      "Add paneer cubes and cook for 5 minutes.",
      "Add cream and kasuri methi, mix gently.",
      "Simmer for 2 minutes and serve hot.",
    ],
    prepTime: 20,
    cookTime: 25,
    difficulty: "medium",
    imageUrl: "assets/paneer.png",
  };
}

function filterAndRenderRecipes() {
  const allRecipes = getRecipesFromStorage() || [];
  const searchText = searchInput.value.trim().toLowerCase();
  const difficulty = difficultyFilter.value;

  let filtered = allRecipes;
  if (searchText) {
    filtered = filtered.filter((r) =>
      r.title.toLowerCase().includes(searchText)
    );
  }
  if (difficulty !== "all") {
    filtered = filtered.filter((r) => r.difficulty === difficulty);
  }
  renderRecipeGrid(filtered);
}

function init() {
  initializeStorageWithSample(getInitialRecipe());
  filterAndRenderRecipes();
  showView(homeView);
}

addRecipeBtn.addEventListener("click", () => {
  currentEditedId = null;
  formTitle.textContent = "Add Recipe";
  recipeForm.reset();
  clearFormErrors();
  showView(formView);
});

backToHomeBtn.addEventListener("click", () => {
  showView(homeView);
  filterAndRenderRecipes();
});

searchInput.addEventListener("input", () => filterAndRenderRecipes());
difficultyFilter.addEventListener("change", () => filterAndRenderRecipes());

editRecipeBtn.addEventListener("click", () => {
  if (!currentEditedId) return;
  const recipe = getRecipeById(currentEditedId);
  if (!recipe) return;

  formTitle.textContent = "Edit Recipe";
  fillFormForEdit(recipe);
  clearFormErrors();
  showView(formView);
});

deleteRecipeBtn.addEventListener("click", () => {
  if (!currentEditedId) return;
  if (confirm("Are you sure you want to delete this recipe?")) {
    deleteRecipe(currentEditedId);
    currentEditedId = null;
    showView(homeView);
    filterAndRenderRecipes();
  }
});

cancelFormBtn.addEventListener("click", (e) => {
  e.preventDefault();
  showView(homeView);
  filterAndRenderRecipes();
});

recipeForm.addEventListener("submit", (e) => {
  e.preventDefault();
  clearFormErrors();

  const title = document.getElementById("titleInput").value.trim();
  const description = document.getElementById("descriptionInput").value.trim();
  const ingredientsRaw = document
    .getElementById("ingredientsInput")
    .value.trim();
  const stepsRaw = document.getElementById("stepsInput").value.trim();
  const prepTime = document.getElementById("prepTimeInput").value.trim();
  const cookTime = document.getElementById("cookTimeInput").value.trim();
  const difficulty = document.getElementById("difficultyInput").value;
  const imageUrl = document.getElementById("imageUrlInput").value.trim();

  let hasError = false;

  if (!title) {
    setError("titleInput", "Title is required");
    hasError = true;
  }
  if (!ingredientsRaw) {
    setError("ingredientsInput", "Ingredients are required");
    hasError = true;
  }
  if (!stepsRaw) {
    setError("stepsInput", "Steps are required");
    hasError = true;
  }
  if (!prepTime || isNaN(prepTime) || prepTime < 0) {
    setError("prepTimeInput", "Valid prep time is required");
    hasError = true;
  }
  if (!cookTime || isNaN(cookTime) || cookTime < 0) {
    setError("cookTimeInput", "Valid cook time is required");
    hasError = true;
  }
  if (!difficulty) {
    setError("difficultyInput", "Difficulty is required");
    hasError = true;
  }
  if (imageUrl && !isValidUrl(imageUrl)) {
    setError("imageUrlInput", "Image URL is invalid");
    hasError = true;
  }

  if (hasError) return;

  const ingredients = ingredientsRaw
    .split("\n")
    .map((i) => i.trim())
    .filter((i) => i);
  const steps = stepsRaw
    .split("\n")
    .map((s) => s.trim())
    .filter((s) => s);

  const recipeData = {
    id: currentEditedId || undefined,
    title,
    description,
    ingredients,
    steps,
    prepTime: Number(prepTime),
    cookTime: Number(cookTime),
    difficulty,
    imageUrl: imageUrl || "",
  };

  if (currentEditedId) {
    recipeData.id = currentEditedId;
    updateRecipe(recipeData);
  } else {
    addRecipe(recipeData);
  }

  currentEditedId = null;
  showView(homeView);
  filterAndRenderRecipes();
});

function setError(inputId, message) {
  const input = document.getElementById(inputId);
  const errorSpan = input.parentElement.querySelector(".error-msg");
  if (errorSpan) errorSpan.textContent = message;
}
function isValidUrl(string) {
  try {
    new URL(string);
    return true;
  } catch {
    return false;
  }
}

function renderRecipeDetail(id) {
  currentEditedId = id;
  const recipe = getRecipeById(id);
  if (!recipe) return;
  window.scrollTo(0, 0);
  renderRecipeDetailUI(id);
  showView(detailView);
}

function renderRecipeDetailUI(id) {
  const recipe = getRecipeById(id);
  if (!recipe) return;
  recipeDetail.innerHTML = `
    <h2>${recipe.title}</h2>
    <img src="${recipe.imageUrl || "assets/placeholder.jpg"}" alt="${
    recipe.title
  }" />
    <p><strong>Description:</strong> ${recipe.description || "N/A"}</p>
    <p><strong>Ingredients:</strong></p>
    <ul>${recipe.ingredients.map((i) => `<li>${i}</li>`).join("")}</ul>
    <p><strong>Steps:</strong></p>
    <ol>${recipe.steps.map((s) => `<li>${s}</li>`).join("")}</ol>
    <p><strong>Prep Time:</strong> ${recipe.prepTime} minutes</p>
    <p><strong>Cook Time:</strong> ${recipe.cookTime} minutes</p>
    <p><strong>Difficulty:</strong> ${capitalize(recipe.difficulty)}</p>
  `;
}    

darkModeToggle.addEventListener("click", () => {
  const currentTheme = document.documentElement.getAttribute("data-theme");
  if (currentTheme === "dark") {
    document.documentElement.removeAttribute("data-theme");
    localStorage.setItem("theme", "light");
  } else {
    document.documentElement.setAttribute("data-theme", "dark");
    localStorage.setItem("theme", "dark");
  }
});

function loadTheme() {
  const storedTheme = localStorage.getItem("theme");
  if (storedTheme === "dark") {
    document.documentElement.setAttribute("data-theme", "dark");
  }
}

loadTheme();
init();
