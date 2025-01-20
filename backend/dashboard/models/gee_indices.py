from django.db import models
from base.models import Base

class GeeIndices(Base):
    name            = models.CharField(max_length = 255, blank = False)
    dataset         = models.CharField(max_length = 255, blank = False)
    status          = models.BooleanField(default = True)
    slug            = models.CharField(max_length = 500, blank = True, default = '')
    min_date        = models.CharField(max_length = 500, blank = True, default = '')
    max_date        = models.CharField(max_length = 500, blank = True, default = '')

    class Meta:
        db_table = 'gee_indices'
        app_label = 'dashboard'
    