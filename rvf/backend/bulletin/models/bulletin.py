#django model
from django.db import models

#from base model
from base.models.base_model import Base


class Bulletin(Base):
    country_name            =   models.CharField(max_length = 500)
    county_name             =   models.CharField(max_length = 500, blank = True, null = True)
    sub_county_name         =   models.CharField(max_length = 500, blank = True, null = True)
    pdf_file                =   models.CharField(max_length = 500, blank = True)
    image_file              =   models.CharField(max_length = 500, blank = True)
    pdf_base_64             =   models.TextField(blank = True, null = True)
    publish_date            =   models.DateTimeField(auto_now = True, null = True)
    status                  =   models.BooleanField(default = True)

    class Meta:
        db_table = 'bulletin'
        app_label = 'bulletin'