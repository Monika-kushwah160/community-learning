import stripe
from django.conf import settings
from django.shortcuts import get_object_or_404

from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from sessions_app.models import Session, Enrollment
from sessions_app.models import Session
from .models import Payment

stripe.api_key = settings.STRIPE_SECRET_KEY


# 🔥 CREATE CHECKOUT SESSION
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_checkout_session(request, session_id):

    session_obj = get_object_or_404(Session, id=session_id)

    checkout_session = stripe.checkout.Session.create(
        payment_method_types=["card"],
        line_items=[{
            "price_data": {
                "currency": "usd",
                "product_data": {
                    "name": session_obj.title,
                },
                "unit_amount": 1000,  # $10
            },
            "quantity": 1,
        }],
        mode="payment",

        metadata={
            "session_id": session_obj.id,
            "user_id": request.user.id
        },

        success_url="http://localhost:3000/payment-success?session_id={CHECKOUT_SESSION_ID}",
        cancel_url="http://localhost:3000/payment-cancel",
    )

    return Response({
        "url": checkout_session.url
    })


# 🔥 VERIFY PAYMENT


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def verify_payment(request):

    session_id = request.GET.get("session_id")

    stripe_session = stripe.checkout.Session.retrieve(session_id)

    if stripe_session.payment_status != "paid":
        return Response({"status": "failed"}, status=400)

    session_obj = Session.objects.get(
        id=stripe_session.metadata["session_id"]
    )

    # ✅ SAVE PAYMENT
    Payment.objects.get_or_create(
        stripe_payment_id=stripe_session.payment_intent,
        defaults={
            "user": request.user,
            "session": session_obj,
            "amount": stripe_session.amount_total / 100,
        }
    )

    # 🔥 IMPORTANT FIX: ENROLL USER
    Enrollment.objects.get_or_create(
        user=request.user,
        session=session_obj
    )

    return Response({"status": "success"})