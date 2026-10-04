// Loads pdf.js together with its worker. Always imported on demand (see PdfReader), so the library only
// travels to the browser when someone opens a document.
import * as pdfjs from 'pdfjs-dist/legacy/build/pdf';

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/legacy/build/pdf.worker.min.js',
  import.meta.url
).toString();

export default pdfjs;
