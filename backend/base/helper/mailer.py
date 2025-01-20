#Genric
from django.conf import settings
from django.core.mail import EmailMultiAlternatives

class Mailer:
    def send_mail(receiptients, subject, message, pdf_buffer=None, file_name = None):
        """Sendmail function is responsible for sending
        mail to multiple receiptients"""
        try:
            if receiptients:
                for mail in receiptients:
                    mail_send = EmailMultiAlternatives(
                        subject,
                        message,
                        settings.EMAIL_HOST_USER,
                        [mail],
                        connection=None,
                    )
                    if pdf_buffer:
                        mail_send.attach(file_name, pdf_buffer.getvalue(), 'application/pdf')
                
                    mail_send.attach_alternative(message, "text/html")
                    mail_send.send()
                return True
            
            return False
        except Exception:
            return False