from crud.models import Subjects, Timetable

# Define semester-to-division mapping
SEMESTER_DIVISIONS = {
    3: ['A', 'B'],
    4: ['A'],
    5: ['A', 'B', 'C'],
    6: ['A', 'B'],
    7: ['A'],
    8: ['A', 'B']
}

def generate_timetable():
    days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']
    time_slots = [
        '09:00-09:50', '09:50-10:40', '10:50-11:40', '11:40-12:30',
        '01:15-02:05', '02:05-02:55', '03:05-04:00'
    ]

    # Fetch subjects grouped by semester
    subjects_by_semester = {sem: list(Subjects.objects.filter(semester=sem)) for sem in SEMESTER_DIVISIONS.keys()}

    # Create timetable entries
    for semester, divisions in SEMESTER_DIVISIONS.items():
        for grade in divisions:  # Iterate through the divisions
            for day in days:
                for time_slot in time_slots:
                    # Assign subjects round-robin style
                    Timetable.objects.create(
                        semester=semester,
                        grade=grade,
                        day=day,
                        time_slot=time_slot,
                        subject=None  # You can modify this to assign subjects dynamically
                    )

    print("Timetable generated successfully with divisions.")

from django.core.management.base import BaseCommand

class Command(BaseCommand):
    help = "Generate timetable automatically"

    def handle(self, *args, **kwargs):
        generate_timetable()
        self.stdout.write(self.style.SUCCESS("Timetable generated successfully!"))
