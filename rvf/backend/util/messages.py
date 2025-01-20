from django.utils.translation import gettext_lazy as _

#SUCCESS MESSAGES
SUCCESS = {
    
    "UPDATED"                           :   "Updated successfully.",
    
    # Bulletin
    "ADD_BULLETIN"                      :   "Bulletin has been created successfully.",
    "SEND_REPORT"                       :   "Report has been sent successfully.",
    
    # Modeling
    
    "UPLOAD_RASTER"                     :   "The raster file has been successfully uploaded to GCP.",
    
    
}


#ERROR MESSAGES
ERROR = {
    # Generic
    "FORM_ERROR"                            :   "There are some errors in your form. Please check and try again.",
    "EMPTY_MAP_DATA"                        :   "Map data is not available for selected date range or location.",
    "EMPTY_TIMESERIES_DATA"                 :   "Graph data is not available for selected date range or location.",
    "FIELD_REQUIRED"                        :   " is required.",
    "EMPTY_DATA"                            :   "Dataset is not available for selected date range or location.",
    "START_DATE_GREATER_THAN_API_DATE"      :   "Start Date should be greater than or equal to ",
    "DATA_NOT_AVAIL"                        :   "Data is not available for your selected criteria.",
    "NOT_EXIST"                             :   "not exist.",
    "ALREADY_EXIST"                         :   "is already exist.",
    "SERVER_ERROR"                          :   "There is some error on the server side. Please try after some time.",
    
    ################ API Security ######################
    "API_SECURITY_DONT_HAVE_PERMISSION"     :   _("It looks like you are trying to use our services from another platform and do not have permission. Please contact the administrator."),
    
    ################ Dashboard ######################
    "CHOOSE_LOCATION_TIMESERIES"            : "Please choose either country name or county name or sub-county name.",
    "CHOOSE_COUNTRY"                        : "Country name does not exits.",
    "CHOOSE_COUNTY"                         : "Please choose a County.",
    "CHOOSE_SUB_COUNTY"                     : "Please choose a Sub county.",
    "TEMPORAL_AGGERGATION"                  : "Please choose either 'mean' or 'median' or 'min' or 'max' or 'sum'.",
    "SPATIAL_AGGERGATION"                   : "Please choose either 'mean' or 'min' or 'max' or 'sum'.",
    "END_DATE_NOT_GREATER_THAN_TODAY"       : "End Date should not be greater than today date.",
    "START_DATE_LESS_TO_END_DATE"           : "Start date should be less than End date.",
    "START_DATE_NOT_EQUAL_END_DATE"         : "Start date should not equal to End date.",
    "RVF_CASE_TYPE_ERROR"                   : "Invalid type. Please select from {}.",
    # Location
    "LOCATION_TYPE_MANDATORY"               : "Location type is mandatory.",

    ################################ NOAA Forecast Data Source ###########################
    "NOAA_START_DATE_ERROR"                 : "Start Date should be greater than ",
    "NOAA_DATE_DIFF_ERROR"                  : "GFS - NOAA: The time period difference should not be greater than 16 days.",
    "NOAA_END_DATE_ERROR"                   : "End Date should be less than or equal to ",
    "FORECAST_SOURCE_CHOOSE_LOCATION"       : "Please choose either country or state or district or any point or polygon.",
    
    ############################## INDICES #########################################
    "NO_ACCUMULATED_RAIN_ERR"            :  "No accumulated rainfall for your selected criteria.",
    
    ###################### Mail Hub ###################
    "EMAIL_GROUP_NAME"                   :   "Please give either email or group name."


}


#EMAIL SUBJECTS
EMAIL_SUBJECT = {
    # Bulletin
    'BULLETIN_REPORT'                              :    'Notification! Bulletin Report.',
    
}
    

#EMAIL BODY
EMAIL_BODY = {
   
}