from .models.general_tools import GeneralTools
from .models.general_banners import GeneralBanners


class HomeServices:
    def get_general_tool_list():
        return GeneralTools.objects.filter(status=True).values('name', 'description', 'icon', 'slug').order_by('order')
    
    def get_banners_list():
        return GeneralBanners.objects.filter(status=True).values('image_url', 'description').order_by('order')