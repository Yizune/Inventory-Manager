import { useDroppable } from '@dnd-kit/core';
import Item from './Item';

function Backpack({ items, activeDragItemId }) { 
  return (
    <div className="backpack-container">
      <div className="inventory-title" >
        Backpack
      </div>
      <div className="inventory-grid backpack-grid" >
        {items.map((item, index) => {
          const { setNodeRef, isOver } = useDroppable({ id: `backpack-slot-${index}` });
          return (
            <div
              key={index}
              ref={setNodeRef}
              className={`inventory-slot ${isOver ? 'hover-effect' : ''}`}
            >
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
        })}
      </div>
    </div>
  );
}

export default Backpack;
