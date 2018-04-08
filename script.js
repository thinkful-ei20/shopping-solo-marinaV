/* jshint esversion: 6 */
'use strict';

// `STORE` is responsible for storing the underlying data
// that our app needs to keep track of in order to work.
//
// for a shopping list, our data model is pretty simple.
// we just have an array of shopping list items. each one
// is an object with a `name` and a `checked` property that
// indicates if it's checked off or not.
// we're pre-adding items to the shopping list so there's
// something to see when the page first loads.
const STORE = {
  items: [
    {name: "apples", checked: false},
    {name: "oranges", checked: false},
    {name: "milk", checked: true},
    {name: "bread", checked: false}
  ],
  filterBy: 'all',
};


function generateItemElement(item, itemIndex, template) {
	return `
		<li class="js-item-index-element" data-item-index="${itemIndex}">
			<span class="shopping-item js-shopping-item ${item.checked ? "shopping-item__checked" : ''}">${item.name}</span>
			<div class="shopping-item-controls">
				<button class="shopping-item-toggle js-item-toggle">
					<span class="button-label">check</span>
				</button>
				<button class="shopping-item-edit js-item-edit">
					<span class="button-label">edit</span>
				</button>
				<button class="shopping-item-delete js-item-delete">
					<span class="button-label">delete</span>
				</button>
			</div>
		</li>`;
}

function generateShoppingItemsString(shoppingList) {
	console.log('generateShoppingItemsString run');
	const items = shoppingList.map((item, index) => generateItemElement(item, index));
	return items.join('');
}

function renderShoppingList() {
  // this function will be responsible for rendering the shopping list in
  // the DOM
  console.log('`renderShoppingList` ran');
  let storeItems = [...STORE.items];
  switch(STORE.filterBy) {
    case 'checked':
      storeItems = storeItems.filter(el => el.checked);
      break;
    case 'unchecked':
      storeItems = storeItems.filter(el => !el.checked);
      break;
  }


  // console.log(myArr.splice(0, myArr.length, ...myArr.filter(el => el.checked)));
  // console.log(myArr);

  const shoppingListItemsString = generateShoppingItemsString(storeItems);
	$('.js-shopping-list').html(shoppingListItemsString);

}

function handleNewItemSubmit() {
  // this function will be responsible for when users add a new shopping list item
  console.log('`handleNewItemSubmit` ran');
  $('#js-shopping-list-form').submit(event => {
  	event.preventDefault();
		const $listEntry = $('.js-shopping-list-entry');
		const newItemName = $listEntry.val();
		$listEntry.val('');
		addItemToShoppingList(newItemName);
		renderShoppingList();
	});
}

function addItemToShoppingList(itemName) {
	STORE.items.push({ name: itemName,	checked: false });
}

function setFilterBy(filterBy) {
  STORE.filterBy = filterBy;
}

function handleFilterListChange() {
  console.log('filterShoppingList run');
  $('#filter-dropdown').change(event => {
    console.log($(event.target).find('option:selected').val());
    // console.log($('select option:selected').val());
    const filteredOption = $('select option:selected').val();
    setFilterBy(filteredOption);
    renderShoppingList();
  });
}


// Set element property 'contentEditable' to true and bring focus
function openEditItemMode(targetEl) {
  console.log('openEditItemMode run');
  targetEl.attr('contentEditable', true).focus();
}

// Stop editing mode
function stopEditItemMode(targetEl) {
  console.log('stopEditItemMode run');
  targetEl.attr('contentEditable', false);
}

function updateItem(e) {
  console.log('updateItem run');
  const updatedItemValue = $(e.target).text();
  const itemIndex = getItemIndexFromElement($(e.target));
  if (STORE.items[itemIndex].name !== updatedItemValue) {
    console.log('hi from change value');
    STORE.items[itemIndex].name = updatedItemValue;
  }
}

// Handle 'edit' mode for shopping list item
function handleEditListClick() {
  // Listen for users to click the "edit" button on a shopping list item
  // Start editing mode in the text field
  $('.js-shopping-list').on('click', '.js-item-edit', function(event) {
    const elementToEdit = $(event.target).closest('.js-item-index-element').find('.js-shopping-item');
    openEditItemMode(elementToEdit);
  });
  // Listen for users to change focus when editing a shopping list item
  $('.js-shopping-list').on('focusout', '.js-shopping-item', function(event) {
    updateItem(event);
  });

  // Listen for users to press return (enter) button when editing a shopping list item
  // Stop editing mode in the text field
  $('.js-shopping-list').on('keydown', '.js-shopping-item', function(event) {
    if (event.which === 13) {
      // prevent default 'submit' behavior that triggers 'Add' submit button
      event.preventDefault();
      stopEditItemMode($(event.target));
    }
  });
}

function toggleCheckedForListItem(itemIndex) {
	console.log('toggleCheckedForListItem run');
	STORE.items[itemIndex].checked = !STORE.items[itemIndex].checked;
}

function getItemIndexFromElement(item) {
	console.log('getItemIndexFromElement run');
	const itemIndexString = item.closest('.js-item-index-element').attr('data-item-index');
	return parseInt(itemIndexString, 10);
}

function handleItemCheckClicked() {
  console.log('`handleItemCheckClicked` ran');
  $('.js-shopping-list').on('click', '.js-item-toggle', event => {
		const itemIndex = getItemIndexFromElement($(event.target));
		toggleCheckedForListItem(itemIndex);
		renderShoppingList();
	});
}

function deleteItemFromList(itemIndex) {
  console.log(`Deleting item at index  ${itemIndex} from shopping list`);
	STORE.items.splice(itemIndex, 1);
}

// Handle shopping list item removal
function handleDeleteItemClicked() {
  console.log('`handleDeleteItemClicked` ran');
	$('.js-shopping-list').on('click', '.js-item-delete', event => {
		console.log(event.target);
		const itemIndex = getItemIndexFromElement($(event.target));
		deleteItemFromList(itemIndex);
		renderShoppingList();
	});
}

// this function will be our callback when the page loads. it's responsible for
// initially rendering the shopping list, and activating our individual functions
// that handle new item submission and user clicks on the "check" and "delete" buttons
// for individual shopping list items.
function handleShoppingList() {
  renderShoppingList();
  handleNewItemSubmit();
  handleItemCheckClicked();
  handleDeleteItemClicked();
  handleFilterListChange();
  handleEditListClick();
}

// when the page loads, call `handleShoppingList`
$(handleShoppingList);
