# Recipe Manager Web App

A simple, responsive Recipe Manager built using HTML, CSS, and JavaScript, with Local Storage for data persistence.
The application allows users to add, view, edit, and delete recipes, along with search and filtering features.

# How to Run the App

step 1: Download or clone the project folder.
step 2: Open the root folder.
step 3: Simply open index.html in any web browser (Chrome, Firefox, Edge, etc.).
step 4: No server setup required — the project runs entirely in the browser.

# Local Storage Data Structure

- Recipes are stored under the key: recipes
- Each recipe follows this JSON structure:

{
"id": "unique-id",
"title": "Paneer Masala",
"description": "A simple home-style paneer masala.",
"ingredients": [
"250g paneer",
"2 onions",
"3 tomatoes"
],
"steps": [
"Heat oil",
"Add onions and sauté",
"Add tomatoes and cook"
],
"prepTime": 10,
"cookTime": 20,
"difficulty": "Medium",
"image": "https://example.com/image.jpg"
}

- On First Load
  The app automatically inserts the candidate’s own recipe.
  Optional sample recipes may also be added.

# Assumptions & Decisions

-Local Storage is used as the only persistence layer.
-Every recipe must have:

-title
-at least one ingredient
-at least one step
-valid difficulty level

-Image URL is optional; placeholder.jpg is used otherwise.
-Unique recipe IDs are generated in JavaScript using timestamp or random string.
-The UI uses vanilla JS only — no frameworks.

# Known Issues / Limitations

-Local Storage size is limited, so too many recipes with images may cause storage overflow.
-Image URL validity is not deeply validated (only basic checks).
-The app works only in a browser; no offline installation (PWA) support.
-Editing a recipe replaces all fields; partial editing is not supported.
-No drag-and-drop reordering of ingredients or steps.
