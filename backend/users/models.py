from collections import UserDict
from django.contrib.auth.models import AbstractUser
from django.db import models
from django.utils import timezone
from users.storage import OverwriteStorage


def user_avatar_path(instance, filename):
    ext = filename.split('.')[-1]
    return f'avatars/user_{instance.id}.{ext}'


class CustomUser(AbstractUser):
    ROLE_CHOICES = (
        ('user', 'User'),
        ('moderator', 'Moderator'),
        ('admin', 'Admin'),
    )
    email = models.EmailField(unique=True)
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='user')
    astro_level = models.IntegerField(default=1)
    avatar = models.ImageField(
        upload_to=user_avatar_path,
        storage=OverwriteStorage(),
        null=True,
        blank=True
    )

    blocked_until = models.DateTimeField(null=True, blank=True)

    def __str__(self):
        return self.username

    @property
    def is_blocked(self):
        if self.blocked_until and self.blocked_until > timezone.now():
            return True
        return False
