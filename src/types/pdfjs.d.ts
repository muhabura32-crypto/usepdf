declare module 'pdfjs-dist' {
  export const getDocument: any;
  export const GlobalWorkerOptions: {
    workerSrc: string;
  };
  export interface PDFDocumentProxy {
    numPages: number;
    getPage: (pageNumber: number) => Promise<PDFPageProxy>;
    destroy(): void;
  }
  export interface PDFPageProxy {
    getViewport: (options: { scale: number }) => PDFPageViewport;
    render: (options: PDFRenderContext) => { promise: Promise<void> };
  }
  export interface PDFPageViewport {
    width: number;
    height: number;
  }
  export interface PDFRenderContext {
    canvasContext: CanvasRenderingContext2D;
    viewport: PDFPageViewport;
  }
}
