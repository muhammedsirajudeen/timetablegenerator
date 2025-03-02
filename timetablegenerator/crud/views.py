from django.shortcuts import render
from rest_framework import generics
from .models import Teachers,Subjects,Teacher_Subject
from .serializers import TeachersSerializer,SubjectSerializer,TeacherSubjectSerializer
from rest_framework import viewsets
from rest_framework.permissions import IsAdminUser
# Create your views here.
from django.http import JsonResponse
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.permissions import IsAdminUser
from datetime import date

class TeacherViewSet(viewsets.ModelViewSet):
    queryset = Teachers.objects.all()
    serializer_class = TeachersSerializer
    permission_classes=[IsAdminUser]

class SubjectViewSet(viewsets.ModelViewSet):
    queryset=Subjects.objects.all()
    serializer_class=SubjectSerializer
    permission_classes=[IsAdminUser]

@api_view(['GET', 'POST', 'PUT', 'PATCH', 'DELETE'])
def TeacherSubjectViewSet(request):
    permission_classes = [IsAdminUser]
    if request.method=='POST':
        teacher=request.data.get('teacher')
        subject=request.data.get('subject')
        if not subject or not teacher:
            return Response({"message":"Bad Request"},status=400)
        teacher_instance = Teachers.objects.get(id=teacher)
        subject_instance = Subjects.objects.get(id=subject)
        teacher_subject = Teacher_Subject(teacher=teacher_instance, subject=subject_instance, assigned_date=date.today())
        try:
            teacher_subject.save()
        except:
            return Response({"message":"Teacher has already been assigned"},status=409)
        return Response({"message":"success"},status=201)
    elif request.method=='GET':
        teacher_subjects = Teacher_Subject.objects.all()
        serializer = TeacherSubjectSerializer(teacher_subjects, many=True)
        return Response(serializer.data, status=200)     
    elif request.method == 'PUT':
        teacher = request.data.get('teacher')
        subject = request.data.get('subject')
        if not subject or not teacher:
            return Response({"message": "Bad Request"}, status=400)
        try:
            teacher_instance = Teachers.objects.get(id=teacher)
            subject_instance = Subjects.objects.get(id=subject)
            teacher_subject = Teacher_Subject.objects.get(teacher=teacher_instance, subject=subject_instance)
            teacher_subject.delete()
            return Response({"message": "Deleted successfully"}, status=200)
        except Teacher_Subject.DoesNotExist:
            return Response({"message": "Teacher-Subject relation not found"}, status=404)
