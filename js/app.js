

let currentRecipes = [];
let filteredRecipes = [];

document.addEventListener('DOMContentLoaded', function() {
    initializeSampleData();
    loadRecipes();
    setupEventListeners();
    showView('home-view');
    loadTheme();
});

function loadRecipes() {
    currentRecipes = getRecipes();
    filteredRecipes = [...currentRecipes];
    renderRecipeGrid(filteredRecipes);
}

function setupEventListeners() {
    
    document.getElementById('home-btn').addEventListener('click', () => showView('home-view'));
    document.getElementById('add-recipe-btn').addEventListener('click', () => showRecipeForm());
    document.getElementById('theme-toggle').addEventListener('click', toggleTheme);

    
    document.getElementById('search-title').addEventListener('input', applyFilters);
    document.getElementById('filter-difficulty').addEventListener('change', applyFilters);
    document.getElementById('filter-prep-time').addEventListener('input', applyFilters);

    
    document.getElementById('edit-recipe-btn').addEventListener('click', editCurrentRecipe);
    document.getElementById('delete-recipe-btn').addEventListener('click', deleteCurrentRecipe);
    document.getElementById('cancel-detail-btn').addEventListener('click', () => showView('home-view'));

    
    document.getElementById('recipe-form').addEventListener('submit', handleFormSubmit);
    document.getElementById('cancel-form-btn').addEventListener('click', () => showView('home-view'));
}

function applyFilters() {
    const searchTerm = document.getElementById('search-title').value.toLowerCase();
    const difficultyFilter = document.getElementById('filter-difficulty').value;
    const maxPrepTime = parseInt(document.getElementById('filter-prep-time').value) || Infinity;

    filteredRecipes = currentRecipes.filter(recipe => {
        const matchesSearch = recipe.title.toLowerCase().includes(searchTerm);
        const matchesDifficulty = !difficultyFilter || recipe.difficulty === difficultyFilter;
        const matchesPrepTime = recipe.prepTime <= maxPrepTime;
        return matchesSearch && matchesDifficulty && matchesPrepTime;
    });

    renderRecipeGrid(filteredRecipes);
}

function editCurrentRecipe() {
    const recipeId = document.getElementById('recipe-detail').dataset.recipeId;
    const recipe = getRecipeById(recipeId);
    if (recipe) {
        showRecipeForm(recipe);
    }
}

function deleteCurrentRecipe() {
    const recipeId = document.getElementById('recipe-detail').dataset.recipeId;
    if (confirm('Are you sure you want to delete this recipe?')) {
        deleteRecipe(recipeId);
        loadRecipes();
        showView('home-view');
    }
}

function handleFormSubmit(event) {
    event.preventDefault();
    const formData = getFormData();

    if (!validateForm(formData)) {
        return;
    }

    const isEdit = !!event.target.dataset.editId;
    let result;

    if (isEdit) {
        result = updateRecipe(event.target.dataset.editId, formData);
    } else {
        result = addRecipe(formData);
    }

    if (result) {
        loadRecipes();
        showView('home-view');
    }
}


function toggleTheme() {
    const body = document.body;
    const isDark = body.hasAttribute('data-theme');
    if (isDark) {
        body.removeAttribute('data-theme');
        localStorage.setItem('theme', 'light');
    } else {
        body.setAttribute('data-theme', 'dark');
        localStorage.setItem('theme', 'dark');
    }
}

function loadTheme() {
    const theme = localStorage.getItem('theme');
    if (theme === 'dark') {
        document.body.setAttribute('data-theme', 'dark');
    }
}


const originalShowRecipeDetail = showRecipeDetail;
showRecipeDetail = function(recipeId) {
    originalShowRecipeDetail(recipeId);
    document.getElementById('recipe-detail').dataset.recipeId = recipeId;
};
