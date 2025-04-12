import * as pdfjsLib from "pdfjs-dist";
import "pdfjs-dist/build/pdf.worker";
// import { jsPDF } from "jspdf";
// make a global worker to be used by pdfjs
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

// Function to generate a PDF from text
// export const generatePDF = async (text) => {
//   const doc = new jsPDF();
//   const maxWidth = 190;
//   const textLines = doc.splitTextToSize(text, maxWidth);
//   doc.text(textLines, 10, 10);
//   const pdfBlob = doc.output("blob");

//   return pdfBlob;
// };

// Function to convert a PDF to text
export async function pdfToText(pdfUrl) {
  const pdf = await pdfjsLib.getDocument(pdfUrl).promise;
  let fullText = "";

  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const textContent = await page.getTextContent();
    const pageText = textContent.items.map((item) => item.str).join(" ");
    fullText += pageText + "\n";
  }
  return fullText;
}
