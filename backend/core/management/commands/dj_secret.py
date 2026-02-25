from django.core.management.base import BaseCommand
from django.core.management.utils import get_random_secret_key
from pathlib import Path
import os


class Command(BaseCommand):
    help = "Generate a secure Django SECRET_KEY and optionally write it to a .env file"

    def add_arguments(self, parser):
        parser.add_argument(
            "--write",
            action="store_true",
            help="Write the generated key to a .env file",
        )
        parser.add_argument(
            "--path",
            type=str,
            default=".env",
            help="Path to the .env file (default: .env in project root)",
        )

    def handle(self, *args, **options):
        secret_key = get_random_secret_key()

        if options["write"]:
            env_path = Path(options["path"])

            if env_path.exists():
                with open(env_path, "a", encoding="utf-8") as f:
                    f.write(f"\nDJANGO_SECRET_KEY={secret_key}\n")
                self.stdout.write(self.style.SUCCESS(
                    f"SECRET_KEY appended to {env_path}"
                ))
            else:
                with open(env_path, "w", encoding="utf-8") as f:
                    f.write(f"DJANGO_SECRET_KEY={secret_key}\n")
                self.stdout.write(self.style.SUCCESS(
                    f"{env_path} created with SECRET_KEY"
                ))
        else:
            self.stdout.write(self.style.SUCCESS(secret_key))