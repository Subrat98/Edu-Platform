from django.contrib import admin
from .models import Department, Programme, ClassSection, CourseSubject


@admin.register(Department)
class DepartmentAdmin(admin.ModelAdmin):
    list_display = ("code", "name", "institution_id", "head_of_department", "faculty_count", "student_count")
    list_filter = ("institution_id",)
    search_fields = ("name", "code", "head_of_department")


@admin.register(Programme)
class ProgrammeAdmin(admin.ModelAdmin):
    list_display = ("title", "level", "department", "duration_years", "seats", "institution_id", "is_active")
    list_filter = ("level", "institution_id", "is_active")
    search_fields = ("title", "department__name")


@admin.register(ClassSection)
class ClassSectionAdmin(admin.ModelAdmin):
    list_display = ("name", "grade", "section", "academic_year", "capacity", "institution_id")
    list_filter = ("institution_id", "academic_year")


@admin.register(CourseSubject)
class CourseSubjectAdmin(admin.ModelAdmin):
    list_display = ("code", "title", "credits", "department")
    search_fields = ("code", "title")
