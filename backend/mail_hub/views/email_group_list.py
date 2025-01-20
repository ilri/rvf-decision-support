#Genric
from rest_framework import generics,status
from rest_framework.response import Response

# Response and Messages
from util.global_response import success_response,error_response

#Serializer
from mail_hub.serializers import CreateEmailGroupSerializer

#Services
from mail_hub.services import MailHub


class EmailGroupList(generics.GenericAPIView):
    serializer_class = CreateEmailGroupSerializer 
    
    def get(self, request):
        try:
            if result := MailHub.email_group_list(self, request):

                success_response.update(result=result, code=status.HTTP_200_OK)
            else:
                success_response.update(result=[],code=status.HTTP_200_OK)
            return Response(success_response, status=status.HTTP_200_OK)
        except Exception as error:
            error_response.update(code = status.HTTP_400_BAD_REQUEST, message = str(error))
            return Response(error_response, status = status.HTTP_400_BAD_REQUEST)
