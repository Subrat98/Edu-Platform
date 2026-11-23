from django.db import models
from django.utils import timezone
from datetime import timedelta
from .storage_paths import notice_upload_to, banner_upload_to, gallery_upload_to
class Timestamped(models.Model):
    created_at=models.DateTimeField(auto_now_add=True); updated_at=models.DateTimeField(auto_now=True)
    class Meta: abstract=True
class Notice(Timestamped):
    CATEGORIES=[(x,x.title()) for x in ['admission','examination','result','tender','recruitment','event','general']]
    title=models.CharField(max_length=250); description=models.TextField(blank=True); date=models.DateField(default=timezone.localdate); category=models.CharField(max_length=20,choices=CATEGORIES,default='general'); file=models.FileField(upload_to=notice_upload_to,blank=True,null=True); is_published=models.BooleanField(default=True)
    @property
    def is_new(self): return self.date >= timezone.localdate()-timedelta(days=14)
    class Meta: ordering=['-date','-created_at']
    def __str__(self): return self.title
class Department(Timestamped):
    name=models.CharField(max_length=160); slug=models.SlugField(unique=True); faculty=models.CharField(max_length=160,blank=True); description=models.TextField(blank=True); hod=models.CharField(max_length=160,blank=True); programmes=models.JSONField(default=list,blank=True); is_published=models.BooleanField(default=True)
    class Meta: ordering=['name']
    def __str__(self): return self.name
class Banner(Timestamped):
    title=models.CharField(max_length=200); subtitle=models.CharField(max_length=300,blank=True); image=models.ImageField(upload_to=banner_upload_to); link=models.URLField(blank=True); is_active=models.BooleanField(default=True); sort_order=models.PositiveIntegerField(default=0)
    class Meta: ordering=['sort_order','-created_at']
    def __str__(self): return self.title
class Page(Timestamped):
    title=models.CharField(max_length=200); slug=models.SlugField(unique=True); section=models.CharField(max_length=60,default='about'); content=models.TextField(blank=True); meta_description=models.CharField(max_length=300,blank=True); is_published=models.BooleanField(default=True)
    def __str__(self): return self.title
class GalleryImage(Timestamped):
    title=models.CharField(max_length=180); image=models.ImageField(upload_to=gallery_upload_to); caption=models.CharField(max_length=300,blank=True); is_published=models.BooleanField(default=True)
    def __str__(self): return self.title
class ContactMessage(Timestamped):
    name=models.CharField(max_length=120); email=models.EmailField(); subject=models.CharField(max_length=180); message=models.TextField(); is_read=models.BooleanField(default=False)
    def __str__(self): return f'{self.name}: {self.subject}'
