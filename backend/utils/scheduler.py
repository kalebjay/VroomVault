import os
import asyncio
from datetime import datetime, timedelta, timezone
from fastapi_mail import FastMail, MessageSchema, ConnectionConfig
from dotenv import load_dotenv
from sqlalchemy.orm import Session
from db.database import SessionLocal
from db.models import DbVehicle, DbUser # DbUser is already imported, which is good.

load_dotenv()

# Email Configuration
conf = ConnectionConfig(
    MAIL_USERNAME=os.getenv("MAIL_USERNAME"),
    MAIL_PASSWORD=os.getenv("MAIL_PASSWORD"),
    MAIL_FROM=os.getenv("MAIL_FROM"),
    MAIL_PORT=int(os.getenv("MAIL_PORT")),
    MAIL_SERVER=os.getenv("MAIL_SERVER"),
    MAIL_STARTTLS=os.getenv("MAIL_STARTTLS").lower() == 'true',
    MAIL_SSL_TLS=os.getenv("MAIL_SSL_TLS").lower() == 'true',
    USE_CREDENTIALS=True,
    VALIDATE_CERTS=True
)

async def send_notification_email(recipient_email: str, subject: str, body: str):
    """Sends a single notification email."""
    message = MessageSchema(
        subject=subject,
        recipients=[recipient_email],
        body=body,
        subtype="html"
    )
    fm = FastMail(conf)
    await fm.send_message(message)
    print(f"Notification sent to {recipient_email}")

def get_expiring_vehicles_from_db():
    """
    Synchronous function to fetch expiring vehicles from the database.
    This is designed to be run in a separate thread to avoid blocking asyncio.
    """
    db: Session = SessionLocal()
    notifications = []
    try:
        now = datetime.now(timezone.utc)
        all_users = db.query(DbUser).all()

        for user in all_users:
            if not user.email:
                continue

            # 1. Check for upcoming expirations
            notification_window = now + timedelta(days=user.notification_days_advance)
            upcoming_vehicles = db.query(DbVehicle).filter(
                DbVehicle.owner_id == user.id,
                (DbVehicle.exp_registration.between(now, notification_window)) |
                (DbVehicle.exp_safety.between(now, notification_window))
            ).all()

            for vehicle in upcoming_vehicles:
                subject = f"Upcoming Expiration for Your {vehicle.make} {vehicle.model}"
                body = f"<p>Hi {user.username},</p><p>This is a friendly reminder that your {vehicle.year} {vehicle.make} {vehicle.model} has an upcoming expiration:</p>"
                if vehicle.exp_registration and vehicle.exp_registration <= notification_window:
                    body += f"<p>- Registration expires on: {vehicle.exp_registration.strftime('%Y-%m-%d')}</p>"
                if vehicle.exp_safety and vehicle.exp_safety <= notification_window:
                    body += f"<p>- Safety inspection expires on: {vehicle.exp_safety.strftime('%Y-%m-%d')}</p>"
                body += "<p>Please take the necessary actions soon.</p><p>Thanks,<br>The VroomVault Team</p>"
                notifications.append({'recipient_email': user.email, 'subject': subject, 'body': body})

            # 2. Check for past-due reminders
            if user.notification_frequency != 'never':
                # daily runs every day, weekly on Sundays, monthly on the 1st.
                is_weekly_day = (now.weekday() == 6) # Sunday
                is_monthly_day = (now.day == 1)

                if user.notification_frequency == 'daily' or \
                   (user.notification_frequency == 'weekly' and is_weekly_day) or \
                   (user.notification_frequency == 'monthly' and is_monthly_day):
                    
                    # This part is left as a suggestion as it requires more logic
                    # to avoid spamming users. You would query for past-due vehicles
                    # and check when the last notification was sent.
                    pass

        return notifications
    finally:
        db.close()

async def check_upcoming_expirations():
    """
    Asynchronous task to check for expirations and send emails.
    It runs the blocking DB query in a thread pool.
    """
    print(f"Scheduler running at {datetime.now()}: Checking for upcoming expirations...")
    notifications_to_send = await asyncio.to_thread(get_expiring_vehicles_from_db)

    for notification in notifications_to_send:
        await send_notification_email(**notification)
