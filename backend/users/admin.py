from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import CustomUser


class CustomUserAdmin(UserAdmin):
    model = CustomUser

    list_display = ['username', 'email', 'role', 'astro_level', 'is_staff']
    fieldsets = UserAdmin.fieldsets + (
        ('Extra Fields', {'fields': ('role', 'astro_level')}),
    )
    add_fieldsets = UserAdmin.add_fieldsets + (
        (None, {'fields': ('role', 'astro_level')}),
    )


admin.site.register(CustomUser, CustomUserAdmin)



