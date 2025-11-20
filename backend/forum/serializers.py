from rest_framework import serializers
from .models import Post, Comment, PostLike, CommentLike


class PostSerializer(serializers.ModelSerializer):
    author_username = serializers.SerializerMethodField()
    author_avatar = serializers.SerializerMethodField()

    comments_count = serializers.IntegerField(source='comments.count', read_only=True)
    likes_count = serializers.IntegerField(source='likes.count', read_only=True)

    is_liked = serializers.SerializerMethodField()

    class Meta:
        model = Post
        fields = ['id', 'title', 'content', 'author_username', 'created_at', 'author_avatar',
                  'comments_count', 'likes_count', 'is_liked']

    def get_author_username(self, obj):
        current_user = self.context.get('request').user
        if obj.author:
            return obj.author.username
        return "Account Deleted"

    def get_author_avatar(self, obj):
        if obj.author and obj.author.avatar:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.author.avatar.url)
        name = obj.author.username if obj.author else "Deleted"
        return f"https://ui-avatars.com/api/?name={name}&background=random&color=fff"

    def get_is_liked(self, obj):
        user = self.context.get('request').user
        if user.is_authenticated:
            return PostLike.objects.filter(post=obj, user=user).exists()
        return False


class CommentSerializer(serializers.ModelSerializer):
    author_username = serializers.SerializerMethodField()
    author_avatar = serializers.SerializerMethodField()

    likes_count = serializers.IntegerField(source='likes.count', read_only=True)
    is_liked = serializers.SerializerMethodField()

    class Meta:
        model = Comment
        fields = ['id', 'author_username', 'content', 'created_at', 'author_avatar', 'is_liked', 'likes_count']

    def get_author_username(self, obj):
        if obj.author:
            return obj.author.username
        return "Account Deleted"

    def get_author_avatar(self, obj):
        if obj.author and obj.author.avatar:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.author.avatar.url)
        name = obj.author.username if obj.author else "Deleted"
        return f"https://ui-avatars.com/api/?name={name}&background=random&color=fff"

    def get_is_liked(self, obj):
        user = self.context.get('request').user
        if user.is_authenticated:
            return CommentLike.objects.filter(comment=obj, user=user).exists()
        return False
