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
  btnSearch = document.querySelector("#search");

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
    dynamicHTML += `<div class="drink">
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

initialization();
