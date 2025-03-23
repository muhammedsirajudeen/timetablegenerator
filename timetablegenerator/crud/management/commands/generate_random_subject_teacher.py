from django.core.management.base import BaseCommand
from faker import Faker
from crud.models import Teachers, Subjects, Teacher_Subject  # Adjust the import based on your app structure
from random import choice, sample
from .generate_timetable import SEMESTER_DIVISIONS
import datetime

class Command(BaseCommand):
    help = 'Generates random teachers, subjects, and assigns teachers to subjects'

    def handle(self, *args, **kwargs):
        fake = Faker()

        # Step 1: Create 50 random teachers
        teachers = []  # To hold created teachers
        for _ in range(50):
            name = fake.name()
            phone_number = fake.phone_number()
            department = 'COMPUTER SCIENCE'  # Modify this if you want random departments
            
            # Create a Teacher instance and save it
            teacher = Teachers.objects.create(
                name=name,
                phone_number=phone_number,
                department=department
            )
            teachers.append(teacher)  # Add the teacher to the list
            self.stdout.write(self.style.SUCCESS(f'Successfully created teacher: {name}'))

        # Step 2: Create 8 random subjects for each semester from Semester 3 to Semester 8
        subjects = []  # To hold created subjects
        for semester in range(3, 9):
            for _ in range(8):  # 8 subjects per semester
                subject_name = fake.word().capitalize() + " " + fake.word().capitalize()  # Random subject name
                subject_code = fake.bothify(text='???-####', letters='ABCDEFGHIJKLMNOPQRSTUVWXYZ')  # Random subject code

                # Create a Subject instance and save it
                subject = Subjects.objects.create(
                    semester=semester,
                    name=subject_name,
                    subject_code=subject_code
                )
                subjects.append(subject)  # Add the subject to the list
                self.stdout.write(self.style.SUCCESS(f'Successfully created subject: {subject_name} for Semester {semester}'))

        # Step 3: Assign teachers to random subjects and set assigned_date
        for teacher in teachers:
            # Randomly pick between 3 to 6 subjects for each teacher (you can modify the range)
            num_subjects = choice(range(3, 7))  # A teacher gets between 3 and 6 subjects
            selected_subjects = sample(subjects, num_subjects)  # Randomly pick subjects for the teacher

            # Assign selected subjects to the teacher and set the assigned_date
            for subject in selected_subjects:
                # Here we create Teacher_Subject instances and set the assigned_date
                Teacher_Subject.objects.create(
                    teacher=teacher,
                    subject=subject,
                    assigned_date=datetime.date.today()  # or set any specific date
                )

            self.stdout.write(self.style.SUCCESS(f'Successfully assigned {num_subjects} subjects to teacher: {teacher.name}'))
