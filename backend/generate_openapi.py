import json
from app.main import app
from fastapi.openapi.utils import get_openapi

def generate_openapi():
    openapi_schema = get_openapi(
        title=app.title,
        version=app.version,
        openapi_version=app.openapi_version,
        description=app.description,
        routes=app.routes,
    )
    with open("docs/complete-suite/openapi.json", "w") as f:
        json.dump(openapi_schema, f, indent=2)
    print("OpenAPI JSON generated at docs/complete-suite/openapi.json")

if __name__ == "__main__":
    generate_openapi()
