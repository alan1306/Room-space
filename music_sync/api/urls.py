from django.urls import path
from .views import RoomView,createRoomView,getRoom,getAllRoomCodes,joinRoom,checkUserInRoom,leaveRoom,updateRoom
urlpatterns = [
    path('room',RoomView.as_view()),
    path('create',createRoomView.as_view()),
    path('get-room',getRoom.as_view()),
    path('get-all-room-codes',getAllRoomCodes.as_view()),
    path('join-room',joinRoom.as_view()),
    path('check-user-in-room',checkUserInRoom.as_view()),
    path('leave-room',leaveRoom.as_view()),
    path('update-room',updateRoom.as_view()),
]
