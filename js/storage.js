const STORAGE_KEY = "recipes";

function getRecipesFromStorage() {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : null;
  } catch {
    localStorage.removeItem(STORAGE_KEY);
    return null;
  }
}

function saveRecipesToStorage(recipes) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(recipes));
}

function initializeStorageWithSample(recipe) {
  const existing = getRecipesFromStorage();
  if (!existing || !Array.isArray(existing) || existing.length === 0) {
    const sampleRecipes = [
      recipe,
      {
        id: generateId(),
        title: "Spaghetti Carbonara",
        description: "Classic Italian pasta dish with eggs and pancetta.",
        ingredients: [
          "Spaghetti",
          "Eggs",
          "Pancetta",
          "Parmesan cheese",
          "Black pepper",
        ],
        steps: [
          "Boil pasta until al dente.",
          "Cook pancetta until crispy.",
          "Mix eggs and cheese then toss with pasta and pancetta.",
          "Serve immediately.",
        ],
        prepTime: 10,
        cookTime: 15,
        difficulty: "medium",
        imageUrl:
          "https://www.stefanofaita.com/wp-content/uploads/2022/04/spaghetti-carbonara.jpg",
      },

      {
        id: generateId(),
        title: "Chicken Curry",
        description:
          "A classic Indian chicken curry cooked with spices, onions, and tomatoes.",
        ingredients: [
          "Chicken – 500g",
          "Onions – 2 chopped",
          "Tomatoes – 2 chopped",
          "Ginger-garlic paste – 1.5 tbsp",
          "Red chilli powder – 1 tsp",
          "Turmeric – 1/2 tsp",
          "Coriander powder – 1 tbsp",
          "Garam masala – 1 tsp",
          "Salt – to taste",
          "Oil – 3 tbsp",
          "Coriander leaves",
        ],
        steps: [
          "Heat oil and sauté onions until golden.",
          "Add ginger-garlic paste and cook for 1 minute.",
          "Add tomatoes and cook until soft.",
          "Add spices and mix well.",
          "Add chicken and cook for 5 minutes.",
          "Pour water, cover and cook for 20 minutes.",
          "Garnish with coriander.",
        ],
        prepTime: 15,
        cookTime: 30,
        difficulty: "hard",
        imageUrl:"assets/chicken.png",
      },

      {
        id: generateId(),
        title: "Masala Dosa",
        description: "A crispy dosa filled with spiced potato masala.",
        ingredients: [
          "Rice – 2 cups",
          "Urad dal – 1 cup",
          "Poha – 1/2 cup",
          "Potatoes – 3 boiled",
          "Onion – 1 sliced",
          "Mustard seeds – 1 tsp",
          "Turmeric – 1/2 tsp",
          "Green chillies – 2",
          "Salt – to taste",
        ],
        steps: [
          "Soak rice, urad dal, poha and grind batter.",
          "Ferment overnight.",
          "Prepare potato masala by sautéing onions and spices.",
          "Spread batter on tawa and crisp it.",
          "Add masala and fold.",
        ],
        prepTime: 20,
        cookTime: 10,
        difficulty: "medium",
        imageUrl: "assets/masaladosa.png",
      },

      {
        id: generateId(),
        title: "Poha",
        description:
          "A light and tasty Indian breakfast made with flattened rice.",
        ingredients: [
          "Poha – 2 cups",
          "Onion – 1 chopped",
          "Mustard seeds – 1 tsp",
          "Turmeric – 1/2 tsp",
          "Green chillies – 2",
          "Peanuts – 2 tbsp",
          "Salt – to taste",
          "Lemon – 1/2",
        ],
        steps: [
          "Wash poha and set aside.",
          "Heat oil, add mustard and peanuts.",
          "Add onions, spices and sauté.",
          "Add poha and mix gently.",
          "Squeeze lemon before serving.",
        ],
        prepTime: 5,
        cookTime: 8,
        difficulty: "easy",
        imageUrl: "assets/poha.png",
      },
    ];
    saveRecipesToStorage(sampleRecipes);
  }
}

function generateId() {
  return "_" + Math.random().toString(36).substr(2, 9);
}

function addRecipe(recipe) {
  const recipes = getRecipesFromStorage() || [];
  recipe.id = generateId();
  recipes.push(recipe);
  saveRecipesToStorage(recipes);
  return recipe.id;
}

function updateRecipe(updatedRecipe) {
  const recipes = getRecipesFromStorage() || [];
  const idx = recipes.findIndex((r) => r.id === updatedRecipe.id);
  if (idx !== -1) {
    recipes[idx] = updatedRecipe;
    saveRecipesToStorage(recipes);
    return true;
  }
  return false;
}

function deleteRecipe(id) {
  let recipes = getRecipesFromStorage() || [];
  recipes = recipes.filter((r) => r.id !== id);
  saveRecipesToStorage(recipes);
}

function getRecipeById(id) {
  const recipes = getRecipesFromStorage() || [];
  return recipes.find((r) => r.id === id) || null;
}
