from mail_hub.models.email_group import EmailGroup

class MailHub:
    def create_email_group(self, request):
        ''' Creating email group along with the emails '''
        
        create_email_group = EmailGroup.objects.create(group_name = request.data['email_group_name'], email = request.data['email'])
        return bool(create_email_group)
    
    
    def update_email_group(self, request):
        ''' Creating email group along with the emails '''
        
        update_email_group = EmailGroup.objects.filter(id = request.data['email_group_id']).update(email = request.data.get('email'))
        return bool(update_email_group)
    
    def email_group_list(self, request):
        ''' Creating email group along with the emails '''
        
        return EmailGroup.objects.filter(status = True).values('id','group_name', 'email').order_by('-updated_date')
    
    
        