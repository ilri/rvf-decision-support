#Genric
from rest_framework import generics,status
from rest_framework.response import Response

# Response and Messages
from util.global_response import success_response, error_response
from util import messages

#Serilalizer
from bulletin.serializers import AddBulletinSerializer

#Services
from bulletin.services import BulletinService

class BulletinAdd(generics.GenericAPIView):
    serializer_class = AddBulletinSerializer

    def post(self, request):
        try:
            serializer = self.serializer_class(data = request.data)

            if serializer.is_valid():
                #returning bulletin preview URL
                if  BulletinService.add_bulletin(self, request):

                    success_response.update(result = messages.SUCCESS['ADD_BULLETIN'], code = status.HTTP_200_OK) # 
                    return Response(success_response, status = status.HTTP_200_OK)
                else:
                    error_response.update(code = status.HTTP_400_BAD_REQUEST, message = messages.ERROR['SERVER_ERROR'])
                    return Response(error_response, status = status.HTTP_400_BAD_REQUEST)
            else:
                #Only One Error shoule be shown at a time.
                error, *_ = serializer.errors.values()

                error_response.update(code = status.HTTP_400_BAD_REQUEST, message = error, errors = serializer.errors)
                return Response(error_response, status = status.HTTP_400_BAD_REQUEST)

        except Exception as error:
            return Response({"exception":str(error)}, status = status.HTTP_400_BAD_REQUEST)     