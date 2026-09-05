# AI Interview Preparation Platform

## Overview

This repository contains an AI Interview Preparation Platform, a full-stack web application designed to help users prepare for software engineering and technical interviews. It leverages AI models (such as Google Gemini) to analyze resumes and guide users through coding practice problems.

## Tech Stack

### Frontend
- React 19
- Vite
- Tailwind CSS v4
- Material UI
- Monaco Editor
- React Router v7

### Backend
- FastAPI
- SQLAlchemy v2
- Alembic
- Google GenAI SDK
- PyMuPDF

### Database
- PostgreSQL

## Features

- JWT Authentication
- Resume Upload & AI Analysis
- Coding Practice Engine
- Dashboard & Analytics

## Project Structure

- frontend/
- backend/
- backend/app/services/
- backend/app/models/
- backend/app/api/
- backend/scripts/
- backend/generator/

---

## Coding Guidelines

- Follow the existing project structure.
- Modify existing files before creating new ones.
- Keep business logic inside services.
- Keep API routes thin.
- Use SQLAlchemy ORM patterns already present.
- Maintain existing naming conventions.
- Preserve type hints.
- Don't add unnecessary dependencies.

## Project Goals

- Maintain clean architecture.
- Write production-quality code.
- Prefer readability over clever solutions.
- Keep API responses consistent.
- If a database schema changes, generate an Alembic migration.
- Explain large changes before implementing them.
- Ask for clarification if requirements are ambiguous.