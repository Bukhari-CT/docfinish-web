/**
 * Starter Markdown documents for each DocFinish template.
 * Content is fictional; edit freely.
 */

export type TemplateId =
  | "client-proposal"
  | "business-report"
  | "project-brief"
  | "meeting-notes"
  | "sop"
  | "resume"
  | "invoice"
  | "academic-paper";

export const STARTERS: Record<TemplateId, string> = {
  "client-proposal": `# Website Redesign & Customer Portal

A proposal to modernize Northwind Studio's digital presence and launch a self-service client portal.

**Prepared for:** Hannah Okafor, Managing Director, Northwind Studio

**Prepared by:** Daniel Reyes, Engagement Lead, Brightline Digital

**Date:** March 4, 2026 · **Proposal ref:** BD-2026-031 · **Valid until:** April 3, 2026

## Executive summary

Northwind Studio has grown from a six-person architecture practice into a 40-person, multi-city studio, but its website and client communication tools have not kept pace. Prospective clients struggle to find relevant case studies, the contact form generates a high volume of unqualified leads, and existing clients rely on email threads to request drawings, review milestones, and approve change orders.

Brightline Digital proposes a 14-week engagement to redesign the public website and launch a secure client portal. The new site will showcase Northwind's portfolio by sector and region, while the portal will give clients a single place to track project milestones, download deliverables, and sign off on approvals.

We estimate the work will reduce inbound email volume for project managers by **30–40%**, increase qualified enquiries by **25%** within six months of launch, and give leadership clear visibility into client engagement for the first time.

The total investment is **$73,000**, delivered in four phases with fixed-fee pricing and milestone-based payments.

## Objectives

1. **Showcase expertise.** Present the portfolio by sector (residential, civic, hospitality) with filterable, image-rich case studies.
2. **Improve lead quality.** Replace the generic contact form with a guided enquiry flow that captures budget, timeline, and project type.
3. **Streamline client communication.** Give clients a secure portal for milestones, files, and approvals.
4. **Empower the team.** Let marketing staff publish and update content without developer support.
5. **Meet modern standards.** Achieve WCAG 2.2 AA accessibility, a Lighthouse performance score above 90, and full mobile parity.

## Scope

The engagement covers the following deliverables. Anything not listed here is out of scope and can be quoted separately.

| # | Deliverable | Description | Phase |
|---|-------------|-------------|-------|
| D1 | Discovery report | Stakeholder interviews, analytics review, competitor audit, and prioritized requirements | Discovery |
| D2 | Information architecture | Sitemap, content model, and navigation structure | Discovery |
| D3 | Design system | Typography, color, components, and responsive layouts in Figma | Design |
| D4 | High-fidelity designs | Up to 12 unique page templates plus portal screens | Design |
| D5 | Marketing website | Headless CMS build with portfolio filtering and guided enquiry flow | Build |
| D6 | Client portal | Authenticated portal with milestones, file library, and e-approvals | Build |
| D7 | QA & launch | Cross-browser testing, accessibility audit, migration, and go-live | Launch |
| D8 | Training & handover | Two training sessions, editor guide, and 30 days of post-launch support | Launch |

## Approach

We work in four overlapping phases, with a working session at the end of each phase so Northwind can review progress and steer priorities before we move on.

\`\`\`mermaid
flowchart LR
    A[Discovery<br/>Interviews & audit] --> B[Design<br/>System & templates]
    B --> C[Build<br/>Website & portal]
    C --> D[Launch<br/>QA, migration, training]
    B -. feedback .-> A
    C -. feedback .-> B
\`\`\`

**Discovery (weeks 1–3).** We interview partners, project managers, and three to five existing clients to understand how they use the current site and what slows them down. We pair this with a review of analytics and a scan of five peer studios.

**Design (weeks 3–7).** We build a flexible design system first, then apply it to page templates and portal screens. Northwind reviews clickable prototypes at two checkpoints.

**Build (weeks 6–12).** Development runs in two-week sprints with a staging environment that Northwind can review at any time. The portal integrates with your existing project management tool through its API.

**Launch (weeks 12–14).** We migrate content, run accessibility and performance audits, train your team, and go live in a scheduled low-traffic window.

## Timeline

| Milestone | Target date | Owner |
|-----------|-------------|-------|
| Kickoff workshop | March 23, 2026 | Brightline + Northwind |
| Discovery report approved | April 10, 2026 | Northwind |
| Design system sign-off | April 24, 2026 | Northwind |
| High-fidelity designs approved | May 8, 2026 | Northwind |
| Staging site feature-complete | June 12, 2026 | Brightline |
| User acceptance testing complete | June 19, 2026 | Northwind |
| Go-live | June 26, 2026 | Brightline |

## Investment

All phases are priced as fixed fees. Third-party licensing (CMS hosting, e-signature service) is billed directly to Northwind at cost.

| Phase | Effort | Fee (USD) |
|-------|--------|----------:|
| Discovery | 3 weeks | $9,600 |
| Design | 4 weeks | $18,400 |
| Build — website and portal | 6 weeks | $32,800 |
| QA, launch & training | 2 weeks | $7,200 |
| Project management | Throughout | $5,000 |
| **Total** | **14 weeks** | **$73,000** |

**Payment schedule**

| Milestone | Share | Amount |
|-----------|------:|-------:|
| On signature | 30% | $21,900 |
| Design sign-off | 40% | $29,200 |
| Go-live | 30% | $21,900 |
| **Total** | **100%** | **$73,000** |

## Assumptions

- Northwind will nominate a single decision-maker with authority to approve deliverables within five business days.
- Existing photography and project descriptions will be supplied by Northwind; copywriting is limited to page structure and microcopy.
- The project management tool exposes a documented REST API with read access to milestones and files.
- Up to two rounds of revisions are included per design deliverable.
- Hosting will use a managed cloud provider selected jointly during Discovery.

## Next steps

- [x] Initial discovery call (February 18)
- [x] Proposal delivered
- [ ] Review proposal with Northwind partners
- [ ] Confirm scope and sign agreement
- [ ] Issue first invoice and schedule kickoff workshop
- [ ] Share access to analytics and project management tool

## Acceptance

By signing below, both parties agree to the scope, timeline, and investment described in this proposal. A detailed statement of work will follow on signature.

| | Northwind Studio | Brightline Digital |
|---|---|---|
| **Name** | Hannah Okafor | Daniel Reyes |
| **Title** | Managing Director | Engagement Lead |
| **Signature** | | |
| **Date** | | |
`,

  "business-report": `# Quarterly Business Report — Q3 2026

Performance review, market analysis, and priorities for the quarter ahead.

**Prepared for:** Board of Directors, Lumen Supply Co.

**Prepared by:** Priya Natarajan, Head of Strategy & Finance

**Date:** October 14, 2026 · **Period:** July 1 – September 30, 2026

## Executive summary

Lumen Supply Co. delivered its strongest quarter to date. Revenue reached **$12.4M**, up 18% year over year and 6% ahead of plan, driven by continued growth in the subscription channel and a successful expansion into the Pacific Northwest. Gross margin improved by 2.1 points to 41.3% as freight costs normalized and the new Reno fulfillment center reached full utilization.

Two areas need attention. Customer acquisition cost rose 12% as paid social became more competitive, and wholesale revenue declined for the second consecutive quarter. We recommend reallocating marketing spend toward referral and retention programs and restructuring wholesale terms before the holiday season.

## Key metrics

| Metric | Q3 2025 | Q2 2026 | Q3 2026 | YoY change |
|--------|--------:|--------:|--------:|-----------:|
| Revenue | $10.5M | $11.6M | $12.4M | +18% |
| Gross margin | 39.2% | 40.4% | 41.3% | +2.1 pts |
| Operating income | $1.1M | $1.4M | $1.7M | +55% |
| Active subscribers | 48,200 | 57,900 | 61,300 | +27% |
| Customer acquisition cost | $41 | $44 | $46 | +12% |
| Net revenue retention | 104% | 107% | 108% | +4 pts |
| Order fulfillment time | 2.8 days | 2.1 days | 1.9 days | −32% |

## Revenue analysis

Subscription revenue grew to 58% of total revenue, continuing a deliberate shift toward predictable, recurring income. The new "Studio Bundle" tier, launched in July, accounted for 4,100 new subscribers and has the highest average order value of any plan at $64 per month.

Direct e-commerce sales were flat quarter over quarter but up 9% year over year, with strong performance during the August back-to-school promotion. Wholesale revenue fell 7% as two regional retail partners reduced orders in response to their own inventory corrections.

\`\`\`mermaid
pie showData
    title Revenue mix, Q3 2026 ($M)
    "Subscriptions" : 7.2
    "Direct e-commerce" : 3.4
    "Wholesale" : 1.3
    "Marketplace" : 0.5
\`\`\`

## Operations

The Reno fulfillment center, opened in Q1, now handles 46% of order volume. Combined with the switch to a regional carrier network, this cut average fulfillment time to 1.9 days and reduced shipping cost per order by $0.84. Inventory turns improved from 5.2 to 5.9, and stock-outs on top-50 SKUs fell to under 1%.

Headcount grew from 142 to 151, mostly in customer support and warehouse operations. Employee engagement scores remained steady at 78, with notable improvement in the fulfillment team after the introduction of a shift-preference system.

## Customer & market

Net Promoter Score rose to 52 (from 47), and subscriber churn fell to 3.1% per month. Customer feedback highlights delivery speed and packaging quality as key strengths, while product discovery on the website remains the most common complaint.

The broader market for premium home and office supplies grew an estimated 6% this year. Two new direct-to-consumer competitors launched in Q3 with aggressive introductory pricing, which partly explains the rise in paid acquisition costs.

## Risks

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| Rising paid acquisition costs | High | Medium | Shift budget to referral program; improve conversion rate |
| Wholesale partner concentration | Medium | Medium | Diversify to 3–5 new regional retailers; revise minimum orders |
| Holiday peak capacity | Medium | High | Add seasonal staff from October; pre-position inventory in Reno |
| Supplier price increases | Medium | Medium | Lock in Q4–Q1 pricing with top 10 suppliers |
| Data privacy regulation changes | Low | High | Complete consent-management audit by December |

## Recommendations

1. **Rebalance acquisition spend.** Move 25% of paid social budget into the referral program, which currently delivers customers at a $19 CAC.
2. **Restructure wholesale terms.** Introduce tiered pricing and lower minimum orders to attract smaller independent retailers.
3. **Invest in product discovery.** Fund a six-week sprint to improve site search and category navigation ahead of the holiday season.
4. **Prepare for peak.** Approve $240K for seasonal staffing and overflow storage to protect fulfillment speed in November and December.
5. **Expand Studio Bundle.** Develop a team-plan variant of the Studio Bundle aimed at small offices, targeting a Q1 2027 launch.

<!-- pagebreak -->

## Appendix

### A. Revenue by region

| Region | Q3 2026 revenue | Share | YoY change |
|--------|----------------:|------:|-----------:|
| West | $4.6M | 37% | +24% |
| Northeast | $3.3M | 27% | +11% |
| Midwest | $2.4M | 19% | +9% |
| South | $2.1M | 17% | +26% |
| **Total** | **$12.4M** | **100%** | **+18%** |

### B. Methodology

Financial figures are unaudited and prepared on an accrual basis. Subscriber counts reflect active, paying accounts at quarter end. Net revenue retention is calculated on a trailing twelve-month cohort basis. Market growth estimates are drawn from internal analysis of publicly available industry data.

### C. Glossary

- **CAC** — Customer acquisition cost: total sales and marketing spend divided by new customers acquired.
- **NRR** — Net revenue retention: revenue from an existing cohort this period divided by revenue from the same cohort a year earlier.
- **NPS** — Net Promoter Score, from a quarterly survey of 2,500 randomly selected customers.
`,

  "project-brief": `# Project Brief: Mobile Checkout Revamp

**Project lead:** Marcus Lindqvist · **Sponsor:** Elena Varga, VP Product · **Status:** Approved · **Last updated:** September 8, 2026

## Overview

Orchard Market's mobile app now drives 64% of all orders, but mobile checkout converts at just 2.4%, compared with 3.9% on desktop. Session recordings and support tickets point to three main issues: a five-step checkout flow, unreliable saved-payment handling, and confusing delivery-slot selection.

This project will redesign and rebuild the mobile checkout experience on iOS and Android, reducing it to a two-step flow with express payment options and a clearer delivery-slot picker.

## Goals

- Raise mobile checkout conversion from 2.4% to at least 3.4%.
- Reduce median time-to-purchase from 3 min 40 s to under 90 seconds.
- Cut checkout-related support tickets by half.
- Ship a reusable checkout component library that the web team can adopt in 2027.

## Success metrics

| Metric | Baseline | Target | Measured by |
|--------|---------:|-------:|-------------|
| Mobile checkout conversion | 2.4% | 3.4% | Product analytics, 30-day rolling |
| Median time to purchase | 220 s | 90 s | Funnel timing events |
| Checkout support tickets / week | 310 | 150 | Help desk tagging |
| Express payment adoption | 0% | 40% | Payment provider reports |
| Crash-free checkout sessions | 99.1% | 99.8% | Crash reporting |

## Scope

**In scope**

- Redesigned two-step checkout (review & pay, confirmation) on iOS and Android
- Express payment with device wallets and saved cards
- New delivery-slot picker with real-time availability
- Address autocomplete and validation
- A/B test framework for staged rollout

**Out of scope**

- Changes to the web checkout (planned for 2027)
- New payment providers or buy-now-pay-later options
- Loyalty points redemption at checkout
- Changes to pricing, promotions, or tax logic

## Stakeholders

| Name | Role | Responsibility |
|------|------|----------------|
| Elena Varga | VP Product (Sponsor) | Final approval, budget, priority calls |
| Marcus Lindqvist | Product Manager (Lead) | Scope, roadmap, day-to-day decisions |
| Aisha Bello | Design Lead | UX research, interaction and visual design |
| Tom Hargreaves | Engineering Manager, Mobile | Delivery, technical architecture |
| Grace Liu | Payments Engineer | Payment integration and compliance |
| Samuel Ortiz | Customer Support Lead | Ticket analysis, launch readiness |

## Timeline

\`\`\`mermaid
gantt
    title Mobile Checkout Revamp
    dateFormat YYYY-MM-DD
    axisFormat %b %d
    section Discovery
    Research & audit        :done,    d1, 2026-09-07, 14d
    section Design
    Flows & prototypes      :active,  d2, 2026-09-21, 21d
    Usability testing       :         d3, after d2, 7d
    section Build
    Checkout & payments     :         b1, 2026-10-12, 35d
    Delivery-slot picker    :         b2, 2026-10-19, 28d
    section Launch
    Staged rollout          :         l1, 2026-11-23, 21d
\`\`\`

## Risks

- **Payment integration delays.** Device-wallet certification can take up to three weeks. *Mitigation:* start certification in parallel with design.
- **Holiday code freeze.** A freeze begins December 15. *Mitigation:* reach 100% rollout by December 14 or hold at 50% until January.
- **Delivery-slot API performance.** The current API responds slowly under load. *Mitigation:* add caching and agree on a response-time budget with the logistics team.
- **Scope creep.** Requests for loyalty and promotions features are likely. *Mitigation:* log them for a follow-up phase; sponsor approves any scope change.

## Open questions

- [ ] Should guest checkout be supported in the first release, or follow later?
- [ ] Which markets will receive the staged rollout first?
- [x] Will the design system team own the new checkout components? *(Yes — confirmed Sept 4.)*
- [ ] What is the fallback if a device wallet payment fails mid-transaction?
- [ ] Do we need legal review of the new consent wording for saved cards?
`,

  "meeting-notes": `# Weekly Sync — Platform Team

**Date:** Tuesday, November 10, 2026 · 10:00–10:45 · **Location:** Room 4B / video call

**Facilitator:** Nadia Rahman · **Note-taker:** Owen Clarke

**Attendees:** Nadia Rahman, Owen Clarke, Lucía Fernández, Ben Adeyemi, Mei Tanaka · **Apologies:** Chris Walsh

## Agenda

1. Release 4.2 status
2. On-call load and incident review
3. Q1 planning: database migration
4. Any other business

## Discussion

### 1. Release 4.2 status

Lucía reported that 4.2 is feature-complete and in final QA. Two blocking bugs remain: a timezone issue in scheduled exports and a memory leak in the notification worker. Ben has a fix for the leak in review. The team agreed to hold the release by two days instead of shipping with known issues.

### 2. On-call load and incident review

Mei shared that pages are up 35% over the past month, mostly from noisy disk-space alerts on the analytics cluster. Last Thursday's 22-minute API outage was traced to an expired internal certificate. The group agreed that certificate expiry monitoring is overdue and that alert thresholds need tuning.

### 3. Q1 planning: database migration

Owen presented two options for moving to the new managed database: a big-bang cutover over a weekend, or a phased migration by service over six weeks. The phased approach carries less risk but needs dual-write support. Most of the team preferred the phased approach, provided the dual-write work fits within the sprint budget.

### 4. Any other business

Nadia reminded everyone that self-assessments for the year-end review are due November 20. Ben will be on leave from November 23–27.

## Decisions

> - Release 4.2 moves to **Thursday, November 12**, once both blocking bugs are fixed and verified.
> - The database migration will follow the **phased approach**, subject to a dual-write estimate.
> - Disk-space alert thresholds on the analytics cluster will be raised from 80% to 90%.

## Action items

| Owner | Task | Due |
|-------|------|-----|
| Ben Adeyemi | Merge notification worker memory-leak fix | Nov 11 |
| Lucía Fernández | Fix timezone bug in scheduled exports and re-run QA | Nov 11 |
| Mei Tanaka | Add certificate-expiry monitoring for internal services | Nov 17 |
| Mei Tanaka | Tune analytics cluster disk-space alerts | Nov 13 |
| Owen Clarke | Estimate dual-write effort for the phased migration | Nov 17 |
| Nadia Rahman | Share Q1 planning draft with engineering leadership | Nov 19 |

**Checklist**

- [x] Circulate last week's notes
- [ ] Merge memory-leak fix
- [ ] Fix scheduled-export timezone bug
- [ ] Add certificate-expiry monitoring
- [ ] Tune disk-space alerts
- [ ] Dual-write estimate
- [ ] Q1 planning draft to leadership

## Next meeting

**Tuesday, November 17, 2026 · 10:00** — Facilitator: Owen Clarke. Agenda items to Owen by Monday noon.
`,

  "sop": `# Standard Operating Procedure: Customer Refund Processing

| Field | Value |
|-------|-------|
| **Document ID** | SOP-FIN-014 |
| **Version** | 2.3 |
| **Owner** | Rachel Kim, Customer Operations Manager |
| **Approved by** | Victor Mensah, Finance Director |
| **Effective date** | October 1, 2026 |
| **Next review** | April 1, 2027 |

## 1. Purpose

This procedure describes how Halcyon Outdoor Gear reviews, approves, and issues customer refunds. It ensures refunds are handled consistently, on time, and in line with our returns policy, consumer protection requirements, and internal financial controls.

## 2. Scope

This SOP applies to all refund requests for orders placed through the online store, the mobile app, and phone orders. It covers full and partial refunds to the original payment method and store credit.

It does **not** cover wholesale account credits, chargebacks initiated by the card issuer, or warranty replacements, which follow SOP-FIN-019 and SOP-CS-007 respectively.

## 3. Roles and responsibilities

| Role | Responsibilities |
|------|------------------|
| Customer Support Agent | Receives requests, verifies eligibility, prepares refund cases up to $250 |
| Support Team Lead | Approves refunds from $250 to $1,000 and all policy exceptions |
| Finance Analyst | Approves refunds above $1,000, reconciles refunds weekly |
| Warehouse Returns Clerk | Inspects returned items and records condition in the order system |
| Customer Operations Manager | Owns this SOP, monitors compliance, handles escalations |

## 4. Definitions

- **Refund case** — A record in the help desk linking the customer's request, order, return, and approval.
- **Eligible return** — An item returned within 30 days of delivery, unused, with original tags or packaging.
- **Partial refund** — A refund of less than the full item price, for example when an item is returned damaged or incomplete.
- **Store credit** — A non-cash balance applied to the customer's account, valid for 24 months.
- **Policy exception** — Any refund granted outside the standard returns policy.

## 5. Prerequisites

Before processing any refund, confirm the following:

- [ ] You have an active help desk account with the *Refunds* permission.
- [ ] You have completed the annual Payments & Fraud Awareness training.
- [ ] The order exists in the order management system and is marked *Delivered*.
- [ ] The customer's identity has been verified (order number plus email or phone).
- [ ] No open chargeback exists for the order.

## 6. Procedure

\`\`\`mermaid
flowchart TD
    A[Refund request received] --> B{Within 30 days<br/>and eligible?}
    B -- No --> C[Escalate to Team Lead<br/>for exception review]
    B -- Yes --> D[Issue return label]
    C -->|Approved| D
    C -->|Declined| X[Notify customer<br/>and close case]
    D --> E[Item received and inspected]
    E --> F{Condition OK?}
    F -- Yes --> G[Full refund]
    F -- No --> H[Partial refund or store credit]
    G --> I{Amount above threshold?}
    H --> I
    I -- Yes --> J[Secondary approval]
    I -- No --> K[Process refund in payment system]
    J --> K
    K --> L[Confirm with customer and close case]
\`\`\`

1. **Log the request**
   1. Create a refund case in the help desk, or convert the customer's ticket into one.
   2. Link the order number and attach any photos or messages from the customer.
   3. Set the case priority to *Normal*, or *High* if the order value exceeds $500.

2. **Check eligibility**
   1. Confirm the request is within 30 days of the delivery date.
   2. Check the item is not on the non-returnable list (custom orders, opened consumables, gift cards).
   3. If the request is ineligible, escalate to the Support Team Lead for an exception review.

> **Note:** Customers in jurisdictions with longer statutory return periods are always entitled to those periods. The order system flags these automatically.

3. **Arrange the return**
   1. Generate a prepaid return label from the order system.
   2. Email the label and packing instructions using the *Return Approved* template.
   3. Set the case status to *Awaiting return*.

4. **Inspect the item**
   1. The Warehouse Returns Clerk inspects the item within two business days of receipt.
   2. Record the condition as *As new*, *Minor wear*, or *Damaged*, with photos.
   3. Restock, refurbish, or dispose of the item according to the inspection result.

5. **Calculate the refund**
   1. *As new*: full item price plus original shipping if the return is due to our error.
   2. *Minor wear*: 80% of the item price, or full store credit at the customer's choice.
   3. *Damaged*: decided by the Team Lead on a case-by-case basis.

6. **Obtain approval**
   1. Refunds up to $250: the agent may approve.
   2. $250 to $1,000: Support Team Lead approval required.
   3. Above $1,000: Finance Analyst approval required in addition to the Team Lead.

> **Warning:** Never refund to a payment method other than the one used for the original purchase. Requests to redirect a refund to a different card or account are a common fraud pattern and must be escalated to Finance.

7. **Process the refund**
   1. Issue the refund through the payment system using the order's original transaction.
   2. Record the refund ID in the case.
   3. For store credit, apply the balance to the customer's account and note the expiry date.

8. **Close the case**
   1. Send the *Refund Issued* email, including the expected processing time (3–10 business days).
   2. Set the case status to *Resolved* and tag the refund reason.

## 7. Quality checks

| Check | Frequency | Responsible | Target |
|-------|-----------|-------------|--------|
| Refunds issued within 5 business days of inspection | Weekly | Customer Operations Manager | ≥ 95% |
| Approval thresholds followed | Weekly sample of 25 cases | Finance Analyst | 100% |
| Refund ledger reconciled to payment system | Weekly | Finance Analyst | No unreconciled items |
| Customer satisfaction on refund cases | Monthly | Support Team Lead | ≥ 4.5 / 5 |

> **Note:** Any case failing a quality check must be reviewed with the agent within five business days and logged in the training tracker.

## 8. Related documents

- SOP-FIN-019 — Chargeback Handling
- SOP-CS-007 — Warranty Claims
- Returns Policy (customer-facing), version 5

## 9. Revision history

| Version | Date | Author | Summary of changes |
|---------|------|--------|--------------------|
| 1.0 | March 2, 2024 | Rachel Kim | Initial release |
| 2.0 | January 15, 2025 | Rachel Kim | Added store credit option and inspection grades |
| 2.2 | May 20, 2026 | Daniel Osei | Updated approval thresholds |
| 2.3 | September 18, 2026 | Rachel Kim | Added fraud warning and quality-check targets |
`,

  "resume": `# Alex Morgan

Seattle, WA · alex.morgan@example.com · (206) 555-0148 · linkedin.com/in/alexmorgan-dev · github.com/alexmorgan-dev

Senior software engineer with nine years of experience building reliable, high-traffic web platforms. I specialize in backend architecture, developer tooling, and turning slow, fragile systems into fast, well-tested ones. I enjoy mentoring engineers and working closely with product and design to ship work that matters to customers.

## Experience

### Senior Software Engineer — Fernhill Analytics

*March 2022 – Present · Seattle, WA (hybrid)*

- Led the redesign of the event ingestion pipeline, increasing throughput from 40K to 220K events per second while cutting infrastructure cost by 31%.
- Introduced contract testing across 14 services, reducing integration-related production incidents by 60% in the first year.
- Mentored five engineers, two of whom were promoted to senior roles; ran the team's weekly architecture review.
- Partnered with product to launch a self-serve reporting API now used by more than 1,200 customers.

### Software Engineer II — Coastline Health

*June 2019 – February 2022 · Portland, OR*

- Built the appointment scheduling service handling 3M bookings per month with 99.95% availability.
- Migrated a legacy monolith's billing module to a standalone service with zero downtime.
- Reduced median API latency from 480 ms to 120 ms by adding caching and rewriting hot database queries.
- Created internal onboarding documentation that cut new-hire ramp-up time from six weeks to three.

### Software Engineer — Bluepine Labs

*August 2016 – May 2019 · Boise, ID*

- Developed features for a B2B inventory platform used by 300 retail stores.
- Set up the company's first CI/CD pipeline, reducing release time from a day to under an hour.
- Wrote and maintained the public REST API and its documentation.
- Built a barcode-scanning workflow for store staff that reduced stock-count errors by 22%.

## Skills

| Area | Skills |
|------|--------|
| Languages | TypeScript, Go, Python, SQL |
| Backend | Node.js, PostgreSQL, Redis, Kafka, gRPC, REST API design |
| Cloud & DevOps | AWS, Docker, Kubernetes, Terraform, GitHub Actions |
| Practices | System design, testing strategy, observability, code review, mentoring |
| Collaboration | Technical writing, incident response, cross-team planning, hiring interviews |

## Education

**B.S. Computer Science** — University of Idaho, 2016
*Graduated with honors · Senior project: real-time bus tracking for the Moscow–Pullman transit network*

**AWS Certified Solutions Architect – Associate**, 2023

## Selected Projects

- **queuewatch** — Open-source dashboard for monitoring message queue lag across Kafka and RabbitMQ clusters; 1.8K GitHub stars.
- **Trailhead Volunteer Portal** — Pro bono scheduling app for a regional trail-maintenance nonprofit, coordinating 400+ volunteers each season.
- **Conference talk** — "Backpressure in Practice: Keeping Pipelines Healthy Under Load," Cascadia Dev Summit 2025.
`,

  "invoice": `# Invoice

**Invoice #** INV-2026-0147 · **Issued** November 3, 2026 · **Due** December 3, 2026

| From | Bill To |
|------|---------|
| **Fieldnote Creative LLC** | **Northwind Studio** |
| 418 Alder Street, Suite 2 | Attn: Hannah Okafor |
| Portland, OR 97204 | 1220 Harbor Avenue |
| billing@fieldnote.example | Seattle, WA 98101 |
| Tax ID: 93-4418201 | accounts@northwind.example |

## Line items

| Description | Qty | Rate | Amount |
|-------------|----:|-----:|-------:|
| Brand strategy workshop (half day) | 1 | $1,200.00 | $1,200.00 |
| Logo and visual identity system | 1 | $3,000.00 | $3,000.00 |
| Website page design (per template) | 6 | $450.00 | $2,700.00 |
| Copywriting (hours) | 10 | $75.00 | $750.00 |
| Stock image licenses | 6 | $40.00 | $240.00 |
| Project management (hours) | 6 | $85.00 | $510.00 |

| | |
|---|---:|
| Subtotal | $8,400.00 |
| Discount (returning client) | −$400.00 |
| Tax (8%) | $640.00 |
| **Total due** | **$8,640.00** |

## Payment details

- **Bank:** Cascade Mutual Bank
- **Account name:** Fieldnote Creative LLC
- **Account number:** 0048 2291 7731
- **Routing number:** 123000848
- **Reference:** INV-2026-0147
- Card payments accepted via the secure link in your invoice email (3% processing fee applies).

## Notes

Payment is due within 30 days of the issue date. Please include the invoice number as the payment reference. Balances unpaid after the due date may incur a late fee of 1.5% per month.

Thank you for choosing Fieldnote Creative — it has been a pleasure working with the Northwind team on your new identity. Questions about this invoice? Email billing@fieldnote.example or call (503) 555-0192.
`,

  "academic-paper": `# Confidence-Adaptive Label Smoothing for Learning with Noisy Labels

Maya R. Castellano¹, Jonah Whitfield¹, Sun-Hee Park² · ¹Department of Computer Science, Halden University · ²Institute for Data Science, Marlowe Institute of Technology · {mcastellano, jwhitfield}@halden.example

> **Abstract.** Deep neural networks readily memorize incorrect labels, which degrades generalization when training data are collected at scale with imperfect annotation. Label smoothing is a simple and widely used regularizer, but it applies the same amount of smoothing to every example regardless of how trustworthy its label is. We propose Confidence-Adaptive Label Smoothing (CALS), which sets a per-example smoothing coefficient from the agreement between the model's running prediction and the observed label. Examples whose labels are consistently contradicted by the model receive stronger smoothing, while clean examples are trained almost as with standard cross-entropy. CALS adds a single hyperparameter, requires no clean validation set, and introduces negligible computational overhead. On CIFAR-10 and CIFAR-100 with symmetric and asymmetric label noise, CALS improves test accuracy over uniform label smoothing by 2.1–6.8 points and is competitive with considerably more complex sample-selection methods. We further show that the learned smoothing coefficients identify mislabeled examples with an AUROC of 0.94.

**Keywords:** label noise, label smoothing, robust training, regularization, image classification

## 1. Introduction

Large labeled datasets are central to the success of deep learning, yet collecting them is expensive. Practitioners increasingly rely on crowdsourcing, web scraping, and weak supervision, all of which introduce label noise. Because modern networks have enough capacity to fit arbitrary labelings [1], they eventually memorize noisy labels, and test performance suffers.

Label smoothing [2] replaces the one-hot target with a mixture of the one-hot vector and a uniform distribution. It is known to improve calibration and to provide some robustness to noise [3]. However, uniform smoothing treats all examples identically: it over-regularizes clean examples and under-regularizes noisy ones.

This paper makes three contributions. First, we introduce CALS, a per-example smoothing scheme driven by a running estimate of the model's agreement with each label. Second, we show that CALS can be implemented as a drop-in replacement for the cross-entropy loss with a single hyperparameter. Third, we evaluate CALS on standard noisy-label benchmarks and show that it consistently outperforms uniform smoothing and matches more complex methods.

## 2. Related Work

**Loss correction.** Patrini et al. [4] estimate a noise transition matrix and correct the loss accordingly. These methods are principled but depend on an accurate estimate of the transition matrix, which is difficult to obtain for many classes.

**Sample selection.** Co-teaching [5] trains two networks that select small-loss examples for each other, exploiting the observation that networks learn clean patterns before memorizing noise. Such methods are effective but double the training cost and introduce schedule hyperparameters.

**Regularization.** Mixup, label smoothing, and early stopping all reduce memorization. Our work is closest to label smoothing, but replaces its fixed coefficient with an adaptive, per-example one.

## 3. Method

Let $\\mathcal{D} = \\{(x_i, y_i)\\}_{i=1}^{N}$ be a training set with $K$ classes, where each observed label $y_i$ may be corrupted. A network $f_\\theta$ produces class probabilities $p_i = \\mathrm{softmax}(f_\\theta(x_i))$. Standard label smoothing with coefficient $\\varepsilon \\in [0, 1)$ uses the target

$$
\\tilde{y}_i = (1 - \\varepsilon)\\, e_{y_i} + \\frac{\\varepsilon}{K}\\, \\mathbf{1},
$$

where $e_{y_i}$ is the one-hot vector for label $y_i$ and $\\mathbf{1}$ is the all-ones vector.

**Agreement estimate.** For each example we maintain an exponential moving average of the probability the model assigns to the observed label:

$$
a_i^{(t)} = \\beta\\, a_i^{(t-1)} + (1 - \\beta)\\, p_{i, y_i}^{(t)},
$$

with $\\beta = 0.9$ and $a_i^{(0)} = 1/K$. Clean examples are learned early and quickly reach high agreement, while mislabeled examples remain low for much longer.

**Adaptive smoothing.** We map agreement to a per-example coefficient $\\varepsilon_i = \\varepsilon_{\\max}\\,(1 - a_i)^{\\gamma}$, where $\\gamma > 0$ controls how sharply smoothing decreases as agreement rises. The training objective is

$$
\\mathcal{L}(\\theta) = -\\frac{1}{N} \\sum_{i=1}^{N} \\sum_{k=1}^{K} \\tilde{y}_{i,k}(\\varepsilon_i) \\log p_{i,k}.
$$

In all experiments we set $\\varepsilon_{\\max} = 0.8$ and treat $\\gamma$ as the only tuned hyperparameter, selecting $\\gamma \\in \\{1, 2, 4\\}$ on a noisy held-out split. Agreement values are updated once per epoch, so the overhead is a single vector of length $N$.

## 4. Results

We evaluate on CIFAR-10 and CIFAR-100 [6] with synthetic symmetric noise (labels flipped uniformly at random) and asymmetric noise (labels flipped to semantically similar classes). All methods use a ResNet-34 [7] trained for 200 epochs with SGD, a batch size of 128, and cosine learning-rate decay. We report mean test accuracy over three seeds.

| Method | C10 Sym. 20% | C10 Sym. 50% | C10 Asym. 40% | C100 Sym. 20% | C100 Sym. 50% |
|--------|:-----------:|:-----------:|:------------:|:------------:|:------------:|
| Cross-entropy | 86.8 | 79.4 | 83.2 | 62.0 | 46.7 |
| Label smoothing ($\\varepsilon = 0.1$) | 88.1 | 81.9 | 84.0 | 63.5 | 49.8 |
| Forward correction [4] | 88.0 | 82.1 | 87.2 | 63.9 | 51.3 |
| Co-teaching [5] | 89.3 | 85.6 | 86.9 | 65.4 | 54.2 |
| **CALS (ours)** | **90.2** | **86.4** | **88.5** | **66.9** | **56.6** |

CALS achieves the best accuracy in every setting. Gains over uniform label smoothing grow with the noise rate, from 2.1 points at 20% symmetric noise on CIFAR-10 to 6.8 points at 50% symmetric noise on CIFAR-100. Using $1 - a_i$ as a score for detecting mislabeled examples yields an AUROC of 0.94 on CIFAR-10 with 50% symmetric noise.

## 5. Discussion

The results suggest that much of the benefit of label smoothing under noise comes from its effect on mislabeled examples, and that concentrating smoothing where it is needed preserves the learning signal from clean data. Because CALS relies on the model's own agreement, it shares a limitation with sample-selection methods: when noise is highly structured, the model may confidently learn the wrong mapping early in training. In our asymmetric-noise experiments this effect was modest, but it may be stronger on fine-grained datasets.

CALS is also sensitive to the moving-average rate $\\beta$. Very small values make agreement estimates noisy, whereas values close to 1 delay adaptation. We found $\\beta = 0.9$ robust across all datasets, though a schedule that increases $\\beta$ over training could further improve stability.

## 6. Conclusion

We introduced Confidence-Adaptive Label Smoothing, a simple modification of label smoothing that assigns stronger smoothing to examples whose labels the model consistently disagrees with. CALS requires one extra hyperparameter, no clean data, and negligible compute, yet it outperforms uniform smoothing and competes with more complex methods on standard benchmarks. Future work will study CALS on real-world noisy datasets and in combination with semi-supervised learning.

## References

1. C. Zhang, S. Bengio, M. Hardt, B. Recht, and O. Vinyals. Understanding deep learning requires rethinking generalization. In *International Conference on Learning Representations (ICLR)*, 2017.
2. C. Szegedy, V. Vanhoucke, S. Ioffe, J. Shlens, and Z. Wojna. Rethinking the Inception architecture for computer vision. In *Proceedings of the IEEE Conference on Computer Vision and Pattern Recognition (CVPR)*, pp. 2818–2826, 2016.
3. R. Müller, S. Kornblith, and G. E. Hinton. When does label smoothing help? In *Advances in Neural Information Processing Systems (NeurIPS)*, 2019.
4. G. Patrini, A. Rozza, A. K. Menon, R. Nock, and L. Qu. Making deep neural networks robust to label noise: A loss correction approach. In *Proceedings of CVPR*, pp. 1944–1952, 2017.
5. B. Han, Q. Yao, X. Yu, G. Niu, M. Xu, W. Hu, I. Tsang, and M. Sugiyama. Co-teaching: Robust training of deep neural networks with extremely noisy labels. In *Advances in Neural Information Processing Systems (NeurIPS)*, 2018.
6. A. Krizhevsky. Learning multiple layers of features from tiny images. Technical report, University of Toronto, 2009.
7. K. He, X. Zhang, S. Ren, and J. Sun. Deep residual learning for image recognition. In *Proceedings of CVPR*, pp. 770–778, 2016.
`,
};
