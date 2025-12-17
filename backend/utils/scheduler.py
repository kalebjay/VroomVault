import os
from datetime import datetime, timedelta
from fastapi_mail import FastMail, MessageSchema, ConnectionConfig
from dotenv import load_dotenv
from sqlalchemy.orm import Session
from db.database import SessionLocal
from db.models import DbVehicle

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

def check_upcoming_expirations():
    """
    Checks for vehicles with registration or safety inspections expiring soon
    and sends email notifications to the owners.
    """
    print("Scheduler running: Checking for upcoming expirations...")
    db: Session = SessionLocal()
    try:
        # Define the notification window (e.g., 30 days from now)
        notification_window = datetime.utcnow() + timedelta(days=30)

        # Find vehicles with upcoming expirations
        vehicles_to_notify = db.query(DbVehicle).filter(
            (DbVehicle.exp_registration <= notification_window) |
            (DbVehicle.exp_safety <= notification_window)
        ).all()

        for vehicle in vehicles_to_notify:
            owner = vehicle.owner
            if owner and owner.email:
                # This is a synchronous function, so we can't await here.
                # The email sending will be handled by the event loop managed by the scheduler.
                # For a more robust solution, you'd use a background task runner like Celery.
                subject = f"Upcoming Expiration for Your {vehicle.make} {vehicle.model}"
                body = f"<p>Hi {owner.username},</p><p>This is a friendly reminder that your {vehicle.year} {vehicle.make} {vehicle.model} has an upcoming expiration:</p>"
                if vehicle.exp_registration and vehicle.exp_registration <= notification_window:
                    body += f"<p>- Registration expires on: {vehicle.exp_registration.strftime('%Y-%m-%d')}</p>"
                if vehicle.exp_safety and vehicle.exp_safety <= notification_window:
                    body += f"<p>- Safety inspection expires on: {vehicle.exp_safety.strftime('%Y-%m-%d')}</p>"
                body += "<p>Please take the necessary actions soon.</p><p>Thanks,<br>The VroomVault Team</p>"
                
                # In a real app, you would run this async task in the event loop
                # For simplicity with APScheduler's blocking scheduler, we'll call it from an async context in main.py
                # This function will just prepare the data. The actual sending will be orchestrated from main.py
                # For now, we just print. The actual sending will be hooked up in main.py
                print(f"Found expiring vehicle for {owner.email}: {vehicle.make} {vehicle.model}")
    finally:
        db.close()
