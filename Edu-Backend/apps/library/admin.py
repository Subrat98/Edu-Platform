from django.contrib import admin
from .models import Book, BookLoan


@admin.register(Book)
class BookAdmin(admin.ModelAdmin):
    list_display = ("title", "author", "category", "total_copies", "available_copies", "shelf_location", "institution_id")
    list_filter = ("category", "institution_id")
    search_fields = ("title", "author", "isbn")


@admin.register(BookLoan)
class BookLoanAdmin(admin.ModelAdmin):
    list_display = ("book", "borrower_name", "borrow_date", "due_date", "status", "fine_amount")
    list_filter = ("status",)
    search_fields = ("borrower_name", "book__title")
