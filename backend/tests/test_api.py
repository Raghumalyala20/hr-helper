import pytest
from httpx import AsyncClient, ASGITransport
from main import app


@pytest.fixture
def anyio_backend():
    return "asyncio"


@pytest.fixture
async def client():
    """Async test client for FastAPI app"""
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        yield ac


class TestHealthEndpoints:
    """Tests for health check endpoints"""

    async def test_root_endpoint(self, client: AsyncClient):
        """Test the root endpoint returns API info"""
        response = await client.get("/")
        assert response.status_code == 200
        data = response.json()
        assert data["message"] == "HR Helper API"
        assert data["version"] == "1.0.0"
        assert data["docs"] == "/docs"

    async def test_health_check(self, client: AsyncClient):
        """Test health check endpoint"""
        response = await client.get("/health")
        assert response.status_code == 200
        assert response.json() == {"status": "healthy"}


class TestJDGeneratorEndpoints:
    """Tests for JD Generator endpoints"""

    async def test_generate_jd_missing_fields(self, client: AsyncClient):
        """Test JD generation fails with missing required fields"""
        response = await client.post("/api/jd/generate", json={})
        assert response.status_code == 422  # Validation error

    async def test_generate_jd_valid_request(self, client: AsyncClient):
        """Test JD generation with valid request (mocked)"""
        # Note: This test will actually call Gemini API if not mocked
        # In a real test suite, we would mock the gemini_client
        pass


class TestCVScreenerEndpoints:
    """Tests for CV Screener endpoints"""

    async def test_screen_cv_no_file(self, client: AsyncClient):
        """Test CV screening fails without file"""
        response = await client.post("/api/cv/screen", data={"jd_text": "test"})
        assert response.status_code == 422  # Missing file


class TestTechQuizEndpoints:
    """Tests for Tech Quiz endpoints"""

    async def test_generate_quiz_missing_fields(self, client: AsyncClient):
        """Test quiz generation fails with missing fields"""
        response = await client.post("/api/quiz/generate", json={})
        assert response.status_code == 422

    async def test_evaluate_quiz_missing_fields(self, client: AsyncClient):
        """Test quiz evaluation fails with missing fields"""
        response = await client.post("/api/quiz/evaluate", json={})
        assert response.status_code == 422


class TestLiveInterviewEndpoints:
    """Tests for Live Interview endpoints"""

    async def test_analyze_audio_no_file(self, client: AsyncClient):
        """Test audio analysis fails without file"""
        response = await client.post("/api/interview/analyze-audio")
        assert response.status_code == 422  # Missing file
