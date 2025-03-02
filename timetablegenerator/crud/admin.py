from django.contrib import admin

# Register your models here.

from .models import Timetable_Semester_Three,Timetable_Semester_Four,Timetable_Semester_Five,Timetable_Semester_Six,Timetable_Semester_Seven,Timetable_Semester_Eight

@admin.register(Timetable_Semester_Three)
class TimetableAdmin(admin.ModelAdmin):
    list_display = ('day', 'time_slot', 'subject')
    list_filter = ('day',)



@admin.register(Timetable_Semester_Four)
class TimetableAdmin(admin.ModelAdmin):
    list_display = ('day', 'time_slot', 'subject')
    list_filter = ('day',)

@admin.register(Timetable_Semester_Five)
class TimetableAdmin(admin.ModelAdmin):
    list_display = ('day', 'time_slot', 'subject')
    list_filter = ('day',)

@admin.register(Timetable_Semester_Six)
class TimetableAdmin(admin.ModelAdmin):
    list_display = ('day', 'time_slot', 'subject')
    list_filter = ('day',)

@admin.register(Timetable_Semester_Seven)
class TimetableAdmin(admin.ModelAdmin):
    list_display = ('day', 'time_slot', 'subject')
    list_filter = ('day',)

@admin.register(Timetable_Semester_Eight)
class TimetableAdmin(admin.ModelAdmin):
    list_display = ('day', 'time_slot', 'subject')
    list_filter = ('day',)

