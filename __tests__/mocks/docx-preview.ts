// Mock for docx-preview — simulates DOCX rendering in tests

import type { Options } from "docx-preview";

export const defaultOptions: Options = {
  inWrapper: true,
  hideWrapperOnPrint: false,
  ignoreWidth: false,
  ignoreHeight: false,
  ignoreFonts: false,
  breakPages: true,
  debug: false,
  experimental: false,
  className: "docx",
  trimXmlDeclaration: true,
  renderHeaders: true,
  renderFooters: true,
  renderFootnotes: true,
  renderEndnotes: true,
  ignoreLastRenderedPageBreak: true,
  useBase64URL: false,
  renderChanges: false,
  renderComments: false,
  renderAltChunks: true,
};

/**
 * Mock renderAsync — creates DOM elements simulating docx-preview output.
 * Each "page" is a <section> with the configured className.
 * When inWrapper is false (our default), sections are appended directly.
 */
export async function renderAsync(
  _data: Blob | ArrayBuffer | Uint8Array,
  bodyContainer: HTMLElement,
  _styleContainer?: HTMLElement,
  userOptions?: Partial<Options>,
): Promise<unknown> {
  const className = userOptions?.className || "docx";
  const inWrapper = userOptions?.inWrapper ?? true;

  // Simulate a 2-page document
  const page1 = document.createElement("section");
  page1.className = className;
  page1.style.width = "794px";
  page1.style.minHeight = "1123px";
  page1.innerHTML = `<article><p>Page 1 content</p><table><tr><td>Cell A</td><td>Cell B</td></tr></table></article>`;

  const page2 = document.createElement("section");
  page2.className = className;
  page2.style.width = "794px";
  page2.style.minHeight = "1123px";
  page2.innerHTML = `<article><p>Page 2 content</p><p>More text here</p></article>`;

  if (inWrapper) {
    const wrapper = document.createElement("div");
    wrapper.className = `${className}-wrapper`;
    wrapper.appendChild(page1);
    wrapper.appendChild(page2);
    bodyContainer.appendChild(wrapper);
  } else {
    bodyContainer.appendChild(page1);
    bodyContainer.appendChild(page2);
  }

  return {};
}

export async function parseAsync(
  _data: Blob | ArrayBuffer | Uint8Array,
  _options?: Partial<Options>,
): Promise<unknown> {
  return {};
}

export async function renderDocument(
  _document: unknown,
  bodyContainer: HTMLElement,
  _styleContainer?: HTMLElement,
  userOptions?: Partial<Options>,
): Promise<void> {
  await renderAsync(new ArrayBuffer(0), bodyContainer, _styleContainer, userOptions);
}
