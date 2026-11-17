from django.db import models


class Page(models.Model):
    slug = models.SlugField(max_length=100, primary_key=True)
    institution_id = models.CharField(max_length=50, default="college")
    title = models.CharField(max_length=255)
    subtitle = models.CharField(max_length=255, blank=True)
    content = models.TextField(blank=True)
    banner_image = models.CharField(max_length=255, blank=True)
    is_published = models.BooleanField(default=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.title} (/{self.slug})"


class ContactInquiry(models.Model):
    name = models.CharField(max_length=255)
    email = models.EmailField()
    phone = models.CharField(max_length=50, blank=True)
    institution_id = models.CharField(max_length=50, default="college")
    subject = models.CharField(max_length=255)
    message = models.TextField()
    is_resolved = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.name}: {self.subject}"


class MediaAsset(models.Model):
    title = models.CharField(max_length=255)
    institution_id = models.CharField(max_length=50, default="college")
    asset_type = models.CharField(max_length=30, default="image")
    category = models.CharField(max_length=50, default="Campus")
    url = models.CharField(max_length=255)
    uploaded_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.title} ({self.category})"
