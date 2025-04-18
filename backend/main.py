from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.routes.patients import router as patients_router
from app.api.routes.treatments import router as treatments_router

app = FastAPI(title="Oncology AI Assistant")

# Configuring CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

# Inclue our routers
app.include_router(patients_router, prefix="/patients", tags=["patients"])
app.include_router(treatments_router, prefix="/treatments", tags=["treatments"])

@app.get('/')
async def root():
    return {"message": "Hello World"}



