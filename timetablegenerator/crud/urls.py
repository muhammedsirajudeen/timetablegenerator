from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import TeacherViewSet,SubjectViewSet,TeacherSubjectViewSet,PopulateTimetableView
from django.urls import path
from .management.commands.generate_timetable import SEMESTER_DIVISIONS
from django.http import JsonResponse
from .views import (
    RemoveTeacherAndSubjectView,
    RemoveTeacherView,
    AddTeacherAndSubjectView,
    RemoveAllTeacherSubjectView,
    AddTeacherToTimetableView,  # Import the new view
    AddSubjectToTimetableView,  # Add Subject to Timetable
    RemoveSubjectFromTimetableView  ,
    GetTimetableBySemesterView
)
router = DefaultRouter()
router.register(r'teachers', TeacherViewSet)

router.register(r'subjects', SubjectViewSet)
urlpatterns = [
    path('teachers/assign/', TeacherSubjectViewSet , name='teacher-assign'),
    path('', include(router.urls)),
    path('populate-timetable/', PopulateTimetableView.as_view(), name='populate-timetable'),
    path('remove_teacher_and_subject/', RemoveTeacherAndSubjectView.as_view(), name='remove_teacher_and_subject'),

    # Endpoint to remove only the teacher from a specific time slot
    path('remove_teacher/', RemoveTeacherView.as_view(), name='remove_teacher'),

    # Endpoint to add a teacher and subject to a specific time slot
    path('add_teacher_and_subject/', AddTeacherAndSubjectView.as_view(), name='add_teacher_and_subject'),

    # Endpoint to remove all teacher-subject assignments from all timetables
    path('remove_all_teacher_subject/', RemoveAllTeacherSubjectView.as_view(), name='remove_all_teacher_subject'),
    path('add_teacher_to_timetable/', AddTeacherToTimetableView.as_view(), name='add_teacher_to_timetable'),
    path('add_subject_to_timetable/', AddSubjectToTimetableView.as_view(), name='add_subject_to_timetable'),

    # New endpoint to remove a subject from a specific timetable slot
    path('remove_subject_from_timetable/', RemoveSubjectFromTimetableView.as_view(), name='remove_subject_from_timetable'),
    path('get_timetable_by_semester/', GetTimetableBySemesterView.as_view(), name='get_timetable_by_semester'),
    path('get_structure/', lambda request: JsonResponse(SEMESTER_DIVISIONS, safe=False)),

]