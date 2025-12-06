# Quick Start Guide: Text-to-Speech Feature

## For Users 👥

### How to Use
1. **Open any PDF** in Bacii viewer
2. **Click** the Actions menu (⋮ three dots)
3. **Select** "អានឮសៀង (TTS)"
4. **Click** "ស្កេនអត្ថបទពីទំព័រ X" button
5. **Wait** for text extraction (progress bar shows status)
6. **Edit** text if needed
7. **Click** "ចាប់ផ្តើម" to listen
8. **Use** pause/resume/stop as needed

### Benefits
- 📚 **Audio learning**: Listen while studying
- ♿ **Accessibility**: For visually impaired students
- 🎧 **Multi-tasking**: Study while doing other things
- 🗣️ **Pronunciation**: Hear correct Khmer pronunciation
- ✏️ **Editable**: Fix OCR errors before listening

---

## For Developers 👨‍💻

### Installation
```bash
npm install tesseract.js
```

### Basic Usage
```javascript
import { useTextToSpeech } from '~/composables/useTextToSpeech'

const {
  extractTextFromCurrentPage,
  speak,
  extractedText
} = useTextToSpeech()

// Extract text
await extractTextFromCurrentPage(pdfDoc, 1)

// Speak
speak(extractedText.value)
```

### Component Integration
```vue
<TextToSpeech 
  :pdfDocument="pdfDoc" 
  :currentPage="1"
  @close="handleClose"
/>
```

### Files Structure
```
app/
├── composables/
│   └── useTextToSpeech.js       # Core logic
├── components/
│   └── TextToSpeech.vue          # UI component
└── app.vue                        # Integration
```

### Key Functions
- `extractTextFromCurrentPage(doc, page)` - OCR extraction
- `speak(text, rate, pitch)` - TTS playback
- `pause()` / `resume()` / `stop()` - Playback control
- `clearText()` - Reset state

---

## Keyboard Shortcuts (Suggested) ⌨️

Add to `/app/composables/useKeyboardShortcuts.js`:

```javascript
// T key - Toggle TTS
if (e.key === 't' || e.key === 'T') {
  if (!e.ctrlKey && !e.metaKey && !e.altKey) {
    showTTS.value = !showTTS.value
  }
}
```

---

## Common Issues & Solutions 🔧

### OCR Not Working
**Problem**: "No PDF document loaded" error
**Solution**: Wait for PDF to fully load before scanning

### No Sound
**Problem**: TTS plays but no audio
**Solution**: Check device volume, try different voice

### Slow Extraction
**Problem**: Takes >30 seconds
**Solution**: Use desktop browser, close other tabs

### Garbled Text
**Problem**: OCR produces incorrect Khmer text
**Solution**: Try higher PDF zoom level for better quality

---

## Testing Checklist ✅

- [ ] Extract text from Khmer exam paper
- [ ] Extract text from English exam paper
- [ ] Play, pause, resume, stop TTS
- [ ] Edit extracted text
- [ ] Change voice selection
- [ ] Test on mobile device
- [ ] Test in dark mode
- [ ] Test error handling
- [ ] Test with low-quality PDF
- [ ] Test panel close/reopen

---

## Performance Tips 🚀

1. **OCR**: Render at 2x scale for better accuracy
2. **Memory**: Clear text when done to free memory
3. **Speed**: Desktop is 3-5x faster than mobile
4. **Quality**: Higher PDF quality = better OCR

---

## API Reference 📖

### useTextToSpeech()

Returns object with:

```typescript
{
  // State
  isProcessing: Ref<boolean>
  extractedText: Ref<string>
  isPlaying: Ref<boolean>
  isPaused: Ref<boolean>
  progress: Ref<number>        // 0-100
  error: Ref<string | null>
  selectedVoice: Ref<Voice>
  availableVoices: Ref<Voice[]>
  canUseTTS: ComputedRef<boolean>
  
  // Methods
  extractTextFromCurrentPage: (doc, page) => Promise<string>
  speak: (text?, rate?, pitch?) => void
  pause: () => void
  resume: () => void
  stop: () => void
  clearText: () => void
  initVoices: () => void
}
```

---

## Browser Support 🌐

| Browser | OCR | TTS | Status |
|---------|-----|-----|--------|
| Chrome  | ✅  | ✅  | Full   |
| Edge    | ✅  | ✅  | Full   |
| Firefox | ✅  | ✅  | Full   |
| Safari  | ✅  | ⚠️  | Limited voices |

---

## Bundle Size 📦

- **tesseract.js**: ~400KB gzipped
- **Language data**: ~1MB (downloaded on first use)
- **Total impact**: ~1.4MB additional bundle

---

## License 📄

MIT - Same as Bacii project

---

## Support 💬

- **Issues**: https://github.com/HELMAB/bacii/issues
- **Docs**: See TTS_FEATURE.md for full documentation
- **Demo**: https://dobpi.netlify.app

---

**Quick tip**: Press `T` to toggle TTS panel (if keyboard shortcut added) 🎯
