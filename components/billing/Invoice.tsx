"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";

interface InvoiceData {
  invoiceNumber: string;
  bookingId: string;
  invoiceDate: string;
  dueDate: string;
  guest: {
    name: string;
    email: string;
    phone: string;
  };
  property: {
    name: string;
    address: string;
    phone: string;
    email: string;
  };
  booking: {
    roomName: string;
    roomType: string;
    checkIn: string;
    checkOut: string;
    nights: number;
    guests: number;
  };
  pricing: {
    roomRate: number;
    roomTotal: number;
    pointsUsed: number;
    pointsValue: number;
    subtotal: number;
    discount: number;
    total: number;
    paid: number;
    dueAmount: number;
    amountPaid: number;
  };
  payment: {
    method: string;
    status: string;
    transactionId: string;
    paidAt: string;
    payAtHotel: boolean;
  };
  terms: string[];
}

export default function Invoice() {
  const params = useParams();
  const bookingId = params.bookingId as string;
  const [invoice, setInvoice] = useState<InvoiceData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (bookingId) {
      fetchInvoice();
    }
  }, [bookingId]);

  const fetchInvoice = async () => {
    try {
      console.log('📄 Fetching invoice for bookingId:', bookingId);
      const response = await fetch(`/api/billing/invoice/${bookingId}`);
      console.log('📊 Response status:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Invoice API error:', response.status, errorText);
        throw new Error(`Failed to fetch invoice (${response.status}): ${errorText}`);
      }
      
      const data = await response.json();
      console.log('✅ Invoice data received:', data);
      setInvoice(data);
    } catch (err) {
      console.error('❌ Invoice fetch error:', err);
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const downloadPDF = () => {
    window.print();
  };

  const sendEmail = async () => {
    try {
      const response = await fetch(`/api/billing/send/${bookingId}`, {
        method: "POST",
      });
      if (!response.ok) {
        throw new Error("Failed to send invoice");
      }
      alert("Invoice sent to your email!");
    } catch (err) {
      alert("Failed to send invoice: " + (err instanceof Error ? err.message : "Unknown error"));
    }
  };

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: "2rem", marginBottom: "1rem" }}>📄</div>
          <p>Loading invoice...</p>
        </div>
      </div>
    );
  }

  if (error || !invoice) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ textAlign: "center", color: "#dc2626" }}>
          <div style={{ fontSize: "2rem", marginBottom: "1rem" }}>❌</div>
          <p>{error || "Invoice not found"}</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ background: "#f5f4e8", minHeight: "100vh", padding: "20px" }}>
      {/* Action Buttons - Hidden in print */}
      <div className="no-print" style={{ marginBottom: "20px", display: "flex", gap: "10px" }}>
        <button
          onClick={downloadPDF}
          style={{
            background: "#061b0e",
            color: "white",
            border: "none",
            padding: "12px 24px",
            borderRadius: "8px",
            cursor: "pointer",
            fontSize: "14px",
          }}
        >
          📄 Download / Print
        </button>
        <button
          onClick={sendEmail}
          style={{
            background: "#25d366",
            color: "white",
            border: "none",
            padding: "12px 24px",
            borderRadius: "8px",
            cursor: "pointer",
            fontSize: "14px",
          }}
        >
          📧 Email Invoice
        </button>
        <button
          onClick={() => window.history.back()}
          style={{
            background: "#6b7280",
            color: "white",
            border: "none",
            padding: "12px 24px",
            borderRadius: "8px",
            cursor: "pointer",
            fontSize: "14px",
          }}
        >
          ← Back
        </button>
      </div>

      {/* Invoice Container */}
      <div
        style={{
          background: "white",
          maxWidth: "800px",
          margin: "0 auto",
          padding: "40px",
          borderRadius: "12px",
          boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
        }}
      >
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "40px", borderBottom: "2px solid #061b0e", paddingBottom: "20px" }}>
          <div>
            <h1 style={{ margin: "0 0 8px 0", color: "#061b0e", fontSize: "28px" }}>INVOICE</h1>
            <p style={{ margin: "0", color: "#6b7280", fontSize: "14px" }}>Invoice #: {invoice.invoiceNumber}</p>
            <p style={{ margin: "0", color: "#6b7280", fontSize: "14px" }}>Booking ID: {invoice.bookingId}</p>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ marginBottom: "8px" }}>
              <img src="/images/navlogo.png" alt="Chello Yaku" style={{ height: "40px" }} />
            </div>
            <p style={{ margin: "0", color: "#6b7280", fontSize: "14px" }}>Date: {invoice.invoiceDate}</p>
            <p style={{ margin: "0", color: "#6b7280", fontSize: "14px" }}>Due: {invoice.dueDate}</p>
          </div>
        </div>

        {/* Addresses */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "40px", marginBottom: "40px" }}>
          <div>
            <h3 style={{ margin: "0 0 12px 0", color: "#061b0e", fontSize: "16px" }}>BILL TO:</h3>
            <p style={{ margin: "0 0 4px 0", fontWeight: "bold" }}>{invoice.guest.name}</p>
            <p style={{ margin: "0 0 4px 0", fontSize: "14px" }}>{invoice.guest.email}</p>
            <p style={{ margin: "0", fontSize: "14px" }}>{invoice.guest.phone}</p>
          </div>
          <div>
            <h3 style={{ margin: "0 0 12px 0", color: "#061b0e", fontSize: "16px" }}>FROM:</h3>
            <p style={{ margin: "0 0 4px 0", fontWeight: "bold" }}>{invoice.property.name}</p>
            <p style={{ margin: "0 0 4px 0", fontSize: "14px" }}>{invoice.property.address}</p>
            <p style={{ margin: "0 0 4px 0", fontSize: "14px" }}>{invoice.property.phone}</p>
            <p style={{ margin: "0 0 4px 0", fontSize: "14px" }}>{invoice.property.email}</p>
          </div>
        </div>

        {/* Booking Details */}
        <div style={{ marginBottom: "30px", background: "#f9f9f9", padding: "20px", borderRadius: "8px" }}>
          <h3 style={{ margin: "0 0 16px 0", color: "#061b0e", fontSize: "16px" }}>BOOKING DETAILS</h3>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "20px" }}>
            <div>
              <p style={{ margin: "0 0 4px 0", fontSize: "12px", color: "#6b7280" }}>Room</p>
              <p style={{ margin: "0", fontWeight: "bold" }}>{invoice.booking.roomName}</p>
              <p style={{ margin: "0", fontSize: "14px", color: "#6b7280" }}>{invoice.booking.roomType}</p>
            </div>
            <div>
              <p style={{ margin: "0 0 4px 0", fontSize: "12px", color: "#6b7280" }}>Check-in</p>
              <p style={{ margin: "0", fontWeight: "bold" }}>{invoice.booking.checkIn}</p>
              <p style={{ margin: "0", fontSize: "14px", color: "#6b7280" }}>2:00 PM</p>
            </div>
            <div>
              <p style={{ margin: "0 0 4px 0", fontSize: "12px", color: "#6b7280" }}>Check-out</p>
              <p style={{ margin: "0", fontWeight: "bold" }}>{invoice.booking.checkOut}</p>
              <p style={{ margin: "0", fontSize: "14px", color: "#6b7280" }}>11:00 AM</p>
            </div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "20px", marginTop: "16px" }}>
            <div>
              <p style={{ margin: "0 0 4px 0", fontSize: "12px", color: "#6b7280" }}>Nights</p>
              <p style={{ margin: "0", fontWeight: "bold" }}>{invoice.booking.nights} nights</p>
            </div>
            <div>
              <p style={{ margin: "0 0 4px 0", fontSize: "12px", color: "#6b7280" }}>Guests</p>
              <p style={{ margin: "0", fontWeight: "bold" }}>{invoice.booking.guests} guests</p>
            </div>
          </div>
        </div>

        {/* Pricing Table */}
        <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: "30px" }}>
          <thead>
            <tr style={{ background: "#061b0e", color: "white" }}>
              <th style={{ padding: "12px", textAlign: "left", fontSize: "14px" }}>Description</th>
              <th style={{ padding: "12px", textAlign: "right", fontSize: "14px" }}>Qty</th>
              <th style={{ padding: "12px", textAlign: "right", fontSize: "14px" }}>Rate</th>
              <th style={{ padding: "12px", textAlign: "right", fontSize: "14px" }}>Amount</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={{ padding: "12px", borderBottom: "1px solid #e5e7eb" }}>
                {invoice.booking.roomName} ({invoice.booking.nights} nights)
              </td>
              <td style={{ padding: "12px", textAlign: "right", borderBottom: "1px solid #e5e7eb" }}>
                {invoice.booking.nights}
              </td>
              <td style={{ padding: "12px", textAlign: "right", borderBottom: "1px solid #e5e7eb" }}>
                ₹{invoice.pricing.roomRate.toLocaleString()}
              </td>
              <td style={{ padding: "12px", textAlign: "right", borderBottom: "1px solid #e5e7eb" }}>
                ₹{invoice.pricing.roomTotal.toLocaleString()}
              </td>
            </tr>
            {invoice.pricing.pointsUsed > 0 && (
              <tr>
                <td style={{ padding: "12px", borderBottom: "1px solid #e5e7eb", color: "#059669" }}>
                  Loyalty Points Discount ({invoice.pricing.pointsUsed} points = ₹{(invoice.pricing.pointsUsed / 10).toLocaleString()})
                </td>
                <td style={{ padding: "12px", textAlign: "right", borderBottom: "1px solid #e5e7eb" }}>
                  {invoice.pricing.pointsUsed}
                </td>
                <td style={{ padding: "12px", textAlign: "right", borderBottom: "1px solid #e5e7eb" }}>
                  ₹0.10
                </td>
                <td style={{ padding: "12px", textAlign: "right", borderBottom: "1px solid #e5e7eb", color: "#059669" }}>
                  -₹{invoice.pricing.discount.toLocaleString()}
                </td>
              </tr>
            )}
          </tbody>
          <tfoot>
            <tr>
              <td colSpan={3} style={{ padding: "12px", textAlign: "right", fontWeight: "bold" }}>
                Subtotal
              </td>
              <td style={{ padding: "12px", textAlign: "right", fontWeight: "bold" }}>
                ₹{invoice.pricing.subtotal.toLocaleString()}
              </td>
            </tr>
            <tr style={{ background: "#f3f4f6", fontWeight: "bold" }}>
              <td colSpan={3} style={{ padding: "16px 12px", textAlign: "right", fontSize: "16px" }}>
                TOTAL
              </td>
              <td style={{ padding: "16px 12px", textAlign: "right", fontSize: "16px", color: "#061b0e" }}>
                ₹{invoice.pricing.total.toLocaleString()}
              </td>
            </tr>
            <tr>
              <td colSpan={3} style={{ padding: "12px", textAlign: "right" }}>
                {invoice.payment.payAtHotel ? "Due Amount (Pay at Hotel)" : "Amount Paid"}
              </td>
              <td style={{ padding: "12px", textAlign: "right", color: "#059669" }}>
                -₹{invoice.pricing.dueAmount > 0 ? invoice.pricing.dueAmount.toLocaleString() : invoice.pricing.amountPaid.toLocaleString()}
              </td>
            </tr>
            {invoice.pricing.dueAmount > 0 && (
              <tr style={{ background: "#fef2f2" }}>
                <td colSpan={3} style={{ padding: "12px", textAlign: "right", fontWeight: "bold", color: "#dc2626" }}>
                  Due Amount (Pay at Hotel)
                </td>
                <td style={{ padding: "12px", textAlign: "right", fontWeight: "bold", color: "#dc2626" }}>
                  ₹{invoice.pricing.dueAmount.toLocaleString()}
                </td>
              </tr>
            )}
          </tfoot>
        </table>

        {/* Payment Details */}
        <div style={{ marginBottom: "30px", background: "#f0fdf4", padding: "20px", borderRadius: "8px" }}>
          <h3 style={{ margin: "0 0 12px 0", color: "#065f46", fontSize: "16px" }}>PAYMENT DETAILS</h3>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "20px" }}>
            <div>
              <p style={{ margin: "0 0 4px 0", fontSize: "12px", color: "#6b7280" }}>Payment Method</p>
              <p style={{ margin: "0", fontWeight: "bold" }}>
                {invoice.payment.method === "hotel" ? "Pay at Hotel" : invoice.payment.method}
              </p>
            </div>
            <div>
              <p style={{ margin: "0 0 4px 0", fontSize: "12px", color: "#6b7280" }}>Status</p>
              <p style={{ margin: "0", fontWeight: "bold", color: invoice.payment.status === "confirmed" ? "#059669" : "#d97706" }}>
                {invoice.payment.status.charAt(0).toUpperCase() + invoice.payment.status.slice(1)}
              </p>
            </div>
            <div>
              <p style={{ margin: "0 0 4px 0", fontSize: "12px", color: "#6b7280" }}>Transaction ID</p>
              <p style={{ margin: "0", fontSize: "14px" }}>{invoice.payment.transactionId}</p>
            </div>
            <div>
              <p style={{ margin: "0 0 4px 0", fontSize: "12px", color: "#6b7280" }}>Paid On</p>
              <p style={{ margin: "0", fontSize: "14px" }}>{invoice.payment.paidAt}</p>
            </div>
          </div>
        </div>

        {/* Terms */}
        <div style={{ marginBottom: "20px" }}>
          <h3 style={{ margin: "0 0 12px 0", color: "#061b0e", fontSize: "16px" }}>TERMS & CONDITIONS</h3>
          <ul style={{ margin: "0", paddingLeft: "20px" }}>
            {invoice.terms.map((term, index) => (
              <li key={index} style={{ marginBottom: "4px", fontSize: "14px", color: "#6b7280" }}>
                {term}
              </li>
            ))}
          </ul>
        </div>

        {/* Footer */}
        <div style={{ textAlign: "center", paddingTop: "20px", borderTop: "1px solid #e5e7eb" }}>
          <p style={{ margin: "0", color: "#6b7280", fontSize: "14px" }}>
            Thank you for choosing {invoice.property.name}!
          </p>
          <p style={{ margin: "4px 0 0", color: "#6b7280", fontSize: "12px" }}>
            For any queries, contact us at {invoice.property.email} or {invoice.property.phone}
          </p>
        </div>
      </div>
    </div>
  );
}
