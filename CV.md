# 楊泳文 Bobby Yeung
**Software Developer｜Hong Kong（Kowloon）｜約 5 年經驗**

- **Email**: bobbyyeung81@gmail.com
- **Phone**: +852 6674 7755
- **LinkedIn**: https://www.linkedin.com/in/bobby-y-2465b0189
- **GitHub**: https://github.com/bobbyyng

---

## 個人概要（Summary）
軟件開發工程師，約 5 年經驗，主要負責後端／平台系統開發，為教育及電商（B2B/B2C）客戶建立高可用、可擴展嘅 RESTful services 及內部系統。熟悉 AI/RAG agent、入學/營運系統、digital signage（CMS + IoT 顯示器同步）同電商平台，能處理複雜 business rules、RBAC 權限模型、tenant/branch 級資料隔離及第三方整合。技術重點包括 TypeScript/PHP、MySQL/PostgreSQL、AWS、Docker、Terraform，具備雲端部署、CI/CD 同跨職能協作（PM／產品／前端）經驗，交付穩定且效能可靠嘅產品級系統。

---

## 核心技能（Skills）
- **Backend**: TypeScript, PHP, Python
- **Framework**: NestJS, Hono, Laravel, Yii2, WordPress
- **AI**: RAG, LangChain, LangGraph
- **Cloud & DevOps**: AWS, Docker, SST, Terraform
- **Database**: PostgreSQL, MySQL, Redis, MongoDB

---

## 工作經驗（Experience）

> 註：以下公司名稱／職稱可按你實際履歷補回（目前先用 placeholder）。如你提供公司名、職稱同月份，我可以幫你再「精準改寫」同「排版成一頁版」。

### Software Developer｜【公司名稱】｜Hong Kong｜【YYYY-MM】–【YYYY-MM / Present】
- 負責設計、開發及維護後端服務與內部平台，為教育及電商客戶交付可擴展 REST API。
- 與 PM／產品／前端協作定義 API contract、validation、error format，確保整合順暢。
- 針對 legacy business logic 進行 code review、定位 root cause、refactor，並以 regression-safe 方式修復關鍵 bugs。
- 設計並落實 **RBAC 權限控制**、**tenant/branch 資料隔離**、audit logging 等安全與合規需求。
- 參與雲端部署及基礎設施配置（AWS／Docker／IaC），提升系統穩定性與交付效率。

---

## 精選項目（Selected Projects）

### Catalo Health AI Agent（AI RAG Agent｜2025）
**重點**：RAG + 電商/會員流程整合（問卷／報告 → 結構化健康 insights → 個人化推薦 → 加入購物車），並提供 Admin Panel 管理 knowledge base。
- 設計 **SST monorepo** 架構，將 chat API、問卷/報告服務、knowledge base、admin endpoints 模組化，部署至 AWS（CloudFront → Lambda → S3/EC2 + Docker）。
- 以 **Hono** 建立 HTTP APIs，處理 chat widget、問卷提交、健康報告更新及電商 cart integration。
- 透過 **LangChain + Qwen** 將健康資料轉成可重複更新嘅「health objects」（摘要／運動／營養需求／產品匹配）。
- 建立文件 ingestion pipeline（PDF/Word/圖片/CSV），向量化並寫入 **Qdrant**，支援 retrieval-augmented generation 提升回答準確度。
- 實作 **Better Auth**（user/admin、session、role-based access），保護健康資料同後台功能。
**Tech**: TypeScript, Hono, SST, LangChain, RAG, Qdrant, PostgreSQL, AWS, Docker, Terraform

### Pro-lite Digital Board Web Application（B2B SaaS｜2024）
**重點**：多層級 CMS + IoT LCD 顯示器快速同步、multi-role RBAC、audit logging、MySQL schema/index 優化。
- 以 **NestJS + MySQL** 設計模組化 backend（users/regions/corporates/stores/templates/menus/devices/logs）。
- 實作多層 **RBAC**（Super/Regional/Corporate/Store Admin），以 scope 控制 region/corporate/store 可見與可操作範圍。
- 建立低延遲更新機制，令 CMS 更新後顯示器可於約 **10 秒**內刷新內容。
- 加入 time zone-aware 處理及 **30 日 audit log retention**，提升可維護性與可追溯性。
**Tech**: TypeScript, NestJS, MySQL, Docker, REST API, JWT, Swagger/OpenAPI

### ABC Pathway Admission System（Education｜2023–2025）
**重點**：branch 級資料隔離、維護/修復 legacy 邏輯、營運流程自動化（庫存預測、支付、預約、評估、證書、分析）。
- 維護並增強入學系統，快速定位及修復影響營運嘅 bugs，並針對複雜 legacy 邏輯做 targeted refactor。
- 設計並落實 **兩間分校資料完全隔離**，確保跨 branch 無法互相存取資料。
- 開發 RESTful APIs 支援 mobile/web：預約安排、評估數碼化、e-certificate 自動發放、家長端進度圖表與分析。
- 建立庫存預測功能，分析現有入讀及未來預約，產出建議訂貨量並保留 audit trail，減少人手流程與風險。
**Tech**: PHP, Yii2, MySQL, REST API

### Zinomall E-Commerce（WooCommerce｜2021–2025）
**重點**：客製化複雜 promotion/discount engine、效能優化、legacy plugin code 分析與穩定性提升。
- 深入研究 WooCommerce/外掛同 DB 結構，實作多種 **複雜折扣規則**（Buy X get X% off、welcome/referral、shipping adjustment 等）。
- 處理多重折扣疊加（coupon/手動/自動）下嘅計算正確性與測試覆蓋，避免購物車金額錯誤。
- 針對 WordPress plugin/filter 行為做 code review 與 refactor，改善效能同穩定性。
- 將設計稿落地成 UI（HTML/CSS/JS），並建立可重用 CMS 模組令客戶可自助更新內容。
**Tech**: PHP, WordPress, WooCommerce, MySQL, JavaScript, HTML, CSS

---

## 教育（Education）
- **香港理工大學（Hong Kong Polytechnic University）**｜BSc (HONS) Financial Technology｜2020–2022
- **香港專業教育學院（IVE）**｜Higher Diploma in Financial Technology｜2018–2020

---

## 語言（Languages）
- **廣東話**：母語
- **英文**：日常工作溝通
- **普通話**：日常溝通


