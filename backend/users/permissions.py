from rest_framework import permissions
from django.utils import timezone


class IsNotBlocked(permissions.BasePermission):
    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return True
        if not request.user.is_authenticated:
            return True
        if request.user.blocked_until and request.user.blocked_until > timezone.now():
            return False

        return True


class IsOwnerOrModerator(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True

        if obj.author == request.user:
            return True

        if request.user.role in ['moderator', 'admin']:
            return True

        return False


class IsModerator(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role in ['moderator', 'admin']