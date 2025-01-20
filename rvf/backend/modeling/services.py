
# GEE
import ee

# constants
from base import constants

# Base services
from base.services import GEEServices

from datetime import date, datetime

import pandas as pd

class ForecastMap:
    def forecasted_map(self, request, roi):
        
        # Converting string date to date object        
        dt = datetime.strptime(str(request.data['start_date']), constants.DATE_FORMAT).date()
        
        file_name = f"{constants.GCP_KENYA_RASTER_IMG}_{dt.year}-{dt.month}.tif"
        
        image = ee.Image.loadGeoTIFF(file_name)
        
        min_val, max_val = GEEServices.get_dynamic_min_max_values(self, image, roi, constants.MODELING_MAP_MIN, constants.MODELING_MAP_MAX, 1000)
        
        vis_params = {
            "min": min_val, 
            "max": max_val, 
            "palette": constants.MODELING_MAP_PALETTE,
        }
        
        # Get the map ID 
        map_id = image.clip(roi).getMapId(vis_params)

        map_data = GEEServices.get_map_url(self, map_id, vis_params)
        map_data["palette"] = constants.MODELING_MAP_PALETTE_WITH_NAME

        return {"map_data": map_data}
