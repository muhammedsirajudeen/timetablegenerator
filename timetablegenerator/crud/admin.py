from django.contrib import admin

# Register your models here.

from .models import Timetable,Teachers,Subjects,Teacher_Subject
@admin.register(Timetable)
class TimetableAdmin(admin.ModelAdmin):
    list_display = ('day', 'time_slot', 'subject','semester','teacher')
    list_filter = ('day',)


@admin.register(Teachers)
class TeachersRegistration(admin.ModelAdmin):
   pass

@admin.register(Subjects)
class SubjectRegistration(admin.ModelAdmin):
    pass

@admin.register(Teacher_Subject)
class TeacherSubjectRegistration(admin.ModelAdmin):
    pass
