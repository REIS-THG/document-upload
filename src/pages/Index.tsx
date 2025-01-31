import { useState } from "react";
import { DocumentCard } from "@/components/DocumentCard";
import { UploadDialog } from "@/components/UploadDialog";
import { DocumentPreview } from "@/components/DocumentPreview";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { toast } from "sonner";

interface Document {
  id: string;
  title: string;
  uploadDate: Date;
  pages: Array<{
    content: string;
    extractedData: string;
  }>;
}

const MAX_DOCUMENTS = 9;

export default function Index() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);

  const handleUpload = (file: File) => {
    if (documents.length >= MAX_DOCUMENTS) {
      toast.error("Maximum number of documents reached");
      return;
    }

    // In a real app, you would process the file here
    const newDocument: Document = {
      id: Math.random().toString(),
      title: file.name,
      uploadDate: new Date(),
      pages: [
        {
          content: "Sample content for page 1",
          extractedData: "Sample extracted data for page 1"
        },
        {
          content: "Sample content for page 2",
          extractedData: "Sample extracted data for page 2"
        }
      ]
    };

    setDocuments((prev) => [...prev, newDocument]);
    toast.success("Document uploaded successfully");
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-semibold text-gray-900">Documents</h1>
          <Button
            onClick={() => setIsUploadOpen(true)}
            disabled={documents.length >= MAX_DOCUMENTS}
          >
            <Plus className="w-4 h-4 mr-2" />
            Upload Document
          </Button>
        </div>

        {documents.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">No documents uploaded yet</p>
          </div>
        ) : (
          <div className="document-grid">
            {documents.map((doc) => (
              <DocumentCard
                key={doc.id}
                title={doc.title}
                uploadDate={doc.uploadDate}
                onClick={() => setSelectedDocument(doc)}
              />
            ))}
          </div>
        )}

        <UploadDialog
          open={isUploadOpen}
          onClose={() => setIsUploadOpen(false)}
          onUpload={handleUpload}
        />

        {selectedDocument && (
          <DocumentPreview
            open={!!selectedDocument}
            onClose={() => setSelectedDocument(null)}
            document={selectedDocument}
          />
        )}
      </div>
    </div>
  );
}