# SecureBanking

SecureBanking is a simple prototype banking platform that uses:
- **Keystroke authentication** (based on typing patterns)
- **Forest-based decision tree models** for anomaly detection
- **Zero Trust** security checks
- **Kaldi + Vosk** for optional voice authentication

---

## 1. Requirements

- Node.js 16+  
- Python 3.10+  
- npm  
- SQLite3  
- Kaldi + Vosk server (for speech)

---

## 2. Database

This project uses **SQLite3** for simplicity.  
No separate database server is needed — it just stores data in a file.

In `.env` file, set:
```
DATABASE_URL=sqlite:///securebanking.db
```
## 3. Kaldi + Vosk Server Setup

Vosk server provides speech-to-text using Kaldi in the backend.

### 4. Run Vosk server
```
docker run -d -p 2700:2700 alphacep/kaldi-en:latest
```
### 5. Test the vosk server as it's crucial for user verification
```
curl -X POST --data-binary @test.wav -H "Content-Type: audio/wav" http://localhost:2700
```

### 6. Install dependencies and then run 

```
npm install
npm run dev
```
