---
name: golang-dev-guidelines
description: Use this skill when planning, researching, writing, reviewing, refactoring, or testing Go code (including creating unit tests, test files, and mocks). It provides comprehensive Go development guidelines including proverbs, SOLID principles, and testing standards. Apply these guidelines to ensure code quality, maintainability, and consistency in any Go project.
---

# Go Development Guidelines

## Overview

This skill provides comprehensive Go development standards and best practices. The guidelines are organized into two main areas:

1. **Core Principles** - Go proverbs, SOLID principles, design patterns (for writing, planning, reviewing, and refactoring)
2. **Testing Guidelines** - Testing standards, best practices, and patterns (for writing and reviewing tests)

## When to Use This Skill

Apply these guidelines when:

- Implementing new Go code (packages, services, handlers, libraries)
- Reviewing Go code for adherence to best practices
- Refactoring existing Go code
- Writing or reviewing Go tests, unit tests, or mocks
- Making architectural or design decisions
- Creating a plan or researching Go development topics
- Resolving code review feedback related to code quality

## Content Structure

This skill is organized into separate focused documents to optimize loading and relevance:

### For Writing/Planning/Reviewing/Refactoring Code

When your task involves **writing, planning, reviewing, or refactoring** Go code, refer to:

**[golang-core-principles.md](reference/golang-core-principles.md)**

This document contains:

- Go Proverbs (concurrency, design, code quality, error handling)
- SOLID Principles (SRP, OCP, LSP, ISP, DIP)
- Additional Design Principles (DRY, YAGNI, KISS, Composition)
- Guidelines for applying principles when writing, reviewing, and planning

### For Writing/Reviewing Tests

When your task involves **writing unit tests, test files, mocks, or reviewing tests**, refer to:

**[golang-testing-guidelines.md](golang-testing-guidelines.md)**

This document contains:

- Test Coverage principles
- Test Organization (table-driven tests, naming conventions)
- Assertions (with and without libraries)
- Test Types (Unit vs Integration tests)
- Mocking and Test Doubles
- Test Setup and Teardown patterns
- Testing Best Practices
- Common Testing Patterns

## How to Use These Guidelines

### Selective Loading Based on Task

**For general development work**: Load `reference/golang-core-principles.md` to access Go proverbs, SOLID principles, and design patterns.

**For testing work**: Load `reference/golang-testing-guidelines.md` to access testing standards, mocking patterns, and test organization techniques.

**For comprehensive code reviews**: Consider both documents to review both implementation and test quality.

### Quick Reference

**Development Tasks**:

- Writing new features → Core Principles
- Refactoring code → Core Principles
- Planning architecture → Core Principles
- Reviewing implementation → Core Principles

**Testing Tasks**:

- Writing unit tests → Testing Guidelines
- Creating mocks → Testing Guidelines
- Reviewing test coverage → Testing Guidelines
- Organizing test files → Testing Guidelines

## Integration with Development Workflow

1. **Before writing code**: Review relevant core principles (interfaces, SOLID, Go proverbs)
2. **While writing code**: Follow error handling, naming, and composition guidelines
3. **When writing tests**: Apply testing guidelines for organization and coverage
4. **During code review**: Check both implementation principles and test quality
5. **When refactoring**: Ensure adherence to SOLID principles and Go proverbs

---

**Note**: This modular structure allows you to load only the guidelines relevant to your current task, reducing cognitive load and improving focus. Both documents are designed to be comprehensive yet concise references for their respective domains.
