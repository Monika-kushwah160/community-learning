import React, { useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";

function PaymentSuccess() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    const sessionId = params.get("session_id");

    if (!sessionId) {
      alert("Invalid payment session");
      return;
    }

    fetch(
      `http://localhost:8001/payments/api/verify/?session_id=${sessionId}`,
      {
        headers: {
          Authorization: "Bearer " + token,
        },
      }
    )
      .then(res => res.json())
      .then(() => {
        // ✅ Redirect after success
        setTimeout(() => {
          navigate(`/session/${sessionId}`);
        }, 1500);
      })
      .catch(() => {
        alert("Payment verification failed");
      });

  }, [params, token, navigate]);

  return (
    <div style={{
      textAlign: "center",
      marginTop: "100px"
    }}>
      <h2>✅ Payment Successful!</h2>
      <p>Redirecting to your session...</p>
    </div>
  );
}

export default PaymentSuccess;