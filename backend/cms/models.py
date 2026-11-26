from django.db import models
from django.utils import timezone
from datetime import timedelta
from .storage_paths import (
    notice_upload_to, banner_upload_to, gallery_upload_to,
    hostel_upload_to, hostel_rules_upload_to, hostel_notice_upload_to,
    document_upload_to,
)
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
class MenuSection(Timestamped):
    title=models.CharField(max_length=120)
    slug=models.SlugField(unique=True)
    link=models.CharField(max_length=255,blank=True)
    sort_order=models.PositiveIntegerField(default=0)
    is_active=models.BooleanField(default=True)
    class Meta: ordering=['sort_order','title']
    def __str__(self): return self.title
class ContactMessage(Timestamped):
    name=models.CharField(max_length=120); email=models.EmailField(); subject=models.CharField(max_length=180); message=models.TextField(); is_read=models.BooleanField(default=False)
    def __str__(self): return f'{self.name}: {self.subject}'

class Hostel(Timestamped):
    HOSTEL_TYPES=[('boys','Boys'),('girls','Girls'),('coed','Co-ed')]
    name=models.CharField(max_length=160); slug=models.SlugField(unique=True); hostel_type=models.CharField(max_length=10,choices=HOSTEL_TYPES,default='boys'); capacity=models.PositiveIntegerField(default=0); location=models.CharField(max_length=255,blank=True)
    warden_name=models.CharField(max_length=160,blank=True); warden_phone=models.CharField(max_length=30,blank=True); warden_email=models.EmailField(blank=True)
    description=models.TextField(blank=True); facilities=models.JSONField(default=list,blank=True)
    rules_text=models.TextField(blank=True); rules_file=models.FileField(upload_to=hostel_rules_upload_to,blank=True,null=True); image=models.ImageField(upload_to=hostel_upload_to,blank=True,null=True)
    admission_process=models.TextField(blank=True); important_dates=models.TextField(blank=True); payment_instructions=models.TextField(blank=True); bank_details=models.TextField(blank=True)
    is_published=models.BooleanField(default=True); sort_order=models.PositiveIntegerField(default=0)
    class Meta: ordering=['sort_order','name']
    def __str__(self): return self.name

class HostelRoomType(Timestamped):
    CATEGORIES=[('single','Single'),('double','Double'),('triple','Triple'),('dormitory','Dormitory')]
    BATHROOM=[('attached','Attached'),('common','Common')]
    hostel=models.ForeignKey(Hostel,related_name='room_types',on_delete=models.CASCADE)
    slug=models.SlugField(max_length=180,unique=True,blank=True)
    category=models.CharField(max_length=20,choices=CATEGORIES,default='single'); seats_per_room=models.PositiveIntegerField(default=1); is_ac=models.BooleanField(default=False)
    bathroom_type=models.CharField(max_length=10,choices=BATHROOM,default='common'); room_count=models.PositiveIntegerField(default=0); vacant_count=models.PositiveIntegerField(default=0)
    is_published=models.BooleanField(default=True)
    class Meta: ordering=['hostel_id','category']
    def save(self,*args,**kwargs):
        if not self.slug:
            self.slug=f'{self.hostel.slug}-{self.category}-{"ac" if self.is_ac else "nonac"}'
        super().save(*args,**kwargs)
    def __str__(self): return f'{self.hostel.name} – {self.get_category_display()}'

class HostelMessMenu(Timestamped):
    DAYS=[(d,d) for d in ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday']]
    MEALS=[('breakfast','Breakfast'),('lunch','Lunch'),('snacks','Snacks'),('dinner','Dinner')]
    hostel=models.ForeignKey(Hostel,related_name='mess_menu',on_delete=models.CASCADE)
    slug=models.SlugField(max_length=180,unique=True,blank=True)
    day=models.CharField(max_length=10,choices=DAYS); meal=models.CharField(max_length=12,choices=MEALS); items=models.TextField(blank=True)
    class Meta:
        ordering=['hostel_id','day','meal']
        unique_together=[('hostel','day','meal')]
    def save(self,*args,**kwargs):
        if not self.slug:
            self.slug=f'{self.hostel.slug}-{self.day.lower()}-{self.meal}'
        super().save(*args,**kwargs)
    def __str__(self): return f'{self.hostel.name} {self.day} {self.meal}'

class HostelNotice(Timestamped):
    NOTICE_TYPES=[('selection_list','Selection List'),('waiting_list','Waiting List'),('final_list','Final List'),('spot_round','Spot Round'),('general','General')]
    hostel=models.ForeignKey(Hostel,related_name='notices',null=True,blank=True,on_delete=models.SET_NULL)
    title=models.CharField(max_length=250); notice_type=models.CharField(max_length=20,choices=NOTICE_TYPES,default='general'); academic_year=models.CharField(max_length=9,blank=True)
    date=models.DateField(default=timezone.localdate); file=models.FileField(upload_to=hostel_notice_upload_to,blank=True,null=True); description=models.TextField(blank=True); is_published=models.BooleanField(default=True)
    class Meta: ordering=['-date','-created_at']
    def __str__(self): return self.title

class HostelFeeHead(Timestamped):
    FEE_TYPES=[('one_time','One-time'),('recurring','Recurring'),('refundable','Refundable')]
    FREQUENCIES=[('one_time','One-time'),('monthly','Monthly'),('term','Term'),('annual','Annual')]
    name=models.CharField(max_length=120); slug=models.SlugField(unique=True); fee_type=models.CharField(max_length=12,choices=FEE_TYPES,default='one_time'); frequency=models.CharField(max_length=10,choices=FREQUENCIES,default='one_time')
    is_optional=models.BooleanField(default=False); description=models.CharField(max_length=255,blank=True); sort_order=models.PositiveIntegerField(default=0); is_active=models.BooleanField(default=True)
    class Meta: ordering=['sort_order','name']
    def __str__(self): return self.name

class HostelFee(Timestamped):
    CATEGORIES=[('general','General'),('sc_st','SC/ST'),('obc','OBC'),('outstation','Outstation'),('scholarship','Scholarship'),('staff_ward','Staff Ward')]
    hostel=models.ForeignKey(Hostel,related_name='fees',on_delete=models.CASCADE)
    room_type=models.ForeignKey(HostelRoomType,related_name='fees',null=True,blank=True,on_delete=models.CASCADE)
    fee_head=models.ForeignKey(HostelFeeHead,related_name='fee_rows',on_delete=models.CASCADE)
    slug=models.SlugField(max_length=220,unique=True,blank=True)
    academic_year=models.CharField(max_length=9); category=models.CharField(max_length=20,choices=CATEGORIES,default='general'); amount=models.DecimalField(max_digits=10,decimal_places=2,default=0); is_active=models.BooleanField(default=True)
    class Meta:
        ordering=['-academic_year','hostel_id','room_type_id','fee_head_id']
        unique_together=[('hostel','room_type','fee_head','academic_year','category')]
    def save(self,*args,**kwargs):
        if not self.slug:
            rt=self.room_type.slug if self.room_type_id else 'na'
            self.slug=f'{self.hostel.slug}-{rt}-{self.fee_head.slug}-{self.academic_year}-{self.category}'
        super().save(*args,**kwargs)
    def __str__(self): return self.slug

class Document(Timestamped):
    CATEGORIES=[('act_statute','Act & Statute'),('academic_calendar','Academic Calendar'),('syllabus','Syllabus'),('holiday_list','Holiday List'),('organogram','Organogram'),('naac','NAAC'),('nirf','NIRF'),('iqac','IQAC'),('form','Downloadable Form'),('other','Other')]
    title=models.CharField(max_length=200); slug=models.SlugField(unique=True); category=models.CharField(max_length=20,choices=CATEGORIES,default='other')
    file=models.FileField(upload_to=document_upload_to); year=models.CharField(max_length=9,blank=True); description=models.CharField(max_length=255,blank=True)
    is_published=models.BooleanField(default=True); sort_order=models.PositiveIntegerField(default=0)
    class Meta: ordering=['category','-year','sort_order','title']
    def __str__(self): return self.title
