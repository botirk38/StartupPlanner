from django.db import models
from django.contrib.auth import get_user_model
from django.utils.translation import gettext_lazy as _

User = get_user_model()


class Business(models.Model):
    STAGE_CHOICES = [
        ('Idea', 'Idea'),
        ('MVP', 'MVP'),
        ('Growth', 'Growth'),
        ('Maturity', 'Maturity'),
    ]

    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='businesses',
        verbose_name=_("Owner")
    )
    name = models.CharField(_("Business Name"), max_length=255)
    industry = models.CharField(_("Industry"), max_length=255)
    description = models.TextField(_("Description"))
    long_description = models.TextField(_("Long Description"), blank=True)
    stage = models.CharField(_("Stage"), max_length=20, choices=STAGE_CHOICES)
    stage_description = models.CharField(
        _("Stage Description"), max_length=255, blank=True)
    funding_amount = models.DecimalField(
        _("Funding Amount"), max_digits=15, decimal_places=2, default=0)
    team_size = models.PositiveIntegerField(_("Team Size"), default=1)
    founding_date = models.DateField(_("Founding Date"), null=True, blank=True)
    created_at = models.DateTimeField(_("Created At"), auto_now_add=True)
    updated_at = models.DateTimeField(_("Updated At"), auto_now=True)

    class Meta:
        verbose_name = _("Business")
        verbose_name_plural = _("Businesses")
        ordering = ['-created_at']

    def __str__(self):
        return self.name
