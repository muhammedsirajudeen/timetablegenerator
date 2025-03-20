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
    subject = serializers.StringRelatedField()  # For string representation
    subject_id = serializers.PrimaryKeyRelatedField(source='subject', read_only=True)  # For ID
    
    teacher = serializers.StringRelatedField()
    teacher_id = serializers.PrimaryKeyRelatedField(source='teacher', read_only=True)  # Use this to represent the related teacher change this

    class Meta:
        model = Timetable
        fields = ['semester', 'day', 'time_slot', 'subject_id' ,'subject', 'teacher','teacher_id']