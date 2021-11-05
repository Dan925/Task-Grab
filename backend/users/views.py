from rest_framework.response import Response
from rest_framework import status, generics
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.tokens import RefreshToken

from .serializers import RegisterUserSerializer, CustomUserObtainPairSerializer, PlatformGroupSerializer, PlatformUserSerializer,PlatformInvitationSerializer
from .models import PlatformGroup, PlatformUser,PlatformInvitation



class CustomUserCreate(APIView):
    permission_classes = [AllowAny]

    def post(self,request):
        print("request: ",request.data)
        user_serializer = RegisterUserSerializer(data=request.data)
        if user_serializer.is_valid():
            newUser = user_serializer.save()
            if newUser:
                try:
                    invitations = PlatformInvitation.objects.filter(email__iexact=newUser.email)
                    for invitation in invitations:
                        newUser.groups.add(invitation.group)
                        invitation.accepted = True
                        invitation.save()
                    newUser.save()
                except:
                    return Response(status=status.HTTP_201_CREATED)
                return Response(status=status.HTTP_201_CREATED)
        return Response(user_serializer.errors,status=status.HTTP_400_BAD_REQUEST)



class CustomUserObtainPairView(TokenObtainPairView):
    permission_classes = [AllowAny]
    serializer_class = CustomUserObtainPairSerializer

class BlackListTokenView(APIView):
    permission_classes = [AllowAny]

    def post(self,request):
        try:
            refresh_token = request.data["refresh"]
            token = RefreshToken(refresh_token)
            token.blacklist()
            return Response(status=status.HTTP_200_OK)
        except Exception as e:
            return Response(status=status.HTTP_400_BAD_REQUEST)

class GroupList(generics.ListCreateAPIView):
    serializer_class = PlatformGroupSerializer

    def get_queryset(self):
        user = self.request.user
        return PlatformGroup.objects.for_user(user)
class GroupDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = PlatformGroup.objects.all()
    serializer_class = PlatformGroupSerializer

class UserList(generics.ListAPIView):
    serializer_class = PlatformUserSerializer

    def get_queryset(self):
        user = self.request.user
        return PlatformUser.objects.filter(is_active=True,).exclude(id=user.id)
    
class InvitationList(generics.ListCreateAPIView):
    queryset = PlatformInvitation.objects.all()
    serializer_class = PlatformInvitationSerializer

class InvitationDestroy(generics.DestroyAPIView):
    queryset = PlatformInvitation.objects.all()
    serializer_class = PlatformInvitationSerializer