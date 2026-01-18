from django.contrib import admin
from .models import Post


@admin.register(Post)
class PostAdmin(admin.ModelAdmin):
    list_display = ['title', 'created_at', 'updated_at', 'published']
    list_filter = ['published', 'created_at']
    search_fields = ['title', 'content']
    list_editable = ['published']
    ordering = ['-created_at']
    date_hierarchy = 'created_at'
