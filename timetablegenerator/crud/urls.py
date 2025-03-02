from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import TeacherViewSet,SubjectViewSet,TeacherSubjectViewSet
from django.urls import path


router = DefaultRouter()
router.register(r'teachers', TeacherViewSet)

router.register(r'subjects', SubjectViewSet)
urlpatterns = [
    path('teachers/assign/', TeacherSubjectViewSet , name='teacher-assign'),
    path('', include(router.urls)),
]