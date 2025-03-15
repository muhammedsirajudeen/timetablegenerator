from rest_framework import serializers
from .models import Teachers,Subjects,Teacher_Subject,Timetable

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

class TimetableSerializer(serializers.ModelSerializer):
    subject = serializers.StringRelatedField()  # Use this to represent the related subject
    teacher = serializers.StringRelatedField()  # Use this to represent the related teacher

    class Meta:
        model = Timetable
        fields = ['semester', 'day', 'time_slot', 'subject', 'teacher']