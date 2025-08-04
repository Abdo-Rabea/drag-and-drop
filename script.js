const addBtns = document.querySelectorAll(".add-btn:not(.solid)");
const saveItemBtns = document.querySelectorAll(".solid");
const addItemContainers = document.querySelectorAll(".add-container");
const addItems = document.querySelectorAll(".add-item");
// Item Lists
const itemLists = document.querySelectorAll(".drag-item-list");
const backlogList = document.getElementById("backlog-list");
const progressList = document.getElementById("progress-list");
const completeList = document.getElementById("complete-list");
const onHoldList = document.getElementById("on-hold-list");

// Items
let transferElement = null;
let sourceList = null;

// Initialize Arrays
let backlogListArray = [];
let progressListArray = [];
let completeListArray = [];
let onHoldListArray = [];
let listArrays = [];
// Drag Functionality

// helper functions

/**
 * inplace removing of item from array
 * @param {Array} arr
 */
function removeItemFromArray(arr, itemText) {
  const index = arr.indexOf(itemText);
  if (index !== -1) arr.splice(index, 1);
}

/**
 * moves item from source array to destination array
 * @param {Array} list1
 * @param {Array} list2
 * @param {String} itemText
 */
function moveItemFromToList(s, d, itemText) {
  removeItemFromArray(s, itemText);
  d.push(itemText);
}

// Get Arrays from localStorage if available, set default values if not
function getSavedColumns() {
  if (localStorage.getItem("backlogItems")) {
    backlogListArray = JSON.parse(localStorage.backlogItems);
    progressListArray = JSON.parse(localStorage.progressItems);
    completeListArray = JSON.parse(localStorage.completeItems);
    onHoldListArray = JSON.parse(localStorage.onHoldItems);
  } else {
    backlogListArray = ["Release the course", "Sit back and relax"];
    progressListArray = ["Work on projects", "Listen to music"];
    completeListArray = ["Being cool", "Getting stuff done"];
    onHoldListArray = ["Being uncool"];
    // *updates local storage to ensure consistency between local storage and data
    updateSavedColumns();
  }
}

// Set localStorage Arrays
function updateSavedColumns() {
  listArrays = [
    backlogListArray,
    progressListArray,
    completeListArray,
    onHoldListArray,
  ];
  const listNames = ["backlog", "progress", "complete", "onHold"];
  listArrays.forEach((listarray, i) => {
    localStorage.setItem(`${listNames[i]}Items`, JSON.stringify(listarray));
  });
}

// Create DOM Elements for each list item
// function createItemEl(columnEl, column, item, index) {
//   console.log("columnEl:", columnEl);
//   console.log("column:", column);
//   console.log("item:", item);
//   console.log("index:", index);
//   // List Item
//   const listEl = document.createElement("li");
//   listEl.classList.add("drag-item");
// }

function createItemEl(itemText, list) {
  const itemContainer = document.createElement("div");
  itemContainer.style.position = "relative";

  const item = document.createElement("li");
  item.classList.add("drag-item");
  item.setAttribute("draggable", "true");
  item.textContent = itemText;
  item.contentEditable = "true";

  const dbtn = document.createElement("span");
  dbtn.classList.add("delete-item");
  dbtn.innerHTML = "&#10005;";

  // item.appendChild(dbtn);
  itemContainer.append(item, dbtn);
  itemContainer.addEventListener("dragstart", (ev) => {
    // ev.dataTransfer.setData("object", ev.target);
    transferElement = item;
    sourceList = list;

    setTimeout(() => {
      itemContainer.style.display = "none";
    }, 0);
  });
  itemContainer.addEventListener("dragend", (ev) => {
    // ev.dataTransfer.setData("object", ev.target);
    setTimeout(() => {
      itemContainer.style.display = "block";
      transferElement = null;
      sourceList = null;
    }, 0);
  });

  // delete functionality
  dbtn.addEventListener("click", function () {
    removeItemFromArray(list, itemText);
    itemContainer.remove();
    updateSavedColumns();
  });

  // update item functionalities
  item.addEventListener("focusout", function () {
    const newText = item.textContent;
    const lastText = itemText;
    if (newText === lastText) return;

    if (!newText) {
      // remove it
      removeItemFromArray(list, lastText);
      itemContainer.remove();
    } else {
      // update list aka. replace lastText with newText
      const index = list.indexOf(lastText);
      if (index !== -1) {
        list[index] = newText;
      }
    }

    //! wow: i can update the closure variable
    itemText = newText;

    updateSavedColumns();
  });
  return itemContainer;
}

function populateDomList(listEl, listarray) {
  listEl.textContent = "";
  listarray.forEach((itemText, _, list) => {
    listEl.appendChild(createItemEl(itemText, list));
  });
}

// showInputBox
function showInputBox(column) {
  // hide the add Item button
  addBtns[column].style.visibility = "hidden";

  // show save item button
  saveItemBtns[column].style.display = "flex";

  // show the container
  addItemContainers[column].style.display = "flex";

  // focus addItem div
  addItems[column].focus();
}
function hideInputBox(column) {
  // show the add Item button
  addBtns[column].style.visibility = "visible";

  // hide save item button
  saveItemBtns[column].style.display = "none";

  // hide the container
  addItemContainers[column].style.display = "none";
}

function saveNewItem(column) {
  const itemText = addItems[column].textContent;
  if (itemText) {
    // updating state
    listArrays = [
      backlogListArray,
      progressListArray,
      completeListArray,
      onHoldListArray,
    ];
    listArrays[column].push(itemText);

    // updating dom
    itemLists[column].appendChild(createItemEl(itemText, listArrays[column]));

    // update local storage
    updateSavedColumns();
  }

  addItems[column].textContent = "";

  // hide add item stuff
  hideInputBox(column);
}

// Update Columns in DOM - Reset HTML, Filter Array, Update localStorage
// populate dom with the state in the array
function updateDOM() {
  // Backlog Column
  populateDomList(backlogList, backlogListArray);

  // Progress Column
  populateDomList(progressList, progressListArray);

  // Complete Column
  populateDomList(completeList, completeListArray);

  // On Hold Column
  populateDomList(onHoldList, onHoldListArray);
}

function initiateBoard() {
  // load local storage
  getSavedColumns();

  // update dom
  updateDOM();
}

// Event Listeners
// function handleDragStart(item, list) {
//   // ev.dataTransfer.setData("object", ev.target);
//   transferElement = item;
//   sourceList = list;
//   setTimeout(() => (item.style.display = "none"), 0);
// }
// function handleDragEnd(item, list) {}

// allow to drop over other elements
itemLists.forEach((itemList) => {
  let dragCounter = 0;

  itemList.addEventListener("dragenter", (e) => {
    dragCounter++;
    itemList.classList.add("over");
  });

  itemList.addEventListener("dragleave", (e) => {
    dragCounter--;
    if (dragCounter === 0) {
      itemList.classList.remove("over");
    }
  });

  itemList.addEventListener("dragover", (ev) => {
    ev.preventDefault(); // Required to allow dropping
  });

  itemList.addEventListener("drop", function (ev) {
    ev.preventDefault();
    dragCounter = 0;
    this.classList.remove("over");

    // destination list : aka this itemList -> list
    listArrays = [
      backlogListArray,
      progressListArray,
      completeListArray,
      onHoldListArray,
    ];
    let index = 0,
      destinationList = null;
    for (let currentList of itemLists) {
      if (currentList === this) {
        destinationList = listArrays[index];
        break;
      }
      index++;
    }

    // move child in the dom
    if (sourceList && destinationList && sourceList !== destinationList) {
      // update dom
      this.appendChild(
        createItemEl(transferElement.textContent, destinationList)
      );
      // update arrays
      moveItemFromToList(
        sourceList,
        destinationList,
        transferElement.textContent
      );
      transferElement.remove();
      // update local storage
      updateSavedColumns();
    }
  });
});

// onload
initiateBoard();
// *senario
// load local storage -> use arrays to populate dom
