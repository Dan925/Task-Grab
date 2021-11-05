from django.contrib import admin
from .models import PlatformUser,PlatformGroup,PlatformInvitation
from django.contrib.auth.admin import UserAdmin

class UserAdminConfig(UserAdmin):
    ordering = ('-created_at',)
    search_fields = ('email','user_name','first_name','last_name')
    list_display = ('email','user_name','first_name','last_name','is_active','is_staff','is_superuser',)
    fieldsets = (
        ('Account Info', {'fields':('email','user_name','first_name','last_name','password','created_at')}),
        ('Permissions',{'fields':('groups','is_active','is_staff','is_superuser')})
    )

    

admin.site.register(PlatformUser,UserAdminConfig)

admin.site.register(PlatformGroup)
admin.site.register(PlatformInvitation)