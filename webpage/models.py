from django.db import models

class Project(models.Model):
    title = models.CharField(max_length=100)
    description = models.TextField()
    technologies = models.CharField(max_length=200)
    github_url = models.URLField(blank=True, null=True)
    live_url = models.URLField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title

class Experience(models.Model):
    CATEGORY_CHOICES = [
        ('WORK', 'Work Experience'),
        ('EDUCATION', 'Education'),
    ]
    category = models.CharField(max_length=10, choices=CATEGORY_CHOICES, default='WORK')
    title = models.CharField(max_length=150)
    organization = models.CharField(max_length=150)
    location = models.CharField(max_length=100, blank=True, null=True)
    timeline = models.CharField(max_length=50)
    description = models.TextField(blank=True, null=True)

    def __str__(self):
        return f"{self.organization} - {self.title}"