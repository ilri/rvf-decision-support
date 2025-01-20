# Time
import time
from datetime import datetime, timedelta

# Base
from base.services import BaseServices
from base.helper.file_handler import FileHandler

# Models
from bulletin.models.bulletin import Bulletin
from django.db.models import Q
from django.db.models.functions import TruncDate
from mail_hub.models.email_group import EmailGroup

from mail_hub.services import MailHub


# Constants
from base import constants

# Messages
from util import messages


#Bulletin Serices
class BulletinService:
    
    def create_file_name(self, request):
        ''' Creating file name based on request'''
        
        if request.data.get('sub_county_name'):
            file_name = f"{request.data['country_name']}_{request.data['county_name']}_{request.data['sub_county_name']}_{str(int(time.time()))}"
        elif request.data.get('sub_county_name'):
            file_name = f"{request.data['country_name']}_{request.data['county_name']}_{str(int(time.time()))}"
        else:
            file_name = f"{request.data['country_name']}_{str(int(time.time()))}"
        
        return file_name
    
    #Add bulletin
    def add_bulletin(self, request):
        '''
        1. creating file name
        2. converting base64 to file
        3. uploading files to s3
        4. insrting data to database
        '''
        try:
            file_name = BulletinService.create_file_name(self, request)
            
            image = BaseServices.convert_base64_to_img(self, request.data['image_base64'], 'png')
            pdf = BaseServices.convert_base64_to_pdf_or_doc(self, request.data['pdf_base64'])
            
            if image and pdf:
                img_file_name = f"{file_name}.png"
                uploading_img_to_s3 = FileHandler.upload_files(self, image, img_file_name, constants.BULLETIN_FILE_PATH)
                
                pdf_file_name = f"{file_name}.pdf"
                uploading_pdf_to_s3 = FileHandler.upload_files(self, pdf, pdf_file_name, constants.BULLETIN_FILE_PATH)#, content_type= "application/pdf")
                    
            if uploading_img_to_s3 and uploading_pdf_to_s3:
                create_bulletin = Bulletin.objects.create(
                    country_name        = request.data['country_name'],
                    county_name         = request.data.get('county_name'),
                    sub_county_name     = request.data.get('sub_county_name'),
                    pdf_file            = pdf_file_name,
                    image_file          = img_file_name,
                    pdf_base_64         = request.data.get('pdf_base64')
                )
                return bool(create_bulletin)
        except:
            return False
            
   
    #Bulletin list
    def bulletin_list(self, request):
        ''' Fetching bulletin data based on the requirements'''
        
        try:
            # Queryset
            query_set = Bulletin.objects
            condition = Q()
            
            # Country
            if request.GET.get('country_name'):
                condition &= Q(country_name=request.GET.get('country_name'))

            # County
            if request.GET.get('county_name'):
                condition &= Q(county_name = request.GET.get('county_name'))

            # Sub County
            if request.GET.get('sub_county_name'):
                condition &= Q(sub_county_name=request.GET.get('sub_county_name'))
                
            # Start year and End year
            if request.GET.get('start_date') and request.GET.get('end_date'):
                end_date = datetime.strptime(request.GET.get('end_date'), '%Y-%m-%d') + timedelta(days=1)
                condition &= Q(publish_date__gte=request.GET.get('start_date'), publish_date__lte=end_date)
            
            condition &= Q(status = True)
            
            # Queryset            
            data = query_set.filter(condition).annotate(published_date=TruncDate('publish_date')).values('id', 'country_name','county_name','sub_county_name','published_date', 'image_file', 'pdf_file', 'pdf_base_64').order_by('-updated_date')
            
            return data
        except:
            return False
    
    #Bulletin Preview as PDF
    def bulletin_preview(self, id):
        ''' Fetching pdf url '''
        
        prev_pdf = Bulletin.objects.filter(id = id, status = True).values('pdf_file')
        if prev_pdf:
            return constants.AWS_S3_BASE_URL+'/'+constants.BULLETIN_FILE_PATH+'/'+prev_pdf[0]['pdf_file']
        return False
    
    
    
    def send_bulletin(self, request):
        '''
        1. creating file name
        2. converting base64 to file
        3. creating email group
        3. sending file to email
        '''
        
        try:
            # Creating email group 
            if not request.data.get('email_group_id') and request.data.get('email_group_name') and request.data.get('email') and MailHub.create_email_group(self, request):
                email_id = request.data.get('email')
            
            # Fetching emails based on email_group_name
            if request.data.get('email_group_name') and not request.data.get('email'):
                emails = EmailGroup.objects.filter(group_name = request.data.get('email_group_name')).values('email')
                email_id = emails[0]['email']
            
            # Only for emails without email group
            if not request.data.get('email_group_name') and request.data.get('email'):
                email_id = request.data.get('email')
            
            # Updating emails based on id
            if  request.data.get('email_group_id') and request.data.get('email') and MailHub.update_email_group(self, request):
                email_id = request.data.get('email')
            
            if email_id:
                # Creating new file name        
                file_name = BulletinService.create_file_name(self, request)
                
                template_data = {'logo':constants.EMAIL_LOGO}
                
                # Converting base_64 to files
                pdf = BaseServices.convert_base64_to_pdf_or_doc(self, request.data['pdf_base64'])
                
                # Email templates
                subject = messages.EMAIL_SUBJECT['BULLETIN_REPORT']
                
                # Email sending
                BaseServices.send_email_with_template(self, subject, 'bulletin_report', template_data, email_id, pdf, file_name+'-bulletin_report.pdf')
            
                return True
            return False
        except:
            return False
        
    
    
    