import { useState } from 'react';
import { useDraggable } from '@dnd-kit/core';
// Imports the useDraggable hook from the Dnd-kit library


// Defines an object that maps item rarities (common, uncommon, rare) to specific colors. 
// Used to dynamically style the rarity text in the tooltip based on the item's rarity.
const rarityColors = {
  common: 'green',
  uncommon: 'blue',
  rare: 'purple',
};


// Defines the Item functional component and accepts the following props: id, name, icon, category, rarity, stats.
const Item = ({ id, name, icon, category, rarity, stats }) => {

  // This specific hook (useDraggable) makes an element draggable. it's a hook from dnd
  // The id prop is passed to the useDraggable hook to identify the draggable element.
  // The useDraggable hook returns an object with attributes, listeners, and setNodeRef properties.
  // const { attributes, listeners, setNodeRef } - this thing is called OBJECT DESTRUCTURING
  // It's a way to pull properties off an object and assign them to variables.
  /* 
  const result = useDraggable({ id });
  const attributes = result.attributes;
  const listeners = result.listeners;
  const setNodeRef = result.setNodeRef; - This is what object destructuring does behind the scenes
  */
  // attributes - HTML attributes that need to be added to the draggable element.
  // listeners - Event listeners that need to be added to the draggable element. 
  // setNodeRef - A function that sets the reference to the draggable element.
  const { attributes, listeners, setNodeRef } = useDraggable({ id }); // HOOK


  // Tracks whether the mouse is hovering over the item or not. 
  // So when you move your mouse over the item -> setIsHovered(true) ; And when your mouse leaves the item -> setIsHovered(false)
  const [isHovered, setIsHovered] = useState(false); // STATE

  // Tracks the position of the tooltip relative to the item.
  // When you move your mouse over the item, it calculates the position of the tooltip based on the item's position.
  const [tooltipPosition, setTooltipPosition] = useState({ top: 0, left: 0 }); // STATE


  // Function that runs when you hover over an item.
  const handleMouseEnter = (event) => {

    // When the mouse enters the item, it sets isHovered to true
    setIsHovered(true);

    // It calculates the position of the tooltip based on the item's position.
    const rect = event.currentTarget.getBoundingClientRect();

    // It sets the position of the tooltip relative to the item.
    setTooltipPosition({
      top: rect.top - 20,
      left: rect.left + rect.width / 2, 
    });
  };

  // Function that runs when you leave an item.
  const handleMouseLeave = () => {
    setIsHovered(false);
  };



  return (
    <div
      ref={setNodeRef} // Connects the HTML element to the drag-and-drop system.
      {...attributes}  // Spread Operator - Adds the draggable attributes to the HTML element.
      {...listeners}  // Spread Operator - Adds the draggable event listeners to the HTML element.
      className="item-container" 
      onMouseEnter={handleMouseEnter} // Runs the handleMouseEnter function when the mouse enters the item.
      onMouseLeave={handleMouseLeave} // Runs the handleMouseLeave function when the mouse leaves the item.
    >
      {/* Displays the item's icon */}
      <img src={icon} alt={name} className="item" />

      {/* Displays the items info if hovered*/}
      {isHovered && (
        <div
          className="tooltip"
          style={{
            top: `${tooltipPosition.top}px`,
            left: `${tooltipPosition.left}px`,
            transform: 'translate(-50%, -100%)',
          }}
        >
          <p className="tooltip-name">{name}</p>
          <p>Type: {category}</p>
          <p>
            {/* Shows the item's rarity text with a color based on how rare it is (green, blue, purple, or white by default) */}
            Rarity: <span style={{ color: rarityColors[rarity.toLowerCase()] || 'white' }}>{rarity}</span>
          </p>
          <p>{stats}</p>
        </div>
      )}
    </div>
  );
};

export default Item;