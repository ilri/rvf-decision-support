from django.contrib import admin
from .models.country import Country
from .models.county import County
from .models.sub_county import SubCounty
from .models.ward import Ward

# Register your models here.

admin.site.register(Country)
admin.site.register(County)
admin.site.register(SubCounty)
admin.site.register(Ward)
