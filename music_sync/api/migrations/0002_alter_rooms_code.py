# Generated by Django 3.2.3 on 2021-05-29 17:59

import api.models
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='rooms',
            name='code',
            field=models.CharField(default=api.models.codeGenerator, max_length=8, unique=True),
        ),
    ]