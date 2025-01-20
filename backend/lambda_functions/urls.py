from django.urls import path

# Views
from lambda_functions.views.indices_end_date import GeeIndices
from lambda_functions.views.upload_iri_data import UploadIRIData

from lambda_functions.views.store_adm1_gpm_iri import StoreGPMIRIADM1

from lambda_functions.views.upload_raster_file_to_gcp import UploadRasterFileToGCP

urlpatterns = [

    # Update Gee indices end date
    path("get_indices_end_date", GeeIndices.as_view()),
    
    # Upload IRI data
    path("upload_iri_data", UploadIRIData.as_view()),
    
    # Upload IRI data
    path("store_gpm_iri_data", StoreGPMIRIADM1.as_view()),
    
    # Upload raster file to GCP
    path("upload_raster_file_to_gcp", UploadRasterFileToGCP.as_view()),


]