from django.contrib.postgres.fields import ArrayField
from django.db import models
from users.models import PlatformUser,PlatformGroup
from django.utils import timezone
import uuid


class Task (models.Model):
    id = models.UUIDField(default=uuid.uuid4,primary_key=True,unique=True,editable=False)
    title = models.CharField(max_length=200)
    created_at = models.DateTimeField( auto_now_add=True)
    edited_at = models.DateTimeField( auto_now=True)
    assignee = models.ForeignKey(PlatformUser, on_delete=models.SET_NULL, related_name="task_list", null=True, blank=True)
    group = models.ForeignKey(PlatformGroup, on_delete=models.CASCADE, related_name="tasks")
    is_done = models.BooleanField(default=False)
    description = models.TextField(null=True,blank=True)

    

    def __str__(self):
        return self.title

  
