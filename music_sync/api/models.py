from django.db import models
import string
import random
def codeGenerator():
    length=6
    while True:
        code=''.join(random.choices(string.ascii_uppercase,k=length))
        if Rooms.objects.filter(code=code).count()==0:
            break
    return code  

class Rooms(models.Model):
    code=models.CharField(max_length=8,default=codeGenerator,unique=True)
    host=models.CharField(max_length=50,unique=True)
    guest_can_pause=models.BooleanField(null=False,default=False)
    votes_to_skip=models.IntegerField(null=False,default=1)
    created_at=models.DateTimeField(auto_now_add=True)

