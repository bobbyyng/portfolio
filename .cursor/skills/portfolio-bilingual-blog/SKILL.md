---
name: portfolio-bilingual-blog
description: >-
  Writes and edits MDX blog posts in this repo with English plus Traditional
  Chinese (Hong Kong). Use when creating or updating files in content/blog/,
  when the user asks for bilingual posts, zh-HK, or 繁體中文, or when aligning
  posts with BilingualParagraph / BilingualSolutionList / Table patterns.
---

# Portfolio bilingual blog (EN + zh-HK)

## Goal

Every blog post in `content/blog/` should present **English** and **香港繁體中文** together: readers get full technical English plus accurate Hong Kong–style Traditional Chinese, using the MDX components already registered in `components/mdx-components.tsx`.

## Frontmatter

- **title**: `English Title | 中文標題` (pipe separator; English first).
- **tags**: Include both English keywords and 中文 where natural (e.g. `RAG, LLM, 檢索增強生成`).
- **date**: ISO date `YYYY-MM-DD`.

## Page title and headings

- **H1 (`#`)**: `English · 中文` or `English | 中文` — match the tone of `rag-retrieval-augmented-generation.mdx`.
- **H2 / H3**: Prefer `## English section · 中文小節` so the table of contents stays readable in both languages.

## MDX components to use

### `<BilingualParagraph />`

Use for narrative blocks (intro, takeaway, any paragraph that should appear in both languages).

```mdx
<BilingualParagraph
  en="English paragraph."
  zh="香港繁體中文段落。"
/>
```

- `en`: primary (slightly stronger styling in the UI).
- `zh`: secondary (muted); full sentence, not keywords only.

### `<BilingualSolutionList />`

Use for bullet-style benefits, steps, or trade-offs with parallel EN/zh labels.

```mdx
<BilingualSolutionList
  items={[
    {
      enLabel: "Short label",
      en: "English detail.",
      zhLabel: "短標籤",
      zh: "中文說明。",
    },
  ]}
/>
```

### `<Table />` (DataTable)

- **caption**: `English · 中文` or `English | 中文`.
- **column headers**: Bilingual where helpful, e.g. `{ key: "action", header: "Stage · 階段" }`.
- **Cell text**: Either separate columns for EN/zh, or **one column** with **English sentence first, then Chinese in the same string** (see `rag-retrieval-augmented-generation.mdx` Key Terms).

Prefer one pattern per table for consistency.

## Language quality (zh-HK)

- Use **香港書面語**：自然、通順；避免過度簡體詞彙或台灣用語（除非刻意對照）。
- Technical terms: keep common English acronyms (RAG, LLM, API) where standard in HK tech writing; gloss in 中文 on first mention if needed.
- **Coding comments** in project code stay **English** (repo convention); blog prose follows this skill.

## When English-only sections are acceptable

- Very long FAQ or legal-style tables: still add **zh-HK** in the same cell or a following `<BilingualParagraph>` summary.
- If the user explicitly asks for English-only, note the exception in the PR/summary — default remains bilingual.

## Checklist before finishing a post

- [ ] `title` in frontmatter is bilingual.
- [ ] H1 and major H2s include 中文 (or each section opens with `<BilingualParagraph>`).
- [ ] No long stretches of English-only body without a zh-HK counterpart (components or inline).
- [ ] Tables have bilingual `caption` or bilingual row content.
- [ ] MDX validates (no broken JSX props; string quotes escaped inside attributes).

## Reference post

Use `content/blog/rag-retrieval-augmented-generation.mdx` as the canonical example for structure and component usage.
