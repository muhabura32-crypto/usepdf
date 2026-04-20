# PDFtools - Free Online PDF Tools

Fast, private, and completely free PDF tools. Merge, split, compress, and convert PDF files instantly. 100% client-side processing - your files never leave your device.

![PDFtools](https://pdftools.com/og-image.png)

## Features

- **Merge PDF** - Combine multiple PDFs into a single file
- **Compress PDF** - Reduce PDF file size while maintaining quality
- **Split PDF** - Extract pages or split into multiple files
- **PDF to JPG** - Convert PDF pages to high-quality images
- **PDF to Word** - Convert PDF to editable Word documents

## Why PDFtools?

- ✅ **100% Free** - No hidden fees, no premium tier
- ✅ **Private** - Files processed locally in your browser (except PDF to Word)
- ✅ **Fast** - Instant processing with no upload wait times
- ✅ **No Registration** - Start using immediately, no account required
- ✅ **Cross-Platform** - Works on desktop, tablet, and mobile

## Tech Stack

- **Next.js 15** - React framework with App Router
- **React 19** - UI library
- **TypeScript** - Type safety
- **Tailwind CSS** - Modern styling
- **pdf-lib** - Client-side PDF manipulation
- **PDF.js** - PDF rendering and conversion

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or pnpm

### Installation

```bash
npm install
```

### Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for Production

```bash
npm run build
```

### Start Production Server

```bash
npm run start
```

## Deployment

### Vercel (Recommended)

Deploy to Vercel with one click:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/muhabura32-crypto/pdftool)

### Docker

```bash
docker build -t pdftools .
docker run -p 3000:3000 pdftools
```

## Privacy

All PDF processing (except PDF to Word conversion) happens entirely in your browser using WebAssembly. Your files are never uploaded to any server. For PDF to Word conversion, files are processed securely and deleted immediately after conversion.

## License

MIT License - feel free to use for personal and commercial projects.

## Star History

[![Star History Chart](https://api.star-history.com/svg?repos=muhabura32-crypto/pdftool&type=Date)](https://star-history.com/#muhabura32-crypto/pdftool&Date)

---

Made with ❤️ for free PDF tools
