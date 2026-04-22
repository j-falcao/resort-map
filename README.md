# 🏖️ Resort Map — Interactive Cabana Booking

A lightweight full-stack web application that enables guests to explore a resort map, check real-time cabana availability, and book their preferred spot in just a few clicks.

This project was built as part of a coding exercise, focusing on **simplicity, clarity, and practical design decisions**.

---

## ✨ Key Features

- 🗺️ Interactive map rendered from ASCII input
- 🏖️ Real-time cabana availability
- 🖱️ Click-to-book user flow with instant feedback
- ✅ Guest validation (room + name)
- 🚫 Prevents:
  - double booking of cabanas
  - multiple bookings per guest
- ⚡ Immediate UI refresh after booking
- 🧠 In-memory backend (no persistence)

---

## 🧱 Tech Stack

### Backend
- Node.js
- Express
- TypeScript

### Frontend
- React
- TypeScript
- Vite

---

## 🚀 How to Run

### 1. Prerequisites

- Node.js (v18+ recommended)
- npm

---

### 2. Install dependencies

```bash
cd backend
npm install

cd ../frontend
npm install

cd ..
```

---

### 3. Start the application

```bash
node start.js
```

This will launch:
- Backend API → http://localhost:3001
- Frontend → http://localhost:5173

---

### 4. Open in browser

```
http://localhost:5173
```

---

## ⚙️ Custom Input Files

You can provide custom input files via CLI:

```bash
node start.js -- --map <path-to-map> --bookings <path-to-bookings>
```

Example:

```bash
node start.js -- --map ./map.ascii --bookings ./bookings.json
```

If not provided, the following defaults are used:
- `map.ascii`
- `bookings.json`

---

## 📂 Input Formats

### Map (`map.ascii`)

ASCII-based grid:

| Symbol | Meaning  |
|--------|----------|
| `.`    | Empty    |
| `#`    | Path     |
| `p`    | Pool     |
| `c`    | Chalet   |
| `W`    | Cabana   |

---

### Bookings (`bookings.json`)

```json
[
  { "room": "101", "guestName": "Alice Smith" },
  { "room": "102", "guestName": "Bob Jones" }
]
```

---

## 🧠 Architecture & Design Decisions

The solution prioritizes simplicity and clarity. The backend separates static map data from dynamic booking state, using in-memory structures for fast and predictable behavior. The API is intentionally minimal, exposing only the required endpoints. The frontend relies on re-fetching data instead of complex state management to keep the flow simple. Input validation is implemented with a fail-fast approach to ensure consistent runtime behavior. Trade-offs include lack of persistence and minimal abstraction, both chosen to match the scope of the problem.


### 1. Fail-Fast Initialization

The application validates all required inputs at startup:
- missing files
- invalid JSON
- invalid map

If any validation fails, the server exits immediately.

**Why:**  
Prevents undefined runtime behavior and ensures a predictable system state.

---

### 2. Clear Separation of Static vs Dynamic Data

- **Map data** → static, loaded once
- **Booking state** → dynamic, in-memory

The `/map` endpoint dynamically enriches static map data with availability.

**Why:**  
Avoids mutating base data and keeps responsibilities well defined.

---

### 3. In-Memory State Management

Bookings are stored in memory using:
- `Set` for booked cabanas
- `Map` for guest → cabana mapping

**Why:**  
- aligns with requirements (no persistence needed)
- fast lookups
- minimal complexity

**Trade-off:**  
Data resets on restart.

---

### 4. Input Validation Strategy

Validation is intentionally lightweight but effective:

- File existence checks
- JSON parsing safety
- Schema validation (guest fields)
- Rectangular grid enforcement for map
- Invalid character validation for map

**Why:**  
Ensures correctness without introducing heavy validation libraries or unnecessary complexity.

---

### 5. Rectangular Grid Guarantee

The parser enforces that all rows have equal length.

**Why:**  
Allows the frontend to safely render a grid without defensive logic or layout inconsistencies.

---

### 6. Minimal API Design

Only two endpoints:

- `GET /map` → returns map with availability
- `POST /book` → handles booking logic

**Why:**  
Keeps the API focused and easy to reason about.

---

### 7. Simple Frontend State Management

- Local component state (no global store)
- Re-fetch map after booking

**Why:**  
Reduces complexity while maintaining correctness and responsiveness.

---

### 8. UX Decisions

- Modal-based booking flow
- Inline confirmation state
- Lightweight notification for unavailable cabanas

**Why:**  
Balances clarity and responsiveness without overcomplicating UI logic.

---

## ⚠️ Error Handling

The application separates business logic from HTTP concerns:

- The service layer (`bookingService`) throws domain-specific errors (`BookingError`) for validation and business rule violations.
- The API layer (Express routes) catches these errors and maps them to HTTP responses.

Error types:

- **400 (Client errors):** invalid input or rule violations (e.g., already booked cabana)
- **500 (Server errors):** unexpected failures

The application also follows a fail-fast approach at startup, exiting if input files are invalid.

All responses use a consistent JSON format:

```json
{ "success": true, ... }
{ "success": false, "error": "..." }
```
**Why:**  
Keeps business logic clean, ensures predictable behavior, and simplifies frontend integration.

---

## 🧪 Testing

Tests cover core functionality:

### Backend
- Guest validation
- Booking constraints
- API responses

### Frontend
- Map rendering
- Booking interactions
- UI updates after state changes

---

## ▶️ Running Tests

### Backend

```bash
cd backend  
npm test
```

### Frontend

```bash
cd frontend
npm test
```

---

## 🤖 AI Usage

See `AI.md` for:
- tools used
- prompt strategies
- development workflow

---

## 📌 Notes

- No authentication (room + name acts as identity)
- No persistence (intentional)
- Focus on readability and maintainability over abstraction

---

## ✅ Summary

This solution emphasizes:

- simplicity over cleverness
- correctness over assumptions
- clear data flow and separation of concerns

It is designed to be easy to understand, easy to run, and easy to extend.

---

## 👨‍💻 Author

João Falcão
