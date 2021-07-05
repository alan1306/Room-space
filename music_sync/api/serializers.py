from rest_framework import serializers
from .models import Rooms

class RoomSerializer(serializers.ModelSerializer):
    class Meta:
        model=Rooms
        fields=('id','code','host','guest_can_pause','votes_to_skip','created_at')
class createRoomSerializer(serializers.ModelSerializer):
    class Meta:
        model=Rooms
        fields=('guest_can_pause','votes_to_skip')
class updateRoomSerializer(serializers.ModelSerializer):
    code = serializers.CharField(validators=[])

    class Meta:
        model=Rooms
        fields=('guest_can_pause','votes_to_skip','code')