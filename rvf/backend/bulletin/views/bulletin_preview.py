#Genric
from rest_framework import generics,status
from rest_framework.response import Response

# Response and Messages
from util.global_response import success_response,error_response
from util import messages

#Serializer
from bulletin.serializers import BulletinSerializer

#Services
from bulletin.services import BulletinService

#Model
from bulletin.models.bulletin import Bulletin


class BulletinPreview(generics.GenericAPIView ):
    serializer_class = BulletinSerializer
    
    def get(self, request, id):
        try:
            if Bulletin.objects.filter(id = id).exists(): #checking id..
                if result := BulletinService.bulletin_preview(self, id):
                    success_response.update(result = {'pdf_url':result}, code = status.HTTP_200_OK)
                    return Response(success_response, status = status.HTTP_200_OK)
                else:
                    error_response.update(code = status.HTTP_400_BAD_REQUEST, message = messages.ERROR['SERVER_ERROR'], errors = "")
                    return Response(error_response,status = status.HTTP_400_BAD_REQUEST)
            else:
                error_response.update(code = status.HTTP_400_BAD_REQUEST, message = messages.ERROR['ID_NOT_EXIST'], errors = "")
                return Response(error_response, status = status.HTTP_400_BAD_REQUEST)

        except Exception as error:
            error_response.update(code=status.HTTP_400_BAD_REQUEST, message=str(error))
            return Response(error_response, status=status.HTTP_400_BAD_REQUEST)