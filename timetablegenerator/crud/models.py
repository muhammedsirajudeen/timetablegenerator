from django.db import models

# Create your models here.
class Teachers(models.Model):
    name = models.CharField(max_length=15)
    phone_number=models.CharField(max_length=15)
    department=models.CharField(max_length=10,default='COMPUTER SCIENCE')
    subjects=models.ManyToManyField('Subjects',through='Teacher_Subject')

    def __str__(self):
        return self.name
    
class Subjects(models.Model):
    semester=models.IntegerField()
    name=models.CharField(max_length=50)
    subject_code=models.CharField(max_length=10)

    def __str__(self):
        return self.name
    
class Teacher_Subject(models.Model):
    teacher = models.ForeignKey(Teachers, on_delete=models.CASCADE)
    subject = models.ForeignKey(Subjects, on_delete=models.CASCADE)
    assigned_date = models.DateField()

    class Meta:
        unique_together = ('teacher', 'subject')

    def __str__(self):
        return f"{self.teacher.name} - {self.subject.name}"


class Timetable(models.Model):
    DAY_CHOICES = [
        ('Monday', 'Monday'),
        ('Tuesday', 'Tuesday'),
        ('Wednesday', 'Wednesday'),
        ('Thursday', 'Thursday'),
        ('Friday', 'Friday'),
    ]

    TIME_SLOTS = [
        ('09:00-09:50', '09:00-09:50'),
        ('09:50-10:40', '09:50-10:40'),
        ('10:50-11:40', '10:50-11:40'),
        ('11:40-12:30', '11:40-12:30'),
        ('01:15-02:05', '01:15-02:05'),
        ('02:05-02:55', '02:05-02:55'),
        ('03:05-04:00', '03:05-04:00'),
    ]

    semester = models.IntegerField()
    day = models.CharField(max_length=10, choices=DAY_CHOICES)
    time_slot = models.CharField(max_length=15, choices=TIME_SLOTS)
    grade= models.CharField(max_length=1,choices=[('A','A'),('B','B'),('C','C')])
    subject = models.ForeignKey(Subjects, on_delete=models.CASCADE, null=True, blank=True)
    teacher = models.ForeignKey(Teachers, on_delete=models.CASCADE, null=True, blank=True)

    class Meta:
        unique_together = ('semester', 'day', 'time_slot','grade')

    def __str__(self):
        return f"Sem {self.semester}: {self.day} - {self.time_slot} - {self.subject} ({self.teacher})"
