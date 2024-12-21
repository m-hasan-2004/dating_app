from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0006_alter_user_access_code'),
    ]

    operations = [
        # Step 1: Add a new temporary column
        migrations.AddField(
            model_name='user',
            name='access_code_temp',
            field=models.OneToOneField(
                blank=True,
                null=True,
                on_delete=django.db.models.deletion.PROTECT,
                to='users.accesscode',
                verbose_name='Access Code Temp'
            ),
        ),
        # Step 2: Migrate data (you'll need a separate step to populate this)
        # Step 3: Remove the old field
        migrations.RemoveField(
            model_name='user',
            name='access_code',
        ),
        # Step 4: Rename the temp column to the original name
        migrations.RenameField(
            model_name='user',
            old_name='access_code_temp',
            new_name='access_code',
        ),
    ]
