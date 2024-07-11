from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin, Group, Permission
from django.db import models
from django.utils import timezone
from django.core.validators import RegexValidator, MinLengthValidator, MaxLengthValidator
from datetime import timedelta


class CustomUserManager(BaseUserManager):
    """
    Custom manager for CustomUser to handle user creation with email and password.
    """

    def create_user(self, email, password=None, **extra_fields):
        """
        Creates and saves a regular user with the given email and password.
        """
        if not email:
            raise ValueError('The Email field must be set')
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        if password:
            user.set_password(password)
        else:
            user.set_unusable_password()
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        """
        Creates and saves a superuser with the given email and password.
        """
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        if extra_fields.get('is_staff') is not True:
            raise ValueError('Superuser must have is_staff=True.')
        if extra_fields.get('is_superuser') is not True:
            raise ValueError('Superuser must have is_superuser=True.')
        return self.create_user(email, password, **extra_fields)


class CustomUser(AbstractBaseUser, PermissionsMixin):
    """
    Custom user model extending AbstractBaseUser and PermissionsMixin.
    Includes additional fields and methods specific to application requirements.
    """
    canva_user_id = models.CharField(max_length=1024, unique=True)
    email = models.EmailField(max_length=255, unique=True)
    display_name = models.CharField(max_length=255, blank=True)
    team_id = models.CharField(max_length=255, blank=True, null=True)
    date_joined = models.DateTimeField(auto_now_add=True)
    access_token = models.CharField(max_length=4096, blank=True, null=True)
    refresh_token = models.CharField(max_length=4096, blank=True, null=True)
    token_expiry = models.DateTimeField(blank=True, null=True)
    bio = models.TextField(blank=True)
    avatar = models.URLField(max_length=1024, blank=True, null=True)

    groups = models.ManyToManyField(
        Group,
        related_name='custom_user_groups',
        blank=True,
        help_text='The groups this user belongs to. A user will get all permissions granted to each of their groups.',
        verbose_name='groups',
    )
    user_permissions = models.ManyToManyField(
        Permission,
        related_name='custom_user_permissions',
        blank=True,
        help_text='Specific permissions for this user.',
        verbose_name='user permissions',
    )

    objects = CustomUserManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []

    def __str__(self):
        return self.email

    def set_tokens(self, access_token, refresh_token, expires_in):
        """
        Sets the access and refresh tokens with an expiration time.
        """
        self.access_token = access_token
        self.refresh_token = refresh_token
        self.token_expiry = timezone.now() + timedelta(seconds=expires_in)
        self.save()

    def is_first_time_login(self):
        """
        Checks if the user is logging in for the first time.
        """
        return self.last_login is None


class OAuthState(models.Model):
    """
    Model to store OAuth state and code verifier for security purposes.
    """
    state = models.CharField(max_length=4096, unique=True)
    code_verifier = models.CharField(max_length=4096)
    created_at = models.DateTimeField(auto_now_add=True)

    def is_expired(self):
        """
        Checks if the OAuth state has expired (10 minutes lifetime).
        """
        expiration_time = timezone.now() - timezone.timedelta(minutes=10)
        return self.created_at < expiration_time


class BillingInfo(models.Model):
    """
    Model to store billing information related to a user.
    """
    user = models.OneToOneField(
        CustomUser, on_delete=models.CASCADE, related_name='billing_info')
    card_number = models.CharField(
        max_length=19,
        validators=[
            MinLengthValidator(13),
            MaxLengthValidator(19),
            RegexValidator(
                regex=r'^\d{13,19}$',
                message='Card number must be numeric and between 13 and 19 digits'
            )
        ]
    )
    card_expiry = models.CharField(
        max_length=5,
        validators=[
            RegexValidator(
                regex=r'^\d{2}/\d{2}$',
                message='Card expiry must be in MM/YY format'
            )
        ]
    )
    card_cvc = models.CharField(
        max_length=4,
        validators=[
            MinLengthValidator(3),
            MaxLengthValidator(4),
            RegexValidator(
                regex=r'^\d{3,4}$',
                message='CVC must be numeric and 3 or 4 digits'
            )
        ]
    )
    card_zip = models.CharField(max_length=10)
    updated_at = models.DateTimeField(auto_now=True)

    def save(self, *args, **kwargs):
        """
        Override save method to mask card number.
        """
        self.card_number = self.mask_card_number(self.card_number)
        super().save(*args, **kwargs)

    def mask_card_number(self, card_number):
        """
        Masks the card number for storage.
        """
        return '*' * (len(card_number) - 4) + card_number[-4:]

    def set_full_card_number(self, card_number):
        """
        Sets the full card number.
        """
        self.card_number = card_number
        self.save()
