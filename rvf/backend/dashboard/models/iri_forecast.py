from django.db import models
from base.models import Base


class IRIForecast(Base):
    ward_code           = models.CharField(max_length = 255, blank = False)
    iri_data            = models.JSONField(null = True, blank = True)

    class Meta:
        db_table = 'iri_forecast'
        app_label = 'dashboard'
        
        indexes = [
            models.Index(fields=['ward_code'])
        ]
    