
#All Models
from .models import (
    country,
    county,
    sub_county,
    ward
)

class LocationService:
    def get_location_by_type(self, location_type, parent_id):
        if country.Country == location_type:
            query_set = location_type.objects.filter(status=True).order_by('name').values()
            return query_set
        
        elif county.County == location_type:
            if parent_id:
                query_set = location_type.objects.filter(country_id=parent_id, status=True).order_by('name').values()
                return query_set
            
            query_set = location_type.objects.filter(status=True).order_by('name').values()
            return query_set
        
        elif sub_county.SubCounty == location_type:
            if parent_id:
                query_set = location_type.objects.filter(county_id=parent_id, status=True).order_by('name').values()
                return LocationService.add_display_name(self, query_set)
            
            query_set = location_type.objects.filter(status=True).order_by('name').values()
            return LocationService.add_display_name(self, query_set)
        
        elif ward.Ward == location_type:
            if parent_id:
                query_set = location_type.objects.filter(sub_county_id=parent_id, status=True).order_by('name').values()
                return LocationService.add_display_name(self, query_set)
            
            query_set = location_type.objects.filter(status=True).order_by('name').values()
            return LocationService.add_display_name(self, query_set)

    def add_display_name(self, query_set):
        for name in query_set:
            name['name'] = name['name'].title()
        return query_set   