from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from test import run_test

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class BacktestRequest(BaseModel):
    decision_time: str
    slice_minutes: int = 60

@app.get("/evaluate")
def evaluate(
    slice_start: str,
    slice_end: str,
    symbol: str = "VOO"
):
    try:
        return run_test(
            slice_start,
            slice_end,
            symbol
        )
    except Exception as error:
        raise HTTPException(
            status_code=400,
            detail=str(error)
        )

@app.post("/backtest")
def backtest(request: BacktestRequest):
    try:
        return run_test(request.decision_time, request.slice_minutes)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))