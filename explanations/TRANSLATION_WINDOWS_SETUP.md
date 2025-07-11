# Django Translation Setup for Windows

This guide provides step-by-step instructions to configure Django translations to work properly on Windows, particularly for handling Persian/Arabic characters.

## Table of Contents
1. [Prerequisites](#prerequisites)
2. [Database Configuration](#database-configuration)
3. [Windows System Settings](#windows-system-settings)
4. [Django Settings](#django-settings)
5. [PostgreSQL Configuration](#postgresql-configuration)
6. [Verification](#verification)
7. [Troubleshooting](#troubleshooting)

## Prerequisites

- Python 3.7+
- Django 3.2+
- PostgreSQL 10+
- Windows 10/11

## Database Configuration

1. **Update Django Settings**
   In your `settings.py`, ensure your database configuration includes UTF-8 encoding:

   ```python
   DATABASES = {
       'default': {
           'ENGINE': 'django.db.backends.postgresql',
           'NAME': os.getenv('DB_NAME'),
           'USER': os.getenv('DB_USER'),
           'PASSWORD': os.getenv('DB_PASSWORD'),
           'HOST': os.getenv('DB_HOST'),
           'PORT': os.getenv('DB_PORT'),
           'OPTIONS': {
               'client_encoding': 'UTF8',
           },
       }
   }
   ```

2. **Add Environment Variable**
   Add this to your environment variables or `.env` file:
   ```
   PGCLIENTENCODING=UTF8
   ```

## Windows System Settings

1. **Enable UTF-8 Support**
   - Open Windows Settings
   - Go to Time & Language → Language & region
   - Click "Administrative language settings"
   - Check "Beta: Use Unicode UTF-8 for worldwide language support"
   - Click OK and restart your computer

2. **Set System Locale**
   - Open Control Panel
   - Go to Region → Administrative tab
   - Click "Change system locale..."
   - Select a language/region that supports your target language (e.g., English (United States))
   - Ensure "Beta: Use Unicode UTF-8..." is checked
   - Click OK and restart when prompted

## PostgreSQL Configuration

1. **Check Current Encoding**
   Run these SQL commands in psql or pgAdmin:
   ```sql
   SELECT datname, pg_encoding_to_char(encoding) 
   FROM pg_database 
   WHERE datname = 'your_database_name';
   
   SHOW server_encoding;
   SHOW client_encoding;
   ```

2. **Create New Database with UTF-8 (Recommended)**
   If your database isn't using UTF-8, create a new one:
   ```sql
   CREATE DATABASE your_database_name 
   WITH ENCODING 'UTF8' 
   LC_COLLATE='English_United States.utf8' 
   LC_CTYPE='English_United States.utf8' 
   TEMPLATE=template0;
   ```

3. **Update postgresql.conf**
   Locate your `postgresql.conf` file (typically in `C:\Program Files\PostgreSQL\<version>\data\`) and ensure these settings:
   ```
   client_encoding = 'UTF8'
   lc_messages = 'English_United States.utf8'
   lc_monetary = 'English_United States.utf8'
   lc_numeric = 'English_United States.utf8'
   lc_time = 'English_United States.utf8'
   ```
   Restart PostgreSQL after making changes.

## Django Settings

1. **Configure Locale Paths**
   In `settings.py`:
   ```python
   from django.utils.translation import gettext_lazy as _
   
   LANGUAGE_CODE = 'fa'  # or your default language
   
   LANGUAGES = [
       ('en', _('English')),
       ('fa', _('Persian')),
   ]
   
   LOCALE_PATHS = [
       os.path.join(BASE_DIR, 'locale'),
   ]
   
   # Force UTF-8 for file system operations
   FILE_CHARSET = 'utf-8'
   DEFAULT_CHARSET = 'utf-8'
   ```

2. **Create and Compile Messages**
   ```bash
   # Create locale directories
   mkdir locale
   
   # Create/update .po files
   python manage.py makemessages -l fa
   
   # Compile messages
   python manage.py compilemessages
   ```

## Verification

1. **Test Database Connection**
   ```python
   # In Django shell
   from django.db import connection
   print(connection.encoding)  # Should return 'utf8'
   ```

2. **Test Translation**
   - Add some Persian text in your admin panel
   - Check if it saves and displays correctly
   - Verify in the database that the text is stored correctly

## Troubleshooting

### Error: "character has no equivalent in encoding 'WIN1252'"
- Ensure the database is using UTF-8 encoding
- Verify `client_encoding` is set to UTF8 in both Django settings and PostgreSQL
- Check that the Windows system locale is set to use UTF-8

### Text Appears as Question Marks (????)
- Check the database column collation
- Ensure the HTML template has the correct charset:
  ```html
  <meta charset="utf-8">
  ```

### Translations Not Updating
- Clear your browser cache
- Run `python manage.py compilemessages` after updating .po files
- Ensure `USE_I18N = True` in settings.py

## Additional Resources

- [Django Internationalization](https://docs.djangoproject.com/en/4.2/topics/i18n/)
- [PostgreSQL Character Set Support](https://www.postgresql.org/docs/current/multibyte.html)
- [Windows Locale Settings](https://support.microsoft.com/en-us/windows/change-the-system-locale-572d07e7-ae7f-72f5-6b29-888a2fbdd930)
