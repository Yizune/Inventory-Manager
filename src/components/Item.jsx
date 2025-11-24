import { useState } from 'react';
import { useDraggable } from '@dnd-kit/core';

const rarityColors = {
  common: 'green',
  uncommon: 'blue',
  rare: 'purple',
};

const Item = ({ id, name, icon, category, rarity, stats }) => {
  const { attributes, listeners, setNodeRef } = useDraggable({ id });
  const [isHovered, setIsHovered] = useState(false); 
  const [tooltipPosition, setTooltipPosition] = useState({ top: 0, left: 0 }); 

  const handleMouseEnter = (event) => {
    setIsHovered(true);
    const rect = event.currentTarget.getBoundingClientRect();
    setTooltipPosition({
      top: rect.top - 20,
      left: rect.left + rect.width / 2, 
    });
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  return (
    <div
      ref={setNodeRef} 
      {...attributes}  
      {...listeners}  
      className="item-container" 
      onMouseEnter={handleMouseEnter} 
      onMouseLeave={handleMouseLeave} 
    >
      <img src={icon} alt={name} className="item" />
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
            Rarity: <span style={{ color: rarityColors[rarity.toLowerCase()] || 'white' }}>{rarity}</span>
          </p>
          <p>{stats}</p>
        </div>
      )}
    </div>
  );
};

export default Item;