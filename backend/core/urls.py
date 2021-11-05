
from django.contrib import admin
from django.urls import path, include
from rest_framework_simplejwt.views import TokenRefreshView
from users.views import CustomUserObtainPairView


urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/token/', CustomUserObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('api/users/',include('users.urls',namespace='users')),
    path('api/tasks/',include('api.urls',namespace="task-api")),
]
