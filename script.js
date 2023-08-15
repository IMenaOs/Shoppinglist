const itemForm = document.getElementById('item-form');
const itemInput = document.getElementById('item-input');
const itemList = document.getElementById('item-list');
const clearBtn = document.getElementById('clear');
const itemFilter = document.getElementById('filter');
const formBtn = itemForm.querySelector('button');
let isEditMode = false;


function dispalyItems() {
    const itemsFromStorage = getItemsFromStorage;

    itemsFromStorage.forEach(item => addItemtoDOM(item));
    checkUI();
}

function onAddItemSubmit(e) {
    e.preventDefault();

    const newItem = itemInput.value;

    // Validate input
    if (newItem === '') {
        alert('Please add an item');
        return;
    }

    //Check for edit mode
    if (isEditMode) {
        const itemToEdit = itemList.querySelector('.edit-mode');

        removeItemFromStorage(itemToEdit.textContent);
        itemToEdit.classList.remove('edit-mode');
        itemToEdit.remove();
        isEditMode = false;
    } else {
        if (checkIfItemExists(newItem)) {
            alert('That item already exists!');
            return;
        }
    };

    // Create item DOM element
    addItemtoDOM(newItem);

    // Add item to local storage
    addItemToStorage(newItem);

    checkUI();

    itemInput.value = '';
};

function addItemtoDOM(item) {
    // create list item
    const li = document.createElement('li');
    li.appendChild(document.createTextNode(item));

    const button = createButton('remove-item btn-link text-red');
    li.appendChild(button);

    // Add li to the DOM
    itemList.appendChild(li);
    
    itemInput.value = '';
};

function createButton(classes) {
    const button = document.createElement('button');
    button.className = classes;
    const icon = createIcon('fa-solid fa-xmark')
    button.appendChild(icon);
    return button;
};

function createIcon(classes) {
    const icon = document.createElement('i');
    icon.className = classes;
    return icon;
};

function addItemToStorage(item) {
    const itemsFromStorage = getItemsFromStorage();

    // Add new item to array
    itemsFromStorage.push(item);

    // Convert to JSON string and set to local storage

    localStorage.setItem('items', JSON.stringify(itemsFromStorage));
};

function getItemsFromStorage() {
    let itemsFromStorage;

    if (localStorage.getItem('items') === null){
        itemsFromStorage = [];
    } else {
        itemsFromStorage = JSON.parse(localStorage.getItem('items')); // JSON.parse to turn it into an array, otherwise it just gives us a string
    } 

    return itemsFromStorage;
}

// we want to remove the li element when clicking the red "x" icoon in the html, so we target the parentElement or parentNode
/* if we click on the red x in the html while using e.target.remove() it'll remove the x icon, not the li
so we need to go to its parent element using parentElement or parentNode then use the classList property
to then target its class name using the contains() method, then we use the .remove()
*/

function onClickItem(e) {
    if (e.target.parentElement.classList.contains('remove-item')) {
        removeItem(e.target.parentElement.parentElement);
    } else {
        setItemToEdit(e.target);
    }
};

function checkIfItemExists(item) {
    const itemsFromStorage = getItemsFromStorage();
    return itemsFromStorage.includes(item);
};

function setItemToEdit(item) {
    isEditMode = true;

    itemList.querySelectorAll('li').forEach((i) => i.classList.remove('edit-mode'));

    item.classList.add('edit-mode');
    formBtn.innerHTML = '<i class="fa-solid fa-pen"></i>    Update Item';
    formBtn.style.backgroundColor = '#228B22';
    itemInput.value = item.textContent;
};

function removeItem(item) {
    if (confirm('Are you sure?')) {
        // Remove item from DOM
        item.remove();

        // Remove item from storage
        removeItemFromStorage(item.textContent);

        checkUI();
    }
};

function removeItemFromStorage(item) {
    let itemsFromStorage = getItemsFromStorage();

    // Filter out item to be removed
    itemsFromStorage = itemsFromStorage.filter((i) => i !== item);

    // Re-set to localsotrage
    localStorage.setItem('items', JSON.stringify(itemsFromStorage));
}

function clearItems() {
    // itemList.innerHTML = ''; one way to do it
    while (itemList.firstChild) {
        itemList.removeChild(itemList.firstChild);
    }

    // Clear from localstorage
    localStorage.removeItem('items');

    checkUI();
};

function filterItems(e) {
    const items = itemList.querySelectorAll('li');
    const text = e.target.value.toLowerCase();

    items.forEach((item) => {
        const itemName = item.firstChild.textContent.toLowerCase();

        if (itemName.indexOf(text) != -1) {
           item.style.display = 'flex'; 
        } else {
            item.style.display = 'none';
        }
    });

};

function checkUI() {
    itemInput.value = '';

    const items = itemList.querySelectorAll('li');

    if (items.length === 0) {
        clearBtn.style.display = 'none';
        itemFilter.style.display = 'none';
    } else {
        clearBtn.style.display = 'block';
        itemFilter.style.display = 'block';
    }

    formBtn.innerHTML = '<i class="fa-solid fa-plus"></i> Add Item';
    formBtn.style.backgroundColor = '#333';

    isEditMode = false;
};

// Initialize app
function init() {
    // Event listeners
    itemForm.addEventListener('submit', onAddItemSubmit);
    itemList.addEventListener('click', onClickItem);
    clearBtn.addEventListener('click', clearItems);
    itemFilter.addEventListener('input', filterItems);
    document.addEventListener('DOMContentLoaded', dispalyItems);

    checkUI();
};

init();

// localStorage Methods. Local storage stores info in browser, sessionStorage saves it until the page is closed. They use same methods
// and same API
// localStorage.setItem('name', 'Brad');  // set a value with a key
// localStorage.getItem('name');  // get a using the key
// localStorage.remove('name');  // remove item using key
// localStorage.clear();  // clear all values