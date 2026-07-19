---
name: portfolio-bilingual-blog
description: >-
  Writes and edits MDX blog posts in this repo with English plus Traditional
  Chinese (Hong Kong). Use when creating or updating files in content/blog/,
  when the user asks for bilingual posts, zh-HK, or 繁體中文, or when aligning
  posts with BilingualParagraph / BilingualSolutionList / BilingualHeading /
  Table patterns.
---

# Portfolio bilingual blog (EN + zh-HK)

## Goal

Every blog post in `content/blog/` should support **English** and **香港繁體中文**.
Readers switch language with the **EN | 中文** toggle on the blog list and post pages
(default **EN**, persisted in `localStorage`). Content is stored bilingually in one MDX
file; the UI shows one language at a time.

## Frontmatter

- **title**: `English Title | 中文標題` (pipe separator; English first). List + post chrome pick one side by active lang.
- **tags**: Include both English keywords and 中文 where natural (e.g. `RAG, LLM, 檢索增強生成`).
- **date**: ISO date `YYYY-MM-DD`.

## Page title and headings

- **Do not** put a markdown `#` H1 in the body — the post page already renders `metadata.title`.
- **Prefer** `<BilingualHeading />` for H2/H3 (and H4 if needed):

```mdx
<BilingualHeading level={2} en="Why I built it" zh="為何要自己做" />
```

- Anchor `id` is derived from the **English** label (stable across language switch).
- Legacy markdown `## English · 中文` still works (auto-split), but migrate to `BilingualHeading` when editing a post.

## MDX components to use

### `<BilingualHeading />`

```mdx
<BilingualHeading level={2} en="Section title" zh="小節標題" />
<BilingualHeading level={3} en="Subsection" zh="子節" />
```

### `<BilingualParagraph />`

```mdx
<BilingualParagraph
  en="English paragraph."
  zh="香港繁體中文段落。"
/>
```

### `<BilingualSolutionList />`

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

Prefer explicit bilingual objects (best with the language toggle):

```mdx
<Table
  caption={{ en: "Core concepts", zh: "核心概念" }}
  columns={[
    { key: "term", header: { en: "Term", zh: "術語" } },
    { key: "meaning", header: { en: "Meaning", zh: "含義" } },
  ]}
  data={[
    {
      term: { en: "RAG", zh: "檢索增強生成" },
      meaning: {
        en: "Retrieve documents, then generate.",
        zh: "先檢索文件，再生成答案。",
      },
    },
  ]}
/>
```

Legacy strings still resolve when possible:

- Labels: `English · 中文` or `English | 中文`
- Prose cells: `English sentence. 中文句子。` (EN must end with `.!?…`, then CJK)

When editing a post, migrate tables to `{ en, zh }` objects.

Image alts may stay as `English · 中文`; the figcaption follows the active language.

## Language quality (zh-HK)

- Use **香港書面語**：自然、通順；避免過度簡體詞彙或台灣用語（除非刻意對照）。
- Technical terms: keep common English acronyms (RAG, LLM, API) where standard in HK tech writing; gloss in 中文 on first mention if needed.
- **Coding comments** in project code stay **English** (repo convention); blog prose follows this skill.

## When English-only sections are acceptable

- Very long FAQ or legal-style tables: still add **zh-HK** via `{ en, zh }` or a following `<BilingualParagraph>` summary.
- If the user explicitly asks for English-only, note the exception in the PR/summary — default remains bilingual.

## Checklist before finishing a post

- [ ] `title` in frontmatter is bilingual (`EN | 中文`).
- [ ] No markdown `#` H1 in the body (page chrome shows title).
- [ ] Major sections use `<BilingualHeading />` (or legacy `## EN · 中文`).
- [ ] Narrative uses `<BilingualParagraph>` / `<BilingualSolutionList>`.
- [ ] Tables use `{ en, zh }` for caption, headers, and cells (or legacy splitters).
- [ ] MDX validates (no broken JSX props; string quotes escaped inside attributes).

## Reference post

Use `content/blog/building-my-bookkeeping-app.mdx` as the canonical example for language-toggle-ready structure.
