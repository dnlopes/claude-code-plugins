# Contracts Design Checklist

Binary evaluation checklist for API and type design review. Mark each applicable item as passed or failed with evidence.

## Type Safety

- [ ] **Illegal States Unrepresentable**: Types prevent invalid states at compile-time
- [ ] **No Primitive Obsession**: Domain concepts use value objects, not raw primitives
- [ ] **Validated Construction**: Constructors/factories validate and enforce invariants
- [ ] **Immutability by Default**: Data structures immutable unless mutation required
- [ ] **Explicit Nullability**: Optional/nullable fields explicitly marked
- [ ] **Discriminated Unions**: Variants use tagged unions for type-safe handling
- [ ] **No Boolean Blindness**: Enums for states with semantic meaning
- [ ] **Proper Generics**: Generic types have appropriate constraints

## Encapsulation

- [ ] **No Anemic Models**: Domain models contain behavior, not just data
- [ ] **Internal State Hidden**: Cannot access/mutate from outside
- [ ] **Single Responsibility**: Each type has one reason to change
- [ ] **No Leaky Abstractions**: Implementation details not exposed
- [ ] **Minimal Interface**: Expose only what's needed

## API Design

- [ ] **Consistent Naming**: Domain-driven naming conventions throughout
- [ ] **Self-Documenting**: Types communicate constraints through structure
- [ ] **Error Representation**: Errors are typed objects with codes and messages
- [ ] **API Versioning**: Breaking changes use proper versioning (v1, v2)
- [ ] **Backward Compatibility**: Non-breaking changes maintain compatibility

## Data Modeling

- [ ] **Relationship Integrity**: Foreign keys and relationships properly defined
- [ ] **Database Schema Alignment**: ORM models match database schema
- [ ] **No Optional Overuse**: Optional fields are truly optional
- [ ] **Validation at Boundaries**: All external data validated on entry

## Breaking Changes Assessment

When reviewing contract changes, identify:

| Change Type | Breaking? | Action Required |
|-------------|-----------|-----------------|
| Add optional field | No | Document |
| Add required field | Yes | Version or migrate |
| Remove field | Yes | Deprecate first |
| Change field type | Yes | Version or migrate |
| Rename field | Yes | Add alias or version |
| Add enum value | Maybe | Check consumer handling |
| Remove enum value | Yes | Deprecate first |

## Severity Guide

| Severity | Criteria |
|----------|----------|
| Critical | Data corruption, system instability, impossible to fix in production |
| High | Significant maintenance burden, difficult future changes |
| Medium | Suboptimal design with manageable workarounds |
| Low | Minor inconsistency, no significant impact |
