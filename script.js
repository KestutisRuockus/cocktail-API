// 1. Selectu uzpildymas duomenimis
// 2. Gauti visus gerimus is API
// 3. Gerimu atvaizdavimas
// 4. Atlikti filtracijas kokteiliams
// 5. Paieska pagal pavadinima
// 6. Modalinio lango sukurias
// 7. Modalinio lango uzdarymas
// 8. Atsitiktino kokteilio gavimas su mygtuko 'man sekasi'

const cocktailNameFilterElement = document.querySelector(
    "#cocktail-name-filter"
  ),
  categorySelectName = document.querySelector("#category-select"),
  glassSelectName = document.querySelector("#glass-type-select"),
  ingredientSelectName = document.querySelector("#ingredient-select"),
  dynamicDrinkElement = document.querySelector(".drinks"),
  btnSearch = document.querySelector("#search"),
  modal = document.querySelector(".modal-bg"),
  modalCloseBtn = document.querySelector(".modal-close-btn"),
  imLuckyBtn = document.querySelector("#im-lucky");

const selectValues = {};
const drinksArray = [];

// get properties to drop list (select elements)
async function fillSelectElemets() {
  const allUrls = [
    "https://www.thecocktaildb.com/api/json/v1/1/list.php?c=list",
    "https://www.thecocktaildb.com/api/json/v1/1/list.php?g=list",
    "https://www.thecocktaildb.com/api/json/v1/1/list.php?i=list",
  ];

  const allPromises = allUrls.map((url) =>
    fetch(url).then((response) => response.json())
  );
  const allValues = await Promise.all(allPromises);

  const [allCategories, allGlasses, allIngredients] = allValues;
  selectValues.categories = allCategories.drinks.map(
    (category) => category.strCategory
  );
  selectValues.glasses = allGlasses.drinks.map((glass) => glass.strGlass);
  selectValues.ingredients = allIngredients.drinks.map(
    (ingredient) => ingredient.strIngredient1
  );

  fillSelectOptions(allCategories.drinks, categorySelectName, "strCategory");
  fillSelectOptions(allGlasses.drinks, glassSelectName, "strGlass");
  fillSelectOptions(
    allIngredients.drinks,
    ingredientSelectName,
    "strIngredient1"
  );
}

// 3.
// display drinks tabs
function generateDrinksHTML(drinks) {
  let dynamicHTML = ``;
  for (const drink of drinks) {
    dynamicHTML += `<div onclick='openModal(${drink.idDrink})' class="drink">
    <img
      src="${drink.strDrinkThumb}"
    />
    <h2 class="drink-title">${drink.strDrink}</h2>
  </div>`;
  }
  dynamicDrinkElement.innerHTML = dynamicHTML;
}

// get all drinks from API
async function getAllDrinks() {
  const categoryDrinksUrls = [];
  for (const category of selectValues.categories) {
    let dynamicUrl = `https://www.thecocktaildb.com/api/json/v1/1/filter.php?c=${category.replaceAll(
      " ",
      "_"
    )}`;
    categoryDrinksUrls.push(dynamicUrl);
  }
  const allPromises = categoryDrinksUrls.map((url) =>
    fetch(url).then((response) => response.json())
  );
  const allValues = await Promise.all(allPromises);
  allValues.forEach((value) => drinksArray.push(...value.drinks));
}

// fill select element with options from API
function fillSelectOptions(properties, selectElement, strFieldName) {
  let dynamicHTML = ``;
  for (const property of properties) {
    dynamicHTML += `<option>${property[strFieldName]}</option>`;
  }
  selectElement.innerHTML += dynamicHTML;
}

async function filter() {
  const searchValue = cocktailNameFilterElement.value,
    category = categorySelectName.value,
    glass = glassSelectName.value,
    ingredient = ingredientSelectName.value;
  let filteredArray = [...drinksArray];

  // paieska pagal pavadinima
  if (searchValue) {
    filteredArray = filteredArray.filter((obj) =>
      obj.strDrink.toLowerCase().includes(searchValue.toLowerCase())
    );
    generateDrinksHTML(filteredArray);
  }

  // paieska pagal kategorija
  if (category !== "Pasirinkite kategoriją") {
    const response = await fetch(
      `https://www.thecocktaildb.com/api/json/v1/1/filter.php?c=${category.replaceAll(
        " ",
        "_"
      )}`
    );
    const drinksOfCategory = await response.json();
    filteredArray = filteredArray.filter((drink) =>
      drinksOfCategory.drinks.some(
        (drinkOfCategory) => drink.idDrink === drinkOfCategory.idDrink
      )
    );
  }

  // paieska pagal stikline
  if (glass !== "Pasirinkite stiklinės tipą") {
    const response = await fetch(
      `https://www.thecocktaildb.com/api/json/v1/1/filter.php?g=${glass.replaceAll(
        " ",
        "_"
      )}`
    );
    const drinksOfGlass = await response.json();
    filteredArray = filteredArray.filter((drink) =>
      drinksOfGlass.drinks.some(
        (drinkOfGlass) => drink.idDrink === drinkOfGlass.idDrink
      )
    );
  }

  // paieska pagal ingredienta
  if (ingredient !== "Pasirinkite ingredientą") {
    const response = await fetch(
      `https://www.thecocktaildb.com/api/json/v1/1/filter.php?i=${ingredient.replaceAll(
        " ",
        "_"
      )}`
    );
    const drinksOfIngredients = await response.json();
    filteredArray = filteredArray.filter((drink) =>
      drinksOfIngredients.drinks.some(
        (drinkOfIngredient) => drink.idDrink === drinkOfIngredient.idDrink
      )
    );
  }
  generateDrinksHTML(filteredArray);
}

// 1. 2.
async function initialization() {
  await fillSelectElemets();
  await getAllDrinks();
  generateDrinksHTML(drinksArray);
  btnSearch.addEventListener("click", filter);
}

// open modal with recipe information when clicked on drink element
async function openModal(id) {
  const response = await fetch(
    `https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i=${id}`
  );
  const obj = await response.json();
  const drink = obj.drinks[0];
  console.log(drink);
  generateRecipeInModal(drink);
  modal.style.display = "flex";
}

// close modal when close btn clicked
function closeModal() {
  modal.style.display = "none";
}

// display selected drink in modal
function generateRecipeInModal(drink) {
  let ingredients = [];
  let ingredientsMeasure = [];
  let ingredientsHTML = ``;
  document.querySelector("#modal-title").innerText = drink.strDrink;
  document.querySelector("#modal-category").innerText = drink.strCategory;
  document.querySelector("#modal-alcohol").innerText = drink.strAlcoholic;
  document.querySelector("#modal-glass").innerText = drink.strGlass;
  document.querySelector("#modal-recipe").innerText = drink.strInstructions;
  document.querySelector("#modal-img").src = drink.strDrinkThumb;

  ingredients.push(drink.strIngredient1);
  ingredientsMeasure.push(drink.strMeasure1);
  ingredients.push(drink.strIngredient2);
  ingredientsMeasure.push(drink.strMeasure2);
  ingredients.push(drink.strIngredient3);
  ingredientsMeasure.push(drink.strMeasure3);
  ingredients.push(drink.strIngredient4);
  ingredientsMeasure.push(drink.strMeasure4);
  ingredients.push(drink.strIngredient5);
  ingredientsMeasure.push(drink.strMeasure5);
  ingredients.push(drink.strIngredient6);
  ingredientsMeasure.push(drink.strMeasure6);
  ingredients.push(drink.strIngredient7);
  ingredientsMeasure.push(drink.strMeasure7);
  ingredients.push(drink.strIngredient8);
  ingredientsMeasure.push(drink.strMeasure8);
  ingredients.push(drink.strIngredient9);
  ingredientsMeasure.push(drink.strMeasure9);
  ingredients.push(drink.strIngredient10);
  ingredientsMeasure.push(drink.strMeasure10);
  ingredients.push(drink.strIngredient11);
  ingredientsMeasure.push(drink.strMeasure11);
  ingredients.push(drink.strIngredient12);
  ingredientsMeasure.push(drink.strMeasure12);
  ingredients.push(drink.strIngredient13);
  ingredientsMeasure.push(drink.strMeasure13);
  ingredients.push(drink.strIngredient14);
  ingredientsMeasure.push(drink.strMeasure14);
  ingredients.push(drink.strIngredient15);
  ingredientsMeasure.push(drink.strMeasure15);

  // for (const ingredient of ingredients) {
  ingredients.forEach((ingredient, index) => {
    let measure = ``;
    if (ingredient !== null) {
      measure = ingredientsMeasure[index];
      if (measure !== null)
        ingredientsHTML += `<p class="ingredient"><b>${ingredient}:</b>${measure}<span></span></p>`;
      else
        ingredientsHTML += `<p class="ingredient"><b>${ingredient}:</b><span></span></p>`;
    }
  });
  document.querySelector("#modal-ingredients").innerHTML = ingredientsHTML;
}

// get random drink from API and display it in opened modal
// https://www.thecocktaildb.com/api/json/v1/1/random.php
async function imLucky() {
  const response = await fetch(
    `https://www.thecocktaildb.com/api/json/v1/1/random.php`
  );
  const obj = await response.json();
  const drink = obj.drinks[0];
  generateRecipeInModal(drink);
  modal.style.display = "flex";
}

imLuckyBtn.addEventListener("click", imLucky);
modalCloseBtn.addEventListener("click", closeModal);
initialization();
