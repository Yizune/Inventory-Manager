import { create } from 'zustand';
import swordIcon from './assets/sword.png';
import shieldIcon from './assets/shield.png';
import potionIcon from './assets/potion.png';
import knightIcon from './assets/knight.png';

const useStore = create((set) => ({ 
  backpackItems: JSON.parse(localStorage.getItem('backpackItems')) || [ 

    { id: 'item1', name: 'Sword', icon: swordIcon, category: "Attack", rarity: "Common", stats: "+15 Damage" },
    null,
    null,
  ],
  chestItems: JSON.parse(localStorage.getItem('chestItems')) || [ 
    { id: 'item2', name: 'Shield', icon: shieldIcon, category: "Defense", rarity: "Uncommon", stats: "+10 Defense" },
    { id: 'item3', name: 'Potion', icon: potionIcon, category: "Other", rarity: "Common", stats: "Restores 50 HP" },
    { id: 'item4', name: 'Helmet', icon: knightIcon, category: "Defense", rarity: "Rare", stats: "+5 Defense" },
    null, null, null, null, null, null, null,
  ],
  selectedCategory: localStorage.getItem('selectedCategory') || 'All',
  selectedRarity: localStorage.getItem('selectedRarity') || 'All',

  setCategoryFilter: (category) =>
    set(() => {
      localStorage.setItem('selectedCategory', category);
      return { selectedCategory: category };
    }),

  setRarityFilter: (rarity) =>
    set(() => {
      localStorage.setItem('selectedRarity', rarity);
      return { selectedRarity: rarity };
    }),
  
  addItemToBackpack: (item, slotIndex) =>
    set((state) => {
      if (slotIndex < 0 || slotIndex >= state.backpackItems.length) return state;
      const newBackpack = [...state.backpackItems];
      newBackpack[slotIndex] = item;
      localStorage.setItem('backpackItems', JSON.stringify(newBackpack));
      return { backpackItems: newBackpack };
    }),

  removeItemFromBackpack: (slotIndex) =>
    set((state) => {
      if (slotIndex < 0 || slotIndex >= state.backpackItems.length) return state;
      const newBackpack = [...state.backpackItems];
      newBackpack[slotIndex] = null;
      localStorage.setItem('backpackItems', JSON.stringify(newBackpack));
      return { backpackItems: newBackpack };
    }),

  addItemToChest: (item, slotIndex) =>
    set((state) => {
      if (slotIndex < 0 || slotIndex >= state.chestItems.length) return state;
      const newChest = [...state.chestItems];
      newChest[slotIndex] = item;
      localStorage.setItem('chestItems', JSON.stringify(newChest));
      return { chestItems: newChest };
    }),

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