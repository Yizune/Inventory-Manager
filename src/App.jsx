import './App.css';
import Backpack from './components/Backpack';
import StorageChest from './components/StorageChest';
import useStore from './store';
import { DndContext, DragOverlay } from '@dnd-kit/core';

import { useState } from 'react';

function App() { 
  const { 
    backpackItems, 
    chestItems, 
    addItemToBackpack, 
    removeItemFromBackpack,  
    addItemToChest, 
    removeItemFromChest, 
    selectedCategory, 
    selectedRarity, 
    setCategoryFilter, 
    setRarityFilter, 
  } = useStore();

  const [activeDragItem, setActiveDragItem] = useState(null); 
  const [activeDragItemId, setActiveDragItemId] = useState(null);

  const handleReset = () => {
    localStorage.removeItem('backpackItems');
    localStorage.removeItem('chestItems');
    localStorage.removeItem('selectedCategory');
    localStorage.removeItem('selectedRarity');
    window.location.reload();
  };

  const isFiltering = selectedCategory !== "All" || selectedRarity !== "All";
  const filteredChestItems = chestItems.filter((item) => {

    if (!item) return !isFiltering;

    const categoryMatches = selectedCategory === "All" || item.category === selectedCategory;
    const rarityMatches = selectedRarity === "All" || item.rarity === selectedRarity;

    return categoryMatches && rarityMatches;
  });

  const handleDragStart = (event) => { 
    const activeId = event.active.id;
    const draggedItem = 
      backpackItems.find((item) => item?.id === activeId) ||
      chestItems.find((item) => item?.id === activeId) ||
      null;

    setActiveDragItem(draggedItem);
    setActiveDragItemId(activeId);
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;

    setActiveDragItem(null);
    setActiveDragItemId(null);

    if (!over) return;

    const activeId = active.id; 
    const overId = over.id;

    const getSlotIndex = (id, prefix) => { 

      if (!id.startsWith(prefix)) return NaN;
      
      const parts = id.split('-');

      return parseInt(parts[parts.length - 1], 10);
    };

    const sourceSlotIndex = backpackItems.findIndex((item) => item?.id === activeId);
    const targetSlotIndex = overId.startsWith('backpack-slot-')
      ? getSlotIndex(overId, 'backpack-slot-')
      : getSlotIndex(overId, 'storage-chest-slot-');

    if (isNaN(targetSlotIndex)) return;

    const draggedItem =
      sourceSlotIndex !== -1 
        ? backpackItems[sourceSlotIndex] 
        : chestItems.find((item) => item?.id === activeId) || null; 

    const targetItem = overId.startsWith('backpack-slot-') 
      ? backpackItems[targetSlotIndex] 
      : chestItems[targetSlotIndex] || null; 
     
    if (overId.startsWith('backpack-slot-')) {
      addItemToBackpack(draggedItem, targetSlotIndex);

      if (sourceSlotIndex !== -1) { 
        if (targetItem) addItemToBackpack(targetItem, sourceSlotIndex);
        else removeItemFromBackpack(sourceSlotIndex);
      } 
      
      else { 
        const chestSlotIndex = chestItems.findIndex((item) => item?.id === activeId);
        removeItemFromChest(chestSlotIndex);
        if (targetItem) addItemToChest(targetItem, chestSlotIndex);
      }
    } 
    
    else if (overId.startsWith('storage-chest-slot-')) {
      const chestSlotIndex = chestItems.findIndex((item) => item?.id === activeId);

      addItemToChest(draggedItem, targetSlotIndex);
      if (sourceSlotIndex === -1) { 
        removeItemFromChest(chestSlotIndex); 
        if (targetItem) addItemToChest(targetItem, chestSlotIndex); 
      } else { 
        if (targetItem) addItemToBackpack(targetItem, sourceSlotIndex); 
        else removeItemFromBackpack(sourceSlotIndex); 
      }
    }
  };

  return (
    <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}> 
      <h1>Inventory Manager</h1>
      <button onClick={handleReset} className="reset-button">RESET APP</button>
      
      <div className="inventory-container">
        <StorageChest 
          items={filteredChestItems} 
          activeDragItemId={activeDragItemId}
          categoryFilter={selectedCategory} 
          handleCategoryFilter={setCategoryFilter} 
          handleRarityFilter={(e) => setRarityFilter(e.target.value)} 
          selectedCategory={selectedCategory}
          selectedRarity={selectedRarity}
        />
        <Backpack items={backpackItems} activeDragItemId={activeDragItemId} />
      </div>
      <DragOverlay>
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