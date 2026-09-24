# System architecture

Status: Draft. No implementation architecture or technology stack is approved.

## System overview

The project will deliver a prototype and landing page. Their components, boundaries, interfaces, integrations, and deployment arrangement remain undecided.

## Working structure

The project follows the A.N.T. separation defined by its B.L.A.S.T. workflow.

| Layer | Responsibility |
| --- | --- |
| Architecture | Technical SOPs describing goals, inputs, logic, outputs, and edge cases |
| Navigation | Reasoning and routing between SOPs and tools |
| Tools | Atomic, deterministic, testable implementation scripts |

This document describes the overall system. Task-level SOPs belong in `architecture/` when implementation reaches that phase. Update the relevant SOP before changing its logic.

## Decisions to resolve

Runtime, framework, system components, data flow, storage, external services, deployment targets, and operational requirements are pending discovery.

Record confirmed architectural choices and their reasons in [decisions](../memory/decisions.md). Refer to [the data model](DATA_MODEL.md) for entity and persistence details as they are defined.
