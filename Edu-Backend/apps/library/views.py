from rest_framework import viewsets, filters
from .models import Book, BookLoan
from .serializers import BookSerializer, BookLoanSerializer


class BookViewSet(viewsets.ModelViewSet):
    queryset = Book.objects.all()
    serializer_class = BookSerializer
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ["title", "author", "isbn", "category"]
    ordering_fields = ["title", "available_copies", "year"]

    def get_queryset(self):
        qs = super().get_queryset()
        cat = self.request.query_params.get("category")
        inst = self.request.query_params.get("institution")
        if cat:
            qs = qs.filter(category=cat)
        if inst:
            qs = qs.filter(institution_id=inst)
        return qs


class BookLoanViewSet(viewsets.ModelViewSet):
    queryset = BookLoan.objects.all()
    serializer_class = BookLoanSerializer

    def get_queryset(self):
        qs = super().get_queryset()
        user_id = self.request.query_params.get("user_id")
        status_val = self.request.query_params.get("status")
        if user_id:
            qs = qs.filter(user_id=user_id)
        if status_val:
            qs = qs.filter(status=status_val)
        return qs
