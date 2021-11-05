
from django.urls import path
from .views import TaskList, TaskDetail

app_name = 'task-api'
urlpatterns = [
    path('<str:pk>/',TaskDetail.as_view(),name="detail-task"),
    path('',TaskList.as_view(),name="list-tasks"),

]