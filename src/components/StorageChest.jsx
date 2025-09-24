import React from 'react';
import { useDroppable } from '@dnd-kit/core';// It’s a hook you use inside a component to say:This area can receive items that are being dragged.
import Item from './Item';
import attackIcon from '../assets/attack.png';
import defenseIcon from '../assets/defense.png';
import otherIcon from '../assets/accesories.png';
import allIcon from '../assets/infinity.png';

function StorageChest({ // These are props passed into the component, written as parameters using object destructuring.
  items, 
  activeDragItemId, 
  categoryFilter, 
  handleCategoryFilter, 
  handleRarityFilter, 
  selectedRarity 
}) {
  return (
    <div className="storage-container">
      <div className="inventory-title">
        Storage Chest
      </div>

      <div className="filter-container">
        <button 
        // if categoryFilter is 'All', add the 'active' class to the button, otherwise don't add it.
          className={`filter-button ${categoryFilter === 'All' ? 'active' : ''}`} 
          onClick={() => handleCategoryFilter("All")}
        >
          <img src={allIcon} alt="All" />
        </button>
        <button 
        // if categoryFilter is 'Attack', add the 'active' class to the button, otherwise don't add it.
          className={`filter-button ${categoryFilter === 'Attack' ? 'active' : ''}`} 
          onClick={() => handleCategoryFilter("Attack")}
        >
          <img src={attackIcon} alt="Attack" />
        </button>
        <button 
        // if categoryFilter is 'Defense', add the 'active' class to the button, otherwise don't add it.
          className={`filter-button ${categoryFilter === 'Defense' ? 'active' : ''}`} 
          onClick={() => handleCategoryFilter("Defense")}
        >
          <img src={defenseIcon} alt="Defense" />
        </button>
        <button 
        // if categoryFilter is 'Other', add the 'active' class to the button, otherwise don't add it.
          className={`filter-button ${categoryFilter === 'Other' ? 'active' : ''}`} 
          onClick={() => handleCategoryFilter("Other")}
        >
          <img src={otherIcon} alt="Other" />
        </button>


        {/* The select element = dropdown -> filter items by rarity. */}
        <select 
          className="rarity-filter" 
          value={selectedRarity} 
          onChange={handleRarityFilter}
        >
          <option value="All">All</option>
          <option value="Common">Common</option>
          <option value="Uncommon">Uncommon</option>
          <option value="Rare">Rare</option>
        </select>
      </div>


      {/* The storage chest grid */}
      <div className="inventory-grid storage-grid">
        {items.map((item, index) => ( // .map() is a built-in JavaScript method used to loop through 
        // an array and transform each item into something new. items is an array of items. index is the index of the current item.


          // useDroppable is a hook from the Dnd-kit library that allows an element to accept dropped items.
          // key={index} – Tells React which box this is (helps it keep track). This is only for React, not your component.
          // index={index} – Tells the component which slot this is (helps it keep track). This is for your component.
          // item={item} – Passes the item data to the DroppableSlot component as a prop.
          // activeDragItemId={activeDragItemId} – Passes the activeDragItemId to the DroppableSlot component as a prop.
          <DroppableSlot key={index} index={index} item={item} activeDragItemId={activeDragItemId} />
        ))}
      </div>
    </div>
  );
}

const DroppableSlot = ({ index, item, activeDragItemId }) => {
  const { setNodeRef, isOver } = useDroppable({ id: `storage-chest-slot-${index}` });

  return (
    <div ref={setNodeRef} className={`inventory-slot ${isOver ? 'hover-effect' : ''}`}>
      {item && item.id !== activeDragItemId ? (
        <Item
          id={item.id}
          name={item.name}
          icon={item.icon}
          category={item.category}
          rarity={item.rarity}
          stats={item.stats}
        />
      ) : (
        <span className="empty-slot">Empty</span>
      )}
    </div>
  );
};

export default StorageChest;