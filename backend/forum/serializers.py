from rest_framework import serializers
from .models import Post, Comment


class PostSerializer(serializers.ModelSerializer):
    author_username = serializers.SerializerMethodField()

    class Meta:
        model = Post
        fields = ['id', 'title', 'content', 'author_username', 'created_at']

    def get_author_username(self, obj):
        current_user = self.context.get('request').user
        if obj.author:
            return obj.author.username
        return "Account Deleted"


class CommentSerializer(serializers.ModelSerializer):
    author_username = serializers.SerializerMethodField()

    class Meta:
        model = Comment
        fields = ['id', 'author_username', 'content', 'created_at']

    def get_author_username(self, obj):
        if obj.author:
            return obj.author.username
        return "Account Deleted"
