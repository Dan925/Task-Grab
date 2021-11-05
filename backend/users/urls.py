from .views import CustomUserCreate, BlackListTokenView
from django.urls import path
from .views import GroupList, UserList, GroupDetail,InvitationDestroy,InvitationList

app_name = 'users'
urlpatterns = [
    path('register/',CustomUserCreate.as_view(),name="create-user"),
    path('logout/',BlackListTokenView.as_view(),name="logout-user"),
    path('groups/',GroupList.as_view(),name="list-groups"),
    path('groups/<str:pk>/',GroupDetail.as_view(),name="detail-group"),
    path('invitations/',InvitationList.as_view(),name="create-invitation"),
    path('invitations/<str:pk>',InvitationDestroy.as_view(),name="delete-invitation"),
    path('',UserList.as_view(),name="list-users")
]
