from django.contrib.auth.backends import ModelBackend
from users.user_related_models import User, AccessCode

class AccessCodeAuthenticationBackend(ModelBackend):
    def authenticate(self, request, username=None, password=None, access_code=None, **kwargs):
        try:
            user = User.objects.get(username=username)
            if user.check_password(password) and user.access_code == access_code:
                code = AccessCode.objects.get(code=access_code)
                if code.active:
                    # Mark the access code as used
                    code.active = False
                    code.save()
                    return user
        except (User.DoesNotExist, AccessCode.DoesNotExist):
            return None
        return None
