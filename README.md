# SecureBank

SecureBank is a simple prototype banking platform that uses:
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
DATABASE_URL=sqlite:///SecureBank.db
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

### 7. Sample screenshots
#### Basic Banking app screenshots
<img width="1907" height="951" alt="image" src="https://github.com/user-attachments/assets/26328ff3-af6e-499d-8d98-f034ac0b3879" />

#### Anomaly Detection
<img width="1917" height="968" alt="image" src="https://github.com/user-attachments/assets/427cf2f8-ae29-46dd-aaaf-d9f8df183d1f" />
<img width="1918" height="897" alt="image" src="https://github.com/user-attachments/assets/77c802f7-f74f-44cb-9a27-aee8e6d1fe89" />

