interface DropZoneProps {
  onDrop: (e: React.DragEvent<HTMLDivElement>) => void;
}

export const DropZone = ({ onDrop }: DropZoneProps) => {
  return (
    <div 
      className="border-2 border-dashed border-gray-300 p-4 text-center mb-4 mt-4 rounded-lg hover:bg-gray-50 transition-colors duration-200"
      onDragOver={(e) => e.preventDefault()}
      onDrop={onDrop}
    >
      גרור ושחרר תמונות או סרטונים כאן
    </div>
  );
};