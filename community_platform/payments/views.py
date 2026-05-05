import stripe
from django.conf import settings
from django.shortcuts import render, redirect, get_object_or_404
from sessions_app.models import Session
from .models import Payment

stripe.api_key = settings.STRIPE_SECRET_KEY

def checkout(request, session_id):

    session = get_object_or_404(Session, id=session_id)

    checkout_session = stripe.checkout.Session.create(
    payment_method_types=["card"],
    line_items=[{
        "price_data": {
            "currency": "usd",
            "product_data": {
                "name": session.title,
            },
            "unit_amount": 1000,
        },
        "quantity": 1,
    }],
    mode="payment",

    metadata={
        "session_id": session.id,
        "user_id": request.user.id
    },

    success_url="http://127.0.0.1:8000/payments/success/?session_id={CHECKOUT_SESSION_ID}",
    cancel_url="http://127.0.0.1:8000/payments/cancel/",
      )

    return redirect(checkout_session.url)

def payment_success(request):
    session_id = request.GET.get("session_id")

    if not session_id:
        return redirect("home")

    stripe_session = stripe.checkout.Session.retrieve(session_id)

    if stripe_session.payment_status != "paid":
        return redirect("payment_failed")

    session_obj = Session.objects.get(
        id=stripe_session.metadata["session_id"]
    )

    Payment.objects.get_or_create(
        stripe_payment_id=stripe_session.payment_intent,
        defaults={
            "user": request.user,
            "session": session_obj,
            "amount": stripe_session.amount_total / 100,
        }
    )

    return render(request, "payments/success.html")