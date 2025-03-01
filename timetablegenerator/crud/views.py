from django.shortcuts import render
from rest_framework import generics
from .models import Teachers
from .serializers import TeachersSerializer
from rest_framework import viewsets
from rest_framework.permissions import IsAdminUser
# Create your views here.


class TeacherViewSet(viewsets.ModelViewSet):
    queryset = Teachers.objects.all()
    serializer_class = TeachersSerializer
    permission_classes=[IsAdminUser]