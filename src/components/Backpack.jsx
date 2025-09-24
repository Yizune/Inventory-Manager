import React from 'react';
import { useDroppable } from '@dnd-kit/core';// It’s a hook you use inside a component to say:This area can receive items that are being dragged.
import Item from './Item';

// Imports react library, useDroppable hook from Dnd-kit library, and Item component

function Backpack({ items, activeDragItemId }) { // a function that receives items and activeDragItemId as props (it's both props and params)
  return (
    <div className="backpack-container">
      <div className="inventory-title" >
        Backpack
      </div>
      <div className="inventory-grid backpack-grid" >
        
        {/* Going through every item in the items array one by one using .map() 
            .map() is a built-in JavaScript method used to loop through an array and transform each item into something new. */}
        {/* For each item, we are setting up a slot in the backpack (a div). */}
        {/* We also tell the drag-and-drop system (via useDroppable) that this slot can accept dropped items. */}
        {/* setNodeRef is how we connect the HTML div to the drag-and-drop logic. */}
        {/* isOver tells us if an item is being dragged over that slot right now. */}
        {items.map((item, index) => {
          const { setNodeRef, isOver } = useDroppable({ id: `backpack-slot-${index}` });

          // Creates a div (a box) for each slot in the backpack.
          // key={index} – Tells React which box this is (helps it keep track).
          // ref={setNodeRef} – Connects this box to the drag-and-drop system so it can be dropped on.
          // className={...} – Adds a CSS class to the box when an item is being dragged over it.
          return (
            <div
              key={index}
              ref={setNodeRef}
              // if isOver (hovering) give it hover-effect class too, othewise just keep inventory-slot
              className={`inventory-slot ${isOver ? 'hover-effect' : ''}`}
            >

              {/* If there's an item here and it's not the one being dragged */}
              {item && item.id !== activeDragItemId ? (
                // Show the item
                // We pass the item's data to the Item component as props
                <Item
                  id={item.id}
                  name={item.name}
                  icon={item.icon}
                  category={item.category}
                  rarity={item.rarity}
                  stats={item.stats}
                />
              ) : (
                // Otherwise show the word "Empty"
                <span className="empty-slot">Empty</span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Backpack;
