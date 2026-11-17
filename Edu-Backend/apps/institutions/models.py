from django.db import models


class Institution(models.Model):
    TYPE_CHOICES = (
        ("school", "School"),
        ("college", "College"),
    )
    id = models.CharField(max_length=50, primary_key=True)
    type = models.CharField(max_length=20, choices=TYPE_CHOICES)
    name = models.CharField(max_length=255)
    short_name = models.CharField(max_length=20, blank=True)
    tagline = models.CharField(max_length=255, blank=True)
    description = models.TextField(blank=True)
    established_year = models.IntegerField(default=2026)
    affiliation = models.CharField(max_length=255, blank=True)
    
    # Contact
    address = models.CharField(max_length=255, blank=True)
    city = models.CharField(max_length=100, blank=True)
    state = models.CharField(max_length=100, blank=True)
    pincode = models.CharField(max_length=20, blank=True)
    phone = models.CharField(max_length=50, blank=True)
    alt_phone = models.CharField(max_length=50, blank=True)
    email = models.EmailField(blank=True)
    map_query = models.CharField(max_length=255, blank=True)

    # Socials
    facebook = models.URLField(blank=True)
    youtube = models.URLField(blank=True)
    instagram = models.URLField(blank=True)
    linkedin = models.URLField(blank=True)
    twitter = models.URLField(blank=True)

    # Branding & Theme
    logo_url = models.CharField(max_length=255, blank=True)
    primary_color = models.CharField(max_length=20, default="#E42227")
    accent_color = models.CharField(max_length=20, default="#991b1b")
    background_color = models.CharField(max_length=20, default="#FFFFFF")
    text_primary_color = models.CharField(max_length=20, default="#7F0000")
    
    # Metadata
    stats = models.JSONField(default=list, blank=True)
    is_visible = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["id"]

    def __str__(self):
        return f"{self.name} ({self.type})"


class PlatformSettings(models.Model):
    CONTENT_MODE_CHOICES = (
        ("both", "Both Wings Visible"),
        ("school_only", "School Wing Only"),
        ("college_only", "College Wing Only"),
    )
    content_mode = models.CharField(max_length=30, choices=CONTENT_MODE_CHOICES, default="both")
    school_visible = models.BooleanField(default=True)
    college_visible = models.BooleanField(default=True)
    maintenance_mode = models.BooleanField(default=False)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Platform Settings ({self.content_mode})"
