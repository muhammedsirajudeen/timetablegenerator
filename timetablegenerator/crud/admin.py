from django.contrib import admin

# Register your models here.

from .models import Timetable
@admin.register(Timetable)
class TimetableAdmin(admin.ModelAdmin):
    list_display = ('day', 'time_slot', 'subject','semester')
    list_filter = ('day',)

