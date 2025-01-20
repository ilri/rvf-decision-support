#django model
from django.db import models
from django.contrib.postgres.fields import ArrayField

#from base model
from base.models.base_model import Base
# from django.contrib.postgres.fields import ListField



class BlockData(Base):
    block_id            =   models.IntegerField(unique = True)
    clay_mean           =   models.FloatField(blank=True, null=True)
    clay_sum            =   models.FloatField(blank=True, null=True)
    altitide_m          =   models.FloatField(blank=True, null=True)
    majority            =   models.FloatField(blank=True, null=True)
    geometry            =   ArrayField(models.TextField(), blank=True, null=True)
    precipitation       =   models.FloatField()
    temperature         =   models.FloatField()
    predicted           =   models.FloatField()
    date                =   models.DateField(blank=True, null=True)
    status              =   models.BooleanField(default = True)

    class Meta:
        db_table = 'block_data'
        app_label = 'modeling'
        
        indexes = [
            models.Index(fields=['block_id'])
        ]