from django.test import Client, TestCase


class CookieAuthFlowTest(TestCase):
    @classmethod
    def setUpTestData(cls):
        from users.user_related_models import User

        cls.user = User.objects.create_superuser(
            username="smoke", email="s@e.com", password="SmokePass123"
        )

    def test_full_cookie_auth_flow(self):
        c = Client()

        # 1. Login sets cookies, does NOT return raw tokens in body.
        resp = c.post(
            "/api/auth/login/",
            data='{"username":"smoke","password":"SmokePass123"}',
            content_type="application/json",
        )
        self.assertEqual(resp.status_code, 200, resp.content)
        body = resp.json()
        self.assertNotIn("access", body)
        self.assertNotIn("refresh", body)
        self.assertIn("user", body)
        self.assertEqual(body["user"]["username"], "smoke")
        self.assertIn("access_token", resp.cookies)
        self.assertIn("refresh_token", resp.cookies)
        self.assertTrue(resp.cookies["access_token"].value)
        self.assertTrue(resp.cookies["access_token"]["httponly"])

        # 2. Protected endpoint works with the cookie and NO Authorization header.
        me = c.get("/api/auth/me/")
        self.assertEqual(me.status_code, 200, me.content)
        self.assertEqual(me.json()["username"], "smoke")

        # 3. Refresh rotates the access cookie (cookie-only, no body).
        r = c.post("/api/auth/refresh/")
        self.assertEqual(r.status_code, 200, r.content)
        self.assertIn("access_token", r.cookies)
        self.assertTrue(r.cookies["access_token"].value)
        self.assertNotIn("access", r.json())

        # 4. Logout clears both cookies and blacklists the refresh token.
        #    (No access token required -- LogoutView is AllowAny.)
        lo = c.post("/api/auth/logout/")
        self.assertEqual(lo.status_code, 200, lo.content)
        self.assertEqual(lo.cookies["access_token"].value, "")
        self.assertEqual(lo.cookies["refresh_token"].value, "")

        # 5. Protected endpoint now returns 401.
        me2 = c.get("/api/auth/me/")
        self.assertEqual(me2.status_code, 401, me2.content)

    def test_protected_without_cookie_is_401(self):
        c = Client()
        me = c.get("/api/auth/me/")
        self.assertEqual(me.status_code, 401)

    def test_logout_without_access_token_still_succeeds(self):
        """
        Logout must work even when no access_token cookie is present (e.g.
        the short-lived access token has expired but the refresh token is
        still in the cookie).
        """
        # Login to get the refresh token cookie only.
        c = Client()
        resp = c.post(
            "/api/auth/login/",
            data='{"username":"smoke","password":"SmokePass123"}',
            content_type="application/json",
        )
        self.assertEqual(resp.status_code, 200)
        # Simulate an expired access token by building a new client that
        # only has the refresh cookie set (no access cookie).
        c2 = Client()
        c2.cookies["refresh_token"] = resp.cookies["refresh_token"].value
        lo = c2.post("/api/auth/logout/")
        self.assertEqual(lo.status_code, 200, lo.content)
        self.assertEqual(lo.cookies["access_token"].value, "")
        self.assertEqual(lo.cookies["refresh_token"].value, "")

    def test_bearer_header_still_works_for_swagger(self):
        # Login to get a token, then use it via Authorization header on a fresh client.
        c1 = Client()
        resp = c1.post(
            "/api/auth/login/",
            data='{"username":"smoke","password":"SmokePass123"}',
            content_type="application/json",
        )
        access = resp.cookies["access_token"].value
        c2 = Client()
        me = c2.get(
            "/api/auth/me/",
            HTTP_AUTHORIZATION=f"Bearer {access}",
        )
        self.assertEqual(me.status_code, 200, me.content)
