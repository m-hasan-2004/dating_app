from django.core.management.base import BaseCommand, CommandError
from users.user_related_models import AccessCode as Code
from django.utils import timezone



class Command(BaseCommand):
    help = "Creates Access Code in numbers"

    def add_arguments(self, parser):
        parser.add_argument("numbers", type=int)

    def handle(self, *args, **options):
        numbers = options["numbers"]
        for number in range(numbers):
            try:
                access_code = Code.objects.create(date_created=timezone.localtime())
            except Exception as e:
                raise CommandError(f"Opration Failed. \nError: {e}")

            self.stdout.write(
                self.style.SUCCESS(f"Successfully Created {access_code.code}")
            )

