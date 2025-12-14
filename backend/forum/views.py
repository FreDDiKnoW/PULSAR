from django.shortcuts import get_object_or_404
from rest_framework import generics, permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import Post, Comment, PostLike, CommentLike
from .serializers import PostSerializer, CommentSerializer
from users.permissions import IsNotBlocked, IsOwnerOrModerator


class PostListCreateView(generics.ListCreateAPIView):
    queryset = Post.objects.all().order_by('-created_at')
    serializer_class = PostSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly, IsNotBlocked]

    def perform_create(self, serializer):
        serializer.save(author=self.request.user)


class PostDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Post.objects.all()
    serializer_class = PostSerializer


class CommentListCreateView(generics.ListCreateAPIView):
    serializer_class = CommentSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly, IsNotBlocked]

    def get_queryset(self):
        post_id = self.kwargs['post_id']
        return Comment.objects.filter(post_id=post_id).order_by('created_at')

    def perform_create(self, serializer):
        post_id = self.kwargs['post_id']
        post = get_object_or_404(Post, id=post_id)
        serializer.save(author=self.request.user, post=post)


class BaseToggleLikeView(APIView):
    permission_classes = [permissions.IsAuthenticatedOrReadOnly, IsNotBlocked]
    model = None
    like_model = None
    field_name = ''

    def post(self, request, pk):
        obj = get_object_or_404(self.model, pk=pk)
        filter_kwargs = {self.field_name: obj, 'user': request.user}
        like_qs = self.like_model.objects.filter(**filter_kwargs)

        if like_qs.exists():
            like_qs.delete()
            return Response({'message': 'Unliked', 'likes_count': obj.likes.count()})
        else:
            self.like_model.objects.create(**filter_kwargs)
            return Response({'message': 'Liked', 'likes_count': obj.likes.count()})


class TogglePostLikeView(BaseToggleLikeView):
    model = Post
    like_model = PostLike
    field_name = 'post'


class ToggleCommentLikeView(BaseToggleLikeView):
    model = Comment
    like_model = CommentLike
    field_name = 'comment'
