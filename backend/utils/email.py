# from sendgrid import SendGridAPIClient
# from sendgrid.helpers.mail import Mail
# from flask import current_app

# def send_lending_email(borrower, lending):
#     message = Mail(
#         from_email=current_app.config["SENDGRID_SENDER_EMAIL"],
#         to_emails=borrower.email,
#         subject=f"Lending Notification: {lending.amount} lent to {borrower.name}",
#         html_content=f"""
#         <p>Dear {borrower.name},</p>
#         <p>You have been lent <b>{lending.amount}</b>.</p>
#         <p>Note: {lending.note or 'No note provided.'}</p>
#         <p>Date: {lending.date}</p>
#         """
#     )
#     message.add_cc(current_app.config["SENDGRID_SENDER_EMAIL"])
#     try:
#         sg = SendGridAPIClient(current_app.config["SENDGRID_API_KEY"])
#         sg.send(message)
#     except Exception as e:
#         print(f"SendGrid error: {e}")

import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from flask import current_app
import traceback

def send_mail(user_email, borrower_email, subject, body):
    sender_email = current_app.config['SMTP_SENDER_EMAIL']
    smtp_password = current_app.config['SMTP_PASSWORD']
    smtp_server = current_app.config.get('SMTP_SERVER', 'smtp.gmail.com')
    smtp_port = current_app.config.get('SMTP_PORT', 587)

    message = MIMEMultipart()
    message['From'] = str(sender_email)
    message['To'] = str(borrower_email)
    message['Subject'] = str(subject)
    message['Cc'] = str(user_email)

    message.attach(MIMEText(body, 'plain'))

    try:
        with smtplib.SMTP(smtp_server, smtp_port) as smtp:
            smtp.starttls()
            smtp.login(sender_email, smtp_password)
            smtp.sendmail(
                sender_email,
                [borrower_email, user_email],
                message.as_string()
            )
            print(f"Email sent to {borrower_email} with CC to {user_email}")
    except Exception as e:
        print(f"Failed to send email: {e}")
        traceback.print_exc()

def send_lending_email(borrower, lending, user_email):
    # sender_email = current_app.config['SMTP_SENDER_EMAIL']
    # smtp_password = current_app.config['SMTP_PASSWORD']
    # smtp_server = current_app.config.get('SMTP_SERVER', 'smtp.gmail.com')
    # smtp_port = current_app.config.get('SMTP_PORT', 587)

    subject = f"Lending Notification: {lending.amount} lent to {borrower.name}"

    body = f"""
    Dear {borrower.name},

    You have been lent Rs.{lending.amount}. 
    By: {user_email}.
    Note: {lending.note or 'No note provided.'}
    Date: {lending.date}

    Regards,
    Lending Tracker App
    """
    send_mail(user_email, borrower.email, subject, body)

    

def send_repayment_email(borrower, repayment, user_email):
    subject = f"Repayment Notification: {repayment.amount} repaid by {borrower.name}"

    body = f"""
    Dear {borrower.name},

    You have repaid Rs.{repayment.amount}.
    To: {user_email}.
    Note: {repayment.note or 'No note provided.'}
    Date: {repayment.date}

    Regards,
    Lending Tracker App
    """

    send_mail(user_email, borrower.email, subject, body)