# ElevenLabs shapes used by tests

- `recorded-errors.json`: real ElevenLabs error responses and the CORS preflight, recorded with curl and no key (see its `source` field).
- `fake-tts-mp3_22050_32.mp3`: NOT an ElevenLabs response. It was encoded locally with `say` + `ffmpeg -ar 22050 -ac 1 -b:a 32k`, which matches the `mp3_22050_32` output format the client requests, so decoders, magic-byte checks and relay size limits see realistic bytes.

A real success body and a quota-exhausted body need a real key. Recording them is the user's live verification step.
