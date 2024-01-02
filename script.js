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
  dynamicDrinkElement = document.querySelector(".drinks");

const categoriesArray = [],
  drinksArray = [];

async function fillSelectElemets() {
  await fetch("https://www.thecocktaildb.com/api/json/v1/1/list.php?c=list")
    .then((response) => response.json())
    .then((response) => {
      fillSelectOptions(response.drinks, categorySelectName, "strCategory");
      // 'Map' metodas grazina is objekto masyvu objektu laukus strCategory
      categoriesArray.push(
        ...response.drinks.map((value) => value.strCategory)
      );
    })
    .catch((error) => console.log(error));

  // fill glass options
  await fetch("https://www.thecocktaildb.com/api/json/v1/1/list.php?g=list")
    .then((response) => response.json())
    .then((response) =>
      fillSelectOptions(response.drinks, glassSelectName, "strGlass")
    );

  // fill ingredients options
  await fetch("https://www.thecocktaildb.com/api/json/v1/1/list.php?i=list")
    .then((response) => response.json())
    .then((response) =>
      fillSelectOptions(response.drinks, ingredientSelectName, "strIngredient1")
    );
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
  for (const category of categoriesArray) {
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
  selectElement.innerHTML = dynamicHTML;
}

async function initialization() {
  // 1. selectu uzpildymas
  await fillSelectElemets();
  console.log(categoriesArray);
  await getAllDrinks();
  generateDrinksHTML(drinksArray);
  console.log(drinksArray);
  // 2. dinaminis gerimu atvaizdavimas
}

initialization();
