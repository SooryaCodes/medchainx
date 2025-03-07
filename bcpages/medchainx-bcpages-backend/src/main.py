from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from src.routes import router as api_router

app = FastAPI()

# CORS middleware to allow cross-origin requests
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Adjust this to your needs
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include the API routes
app.include_router(api_router)

@app.get("/")
def read_root():
    return {"message": "Welcome to the MedChain X API"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)