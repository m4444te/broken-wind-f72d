/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run "npm run dev" in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run "npm run deploy" to publish your worker
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */


// export default {
//   async fetch(request, env, ctx) {
//     return new Response('YOLO');
//   },
// };

addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

async function handleRequest(request) {
  if (request.method === 'POST') {
    const contentType = request.headers.get('content-type') || '';
    if (contentType.includes('application/json')) {
      const json = await request.json();
      return new Response(JSON.stringify(json), { status: 200 });
    } else if (contentType.includes('application/x-www-form-urlencoded')) {
      const formData = await request.formData();
      const formEntries = {};
      for (const entry of formData.entries()) {
        formEntries[entry[0]] = entry[1];
      }
      return new Response(JSON.stringify(formEntries), { status: 200 });
    } else {
      return new Response('Unsupported Content-Type', { status: 400 });
    }
  } else {
    return new Response('Method Not Allowed', { status: 405 });
  }
}
