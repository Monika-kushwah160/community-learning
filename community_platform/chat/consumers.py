import json
from channels.generic.websocket import AsyncWebsocketConsumer
from asgiref.sync import sync_to_async
from .models import ChatMessage
from sessions_app.models import Session

class ChatConsumer(AsyncWebsocketConsumer):

    async def connect(self):
        self.session_id = self.scope["url_route"]["kwargs"]["session_id"]
        self.room_group_name = f"chat_{self.session_id}"

        # ✅ GET USER FROM JWT MIDDLEWARE
        self.user = self.scope["user"]

        if not self.user.is_authenticated:
            await self.close()
            return

        try:
            self.session = await sync_to_async(Session.objects.get)(id=self.session_id)
        except Session.DoesNotExist:
            await self.close()
            return

        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )

        await self.accept()

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )

    async def receive(self, text_data):
        data = json.loads(text_data)
        message = data.get("message")

        if not message:
            return

        await sync_to_async(ChatMessage.objects.create)(
            session=self.session,
            user=self.user,
            message=message
        )

        await self.channel_layer.group_send(
            self.room_group_name,
            {
                "type": "chat_message",
                "message": message,
                "username": self.user.username
            }
        )

    async def chat_message(self, event):
        await self.send(text_data=json.dumps(event))