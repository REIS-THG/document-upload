import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";

interface DocumentPreviewProps {
  open: boolean;
  onClose: () => void;
  document: {
    title: string;
    pages: Array<{
      content: string;
      extractedData: string;
    }>;
  };
}

export function DocumentPreview({ open, onClose, document }: DocumentPreviewProps) {
  const [currentPage, setCurrentPage] = useState(0);

  const goToNextPage = () => {
    setCurrentPage((prev) => 
      prev < document.pages.length - 1 ? prev + 1 : prev
    );
  };

  const goToPrevPage = () => {
    setCurrentPage((prev) => prev > 0 ? prev - 1 : prev);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl h-[80vh]">
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">{document.title}</h2>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={goToPrevPage}
                disabled={currentPage === 0}
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <span className="text-sm">
                Page {currentPage + 1} of {document.pages.length}
              </span>
              <Button
                variant="outline"
                size="icon"
                onClick={goToNextPage}
                disabled={currentPage === document.pages.length - 1}
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
          
          <div className="flex-1 overflow-auto">
            <div className="grid grid-cols-2 gap-6 h-full">
              <div className="bg-gray-50 rounded-lg p-6 overflow-auto">
                <h3 className="text-sm font-medium mb-2">Document Content</h3>
                <div className="prose prose-sm max-w-none">
                  {document.pages[currentPage].content}
                </div>
              </div>
              <div className="bg-gray-50 rounded-lg p-6 overflow-auto">
                <h3 className="text-sm font-medium mb-2">Extracted Data</h3>
                <div className="prose prose-sm max-w-none">
                  {document.pages[currentPage].extractedData}
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}