// Mock for pdfjs-dist — simulates the PDF.js API for testing

export const GlobalWorkerOptions = {
  workerSrc: "",
};

interface MockTextItem {
  str: string;
  dir: string;
  transform: number[];
  width: number;
  height: number;
  fontName: string;
  hasEOL: boolean;
}

interface MockTextContent {
  items: MockTextItem[];
}

interface MockViewport {
  width: number;
  height: number;
}

interface MockOperatorList {
  fnArray: number[];
  argsArray: unknown[][];
}

interface MockPage {
  getTextContent: () => Promise<MockTextContent>;
  getViewport: (params: { scale: number }) => MockViewport;
  render: (params: unknown) => { promise: Promise<void> };
  getOperatorList: () => Promise<MockOperatorList>;
  objs: {
    get: (name: string, callback: (obj: unknown) => void) => void;
  };
}

interface MockPdf {
  numPages: number;
  getPage: (num: number) => Promise<MockPage>;
}

export function getDocument(params: { data: Uint8Array; [key: string]: unknown }) {
  // Create a mock PDF based on the input data
  const text = new TextDecoder().decode(params.data);
  const lines = text.split("\n").filter(Boolean);

  const mockPdf: MockPdf = {
    numPages: 1,
    getPage: async () => ({
      getTextContent: async () => ({
        items: lines.map((line, i) => ({
          str: line,
          dir: "ltr",
          // transform: [scaleX, skewX, skewY, scaleY, translateX, translateY]
          // Use fontSize 11 (normal text), Y decreasing per line
          transform: [11, 0, 0, 11, 50, 800 - i * 16],
          width: line.length * 6,
          height: 11,
          fontName: "Helvetica",
          hasEOL: true,
        })),
      }),
      getViewport: ({ scale }: { scale: number }) => ({
        width: 595 * scale,
        height: 842 * scale,
      }),
      render: () => ({ promise: Promise.resolve() }),
      getOperatorList: async () => ({
        fnArray: [],
        argsArray: [],
      }),
      objs: {
        get: (_name: string, callback: (obj: unknown) => void) => {
          // No objects in mock
          callback(null);
        },
      },
    }),
  };

  return { promise: Promise.resolve(mockPdf) };
}
