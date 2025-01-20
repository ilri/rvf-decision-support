# Scheduler
from apscheduler.schedulers.background import BackgroundScheduler
from apscheduler.triggers.cron import CronTrigger

# Views
from lambda_functions.views.indices_end_date import GeeIndices
from lambda_functions.views.store_adm1_gpm_iri import StoreGPMIRIADM1
from lambda_functions.views.upload_iri_data import UploadIRIData
from lambda_functions.views.upload_raster_file_to_gcp import UploadRasterFileToGCP

from base import constants

class LambdaScheduler:
    def start(self):
        scheduler = BackgroundScheduler() 
        
        # Cron expresiions
        cron_trigger=   CronTrigger(
            second  =   constants.GEE_INDICES_CRON_EXPRESSION['second'],       # seconds
            minute  =   constants.GEE_INDICES_CRON_EXPRESSION['minute'],       # minutes
            hour    =   constants.GEE_INDICES_CRON_EXPRESSION['hour'],         # hours
            day     =   constants.GEE_INDICES_CRON_EXPRESSION['day'],           # days
            timezone=   constants.GEE_INDICES_CRON_EXPRESSION['timezone']       # timezone
        )
        
        gpm_iri_cron_trigger = CronTrigger(
            second  =   constants.GPM_IRI_CRON_EXPRESSION['second'],       # seconds
            minute  =   constants.GPM_IRI_CRON_EXPRESSION['minute'],       # minutes
            hour    =   constants.GPM_IRI_CRON_EXPRESSION['hour'],         # hours
            day     =   constants.GPM_IRI_CRON_EXPRESSION['day'],           # days
            timezone=   constants.GPM_IRI_CRON_EXPRESSION['timezone']       # timezone
        )
        
        upload_forecasted_Raster = CronTrigger(
            second  =   constants.FORECASTED_RASTER_CRON_EXPRESSION['second'],       # seconds
            minute  =   constants.FORECASTED_RASTER_CRON_EXPRESSION['minute'],       # minutes
            hour    =   constants.FORECASTED_RASTER_CRON_EXPRESSION['hour'],         # hours
            day     =   constants.FORECASTED_RASTER_CRON_EXPRESSION['day'],           # days
            timezone=   constants.FORECASTED_RASTER_CRON_EXPRESSION['timezone']       # timezone
        )
        
        # calling scheduler function 
        # Uploading forecasted raster files (Modeling)
        #scheduler.add_job(UploadRasterFileToGCP.upload_forecasted_raster_file, trigger=upload_forecasted_Raster , id='upload_forecasted_raster_file', replace_existing=True)
        
        # Gee datasets
        #scheduler.add_job(GeeIndices.update_end_date_scheduler, trigger=cron_trigger , id='dataset_end_date_updater', replace_existing=True)
        
        # Insering IRI data from API
        #scheduler.add_job(UploadIRIData.scheduler_upload_iri_data, trigger=gpm_iri_cron_trigger , id='iri_data_from_api', replace_existing=True)
        
        # Storing GPM IRI response to json files
        #scheduler.add_job(StoreGPMIRIADM1.scheduler_store_gpm_iri_data, trigger=gpm_iri_cron_trigger , id='store_gpm_iri_adm1', replace_existing=True)
        #scheduler.start()

    # Call the start() function to initiate the scheduler
    if __name__ == '__main__':
        start()