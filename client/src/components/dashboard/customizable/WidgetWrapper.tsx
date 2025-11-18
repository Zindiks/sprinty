import { ReactNode } from 'react';
import { Draggable } from '@hello-pangea/dnd';
import { GripVertical, X, Maximize2, Minimize2 } from 'lucide-react';

interface WidgetWrapperProps {
  id: string;
  index: number;
  children: ReactNode;
  onRemove?: () => void;
  onResize?: (size: 'small' | 'medium' | 'large') => void;
  currentSize?: 'small' | 'medium' | 'large';
  isDraggingEnabled?: boolean;
}

const WidgetWrapper = ({
  id,
  index,
  children,
  onRemove,
  onResize,
  currentSize = 'medium',
  isDraggingEnabled = true,
}: WidgetWrapperProps) => {
  const sizeClasses = {
    small: 'col-span-1 row-span-1',
    medium: 'col-span-2 row-span-1',
    large: 'col-span-3 row-span-2',
  };

  const cycleSize = () => {
    if (!onResize) return;

    const sizes: ('small' | 'medium' | 'large')[] = ['small', 'medium', 'large'];
    const currentIndex = sizes.indexOf(currentSize);
    const nextIndex = (currentIndex + 1) % sizes.length;
    onResize(sizes[nextIndex]);
  };

  return (
    <Draggable draggableId={id} index={index} isDragDisabled={!isDraggingEnabled}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          className={`${sizeClasses[currentSize]} ${
            snapshot.isDragging ? 'opacity-70 rotate-2' : ''
          } transition-all`}
        >
          <div className="h-full bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden flex flex-col">
            {/* Widget Header with Drag Handle */}
            <div className="flex items-center justify-between px-4 py-2 bg-gray-50 border-b border-gray-200">
              <div
                {...provided.dragHandleProps}
                className={`flex items-center gap-2 ${
                  isDraggingEnabled ? 'cursor-grab active:cursor-grabbing' : 'cursor-default'
                }`}
              >
                {isDraggingEnabled && <GripVertical className="w-4 h-4 text-gray-400" />}
                <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                  Widget
                </span>
              </div>

              <div className="flex items-center gap-2">
                {/* Resize Button */}
                {onResize && (
                  <button
                    onClick={cycleSize}
                    className="p-1 hover:bg-gray-200 rounded transition"
                    title="Resize widget"
                  >
                    {currentSize === 'small' && <Maximize2 className="w-4 h-4 text-gray-600" />}
                    {currentSize === 'medium' && <Maximize2 className="w-4 h-4 text-gray-600" />}
                    {currentSize === 'large' && <Minimize2 className="w-4 h-4 text-gray-600" />}
                  </button>
                )}

                {/* Remove Button */}
                {onRemove && (
                  <button
                    onClick={onRemove}
                    className="p-1 hover:bg-red-100 rounded transition"
                    title="Remove widget"
                  >
                    <X className="w-4 h-4 text-red-600" />
                  </button>
                )}
              </div>
            </div>

            {/* Widget Content */}
            <div className="flex-1 overflow-auto p-4">{children}</div>
          </div>
        </div>
      )}
    </Draggable>
  );
};

export default WidgetWrapper;
