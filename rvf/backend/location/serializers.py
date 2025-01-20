from rest_framework import serializers

# Models
from .models.country import Country

LOCATION_CHOICES = (
    ("Country", "Country"),
    ("County", "County"),
    ("SubCounty", "SubCounty"),
    ("Ward", "Ward")
)


class LocationSerializer(serializers.Serializer):
    location_type = serializers.ChoiceField(choices=LOCATION_CHOICES)
    parent_id = serializers.CharField(allow_blank=True, required=False)

class CountrySerializer(serializers.ModelSerializer):

    class Meta:
        model = Country
        fields = '__all__'