const message = document.querySelector('#message');
const key = document.querySelector('#key');
const encoded = document.querySelector('#encoded');
const decodedText = document.querySelector('#decoded-text');
const decodedResult = document.querySelector('#decoded-result');
const encoder = new TextEncoder();
const decoder = new TextDecoder();

const toBase64 = bytes => {
  let binary = '';
  bytes.forEach(byte => binary += String.fromCharCode(byte));
  return btoa(binary);
};
const fromBase64 = value => {
  const binary = atob(value.replace(/\s/g, ''));
  return Uint8Array.from(binary, char => char.charCodeAt(0));
};
const preview = (bytes, limit = 8) => `${Array.from(bytes.slice(0, limit)).join(' · ')}${bytes.length > limit ? ' · …' : ''}`;
const setText = (selector, value) => document.querySelector(selector).textContent = value;

function xorBytes(bytes, secret) {
  const secretBytes = encoder.encode(secret);
  return Uint8Array.from(bytes, (byte, index) => byte ^ secretBytes[index % secretBytes.length]);
}

function updateCounts() {
  setText('#message-count', `${message.value.length} ${message.value.length === 1 ? 'caractere' : 'caracteres'}`);
  setText('#encoded-count', `${encoded.value.length} ${encoded.value.length === 1 ? 'caractere' : 'caracteres'}`);
}

function showError(text) {
  decodedResult.classList.add('error');
  decodedResult.classList.remove('success');
  decodedResult.querySelector('.result-label').textContent = 'não foi possível';
  decodedText.textContent = text;
}

function encodeMessage() {
  if (!message.value.trim()) return alert('Digite uma mensagem para codificar.');
  if (!key.value) return alert('Digite uma chave para continuar.');
  const originalBytes = encoder.encode(message.value);
  const keyBytes = encoder.encode(key.value);
  const transformedBytes = xorBytes(originalBytes, key.value);
  encoded.value = toBase64(transformedBytes);
  setText('#step-bytes', preview(originalBytes));
  setText('#step-xor', `${originalBytes[0]} ⊕ ${keyBytes[0]} = ${transformedBytes[0]}  …`);
  setText('#step-base64', encoded.value.slice(0, 29) + (encoded.value.length > 29 ? '…' : ''));
  decodedResult.classList.remove('error', 'success');
  decodedResult.querySelector('.result-label').textContent = 'mensagem recuperada';
  decodedText.textContent = 'A mensagem aparecerá aqui.';
  updateCounts();
  encoded.focus();
}

function decodeMessage() {
  if (!encoded.value.trim()) return showError('Cole ou gere um código primeiro.');
  if (!key.value) return showError('Informe a chave usada na codificação.');
  try {
    const encryptedBytes = fromBase64(encoded.value);
    const originalBytes = xorBytes(encryptedBytes, key.value);
    const result = decoder.decode(originalBytes, { fatal: true });
    decodedResult.classList.add('success');
    decodedResult.classList.remove('error');
    decodedResult.querySelector('.result-label').textContent = 'mensagem recuperada';
    decodedText.textContent = result;
  } catch (error) {
    showError('Código ou chave inválida. Confira os dados e tente novamente.');
  }
}

document.querySelector('#encode-button').addEventListener('click', encodeMessage);
document.querySelector('#decode-button').addEventListener('click', decodeMessage);
message.addEventListener('input', updateCounts);
encoded.addEventListener('input', updateCounts);
document.querySelector('#toggle-key').addEventListener('click', event => {
  key.type = key.type === 'password' ? 'text' : 'password';
  event.currentTarget.textContent = key.type === 'password' ? '◉' : '◌';
});
document.querySelector('#copy-button').addEventListener('click', async () => {
  if (!encoded.value) return;
  await navigator.clipboard.writeText(encoded.value);
  const toast = document.querySelector('#toast');
  toast.classList.add('visible');
  setTimeout(() => toast.classList.remove('visible'), 1800);
});
updateCounts();
