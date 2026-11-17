from django.test import TestCase, Client
from django.core.management import call_command


class EduApiTestCase(TestCase):
    @classmethod
    def setUpTestData(cls):
        call_command("seed_data")

    def setUp(self):
        self.client = Client()

    def test_api_root(self):
        resp = self.client.get("/api/")
        self.assertEqual(resp.status_code, 200)
        data = resp.json()
        self.assertEqual(data["status"], "online")
        self.assertIn("institutions", data["endpoints"])

    def test_health_check(self):
        resp = self.client.get("/api/health/")
        self.assertEqual(resp.status_code, 200)
        self.assertEqual(resp.json()["status"], "healthy")

    def test_institutions_endpoint(self):
        resp = self.client.get("/api/institutions/")
        self.assertEqual(resp.status_code, 200)
        results = resp.json()
        items = results.get("results", []) if isinstance(results, dict) else results
        ids = [item["id"] for item in items]
        self.assertIn("college", ids)
        self.assertIn("school", ids)

    def test_notices_endpoint(self):
        resp = self.client.get("/api/notices/?institution=college")
        self.assertEqual(resp.status_code, 200)

    def test_departments_endpoint(self):
        resp = self.client.get("/api/departments/")
        self.assertEqual(resp.status_code, 200)

    def test_auth_personas(self):
        resp = self.client.get("/api/auth/personas/")
        self.assertEqual(resp.status_code, 200)
        data = resp.json()
        self.assertTrue(len(data) >= 1)

    def test_auth_login(self):
        resp = self.client.post("/api/auth/login/", {"user_id": "user-college-principal"}, content_type="application/json")
        self.assertEqual(resp.status_code, 200)
        self.assertEqual(resp.json()["user"]["role"], "college_principal")
