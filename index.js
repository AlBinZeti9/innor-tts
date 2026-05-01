export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const text = url.searchParams.get('text') || "Bonjour, je suis votre assistant InnoReve.";
    const voice = url.searchParams.get('voice') || "fr-FR-DeniseNeural";
    const rate = url.searchParams.get('rate') || "+0%";
    const pitch = url.searchParams.get('pitch') || "+0Hz";

    if (url.pathname === '/voices') {
      const response = await fetch('https://speech.platform.bing.com/consumer/speech/synthesize/readaloud/metadata/voices.list?trustedclienttoken=6A5AA1D4EAFF4E9FB37E23D314054524');
      return new Response(await response.text(), { headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' } });
    }

    const endpoint = `https://speech.platform.bing.com/consumer/speech/synthesize/readaloud/edge/v1?trustedclienttoken=6A5AA1D4EAFF4E9FB37E23D314054524`;
    
    const ssml = `<speak version='1.0' xmlns='http://www.w3.org/2001/10/synthesis' xml:lang='en-US'>
      <voice name='${voice}'><prosody pitch='${pitch}' rate='${rate}'>${text}</prosody></voice>
    </speak>`;

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/ssml+xml',
        'X-Microsoft-OutputFormat': 'audio-16khz-32kbitrate-mono-mp3',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      },
      body: ssml
    });

    return new Response(response.body, {
      headers: {
        'Content-Type': 'audio/mpeg',
        'Access-Control-Allow-Origin': '*',
        'Cache-Control': 'public, max-age=31536000'
      }
    });
  }
};
