# Create your models here.
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from django.db import models
from typing import Any


class CustomUserManager(BaseUserManager):
    def create_user(self, email: str, password: str = None, **extra_fields: Any) -> "CustomUser":
        """Creates and returns a regular user."""
        if not email:
            raise ValueError("The Email field must be set")
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email: str, password: str, **extra_fields: Any) -> "CustomUser":
        """Creates and returns a superuser."""
        extra_fields.setdefault("is_staff", True)
        extra_fields.setdefault("is_superuser", True)
        return self.create_user(email, password, **extra_fields)


class CustomUser(AbstractBaseUser, PermissionsMixin):
    """Custom User model that uses email instead of username."""
    
    email= models.EmailField(unique=True)
    first_name = models.CharField(max_length=30, blank=True)
    last_name= models.CharField(max_length=30, blank=True)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)

    objects = CustomUserManager()

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = []  # Add extra required fields if needed

    def __str__(self) -> str:
        return self.email

