import os
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "community_platform.settings")

from django.core.asgi import get_asgi_application
django_asgi_app = get_asgi_application()

from channels.routing import ProtocolTypeRouter, URLRouter
from chat.middleware import JWTAuthMiddleware
import community_platform.routing

application = ProtocolTypeRouter({
    "http": django_asgi_app,

    "websocket": JWTAuthMiddleware(
        URLRouter(
            community_platform.routing.websocket_urlpatterns
        )
    ),
})