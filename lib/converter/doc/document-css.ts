// Shared CSS stylesheet for document rendering.
// Used by both:
//  1. DOCX → HTML output (embedded in <head>)
//  2. DOCX → Image screenshot (injected into render container)
//
// Designed to faithfully reproduce DOCX formatting in HTML:
//  - Page-like appearance with max-width and margins
//  - Proper table styling (bordered data tables, borderless layout tables)
//  - Text alignment preservation from Pandoc's output
//  - Professional typography and spacing

/**
 * Full document stylesheet for standalone HTML files.
 * Includes body/page styling, typography, tables, images, etc.
 */
export const DOCUMENT_FULL_CSS = `
/* ── Page Layout ── */
html {
  background: #f5f5f5;
}
body {
  max-width: 794px;
  margin: 20px auto;
  padding: 40px 50px;
  background: #ffffff;
  box-shadow: 0 1px 4px rgba(0,0,0,0.12);
  font-family: 'Segoe UI', 'Noto Sans', Tahoma, Geneva, Verdana, sans-serif;
  font-size: 14px;
  line-height: 1.65;
  color: #1a1a1a;
  -webkit-font-smoothing: antialiased;
}

/* ── Typography ── */
h1, h2, h3, h4, h5, h6 {
  margin-top: 1em;
  margin-bottom: 0.4em;
  color: #111;
  font-weight: 600;
  line-height: 1.3;
}
h1 { font-size: 20px; }
h2 { font-size: 18px; }
h3 { font-size: 16px; }
h4 { font-size: 15px; }
p {
  margin: 0.4em 0;
  orphans: 2;
  widows: 2;
}
/* Centered paragraphs (Pandoc adds style="text-align: center;") */
p[style*="text-align: center"], p[style*="text-align:center"] {
  text-align: center !important;
}

/* ── Lists ── */
ul, ol { padding-left: 2em; margin: 0.4em 0; }
li { margin: 0.15em 0; }

/* ── Tables ── */
table {
  border-collapse: collapse;
  margin: 0.8em 0;
  width: 100%;
  page-break-inside: avoid;
}
th, td {
  padding: 6px 10px;
  text-align: left;
  vertical-align: top;
}

/* Data tables: tables that have thead or th elements get full borders */
table:has(thead) th,
table:has(thead) td,
table:has(th) th,
table:has(th) td {
  border: 1px solid #666;
}
table:has(thead) th,
table:has(th) th {
  background-color: #f0f0f0;
  font-weight: 600;
  color: #222;
}

/* Layout/form tables: no thead/th = borderless, used for form-style key:value layouts */
table:not(:has(thead)):not(:has(th)) {
  border: none;
}
table:not(:has(thead)):not(:has(th)) td {
  border: none;
  padding: 2px 6px;
  vertical-align: top;
}

/* Fallback for browsers without :has() — border all tables, 
   but Pandoc data tables always have <thead> so this is safe */

/* ── Images ── */
img {
  max-width: 100%;
  height: auto;
  display: inline-block;
}
figure {
  margin: 0.8em 0;
  text-align: center;
}
figcaption {
  font-size: 12px;
  color: #666;
  margin-top: 0.3em;
  font-style: italic;
}

/* ── Code ── */
pre {
  background: #f6f8fa;
  padding: 12px;
  border-radius: 4px;
  overflow-x: auto;
  font-size: 13px;
  margin: 0.6em 0;
  border: 1px solid #e1e4e8;
}
code {
  font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
  font-size: 13px;
  background: #f0f0f0;
  padding: 2px 4px;
  border-radius: 3px;
}
pre code { background: none; padding: 0; }

/* ── Blockquote ── */
blockquote {
  border-left: 4px solid #ccc;
  margin: 0.6em 0;
  padding: 0.4em 1em;
  color: #444;
  background: #f9f9f9;
}

/* ── Links ── */
a { color: #0366d6; text-decoration: none; }
a:hover { text-decoration: underline; }

/* ── Horizontal Rule ── */
hr {
  border: none;
  border-top: 1px solid #ddd;
  margin: 1.5em 0;
}

/* ── Pandoc-specific: preserve inline styles for alignment ── */
[style*="text-align"] { text-align: inherit; }
.center, [align="center"] { text-align: center; }
.right, [align="right"] { text-align: right; }

/* ── Bold/Underline (Pandoc preserves these from DOCX) ── */
strong, b { font-weight: 700; }
u { text-decoration: underline; }
`;

/**
 * Scoped CSS for rendering inside a container (used by doc-to-image screenshot).
 * Same styles but scoped under .doc-render class.
 */
export const DOCUMENT_SCOPED_CSS = `
/* Reset */
.doc-render * { box-sizing: border-box; }

/* Typography */
.doc-render {
  font-family: 'Segoe UI', 'Noto Sans', Tahoma, Geneva, Verdana, sans-serif;
  font-size: 14px;
  line-height: 1.65;
  color: #1a1a1a;
}
.doc-render h1, .doc-render h2, .doc-render h3, .doc-render h4, .doc-render h5, .doc-render h6 {
  margin-top: 1em; margin-bottom: 0.4em; color: #111; font-weight: 600; line-height: 1.3;
}
.doc-render h1 { font-size: 20px; }
.doc-render h2 { font-size: 18px; }
.doc-render h3 { font-size: 16px; }
.doc-render h4 { font-size: 15px; }
.doc-render p { margin: 0.4em 0; }
.doc-render p[style*="text-align: center"], .doc-render p[style*="text-align:center"] {
  text-align: center !important;
}

/* Lists */
.doc-render ul, .doc-render ol { padding-left: 2em; margin: 0.4em 0; }
.doc-render li { margin: 0.15em 0; }

/* Tables */
.doc-render table {
  border-collapse: collapse;
  margin: 0.8em 0;
  width: 100%;
  page-break-inside: avoid;
}
.doc-render th, .doc-render td {
  padding: 6px 10px;
  text-align: left;
  vertical-align: top;
}

/* Data tables (have thead or th) */
.doc-render table:has(thead) th,
.doc-render table:has(thead) td,
.doc-render table:has(th) th,
.doc-render table:has(th) td {
  border: 1px solid #666;
}
.doc-render table:has(thead) th,
.doc-render table:has(th) th {
  background-color: #f0f0f0;
  font-weight: 600;
  color: #222;
}

/* Layout/form tables (no thead/th) — borderless */
.doc-render table:not(:has(thead)):not(:has(th)) {
  border: none;
}
.doc-render table:not(:has(thead)):not(:has(th)) td {
  border: none;
  padding: 2px 6px;
}

/* Images */
.doc-render img { max-width: 100%; height: auto; display: inline-block; }
.doc-render figure { margin: 0.8em 0; text-align: center; }
.doc-render figcaption { font-size: 12px; color: #666; margin-top: 0.3em; font-style: italic; }

/* Code */
.doc-render pre {
  background: #f6f8fa; padding: 12px; border-radius: 4px;
  overflow-x: auto; font-size: 13px; margin: 0.6em 0; border: 1px solid #e1e4e8;
}
.doc-render code {
  font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
  font-size: 13px; background: #f0f0f0; padding: 2px 4px; border-radius: 3px;
}
.doc-render pre code { background: none; padding: 0; }

/* Blockquote */
.doc-render blockquote {
  border-left: 4px solid #ccc; margin: 0.6em 0; padding: 0.4em 1em; color: #444; background: #f9f9f9;
}

/* Links */
.doc-render a { color: #0366d6; text-decoration: none; }

/* Alignment */
.doc-render .center, .doc-render [align="center"] { text-align: center; }
.doc-render .right, .doc-render [align="right"] { text-align: right; }
.doc-render strong, .doc-render b { font-weight: 700; }
.doc-render u { text-decoration: underline; }
`;
