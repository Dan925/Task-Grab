from django.shortcuts import render
from rest_framework import generics
from .serializers import TaskSerializer
from .models import Task

class TaskList(generics.ListCreateAPIView):
    serializer_class = TaskSerializer
    
    def get_queryset(self):
        user = self.request.user
        return Task.objects.filter(group__in=user.groups.all())

class TaskDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = Task.objects.all()
    serializer_class = TaskSerializer

   