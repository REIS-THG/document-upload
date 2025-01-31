import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Upload } from "lucide-react";
import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { toast } from "sonner";

interface UploadDialogProps {
  open: boolean;
  onClose: () => void;
  onUpload: (file: File) => void;
}

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ACCEPTED_FILE_TYPES = {
  'application/pdf': ['.pdf'],
  'application/vnd.ms-excel': ['.xls'],
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
  'text/csv': ['.csv']
};

export function UploadDialog({ open, onClose, onUpload }: UploadDialogProps) {
  const [isDragging, setIsDragging] = useState(false);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file.size > MAX_FILE_SIZE) {
      toast.error("File size must be less than 10MB");
      return;
    }
    onUpload(file);
    onClose();
  }, [onUpload, onClose]);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: ACCEPTED_FILE_TYPES,
    maxFiles: 1,
    onDragEnter: () => setIsDragging(true),
    onDragLeave: () => setIsDragging(false),
  });

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Upload Document</DialogTitle>
        </DialogHeader>
        <div
          {...getRootProps()}
          className={`
            mt-4 p-8 border-2 border-dashed rounded-lg
            ${isDragging ? 'border-gray-400 bg-gray-50' : 'border-gray-200'}
            transition-colors duration-200 ease-in-out
            flex flex-col items-center justify-center gap-4
            cursor-pointer
          `}
        >
          <input {...getInputProps()} />
          <Upload className="w-8 h-8 text-gray-400" />
          <p className="text-sm text-gray-500 text-center">
            Drag files here or click to select files
            <br />
            <span className="text-xs">
              XLSX, XLS, CSV, and PDF files are allowed (max 10MB)
            </span>
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}