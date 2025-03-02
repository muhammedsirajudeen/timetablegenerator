from rest_framework import serializers
from .models import Teachers,Subjects,Teacher_Subject

class TeachersSerializer(serializers.ModelSerializer):
    class Meta:
        model = Teachers
        fields = '__all__'

class SubjectSerializer(serializers.ModelSerializer):
    class Meta:
        model=Subjects
        fields='__all__'

class TeacherSubjectSerializer(serializers.ModelSerializer):
    class Meta:
        model=Teacher_Subject
        fields='__all__'