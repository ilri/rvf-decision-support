from django.utils.translation import activate, get_language

class LanguageMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        if language := request.META.get('HTTP_ACCEPT_LANGUAGE', None):
            activate(language)
        return self.get_response(request)