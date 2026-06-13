# BroLedger Marketing Landing Page

Welcome to the official repository for the **BroLedger** marketing landing page. This project represents a world-class, cinematic, and interactive showcase designed to market BroLedger as a premium **personal financial operating system for circles and individuals**.

---

## 🌟 Core BroLedger Product Features

The BroLedger core application is a comprehensive personal finance operating system that integrates advanced AI pipelines, calendar syncing, and graph solvers to simplify personal and circle-based finances. Its core features include:

* **Flexible Room Workspaces**:
  * *Personal Cashbooks*: Private, single-member workspaces created automatically for daily expense tracking.
  * *Bilateral Links*: 1-on-1 rooms established bidirectionally between two friends' accounts.
  * *Group Ledgers*: Collaborative multi-user spaces for shared houses, trips, and circles.
* **AI Receipt Scanning OCR Pipeline**:
  * Uses Google's `gemini-2.5-flash` model under the hood to parse uploaded receipts.
  * Automatically extracts merchant details, individual line items, exact prices, taxes, and service charges, returning structured JSON payloads.
* **Live Collaborative Split Sessions**:
  * Members of a room can join a live session to claim individual line-items extracted by the OCR engine, dividing large restaurant bills dynamically.
* **AI Voice Capture & NLP Parser**:
  * Parses voice transcripts or text logs (e.g. *"spent 450 rupees on pizza last night"*) using Groq API (`llama-3.1-8b-instant`) to instantly categorize and file personal expense records.
* **Smart Debt Simplification Solver**:
  * Employs a greedy network flow algorithm to simplify peer-to-peer debts in group rooms.
  * Matches net debtors with net creditors to collapse complex multi-transfer loops into the minimal number of bank transfers.
* **Financial Agenda & Orbits**:
  * Tracks due dates, recurring subscriptions, income sources, and active month savings milestones in a unified dashboard.
* **Google Calendar Synchronization**:
  * Integrates with Google OAuth to automatically synchronize agenda bills and recurring subscriptions to a custom *"BroLedger Financial Events"* Google Calendar. Writes reminders and includes links to settle directly inside the app.
* **AI Weekly Briefings**:
  * Runs Groq API summarizations to compile upcoming weekly obligations into a single, sharp sentence briefing.
* **Email Statements & PDF Export**:
  * Exports detailed, printable statements locally as PDFs (via `html2pdf.js`) and emails ledger updates directly to friends using the EmailJS REST API.


