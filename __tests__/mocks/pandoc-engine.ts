// Mock for pandoc-engine — simulates Pandoc WASM conversion in tests

export async function initPandoc(
  onProgress?: (pct: number) => void
): Promise<unknown> {
  onProgress?.(50);
  onProgress?.(100);
  return {};
}

export function canPandocConvertDirect(fromExt: string, toFormat: string): boolean {
  const supported: Record<string, Set<string>> = {
    docx: new Set(["html", "txt", "md"]),
    doc: new Set(["html", "txt", "md"]),
    html: new Set(["docx", "txt", "md"]),
    htm: new Set(["docx", "txt", "md"]),
    txt: new Set(["html", "docx", "md"]),
    md: new Set(["html", "docx", "txt"]),
    markdown: new Set(["html", "docx", "txt"]),
  };
  return supported[fromExt]?.has(toFormat) ?? false;
}

export async function pandocConvert(
  inputFile: File,
  toFormat: string,
  onProgress: (pct: number) => void
): Promise<{ blob: Blob; ext: string }> {
  onProgress(10);

  const content = await inputFile.text();
  onProgress(50);

  // Simple mock conversions
  let outputContent: string;
  let mime: string;

  switch (toFormat) {
    case "html": {
      const title = inputFile.name.replace(/\.[^.]+$/, "");
      outputContent = `<!DOCTYPE html>\n<html><head><title>${title}</title></head><body><p>${content}</p></body></html>`;
      mime = "text/html";
      break;
    }
    case "txt": {
      outputContent = content.replace(/<[^>]+>/g, "");
      mime = "text/plain";
      break;
    }
    case "md": {
      outputContent = content.replace(/<[^>]+>/g, "");
      mime = "text/markdown";
      break;
    }
    case "docx": {
      // For DOCX, produce a minimal zip-like blob (PK header)
      const encoder = new TextEncoder();
      const pkHeader = new Uint8Array([0x50, 0x4b, 0x03, 0x04]);
      const contentBytes = encoder.encode(content);
      const combined = new Uint8Array(pkHeader.length + contentBytes.length);
      combined.set(pkHeader, 0);
      combined.set(contentBytes, pkHeader.length);
      onProgress(100);
      return {
        blob: new Blob([combined], {
          type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        }),
        ext: "docx",
      };
    }
    default:
      outputContent = content;
      mime = "application/octet-stream";
  }

  onProgress(100);
  return { blob: new Blob([outputContent], { type: mime }), ext: toFormat };
}

export async function pandocToHtmlWithMedia(
  inputFile: File,
  onProgress: (pct: number) => void
): Promise<string> {
  onProgress(10);
  const content = await inputFile.text();
  onProgress(50);

  const title = inputFile.name.replace(/\.[^.]+$/, "");
  // Simulate Pandoc HTML output with embedded table and image
  const html = `<!DOCTYPE html>
<html><head><title>${title}</title></head>
<body>
<h1>${title}</h1>
<p>${content}</p>
<table><thead><tr><th>Col 1</th><th>Col 2</th></tr></thead>
<tbody><tr><td>A</td><td>B</td></tr></tbody></table>
<img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAC0lEQVQI12NgAAIABQABNl7BcQAAAABJRU5ErkJggg==" alt="test" />
</body></html>`;

  onProgress(100);
  return html;
}

export async function pandocConvertHtml(
  htmlContent: string,
  toFormat: string,
  onProgress: (pct: number) => void
): Promise<{ blob: Blob; ext: string }> {
  onProgress(10);

  let outputContent: string;
  let mime: string;

  switch (toFormat) {
    case "txt": {
      // Strip HTML tags
      outputContent = htmlContent.replace(/<[^>]+>/g, "").trim();
      mime = "text/plain";
      break;
    }
    case "md": {
      outputContent = htmlContent.replace(/<[^>]+>/g, "").trim();
      mime = "text/markdown";
      break;
    }
    case "html": {
      outputContent = htmlContent;
      mime = "text/html";
      break;
    }
    case "docx": {
      const encoder = new TextEncoder();
      const pkHeader = new Uint8Array([0x50, 0x4b, 0x03, 0x04]);
      const stripped = htmlContent.replace(/<[^>]+>/g, "");
      const contentBytes = encoder.encode(stripped);
      const combined = new Uint8Array(pkHeader.length + contentBytes.length);
      combined.set(pkHeader, 0);
      combined.set(contentBytes, pkHeader.length);
      onProgress(100);
      return {
        blob: new Blob([combined], {
          type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        }),
        ext: "docx",
      };
    }
    default:
      outputContent = htmlContent;
      mime = "application/octet-stream";
  }

  onProgress(100);
  return { blob: new Blob([outputContent], { type: mime }), ext: toFormat };
}
