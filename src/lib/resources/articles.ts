import type { ResourceArticle } from "./types";

export const ARTICLES: ResourceArticle[] = [
  // 1. Markdown to PDF
  {
    slug: "markdown-to-pdf",
    title: "Markdown to PDF: How to Convert Markdown to a Clean PDF",
    description:
      "Learn how to convert Markdown to PDF with proper page breaks, headers, footers, tables and diagrams, and get a document you can actually send to a client.",
    kind: "tool",
    category: "Free tool",
    keyword: "markdown to pdf",
    readingMinutes: 5,
    publishedAt: "2026-09-02",
    updatedAt: "2026-11-10",
    excerpt:
      "A practical guide to turning any Markdown file into a well-paginated, professional PDF without fighting your tools.",
    relatedTool: { href: "/tools/markdown-to-pdf", label: "Markdown to PDF tool" },
    relatedTemplate: "business-report",
    faq: [
      {
        q: "Is the Markdown to PDF converter free?",
        a: "Yes. You can paste Markdown and preview it without logging in, and the Free plan includes 3 PDF exports per month. Free exports never carry a watermark.",
      },
      {
        q: "How do I force a page break in Markdown?",
        a: "Put <!-- pagebreak --> on its own line, or use \\newpage or a line containing only \\pagebreak. The preview shows the break immediately so you can check the result before exporting.",
      },
      {
        q: "Will my tables and code blocks look the same in the PDF?",
        a: "Yes. The browser export prints the exact paginated preview you see on screen, so tables, code blocks, diagrams and math render in the PDF the way they appear in the preview.",
      },
      {
        q: "Is my Markdown uploaded to a server?",
        a: "Markdown rendering and preview happen locally in your browser. The optional Server PDF (beta) export sends the document to the server to generate the file.",
      },
    ],
    body: `## Why converting Markdown to PDF is harder than it looks

Markdown is a great format for writing. It is fast, readable as plain text, and it is what most AI assistants produce by default. Claude, ChatGPT and Codex all answer in Markdown, and many developers and consultants keep their notes, specs and reports in \`.md\` files.

The problem appears the moment you need to hand that content to someone else. A client does not want a raw \`.md\` file, and a browser "Print to PDF" of a rendered page usually gives you awkward page splits, tables cut in half, no page numbers and no branding. Getting from "good Markdown" to "a PDF I can attach to an email" is where most people lose time.

This guide walks through a reliable workflow using the [Markdown to PDF tool](/tools/markdown-to-pdf), plus the formatting habits that make the output look deliberate rather than generated.

## Step-by-step: Markdown to PDF in a few minutes

1. **Paste or open your Markdown.** Open the [Markdown to PDF tool](/tools/markdown-to-pdf) and paste your content. No login is needed to preview.
2. **Pick a template.** Start with a basic template such as [Business Report](/templates/business-report) or [Client Proposal](/templates/client-proposal). Templates control fonts, spacing, heading styles and the cover area.
3. **Set a header and footer.** Add text like \`{company} — {title}\` in the header and \`Page {page} of {pages}\` in the footer. Tokens are filled in on every page automatically.
4. **Check pagination in the preview.** The preview is paginated, so you see exactly where each page ends. Add manual page breaks where a section should start on a new page.
5. **Export.** Click export to download the PDF. The browser export prints the exact paginated preview, so what you see is what you get.

## Formatting that survives the trip to PDF

Most Markdown converts cleanly, but a few habits make a noticeable difference in the final document.

### Use a clear heading hierarchy

Start sections with \`##\` and subsections with \`###\`. Avoid jumping from \`##\` to \`####\`. A consistent hierarchy gives the template something to style and makes the document easy to scan.

### Keep tables narrow

A PDF page is far narrower than a wide monitor. Tables with more than five or six columns tend to wrap badly. If a table is wide, split it into two tables or move long text into a list below it.

### Control page breaks explicitly

Automatic pagination is good, but you know your document better than any algorithm. DocFinish supports three manual page-break markers:

| Marker | Where it comes from | Example |
| --- | --- | --- |
| \`<!-- pagebreak -->\` | HTML comment, invisible in most Markdown viewers | Use before a new chapter |
| \`\\newpage\` | LaTeX and Pandoc habit | Common in academic drafts |
| \`\\pagebreak\` on its own line | LaTeX style | Same effect as \`\\newpage\` |

The HTML comment is the safest choice if the same file is also viewed on GitHub or in an editor, because it stays invisible there.

### Add diagrams and math as text

You do not need to export images from another tool. Mermaid diagrams and KaTeX math are rendered directly:

\`\`\`\`markdown
## Delivery timeline

\`\`\`mermaid
flowchart LR
  A[Discovery] --> B[Design] --> C[Build] --> D[Launch]
\`\`\`

Projected cost: $C = h \\times r$ where $h$ is hours and $r$ is the hourly rate.

<!-- pagebreak -->

## Appendix
\`\`\`\`

The outer example uses four backticks only so the inner Mermaid block can be shown as source; in your real document the Mermaid block is a normal three-backtick fenced block with the \`mermaid\` language tag.

## A complete example document

Here is a short report skeleton that exports well:

\`\`\`markdown
## Executive summary

Q3 onboarding time dropped after the new checklist was introduced.

## Findings

| Metric | Q2 | Q3 |
| --- | --- | --- |
| Median onboarding days | 14 | 9 |
| Support tickets | 120 | 85 |

## Recommendations

- Keep the checklist as the default for all new accounts
- Review the remaining manual steps in Q4

<!-- pagebreak -->

## Appendix: method

Data was pulled from the CRM export on 1 October.
\`\`\`

Pair it with the [Business Report template](/templates/business-report), a footer of \`{company} · Page {page} of {pages}\`, and you have something you can send without further editing.

## Pre-export checklist

- [ ] Headings follow a consistent \`##\` / \`###\` hierarchy
- [ ] No table is wider than about six columns
- [ ] Page breaks placed before major sections or appendices
- [ ] Header and footer set, with \`{page}\` and \`{pages}\` in the footer
- [ ] Title is set, so \`{title}\` resolves correctly
- [ ] Mermaid diagrams render in the preview (syntax errors show up there first)
- [ ] Links are written as full URLs if the reader will print the PDF

## Common pitfalls

**Pasting rendered text instead of Markdown.** If you copy from a chat window, you sometimes get rendered text rather than the source. Use the "copy" button on the response, which usually copies the raw Markdown, so headings, lists and tables survive.

**Long code lines.** Code blocks do not wrap the way prose does. Break very long lines, or reduce them to the parts the reader actually needs.

**Orphaned headings.** A heading at the very bottom of a page with its content on the next page looks careless. Scroll through the paginated preview and add a page break before any heading that ends up stranded.

**Inconsistent dates.** If your header uses \`{date}\`, remove hard-coded dates from the body that might contradict it.

## Free vs Pro for PDF export

The Free plan is enough for occasional documents: preview without login, 3 PDF exports per month after signing in, one project, basic templates and header/footer text. There is never a watermark.

If you produce documents every week, Pro adds unlimited PDF exports, unlimited projects with version history, premium templates, a saved brand kit with your logo, colors and fonts, header/footer presets and Google Docs export. See [pricing](/pricing) for details.

## Related guides

- [How to add headers and footers to a document](/resources/add-headers-and-footers)
- [How to turn Claude output into a PDF](/resources/claude-output-to-pdf)
- [AI Markdown to PDF](/resources/ai-markdown-to-pdf)
- [Business Report template guide](/resources/business-report-template)
`,
  },

  // 2. Markdown viewer
  {
    slug: "markdown-viewer",
    title: "Online Markdown Viewer: Preview Markdown in Your Browser",
    description:
      "Use a free online Markdown viewer to preview tables, code, Mermaid diagrams and math instantly in your browser, with no install, no login and no upload needed.",
    kind: "tool",
    category: "Free tool",
    keyword: "markdown viewer",
    readingMinutes: 4,
    publishedAt: "2026-09-04",
    updatedAt: "2026-11-10",
    excerpt:
      "How to read, check and share Markdown files in a browser-based viewer, and what to look for before you send them on.",
    relatedTool: { href: "/tools/markdown-viewer", label: "Markdown viewer" },
    relatedTemplate: "project-brief",
    faq: [
      {
        q: "Do I need an account to view Markdown?",
        a: "No. You can paste Markdown into the viewer and see the rendered result without logging in.",
      },
      {
        q: "Does the viewer upload my file?",
        a: "No. Rendering and preview happen locally in your browser, so the content of your Markdown stays on your device while you view it.",
      },
      {
        q: "Does the viewer support GitHub-flavoured Markdown?",
        a: "Yes. Tables, task lists, strikethrough, fenced code blocks and autolinks are supported, along with Mermaid diagrams and KaTeX math.",
      },
      {
        q: "Can I turn what I see into a PDF?",
        a: "Yes. The same preview can be exported as a PDF using the Markdown to PDF tool, and the export matches the paginated preview.",
      },
    ],
    body: `## What a Markdown viewer is for

A Markdown file is plain text with lightweight formatting marks: \`#\` for headings, \`-\` for bullets, pipes for tables. It is readable as-is, but it is much easier to judge structure, spot mistakes and share content once it is rendered.

An online Markdown viewer renders that text into formatted output instantly. You paste or open a file and see headings, lists, tables, code blocks and links the way a reader would. The [Markdown viewer](/tools/markdown-viewer) does this in the browser with no install and no login.

Typical reasons people reach for a viewer:

- Checking a \`README.md\` before pushing it
- Reading a Markdown file someone sent you, when you have no editor installed
- Reviewing an answer from Claude, ChatGPT or Codex that came back as raw Markdown
- Confirming that a table or diagram is valid before turning it into a PDF

## How to use the online viewer

1. Open the [Markdown viewer](/tools/markdown-viewer).
2. Paste your Markdown into the editor pane, or open a \`.md\` file.
3. Read the rendered output side by side with the source.
4. Fix anything that looks wrong in the source; the preview updates as you type.
5. When it looks right, keep it as Markdown or move to the [Markdown to PDF tool](/tools/markdown-to-pdf) to export.

Because rendering happens locally in your browser, you can view sensitive drafts without sending their contents anywhere.

## What the viewer supports

| Feature | Markdown syntax | Notes |
| --- | --- | --- |
| Headings | \`##\`, \`###\` | Used for outline and styling |
| Tables | Pipes and dashes | GitHub-flavoured syntax |
| Task lists | \`- [ ]\` and \`- [x]\` | Render as checkboxes |
| Code blocks | Triple backticks with a language | Syntax highlighting |
| Diagrams | Fenced block tagged \`mermaid\` | Flowcharts, sequence diagrams, Gantt charts |
| Math | \`$...$\` inline, \`$$...$$\` block | Rendered with KaTeX |
| Page breaks | \`<!-- pagebreak -->\`, \`\\newpage\`, \`\\pagebreak\` | Visible in paginated preview |

## A quick test document

If you want to see how the viewer handles the trickier features, paste this:

\`\`\`\`markdown
## Project brief: website refresh

**Owner:** Marketing · **Status:** Draft

### Goals

- [x] Agree on scope
- [ ] Approve design direction
- [ ] Publish new homepage

### Budget

| Item | Estimate |
| --- | --- |
| Design | 40 hours |
| Development | 60 hours |

### Process

\`\`\`mermaid
sequenceDiagram
  Client->>Agency: Brief
  Agency->>Client: Proposal
  Client->>Agency: Approval
\`\`\`

Total effort: $E = 40 + 60 = 100$ hours.
\`\`\`\`

The task list should show checkboxes, the table should have two aligned columns, and the Mermaid block should become a sequence diagram. If you are writing a project brief, the [Project Brief template](/templates/project-brief) gives you this kind of structure with styling already applied.

## Reading Markdown from AI assistants

AI chat interfaces usually render Markdown for you, but the moment you copy the content elsewhere (an email, a ticket, a document) you often end up with the raw source. A viewer is the fastest way to check that what you copied is complete:

- **Truncated tables.** Long answers sometimes stop mid-table. In the viewer, a broken table renders as plain text with pipes, which is easy to spot.
- **Unclosed code fences.** If a code block is missing its closing backticks, everything after it renders as code. The viewer makes this obvious immediately.
- **Invalid diagrams.** Mermaid syntax produced by an assistant is usually close but not always valid. The viewer shows an error where the diagram should be, so you can fix it before sharing.

## Viewer vs editor vs converter

These three tools overlap, but they are good at different things.

| Tool | Best for | Output |
| --- | --- | --- |
| Viewer | Reading and checking Markdown quickly | On-screen preview |
| Editor | Writing and restructuring long documents | \`.md\` file |
| Converter | Delivering to people who do not use Markdown | PDF or Google Doc |

DocFinish combines the first and third: you view and lightly edit in the browser, then export to PDF, or to Google Docs on Pro, when the document is ready for someone else.

## Checklist before you share a Markdown file

- [ ] All code fences are closed
- [ ] Tables render as tables, not as lines of pipes
- [ ] Mermaid diagrams render without errors
- [ ] Math renders (no stray dollar signs)
- [ ] Links point where you expect
- [ ] Headings form a sensible outline
- [ ] No leftover placeholders such as "TODO" or "[insert name]"

## Common pitfalls

**Mixing tabs and spaces in lists.** Nested lists depend on indentation. Mixing tabs and spaces can flatten a nested list or turn it into a code block. Use spaces consistently.

**Missing blank lines.** A table or list directly after a paragraph, with no blank line, may not render as expected. Add a blank line before block elements.

**Dollar signs in prose.** Because \`$\` starts inline math, prices like "$40 to $60" can be read as a math expression. Escape them as \`\\$40\` if they render oddly.

**HTML in Markdown.** Some HTML is allowed, but scripts and unusual tags are not rendered. Stick to Markdown syntax wherever possible.

## From viewing to delivering

Once a document reads well in the viewer, the next step is usually to make it presentable. Choose a template, add a header and footer, and export. The guides on [Markdown to PDF](/resources/markdown-to-pdf) and [adding headers and footers](/resources/add-headers-and-footers) cover that part in detail, and the [Project Brief template](/templates/project-brief) is a good starting point for planning documents.
`,
  },

  // 3. Markdown to Google Docs
  {
    slug: "markdown-to-google-docs",
    title: "Markdown to Google Docs: Keep Formatting When You Convert",
    description:
      "Convert Markdown to Google Docs without losing headings, tables or lists. A step-by-step guide to clean imports, collaboration and common formatting pitfalls.",
    kind: "tool",
    category: "Free tool",
    keyword: "markdown to google docs",
    readingMinutes: 4,
    publishedAt: "2026-09-08",
    updatedAt: "2026-11-10",
    excerpt:
      "How to move Markdown into Google Docs with headings, tables and lists intact, so your team can comment and edit right away.",
    relatedTool: { href: "/tools/markdown-to-google-docs", label: "Markdown to Google Docs" },
    relatedTemplate: "meeting-notes",
    faq: [
      {
        q: "Is Google Docs export free?",
        a: "Google Docs export is part of the Pro plan. On the Free plan you can still preview your document and export up to 3 PDFs per month.",
      },
      {
        q: "Will headings become real Google Docs headings?",
        a: "Yes. Markdown headings are mapped to heading styles, so the document outline in Google Docs works as expected.",
      },
      {
        q: "What happens to Mermaid diagrams and math?",
        a: "Google Docs has no native Mermaid or KaTeX support, so complex visual elements may not carry over the same way they look in the preview. Check them after export and use PDF when exact visual fidelity matters.",
      },
      {
        q: "Should I send a PDF or a Google Doc?",
        a: "Send a Google Doc when people need to comment or edit, and a PDF when the document is final and should look identical for everyone.",
      },
    ],
    body: `## Why move Markdown into Google Docs

Markdown is ideal for drafting, especially when the first draft comes from Claude, ChatGPT or Codex. But many teams review and approve documents in Google Docs. Comments, suggestions, version history and sharing permissions all live there, and colleagues outside engineering rarely want to open a \`.md\` file.

The usual workaround of copying rendered text from a chat window into a blank Google Doc works for a paragraph or two. For anything longer, it tends to produce mismatched fonts, headings that are just bold text, tables that collapse and lists with odd spacing. Cleaning that up by hand takes longer than writing the document did.

The [Markdown to Google Docs tool](/tools/markdown-to-google-docs) converts the Markdown structure directly, so headings become heading styles, lists become lists and tables become tables.

## Step-by-step conversion

1. **Paste your Markdown** into the [Markdown to Google Docs tool](/tools/markdown-to-google-docs) and check the preview.
2. **Choose a template.** For recurring team documents, the [Meeting Notes template](/templates/meeting-notes) is a sensible default.
3. **Fix structure in the preview.** Make sure headings, tables and lists render correctly before export. Problems in the source carry over to the Doc.
4. **Export to Google Docs.** Google Docs export is a Pro feature. You connect your Google account once, and the new document is created in your Drive.
5. **Share and review.** Open the Doc, set sharing, and let reviewers comment.

## How Markdown elements map to Google Docs

| Markdown | Google Docs result | Notes |
| --- | --- | --- |
| \`##\` / \`###\` headings | Heading 2 / Heading 3 styles | Appear in the document outline |
| Bullet and numbered lists | Native lists | Nesting preserved |
| Tables | Native tables | Keep columns few for readability |
| Bold, italic, links | Same formatting | Links remain clickable |
| Code blocks | Monospaced text | No syntax highlighting in Docs |
| Task lists | Checklist-style items | Can be ticked off in Docs |
| Mermaid, KaTeX | Check after export | Docs has no native renderer for these |

Because Google Docs is an editable format, it is not designed to reproduce every visual detail of a paginated PDF. Treat the Doc as the collaborative version and PDF as the final, fixed version.

## Example: meeting notes from an AI summary

A common workflow is asking an assistant to summarise a meeting transcript, then sharing the result with attendees. Ask for Markdown with a predictable structure:

\`\`\`markdown
## Weekly product sync — 12 November

**Attendees:** Product, Design, Engineering

### Decisions

- Ship the onboarding checklist behind a feature flag
- Postpone the pricing page redesign to next sprint

### Action items

- [ ] Write rollout plan — Engineering — Friday
- [ ] Update help article — Support — Monday
- [ ] Share user interview notes — Design — Wednesday

### Open questions

| Question | Owner |
| --- | --- |
| Do we need a migration for old accounts? | Engineering |
| Who signs off on the copy? | Product |
\`\`\`

Exported with the [Meeting Notes template](/templates/meeting-notes), this becomes a Google Doc where each action item can be assigned and discussed in comments.

## Prompting tips for cleaner conversion

The quality of the Doc depends on the quality of the Markdown. When you ask an assistant for content you plan to export, add a short instruction like this:

> Respond in Markdown. Use ## for sections and ### for subsections. Use tables only for data with three or four columns. Do not add an introduction before the first heading.

This removes the chatty preamble ("Sure! Here's your summary…") that you would otherwise delete by hand, and keeps tables small enough to read in a document.

## Checklist before exporting

- [ ] The first line is a heading, not a conversational sentence
- [ ] Heading levels are consistent and do not skip
- [ ] Tables have a header row and no more than five or six columns
- [ ] Action items use task-list syntax
- [ ] Names, dates and owners are filled in, not left as placeholders
- [ ] Any diagram or formula is checked again in the exported Doc

## Common pitfalls

**Copying rendered chat output instead of Markdown.** Rendered text loses structure. Use the copy button that gives you the raw Markdown, then paste that.

**Very wide tables.** Google Docs pages are portrait by default. Tables with many columns get squeezed until they are hard to read. Split them or transpose them.

**Relying on diagrams in an editable doc.** If a diagram is central to the document, a PDF is usually the better delivery format. You can export both: a Doc for comments and a PDF for the final record.

**Editing in two places.** Once you export, decide where the source of truth lives. If reviewers edit the Google Doc, do not keep editing the Markdown separately, or the versions will drift.

## Google Doc or PDF?

| Situation | Better format |
| --- | --- |
| Team needs to comment or suggest edits | Google Doc |
| Document is final and goes to a client | PDF |
| Layout and branding must look identical everywhere | PDF |
| Content will be reused and edited by others | Google Doc |

Many people do both: they share a Google Doc for review, then produce the signed-off version as a PDF using the [Markdown to PDF tool](/tools/markdown-to-pdf).

## Plans

Previewing is free and needs no login. Google Docs export is included in Pro, along with unlimited PDF exports, unlimited projects with version history, premium templates and a saved brand kit. See [pricing](/pricing). For the PDF side of the workflow, read the [Markdown to PDF guide](/resources/markdown-to-pdf).
`,
  },

  // 4. PDF to Markdown
  {
    slug: "pdf-to-markdown",
    title: "PDF to Markdown: Convert PDFs into Editable Markdown",
    description:
      "Convert a PDF into clean, editable Markdown so you can revise it, feed it to an AI assistant, or restyle it, plus tips for tables, headings and scanned files.",
    kind: "tool",
    category: "Free tool",
    keyword: "pdf to markdown",
    readingMinutes: 4,
    publishedAt: "2026-09-10",
    updatedAt: "2026-11-10",
    excerpt:
      "How to turn an existing PDF into Markdown you can edit, rework with AI, and export again in a new template.",
    relatedTool: { href: "/tools/pdf-to-markdown", label: "PDF to Markdown" },
    relatedTemplate: "business-report",
    faq: [
      {
        q: "Is PDF to Markdown included in the Free plan?",
        a: "PDF to Markdown is a Pro feature. The Free plan covers Markdown preview and up to 3 PDF exports per month.",
      },
      {
        q: "Will the Markdown be perfect?",
        a: "Text-based PDFs usually convert well, but PDFs store positioned text rather than document structure, so headings, tables and multi-column layouts should be reviewed after conversion.",
      },
      {
        q: "Can I convert scanned PDFs?",
        a: "A scanned PDF is an image of text, so there may be little or no text to extract. Results are best with PDFs that were generated digitally, where you can select the text.",
      },
      {
        q: "What should I do with the Markdown after converting?",
        a: "Edit it directly, ask an AI assistant to revise it, then export it again as a PDF or Google Doc using a new template.",
      },
    ],
    body: `## Why convert a PDF to Markdown

PDFs are built for reading and printing, not for editing. When you need to update last year's report, reuse sections of a proposal or ask an AI assistant to rewrite a document, the PDF format gets in the way. Copying text out of a PDF often gives you broken lines, lost headings and tables flattened into a stream of words.

Markdown is the opposite: plain text with structure. Once a document is in Markdown you can:

- Edit it in any text editor
- Paste it into Claude, ChatGPT or Codex and ask for a revision, summary or translation
- Track changes in version control
- Export it again as a fresh PDF or Google Doc with a new template

The [PDF to Markdown tool](/tools/pdf-to-markdown) handles the first step, giving you Markdown that you can then clean up and reuse.

## Step-by-step

1. **Open the [PDF to Markdown tool](/tools/pdf-to-markdown)** and select your PDF. PDF to Markdown is a Pro feature.
2. **Review the generated Markdown.** Check headings, lists and tables in the preview.
3. **Clean up structure.** Fix any headings that came through as bold text, and tidy tables (see below).
4. **Revise the content.** Edit directly, or paste sections into an AI assistant with clear instructions.
5. **Re-export.** Apply a template such as [Business Report](/templates/business-report) and export to PDF with the [Markdown to PDF tool](/tools/markdown-to-pdf).

## What converts well and what needs review

PDFs describe where text sits on a page, not what that text means. A heading is just larger text at a certain position. That is why conversion is reliable for some elements and needs a human check for others.

| Element | Typical result | What to check |
| --- | --- | --- |
| Paragraphs | Usually clean | Words split by hyphenation at line ends |
| Headings | Often detected | Levels may need adjusting to \`##\` / \`###\` |
| Bullet lists | Usually detected | Bullet symbols left in the text |
| Tables | Varies by layout | Merged cells, column alignment |
| Multi-column pages | Can interleave | Reading order between columns |
| Headers and footers | May repeat in body | Remove page numbers and running titles |
| Images and charts | Not converted to text | Recreate or describe them |
| Scanned pages | Little or no text | Text must be selectable in the PDF |

## Cleaning up converted Markdown

A few minutes of tidying makes the Markdown much more useful. Here is a typical before-and-after.

Before cleanup:

\`\`\`markdown
**ANNUAL REVIEW 2025**
Page 3 of 18
**1. Summary**
The team com-
pleted four major projects this year.
• Migration to new CRM
• Support portal launch
\`\`\`

After cleanup:

\`\`\`markdown
## 1. Summary

The team completed four major projects this year.

- Migration to new CRM
- Support portal launch
\`\`\`

The changes: bold lines became real headings, the repeated page footer was removed, the hyphenated word was rejoined and bullet characters became Markdown list items.

### Cleanup checklist

- [ ] Convert bold "fake headings" into \`##\` and \`###\` headings
- [ ] Remove repeated running headers, footers and page numbers
- [ ] Rejoin words split across lines
- [ ] Replace bullet characters (•, ▪, –) with \`-\`
- [ ] Rebuild tables with a header row and consistent columns
- [ ] Check reading order on pages that had two columns
- [ ] Add placeholders where charts or images used to be

## Using AI to finish the job

Once the Markdown is reasonably clean, an AI assistant is good at the remaining structural work. A prompt that works well:

> Here is a document converted from PDF. Fix heading levels so the document uses ## for sections and ### for subsections. Rebuild any broken tables as Markdown tables. Do not change the wording of the content.

The last sentence matters. Without it, assistants tend to rephrase as they go, and you lose track of what changed. Ask for structural fixes first, then ask for content edits as a separate step.

## Re-exporting with a new design

The real payoff comes when you export again. Old PDFs often carry outdated branding, inconsistent fonts or a layout that no longer fits. After converting to Markdown, you can apply a clean template, set a new header and footer such as \`{company} · {title}\` and \`Page {page} of {pages}\`, add manual page breaks with \`<!-- pagebreak -->\`, and export a consistent document.

On Pro, a saved brand kit applies your logo, colors and fonts automatically, so every re-exported document matches.

## Common pitfalls

**Expecting layout to convert.** Markdown captures structure, not visual layout. Sidebars, callout boxes and precise positioning do not have Markdown equivalents. Decide what each one should become: a blockquote, a list, or a short section.

**Trusting tables blindly.** Tables are the element most likely to need manual repair. Compare each converted table with the original PDF before relying on the numbers.

**Converting protected or scanned files.** If you cannot select text in the PDF, there is nothing for the converter to extract. Use a digital original where possible.

**Skipping the review.** Conversion gets you most of the way. Always read the result before sending a re-exported version to anyone.

## Where this fits

PDF to Markdown closes the loop: PDF in, editable Markdown in the middle, polished PDF or Google Doc out. It is especially useful for refreshing recurring documents like quarterly reports. See the [Business Report template guide](/resources/business-report-template) for how to structure the refreshed version, and [pricing](/pricing) for what Pro includes.
`,
  },

  // 5. AI Markdown to PDF
  {
    slug: "ai-markdown-to-pdf",
    title: "AI Markdown to PDF: Make AI Output Client-Ready",
    description:
      "Turn Markdown from ChatGPT, Claude or Codex into a branded, client-ready PDF. Covers prompting, cleanup, templates, page breaks and a pre-send checklist.",
    kind: "tool",
    category: "Free tool",
    keyword: "ai markdown to pdf",
    readingMinutes: 4,
    publishedAt: "2026-09-15",
    updatedAt: "2026-11-10",
    excerpt:
      "A repeatable workflow for turning AI-generated Markdown into polished PDFs you can send to clients without manual reformatting.",
    relatedTool: { href: "/tools/ai-markdown-to-pdf", label: "AI Markdown to PDF" },
    relatedTemplate: "client-proposal",
    faq: [
      {
        q: "Which AI tools does this work with?",
        a: "Any tool that outputs Markdown, including Claude, ChatGPT and Codex, as well as Markdown you write yourself in an editor.",
      },
      {
        q: "Do I need to clean up the AI output first?",
        a: "Usually only lightly. Remove the conversational intro and closing, check heading levels, and verify facts, names and numbers before exporting.",
      },
      {
        q: "Will the PDF have a watermark?",
        a: "No. DocFinish never adds a watermark, on Free or Pro.",
      },
      {
        q: "Can I add my logo?",
        a: "Yes. Templates support a logo, and on Pro you can save a brand kit with your logo, colors and fonts so every export uses them automatically.",
      },
    ],
    body: `## The gap between AI output and a client document

AI assistants are now a normal part of drafting proposals, reports, briefs and documentation. Claude, ChatGPT and Codex all produce well-structured Markdown: headings, bullet lists, tables, even code and diagrams. The content is often 80% of the way there.

The remaining 20% is presentation. A client expects a document with your branding, page numbers, a sensible layout and no chat artifacts like "Great question! Here's a draft…". Copying AI output into a word processor and reformatting it by hand is slow, and the result rarely looks consistent from one document to the next.

The [AI Markdown to PDF tool](/tools/ai-markdown-to-pdf) is built for exactly this step: paste the Markdown, apply a template, export a PDF.

## The workflow at a glance

| Step | What you do | Time spent |
| --- | --- | --- |
| 1. Prompt | Ask the assistant for Markdown in a set structure | Short |
| 2. Copy | Copy the raw Markdown, not rendered text | Seconds |
| 3. Clean | Remove chat preamble, check facts and headings | A few minutes |
| 4. Style | Pick a template, set header and footer | Seconds |
| 5. Paginate | Add page breaks where sections should start | A minute |
| 6. Export | Download the PDF | Seconds |

## Step 1: Prompt for document-ready Markdown

The easiest cleanup is the one you never have to do. Tell the assistant what shape you want:

\`\`\`markdown
Write a client proposal in Markdown for a website redesign.
Structure:
## Overview
## Goals
## Scope of work
## Timeline (as a table: phase, duration, deliverable)
## Investment (as a table)
## Next steps

Rules: no text before the first heading, no closing remarks,
use ## and ### only, keep tables to four columns or fewer.
\`\`\`

This gives you output that maps directly onto the [Client Proposal template](/templates/client-proposal).

## Step 2: Copy the Markdown, not the rendering

Chat interfaces display formatted text. If you select and copy that text, you often get a mix of formatting that does not survive pasting. Use the copy button on the response, which typically copies the raw Markdown. You will know it worked if you see \`##\` and \`|\` characters when you paste.

## Step 3: Clean up what AI tends to get wrong

AI drafts have predictable quirks. Scan for these:

- **Conversational wrappers.** Delete intros like "Here's a proposal you can use" and closings like "Let me know if you'd like changes."
- **Placeholder text.** Look for "[Client Name]", "[Date]" or "XX" and fill them in.
- **Invented specifics.** Assistants can produce plausible-sounding numbers, dates or references. Verify every figure, and remove anything you cannot back up.
- **Heading drift.** Long outputs sometimes switch from \`##\` to bold text halfway through. Make headings consistent.
- **Overlong tables.** Trim tables to the columns a reader actually needs.

## Step 4: Apply a template and branding

Paste the cleaned Markdown into the [AI Markdown to PDF tool](/tools/ai-markdown-to-pdf) and choose a template. Basic templates include Client Proposal, Business Report, Project Brief and Meeting Notes. Pro adds SOP, Resume, Invoice and Academic Paper.

Then set a header and footer. Tokens are replaced on every page:

| Token | Becomes |
| --- | --- |
| \`{title}\` | The document title |
| \`{date}\` | The document date |
| \`{page}\` | Current page number |
| \`{pages}\` | Total page count |
| \`{company}\` | Your company name |

A typical setup is \`{company} — {title}\` in the header and \`{date} · Page {page} of {pages}\` in the footer. See [how to add headers and footers](/resources/add-headers-and-footers) for more patterns.

## Step 5: Control page breaks

The preview is paginated, so you can see exactly where each page ends. Put a page break before sections that should start on a new page, such as pricing or an appendix:

\`\`\`markdown
## Timeline

| Phase | Duration |
| --- | --- |
| Discovery | 2 weeks |
| Build | 6 weeks |

<!-- pagebreak -->

## Investment
\`\`\`

\`\\newpage\` and a line containing only \`\\pagebreak\` work too, which is handy if the assistant already uses LaTeX-style breaks.

## Step 6: Export

The browser export prints the exact paginated preview, so the PDF matches what you checked on screen. There is also a Server PDF (beta) option. Free plan users get 3 PDF exports per month after logging in; Pro is unlimited. No plan adds a watermark.

## Pre-send checklist

- [ ] No chat preamble or closing remarks remain
- [ ] All placeholders replaced with real names, dates and amounts
- [ ] Every number and claim checked against your own sources
- [ ] Headings consistent, no skipped levels
- [ ] Header and footer set, page numbers showing
- [ ] Page breaks before major sections
- [ ] Diagrams and math render correctly in the preview
- [ ] Document title set so \`{title}\` resolves

## Common pitfalls

**Exporting without reading.** AI output can be confidently wrong. The PDF will look professional either way, which makes errors more costly, not less.

**One giant prompt for a long document.** Very long single responses are more likely to drift in structure. Generate long documents section by section and assemble them.

**Different templates for the same client.** Pick one template and brand kit per client and reuse it, so every document you send looks like it came from the same place. A Pro brand kit makes this automatic.

## Next steps

Start with the free preview in the [AI Markdown to PDF tool](/tools/ai-markdown-to-pdf), or read the walkthrough on [turning Claude output into a PDF](/resources/claude-output-to-pdf). For proposals specifically, see the [Client Proposal template guide](/resources/client-proposal-template).
`,
  },

  // 6. Client proposal template
  {
    slug: "client-proposal-template",
    title: "Client Proposal Template: Structure, Example and Tips",
    description:
      "A free client proposal template in Markdown with a proven section structure, a worked example, pricing tips and a checklist to export it as a polished PDF.",
    kind: "template",
    category: "Template",
    keyword: "client proposal template",
    readingMinutes: 4,
    publishedAt: "2026-09-18",
    updatedAt: "2026-11-10",
    excerpt:
      "A ready-to-use client proposal structure in Markdown, with guidance on each section and how to export it as a branded PDF.",
    relatedTool: { href: "/tools/markdown-to-pdf", label: "Markdown to PDF tool" },
    relatedTemplate: "client-proposal",
    faq: [
      {
        q: "Is the Client Proposal template free?",
        a: "Yes. Client Proposal is one of the basic templates included in the Free plan, along with Business Report, Project Brief and Meeting Notes.",
      },
      {
        q: "How long should a client proposal be?",
        a: "Long enough to cover the problem, scope, timeline, price and next steps, and no longer. For many service projects that fits on a few pages.",
      },
      {
        q: "Can I use AI to draft the proposal?",
        a: "Yes. Ask an assistant for Markdown that follows the section structure in this guide, then review every detail, especially scope and pricing, before exporting.",
      },
      {
        q: "Can I add my logo to the proposal?",
        a: "Yes. Templates support a logo, and Pro lets you save a brand kit so your logo, colors and fonts apply to every proposal.",
      },
    ],
    body: `## What a good client proposal does

A client proposal has one job: help the client say yes with confidence. It should show you understand their problem, explain what you will do about it, and make cost, timing and next steps unambiguous.

Most weak proposals fail in one of three ways. They talk about the vendor more than the client, they leave scope vague, or they bury the price. A clear template fixes all three by putting the right sections in the right order.

The [Client Proposal template](/templates/client-proposal) gives you that structure with professional styling. You write or generate the content in Markdown, then export a PDF from the [Markdown to PDF tool](/tools/markdown-to-pdf).

## Recommended structure

| Section | Purpose | Typical length |
| --- | --- | --- |
| Overview | Restate the client's situation and goal | One short paragraph |
| Objectives | What success looks like, ideally measurable | 3 to 5 bullets |
| Scope of work | What you will deliver | A list grouped by phase |
| Out of scope | What is explicitly not included | A few bullets |
| Timeline | Phases, durations, milestones | A table |
| Investment | Price, payment terms | A table plus terms |
| Assumptions | What must be true for the plan to work | A few bullets |
| Next steps | How to accept and start | 2 to 3 steps |

The "Out of scope" and "Assumptions" sections are the ones people skip, and they are the ones that prevent disputes later.

## The template in Markdown

Copy this into the editor and replace the placeholders:

\`\`\`markdown
## Overview

[Client] wants to [goal] by [date]. Today, [current problem].
This proposal outlines how [Your company] will help.

## Objectives

- [Objective 1]
- [Objective 2]
- [Objective 3]

## Scope of work

### Phase 1: Discovery
- Stakeholder interviews
- Review of existing materials

### Phase 2: Delivery
- [Deliverable]
- [Deliverable]

## Out of scope

- [Item not included]

## Timeline

| Phase | Duration | Milestone |
| --- | --- | --- |
| Discovery | [x] weeks | Findings summary |
| Delivery | [x] weeks | Final handover |

<!-- pagebreak -->

## Investment

| Item | Price |
| --- | --- |
| Discovery | [amount] |
| Delivery | [amount] |
| **Total** | **[amount]** |

Payment terms: [e.g. 50% on signature, 50% on completion].

## Assumptions

- [Client] provides access to [systems/people] within [x] days

## Next steps

1. Reply to confirm the scope
2. Sign and return the agreement
3. Kick-off call scheduled within [x] days
\`\`\`

The page break before **Investment** keeps the pricing on its own page, which makes it easier to find and discuss.

## Writing each section well

### Overview

Write about the client, not about yourself. One paragraph that restates their situation in their words shows you listened. Save your credentials for a short "About us" section at the end if you need one at all.

### Objectives

Make objectives specific enough to check later. "Improve the website" is hard to verify; "Launch a redesigned homepage and pricing page by 1 March" is not.

### Scope and out of scope

List deliverables, not activities. "Five page designs" is a deliverable; "design work" is an activity. Then list what is not included, such as copywriting, hosting or ongoing maintenance, so nobody assumes otherwise.

### Investment

Keep pricing in a table with a clear total. If you offer options, limit them to two or three and label them plainly. State payment terms and how long the proposal is valid.

## Drafting the proposal with AI

Assistants like Claude and ChatGPT are useful for a first draft, as long as you give them real input. Paste in your discovery notes and ask for Markdown following the structure above. Then review carefully: AI will happily fill gaps with plausible but invented details, and in a proposal those details become commitments. See the [AI Markdown to PDF guide](/resources/ai-markdown-to-pdf) for the full workflow.

## Header and footer for proposals

A simple, professional setup:

- Header: \`{company} · Proposal for [Client]\`
- Footer: \`{date} · Page {page} of {pages}\`

Page numbers make it easy to reference sections on a call ("see page 3"). More options are in [how to add headers and footers](/resources/add-headers-and-footers).

## Pre-send checklist

- [ ] Client name spelled correctly everywhere
- [ ] Every placeholder replaced
- [ ] Objectives are specific and checkable
- [ ] Out-of-scope items listed
- [ ] Prices add up to the stated total
- [ ] Payment terms and validity period included
- [ ] Next steps tell the client exactly what to do
- [ ] Page numbers and date in the footer
- [ ] Previewed every page before export

## Common pitfalls

**Leading with your company history.** Clients read the first page most closely. Use it for their problem, not your biography.

**Vague scope.** Ambiguous deliverables are the most common cause of scope creep. If you cannot count it or check it, rewrite it.

**Too many pricing options.** More than three options tends to slow decisions down. Offer a recommended option and, at most, a smaller and larger alternative.

**Inconsistent branding.** If proposals look different every time, it undermines trust. A Pro brand kit keeps logo, colors and fonts consistent across every proposal; see [pricing](/pricing).

## Export it

Open the [Client Proposal template](/templates/client-proposal), paste your Markdown, check the paginated preview and export. The Free plan includes this template and 3 PDF exports a month, with no watermark.
`,
  },

  // 7. Business report template
  {
    slug: "business-report-template",
    title: "Business Report Template: Free Markdown Format and Guide",
    description:
      "A free business report template in Markdown with executive summary, findings tables and recommendations, plus tips for writing it and exporting a polished PDF.",
    kind: "template",
    category: "Template",
    keyword: "business report template",
    readingMinutes: 4,
    publishedAt: "2026-09-22",
    updatedAt: "2026-11-10",
    excerpt:
      "A clear business report structure in Markdown, with section-by-section guidance and a checklist for exporting a professional PDF.",
    relatedTool: { href: "/tools/markdown-to-pdf", label: "Markdown to PDF tool" },
    relatedTemplate: "business-report",
    faq: [
      {
        q: "Is the Business Report template free to use?",
        a: "Yes. Business Report is one of the basic templates available on the Free plan.",
      },
      {
        q: "What sections should a business report include?",
        a: "At minimum an executive summary, background, findings, recommendations and next steps. Longer reports often add a method section and appendices.",
      },
      {
        q: "Can I include charts and diagrams?",
        a: "You can include Mermaid diagrams written as text, such as flowcharts and Gantt charts, and they render directly in the preview and the exported PDF. Tables work well for numeric data.",
      },
      {
        q: "How do I keep the appendix on a separate page?",
        a: "Add <!-- pagebreak --> on its own line before the appendix heading. \\newpage and \\pagebreak also work.",
      },
    ],
    body: `## What makes a business report useful

A business report exists to support a decision. The reader, often a manager, client or board member, wants to know what happened, what it means and what to do next. They may only read the first page.

That is why structure matters more than length. A good report puts the conclusion first, backs it up with evidence, and ends with clear recommendations. The [Business Report template](/templates/business-report) is styled for exactly this layout: a strong title area, clean section headings and tables that are easy to read in print.

## Recommended structure

| Section | What it answers | Tip |
| --- | --- | --- |
| Executive summary | What is the conclusion? | Write it last, put it first |
| Background | Why does this report exist? | Keep it brief |
| Method | Where did the data come from? | Sources, dates, scope |
| Findings | What did we learn? | Use tables and short paragraphs |
| Recommendations | What should we do? | Numbered, specific, owned |
| Next steps | Who does what by when? | A task list works well |
| Appendix | Supporting detail | Start on a new page |

## The template in Markdown

\`\`\`markdown
## Executive summary

[One paragraph: the main finding and the main recommendation.]

## Background

[Why this report was commissioned and what question it answers.]

## Method

- Data sources: [systems, surveys, interviews]
- Period covered: [start] to [end]
- Limitations: [what the data does not show]

## Findings

### [Finding 1]

[Short explanation.]

| Metric | Previous period | This period |
| --- | --- | --- |
| [Metric] | [value] | [value] |

### [Finding 2]

[Short explanation.]

## Recommendations

1. [Recommendation] — owner: [team]
2. [Recommendation] — owner: [team]

## Next steps

- [ ] [Action] — [owner] — [date]
- [ ] [Action] — [owner] — [date]

<!-- pagebreak -->

## Appendix

[Detailed tables, definitions, raw notes.]
\`\`\`

## Section-by-section guidance

### Executive summary

Write this after everything else. It should stand on its own: if the reader stops here, they should still know the conclusion and what you want them to do. Aim for one paragraph, two at most.

### Method

This section earns trust. State where the numbers came from, the period covered and any limitations. A short, honest limitations line protects you if someone later questions the data.

### Findings

Lead each finding with a one-line statement, then support it. Use tables for comparisons and keep them narrow so they print well. If a process or timeline matters, a Mermaid diagram can show it without leaving the document:

\`\`\`\`markdown
\`\`\`mermaid
gantt
  title Rollout plan
  dateFormat YYYY-MM-DD
  section Pilot
  Pilot team     :2026-01-05, 30d
  section Rollout
  All teams      :2026-02-09, 45d
\`\`\`
\`\`\`\`

Keep commentary next to the data it explains. A table followed by two sentences of interpretation is far easier to follow than a block of tables with all the analysis collected at the end.

### Recommendations

Number them, make them specific and give each one an owner. "Improve onboarding" is a theme. "Make the onboarding checklist mandatory for all new accounts from Q1, owned by Customer Success" is a recommendation.

## Header and footer for reports

Reports are often printed, forwarded and discussed in meetings, so page references help:

- Header: \`{company} · {title}\`
- Footer: \`Confidential · {date} · Page {page} of {pages}\`

The tokens fill in automatically on every page. More patterns are in [how to add headers and footers](/resources/add-headers-and-footers).

## Using AI to draft a report

An assistant can turn notes, data summaries or meeting transcripts into a first draft quickly. Give it the structure above and your actual data, and ask it not to invent figures. Then check every number in the draft against your source. For the full process from AI output to PDF, see [AI Markdown to PDF](/resources/ai-markdown-to-pdf).

If you are updating an older report that only exists as a PDF, the [PDF to Markdown tool](/tools/pdf-to-markdown) (Pro) converts it into editable Markdown so you can refresh it in this template. See the [PDF to Markdown guide](/resources/pdf-to-markdown).

## Pre-export checklist

- [ ] Executive summary states the conclusion in the first sentences
- [ ] Data sources and period stated in the method section
- [ ] Every table has a header row and fits the page width
- [ ] Each finding is supported by data or a clear source
- [ ] Recommendations are numbered and have owners
- [ ] Next steps have dates
- [ ] Appendix starts on a new page
- [ ] Header, footer and page numbers set
- [ ] All numbers double-checked

## Common pitfalls

**Burying the conclusion.** If the key finding first appears on page four, many readers will never see it. Put it in the executive summary.

**Too much data in the body.** Main sections should carry only the numbers needed to support each finding. Move the rest to the appendix.

**Recommendations without owners.** A recommendation nobody owns rarely happens. Name a team or person.

**Wide spreadsheet-style tables.** A table copied from a spreadsheet with ten columns will not fit a page. Summarise it, or split it into several smaller tables.

## Export and reuse

Paste your report into the [Markdown to PDF tool](/tools/markdown-to-pdf), select the [Business Report template](/templates/business-report), review the paginated preview and export. Business Report is included on the Free plan. For recurring reports, Pro adds unlimited projects with version history and a saved brand kit, so each month's report looks the same; see [pricing](/pricing).
`,
  },

  // 8. SOP template
  {
    slug: "sop-template",
    title: "SOP Template: Write Standard Operating Procedures Fast",
    description:
      "A practical SOP template in Markdown covering purpose, scope, roles, step-by-step procedure and revision history, with tips for writing clear, followable steps.",
    kind: "template",
    category: "Template",
    keyword: "sop template",
    readingMinutes: 4,
    publishedAt: "2026-09-25",
    updatedAt: "2026-11-10",
    excerpt:
      "A complete standard operating procedure template in Markdown, with guidance on writing steps people can actually follow.",
    relatedTool: { href: "/tools/markdown-to-pdf", label: "Markdown to PDF tool" },
    relatedTemplate: "sop",
    faq: [
      {
        q: "Is the SOP template free?",
        a: "The styled SOP template is a Pro premium template. You can still use the Markdown structure in this guide with any basic template on the Free plan.",
      },
      {
        q: "What sections does an SOP need?",
        a: "Purpose, scope, roles and responsibilities, prerequisites, the step-by-step procedure, and a revision history. Many SOPs also include definitions and references.",
      },
      {
        q: "How detailed should SOP steps be?",
        a: "Detailed enough that a trained person who has not done the task before can complete it correctly. Each step should contain one action.",
      },
      {
        q: "How do I track SOP versions?",
        a: "Keep a revision history table in the document. On Pro, projects also include version history so you can see earlier versions of the Markdown.",
      },
    ],
    body: `## What an SOP is and why format matters

A standard operating procedure (SOP) is a written, repeatable set of steps for completing a task the same way every time. SOPs cover everything from onboarding a new client and closing the books each month to deploying software or handling a customer refund.

An SOP only works if people follow it, and people only follow documents that are easy to use. That means a predictable structure, numbered steps, clear owners and a visible version number. A wall of prose, however accurate, gets skipped.

Markdown suits SOPs well: numbered lists, checklists and tables are native, and the plain-text source is easy to update and version. The [SOP template](/templates/sop) (a Pro premium template) turns that Markdown into a clean, printable document.

## Recommended SOP structure

| Section | Purpose |
| --- | --- |
| Document control | ID, version, owner, effective date |
| Purpose | Why this procedure exists |
| Scope | What it covers and what it does not |
| Roles and responsibilities | Who does what |
| Prerequisites | Access, tools or inputs needed before starting |
| Procedure | Numbered steps |
| Exceptions and escalation | What to do when something goes wrong |
| References | Related SOPs, forms, systems |
| Revision history | What changed, when, and by whom |

## The SOP template in Markdown

\`\`\`markdown
## Document control

| Field | Value |
| --- | --- |
| SOP ID | [OPS-012] |
| Version | [1.0] |
| Owner | [Role] |
| Effective date | [date] |
| Review by | [date] |

## Purpose

This procedure describes how to [task] so that [outcome].

## Scope

Applies to: [teams, systems, situations].
Does not apply to: [exclusions].

## Roles and responsibilities

| Role | Responsibility |
| --- | --- |
| [Requester] | Submits the request |
| [Approver] | Reviews and approves |
| [Operator] | Carries out the procedure |

## Prerequisites

- [ ] Access to [system]
- [ ] [Form or input] completed

## Procedure

1. Open [system] and go to [screen].
2. Select [option].
3. Enter [value] in [field].
4. Click **Submit**.
   - If an error appears, go to *Exceptions*.
5. Record the reference number in [log].

## Exceptions and escalation

- If [problem], contact [role] via [channel].

## References

- [Related SOP or form]

<!-- pagebreak -->

## Revision history

| Version | Date | Author | Change |
| --- | --- | --- | --- |
| 1.0 | [date] | [name] | Initial version |
\`\`\`

## Writing steps people can follow

### One action per step

"Log in, open the billing screen and export last month's invoices" is three steps. Split them. When something goes wrong, the reader can say exactly which step failed.

### Start each step with a verb

"Open", "Select", "Enter", "Confirm". Imperative verbs make steps scannable and remove ambiguity about who acts.

### Name things exactly as they appear

If the button says **Submit request**, write **Submit request**, not "send it". Bold the names of buttons and fields so they stand out.

### Put decisions in the step, not in a paragraph

Use a nested bullet under the step for branches: "If the amount is over the approval limit, send to Finance." For complex branching, a Mermaid flowchart is clearer:

\`\`\`\`markdown
\`\`\`mermaid
flowchart TD
  A[Refund request] --> B{Over limit?}
  B -- No --> C[Approve in system]
  B -- Yes --> D[Escalate to Finance]
\`\`\`
\`\`\`\`

## Using AI to draft SOPs

A practical approach is to record or write rough notes while doing the task once, then ask Claude, ChatGPT or Codex to turn those notes into Markdown using the structure above. Ask it to keep one action per step and to flag anything ambiguous rather than guess. Then have someone who did not write the SOP follow it and note where they got stuck. That test is the most reliable quality check there is.

## Header and footer for SOPs

SOPs are often printed or saved as PDFs in shared drives, where the version matters:

- Header: \`{company} · {title}\`
- Footer: \`Version [x] · Effective {date} · Page {page} of {pages}\`

A printed copy then always shows which version it is. Header/footer presets on Pro let you save this setup and reuse it for every SOP. See [how to add headers and footers](/resources/add-headers-and-footers).

## SOP quality checklist

- [ ] Document control table filled in, including owner and review date
- [ ] Purpose stated in one or two sentences
- [ ] Scope includes what is excluded
- [ ] Every role in the procedure appears in the roles table
- [ ] Prerequisites listed before the first step
- [ ] One action per step, each starting with a verb
- [ ] Button and field names match the system exactly
- [ ] Exceptions and escalation path documented
- [ ] Revision history updated
- [ ] Tested by someone who did not write it

## Common pitfalls

**Writing for yourself.** The author knows the shortcuts and skips "obvious" steps. Write for someone competent but new to the task.

**No owner or review date.** SOPs go stale as systems change. An owner and a review date make it someone's job to keep it current.

**Screens that changed.** If the software interface changes, steps that reference old button names become wrong. Review SOPs after major tool updates.

**Multiple versions in circulation.** Keep one source of truth. Pro's version history keeps earlier versions available without separate copies scattered around.

## Get started

Paste the template into the [Markdown to PDF tool](/tools/markdown-to-pdf) and preview it with a basic template for free, or use the styled [SOP template](/templates/sop) on Pro. See [pricing](/pricing) for what Pro includes, and the [Business Report template guide](/resources/business-report-template) if you also need a report format.
`,
  },

  // 9. Claude output to PDF
  {
    slug: "claude-output-to-pdf",
    title: "How to Turn Claude Output into a PDF",
    description:
      "A step-by-step guide to turning Claude responses into clean, branded PDFs: copying Markdown correctly, cleaning it up, adding page breaks, headers and footers.",
    kind: "guide",
    category: "Guide",
    keyword: "claude output to pdf",
    readingMinutes: 5,
    publishedAt: "2026-10-01",
    updatedAt: "2026-11-10",
    excerpt:
      "How to take a response from Claude and turn it into a polished, paginated PDF you can share with clients or colleagues.",
    relatedTool: { href: "/tools/ai-markdown-to-pdf", label: "AI Markdown to PDF" },
    relatedTemplate: "client-proposal",
    faq: [
      {
        q: "Does Claude output Markdown?",
        a: "Claude typically formats longer responses with Markdown headings, lists, tables and code blocks, and you can ask for Markdown explicitly to make the structure predictable.",
      },
      {
        q: "Why does my PDF look wrong when I print the chat page?",
        a: "Printing a chat page includes the interface and paginates the content without regard to sections. Converting the Markdown itself with a document template gives you proper layout, page numbers and branding.",
      },
      {
        q: "Can I keep Mermaid diagrams Claude generates?",
        a: "Yes. Mermaid code blocks are rendered as diagrams in the preview and the exported PDF. If a diagram shows an error, fix the syntax in the editor or ask Claude to correct it.",
      },
      {
        q: "How many PDFs can I export for free?",
        a: "The Free plan includes 3 PDF exports per month after logging in, with no watermark. Pro offers unlimited exports.",
      },
    ],
    body: `## Why Claude output needs a finishing step

Claude is good at producing structured writing: proposals, reports, summaries, documentation, plans. Responses usually arrive as Markdown, with headings, bullet lists, tables, code blocks and sometimes Mermaid diagrams or math.

That structure is exactly what you want in a document, but a chat window is not a document. Printing the conversation gives you interface elements, odd page splits and no branding. Pasting into a word processor often loses tables or turns headings into plain bold text.

The fix is to treat Claude's response as Markdown source and render it with a proper document template. This guide shows how, using the [AI Markdown to PDF tool](/tools/ai-markdown-to-pdf).

## Step 1: Ask Claude for document-ready Markdown

A few lines in your prompt save most of the cleanup later. For example:

\`\`\`markdown
Draft a project proposal for [client] based on the notes below.

Format rules:
- Output Markdown only, no text before the first heading
- Use ## for sections and ### for subsections
- Put the timeline and pricing in tables (max 4 columns)
- Insert <!-- pagebreak --> before the Pricing section
- Do not invent numbers; use [TBD] where information is missing

Notes:
[paste your notes]
\`\`\`

The "[TBD]" instruction is useful: it makes gaps visible instead of letting them be filled with plausible guesses.

## Step 2: Copy the raw Markdown

Use the copy button on Claude's response rather than selecting the rendered text. The copy button generally gives you the underlying Markdown. When you paste it, you should see \`##\`, \`-\` and \`|\` characters. If you see none of them, you have copied rendered text and some structure may be lost.

If Claude produced the document as a separate file or artifact, copy or download the Markdown source from there instead.

## Step 3: Paste and preview

Open the [AI Markdown to PDF tool](/tools/ai-markdown-to-pdf) and paste. No login is needed to preview. Rendering happens locally in your browser, and the preview is paginated, so you see the document page by page exactly as it will export.

Check in the preview:

- Headings render as headings, not as plain text
- Tables have aligned columns
- Code blocks are closed (if everything after a point is monospaced, a fence is missing)
- Mermaid diagrams render instead of showing an error
- Math renders cleanly with no stray \`$\` signs

## Step 4: Clean up the content

Claude's drafts are usually well organised, but a quick editing pass is still essential:

| What to look for | What to do |
| --- | --- |
| "Here's a draft…" or a closing offer to help | Delete it |
| \`[TBD]\` or other placeholders | Fill in real information |
| Specific figures, dates or references | Verify against your own sources |
| Repetition between sections | Merge or cut |
| Overly long sections | Split with \`###\` subheadings |
| Tone mismatched to the client | Edit directly or ask Claude for a revision |

If you make bigger changes, it is often faster to ask Claude for a revised section and paste just that section back in.

## Step 5: Choose a template and set headers and footers

Pick a template that matches the document type:

| Document | Template |
| --- | --- |
| Proposal or quote | [Client Proposal](/templates/client-proposal) |
| Analysis or status update | [Business Report](/templates/business-report) |
| Project plan | [Project Brief](/templates/project-brief) |
| Meeting summary | [Meeting Notes](/templates/meeting-notes) |

Then add a header and footer using tokens, for example \`{company} · {title}\` at the top and \`{date} · Page {page} of {pages}\` at the bottom. The [headers and footers guide](/resources/add-headers-and-footers) has more examples.

## Step 6: Fix pagination

Scroll through the paginated preview. Add a page break wherever a new section should start on a fresh page, or where a heading has been stranded at the bottom of a page. You can use \`<!-- pagebreak -->\`, \`\\newpage\`, or a line with only \`\\pagebreak\`.

## Step 7: Export the PDF

Export from the browser, which prints the exact paginated preview, so the file matches what you reviewed. A Server PDF (beta) export is also available. Free accounts get 3 PDF exports a month; Pro is unlimited. Neither plan adds a watermark.

## A worked example

Suppose you asked Claude to summarise a discovery call into a proposal. After pasting and cleaning, your Markdown might start like this:

\`\`\`markdown
## Overview

Northwind wants to reduce manual invoice handling before year end.

## Proposed approach

### Phase 1: Process review
- Map the current invoice workflow
- Identify steps suitable for automation

### Phase 2: Implementation
- Configure automated matching rules
- Train the finance team

<!-- pagebreak -->

## Pricing

| Phase | Duration | Fee |
| --- | --- | --- |
| Process review | 2 weeks | [TBD] |
| Implementation | 4 weeks | [TBD] |
\`\`\`

(The company name here is a placeholder for illustration.) With the Client Proposal template and a footer showing page numbers, that is a document ready to review and send once the fees are filled in.

## Checklist

- [ ] Prompted Claude for Markdown with a clear structure
- [ ] Copied raw Markdown, not rendered text
- [ ] Removed conversational intro and outro
- [ ] Replaced every placeholder and checked every fact
- [ ] Chose a template that fits the document
- [ ] Set header, footer and page numbers
- [ ] Added page breaks before key sections
- [ ] Reviewed every page in the preview before exporting

## Common pitfalls

**Exporting the first draft.** The PDF will look polished regardless of content quality. Read it as the client will.

**Mixing outputs from several chats.** Combining sections from different conversations often produces inconsistent heading levels and tone. Normalise headings before exporting.

**Ignoring diagram errors.** If a Mermaid block fails to render, ask Claude to fix the syntax and paste the corrected block back in.

For the same workflow with other assistants, see [AI Markdown to PDF](/resources/ai-markdown-to-pdf). For general conversion tips, read [Markdown to PDF](/resources/markdown-to-pdf).
`,
  },

  // 10. Add headers and footers
  {
    slug: "add-headers-and-footers",
    title: "How to Add Headers and Footers to a Document",
    description:
      "Learn how to add headers and footers with page numbers, dates, titles and company names to a document, with token examples, layouts and mistakes to avoid.",
    kind: "guide",
    category: "Guide",
    keyword: "add headers and footers",
    readingMinutes: 4,
    publishedAt: "2026-10-06",
    updatedAt: "2026-11-10",
    excerpt:
      "How to add consistent headers and footers, including page numbers and dates, to documents you write in Markdown or generate with AI.",
    relatedTool: { href: "/tools/markdown-to-pdf", label: "Markdown to PDF tool" },
    relatedTemplate: "business-report",
    faq: [
      {
        q: "Can I add headers and footers on the Free plan?",
        a: "Yes. Header and footer text, including tokens like {page} and {pages}, is available on the Free plan. Pro adds saved header and footer presets.",
      },
      {
        q: "How do I add 'Page X of Y'?",
        a: "Type Page {page} of {pages} in the footer. Both tokens are replaced automatically on every page of the exported PDF.",
      },
      {
        q: "Which tokens are available?",
        a: "{title}, {date}, {page}, {pages} and {company}. You can combine them with any plain text you like.",
      },
      {
        q: "Can I add a logo to the header?",
        a: "Templates support a logo. On Pro you can save a brand kit with your logo, colors and fonts so it is applied to every document automatically.",
      },
      {
        q: "Why can't I add headers and footers in Markdown itself?",
        a: "Markdown has no concept of pages, so it has no syntax for running headers or footers. They are part of the page layout, which is set by the template and export settings.",
      },
    ],
    body: `## Why headers and footers matter

Headers and footers are small, but they change how a document is perceived. A page number lets someone say "see page 4" on a call. A title in the header tells a reader which document a printed page belongs to. A company name and date make a document look official and make it clear which version is current.

They also solve practical problems. Printed pages get separated. PDFs get forwarded without context. Reviewers need to refer to specific places. A consistent header and footer handles all of this without anyone thinking about it.

## Why Markdown has no headers or footers

Markdown describes content: headings, paragraphs, lists, tables. It has no concept of pages, so there is no Markdown syntax for a running header, a footer or a page number. Those belong to the page layout, which is decided when the document is rendered.

That is why, when you convert Markdown to PDF, headers and footers are set in the export settings rather than in the text. In DocFinish, you set them once in the editor and they appear on every page of the paginated preview and the exported PDF.

## Step-by-step: adding headers and footers

1. Open the [Markdown to PDF tool](/tools/markdown-to-pdf) and paste your Markdown.
2. Choose a template, for example [Business Report](/templates/business-report).
3. Set the document title, so the \`{title}\` token has something to show.
4. Open the header and footer settings.
5. Type your header text using tokens, for example \`{company} · {title}\`.
6. Type your footer text, for example \`Page {page} of {pages}\`.
7. Scroll through the paginated preview to check every page.
8. Export the PDF.

## Available tokens

Tokens are placeholders in curly braces that are replaced automatically on each page.

| Token | Replaced with | Example output |
| --- | --- | --- |
| \`{title}\` | Document title | Q3 Operations Review |
| \`{date}\` | Document date | 12 November 2026 |
| \`{page}\` | Current page number | 3 |
| \`{pages}\` | Total number of pages | 11 |
| \`{company}\` | Your company name | Your company name |

Combine tokens with any text and separators such as \`·\`, \`|\` or \`—\`.

## Header and footer patterns by document type

Different documents need different information. These patterns work well as starting points:

| Document type | Header | Footer |
| --- | --- | --- |
| Client proposal | \`{company} · Proposal\` | \`{date} · Page {page} of {pages}\` |
| Business report | \`{company} · {title}\` | \`Confidential · Page {page} of {pages}\` |
| SOP | \`{title}\` | \`Version 1.2 · Effective {date} · Page {page}\` |
| Meeting notes | \`{title}\` | \`{date} · Page {page}\` |
| Academic paper | \`{title}\` | \`{page}\` |
| Invoice | \`{company}\` | \`Page {page} of {pages}\` |

A few principles behind these:

- **Use "Page X of Y" for anything that will be reviewed or signed.** It makes missing pages obvious.
- **Put identity in the header and logistics in the footer.** Readers look at the top for "what is this?" and the bottom for "where am I?".
- **Keep it short.** A header that wraps onto two lines looks cluttered and takes space from content.

## Example: a complete report setup

Here is a Markdown report body together with its header and footer settings.

Header: \`{company} · {title}\`
Footer: \`Confidential · {date} · Page {page} of {pages}\`

\`\`\`markdown
## Executive summary

Support response times improved across all regions this quarter.

## Findings

| Region | Median first response |
| --- | --- |
| EMEA | 2.1 hours |
| Americas | 1.8 hours |

<!-- pagebreak -->

## Appendix

Data covers tickets opened between 1 July and 30 September.
\`\`\`

Every page of the exported PDF shows the company and title at the top, and the date and page count at the bottom. The appendix starts on its own page thanks to the page break.

## Saving headers and footers for reuse

If you create documents regularly, retyping header and footer text gets old, and small inconsistencies creep in. On Pro, header and footer presets let you save a setup such as "Client proposal" or "Internal report" and apply it in one click. Combined with a saved brand kit (logo, colors, fonts), every document you export looks consistent. See [pricing](/pricing) for details.

## Checklist

- [ ] Document title set, so \`{title}\` is not blank
- [ ] Company name set, so \`{company}\` resolves
- [ ] Footer includes \`{page}\`, ideally with \`{pages}\`
- [ ] Header fits on one line
- [ ] No hard-coded dates that conflict with \`{date}\`
- [ ] Checked the first and last pages in the preview
- [ ] Confidentiality label added if the document is sensitive

## Common pitfalls

**Writing page numbers into the body.** Typing "Page 1" into your Markdown breaks as soon as content moves. Always use the \`{page}\` token.

**Forgetting to set the title.** If \`{title}\` is in your header but the title is empty, the header looks broken. Set the title first.

**Too much information.** A header with company, title, client, date, version and author is hard to read. Choose the two or three items the reader actually needs.

**Inconsistent setups across documents.** If every proposal has a different footer, your documents look less professional as a set. Pick a pattern and stick with it, or save it as a preset.

**Ignoring the cover page.** Look at how the header and footer appear on the first page of your template, and adjust the text if it competes with the title area.

## Related guides

- [Markdown to PDF](/resources/markdown-to-pdf) covers the full conversion workflow
- [How to turn Claude output into a PDF](/resources/claude-output-to-pdf) applies this to AI-generated documents
- [SOP template](/resources/sop-template) shows a version-aware footer in practice
`,
  },
];

export function getArticle(slug: string): ResourceArticle | undefined {
  return ARTICLES.find((article) => article.slug === slug);
}
