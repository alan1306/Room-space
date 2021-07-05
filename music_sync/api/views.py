from sys import getsizeof
from django.db.models import query
from django.http.response import HttpResponse
from django.shortcuts import render
from rest_framework.response import Response
from rest_framework import generics, serializers,status
from rest_framework.views import APIView
from .models import Rooms
from .serializers import RoomSerializer,createRoomSerializer,updateRoomSerializer
from django.http import JsonResponse
class RoomView(generics.ListAPIView):
    queryset=Rooms.objects.all()
    serializer_class=RoomSerializer

class createRoomView(APIView):
    serializer_class = createRoomSerializer
    def post(self, request, format=None):
        if not self.request.session.exists(self.request.session.session_key):
            self.request.session.create()
            self.request.session.set_expiry(2000)

        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            guest_can_pause = serializer.data.get('guest_can_pause')
            votes_to_skip = serializer.data.get('votes_to_skip')
            host = self.request.session.session_key
            queryset = Rooms.objects.filter(host=host)
            if queryset.exists():
                room = queryset[0]
                room.guest_can_pause = guest_can_pause
                room.votes_to_skip = votes_to_skip
                room.save(update_fields=['guest_can_pause', 'votes_to_skip'])
                self.request.session['room_code']=room.code
                return Response(RoomSerializer(room).data, status=status.HTTP_200_OK)
            else:
                room = Rooms(host=host, guest_can_pause=guest_can_pause,
                            votes_to_skip=votes_to_skip)
                room.save()
                self.request.session['room_code']=room.code
                return Response(RoomSerializer(room).data, status=status.HTTP_201_CREATED)

        return Response({'Bad Request': 'Invalid data...'}, status=status.HTTP_400_BAD_REQUEST)
class getRoom(APIView):
    serializer=RoomSerializer
    lookup_url_kwarg='code'

    def get(self,request,format=None):
        code=request.GET.get(self.lookup_url_kwarg)
        if code!=None:
            query=Rooms.objects.filter(code=code)
            if query.exists():
                room=query[0]
                data=RoomSerializer(room).data
                print(data)
                data['isHost']=self.request.session.session_key==room.host
                return Response(data,status=status.HTTP_200_OK)
            else:
                return Response({'invalid request':'Room doesnt exits'},status=status.HTTP_404_NOT_FOUND)
        else:
            return Response({"Error:Room code is missing or is invalid"},status=status.HTTP_400_BAD_REQUEST)
class getAllRoomCodes(APIView):
    def get(self,request,format=None):
        rooms=Rooms.objects.all()
        all_rooms=[]
        if rooms.exists():
            for index in range(len(rooms)):
                # dic={index+1:rooms[index].code}
                all_rooms.append(rooms[index].code)
            return Response(all_rooms,status=status.HTTP_200_OK)
        else:
            return Response({"Error:No room exits"},status=status.HTTP_404_NOT_FOUND)
class joinRoom(APIView):
    def post(self,request,format=None):
        if not self.request.session.exists(self.request.session.session_key):
            self.request.session.create()
        room_code=request.data.get('code')
        if room_code !=None:
            room=Rooms.objects.filter(code=room_code)
            if room.exists():
                self.request.session['room_code']=room_code
                return Response({'message':'Room joined!!'},status=status.HTTP_200_OK)
        else:
            return Response({'Error':'Room doesnt exists'},status=status.HTTP_404_NOT_FOUND)
class checkUserInRoom(APIView):
    def get(self,request,format=None):
        if not self.request.session.exists(self.request.session.session_key):
            self.request.session.create()
            return Response(status=status.HTTP_404_NOT_FOUND)
        data={
            'code':self.request.session['room_code']
        }
        return JsonResponse(data,status=status.HTTP_200_OK)
class leaveRoom(APIView):
    def post(self,request,format=None):
        self.request.session.pop('room_code')
        hostId=self.request.session.session_key
        room=Rooms.objects.filter(host=hostId)
        if room.exists():
            room.delete()
        return Response({'success:room leaved'},status=status.HTTP_200_OK)
class updateRoom(APIView):
    serializer_class=updateRoomSerializer
    def patch(self,request,format=None):
        print("in update rom ",request.data)
        if not self.request.session.exists(self.request.session.session_key):
            self.request.session.create()
        serializer=self.serializer_class(data=request.data)
        if serializer.is_valid():
            guest_can_pause=serializer.data.get('guest_can_pause')
            votes_to_skip=serializer.data.get('votes_to_skip')
            roomCode=serializer.data.get('code')
            room=Rooms.objects.filter(code=roomCode)
            if room.exists():
                room=room[0]
                user_id=self.request.session.session_key
                if user_id!=room.host:
                    return Response({'Error':'You are not the user'},status=status.HTTP_403_FORBIDDEN)
                else:
                    room.guest_can_pause=guest_can_pause
                    room.votes_to_skip=votes_to_skip
                    room.save(update_fields=['guest_can_pause', 'votes_to_skip'])
                    return Response({'Success':'Room updates successfully...!'},status=status.HTTP_200_OK)
            else:
                return Response({'Error':'Room not found!'},status=status.HTTP_404_NOT_FOUND)
        else:
            return Response({'Error':'Room not found!'},status=status.HTTP_404_NOT_FOUND)
        

        