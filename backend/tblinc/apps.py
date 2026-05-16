from django.apps import AppConfig

class TblincConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'tblinc'

    def ready(self):
        import tblinc.signals
