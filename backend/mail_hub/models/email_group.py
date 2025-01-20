#django model
from django.db import models
from django.contrib.postgres.fields import ArrayField

#from base model
from base.models.base_model import Base


class EmailGroup(Base):
    group_name            =   models.CharField(max_length = 500)
    email                 =   ArrayField(models.TextField(), blank=True, null=True)
    status                =   models.BooleanField(default = True)

    class Meta:
        db_table = 'email_group'
        app_label = 'mail_hub'