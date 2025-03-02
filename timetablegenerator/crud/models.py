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


