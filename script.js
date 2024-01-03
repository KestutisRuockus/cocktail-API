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
  console.log(allValues);

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
  //   );

  // await fetch("https://www.thecocktaildb.com/api/json/v1/1/list.php?c=list")
  //   .then((response) => response.json())
  //   .then((response) => {
  //     fillSelectOptions(response.drinks, categorySelectName, "strCategory");
  //     // 'Map' metodas grazina is objekto masyvu objektu laukus strCategory
  //     categoriesArray.push(
  //       ...response.drinks.map((value) => value.strCategory)
  //     );
  //   })
  //   .catch((error) => console.log(error));

  // // fill glass options
  // await fetch("https://www.thecocktaildb.com/api/json/v1/1/list.php?g=list")
  //   .then((response) => response.json())
  //   .then((response) =>
  //     fillSelectOptions(response.drinks, glassSelectName, "strGlass")
  //   );

  // // fill ingredients options
  // await fetch("https://www.thecocktaildb.com/api/json/v1/1/list.php?i=list")
  //   .then((response) => response.json())
  //   .then((response) =>
  //     fillSelectOptions(response.drinks, ingredientSelectName, "strIngredient1")
  //   );
}

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
  for (const category of selectValues.categories) {
    let dynamicUrl = `https://www.thecocktaildb.com/api/json/v1/1/filter.php?c=${category.replaceAll(
      " ",
      "_"
    )}`;
    const response = await fetch(dynamicUrl);
    const answerFromServer = await response.json();
    for (const drink of answerFromServer.drinks) {
      drinksArray.push(drink);
    }
  }
}

// fill select element with options from API
function fillSelectOptions(properties, selectElement, strFieldName) {
  let dynamicHTML = ``;
  for (const property of properties) {
    dynamicHTML += `<option>${property[strFieldName]}</option>`;
  }
  selectElement.innerHTML += dynamicHTML;
}

async function initialization() {
  // 1. selectu uzpildymas
  await fillSelectElemets();
  await getAllDrinks();
  generateDrinksHTML(drinksArray);
  btnSearch.addEventListener("click", filter);
  console.log(drinksArray);
  // 2. dinaminis gerimu atvaizdavimas
}

initialization();
