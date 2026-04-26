# Security Audit Report - theprawnprojects
**Generated:** 2026-04-26  
**Repository:** theprawnprojects (Projects Showcase)  
**Audit Phase:** Internal Triage

---

## Executive Summary
**Final Status:** 🔴 CRITICAL (Invalid Dependency Versions)  
**Snyk Quota Used:** 0/∞  
**Critical Issues:** 2  
**High Issues:** 1  
**Medium Issues:** 0  
**Low Issues:** 0  

---

## 1. CRITICAL ISSUES

### 1. **typescript@~6.0.3** - VERSION DOES NOT EXIST
- **CVSS:** 9.0 (Critical)
- **Fix:** `"typescript": "^5.7.2"`

### 2. **vite@^8.0.10** - VERSION DOES NOT EXIST
- **CVSS:** 9.0 (Critical)
- **Fix:** `"vite": "^5.4.11"`

---

## 2. HIGH SEVERITY ISSUES

### 3. **react@^19.2.0 + react-dom@^19.2.4** - Experimental
- **CVSS:** 7.0 (High)
- **Fix:** `"react": "^18.3.1"`, `"react-dom": "^18.3.1"`

---

## 3. REMEDIATION

```json
{
  "typescript": "^5.7.2",
  "vite": "^5.4.11",
  "react": "^18.3.1",
  "react-dom": "^18.3.1"
}
```

**Security Grade:** F (FAILING)

