from crud.models import Subjects,Timetable
def generate_timetable():
    semesters = range(3, 9)  # Semesters 3 to 8
    days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']
    time_slots = [
        '09:00-09:50', '09:50-10:40', '10:50-11:40', '11:40-12:30',
        '01:15-02:05', '02:05-02:55', '03:05-04:00'
    ]

    # Fetch all subjects and group them by semester
    subjects_by_semester = {sem: list(Subjects.objects.filter(semester=sem)) for sem in semesters}

    # Create empty timetable slots
    for semester in semesters:
        for day in days:
            for time_slot in time_slots:
                # Assign subjects round-robin style
                Timetable.objects.create(
                    semester=semester,
                    day=day,
                    time_slot=time_slot,
                    subject=None
                )

        

    print("Initial Timetable generated with subjects assigned.")

from django.core.management.base import BaseCommand

class Command(BaseCommand):
    help = "Generate timetable automatically"

    def handle(self, *args, **kwargs):
        generate_timetable()
        self.stdout.write(self.style.SUCCESS("Timetable generated successfully!"))
