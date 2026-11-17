from django.db import models


class Book(models.Model):
    id = models.CharField(max_length=100, primary_key=True)
    institution_id = models.CharField(max_length=50, default="college")
    title = models.CharField(max_length=255)
    author = models.CharField(max_length=255)
    isbn = models.CharField(max_length=50, blank=True)
    category = models.CharField(max_length=100, default="General")
    edition = models.CharField(max_length=50, blank=True)
    publisher = models.CharField(max_length=255, blank=True)
    year = models.IntegerField(default=2022)
    total_copies = models.IntegerField(default=5)
    available_copies = models.IntegerField(default=5)
    shelf_location = models.CharField(max_length=50, default="Stack A-3")
    cover_url = models.CharField(max_length=255, blank=True)

    def __str__(self):
        return f"{self.title} by {self.author}"


class BookLoan(models.Model):
    STATUS_CHOICES = (
        ("Active", "Active"),
        ("Returned", "Returned"),
        ("Overdue", "Overdue"),
    )
    id = models.CharField(max_length=100, primary_key=True)
    book = models.ForeignKey(Book, on_delete=models.CASCADE, related_name="loans")
    user_id = models.CharField(max_length=100)
    borrower_name = models.CharField(max_length=255)
    borrow_date = models.DateField()
    due_date = models.DateField()
    return_date = models.DateField(null=True, blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="Active")
    fine_amount = models.DecimalField(max_digits=7, decimal_places=2, default=0.00)

    def __str__(self):
        return f"{self.book.title} borrowed by {self.borrower_name} ({self.status})"
