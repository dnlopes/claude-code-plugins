# Security Checklist

Binary evaluation checklist for security audit. Mark each applicable item as passed or failed with evidence.

## Injection Prevention

- [ ] **SQL Injection**: Parameterized queries only, no string concatenation
- [ ] **Command Injection**: No shell execution with user input
- [ ] **XSS Prevention**: User input HTML-escaped before rendering
- [ ] **XXE Prevention**: XML external entity processing disabled
- [ ] **NoSQL Injection**: Query parameters validated
- [ ] **Code Injection**: No eval() or unsafe deserialization with user data

## Authentication & Authorization

- [ ] **Auth Required**: All protected endpoints check authentication
- [ ] **Authorization Enforced**: Resource access checks permissions, not just auth
- [ ] **No Hardcoded Secrets**: Zero passwords, API keys, tokens in code
- [ ] **Session Invalidation**: Logout invalidates server-side sessions
- [ ] **Rate Limiting**: Auth endpoints have rate limiting
- [ ] **Password Storage**: Hashed with bcrypt/argon2, never plain text

## Data Protection

- [ ] **Input Validation**: All inputs validated for type, length, format
- [ ] **Output Encoding**: Data encoded for context (HTML, URL, JS, SQL)
- [ ] **HTTPS Only**: Sensitive data requires HTTPS, no HTTP fallback
- [ ] **No Sensitive Logs**: No passwords, tokens, PII in logs
- [ ] **No Stack Traces**: Error responses hide technical details
- [ ] **Encryption at Rest**: Sensitive data encrypted in storage

## Cross-Site Attacks

- [ ] **CSRF Protection**: State-changing requests require CSRF tokens
- [ ] **Security Headers**: CSP, X-Frame-Options, X-Content-Type-Options
- [ ] **CORS Configured**: Appropriate origin restrictions
- [ ] **Cookie Security**: HttpOnly, Secure, SameSite flags set

## File & Path Security

- [ ] **Path Traversal Prevention**: No `../` acceptance in file paths
- [ ] **File Upload Validation**: Type, size, content validated
- [ ] **Safe Redirects**: No open redirects with user-controlled URLs

## Dependencies & Configuration

- [ ] **No Vulnerable Dependencies**: No known CVEs in dependencies
- [ ] **Secure Defaults**: Debug mode disabled in production
- [ ] **Environment Validation**: Required env vars validated at startup

## Severity Guide

| Severity | Criteria |
|----------|----------|
| Critical | Remote exploit without auth, full system access, complete data breach |
| High | Unauthorized data access, privilege escalation, partial compromise |
| Medium | Requires specific conditions, limited data exposure |
| Low | Best practice violation, minimal practical impact |
