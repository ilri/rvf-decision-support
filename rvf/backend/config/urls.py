"""
URL configuration for config project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from django.contrib.staticfiles.urls import staticfiles_urlpatterns

from drf_yasg import openapi
from drf_yasg.views import get_schema_view
from drf_yasg.generators import OpenAPISchemaGenerator
from rest_framework import permissions

#For Google Earth Engine initialization Start
from base.helper.gee_credentials import GEEAuth
#For Google Earth Engine initialization End

#SWAGGER SCHEMA VIEW
class BothHttpAndHttpsSchemaGenerator(OpenAPISchemaGenerator): #HTTP and HTTPS Schemas
    """ HTTP, HTTPS Schema generator """

    def get_schema(self, request=None, public=False):
        schema = super().get_schema(request, public)

        # Show schemes based on request url scheme
        try:
            if request.scheme == 'http':
                schema.schemes = ["http", "https"]
            else:
                schema.schemes = ["https", "http"]
        except ValueError:
            schema.schemes = ["http", "https"]

        return schema

SchemaView = get_schema_view(
    openapi.Info(
        title="RVF",
        default_version="v1",
        description="",
        terms_of_service="https://www.google.com/policies/terms/",
        contact=openapi.Contact(url="https://innomicktechnologies.com/"),
        license=openapi.License(name="BSD License"),
    ),
    public=True,
    generator_class=BothHttpAndHttpsSchemaGenerator, # Here its for HTTP and HTTPS Schemas
    permission_classes=(permissions.AllowAny,),
)

urlpatterns = [
    #Swagger URLs
    path("", SchemaView.with_ui("swagger", cache_timeout=0),
         name="schema-swagger-ui"),

    path("redoc", SchemaView.with_ui(
        "redoc", cache_timeout=0), name="schema-redoc"),

    # Admin
    path('admin/', admin.site.urls),

    #Home URL
    path("home/", include("home.urls")),

    #Location URL
    path("location/", include("location.urls")),

    #Dashboard URL
    path("dashboard/", include("dashboard.urls")),

    #Decision Support URL
    path("decision_support/", include("dss.urls")),

    # Rainfall URL
    path("rainfall/", include("rainfall.urls")),

    # Bulletin URL
    path("bulletin/", include("bulletin.urls")),

    # Mail Hub URL
    path("mail_hub/", include("mail_hub.urls")),

    # Modelling
    path("modeling/", include("modeling.urls")),

    # Lambda function URL
    path("lambda_function/", include("lambda_functions.urls"))
]


#For Geojson Files
urlpatterns += staticfiles_urlpatterns()

#For Google Earth Engine initialization Start
GEEAuth.authentication_gee_initialization()
#For Google Earth Engine initialization End
