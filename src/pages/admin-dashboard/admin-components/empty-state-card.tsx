import emptyStateIcon from "../../../assets/icons/empty-state.svg";

interface EmptyStateCardProps {
  title: string;
  message: string;
}

export function EmptyStateCard({ title, message }: EmptyStateCardProps) {
  return (
    <div className="w-full border border-[#E8E8E8] flex flex-col items-center justify-center px-4 py-12 rounded-md mt-6">
      <div className="flex flex-col items-center gap-4">
        {/* Empty State Icon */}
        <div className="w-36 h-36 flex items-center justify-center">
          <img 
            src={emptyStateIcon} 
            alt="Empty state" 
            className="w-full h-full object-contain"
          />
        </div>
        
        {/* Empty State Message */}
        <div className="text-center">
          <p className="text-[#6D6D6D] text-sm font-medium">{message}</p>
        </div>
      </div>
    </div>
  );
}
