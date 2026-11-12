# StudiousSeekers

UF WiCSE Design Team Project to help students find study spots across campus.

## Run the demo

```powershell
cd demo
npm install
npm start
```

The demo is a React/Vite app with list and map views. In map view, hover or focus a study-spot dot to see its overview.

Start the API in a second terminal:

```powershell
cd server
python main.py
```

The frontend loads study spots from `http://127.0.0.1:8000/spots`.
