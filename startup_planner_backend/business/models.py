from django.db import models
from django.contrib.auth import get_user_model
from django.utils.translation import gettext_lazy as _
from django.core.validators import MinValueValidator, MaxValueValidator
from decimal import Decimal

User = get_user_model()


class Business(models.Model):
    class Stage(models.TextChoices):
        IDEA = 'Idea', _('Idea')
        MVP = 'MVP', _('MVP')
        GROWTH = 'Growth', _('Growth')
        MATURITY = 'Maturity', _('Maturity')

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
    stage = models.CharField(_("Stage"), max_length=20, choices=Stage.choices)
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


class Competitor(models.Model):
    class GrowthTrend(models.TextChoices):
        STEADY = 'Steady', _('Steady')
        DECREASING = 'Decreasing', _('Decreasing')
        INCREASING = 'Increasing', _('Increasing')

    business = models.ForeignKey(
        Business,
        on_delete=models.CASCADE,
        related_name="competitors",
        verbose_name=_("Business")
    )
    name = models.CharField(_("Name"), max_length=255)
    industry = models.CharField(_("Industry"), max_length=255)
    product = models.CharField(_("Product"), max_length=255)
    market_share = models.DecimalField(
        _("Market Share"),
        max_digits=5,
        decimal_places=2,
        default=0,
        validators=[MinValueValidator(
            Decimal('0')), MaxValueValidator(Decimal('100'))]
    )
    website = models.URLField(_("Website"), max_length=200)
    customer_reviews = models.PositiveIntegerField(
        _("Customer Reviews"), default=0)
    growth_trend = models.CharField(
        _("Growth Trend"), max_length=10, choices=GrowthTrend.choices)

    def __str__(self):
        return self.name

    class Meta:
        unique_together = ('business', 'name')


class CompetitorStrength(models.Model):
    competitor = models.ForeignKey(
        Competitor, on_delete=models.CASCADE, related_name='strengths')
    description = models.CharField(_("Strength"), max_length=100)

    def __str__(self):
        return f"{self.competitor.name} - {self.description}"


class CompetitorWeakness(models.Model):
    competitor = models.ForeignKey(
        Competitor, on_delete=models.CASCADE, related_name='weaknesses')
    description = models.CharField(_("Weakness"), max_length=100)

    def __str__(self):
        return f"{self.competitor.name} - {self.description}"
