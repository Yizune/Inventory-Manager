import { create } from 'zustand';
import swordIcon from './assets/sword.png';
import shieldIcon from './assets/shield.png';
import potionIcon from './assets/potion.png';
import knightIcon from './assets/knight.png';

//import { create } from 'zustand'; - This brings in a tool from the zustand library called create.
//zustand - Zustand helps you store and manage data (like items in inventory) in one place so different parts of your app can use or update it.
//create - IT IS A FUNCTION (from zus). It makes it easier to share and update data between components without passing props around everywhere.
//create - creating a shared place where any component can grab or update data, without needing a parent to pass it down.

  // Handlers, hooks, state, contexts, 

  // GOOD AS IS

// const useStore - a custom HOOK using Zustand’s create. It lets you access shared state (shared = public — used by multiple components) 
// anywhere (instead of using props)
const useStore = create((set) => ({ // Hey zustand, create a shared box (store) and give me a way to change what’s inside it (set). 
// It's basically shared data that any part of the app can access or update.

  backpackItems: JSON.parse(localStorage.getItem('backpackItems')) || [ //It first tries to load the data from localStorage using 
  // localStorage.getItem('backpackItems'). If no data is found, it defaults to an array

    { id: 'item1', name: 'Sword', icon: swordIcon, category: "Attack", rarity: "Common", stats: "+15 Damage" },
    null,
    null,
  ],
  chestItems: JSON.parse(localStorage.getItem('chestItems')) || [ //Same here as the one up
    { id: 'item2', name: 'Shield', icon: shieldIcon, category: "Defense", rarity: "Uncommon", stats: "+10 Defense" },
    { id: 'item3', name: 'Potion', icon: potionIcon, category: "Other", rarity: "Common", stats: "Restores 50 HP" },
    { id: 'item4', name: 'Helmet', icon: knightIcon, category: "Defense", rarity: "Rare", stats: "+5 Defense" },
    null, null, null, null, null, null, null,
  ],
  
  
  // GOOD AS IS
  
  
// If no value is found in localStorage, it defaults to 'All'.
  selectedCategory: localStorage.getItem('selectedCategory') || 'All',
  selectedRarity: localStorage.getItem('selectedRarity') || 'All',

// setCategoryFilter - A method
// category - argument
// This functiom saves the category value to localStorage and ppdates the store’s selectedCategory value to that same category value
  setCategoryFilter: (category) =>
    set(() => {
      localStorage.setItem('selectedCategory', category);
      return { selectedCategory: category };
    }),
// Same here as the one up
  setRarityFilter: (rarity) =>
    set(() => {
      localStorage.setItem('selectedRarity', rarity);
      return { selectedRarity: rarity };
    }),
  
  
  // CAN BE CHANGED BUT THERE IS EXPLANATION FOR ADVANCED WAY
  

    // addItemToBackpack - A method, It’s a function inside the store that puts an item into a specific slot in your backpack
    // item - argument
    // slotIndex - argument
  addItemToBackpack: (item, slotIndex) =>

    // The "state" parameter automatically represents the current state of your Zustand store at that moment
    set((state) => {

    // If the slot index is too small (less than 0) or too big (beyond the size of the backpack), do nothing and just return the current "state"
      if (slotIndex < 0 || slotIndex >= state.backpackItems.length) return state;

      //It creates a copy of the backpackItems array from the current state.
      // [...something] - This is called the spread operator. It takes all items from an array and spreads them into a new one
      // In react you are not supposed to modify the state directly, so you always make a copy of it and then update the copy, 
      // and then return it as the new "state"
      const newBackpack = [...state.backpackItems];

      // It puts the item into the specified slot in the newBackpack array. Works because inventory has fixed amount slots.
      newBackpack[slotIndex] = item;

      // Creates the new array (newBackpack), saves it into localStorage, updates Zustand's state with it
      localStorage.setItem('backpackItems', JSON.stringify(newBackpack));
      return { backpackItems: newBackpack };
    }),

  removeItemFromBackpack: (slotIndex) =>
    set((state) => {
      if (slotIndex < 0 || slotIndex >= state.backpackItems.length) return state;
      const newBackpack = [...state.backpackItems];
      // It removes the item from the specified slot in the newBackpack array and turns the slot into a null (empty slot)/
      newBackpack[slotIndex] = null;
      localStorage.setItem('backpackItems', JSON.stringify(newBackpack));
      return { backpackItems: newBackpack };
    }),

    // Same here
  addItemToChest: (item, slotIndex) =>
    set((state) => {
      if (slotIndex < 0 || slotIndex >= state.chestItems.length) return state;
      const newChest = [...state.chestItems];
      newChest[slotIndex] = item;
      localStorage.setItem('chestItems', JSON.stringify(newChest));
      return { chestItems: newChest };
    }),

    // Same here
  removeItemFromChest: (slotIndex) =>
    set((state) => {
      if (slotIndex < 0 || slotIndex >= state.chestItems.length) return state;
      const newChest = [...state.chestItems];
      newChest[slotIndex] = null;
      localStorage.setItem('chestItems', JSON.stringify(newChest));
      return { chestItems: newChest };
    }),
}));

export default useStore;



/*

// BASIC WAY - USES SLICE() TO COPY THE ARRAY - WORKS THE SAME WAY AS THE ADVANCED WAY

removeItemFromBackpack: function(slotIndex) {
  set(function(state) {
    if (slotIndex < 0 || slotIndex >= state.backpackItems.length) {
      return state;
    }

    // Create a shallow copy manually
    var newBackpack = state.backpackItems.slice(); // slice() copies the array

    // Remove the item
    newBackpack[slotIndex] = null;

    // Save to localStorage
    localStorage.setItem('backpackItems', JSON.stringify(newBackpack));

    // Return the new state
    return {
      backpackItems: newBackpack
    };
  });
}

*/