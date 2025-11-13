
// This uses the pdfjs-dist library loaded from the CDN in index.html
// The global object `pdfjsLib` is available on the `window` object.

declare const pdfjsLib: any;

/**
 * Extracts text content from a given PDF file.
 * @param file The PDF file to process.
 * @returns A promise that resolves with the extracted text content as a single string.
 */
export const extractTextFromPDF = async (file: File): Promise<string> => {
  const fileReader = new FileReader();

  return new Promise((resolve, reject) => {
    fileReader.onload = async (event) => {
      if (!event.target?.result) {
        return reject(new Error('Failed to read file.'));
      }

      try {
        const typedarray = new Uint8Array(event.target.result as ArrayBuffer);
        const pdf = await pdfjsLib.getDocument(typedarray).promise;
        let fullText = '';

        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const textContent = await page.getTextContent();
          const pageText = textContent.items.map((item: any) => item.str).join(' ');
          fullText += pageText + '\n\n';
        }

        resolve(fullText);
      } catch (error) {
        console.error('Error processing PDF:', error);
        reject(new Error('Could not parse the PDF file. It might be corrupted or in an unsupported format.'));
      }
    };

    fileReader.onerror = () => {
      reject(new Error('Error reading the file.'));
    };

    fileReader.readAsArrayBuffer(file);
  });
};