from django.core.management.base import BaseCommand
from faker import Faker
from crud.models import Teachers  # Adjust this import based on your app structure

class Command(BaseCommand):
    help = 'Generates 50 random teachers'

    def handle(self, *args, **kwargs):
        fake = Faker()
        
        for _ in range(50):
            # Generate random data for a teacher
            name = fake.name()
            phone_number = fake.phone_number()
            department = 'COMPUTER SCIENCE'  # You can modify this if you want random departments
            subjects = []  # You can populate this if you want subjects
            
            # Create a Teacher instance and save it
            teacher = Teachers.objects.create(
                name=name,
                phone_number=phone_number,
                department=department
            )
            
            self.stdout.write(self.style.SUCCESS(f'Successfully created teacher: {name}'))
