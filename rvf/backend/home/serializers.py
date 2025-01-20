from rest_framework import serializers

from .models.general_tools import GeneralTools
from .models.general_banners import GeneralBanners

class GeneralToolsSerializer(serializers.ModelSerializer):

    class Meta:
        model = GeneralTools
        fields = '__all__'

class GeneralBannersSerializer(serializers.ModelSerializer):

    class Meta:
        model = GeneralBanners
        fields = '__all__'