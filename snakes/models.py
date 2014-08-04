from django.contrib.auth.models import AbstractUser, User
from django.db import models

# Create your models here.

# class User(AbstractUser):
#     snake_high_score = models.IntegerField(default=0)
#     memory_high_score = models.IntegerField(default=0)

class Score(models.Model):
    user = models.ForeignKey(User, related_name="score")
    score = models.IntegerField(default=0)
    CHOICES = (
        ("memory", "memory"),
        ("snake", "snake"),
    )
    game = models.CharField(max_length=50, choices=CHOICES)
    timestamp = models.DateTimeField(auto_now_add=True)
