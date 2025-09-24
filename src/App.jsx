import './App.css';
import Backpack from './components/Backpack';
import StorageChest from './components/StorageChest';
import useStore from './store';
import { DndContext, DragOverlay } from '@dnd-kit/core'; // DndContext - It’s like a wrapper that wraps things that can use drag and drop.
// DragOverlay - It’s a special component that shows a preview of the item being dragged. The item follows mouse and apopears on top of all.

import { useState } from 'react'; // Import the useState hook from React - lets your component keep track of changing data

function App() { 
  const { // using object destructuring to pull out all of these values and functions at once
    backpackItems, // State - an array of items in the backpack
    chestItems, // State - an array of items in the chest
    addItemToBackpack, // Function - adds an item to the backpack
    removeItemFromBackpack,  // Function - removes an item from the backpack
    addItemToChest, // Function - adds an item to the chest
    removeItemFromChest, // Function - removes an item from the chest
    selectedCategory, // State - the selected category filter
    selectedRarity, // State - the selected rarity filter
    setCategoryFilter, // Function - Updates the category filter and saves it to localStorage
    setRarityFilter, // Function - Updates the rarity filter and saves it to localStorage
  } = useStore(); // useStore - custom hook that gives you access to the shared state and methods (actions) stored in your Zustand store.


  // activeDragItem - The item that is currently being dragged
  const [activeDragItem, setActiveDragItem] = useState(null); // State


  // setActiveDragItemId - The ID of the item that is currently being dragged
  const [activeDragItemId, setActiveDragItemId] = useState(null); // State


  // handleReset - Function that runs when the reset button is clicked, it clears the localStorage and reloads the page
  const handleReset = () => {
    localStorage.removeItem('backpackItems');
    localStorage.removeItem('chestItems');
    localStorage.removeItem('selectedCategory');
    localStorage.removeItem('selectedRarity');
    window.location.reload();
  };


  // isFiltering - A boolean that checks if the user is currently filtering items by category or rarity
  // if something other than "All" is selected in the category or rarity filter, isFiltering is true
  const isFiltering = selectedCategory !== "All" || selectedRarity !== "All";


  // filteredChestItems - Creates a new array of items in the chest that match the selected category and rarity filters
  const filteredChestItems = chestItems.filter((item) => {

    // If you're not filtering anything, it allows empty slots to stay. Otherwise it removes the empty/null slots.
    if (!item) return !isFiltering;

    // categoryMatches - Checks if the item's category matches the selected category or if the selected category is "All"
    const categoryMatches = selectedCategory === "All" || item.category === selectedCategory;
    // rarityMatches - Checks if the item's rarity matches the selected rarity or if the selected rarity is "All"
    const rarityMatches = selectedRarity === "All" || item.rarity === selectedRarity;

    // Returns only the matching items if true
    return categoryMatches && rarityMatches;
  });


  // handleDragStart - Function for when an item starts being dragged, it receives "event" object as a param (provided by dnd when dragging starts)
  // event - The event object that contains information about the drag event, also contains info about item being dragged and it's ID
  const handleDragStart = (event) => { 

    // activeId - The ID of the item that is currently being dragged
    const activeId = event.active.id;

    // draggedItem - The item that is currently being dragged
    const draggedItem = // It finds the item that is being dragged in either the backpack or the chest

    // .find() - A built-in JavaScript method that looks through an array and returns the first item that matches the condition
    // item?.id === activeId uses optional chaining (?.) to avoid errors if the item is null.
    // If the item is found in backpackItems, it stops there.
    // If the item is not found in backpackItems, it looks for it in chestItems.
    // If the item is not found in chestItems, it returns null.
      backpackItems.find((item) => item?.id === activeId) ||
      chestItems.find((item) => item?.id === activeId) ||
      null;

    // These allow us to know what item is being dragged and know it's ID
    // It's important so we can hide the item from the source while dragging it, and show a floating preview image of it
    setActiveDragItem(draggedItem);
    setActiveDragItemId(activeId);
  };


  // handleDragEnd - Function for when an item stops being dragged, it receives "event" object as a param (provided by dnd when dragging ends)
  // event - The event object that contains information about the drag event, also contains info about item being dragged and it's ID
  const handleDragEnd = (event) => {

    // active - The item that is currently being dragged
    // over - The item that is currently being hovered over
    const { active, over } = event; // object destructuring

    // It resets the activeDragItem and activeDragItemId to null (the drag state resets)
    setActiveDragItem(null);
    setActiveDragItemId(null);

    // If no valid drop target (like dropping outside the grid), we exit early.
    if (!over) return;


    // Get IDs of source and target slots
    const activeId = active.id; // The ID of the item that is currently being dragged
    const overId = over.id; // ID of the slot it was dropped onto


    // id - The ID of the item that is currently being dragged (backpack-slot-0, storage-chest-slot-0, etc.)
    // prefix - The prefix of the slot ID (either "backpack-slot-" or "storage-chest-slot-")
    const getSlotIndex = (id, prefix) => { 

      // If the ID doesn't start with the prefix, it returns NaN (Not a Number)
      if (!id.startsWith(prefix)) return NaN;

      // It splits the ID into parts
      const parts = id.split('-');

      // parseInt - A built-in JavaScript function that converts a string to an integer
      // parts[parts.length - 1] - The last part of the ID (the slot number)
      // Why 10? It means we're parsing the number as base 10 (normal decimal numbers).
      return parseInt(parts[parts.length - 1], 10);
    };

    // If the item exists in the backpack, this returns its index. Otherwise, it returns -1. (meaning it came from chest)
    const sourceSlotIndex = backpackItems.findIndex((item) => item?.id === activeId);

    // Figures out where the item is being dropped (backpack or storage slot)
    // overId - Comes from dnd package. It’s the ID of the slot where the item is being dropped.
    const targetSlotIndex = overId.startsWith('backpack-slot-')
      ? getSlotIndex(overId, 'backpack-slot-')
      : getSlotIndex(overId, 'storage-chest-slot-');

    // isNaN(...) is a JavaScript function.
    // If it isn't a number (which means something went wrong, like the item was dropped in an invalid area), the function will stop right there
    if (isNaN(targetSlotIndex)) return;

    // If the item came from the backpack, get it from backpackItems[sourceSlotIndex]. Otherwise, get it from chestItems.
    // draggedItem - The item that is currently being dragged
    const draggedItem =
      sourceSlotIndex !== -1 // means we found the item in the backpack.
        ? backpackItems[sourceSlotIndex] // grabs the item from the backpack at that slot
        : chestItems.find((item) => item?.id === activeId) || null; //if not backpack, we assume chest and search with .find to match the ID
        // If not either default to null

    // Checks if there is an item already in the slot you're dropping onto
    const targetItem = overId.startsWith('backpack-slot-') // If the item is being dropped into the backpack
      ? backpackItems[targetSlotIndex] // Get the item from the backpackItems[targetSlotIndex]
      : chestItems[targetSlotIndex] || null; // otherwise you're dropping it into the chest, so get the item from chestItems[targetSlotIndex]
      // Otherwise default to null


    // Did the user drop the item into the backpack? If yes -
    if (overId.startsWith('backpack-slot-')) {
      addItemToBackpack(draggedItem, targetSlotIndex); // - Put the dragged item into the correct backpack slot.

      // 
      if (sourceSlotIndex !== -1) { // if this true, it means the item was dragged from the backpack
        if (targetItem) addItemToBackpack(targetItem, sourceSlotIndex); // If there's an item in the target slot, put it back in the source slot
        else removeItemFromBackpack(sourceSlotIndex); // If there's no item in the target slot, remove the item from the source slot
      } 
      
      else { // in this case it means that sourceSlotIndex is -1, so the item was dragged from the chest
        const chestSlotIndex = chestItems.findIndex((item) => item?.id === activeId); // Find the index of the item in the chest
        removeItemFromChest(chestSlotIndex); // Remove the item from the chest
        if (targetItem) addItemToChest(targetItem, chestSlotIndex); // If there's an item in the target slot, put it back in the chest
      }
    } 
    
    // Did the user drop the item into the chest? If yes -
    else if (overId.startsWith('storage-chest-slot-')) {
      const chestSlotIndex = chestItems.findIndex((item) => item?.id === activeId); // Find the index of the item in the chest
      //If the item came from the chest, we’ll need to know which chest slot it came from in case we want to remove it from there or swap it.

      addItemToChest(draggedItem, targetSlotIndex); // Place the dragged item into the correct chest slot.
      if (sourceSlotIndex === -1) { // Did the item come from the chest? (JS .findIndex() returns -1 if it doesn't find anything ITS A BUILT THING)
        removeItemFromChest(chestSlotIndex); //  If yes, remove it from the chest
        if (targetItem) addItemToChest(targetItem, chestSlotIndex); // If there's an item in the target slot, put it back in the chest
      } else { // If the item came from the backpack
        if (targetItem) addItemToBackpack(targetItem, sourceSlotIndex); // If there's an item in the target slot, put it back in the backpack
        else removeItemFromBackpack(sourceSlotIndex); // If there's no item in the target slot, remove the item from the backpack
      }
    }
  };

  return (
    // DndContext - It’s like a wrapper that wraps things that can use drag and drop.
    // onDragStart and onDragEnd are event handlers that run when an item starts and stops being dragged.
    <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}> 
      <h1>Inventory Manager</h1>
      <button onClick={handleReset} className="reset-button">RESET APP</button>
      
      <div className="inventory-container">
        <StorageChest // StorageChest component, it displays the storage chest and its items
          items={filteredChestItems} // prop = variables/functions
          activeDragItemId={activeDragItemId}
          categoryFilter={selectedCategory} 
          handleCategoryFilter={setCategoryFilter} 
          handleRarityFilter={(e) => setRarityFilter(e.target.value)} // e.target.value - the value of the dropdown
          //take the event e, grab the value from the dropdown (e.target.value), and pass it to setRarityFilter.
          // it expects a function used with onChange (gets an event), handleCategoryFilter expects a function that takes a string
          selectedCategory={selectedCategory}
          selectedRarity={selectedRarity}
        />
        {/* // Backpack component, it displays the backpack and its items */}
        <Backpack items={backpackItems} activeDragItemId={activeDragItemId} />
      </div>

      <DragOverlay>
        {/* // Floating preview of the item being dragged, if activeDragItem exists show it's icon, otherwise nothing */}
        {activeDragItem ? (
          <div className="drag-preview">
            <img src={activeDragItem.icon} alt={activeDragItem.name} />
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}

export default App;

/* 

WAYS TO MAKE CODE DUMBER 

Instead of .find use entire for loops

const draggedItem =
  backpackItems.find((item) => item?.id === activeId) ||

///////////////////////////////////////

  let draggedItem = null;

for (let i = 0; i < backpackItems.length; i++) {
  const item = backpackItems[i];
  if (item && item.id === activeId) {
    draggedItem = item;
    break;
  }
}

Also mention wasn't using any destructuring


HOOKS
This is a React hook to create and manage local state:
const [activeDragItem, setActiveDragItem] = useState(null);
const [activeDragItemId, setActiveDragItemId] = useState(null);

This is a custom Zustand hook (not a built-in React hook). It gives you access to the shared store created using Zustand:
const { ... } = useStore();


STATES
activeDragItem – the item currently being dragged (local state)
activeDragItemId – the ID of the dragged item (local state)
backpackItems, chestItems, selectedCategory, selectedRarity – these come from your Zustand store, which is global state (shared across components)

CONTEXT
DndContext from @dnd-kit/core
This acts like a provider that wraps everything inside and gives drag-and-drop functionality to child components.
So while you're not creating your own custom context, you are using a context provided by a library.

HANDLERS (Functions that respond to events)
You have multiple handlers, which are functions that run when something happens:
handleReset – Clears localStorage and reloads the app.
handleDragStart – Runs when dragging begins.
handleDragEnd – Runs when dragging stops.
handleRarityFilter – Passed as a prop (an inline function using e => setRarityFilter(e.target.value)).

*/