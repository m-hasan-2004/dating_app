# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

A Django 4.2 + DRF backend for a marriage/matchmaking ("dating") application, in Persian (Farsi). **The product surface is the Django Admin**, not a REST API — almost all functionality is implemented as admin `StackedInline` forms on the custom User model. The `search`, `forms`, `export`, and `log` apps are currently empty scaffolding; real code lives in `users` and `core`. The DRF `UserViewSet` defined inline in `dating_app/urls.py` is sample/boilerplate.

The UI is Persian-first: `LANGUAGE_CODE = "fa"`, `TIME_ZONE = "Asia/Tehran"`, Jalali (Shamsi) calendar dates via `django-jalali-date`, and admin URLs are wrapped in `i18n_patterns` (so the admin lives at `/fa/admin/`, not `/admin/`).

## Commands

Run everything from `backend/` (this directory). Local dev assumes the `venv/` here is activated; Docker is the supported path.

```bash
# Docker (full stack: web + postgres + pgadmin)
docker compose up --build           # web :8000, pgadmin :5050, postgres :5432
docker compose exec web python manage.py <cmd>

# Local manage.py
python manage.py migrate
python manage.py runserver 0.0.0.0:8000
python manage.py makemigrations users   # model changes almost always land in the `users` app

# Tests (pytest, configured via pytest.ini -> DJANGO_SETTINGS_MODULE)
pytest                                          # whole suite
pytest users/tests/test_user_related_models/test_user_model.py   # one file
pytest -k access_code                            # by keyword
pytest path/to/test.py::TestClass::test_name     # single test
```

`pytest.ini` collects `tests.py`, `test_*.py`, and `*_tests.py`. The maintained tests are under `users/tests/` (with fixtures in `users/tests/conftest.py`); the per-app `tests.py` files are unused stubs.

### Project-specific management commands (in `core/management/commands/`)

- `python manage.py create_access_code <N>` — generate N one-time access codes (see auth flow below).
- `python manage.py super1` — create a predefined hardcoded superuser (`superuser1`) for dev.
- `python manage.py dj_secret --write` — generate a Django SECRET_KEY.

## Architecture & conventions

### Access-code authentication (the core auth concept)

User signup/login is gated by single-use **AccessCode** objects, not open registration:

- `AccessCode` (`users/user_related_models/access_code_model.py`) is a UUID with an `active` flag.
- `UserManager.create_user` requires a valid active `access_code`, and **flips it to `active=False`** on use. `create_superuser` bypasses this.
- `users/backends.AccessCodeAuthenticationBackend` (first in `AUTHENTICATION_BACKENDS`) authenticates username+password **and** consumes the matching access code.
- `validate_active_access_code` in `core/utils/validators/shared.py` is the shared gate, used by the model, the manager, and `CustomUserCreationForm`.

When touching user creation, keep all three paths consistent: the manager, the admin (`UserAdmin.save_model` re-deactivates the code), and the creation form.

### Models are split into many files, re-exported via star imports

The custom user model is `users.User` (`AUTH_USER_MODEL`), with a UUID primary key. Related models are **one-model-per-file**, grouped in two packages and re-exported so they import as a flat namespace:

- `users/user_related_models/` → `__init__.py` does `from .x import *`. Import as `from users.user_related_models import User, AccessCode, PersonalInformation, ...`.
- `users/preferred_wife_models/` → the prospective-spouse preference models.

Each related model is a separate inline on the User admin (`users/admin.py`), so a single User admin page aggregates dozens of one-to-one/related forms. Adding a new profile section = new model file + re-export + register an inline in `UserAdmin.inlines`.

### `core/utils` holds all cross-cutting field metadata, organized by domain

Field validators, help text, error messages, and choices are **not** inlined on models — they live in `core/utils/` and are imported into model field definitions:

- `core/utils/validators/` — `UserValidator`, `validate_active_access_code` (shared.py), etc.
- `core/utils/help_texts/`, `core/utils/error_msgs/`, `core/utils/model_choices/`

When adding or changing a model field, the `help_text`, `error_messages`, and `choices` belong in the matching `core/utils` module (split into `*`, `subject_*`, `preferred_wife_*` files), not hardcoded on the field. All user-facing strings use `gettext_lazy as _` for translation.

### Migrations

The `users` app has 125+ migrations and is under active schema churn. Run `makemigrations` after any model edit and commit the migration alongside the code.

## Configuration / environment

- Settings read from `.env` (see `.env.example`): `SECRET_KEY`, `DB_NAME`, `DB_USER`, `DB_PASSWORD`, `DB_HOST`, `DB_PORT`, optional `SENTRY_DSN`.
- `DEBUG = True` and `ALLOWED_HOSTS = ["*"]` are hardcoded in `settings.py` — there is no prod/dev split. Sentry initializes only when `SENTRY_DSN` is set.
- `debug_toolbar` is active whenever `DEBUG` is on.
- Locale handling is finicky on Windows/Postgres: settings force `PGCLIENTENCODING = "UTF8"` and the compose DB uses `--locale=C`; the Docker image generates `fa_IR.UTF-8`. See `deploy.md` for the full production/pgAdmin setup.

## Docs

`deploy.md` (in this directory) is the authoritative deployment + pgAdmin4 setup guide. `todo.md` tracks outstanding work.
