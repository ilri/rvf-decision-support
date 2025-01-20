#Genric
import boto3
from botocore.config import Config

#Constants
from base import constants

class FileHandler:
    """file handler class is responsible to
     contains all file base functions"""

    def upload_files(self, file, file_name, folder_name, content_type = None):
        """uplaod files function is responsible for
        upload files to s3 bucket"""
        try:
            if file:
                s3_bucket = boto3.resource(
                    "s3",
                    aws_access_key_id = constants.ACCESS_KEY_ID,
                    aws_secret_access_key = constants.SECRET_ACCESS_KEY,
                    config = Config(region_name = constants.S3_REGION_NAME),
                )
                bucket = s3_bucket.Bucket(constants.BUCKET_NAME)
                if content_type:
                    bucket.put_object(Key=f"{folder_name}/{file_name}", Body=file, ContentType= content_type)#, ACL='public-read')
                
                else:
                    bucket.put_object(Key=f"{folder_name}/{file_name}", Body=file, ACL='public-read')
                    
                return True
            else:
                return False

        except Exception:
            return False

    #delete file from S3
    def delete_file(self,file_path):     
        """Delete file from S3 Bucket using file path. """
        try:     
            s3 = boto3.resource(
                    "s3",
                    aws_access_key_id = constants.ACCESS_KEY_ID,
                    aws_secret_access_key = constants.SECRET_ACCESS_KEY,
                    config = Config(region_name = constants.S3_REGION_NAME),
                )
            obj = s3.Object(constants.BUCKET_NAME, file_path)
            obj.delete()
            return True
            
        except Exception:
            return False
        
    
    #uplaod local files to s3 bucket
    def upload_local_files_to_s3(self, input_file_path, file_name, folder_name):
        try:
            if input_file_path:
                s3_bucket = boto3.resource(
                    "s3",
                    aws_access_key_id=constants.ACCESS_KEY_ID,
                    aws_secret_access_key=constants.SECRET_ACCESS_KEY,
                    config = Config(region_name = constants.S3_REGION_NAME)
                )
                bucket = s3_bucket.Bucket(constants.BUCKET_NAME)
                if folder_name == 'uat/bulletin/bulletin_pdf':
                    bucket.upload_file(input_file_path, f"{folder_name}/{file_name}", ExtraArgs={'ContentType':'application/pdf', 'ACL':'public-read'})
                else:
                    bucket.upload_file(input_file_path, f"{folder_name}/{file_name}", ExtraArgs={'ACL':'public-read'})
    
                return True
            return False

        except Exception:
            return False

    
    def check_file_exist_in_s3(self, file_path):
        """Check if a file exists in the specified directory_path 
        and return True if it exists otherwise return False."""
        try:
            s3_bucket = boto3.resource(
                        "s3",
                        aws_access_key_id=constants.ACCESS_KEY_ID,
                        aws_secret_access_key=constants.SECRET_ACCESS_KEY,
                        config = Config(region_name = constants.S3_REGION_NAME)
                    )
            bucket = s3_bucket.Bucket(constants.BUCKET_NAME)
            obj = list(bucket.objects.filter(Prefix=file_path))
            return len(obj) > 0
        
        except Exception:
            return False
        
    