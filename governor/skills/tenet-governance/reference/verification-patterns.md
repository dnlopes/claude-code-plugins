# Verification Patterns

Language-specific patterns for detecting tenet violations.

## Common Tenet Types

### 1. Import/Dependency Restrictions

**Pattern:** Module X must not import from module Y

**Detection approach:**
1. Parse import statements in target module
2. Check if any imports reference forbidden module
3. Score 90-100 if forbidden import found

### 2. Layer Boundary Violations

**Pattern:** Layer X must not depend on layer Y

**Detection approach:**
1. Identify file's layer from path (e.g., `domain/`, `infrastructure/`)
2. Parse imports/dependencies
3. Check if dependencies cross forbidden boundary
4. Score based on directness of violation

### 3. Naming Conventions

**Pattern:** Components of type X must follow naming pattern Y

**Detection approach:**
1. Identify components of target type
2. Extract names
3. Match against required pattern
4. Score based on pattern match confidence

### 4. Structural Requirements

**Pattern:** Each X must have corresponding Y

**Detection approach:**
1. Find all instances of X
2. For each X, search for corresponding Y
3. Report missing correspondences
4. Score based on search confidence

## Language-Specific Patterns

### Go

**Import parsing:**
```go
// Single import
import "package/path"

// Grouped imports
import (
    "standard/lib"
    "github.com/external/pkg"
    "internal/module"
)
```

**Detection commands:**
```bash
# Find all imports in a file
grep -n "^import\|^\t\"" file.go

# Find imports of specific package
grep -rn '"internal/domain"' --include="*.go" .

# Find interface definitions
grep -rn "type.*interface {" --include="*.go" .
```

**Common tenets:**
- `internal/` packages not imported outside their tree
- Domain packages don't import infrastructure
- Handlers don't contain business logic (check for DB/external calls)

### TypeScript/JavaScript

**Import parsing:**
```typescript
// ES6 imports
import { Thing } from './module';
import * as utils from '../utils';
import defaultExport from 'package';

// CommonJS
const thing = require('./module');
```

**Detection commands:**
```bash
# Find all imports
grep -rn "^import.*from\|require(" --include="*.ts" --include="*.tsx" .

# Find imports from specific path
grep -rn "from ['\"]@/infrastructure" --include="*.ts" .

# Find barrel exports
find . -name "index.ts" -exec grep -l "export" {} \;
```

**Common tenets:**
- No circular dependencies
- Components don't import from pages
- Services don't import UI components
- Relative imports within module, absolute across modules

### Python

**Import parsing:**
```python
# Standard imports
import os
from pathlib import Path

# Relative imports
from . import sibling
from ..parent import thing
```

**Detection commands:**
```bash
# Find all imports
grep -rn "^import\|^from.*import" --include="*.py" .

# Find imports from specific module
grep -rn "from infrastructure" --include="*.py" .

# Find class definitions
grep -rn "^class.*:" --include="*.py" .
```

**Common tenets:**
- Domain layer pure (no external dependencies)
- No wildcard imports (`from x import *`)
- Tests mirror source structure

### C#

**Import parsing:**
```csharp
using System;
using System.Collections.Generic;
using MyApp.Domain.Entities;
```

**Detection commands:**
```bash
# Find all using statements
grep -rn "^using" --include="*.cs" .

# Find usings from specific namespace
grep -rn "using.*Infrastructure" --include="*.cs" .

# Find interface definitions
grep -rn "interface I[A-Z]" --include="*.cs" .
```

**Common tenets:**
- Domain projects don't reference Infrastructure
- Controllers don't contain business logic
- Entities don't have framework dependencies

### Rust

**Import parsing:**
```rust
use std::collections::HashMap;
use crate::domain::User;
use super::parent_module;
```

**Detection commands:**
```bash
# Find all use statements
grep -rn "^use\|^pub use" --include="*.rs" .

# Find uses from specific crate/module
grep -rn "use crate::infrastructure" --include="*.rs" .

# Find trait definitions
grep -rn "^pub trait\|^trait" --include="*.rs" .
```

**Common tenets:**
- No `unsafe` in domain code
- Public API surface explicitly declared
- Error types implement std::error::Error

## Confidence Scoring Guidelines

### Score 90-100: Explicit Violation

Clear, unambiguous evidence:
- Forbidden import statement present
- Exact pattern match on violation
- No alternative interpretation

**Example:** Domain file imports `infrastructure/database`

### Score 70-89: Likely Violation

Strong evidence requiring minimal context:
- Import pattern suggests violation
- Structure implies boundary crossing
- Would need unusual justification

**Example:** Handler file contains SQL query strings

### Score 50-69: Possible Violation

Ambiguous evidence:
- Could be violation or legitimate use
- Depends on context not visible in code
- Edge case of the rule

**Example:** Utility function in domain that calls external API

### Score 1-49: Uncertain

Weak or circumstantial evidence:
- Pattern loosely matches
- Likely false positive
- Would need significant context to confirm

**Example:** Variable named similarly to forbidden pattern

## Verification Process

For each file being verified:

1. **Read file content** using Read tool
2. **Identify file context** (layer, module, purpose)
3. **For each applicable tenet:**
   - Apply language-specific detection pattern
   - Score confidence based on evidence strength
   - Note specific line numbers and code snippets
4. **Check for exceptions:**
   - Inline `governor:ignore` comments
   - Table entries in AGENTS.md
5. **Filter results:**
   - Only report violations above confidence threshold
   - Only report tenets at or above severity threshold
   - Mark exceptions but don't count as violations

## Edge Cases

### Dynamic Imports

```typescript
// Hard to detect statically
const module = await import(`./modules/${name}`);
```

**Handling:** Score 50-69 if dynamic import could violate tenet. Note uncertainty.

### Conditional Compilation

```go
// +build integration

package test
```

**Handling:** Consider build tags when determining file applicability.

### Generated Code

Files matching patterns like `*.gen.go`, `*.generated.ts`, `__generated__/`

**Handling:** Skip or lower confidence for generated code unless tenet specifically applies.

### Test Files

Files in `*_test.go`, `*.test.ts`, `test_*.py`, `*Tests.cs`

**Handling:** Some tenets may not apply to tests. Check tenet scope.
