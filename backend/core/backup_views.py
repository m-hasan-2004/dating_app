import os
import subprocess
import gzip
import shutil
import tempfile
from datetime import datetime
from django.conf import settings
from django.http import HttpResponse, FileResponse, Http404
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.parsers import MultiPartParser, FormParser
from drf_spectacular.utils import extend_schema, OpenApiResponse
from users.permissions import IsSuperUser


def get_db_credentials():
    db_settings = settings.DATABASES.get("default", {})
    return {
        "name": os.getenv("DB_NAME", db_settings.get("NAME", "dating_app")),
        "user": os.getenv("DB_USER", db_settings.get("USER", "hasan")),
        "password": os.getenv("DB_PASSWORD", db_settings.get("PASSWORD", "Welcome")),
        "host": os.getenv("DB_HOST", db_settings.get("HOST", "db")),
        "port": str(os.getenv("DB_PORT", db_settings.get("PORT", "5432"))),
    }


def format_size(bytes_size):
    for unit in ["B", "KB", "MB", "GB"]:
        if bytes_size < 1024:
            return f"{bytes_size:.1f} {unit}"
        bytes_size /= 1024
    return f"{bytes_size:.1f} TB"


@extend_schema(
    tags=["Backup & Restore"],
    summary="Export PostgreSQL database as backup.sql",
    description="Generates an uncompressed PostgreSQL database dump (.sql) and streams it directly as a download.",
    responses={
        200: OpenApiResponse(description="Direct SQL dump file stream"),
        403: OpenApiResponse(description="Forbidden: Requires superuser privileges"),
        500: OpenApiResponse(description="Database export failed"),
    },
)
class DatabaseExportView(APIView):
    permission_classes = [IsSuperUser]

    def get(self, request):
        creds = get_db_credentials()
        env = os.environ.copy()
        env["PGPASSWORD"] = creds["password"]

        # Check if pg_dump is available
        if not shutil.which("pg_dump"):
            return Response(
                {"error": "pg_dump tool is not available in the current container/host environment."},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

        cmd = [
            "pg_dump",
            "-h", creds["host"],
            "-p", creds["port"],
            "-U", creds["user"],
            "-d", creds["name"],
            "-F", "p",
            "--no-owner",
            "--no-privileges",
            "--clean",
            "--if-exists",
        ]

        try:
            proc = subprocess.run(
                cmd,
                env=env,
                stdout=subprocess.PIPE,
                stderr=subprocess.PIPE,
                check=False,
            )
            if proc.returncode != 0:
                err_msg = proc.stderr.decode("utf-8", errors="replace")
                return Response(
                    {"error": f"pg_dump failed: {err_msg}"},
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR,
                )

            timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
            filename = f"backup_{timestamp}.sql"
            response = HttpResponse(proc.stdout, content_type="application/sql")
            response["Content-Disposition"] = f'attachment; filename="{filename}"'
            return response
        except Exception as e:
            return Response(
                {"error": f"Export exception: {str(e)}"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )


@extend_schema(
    tags=["Backup & Restore"],
    summary="Import PostgreSQL database from uploaded backup.sql or backup.sql.gz",
    description="Uploads a SQL dump and restores it into PostgreSQL via psql.",
    responses={
        200: OpenApiResponse(description="Database restored successfully"),
        400: OpenApiResponse(description="Invalid file or parameters"),
        403: OpenApiResponse(description="Forbidden: Requires superuser privileges"),
        500: OpenApiResponse(description="Database restore failed"),
    },
)
class DatabaseImportView(APIView):
    permission_classes = [IsSuperUser]
    parser_classes = [MultiPartParser, FormParser]

    def post(self, request):
        uploaded_file = request.FILES.get("backup_file")
        if not uploaded_file:
            return Response(
                {"error": "No backup file provided. Expected 'backup_file' form field with .sql or .sql.gz file."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        filename = uploaded_file.name.lower()
        if not (filename.endswith(".sql") or filename.endswith(".sql.gz") or filename.endswith(".gz")):
            return Response(
                {"error": "Unsupported file format. Expected an uncompressed 'backup.sql' or compressed 'backup.sql.gz'."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        creds = get_db_credentials()
        env = os.environ.copy()
        env["PGPASSWORD"] = creds["password"]

        if not shutil.which("psql"):
            return Response(
                {"error": "psql tool is not available in the current container/host environment."},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

        temp_dir = tempfile.mkdtemp()
        temp_sql_path = os.path.join(temp_dir, "temp_restore.sql")

        try:
            # Handle decompression if .gz
            if filename.endswith(".gz"):
                with gzip.GzipFile(fileobj=uploaded_file, mode="rb") as gz_in:
                    with open(temp_sql_path, "wb") as f_out:
                        shutil.copyfileobj(gz_in, f_out)
            else:
                with open(temp_sql_path, "wb") as f_out:
                    for chunk in uploaded_file.chunks():
                        f_out.write(chunk)

            # Reset public schema first to prevent constraint violations and 'table already exists' conflicts
            reset_sql = (
                f"DROP SCHEMA IF EXISTS public CASCADE; "
                f"CREATE SCHEMA public; "
                f"GRANT ALL ON SCHEMA public TO {creds['user']}; "
                f"GRANT ALL ON SCHEMA public TO public;"
            )
            reset_cmd = [
                "psql",
                "-h", creds["host"],
                "-p", creds["port"],
                "-U", creds["user"],
                "-d", creds["name"],
                "-c", reset_sql,
            ]
            subprocess.run(
                reset_cmd,
                env=env,
                stdout=subprocess.PIPE,
                stderr=subprocess.PIPE,
                check=False,
            )

            # Execute psql to restore database from SQL dump
            cmd = [
                "psql",
                "-h", creds["host"],
                "-p", creds["port"],
                "-U", creds["user"],
                "-d", creds["name"],
            ]

            with open(temp_sql_path, "r", encoding="utf-8", errors="ignore") as f_in:
                proc = subprocess.run(
                    cmd,
                    stdin=f_in,
                    env=env,
                    stdout=subprocess.PIPE,
                    stderr=subprocess.PIPE,
                    check=False,
                )

            if proc.returncode != 0:
                err_msg = proc.stderr.decode("utf-8", errors="replace")
                return Response(
                    {"error": f"psql restore execution failed: {err_msg}"},
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR,
                )

            # Run migrations to align any schema differences
            try:
                from django.core.management import call_command
                call_command("migrate", interactive=False)
            except Exception:
                pass

            # Calculate restored users
            user_count = 0
            try:
                from django.contrib.auth import get_user_model
                User = get_user_model()
                user_count = User.objects.count()
            except Exception:
                pass

            return Response(
                {
                    "status": "success",
                    "message": f"پایگاه داده با موفقیت بازیابی شد. تعداد کاربران بازیابی‌شده: {user_count} نفر",
                    "user_count": user_count,
                    "details": proc.stdout.decode("utf-8", errors="replace")[-500:],
                },
                status=status.HTTP_200_OK,
            )
        except Exception as e:
            return Response(
                {"error": f"Restore failed with exception: {str(e)}"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )
        finally:
            shutil.rmtree(temp_dir, ignore_errors=True)


@extend_schema(
    tags=["Backup & Restore"],
    summary="List automated and manual backup files or trigger on-demand backup",
    description="Returns files in /backups/ directory or triggers an immediate backup via /usr/local/bin/backup_db.sh.",
)
class DatabaseBackupListView(APIView):
    permission_classes = [IsSuperUser]

    def get(self, request):
        backup_dir = os.environ.get("BACKUP_DIR", "/backups")
        backups = []

        if os.path.exists(backup_dir) and os.path.isdir(backup_dir):
            for entry in os.scandir(backup_dir):
                if entry.is_file() and (entry.name.endswith(".sql") or entry.name.endswith(".sql.gz")):
                    try:
                        stat = entry.stat()
                        backups.append(
                            {
                                "name": entry.name,
                                "size": stat.st_size,
                                "size_formatted": format_size(stat.st_size),
                                "modified": datetime.fromtimestamp(stat.st_mtime).isoformat(),
                            }
                        )
                    except OSError:
                        continue

        # Sort newest first
        backups.sort(key=lambda x: x["modified"], reverse=True)
        return Response({"backups": backups, "backup_dir": backup_dir}, status=status.HTTP_200_OK)

    def post(self, request):
        # Trigger manual backup
        backup_script = "/usr/local/bin/backup_db.sh"
        if os.path.exists(backup_script) and os.access(backup_script, os.X_OK):
            try:
                proc = subprocess.run(
                    [backup_script],
                    stdout=subprocess.PIPE,
                    stderr=subprocess.PIPE,
                    check=False,
                )
                if proc.returncode != 0:
                    return Response(
                        {"error": f"Backup script failed: {proc.stderr.decode('utf-8', errors='replace')}"},
                        status=status.HTTP_500_INTERNAL_SERVER_ERROR,
                    )
                return Response(
                    {"status": "success", "message": "Manual backup created successfully."},
                    status=status.HTTP_201_CREATED,
                )
            except Exception as e:
                return Response(
                    {"error": f"Failed to trigger backup script: {str(e)}"},
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR,
                )

        # Fallback: run pg_dump directly into /backups
        creds = get_db_credentials()
        backup_dir = os.environ.get("BACKUP_DIR", "/backups")
        os.makedirs(backup_dir, exist_ok=True)
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        backup_filename = f"{creds['name']}_{timestamp}.sql.gz"
        backup_path = os.path.join(backup_dir, backup_filename)

        env = os.environ.copy()
        env["PGPASSWORD"] = creds["password"]

        if not shutil.which("pg_dump"):
            return Response(
                {"error": "Neither backup script nor pg_dump binary is available."},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

        cmd = [
            "pg_dump",
            "-h", creds["host"],
            "-p", creds["port"],
            "-U", creds["user"],
            "-d", creds["name"],
            "-F", "p",
            "--no-owner",
            "--no-privileges",
            "--clean",
            "--if-exists",
        ]

        try:
            with open(backup_path, "wb") as f_out:
                with gzip.GzipFile(fileobj=f_out, mode="wb") as gz_out:
                    proc = subprocess.run(
                        cmd,
                        env=env,
                        stdout=gz_out,
                        stderr=subprocess.PIPE,
                        check=False,
                    )
            if proc.returncode != 0:
                os.remove(backup_path)
                return Response(
                    {"error": f"pg_dump failed: {proc.stderr.decode('utf-8', errors='replace')}"},
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR,
                )

            return Response(
                {
                    "status": "success",
                    "message": f"Backup created successfully: {backup_filename}",
                    "filename": backup_filename,
                },
                status=status.HTTP_201_CREATED,
            )
        except Exception as e:
            if os.path.exists(backup_path):
                os.remove(backup_path)
            return Response(
                {"error": f"Backup generation failed: {str(e)}"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )


@extend_schema(
    tags=["Backup & Restore"],
    summary="Download specific backup archive from /backups/",
)
class DatabaseBackupDownloadView(APIView):
    permission_classes = [IsSuperUser]

    def get(self, request, filename):
        # Prevent directory traversal
        if ".." in filename or "/" in filename or "\\" in filename:
            return Response({"error": "Invalid filename."}, status=status.HTTP_400_BAD_REQUEST)

        backup_dir = os.environ.get("BACKUP_DIR", "/backups")
        file_path = os.path.join(backup_dir, filename)

        if not os.path.exists(file_path) or not os.path.isfile(file_path):
            raise Http404("Backup file not found.")

        content_type = "application/gzip" if filename.endswith(".gz") else "application/sql"
        response = FileResponse(open(file_path, "rb"), content_type=content_type)
        response["Content-Disposition"] = f'attachment; filename="{filename}"'
        return response
