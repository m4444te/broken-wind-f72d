addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

async function handleRequest(request) {
  if (request.method !== 'POST') {
    return new Response('Only POST requests are accepted', { status: 405 })
  }

  const contentType = request.headers.get('content-type') || ''
  if (!contentType.includes('application/x-www-form-urlencoded')) {
    return new Response('Invalid content type. Expected application/x-www-form-urlencoded', { status: 400 })
  }

  let data
  try {
    const formData = await request.text()
    data = new URLSearchParams(formData)
  } catch (e) {
    return new Response('Invalid form data', { status: 400 })
  }

  // Extract parameters
  const username = data.get('username') || 'Anonymous'
  const number = data.get('number') || '123456789012345'
  const referent = data.get('referent') || 'Referent'

  // Generate HTML card
  const html = generateHTML(username, number, referent)

  return new Response(html, {
    headers: { 'Content-Type': 'text/html' }
  })
}

function generateHTML(username, number, referent) {
  const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Directives Anticipées</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          display: flex;
          justify-content: center;
          align-items: center;
          height: 100vh;
          margin: 0;
          background-color: #f0f0f0;
        }
        .card {
          background-color: #fff;
          border-radius: 10px;
          box-shadow: 0 4px 8px rgba(0,0,0,0.1);
          overflow: hidden;
          width: 500px; /* Adjusted for landscape orientation */
          height: 300px; /* Adjusted for landscape orientation */
          text-align: center;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          position: relative;
        }
        .card-content {
          width: 100%;
          padding: 20px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          align-items: center;
          height: 100%;
        }
        .card-title {
          font-size: 24px;
          font-weight: bold;
          margin: 0;
        }
        .card-subtitle {
          font-size: 18px;
          color: #555;
          margin: 5px 0;
        }
        .card-description {
          font-size: 14px;
          color: #777;
        }
        .qr-code {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          margin-top: 25px;
        }
        .number-referent {
          display: flex;
          justify-content: space-between;
          width: 100%;
          position: absolute;
          bottom: 20px;
        }
        .number, .referent {
          flex: 1;
        }
        .number {
          text-align: left;
          padding-left: 20px;
        }
        .referent {
          text-align: right;
          padding-right: 20px;
        }
      </style>
      <script src="https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js"></script>
    </head>
    <body>
      <div class="card">
        <div class="card-content">
          <div>
            <div class="card-title">Directives Anticipées</div>
            <div class="card-subtitle">${username}</div>
          </div>
          <div class="qr-code" id="qrcode"></div>
        </div>
        <div class="number-referent">
          <div class="card-description number">Sécurité sociale : <br>${number}</div>
          <div class="card-description referent">Médecin référent : <br>${referent}</div>
        </div>
      </div>
      <script>
        new QRCode(document.getElementById("qrcode"), {
          text: "https://dap-pooc.spinning-fantasies.org",
          width: 150,
          height: 150
        });
      </script>
    </body>
    </html>
  `
  return html
}
