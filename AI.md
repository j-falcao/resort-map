# 🤖 AI-Assisted Development

This project was developed with the assistance of Large Language Models (LLMs) to **accelerate development, validate decisions, and improve code quality**—not to replace understanding.

---

## 🧰 Tools Used

- ChatGPT (GPT-5.3)
- Claude (Sonnet 4.6)
- IDE autocomplete (TypeScript / React)

---

## 🧠 How AI Was Used

### Structuring & Design
- Breaking down backend vs frontend responsibilities
- Designing a simple, appropriate architecture
- Validating separation of concerns

---

### Implementation
- Express API setup (`/map`, `/book`)
- CLI argument handling
- Map parsing and rendering logic
- React component structure and state

---

### Debugging & Refinement
- Fixing TypeScript issues
- Improving event typing and API interactions
- Handling edge cases (invalid input, duplicate bookings)

---

### Design Validation
Used as a sounding board for decisions such as:
- validation strategy (parser vs UI)
- fail-fast vs runtime handling
- UI patterns (modal vs lightweight feedback)

---

## 🔁 Workflow

The development process followed an iterative loop:

1. Implement a feature manually or with AI assistance  
2. Test locally and validate behavior  
3. Refine with AI (simplification, edge cases, cleanup)  
4. Commit small, meaningful changes  
5. Repeat  

AI was used in **short, focused interactions**, not large one-shot generations.

---

## 💬 Example Prompts Used

In practice, I didn’t really use long or formal prompts. Most of the time it was just quick, context-driven questions based on whatever I was working on at the moment. For example, when I was structuring the backend, I would paste a bit of code or describe the setup and ask things like how to separate responsibilities more cleanly or whether the approach was overcomplicated for the size of the project.

During implementation, it was often more direct, like asking how to implement a specific feature in the simplest way possible or how to handle a certain edge case I hadn’t considered. If something broke, I’d just paste the error and ask what it meant and what the likely cause was.

For refactoring, it was usually along the lines of “this feels messy, how would you simplify it without changing behavior?” or “is there a cleaner way to structure this component?”. The goal was always to reduce complexity rather than add abstraction.

---

## ⚖️ Approach

- All AI-generated code was reviewed and adapted
- Preference for:
  - simplicity over cleverness
  - minimal abstractions
  - readable, maintainable code

---

## ✅ Summary

AI was used as a **tool for iteration and refinement**, helping improve speed and clarity while maintaining full control over the final solution.