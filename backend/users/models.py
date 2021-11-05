from django.db import models
from django.utils import timezone
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin, BaseUserManager
from django.utils.translation import ugettext_lazy as _
import uuid
from django.core.mail import send_mail
from django.template.loader import render_to_string
from smtplib import SMTPException
import os

class PlatformGroupManager(models.Manager):
    def for_user(self,user):
        return self.get_queryset().filter(id__in=user.groups.all().values('id'))

class PlatformGroup(models.Model):
    name = models.CharField(max_length=100,unique=True)
    created_at = models.DateTimeField(default=timezone.now)
    objects = PlatformGroupManager()
    id = models.UUIDField(default=uuid.uuid4,primary_key=True,unique=True)
    class Meta:
        ordering =['created_at']

  

    def __str__(self):
        return self.name


class PlatformUserManager(BaseUserManager):
    def create_user(self, email, user_name, password, first_name,last_name, **other_fields):
        if not email:
            raise ValueError(_('You must provide an email address'))
        email = self.normalize_email(email)
        user = self.model(email=email, user_name=user_name,first_name=first_name,last_name=last_name, **other_fields)
        user.set_password(password)
        user.save()
        return user

    def create_superuser(self, email, user_name, password, first_name,last_name, **other_fields):
        other_fields.setdefault('is_superuser', True)
        other_fields.setdefault('is_active', True)
        other_fields.setdefault('is_staff',True)
        if other_fields.get('is_superuser') is not True:
            raise ValueError(_('is_superuser=True must be assigned to a Superuser'))
        if other_fields.get('is_active') is not True:
            raise ValueError(_('is_active=True must be assigned to a Superuser'))
        if other_fields.get('is_staff') is not True:
            raise ValueError(_('is_staff=True must be assigned to a Superuser'))

        return self.create_user(email,user_name,password,first_name,last_name,**other_fields)



class PlatformUser(AbstractBaseUser, PermissionsMixin):
    email = models.EmailField(_('email address'), unique=True)
    user_name = models.CharField(max_length=150, unique=True)
    first_name = models.CharField(null=True, max_length=150)
    last_name = models.CharField(null=True, max_length=150)
    groups = models.ManyToManyField(PlatformGroup, related_name='group_members',blank=True)
    created_at = models.DateTimeField(default=timezone.now)
    is_active = models.BooleanField(default=True)
    is_superuser = models.BooleanField(default=False)
    is_staff = models.BooleanField(default=True)
    id = models.UUIDField(default=uuid.uuid4, primary_key=True,unique=True)

    objects = PlatformUserManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['user_name','first_name','last_name']

    def __str__(self):
        return self.email


class PlatformInvitation(models.Model):
    email = models.EmailField(_('email address'))
    group = models.ForeignKey(PlatformGroup, on_delete=models.CASCADE,related_name='invitations')
    accepted = models.BooleanField(default=False)
    created_at = models.DateTimeField(default=timezone.now)
    id = models.UUIDField(default=uuid.uuid4, primary_key=True,unique=True)

    def __str__(self):
        return self.email
    
    def send_invitation(self):
        ctx = {"email":self.email,"group_name":self.group.name}
        msg_txt = render_to_string('invitation.txt',ctx)
        msg_html = render_to_string('invitation.html',ctx)
        subject = "TaskGrab Group Invitation"
        from_email = os.getenv('EMAIL_HOST_USER')
        recipients = [self.email,]
        try:
            send_mail(
                subject,
                msg_txt,
                from_email,
                recipients,
                fail_silently=False,
                html_message=msg_html,
            )
        except SMTPException:
            return False 
        return True