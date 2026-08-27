export function speakText(
  text: string,
  lang: 'fr' | 'en',
  rate: number = 0.9,
  onStart?: () => void,
  onEnd?: () => void,
  onError?: () => void
) {
  if (!('speechSynthesis' in window)) {
    console.warn('Speech synthesis not supported in this browser');
    onError?.();
    return;
  }

  // Cancel any ongoing speech
  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = lang === 'fr' ? 'fr-FR' : 'en-US';
  utterance.rate = rate;
  utterance.pitch = 1.0;

  // Try to pick a natural voice if available
  const voices = window.speechSynthesis.getVoices();
  const targetCode = lang === 'fr' ? 'fr' : 'en';
  const matchingVoice = voices.find(
    (v) => v.lang.startsWith(targetCode) && (v.name.includes('Google') || v.name.includes('Natural') || v.name.includes('Premium'))
  ) || voices.find((v) => v.lang.startsWith(targetCode));

  if (matchingVoice) {
    utterance.voice = matchingVoice;
  }

  utterance.onstart = () => {
    onStart?.();
  };

  utterance.onend = () => {
    onEnd?.();
  };

  utterance.onerror = (e) => {
    console.error('Speech synthesis error:', e);
    onError?.();
  };

  window.speechSynthesis.speak(utterance);
}

export function stopSpeech() {
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
}
