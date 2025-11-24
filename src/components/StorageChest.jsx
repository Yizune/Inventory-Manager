import { useDroppable } from '@dnd-kit/core';
import Item from './Item';
import attackIcon from '../assets/attack.png';
import defenseIcon from '../assets/defense.png';
import otherIcon from '../assets/accesories.png';
import allIcon from '../assets/infinity.png';

function StorageChest({
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
          className={`filter-button ${categoryFilter === 'All' ? 'active' : ''}`} 
          onClick={() => handleCategoryFilter("All")}
        >
          <img src={allIcon} alt="All" />
        </button>
        <button 
          className={`filter-button ${categoryFilter === 'Attack' ? 'active' : ''}`} 
          onClick={() => handleCategoryFilter("Attack")}
        >
          <img src={attackIcon} alt="Attack" />
        </button>
        <button 
          className={`filter-button ${categoryFilter === 'Defense' ? 'active' : ''}`} 
          onClick={() => handleCategoryFilter("Defense")}
        >
          <img src={defenseIcon} alt="Defense" />
        </button>
        <button 
          className={`filter-button ${categoryFilter === 'Other' ? 'active' : ''}`} 
          onClick={() => handleCategoryFilter("Other")}
        >
          <img src={otherIcon} alt="Other" />
        </button>

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

      <div className="inventory-grid storage-grid">
        {items.map((item, index) => ( 
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