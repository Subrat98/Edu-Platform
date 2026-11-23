from django.db import migrations, models
import django.utils.timezone
import cms.storage_paths

class Migration(migrations.Migration):
    initial = True
    dependencies = []
    operations = [
        migrations.CreateModel(name='Banner', fields=[
            ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
            ('created_at', models.DateTimeField(auto_now_add=True)), ('updated_at', models.DateTimeField(auto_now=True)),
            ('title', models.CharField(max_length=200)), ('subtitle', models.CharField(blank=True, max_length=300)),
            ('image', models.ImageField(upload_to=cms.storage_paths.banner_upload_to)), ('link', models.URLField(blank=True)),
            ('is_active', models.BooleanField(default=True)), ('sort_order', models.PositiveIntegerField(default=0)),
        ], options={'ordering': ['sort_order', '-created_at']}),
        migrations.CreateModel(name='ContactMessage', fields=[
            ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
            ('created_at', models.DateTimeField(auto_now_add=True)), ('updated_at', models.DateTimeField(auto_now=True)),
            ('name', models.CharField(max_length=120)), ('email', models.EmailField(max_length=254)),
            ('subject', models.CharField(max_length=180)), ('message', models.TextField()), ('is_read', models.BooleanField(default=False)),
        ]),
        migrations.CreateModel(name='Department', fields=[
            ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
            ('created_at', models.DateTimeField(auto_now_add=True)), ('updated_at', models.DateTimeField(auto_now=True)),
            ('name', models.CharField(max_length=160)), ('slug', models.SlugField(unique=True)),
            ('faculty', models.CharField(blank=True, max_length=160)), ('description', models.TextField(blank=True)),
            ('hod', models.CharField(blank=True, max_length=160)), ('programmes', models.JSONField(blank=True, default=list)),
            ('is_published', models.BooleanField(default=True)),
        ], options={'ordering': ['name']}),
        migrations.CreateModel(name='GalleryImage', fields=[
            ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
            ('created_at', models.DateTimeField(auto_now_add=True)), ('updated_at', models.DateTimeField(auto_now=True)),
            ('title', models.CharField(max_length=180)), ('image', models.ImageField(upload_to=cms.storage_paths.gallery_upload_to)),
            ('caption', models.CharField(blank=True, max_length=300)), ('is_published', models.BooleanField(default=True)),
        ]),
        migrations.CreateModel(name='Notice', fields=[
            ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
            ('created_at', models.DateTimeField(auto_now_add=True)), ('updated_at', models.DateTimeField(auto_now=True)),
            ('title', models.CharField(max_length=250)), ('description', models.TextField(blank=True)),
            ('date', models.DateField(default=django.utils.timezone.localdate)),
            ('category', models.CharField(choices=[('admission', 'Admission'), ('examination', 'Examination'), ('result', 'Result'), ('tender', 'Tender'), ('recruitment', 'Recruitment'), ('event', 'Event'), ('general', 'General')], default='general', max_length=20)),
            ('file', models.FileField(blank=True, null=True, upload_to=cms.storage_paths.notice_upload_to)), ('is_published', models.BooleanField(default=True)),
        ], options={'ordering': ['-date', '-created_at']}),
        migrations.CreateModel(name='Page', fields=[
            ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
            ('created_at', models.DateTimeField(auto_now_add=True)), ('updated_at', models.DateTimeField(auto_now=True)),
            ('title', models.CharField(max_length=200)), ('slug', models.SlugField(unique=True)),
            ('section', models.CharField(default='about', max_length=60)), ('content', models.TextField(blank=True)),
            ('meta_description', models.CharField(blank=True, max_length=300)), ('is_published', models.BooleanField(default=True)),
        ]),
    ]
