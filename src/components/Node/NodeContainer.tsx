import React, { useState, useCallback } from 'react';

interface Position {
  x: number;
  y: number;
}

interface Size {
  width: number;
  height: number;
}

interface NodeContainerProps {
  id: string;
  position: Position;
  size: Size;
  children?: React.ReactNode;
  onPositionChange?: (id: string, newPosition: Position) => void;
  onDelete?: (id: string) => void;
  selected?: boolean;
}

const NodeContainer: React.FC<NodeContainerProps> = ({
  id,
  position,
  size,
  children,
  onPositionChange,
  onDelete,
  selected = false,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState<Position | null>(null);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    setIsDragging(true);
    setDragStart({
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    });
  }, [position]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDragging || !dragStart) return;

    const newPosition = {
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    };

    onPositionChange?.(id, newPosition);
  }, [id, isDragging, dragStart, onPositionChange]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
    setDragStart(null);
  }, []);

  const handleDelete = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete?.(id);
  }, [id, onDelete]);

  return (
    <div
      className={`
        absolute cursor-move
        transition-shadow duration-200
        ${isDragging ? 'shadow-lg' : 'shadow-md'}
        ${selected ? 'ring-2 ring-emerald-400' : ''}
      `}
      style={{
        transform: `translate(${position.x}px, ${position.y}px)`,
        width: size.width,
        height: size.height,
      }}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      <div className="relative w-full h-full">
        {children}
        <button
          className="
            absolute -top-2 -right-2
            w-6 h-6
            flex items-center justify-center
            bg-red-500 text-white
            rounded-full shadow-md
            opacity-0 group-hover:opacity-100
            hover:bg-red-600
            transition-all duration-200
          "
          onClick={handleDelete}
        >
          ×
        </button>
      </div>
    </div>
  );
};

export default NodeContainer; 