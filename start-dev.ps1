# FE 서버 기동
Start-Process powershell -ArgumentList '-NoExit','-Command','cd FE; npm run dev'

# BE 서버 기동
Start-Process powershell -ArgumentList '-NoExit','-Command','cd BE; .\.venv\Scripts\Activate.ps1; uvicorn app.main:app --reload --reload-dir app'