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
// Initialize Arrays
let backlogListArray = [];
let progressListArray = [];
let completeListArray = [];
let onHoldListArray = [];
let listArrays = [];
// Drag Functionality

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

function createItemEl(itemText) {
  const item = document.createElement("li");
  item.classList.add("drag-item");
  item.setAttribute("draggable", "true");
  item.textContent = itemText;

  item.addEventListener("dragstart", (ev) => {
    // ev.dataTransfer.setData("object", ev.target);
    transferElement = item;
    setTimeout(() => (item.style.display = "none"), 0);
  });
  item.addEventListener("dragend", (ev) => {
    // ev.dataTransfer.setData("object", ev.target);
    setTimeout(() => {
      item.style.display = "block";
      transferElement = null;
    }, 0);
  });

  // item.addEventListener("drop", (ev) => {});
  return item;
}

function populateDomList(listEl, listarray) {
  listEl.textContent = "";
  listarray.forEach((itemText) => {
    listEl.appendChild(createItemEl(itemText));
  });
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
// allow to drop over other elements
itemLists.forEach((itemList) => {
  let dragCounter = 0;

  itemList.addEventListener("dragenter", (e) => {
    dragCounter++;
    console.log("enter", dragCounter, e.target, e.currentTarget);
    itemList.classList.add("over");
  });

  itemList.addEventListener("dragleave", (e) => {
    dragCounter--;
    console.log("leave", dragCounter, e.target, e.currentTarget);
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
    this.appendChild(transferElement);
  });
});

// onload
initiateBoard();
// *senario
// load local storage -> use arrays to populate dom
