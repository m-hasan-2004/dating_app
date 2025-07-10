from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from django.core.management import call_command
from django.core.management.base import CommandError

User = get_user_model()

class Command(BaseCommand):
    help = 'Creates a superuser with predefined credentials if it does not exist'

    def handle(self, *args, **options):
        username = 'superuser1'
        email = 'superuser@gmail.com'
        password = 'superUser@1'
        phone_number = '+9809123541225'

        if User.objects.filter(username=username).exists():
            self.stdout.write(self.style.WARNING(f'User {username} already exists. No action taken.'))
            return

        try:
            user = User.objects.create_superuser(
                username=username,
                email=email,
                password=password,
                phone_number=phone_number
            )
            self.stdout.write(self.style.SUCCESS(f'Successfully created superuser: {username}'))
            self.stdout.write(self.style.SUCCESS(f'Username: {username}'))
            self.stdout.write(self.style.SUCCESS(f'Email: {email}'))
            self.stdout.write(self.style.SUCCESS('Password: *********'))
            self.stdout.write(self.style.SUCCESS(f'Phone Number: {phone_number}'))
        except Exception as e:
            raise CommandError(f'Error creating superuser: {str(e)}')
