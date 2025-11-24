

const PLACEHOLDER_IMAGE = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjY2NjIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtc2l6ZT0iMjAiIGZpbGw9IiMwMDAiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5ObyBJbWFnZTwvdGV4dD48L3N2Zz4=';

function showView(viewId) {
    document.querySelectorAll('section').forEach(section => section.classList.add('hidden'));
    document.getElementById(viewId).classList.remove('hidden');
}

function renderRecipeGrid(recipes) {
    const grid = document.getElementById('recipe-grid');
    grid.innerHTML = '';
    recipes.forEach(recipe => {
        const card = document.createElement('div');
        card.className = 'recipe-card';
        card.onclick = () => showRecipeDetail(recipe.id);
        card.innerHTML = `
            <img src="${recipe.image || PLACEHOLDER_IMAGE}" alt="${recipe.title}">
            <div class="recipe-card-content">
                <h3>${recipe.title}</h3>
                <p>${recipe.description}</p>
                <div class="recipe-card-meta">
                    <span>Prep: ${recipe.prepTime}min</span>
                    <span>Cook: ${recipe.cookTime}min</span>
                    <span class="difficulty-badge difficulty-${recipe.difficulty}">${recipe.difficulty}</span>
                </div>
                <div class="card-actions">
                    <button class="btn btn-secondary btn-sm" onclick="event.stopPropagation(); showRecipeForm(${JSON.stringify(recipe).replace(/"/g, '"')})">Edit</button>
                    <button class="btn btn-danger btn-sm" onclick="event.stopPropagation(); deleteRecipeFromCard('${recipe.id}')">Delete</button>
                </div>
            </div>
        `;
        grid.appendChild(card);
    });
}

function showRecipeDetail(recipeId) {
    const recipe = getRecipeById(recipeId);
    if (!recipe) return;

    const detail = document.getElementById('recipe-detail');
    detail.innerHTML = `
        <img src="${recipe.image || PLACEHOLDER_IMAGE}" alt="${recipe.title}">
        <h2>${recipe.title}</h2>
        <p><strong>Description:</strong> ${recipe.description}</p>
        <div class="recipe-meta">
            <span>Prep Time: ${recipe.prepTime} minutes</span>
            <span>Cook Time: ${recipe.cookTime} minutes</span>
            <span>Difficulty: ${recipe.difficulty}</span>
        </div>
        <h3>Ingredients</h3>
        <ul>${recipe.ingredients.map(ing => `<li>${ing}</li>`).join('')}</ul>
        <h3>Steps</h3>
        <ol>${recipe.steps.map(step => `<li>${step}</li>`).join('')}</ol>
    `;
    showView('recipe-detail-view');
}

function showRecipeForm(recipe = null) {
    const form = document.getElementById('recipe-form');
    const title = document.getElementById('form-title');
    const isEdit = !!recipe;

    title.textContent = isEdit ? 'Edit Recipe' : 'Add Recipe';
    form.reset();
    clearFormErrors();

    if (isEdit) {
        document.getElementById('recipe-title').value = recipe.title;
        document.getElementById('recipe-description').value = recipe.description;
        document.getElementById('recipe-ingredients').value = recipe.ingredients.join('\n');
        document.getElementById('recipe-steps').value = recipe.steps.join('\n');
        document.getElementById('recipe-prep-time').value = recipe.prepTime;
        document.getElementById('recipe-cook-time').value = recipe.cookTime;
        document.getElementById('recipe-difficulty').value = recipe.difficulty;
        document.getElementById('recipe-image').value = recipe.image || '';
        form.dataset.editId = recipe.id;
    } else {
        delete form.dataset.editId;
    }

    showView('recipe-form-view');
}

function clearFormErrors() {
    document.querySelectorAll('.error').forEach(el => el.textContent = '');
}

function showFormError(fieldId, message) {
    document.getElementById(fieldId).textContent = message;
}

function getFormData() {
    return {
        title: document.getElementById('recipe-title').value.trim(),
        description: document.getElementById('recipe-description').value.trim(),
        ingredients: document.getElementById('recipe-ingredients').value.trim().split('\n').filter(line => line.trim()),
        steps: document.getElementById('recipe-steps').value.trim().split('\n').filter(line => line.trim()),
        prepTime: parseInt(document.getElementById('recipe-prep-time').value),
        cookTime: parseInt(document.getElementById('recipe-cook-time').value),
        difficulty: document.getElementById('recipe-difficulty').value,
        image: document.getElementById('recipe-image').value.trim() || null
    };
}

function validateForm(data) {
    let isValid = true;
    clearFormErrors();

    if (!data.title) {
        showFormError('title-error', 'Title is required');
        isValid = false;
    }
    if (!data.description) {
        showFormError('description-error', 'Description is required');
        isValid = false;
    }
    if (data.ingredients.length === 0) {
        showFormError('ingredients-error', 'At least one ingredient is required');
        isValid = false;
    }
    if (data.steps.length === 0) {
        showFormError('steps-error', 'At least one step is required');
        isValid = false;
    }
    if (isNaN(data.prepTime) || data.prepTime < 0) {
        showFormError('prep-time-error', 'Valid prep time is required');
        isValid = false;
    }
    if (isNaN(data.cookTime) || data.cookTime < 0) {
        showFormError('cook-time-error', 'Valid cook time is required');
        isValid = false;
    }
    if (!data.difficulty) {
        showFormError('difficulty-error', 'Difficulty is required');
        isValid = false;
    }

    return isValid;
}

function deleteRecipeFromCard(recipeId) {
    if (confirm('Are you sure you want to delete this recipe?')) {
        deleteRecipe(recipeId);
        loadRecipes();
    }
}
