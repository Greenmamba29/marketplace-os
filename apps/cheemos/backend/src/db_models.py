"""SQLAlchemy ORM models for Neon DB (PostgreSQL).

Neon stores: users, sessions, orders, rfq_submissions, rfq_items,
             quotes, quote_items, payments, audit_log.

Baserow continues to serve the chemical catalog, compliance registry,
market intelligence, and supplier graph.
"""

import uuid
from datetime import datetime
from typing import Optional

from sqlalchemy import (
    Boolean,
    CheckConstraint,
    DateTime,
    Float,
    ForeignKey,
    Index,
    Integer,
    Numeric,
    String,
    Text,
)
from sqlalchemy.dialects.postgresql import JSONB, UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.sql import func

from src.database import Base


def _uuid():
    return str(uuid.uuid4())


# ---------------------------------------------------------------------------
# Users
# ---------------------------------------------------------------------------

class DBUser(Base):
    __tablename__ = "users"

    id: Mapped[str] = mapped_column(
        UUID(as_uuid=False), primary_key=True, default=_uuid
    )
    email: Mapped[str] = mapped_column(String(255), unique=True, nullable=False, index=True)
    hashed_password: Mapped[str] = mapped_column(String(255), nullable=False)
    first_name: Mapped[str] = mapped_column(String(100), nullable=False)
    last_name: Mapped[str] = mapped_column(String(100), nullable=False)
    company_name: Mapped[str] = mapped_column(String(200), nullable=False)
    role: Mapped[str] = mapped_column(
        String(20), nullable=False, default="buyer",
        server_default="buyer"
    )
    phone: Mapped[Optional[str]] = mapped_column(String(50))
    avatar_url: Mapped[Optional[str]] = mapped_column(String(500))
    stripe_customer_id: Mapped[Optional[str]] = mapped_column(String(100), index=True)
    is_verified: Mapped[bool] = mapped_column(Boolean, default=False, server_default="false")
    is_active: Mapped[bool] = mapped_column(Boolean, default=True, server_default="true")
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), onupdate=func.now()
    )
    last_login: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True))

    rfq_submissions = relationship("DBRFQSubmission", back_populates="buyer", lazy="select")
    orders = relationship("DBOrder", back_populates="buyer", lazy="select")

    __table_args__ = (
        CheckConstraint("role IN ('buyer','supplier','admin')", name="ck_user_role"),
    )


# ---------------------------------------------------------------------------
# RFQ
# ---------------------------------------------------------------------------

class DBRFQSubmission(Base):
    __tablename__ = "rfq_submissions"

    id: Mapped[str] = mapped_column(UUID(as_uuid=False), primary_key=True, default=_uuid)
    buyer_id: Mapped[str] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"), index=True)
    title: Mapped[str] = mapped_column(String(300), nullable=False)
    description: Mapped[Optional[str]] = mapped_column(Text)
    status: Mapped[str] = mapped_column(String(30), nullable=False, default="submitted")
    delivery_location_city: Mapped[Optional[str]] = mapped_column(String(100))
    delivery_location_country: Mapped[Optional[str]] = mapped_column(String(100))
    delivery_date: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True))
    incoterms: Mapped[Optional[str]] = mapped_column(String(10))
    payment_terms: Mapped[Optional[str]] = mapped_column(String(20))
    additional_requirements: Mapped[Optional[str]] = mapped_column(Text)
    quotes_received: Mapped[int] = mapped_column(Integer, default=0, server_default="0")
    expires_at: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True))
    accio_analysis: Mapped[Optional[dict]] = mapped_column(JSONB)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), onupdate=func.now()
    )

    buyer = relationship("DBUser", back_populates="rfq_submissions")
    items = relationship("DBRFQItem", back_populates="rfq", cascade="all, delete-orphan")
    quotes = relationship("DBQuote", back_populates="rfq", lazy="select")

    __table_args__ = (
        CheckConstraint(
            "status IN ('draft','submitted','sourcing','quoted','accepted','rejected','expired')",
            name="ck_rfq_status",
        ),
        Index("ix_rfq_status_created", "status", "created_at"),
    )


class DBRFQItem(Base):
    __tablename__ = "rfq_items"

    id: Mapped[str] = mapped_column(UUID(as_uuid=False), primary_key=True, default=_uuid)
    rfq_id: Mapped[str] = mapped_column(ForeignKey("rfq_submissions.id", ondelete="CASCADE"), index=True)
    cas_number: Mapped[Optional[str]] = mapped_column(String(20), index=True)
    chemical_name: Mapped[str] = mapped_column(String(300), nullable=False)
    quantity: Mapped[float] = mapped_column(Numeric(14, 4), nullable=False)
    unit: Mapped[str] = mapped_column(String(10), nullable=False, default="kg")
    grade: Mapped[Optional[str]] = mapped_column(String(30))
    min_purity: Mapped[Optional[float]] = mapped_column(Numeric(5, 2))
    packaging: Mapped[Optional[str]] = mapped_column(String(100))
    special_requirements: Mapped[Optional[str]] = mapped_column(Text)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())

    rfq = relationship("DBRFQSubmission", back_populates="items")


# ---------------------------------------------------------------------------
# Quotes
# ---------------------------------------------------------------------------

class DBQuote(Base):
    __tablename__ = "quotes"

    id: Mapped[str] = mapped_column(UUID(as_uuid=False), primary_key=True, default=_uuid)
    rfq_id: Mapped[str] = mapped_column(ForeignKey("rfq_submissions.id", ondelete="CASCADE"), index=True)
    supplier_baserow_id: Mapped[Optional[str]] = mapped_column(String(50))
    supplier_name: Mapped[str] = mapped_column(String(200), nullable=False)
    status: Mapped[str] = mapped_column(String(20), nullable=False, default="pending")
    total_amount: Mapped[float] = mapped_column(Numeric(14, 2), nullable=False)
    currency: Mapped[str] = mapped_column(String(3), nullable=False, default="USD")
    unit_price: Mapped[Optional[float]] = mapped_column(Numeric(12, 4))
    delivery_lead_days: Mapped[Optional[int]] = mapped_column(Integer)
    incoterms: Mapped[Optional[str]] = mapped_column(String(10))
    payment_terms: Mapped[Optional[str]] = mapped_column(String(20))
    validity_days: Mapped[int] = mapped_column(Integer, default=30)
    notes: Mapped[Optional[str]] = mapped_column(Text)
    platform_margin_pct: Mapped[float] = mapped_column(Numeric(5, 2), default=20.0)
    supplier_cost: Mapped[Optional[float]] = mapped_column(Numeric(14, 2))
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
    accepted_at: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True))

    rfq = relationship("DBRFQSubmission", back_populates="quotes")
    items = relationship("DBQuoteItem", back_populates="quote", cascade="all, delete-orphan")
    order = relationship("DBOrder", back_populates="quote", uselist=False)

    __table_args__ = (
        CheckConstraint(
            "status IN ('pending','sent','accepted','rejected','expired')",
            name="ck_quote_status",
        ),
    )


class DBQuoteItem(Base):
    __tablename__ = "quote_items"

    id: Mapped[str] = mapped_column(UUID(as_uuid=False), primary_key=True, default=_uuid)
    quote_id: Mapped[str] = mapped_column(ForeignKey("quotes.id", ondelete="CASCADE"), index=True)
    rfq_item_id: Mapped[Optional[str]] = mapped_column(ForeignKey("rfq_items.id"))
    chemical_name: Mapped[str] = mapped_column(String(300), nullable=False)
    cas_number: Mapped[Optional[str]] = mapped_column(String(20))
    quantity: Mapped[float] = mapped_column(Numeric(14, 4), nullable=False)
    unit: Mapped[str] = mapped_column(String(10), nullable=False, default="kg")
    unit_price: Mapped[float] = mapped_column(Numeric(12, 4), nullable=False)
    total_price: Mapped[float] = mapped_column(Numeric(14, 2), nullable=False)
    currency: Mapped[str] = mapped_column(String(3), nullable=False, default="USD")

    quote = relationship("DBQuote", back_populates="items")


# ---------------------------------------------------------------------------
# Orders
# ---------------------------------------------------------------------------

class DBOrder(Base):
    __tablename__ = "orders"

    id: Mapped[str] = mapped_column(UUID(as_uuid=False), primary_key=True, default=_uuid)
    quote_id: Mapped[str] = mapped_column(ForeignKey("quotes.id"), unique=True, index=True)
    buyer_id: Mapped[str] = mapped_column(ForeignKey("users.id"), index=True)
    supplier_baserow_id: Mapped[Optional[str]] = mapped_column(String(50))
    supplier_name: Mapped[str] = mapped_column(String(200), nullable=False)
    status: Mapped[str] = mapped_column(String(30), nullable=False, default="pending_payment")
    total_amount: Mapped[float] = mapped_column(Numeric(14, 2), nullable=False)
    supplier_cost: Mapped[Optional[float]] = mapped_column(Numeric(14, 2))
    platform_revenue: Mapped[Optional[float]] = mapped_column(Numeric(14, 2))
    currency: Mapped[str] = mapped_column(String(3), nullable=False, default="USD")
    payment_status: Mapped[str] = mapped_column(String(20), nullable=False, default="unpaid")
    stripe_payment_intent_id: Mapped[Optional[str]] = mapped_column(String(100), index=True)
    paid_at: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True))
    shipped_at: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True))
    delivered_at: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True))
    tracking_number: Mapped[Optional[str]] = mapped_column(String(100))
    notes: Mapped[Optional[str]] = mapped_column(Text)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), onupdate=func.now()
    )

    buyer = relationship("DBUser", back_populates="orders")
    quote = relationship("DBQuote", back_populates="order")
    payments = relationship("DBPayment", back_populates="order", lazy="select")

    __table_args__ = (
        CheckConstraint(
            "status IN ('pending_payment','payment_received','processing','shipped','delivered','cancelled','refunded')",
            name="ck_order_status",
        ),
        CheckConstraint(
            "payment_status IN ('unpaid','processing','paid','failed','refunded')",
            name="ck_order_payment_status",
        ),
        Index("ix_order_buyer_status", "buyer_id", "status"),
    )


# ---------------------------------------------------------------------------
# Payments
# ---------------------------------------------------------------------------

class DBPayment(Base):
    __tablename__ = "payments"

    id: Mapped[str] = mapped_column(UUID(as_uuid=False), primary_key=True, default=_uuid)
    order_id: Mapped[str] = mapped_column(ForeignKey("orders.id", ondelete="CASCADE"), index=True)
    stripe_payment_intent_id: Mapped[str] = mapped_column(String(100), unique=True, index=True)
    stripe_charge_id: Mapped[Optional[str]] = mapped_column(String(100))
    amount: Mapped[float] = mapped_column(Numeric(14, 2), nullable=False)
    currency: Mapped[str] = mapped_column(String(3), nullable=False, default="USD")
    status: Mapped[str] = mapped_column(String(20), nullable=False)
    failure_message: Mapped[Optional[str]] = mapped_column(Text)
    stripe_metadata: Mapped[Optional[dict]] = mapped_column(JSONB)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), onupdate=func.now()
    )

    order = relationship("DBOrder", back_populates="payments")


# ---------------------------------------------------------------------------
# Compliance cache (replicate hot compliance data from Baserow → Neon for speed)
# ---------------------------------------------------------------------------

class DBComplianceCache(Base):
    __tablename__ = "compliance_cache"

    cas_number: Mapped[str] = mapped_column(String(20), primary_key=True)
    chemical_name: Mapped[Optional[str]] = mapped_column(String(300))
    reach_status: Mapped[Optional[str]] = mapped_column(String(30))
    tsca_status: Mapped[Optional[str]] = mapped_column(String(30))
    epa_status: Mapped[Optional[str]] = mapped_column(String(30))
    uk_hse_status: Mapped[Optional[str]] = mapped_column(String(30))
    china_mee_status: Mapped[Optional[str]] = mapped_column(String(30))
    compliance_data: Mapped[Optional[dict]] = mapped_column(JSONB)
    cached_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
    expires_at: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True))


# ---------------------------------------------------------------------------
# Audit log (append-only)
# ---------------------------------------------------------------------------

class DBAuditLog(Base):
    __tablename__ = "audit_log"

    id: Mapped[str] = mapped_column(UUID(as_uuid=False), primary_key=True, default=_uuid)
    actor_id: Mapped[Optional[str]] = mapped_column(String(50))
    actor_email: Mapped[Optional[str]] = mapped_column(String(255))
    action: Mapped[str] = mapped_column(String(100), nullable=False, index=True)
    entity_type: Mapped[Optional[str]] = mapped_column(String(50), index=True)
    entity_id: Mapped[Optional[str]] = mapped_column(String(50))
    payload: Mapped[Optional[dict]] = mapped_column(JSONB)
    ip_address: Mapped[Optional[str]] = mapped_column(String(45))
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), index=True
    )

    __table_args__ = (
        Index("ix_audit_entity", "entity_type", "entity_id"),
    )
