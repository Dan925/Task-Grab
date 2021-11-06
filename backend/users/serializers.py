from rest_framework import serializers
from rest_framework.utils import model_meta
from .models import PlatformUser,PlatformGroup,PlatformInvitation
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer


class RegisterUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = PlatformUser
        fields = ('email','user_name','password','first_name','last_name')
        extra_kwargs = {'password':{'write_only':True}}

    def create(self, validated_data):
        password  = validated_data.pop('password',None)
        instance = self.Meta.model(**validated_data) #destructure the validated_data dict with **

        if password is not None:
            instance.set_password(password)
        instance.save()
        return instance

#Customized JWT token to include more user info
class CustomUserObtainPairSerializer(TokenObtainPairSerializer):
    
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        token['first_name'] = user.first_name
        token['last_name'] = user.last_name
        token['email'] = user.email
        return token


class PlatformUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = PlatformUser
        fields = ('id','user_name','email','first_name','last_name')

class PlatformGroupSerializer(serializers.ModelSerializer):
    members = PlatformUserSerializer(source='group_members',many=True, read_only=True) #Nesting members of a group inside group objects

    class Meta:
        model = PlatformGroup
        fields = ('id','name','members','group_members',)
    
    #Custom create to add the user in the the group by default
    def create(self,validated_data):
        user = self.context['request'].user
        members = validated_data.pop('group_members')
        group = PlatformGroup.objects.create(**validated_data)
        group.group_members.set(members)
        group.group_members.add(user)
        return group
        
class PlatformInvitationSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = PlatformInvitation
        fields = '__all__'

    
        
    def create(self,validated_data):
        email = validated_data['email']
        group = validated_data['group']
        invitation, created = PlatformInvitation.objects.get_or_create(**validated_data)
    
        try :
            user = PlatformUser.objects.get(email__iexact=email)
            if not invitation.accepted:
                # in case of a user was added without invitation
                invitation.accepted=True
            if group not in user.groups.all() :
                # add user to group and send the invitation email
                invitation.accepted=True
                user.groups.add(group)
                user.save()
                invitation.send_invitation()
            
            invitation.save()          
        except PlatformUser.DoesNotExist:
            # user doesn't exist yet
            # send invitation email
            invitation.send_invitation()
        
        return invitation