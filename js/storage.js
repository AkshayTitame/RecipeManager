

const STORAGE_KEY = 'recipes';

function getRecipes() {
    try {
        const data = localStorage.getItem(STORAGE_KEY);
        if (!data) return [];
        const parsed = JSON.parse(data);
        if (!Array.isArray(parsed)) throw new Error('Invalid data format');
        return parsed;
    } catch (error) {
        console.error('Error loading recipes from localStorage:', error);
        
        localStorage.removeItem(STORAGE_KEY);
        return [];
    }
}

function saveRecipes(recipes) {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(recipes));
    } catch (error) {
        console.error('Error saving recipes to localStorage:', error);
        alert('Failed to save recipes. Storage might be full.');
    }
}

function getRecipeById(id) {
    const recipes = getRecipes();
    return recipes.find(recipe => recipe.id === id);
}

function addRecipe(recipeData) {
    const recipes = getRecipes();
    const newRecipe = {
        ...recipeData,
        id: Date.now().toString()
    };
    recipes.push(newRecipe);
    saveRecipes(recipes);
    return newRecipe;
}

function updateRecipe(id, updatedData) {
    const recipes = getRecipes();
    const index = recipes.findIndex(recipe => recipe.id === id);
    if (index !== -1) {
        recipes[index] = { ...recipes[index], ...updatedData };
        saveRecipes(recipes);
        return recipes[index];
    }
    return null;
}

function deleteRecipe(id) {
    const recipes = getRecipes();
    const filtered = recipes.filter(recipe => recipe.id !== id);
    saveRecipes(filtered);
}

function initializeSampleData() {
    const recipes = getRecipes();
    if (recipes.length === 0) {
        const sampleRecipes = [
            {
                id: 'classic-pancakes',
                title: 'Classic Pancakes',
                description: 'Fluffy and delicious homemade pancakes perfect for breakfast.',
                ingredients: [
                    '1 cup all-purpose flour',
                    '2 tablespoons sugar',
                    '1 tablespoon baking powder',
                    '1/4 teaspoon salt',
                    '1 cup milk',
                    '1 egg',
                    '2 tablespoons melted butter',
                    '1 teaspoon vanilla extract'
                ],
                steps: [
                    'In a large bowl, whisk together flour, sugar, baking powder, and salt.',
                    'In another bowl, mix milk, egg, melted butter, and vanilla.',
                    'Pour wet ingredients into dry ingredients and stir until just combined.',
                    'Heat a non-stick skillet over medium heat.',
                    'Pour 1/4 cup batter onto skillet for each pancake.',
                    'Cook until bubbles form on surface and edges look set, about 2-3 minutes.',
                    'Flip and cook until golden brown, about 1-2 minutes more.',
                    'Serve warm with syrup, butter, or your favorite toppings.'
                ],
                prepTime: 10,
                cookTime: 15,
                difficulty: 'easy',
                image: "https://www.pamperedchef.ca/iceberg/com/recipe/1317742-lg.jpg"
            },
            {
                id: 'butter-chicken',
                title: 'Butter Chicken',
                description: 'A rich and creamy Indian curry made with chicken, butter, and a blend of spices.',
                ingredients: [
                    '500g chicken breast, cut into pieces',
                    '2 tbsp butter',
                    '1 onion, finely chopped',
                    '2 garlic cloves, minced',
                    '1 inch ginger, grated',
                    '2 tsp garam masala',
                    '1 tsp turmeric',
                    '1 tsp chili powder',
                    '1 cup tomato puree',
                    '1 cup heavy cream',
                    'Salt to taste',
                    'Fresh cilantro for garnish'
                ],
                steps: [
                    'Heat butter in a pan and sauté onions until golden.',
                    'Add garlic and ginger, cook for 1 minute.',
                    'Add spices and cook for another minute.',
                    'Add chicken pieces and cook until browned.',
                    'Pour in tomato puree and simmer for 10 minutes.',
                    'Stir in cream and simmer until chicken is cooked through.',
                    'Garnish with cilantro and serve with rice or naan.'
                ],
                prepTime: 15,
                cookTime: 30,
                difficulty: 'medium',
                image: "	https://www.licious.in/blog/wp-content/uploads/2020/10/butter-chicken-.jpg"
            },
            {
                id: 'chicken-biryani',
                title: 'Chicken Biryani',
                description: 'A fragrant and flavorful Indian rice dish layered with spiced chicken and saffron.',
                ingredients: [
                    '500g chicken, cut into pieces',
                    '2 cups basmati rice',
                    '2 onions, sliced',
                    '2 tomatoes, chopped',
                    '2 tbsp biryani masala',
                    '1 tsp turmeric',
                    '1 cup yogurt',
                    '1/2 cup oil',
                    'Saffron strands',
                    'Fresh mint and cilantro',
                    'Salt to taste'
                ],
                steps: [
                    'Marinate chicken with yogurt, biryani masala, turmeric, and salt for 1 hour.',
                    'Cook rice until 70% done and set aside.',
                    'Fry onions until golden and set aside.',
                    'In a pot, layer marinated chicken, rice, fried onions, and herbs.',
                    'Add saffron dissolved in warm milk on top.',
                    'Cover and cook on low heat for 30 minutes.',
                    'Serve hot with raita.'
                ],
                prepTime: 20,
                cookTime: 40,
                difficulty: 'hard',
                image: "https://t3.ftcdn.net/jpg/15/58/39/46/360_F_1558394657_Q9kt2srmZoQQzp6KiDEQYJws7KCuAWta.jpg"
            },
            {
                id: 'paneer-tikka',
                title: 'Paneer Tikka',
                description: 'Grilled paneer cubes marinated in yogurt and spices, a popular Indian appetizer.',
                ingredients: [
                    '250g paneer, cubed',
                    '1 cup yogurt',
                    '1 tbsp ginger-garlic paste',
                    '1 tsp chili powder',
                    '1 tsp garam masala',
                    '1 tsp cumin powder',
                    '1 lemon, juiced',
                    'Salt to taste',
                    'Oil for grilling'
                ],
                steps: [
                    'Mix yogurt with all spices, ginger-garlic paste, lemon juice, and salt.',
                    'Add paneer cubes and marinate for 30 minutes.',
                    'Thread onto skewers.',
                    'Grill or bake at 200°C for 15-20 minutes, turning occasionally.',
                    'Serve with mint chutney and lemon wedges.'
                ],
                prepTime: 10,
                cookTime: 20,
                difficulty: 'easy',
                image: "https://www.indianveggiedelight.com/wp-content/uploads/2021/08/air-fryer-paneer-tikka-featured.jpg"
            },
            {
                id: 'chana-masala',
                title: 'Chana Masala',
                description: "A spicy chickpea curry that's a staple in Indian vegetarian cuisine.",
                ingredients: [
                    '2 cups chickpeas, cooked',
                    '2 onions, chopped',
                    '2 tomatoes, chopped',
                    '1 tbsp ginger-garlic paste',
                    '2 tsp chana masala',
                    '1 tsp turmeric',
                    '1 tsp chili powder',
                    '1 tsp cumin seeds',
                    '2 tbsp oil',
                    'Fresh cilantro',
                    'Salt to taste'
                ],
                steps: [
                    'Heat oil and add cumin seeds.',
                    'Add onions and cook until golden.',
                    'Add ginger-garlic paste and cook for 1 minute.',
                    'Add tomatoes and spices, cook until oil separates.',
                    'Add chickpeas and water, simmer for 10 minutes.',
                    'Garnish with cilantro and serve with rice or bread.'
                ],
                prepTime: 10,
                cookTime: 25,
                difficulty: 'easy',
                image: "	https://cdn77-s3.lazycatkitchen.com/wp-content/uploads/2020/01/easy-chana-masala-pan-768x1152.jpg"
            },
            {
                id: 'vegetable-pulao',
                title: 'Vegetable Pulao',
                description: 'A simple and aromatic Indian rice dish loaded with vegetables and mild spices.',
                ingredients: [
                    '2 cups basmati rice',
                    '1 cup mixed vegetables (carrots, peas, beans)',
                    '1 onion, sliced',
                    '2 cloves garlic, minced',
                    '1 inch ginger, grated',
                    '2 bay leaves',
                    '4 cloves',
                    '1 tsp cumin seeds',
                    '2 tbsp ghee or oil',
                    'Salt to taste',
                    'Fresh cilantro'
                ],
                steps: [
                    'Wash and soak rice for 30 minutes.',
                    'Heat ghee, add cumin, cloves, and bay leaves.',
                    'Add onions, garlic, and ginger, sauté until golden.',
                    'Add vegetables and cook for 5 minutes.',
                    'Add rice, water, and salt.',
                    'Bring to boil, then simmer covered for 15 minutes.',
                    'Fluff with fork and garnish with cilantro.'
                ],
                prepTime: 15,
                cookTime: 25,
                difficulty: 'easy',
                image: "	https://www.indianveggiedelight.com/wp-content/uploads/2019/07/veg-pulao-featured.jpg"
            }
        ];
        recipes.push(...sampleRecipes);
        saveRecipes(recipes);
    }
}

