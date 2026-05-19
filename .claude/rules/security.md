# Security Rules for AI Coding Agents

> Must-follow rules when generating ANY code.

---

## 1. Secrets (CRITICAL)
- Never hardcode API keys, passwords, tokens
- Use environment variables only (.env)
- Add .env to .gitignore
- Provide .env.example

---

## 2. Input Validation
- Never trust user input
- Validate on backend (NOT frontend only)
- Sanitize data before using it

---

## 3. XSS Prevention
- Never use innerHTML with user input
- Escape output by default
- Use DOMPurify if HTML is required

---

## 4. SQL Injection
- Never concatenate SQL strings
- Always use ORM or parameterized queries

---

## 5. Authentication & Authorization
- Always verify ownership of resources (prevent IDOR)
- Enforce backend role checks (never rely on frontend)
- Use secure JWT/session handling

---

## 6. Password Security
- Never store plaintext passwords
- Use bcrypt or argon2 only

---

## 7. Rate Limiting
- Protect login, OTP, AI endpoints
- Prevent brute force attacks

---

## 8. CORS
- Never use "*” in production
- Whitelist allowed origins only

---

## 9. File Upload Security
- Validate MIME type + extension
- Rename files to random IDs
- Never execute uploaded files

---

## 10. Error Handling
- Never expose stack traces to users
- Return generic error messages in production

---

## 11. Dependency Safety
- Avoid unverified packages
- Run npm audit / pip-audit regularly
- Keep dependencies updated

---

## 12. SSRF Awareness
- Never fetch user-provided URLs without validation
- Block internal/private IP ranges

---

## 13. Path Safety
- Never use raw user input for file paths
- Always sanitize paths before access