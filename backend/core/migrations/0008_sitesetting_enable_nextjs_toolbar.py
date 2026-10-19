from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0007_sitesetting_enable_identity_and_birth_cert'),
    ]

    operations = [
        migrations.AddField(
            model_name='sitesetting',
            name='enable_nextjs_toolbar',
            field=models.BooleanField(default=True, help_text='When disabled, the Next.js development toolbar indicator (N circle) is hidden from the page in development mode.', verbose_name='Enable Next.js Dev Toolbar'),
        ),
    ]
