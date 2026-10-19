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

        # Ensure default SiteSetting singleton is initialized with Amine Vesal branding
        try:
            from core.models import SiteSetting
            s = SiteSetting.get_settings()
            updated = False
            if not s.site_name_fa or s.site_name_fa in ("همسان‌گزینی", "سامانه همسان‌گزینی و ازدواج دائم"):
                s.site_name_fa = "امین وصال"
                updated = True
            if not s.site_name_en or s.site_name_en == "TailAdmin Matchmaking":
                s.site_name_en = "Amine vesal"
                updated = True
            if not s.site_tagline_fa:
                s.site_tagline_fa = "سامانه همسان‌گزینی"
                updated = True
            if not s.custom_primary_color:
                s.color_palette = "custom"
                s.custom_primary_color = "#289333"
                s.custom_secondary_color = "#289333"
                updated = True
            if not s.logo_url:
                s.logo_url = "/media/site_branding/logos/logo.png"
                updated = True
            if not s.favicon_url:
                s.favicon_url = "/media/site_branding/favicons/favicon.png"
                updated = True
            if updated:
                s.save()
                self.stdout.write(self.style.SUCCESS("Initialized Amine Vesal site settings automatically."))
        except Exception as e:
            self.stdout.write(self.style.WARNING(f"SiteSetting check notice: {str(e)}"))
