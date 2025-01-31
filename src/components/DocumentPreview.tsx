import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ChevronUp, ChevronDown } from "lucide-react";
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
          </div>
          
          <div className="flex-1 overflow-hidden">
            <div className="flex h-full gap-4">
              {/* Main content area */}
              <div className="flex-1 bg-gray-50 rounded-lg p-6 overflow-auto">
                <h3 className="text-sm font-medium mb-2">Document Content</h3>
                <div className="prose prose-sm max-w-none">
                  {document.pages[currentPage].content}
                </div>
              </div>

              {/* Right sidebar with pagination */}
              <div className="w-16 flex flex-col items-center justify-between bg-gray-100 rounded-lg py-4">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={goToPrevPage}
                  disabled={currentPage === 0}
                  className="rounded-full"
                >
                  <ChevronUp className="w-4 h-4" />
                </Button>

                <div className="flex flex-col items-center gap-2">
                  <span className="text-sm font-medium">
                    {currentPage + 1}
                  </span>
                  <div className="h-[1px] w-6 bg-gray-300" />
                  <span className="text-sm text-gray-500">
                    {document.pages.length}
                  </span>
                </div>

                <Button
                  variant="ghost"
                  size="icon"
                  onClick={goToNextPage}
                  disabled={currentPage === document.pages.length - 1}
                  className="rounded-full"
                >
                  <ChevronDown className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}