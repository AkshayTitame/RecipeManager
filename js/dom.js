function $(selector) {
  return document.querySelector(selector);
}

function showView(viewId) {
  document.querySelectorAll(".view").forEach((v) => v.classList.add("hidden"));
  $(viewId).classList.remove("hidden");
}

 const view = document.querySelector(viewId);
  if (view) {
    view.classList.remove("hidden");
  }


function clearElement(el) {
  while (el.firstChild) {
    el.removeChild(el.firstChild);
  }
}

function renderRecipesList(recipes) {
  const grid = $("#recipesGrid");
  const empty = $("#emptyState");
  clearElement(grid);

  if (!recipes.length) {
    empty.classList.remove("hidden");
    return;
  }
  empty.classList.add("hidden");

  recipes.forEach((recipe) => {
    const card = document.createElement("article");
    card.className = "recipe-card";
    card.dataset.id = recipe.id;

    if (recipe.imageUrl) {
      const img = document.createElement("img");
      img.src = recipe.imageUrl;
      img.alt = recipe.title;
      img.onerror = () => {
        img.style.display = "none";
      };
      card.appendChild(img);
    }

    const body = document.createElement("div");
    body.className = "recipe-card-body";

    const titleEl = document.createElement("h3");
    titleEl.className = "recipe-card-title";
    titleEl.textContent = recipe.title;
    body.appendChild(titleEl);

    const desc = document.createElement("p");
    desc.className = "recipe-card-desc";
    desc.textContent =
      recipe.description && recipe.description.length > 100
        ? recipe.description.slice(0, 100) + "..."
        : recipe.description;
    desc.style.fontSize = "0.85rem";
    desc.style.color = "var(--text-muted)";
    body.appendChild(desc);

    const meta = document.createElement("div");
    meta.className = "recipe-card-meta";

    const badge = document.createElement("span");
    const diff = (recipe.difficulty || "").toLowerCase();
    badge.className = `badge ${diff}`;
    badge.textContent = diff.charAt(0).toUpperCase() + diff.slice(1);

    const totalTime =
      (Number(recipe.prepTime) || 0) + (Number(recipe.cookTime) || 0);
    const timeEl = document.createElement("span");
    timeEl.textContent = totalTime ? `${totalTime} min` : "";

    meta.appendChild(badge);
    meta.appendChild(timeEl);

    body.appendChild(meta);
    card.appendChild(body);

    card.addEventListener("click", (e) => {
      e.stopPropagation(); 
      window.__onRecipeSelected(recipe.id);
    });

    grid.appendChild(card);
  });
}

function renderRecipeDetail(recipe) {
  const container = $("#detailContent");
  clearElement(container);

  if (!recipe) {
    container.textContent = "Recipe not found.";
    return;
  }

  const header = document.createElement("div");
  header.className = "detail-header";

  const cover = document.createElement("div");
  cover.className = "detail-cover";
  if (recipe.imageUrl) {
    const img = document.createElement("img");
    img.src = recipe.imageUrl;
    img.alt = recipe.title;
    img.onerror = () => {
      img.style.display = "none";
    };
    cover.appendChild(img);
  }

  const main = document.createElement("div");
  main.className = "detail-main";

  const h2 = document.createElement("h2");
  h2.textContent = recipe.title;
  main.appendChild(h2);

  const diffValue = (recipe.difficulty || "").toLowerCase();
  const diff = document.createElement("span");
  diff.className = `badge ${diffValue}`;
  diff.textContent = diffValue.charAt(0).toUpperCase() + diffValue.slice(1);
  main.appendChild(diff);

  const times = document.createElement("p");
  times.className = "detail-times";
  const prep = Number(recipe.prepTime) || 0;
  const cook = Number(recipe.cookTime) || 0;
  const total = prep + cook;
  times.textContent = `Prep: ${prep} min · Cook: ${cook} min · Total: ${total} min`;
  main.appendChild(times);

  const desc = document.createElement("p");
  desc.textContent = recipe.description;
  main.appendChild(desc);

  const actions = document.createElement("div");
  actions.className = "detail-actions";

  const editBtn = document.createElement("button");
  editBtn.className = "secondary";
  editBtn.textContent = "Edit";
  editBtn.addEventListener("click", () => {
    window.__onEditRecipe && window.__onEditRecipe(recipe.id);
  });

  const deleteBtn = document.createElement("button");
  deleteBtn.className = "secondary";
  deleteBtn.style.borderColor = "var(--danger)";
  deleteBtn.style.color = "var(--danger)";
  deleteBtn.textContent = "Delete";
  deleteBtn.addEventListener("click", () => {
    window.__onDeleteRecipe && window.__onDeleteRecipe(recipe.id);
  });

  actions.appendChild(editBtn);
  actions.appendChild(deleteBtn);
  main.appendChild(actions);

  header.appendChild(cover);
  header.appendChild(main);

  container.appendChild(header);

  const ingredientsSection = document.createElement("section");
  ingredientsSection.className = "detail-section";
  const ingredientsTitle = document.createElement("h3");
  ingredientsTitle.textContent = "Ingredients";
  ingredientsSection.appendChild(ingredientsTitle);

  const ingList = document.createElement("ul");
  recipe.ingredients.forEach((ing) => {
    const li = document.createElement("li");
    li.textContent = ing;
    ingList.appendChild(li);
  });
  ingredientsSection.appendChild(ingList);

  const stepsSection = document.createElement("section");
  stepsSection.className = "detail-section";
  const stepsTitle = document.createElement("h3");
  stepsTitle.textContent = "Steps";
  stepsSection.appendChild(stepsTitle);

  const stepsList = document.createElement("ol");
  recipe.steps.forEach((step) => {
    const li = document.createElement("li");
    li.textContent = step;
    stepsList.appendChild(li);
  });
  stepsSection.appendChild(stepsList);

  container.appendChild(ingredientsSection);
  container.appendChild(stepsSection);
}

function fillForm(recipe) {
  $("#recipeId").value = recipe?.id || "";
  $("#title").value = recipe?.title || "";
  $("#description").value = recipe?.description || "";
  $("#ingredients").value = recipe?.ingredients
    ? recipe.ingredients.join("\n")
    : "";
  $("#steps").value = recipe?.steps ? recipe.steps.join("\n") : "";
  $("#prepTime").value = recipe?.prepTime ?? "";
  $("#cookTime").value = recipe?.cookTime ?? "";
  $("#difficulty").value = recipe?.difficulty || "";
  $("#imageUrl").value = recipe?.imageUrl || "";
}

function getFormData() {
  return {
    id: $("#recipeId").value || null,
    title: $("#title").value.trim(),
    description: $("#description").value.trim(),
    ingredients: $("#ingredients")
      .value.split("\n")
      .map((x) => x.trim())
      .filter(Boolean),
    steps: $("#steps")
      .value.split("\n")
      .map((x) => x.trim())
      .filter(Boolean),
    prepTime: $("#prepTime").value ? Number($("#prepTime").value) : 0,
    cookTime: $("#cookTime").value ? Number($("#cookTime").value) : 0,

    difficulty: $("#difficulty").value.toLowerCase(),
    imageUrl: $("#imageUrl").value.trim(),
  };
}

function clearFormErrors() {
  document.querySelectorAll(".field-error").forEach((el) => {
    el.textContent = "";
  });
  const globalError = $("#globalError");
  globalError.classList.add("hidden");
  globalError.textContent = "";
}

function showFormErrors(errors, globalMessage) {
  clearFormErrors();
  Object.entries(errors).forEach(([field, message]) => {
    const el = document.querySelector(`.field-error[data-for="${field}"]`);
    if (el) el.textContent = message;
  });
  if (globalMessage) {
    const globalError = $("#globalError");
    globalError.textContent = globalMessage;
    globalError.classList.remove("hidden");
  }
}       

function setFormMode(mode) {
  $("#formTitle").textContent = mode === "edit" ? "Edit Recipe" : "Add Recipe";
}

function getFilters() {
  return {
    search: $("#searchInput").value.trim().toLowerCase(),

    difficulty: $("#difficultyFilter").value.toLowerCase(),
    maxTime: $("#maxTimeFilter").value
      ? Number($("#maxTimeFilter").value)
      : null,
  };
}
