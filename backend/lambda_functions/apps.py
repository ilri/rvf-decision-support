from django.apps import AppConfig


class LambdaFunctionsConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'lambda_functions'

    def ready(self):
        from lambda_functions.scheduler import LambdaScheduler
        LambdaScheduler.start(self)