import { useState, useEffect, useRef, useCallback, useMemo } from 'react'
import { Document, Page, pdfjs } from 'react-pdf'
import {
  InsertDriveFileOutlined,
  Close,
  CloudUpload
} from '@mui/icons-material'
import {
  Modal,
  Box,
  Button,
  Typography,
  IconButton,
  styled
} from '@mui/material'

import './App.css'

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`

const StyledModal = styled(Modal)({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center'
})

const ModalContent = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  boxShadow: theme.shadows[5],
  padding: theme.spacing(4),
  borderRadius: theme.shape.borderRadius,
  maxWidth: '90vw',
  maxHeight: '90vh',
  overflow: 'hidden'
}))

function App () {
  const [documents, setDocuments] = useState([])
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false)
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false)
  const [selectedDoc, setSelectedDoc] = useState(null)
  const [numPages, setNumPages] = useState(null)
  const pdfContainerRef = useRef(null)
  const [pdfWidth, setPdfWidth] = useState(600)

  useEffect(() => {
    const savedDocs = JSON.parse(localStorage.getItem('documents')) || []
    setDocuments(savedDocs)
  }, [])

  useEffect(() => {
    localStorage.setItem('documents', JSON.stringify(documents))
  }, [documents])

  useEffect(() => {
    if (pdfContainerRef.current) {
      setPdfWidth(pdfContainerRef.current.clientWidth)
    }
  }, [isDetailsModalOpen])

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages)
  }

  const onDocumentLoadError = error => {
    console.error('PDF Load Error:', error)
  }

  const handleDocClick = index => {
    setSelectedDoc(index)
    setIsDetailsModalOpen(true)
  }

  const handleFileUpload = e => {
    const file = e.target.files[0]
    if (!file) return

    if (file.type !== 'application/pdf') {
      alert('Please upload a valid PDF file.')
      return
    }

    const fileURL = URL.createObjectURL(file)

    const newDocs = [
      ...documents,
      {
        name: file.name,
        date: new Date().toLocaleDateString(),
        content: fileURL
      }
    ]

    setDocuments(newDocs)
    setIsUploadModalOpen(false)
  }

  const generateExtractions = useCallback(() => {
    if (!numPages) return []

    return Array.from({ length: Math.min(4, numPages) }).map((_, i) => ({
      id: i,
      page: i + 1
    }))
  }, [numPages])

  const extractions = useMemo(
    () => generateExtractions(),
    [generateExtractions]
  )

  const scrollToPage = pageNumber => {
    if (!pdfContainerRef.current) return

    const pageElement = pdfContainerRef.current.querySelector(
      `[data-page-number="${pageNumber}"]`
    )

    if (pageElement) {
      pdfContainerRef.current.scrollTo({
        top: pageElement.offsetTop - pdfContainerRef.current.offsetTop,
        behavior: 'smooth'
      })
    } else {
      console.warn(`Page ${pageNumber} not found`)
    }
  }

  return (
    <div className='app' style={{ paddingInline: 50 }}>
      <Typography fontWeight={800} fontSize={30} textAlign='center' py={5}>
        Document Viewer
      </Typography>
      {/* Upload Button */}
      <Box display='flex' justifyContent='flex-end' p={2}>
        <Button
          variant='contained'
          startIcon={<CloudUpload />}
          onClick={() => setIsUploadModalOpen(true)}
        >
          Upload Document
        </Button>
      </Box>

      {/* Document Grid */}
      <div className='dashboard'>
        {documents.length === 0 ? (
          <Typography variant='h6' align='center' mt={4} color='textSecondary'>
            No documents uploaded yet.
          </Typography>
        ) : (
          documents.map((doc, index) => (
            <div
              key={index}
              className='document-box'
              onClick={() => handleDocClick(index)}
            >
              <InsertDriveFileOutlined className='doc-icon' />
              <h3>{doc?.name}</h3>
              <p>Uploaded On: {doc.date}</p>
            </div>
          ))
        )}
      </div>

      {/* Upload Modal */}
      <StyledModal
        open={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
      >
        <ModalContent>
          <Box display='flex' flexDirection='column' gap={3}>
            <Typography variant='h5'>Upload Document</Typography>
            <label htmlFor='pdf-upload'>
              <input
                id='pdf-upload'
                type='file'
                accept='application/pdf'
                onChange={handleFileUpload}
                hidden
              />
              <Button
                component='span'
                variant='outlined'
                startIcon={<CloudUpload />}
                sx={{
                  p: 4,
                  borderStyle: 'dashed',
                  width: '100%'
                }}
              >
                Drag PDF here or click to upload
              </Button>
            </label>
            <Button
              variant='contained'
              onClick={() => setIsUploadModalOpen(false)}
            >
              Cancel
            </Button>
          </Box>
        </ModalContent>
      </StyledModal>

      {/* Document Details Modal */}
      <StyledModal
        open={isDetailsModalOpen}
        onClose={() => setIsDetailsModalOpen(false)}
      >
        <ModalContent sx={{ width: '80vw', height: '80vh' }}>
          {documents[selectedDoc] && (
            <Box display='flex' flexDirection='column' height='100%'>
              <Box
                display='flex'
                justifyContent='space-between'
                alignItems='center'
                mb={2}
              >
                <Typography variant='h5'>
                  {documents[selectedDoc].name}
                </Typography>
                <IconButton onClick={() => setIsDetailsModalOpen(false)}>
                  <Close />
                </IconButton>
              </Box>

              <Box display='flex' gap={3} flexGrow={1} overflow='hidden'>
                <Box
                  flex={1}
                  overflow='auto'
                  ref={pdfContainerRef}
                  sx={{ border: '1px solid #ddd', borderRadius: 1 }}
                >
                  <Document
                    file={documents[selectedDoc].content}
                    onLoadSuccess={onDocumentLoadSuccess}
                    onLoadError={onDocumentLoadError}
                  >
                    {numPages &&
                      Array.from({ length: numPages }).map((_, index) => (
                        <Page
                          key={`page_${index + 1}`}
                          pageNumber={index + 1}
                          width={pdfWidth}
                        />
                      ))}
                  </Document>
                </Box>

                <Box width={300} overflow='auto'>
                  <Typography variant='h6' mb={2}>
                    Extractions
                  </Typography>
                  {extractions.map(ext => (
                    <Box
                      key={ext.id}
                      display='flex'
                      justifyContent='space-between'
                      alignItems='center'
                      p={1.5}
                      mb={1}
                      sx={{ borderBottom: '1px solid', borderColor: 'divider' }}
                    >
                      <Typography variant='body2'>
                        Extraction {ext.id + 1} - Page {ext.page}
                      </Typography>
                      <Button
                        variant='outlined'
                        size='small'
                        onClick={() => scrollToPage(ext.page)}
                      >
                        Go To Page
                      </Button>
                    </Box>
                  ))}
                </Box>
              </Box>
            </Box>
          )}
        </ModalContent>
      </StyledModal>
    </div>
  )
}

export default App
