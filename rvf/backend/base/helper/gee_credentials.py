from decouple import config
import ee
import os

from google.auth.transport.requests import AuthorizedSession
from google.oauth2 import service_account

#For Constants
from base import constants
from django.conf import settings

class GEEAuth:
    def authentication_gee_initialization():
        SERVICE_ACCOUNT = "google-earth-engine-e88c2dbec6@idmt-321615.iam.gserviceaccount.com"
        KEY = os.path.join(settings.BASE_DIR, config('GEE_PRIVATE_KEY_PATH'))
        
        credentials = service_account.Credentials.from_service_account_file(KEY)
        scoped_credentials = credentials.with_scopes(
            ['https://www.googleapis.com/auth/cloud-platform'])
        session = AuthorizedSession(scoped_credentials)
        ee_creds = ee.ServiceAccountCredentials(SERVICE_ACCOUNT, KEY)
        if ee_creds:
            ee.Initialize(ee_creds)
            return True
        return False