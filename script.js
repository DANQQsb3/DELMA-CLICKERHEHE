body {
  font-family: 'Segoe UI', sans-serif;
  background: #111;
  color: #fff;
  margin: 0;
  padding: 0;
}

#top-area {
  text-align: center;
  padding: 20px;
}

#bigButton {
  background: #00ff88;
  color: #000;
  font-size: 32px;
  padding: 25px 60px;
  border: none;
  border-radius: 16px;
  box-shadow: 0 0 20px #00ff88;
  transition: 0.1s;
}

#bigButton:active {
  transform: scale(0.95);
}

#shop-area {
  position: fixed;
  right: 10px;
  top: 140px;
  width: 300px;
  background: #222;
  padding: 20px;
  border-radius: 12px;
}

#rebirth-area {
  position: fixed;
  right: 10px;
  bottom: 10px;
  width: 300px;
  background: #2a2a2a;
  padding: 20px;
  border-radius: 12px;
}

#save-area {
  position: fixed;
  left: 10px;
  bottom: 10px;
  width: 300px;
  background: #222;
  padding: 20px;
  border-radius: 12px;
}

button {
  width: 100%;
  padding: 10px;
  margin-top: 5px;
  border: none;
  border-radius: 8px;
  background: #00ff88;
  color: #000;
  font-size: 16px;
  cursor: pointer;
}

button:hover {
  background: #00cc66;
}

.footer {
  text-align: center;
  margin-top: 40px;
  font-size: 14px;
  color: #888;
}

@media (max-width: 800px) {
  #shop-area,
  #rebirth-area,
  #save-area {
    position: static;
    width: 90%;
    margin: 20px auto;
  }

  #bigButton {
    width: 90%;
    font-size: 28px;
  }
}
