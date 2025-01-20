#Genric
from rest_framework import generics,status
from rest_framework.response import Response

# Response and Messages
from util.global_response import success_response,error_response

#swagger
from drf_yasg import openapi
from drf_yasg.utils import swagger_auto_schema

#Serializer
from bulletin.serializers import BulletinSerializer

#Services
from bulletin.services import BulletinService

#Pagination
from base.helper.pagination import PaginationHandlerMixin
from rest_framework.pagination import PageNumberPagination

#Constants
from base import constants

class MyPageNumberPagination(PageNumberPagination):  
    page_size = constants.BULLETIN_PAGE_LIST_SIZE
    page_size_query_param = 'limit'


class BulletinList(generics.GenericAPIView , PaginationHandlerMixin):
    serializer_class = BulletinSerializer 
    pagination_class = MyPageNumberPagination
    
    #Request Parameters
    country_name = openapi.Parameter('country_name', in_=openapi.IN_QUERY, type=openapi.TYPE_STRING, required = False)
    county_name  = openapi.Parameter('county_name', in_=openapi.IN_QUERY, type=openapi.TYPE_STRING, required=False)
    sub_county_name = openapi.Parameter('sub_county_name', in_=openapi.IN_QUERY, type=openapi.TYPE_STRING, required=False)
    start_date = openapi.Parameter('start_date', in_=openapi.IN_QUERY, type=openapi.FORMAT_DATE, required = False)
    end_date = openapi.Parameter('end_date', in_=openapi.IN_QUERY, type=openapi.FORMAT_DATE, required = False)
    
    @swagger_auto_schema(manual_parameters=[country_name,county_name,sub_county_name,start_date,end_date])
    def get(self, request):
        try:
            if result := BulletinService.bulletin_list(self, request):
                for res in result: #adding bulletin content base s3 url to image
                    if res['pdf_file']:
                        res['pdf_file'] = constants.AWS_S3_BASE_URL+'/'+constants.BULLETIN_FILE_PATH + '/'+res['pdf_file']
                    
                    if res['image_file']:
                        res['image_file'] = constants.AWS_S3_BASE_URL+'/'+constants.BULLETIN_FILE_PATH + '/'+res['image_file']
                
                #pagination
                page = self.paginate_queryset(result)  
                serializer = self.get_paginated_response(BulletinSerializer(page,many=True).data)

                success_response.update(result=serializer.data, code=status.HTTP_200_OK)
            else:
                success_response.update(result=[],code=status.HTTP_200_OK)
            return Response(success_response, status=status.HTTP_200_OK)
        except Exception as error:
            error_response.update(code = status.HTTP_400_BAD_REQUEST, message = str(error))
            return Response(error_response, status = status.HTTP_400_BAD_REQUEST)
