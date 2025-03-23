from .models import Teachers,Subjects,Teacher_Subject
from .serializers import TeachersSerializer,SubjectSerializer,TeacherSubjectSerializer,TimetableSerializer
from rest_framework import viewsets
from rest_framework.permissions import IsAdminUser
# Create your views here.
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
import logging
from django.shortcuts import get_object_or_404
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import Timetable, Subjects, Teachers
from random import choice

# Setup logger
logger = logging.getLogger(__name__)

class PopulateTimetableView(APIView):
    def post(self, request, *args, **kwargs):
        try:
            # Loop through each semester (1 to 8)
            for semester in range(1, 9):
                # Fetch the subjects and teachers for the current semester
                subjects = Subjects.objects.filter(semester=semester)
                teachers = Teachers.objects.filter(department='COMPUTER SCIENCE')  # Assuming CS for simplicity
                
                # Check if there are subjects and teachers available
                if not subjects.exists():
                    logger.warning(f"No subjects found for semester {semester}. Skipping...")
                    continue

                if not teachers.exists():
                    logger.warning(f"No teachers found for semester {semester}. Skipping...")
                    continue

                # Loop through each Timetable entry for the current semester where subject or teacher is null
                timetable_entries = Timetable.objects.filter(semester=semester, subject__isnull=True) | Timetable.objects.filter(semester=semester, teacher__isnull=True)

                for timetable_entry in timetable_entries:
                    # Randomly assign a subject if it's null
                    if timetable_entry.subject is None:
                        timetable_entry.subject = choice(subjects)
                        logger.info(f"Assigned subject {timetable_entry.subject} to {timetable_entry}")
                    
                    # Randomly assign a teacher if it's null
                    if timetable_entry.teacher is None:
                        timetable_entry.teacher = choice(teachers)
                        logger.info(f"Assigned teacher {timetable_entry.teacher} to {timetable_entry}")
                    
                    # Save the updated timetable entry
                    timetable_entry.save()

            return Response({"message": "Timetable populated successfully!"}, status=status.HTTP_200_OK)

        except Exception as e:
            logger.error(f"Error occurred while populating timetable: {str(e)}")
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)


# 1. Remove teacher and subject from a specific time slot
class RemoveTeacherAndSubjectView(APIView):
    def post(self, request, *args, **kwargs):
        semester = request.data.get("semester")
        day = request.data.get("day")
        time_slot = request.data.get("time_slot")
        grade=request.data("grade")
        # Find the specific timetable entry
        timetable_entry = Timetable.objects.filter(
            semester=semester, day=day, time_slot=time_slot,grade=grade).first()

        if timetable_entry:
            timetable_entry.subject = None
            timetable_entry.teacher = None
            timetable_entry.save()
            logger.info(f"Removed teacher and subject from {semester} - {day} - {time_slot}")
            return Response({"message": "Teacher and subject removed successfully."}, status=status.HTTP_200_OK)
        return Response({"error": "Timetable entry not found."}, status=status.HTTP_400_BAD_REQUEST)


# 2. Remove only the teacher from a specific time slot
class RemoveTeacherView(APIView):
    def post(self, request, *args, **kwargs):
        semester = request.data.get("semester")
        day = request.data.get("day")
        time_slot = request.data.get("time_slot")
        grade=request.data.get("grade")
        # Find the specific timetable entry
        timetable_entry = Timetable.objects.filter(
            semester=semester, day=day, time_slot=time_slot,grade=grade).first()

        if timetable_entry:
            timetable_entry.teacher = None
            timetable_entry.save()
            logger.info(f"Removed teacher from {semester} - {day} - {time_slot}")
            return Response({"message": "Teacher removed successfully."}, status=status.HTTP_200_OK)
        return Response({"error": "Timetable entry not found."}, status=status.HTTP_400_BAD_REQUEST)


# 3. Add a teacher and subject to a specific time slot
class AddTeacherAndSubjectView(APIView):
    def post(self, request, *args, **kwargs):
        semester = request.data.get("semester")
        day = request.data.get("day")
        time_slot = request.data.get("time_slot")
        grade=request.data.get("grade")
        subject_id = request.data.get("subject_id")
        teacher_id = request.data.get("teacher_id")
        
        subject = get_object_or_404(Subjects, id=subject_id)
        teacher = get_object_or_404(Teachers, id=teacher_id)
        
        # Find or create the specific timetable entry
        timetable_entry, created = Timetable.objects.get_or_create(
            semester=semester, day=day, time_slot=time_slot,grade=grade)
        
        timetable_entry.subject = subject
        timetable_entry.teacher = teacher
        timetable_entry.save()
        
        if created:
            logger.info(f"Added teacher and subject to new entry: {semester} - {day} - {time_slot}")
        else:
            logger.info(f"Updated teacher and subject for existing entry: {semester} - {day} - {time_slot}")
        
        return Response({"message": "Teacher and subject added successfully."}, status=status.HTTP_200_OK)


# 4. Remove all teacher-subject assignments from all timetables
class RemoveAllTeacherSubjectView(APIView):
    def post(self, request, *args, **kwargs):
        # Remove all teacher-subject assignments
        Timetable.objects.update(subject=None, teacher=None)
        
        logger.info("Removed all teacher-subject assignments from the timetable.")
        return Response({"message": "All teacher-subject assignments removed successfully."}, status=status.HTTP_200_OK)

class AddTeacherToTimetableView(APIView):
    def post(self, request, *args, **kwargs):
        try:
            semester = request.data.get("semester")
            day = request.data.get("day")
            time_slot = request.data.get("time_slot")
            grade=request.data.get(("grade"))
            teacher_id = request.data.get("teacher_id")
            
            # Check if all required data is provided
            if not semester or not day or not time_slot or not teacher_id or not grade:
                return Response({"error": "Missing required fields."}, status=status.HTTP_400_BAD_REQUEST)

            # Check if the teacher exists
            try:
                teacher = Teachers.objects.get(id=teacher_id)
            except Teachers.DoesNotExist:
                return Response({"error": "Teacher not found."}, status=status.HTTP_404_NOT_FOUND)

            # Find the timetable entry for the given semester, day, and time slot
            timetable_entry = Timetable.objects.filter(
                semester=semester,
                day=day,
                time_slot=time_slot,
                grade=grade
            ).first()

            if timetable_entry is None:
                return Response({"error": "No timetable entry found for the provided details."}, status=status.HTTP_404_NOT_FOUND)

            # Assign the teacher to the timetable entry
            timetable_entry.teacher = teacher
            timetable_entry.save()

            return Response({
                "message": f"Teacher {teacher.name} successfully assigned to {timetable_entry.subject.name} on {day} at {time_slot}."
            }, status=status.HTTP_200_OK)

        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
        

class AddSubjectToTimetableView(APIView):
    def post(self, request, *args, **kwargs):
        try:
            semester = request.data.get("semester")
            day = request.data.get("day")
            time_slot = request.data.get("time_slot")
            grade=request.data.get("grade")
            subject_id = request.data.get("subject_id")

            if not semester or not day or not time_slot or not subject_id or not grade:
                return Response({"error": "Missing required fields."}, status=status.HTTP_400_BAD_REQUEST)

            # Check if the subject exists
            try:
                subject = Subjects.objects.get(id=subject_id)
            except Subjects.DoesNotExist:
                return Response({"error": "Subject not found."}, status=status.HTTP_404_NOT_FOUND)

            # Find the timetable entry for the given semester, day, and time slot
            timetable_entry = Timetable.objects.filter(
                semester=semester,
                day=day,
                time_slot=time_slot,
                grade=grade
            ).first()

            if timetable_entry is None:
                return Response({"error": "No timetable entry found for the provided details."}, status=status.HTTP_404_NOT_FOUND)

            # Assign the subject to the timetable entry
            timetable_entry.subject = subject
            timetable_entry.save()

            return Response({
                "message": f"Subject {subject.name} successfully assigned to {timetable_entry.teacher.name} on {day} at {time_slot}."
            }, status=status.HTTP_200_OK)

        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)


class RemoveSubjectFromTimetableView(APIView):
    def post(self, request, *args, **kwargs):
        try:
            semester = request.data.get("semester")
            day = request.data.get("day")
            time_slot = request.data.get("time_slot")
            grade=request.data.get("grade")
            if not semester or not day or not time_slot or not grade:
                return Response({"error": "Missing required fields."}, status=status.HTTP_400_BAD_REQUEST)

            # Find the timetable entry for the given semester, day, and time slot
            timetable_entry = Timetable.objects.filter(
                semester=semester,
                day=day,
                time_slot=time_slot,
                grade=grade
            ).first()

            if timetable_entry is None:
                return Response({"error": "No timetable entry found for the provided details."}, status=status.HTTP_404_NOT_FOUND)

            # Remove the subject from the timetable entry
            timetable_entry.subject = None
            timetable_entry.save()

            return Response({
                "message": f"Subject successfully removed from {timetable_entry.teacher.name}'s class on {day} at {time_slot}."
            }, status=status.HTTP_200_OK)

        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
        

class GetTimetableBySemesterView(APIView):
    def get(self, request, *args, **kwargs):
        try:
            # Get semester and grade from query parameters
            semester = request.query_params.get('semester')
            grade = request.query_params.get('grade')  # Grade represents division

            if not semester or not grade:
                return Response({"error": "Both 'semester' and 'grade' are required."}, status=status.HTTP_400_BAD_REQUEST)

            try:
                semester = int(semester)
            except ValueError:
                return Response({"error": "Invalid semester value. It should be an integer."}, status=status.HTTP_400_BAD_REQUEST)

            # Fetch timetable entries based on semester and grade
            timetable_entries = Timetable.objects.filter(semester=semester, grade=grade)

            if not timetable_entries.exists():
                return Response({"message": f"No timetable entries found for Semester {semester}, Grade {grade}."}, status=status.HTTP_404_NOT_FOUND)

            # Custom sort order for days of the week
            day_order = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']
            
            # Sort timetable entries by day using the custom day_order list
            sorted_timetable_entries = sorted(
                timetable_entries,
                key=lambda x: day_order.index(x.day)
            )

            # Serialize the queryset
            serializer = TimetableSerializer(sorted_timetable_entries, many=True)

            # Return the serialized data as JSON
            return Response(serializer.data, status=status.HTTP_200_OK)

        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
