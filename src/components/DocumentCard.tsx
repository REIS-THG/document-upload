import { format } from "date-fns";
import { FileText } from "lucide-react";

interface DocumentCardProps {
  title: string;
  uploadDate: Date;
  onClick: () => void;
}

export function DocumentCard({ title, uploadDate, onClick }: DocumentCardProps) {
  return (
    <div 
      onClick={onClick}
      className="document-card cursor-pointer group"
    >
      <div className="flex items-center justify-center mb-4">
        <FileText className="w-8 h-8 text-gray-400 group-hover:text-gray-600 transition-colors" />
      </div>
      <h3 className="text-lg font-medium text-gray-900 mb-2 truncate">
        {title}
      </h3>
      <p className="text-sm text-gray-500">
        Uploaded on: {format(uploadDate, "MMM d, yyyy")}
      </p>
    </div>
  );
}