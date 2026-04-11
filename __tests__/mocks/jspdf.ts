// Mock for jspdf — simulates PDF generation in tests

/** Mock jsPDF class that tracks pages and produces a fake PDF blob */
class MockJsPDF {
  private pages: number = 1;

  addPage(): MockJsPDF {
    this.pages++;
    return this;
  }

  addImage(): MockJsPDF {
    return this;
  }

  output(type?: string): unknown {
    // PDF magic bytes: %PDF-1.4
    const header = new Uint8Array([0x25, 0x50, 0x44, 0x46, 0x2d, 0x31, 0x2e, 0x34]);
    const content = new TextEncoder().encode(`\nMock PDF with ${this.pages} pages\n%%EOF`);
    const combined = new Uint8Array(header.length + content.length);
    combined.set(header, 0);
    combined.set(content, header.length);

    if (type === "blob") {
      return new Blob([combined], { type: "application/pdf" });
    }
    if (type === "arraybuffer") {
      return combined.buffer;
    }
    // Default: return as string
    return new TextDecoder().decode(combined);
  }

  internal = {
    events: {},
    scaleFactor: 1,
    pageSize: {
      width: 210,
      getWidth: () => 210,
      height: 297,
      getHeight: () => 297,
    },
    pages: [1],
    getEncryptor: () => (data: string) => data,
  };
}

export { MockJsPDF as jsPDF };
