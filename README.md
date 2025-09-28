# CarbonCredit-Ledger-Service
![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-5A29E4?style=for-the-badge&logo=prisma&logoColor=white)
![CORS](https://img.shields.io/badge/CORS-FF0000?style=for-the-badge)
![Dotenv](https://img.shields.io/badge/Dotenv-F7DF1E?style=for-the-badge&logo=dotenv&logoColor=black)
![HTTP Status Codes](https://img.shields.io/badge/HTTP%20Status%20Codes-26519E?style=for-the-badge)
![Winston](https://img.shields.io/badge/Winston-47A248?style=for-the-badge)
![Nodemon](https://img.shields.io/badge/Nodemon-76D076?style=for-the-badge)
---
The CarbonCredit Ledger Service is a backend platform for managing carbon credit records as digital certificates, each with a unique global identifier. Built with Node.js, Express, Prisma, and PostgreSQL, it ensures integrity and transparency through transaction-safe operations. Every record is tied to a sequence of immutable events, creating a verifiable and auditable trail of all carbon credit activities. It is called a ledger system because it maintains an append-only, tamper-resistant history of transactions similar to a financial ledger.

## Key Highlights
| Feature / Principle | Description |
|-------------------------|----------------|
| Immutable Ledger & Auditability | All record changes are logged as events, ensuring tamper-proof history and traceability of every action. |
| Unique Record IDs | Records act as globally unique certificates with deterministic ID generation. |
| Event-Driven Architecture & Modularity | Lifecycle changes tracked via separate events; modular services (record, event) make the system maintainable and extensible. |
| Transactional Safety & Concurrency Control | Atomic database transactions prevent race conditions and ensure consistency, even with simultaneous retire requests. |
| Validation, Error Handling & Logging | Strong input validation, structured errors, and context-rich logging ensure reliability and observability. |
| Separation of Concerns & DRY | Repository-service-controller pattern isolates responsibilities; shared utilities minimize redundancy. |
| Scalability & Backend Best Practices | Stateless services, modular layers, and structured architecture support horizontal scaling and production-grade backend design. |

## Database Schema
The system uses **PostgreSQL** with two main tables: `Record` and `Event`.  
### Record
- `recordId` (String, PK) – Globally unique certificate for each carbon credit record.  
- `projectName` (String) – Name of the project generating credits.  
- `registry` (String) – Registry system (e.g., VCS, GS).  
- `vintage` (Int) – Year of credit issuance.  
- `quantity` (Int) – Total available credits in the record.  
- `serialNumber` (String) – Project-specific serial identifier.  
- `createdAt` (DateTime) – Timestamp when the record was created.  

### Event
- `id` (Int, PK) – Auto-incremented unique event ID.  
- `eventId` (String, Unique) – Deterministic unique identifier for the event.  
- `recordId` (String, FK) – Links event to the corresponding record.  
- `type` (String) – Event type (`CREATED`, `RETIRED`).  
- `description` (String) – Optional human-readable description of the event.  
- `quantity` (Int) – Number of credits affected by this event.  
- `createdAt` (DateTime) – Timestamp when the event was recorded.  

**Relationship:** One-to-many (`Record` → `Event`) to track the lifecycle of credits.  

## Reflection Questions
### 1. How did you design the ID so it’s always the same for the same input?

For each record, I generated a **deterministic unique ID** using the combination of key project attributes such as `projectName`, `registry`, `vintage`, `quantity`, and `serialNumber`. By hashing these fields together using a secure hash function, the system guarantees that **if the input data is exactly the same, the resulting recordId will always be identical**.  

This approach ensures **idempotency**, meaning duplicate requests with the same input will not create multiple records. It also serves the business requirement of having a **globally unique certificate** for each carbon credit record, which acts as the backbone for tracking credits reliably.

---

### 2. Why did you use an event log instead of updating the record directly?

The **event log architecture** was chosen to maintain a **complete, immutable history** of all actions performed on each carbon credit record. Instead of updating the record in-place, every significant action—like creation or retirement—is stored as a separate event linked to the record.  

This approach ensures:
- **Auditability:** You can trace exactly when and how many credits were retired or modified.  
- **Integrity:** Prevents double-spending of credits, aligning with the company’s mission.  
- **Flexibility for future features:** For example, analytics on retire patterns, credit transfers, or regulatory compliance reports.  

From a **backend perspective**, this pattern is similar to **event sourcing**, where the system’s current state can always be derived from the sequence of events. This also helps in scaling horizontally without risking conflicts in state consistency.

---

### 3. If two people tried to retire the same credit at the same time, what would break? How would you fix it?

If two concurrent requests tried to retire overlapping quantities from the same record, without proper handling, it could cause **race conditions**. For instance, both requests could read the same available balance before any of them writes the retirement event, potentially allowing more credits to be retired than actually exist—violating the **integrity of the ledger**.  

To fix this, I implemented **database transactions** using Prisma, which ensures:
- **Atomicity:** Either all operations succeed (balance check + event creation) or none.  
- **Isolation:** Concurrent transactions are properly serialized by the database, preventing double retirement.  
- **Consistency:** The record’s total quantity and retired credits remain accurate, maintaining ledger integrity.  

In a production environment, additional safeguards like **row-level locking** or **optimistic concurrency control** could further prevent race conditions under extremely high concurrency.

---

**Key takeaway:**  
This system ensures that every credit has a **traceable lifecycle** (`CREATED → RETIRED`) with **immutability, auditability, and integrity**, which perfectly aligns with the company's core business purpose: reliable, trustworthy carbon credit tracking.

## Setup Instructions

Clone the repository and navigate inside:
```bash
git clone https://github.com/Himu336/CarbonCredit-Ledger-Service
cd CarbonCredit-Ledger-Service
```
Install dependencies:
```
npm install
```

Create a .env file in the root folder with your database credentials and server port, for example:
```
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE_NAME?schema=public"
PORT=4000
NODE_ENV=production
```

Apply database migrations and generate the Prisma client:
```
npx prisma migrate dev
npx prisma generate
```

Start the server:
```
npm run dev
```
The server will now run on the port defined in .env (default 4000). You can use the provided sample JSON data to seed records for testing immediately.
Ensure PostgreSQL is running and accessible before running migrations. .gitignore already excludes node_modules/, .env, and /src/generated/prisma.

## Testing the API
Once the server is running, you can test the endpoints using Postman, cURL, or any API client.

### 1. Create a Record
**Endpoint:** `POST http://localhost:4000/api/v1/records`  
**Description:** Creates a new carbon credit record and automatically generates a `CREATED` event.

**Sample Request Body:**

```json
{
  "projectName": "Mangrove Restoration Project",
  "registry": "VCS",
  "vintage": 2023,
  "quantity": 100,
  "serialNumber": "VCS-0001"
}
```
### 2. Retire Credits from a Record
**Endpoint:** `POST http://localhost:4000/api/v1/records/{recordId}/retire`
**Description:** Retires a specified number of credits from a record by creating a `RETIRED` event.

Sample Request Body:
```
{
  "quantity": 10
}
```
Replace {recordId} with the actual recordId from a created record.

### 3. Get Record Details
**Endpoint:** `GET http://localhost:4000/api/v1/records/{recordId}`
**Description:** Fetches a record by recordId along with all associated events (CREATED, RETIRED, etc.).
