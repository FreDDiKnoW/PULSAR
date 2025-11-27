from django.urls import path
from .views import PostListCreateView, PostDetailView, CommentListCreateView, TogglePostLikeView, ToggleCommentLikeView

urlpatterns = [
    path('posts/', PostListCreateView.as_view(), name='post-list-create'),
    path('posts/<int:pk>/', PostDetailView.as_view(), name='post-detail'),
    path('posts/<int:post_id>/comments/', CommentListCreateView.as_view(), name='comment-list-create'),
    path('posts/<int:pk>/like/', TogglePostLikeView.as_view(), name='toggle-post-like'),
    path('comments/<int:pk>/like/', ToggleCommentLikeView.as_view(), name='toggle-comment-like'),
]
