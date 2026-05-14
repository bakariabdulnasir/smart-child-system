from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import smtplib
from app.config.config import Config


def send_password_reset_email(email, reset_token):
    """
    Send a password reset email to the user.
    
    Args:
        email: The recipient's email address
        reset_token: The password reset token
        
    Returns:
        True if email sent successfully, False otherwise
    """
    try:
        # Create message
        msg = MIMEMultipart("alternative")
        msg["From"] = Config.EMAIL_USERNAME
        msg["To"] = email
        msg["Subject"] = "Password Reset Request"
        
        # Create the HTML and plain text versions of the message
        reset_url = f"{Config.FRONTEND_URL}/reset-password?token={reset_token}"
        
        text_body = f"""
        You requested a password reset for your account.
        
        Please click the following link to reset your password:
        {reset_url}
        
        This link will expire in 30 minutes.
        
        If you did not request this, please ignore this email.
        """
        
        html_body = f"""
        <html>
            <body>
                <h2>Password Reset Request</h2>
                <p>You requested a password reset for your account.</p>
                <p>Please click the following link to reset your password:</p>
                <p><a href="{reset_url}">Reset Password</a></p>
                <p>This link will expire in 30 minutes.</p>
                <p>If you did not request this, please ignore this email.</p>
            </body>
</html>
        """
        
        # Attach parts
        part1 = MIMEText(text_body, "plain")
        part2 = MIMEText(html_body, "html")

        msg.attach(part1)
        msg.attach(part2)

        # Send email
        with smtplib.SMTP(Config.EMAIL_HOST, Config.EMAIL_PORT) as server:
            server.starttls()
            server.login(Config.EMAIL_USERNAME, Config.EMAIL_PASSWORD)
            server.sendmail(
                Config.EMAIL_USERNAME,
                email,
                msg.as_string()
            )
        
        return True
        
    except Exception as e:
        print(f"Error sending email: {str(e)}")
        return False


def send_email(subject, body, to_email):
    """
    Send a generic email.
    
    Args:
        subject: The email subject
        body: The email body
        to_email: The recipient's email address
        
    Returns:
        True if email sent successfully, False otherwise
    """
    try:
        msg = MIMEMultipart()
        msg["From"] = Config.EMAIL_USERNAME
        msg["To"] = to_email
        msg["Subject"] = subject
        
        msg.attach(MIMEText(body, "plain"))
        
        with smtplib.SMTP(Config.EMAIL_HOST, Config.EMAIL_PORT) as server:
            server.starttls()
            server.login(Config.EMAIL_USERNAME, Config.EMAIL_PASSWORD)
            server.sendmail(
                Config.EMAIL_USERNAME,
                to_email,
                msg.as_string()
            )
        
        return True
        
    except Exception as e:
        print(f"Error sending email: {str(e)}")
        return False
