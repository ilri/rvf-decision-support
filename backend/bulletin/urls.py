#Genric
from django.urls import path

# All Views
from bulletin.views.bulletin_add import BulletinAdd
from bulletin.views.bulletin_list import BulletinList

from bulletin.views.bulletin_preview import BulletinPreview

from bulletin.views.send_bulletin import SendBulletin



urlpatterns = [
    #add bulletin
    path("add", BulletinAdd.as_view()),

    #bulletin list
    path("getAllByCriteria", BulletinList.as_view()),
    
    #Bulletin Preview
    path("preview/<str:id>", BulletinPreview.as_view()),
    
    # Send Bulletin
    path("send_bulletin", SendBulletin.as_view()),
    
]