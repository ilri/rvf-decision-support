from django.urls import path

# Views
from dashboard.views.accumulated_rainfall_gpm_timeseries import AccumulatedRainfallTimeseries
from dashboard.views.accumulated_rainfall_gpm_map import AccumulatedRainfallMap

from dashboard.views.accumulated_rainfall_chirps_timeseries import AccumulatedRainfallChirpsTimeseries
from dashboard.views.accumulated_rainfall_chirps_map import AccumulatedRainfallChirpsMap

from dashboard.views.climate_accumulated_rainfall_chirps_map import ClimateAccumulatedRainfallChirpsMap
from dashboard.views.climate_accumulated_rainfall_chirps_timeseries import ClimateAccumulatedRainfallChirpsTimeseries

from dashboard.views.accumulated_rainfall_chirps_tiff import AccumulatedRainfallChirpsTiff
from dashboard.views.mean_accumulated_rainfall_chirps_timeseries import MeanAccumulatedRainfallChirpsTimeseries

from dashboard.views.climate_accumulated_rainfall_gpm_map import ClimateAccumulatedRainfallMap
from dashboard.views.climate_accumulated_rainfall_gpm_timeseries import ClimateAccumulatedRainfallTimeseries

from dashboard.views.temperature_timeseries import TemperatureTimeseries

from .views.rainfall_source import RainfallSource
from dashboard.views.get_rvf_cases import RVFCases

from dashboard.views.accumulated_rainfall_gpm_forecast_map import ForecastAccumulatedRainfallMap
from dashboard.views.accumulated_rainfall_chirps_forecast_map import ForecastAccumulatedRainfallCHIRPSMap

from dashboard.views.srtm_tiff import SRTMTiff

urlpatterns = [
    # RAINFALL (ACCUMULATED RAINFALL GPM)
    path("accumulated_rainfall/gpm/timeseries",AccumulatedRainfallTimeseries.as_view()),
    path("accumulated_rainfall/gpm/map",AccumulatedRainfallMap.as_view()),
    
    path("accumulated_rainfall/gpm/forecast/map",ForecastAccumulatedRainfallMap.as_view()), 
    path("accumulated_rainfall/chirps/forecast/map",ForecastAccumulatedRainfallCHIRPSMap.as_view()),

    # RAINFALL (ACCUMULATED RAINFALL CHIRPS)
    path("accumulated_rainfall/chirps/timeseries",AccumulatedRainfallChirpsTimeseries.as_view()),
    path("accumulated_rainfall/chirps/map",AccumulatedRainfallChirpsMap.as_view()),
    
    path("mean_accumulated_rainfall/chirps/timeseries",MeanAccumulatedRainfallChirpsTimeseries.as_view()),
    
    # path("accumulated_rainfall/chirps/tiff",AccumulatedRainfallChirpsTiff.as_view()),
    
    
    # CLIMATE RAINFALL (ACCUMULATED RAINFALL GPM)
    path("climate_accumulated_rainfall/gpm/timeseries",ClimateAccumulatedRainfallTimeseries.as_view()),
    path("climate_accumulated_rainfall/gpm/map",ClimateAccumulatedRainfallMap.as_view()),

    # CLIMATE RAINFALL (ACCUMULATED RAINFALL CHIRPS)
    path("climate_accumulated_rainfall/chirps/timeseries",ClimateAccumulatedRainfallChirpsTimeseries.as_view()),
    path("climate_accumulated_rainfall/chirps/map",ClimateAccumulatedRainfallChirpsMap.as_view()),
    
    # Temperature
    path("temperature/timeseries",TemperatureTimeseries.as_view()),
    
    # SRTM
    # path("srtm/tiff",SRTMTiff.as_view()),

    #Rainfall source url
    path("rainfall_sources",RainfallSource.as_view()),

    # RVF Cases
    path("get_rvf_cases", RVFCases.as_view())

]

