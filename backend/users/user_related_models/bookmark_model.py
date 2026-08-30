from django.db import models
from django.conf import settings


class UserBookmark(models.Model):
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="user_bookmarks",
    )
    bookmarked_user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="bookmarked_by_users",
    )
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ("user", "bookmarked_user")
        ordering = ["-created_at"]
        verbose_name = "User Bookmark"
        verbose_name_plural = "User Bookmarks"

    def __str__(self):
        return f"{self.user} -> {self.bookmarked_user}"