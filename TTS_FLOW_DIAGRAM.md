# Text-to-Speech Feature Flow

## User Interface Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                         Bacii App                                │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │ Header                                                     │  │
│  │  [☰] អក្សរសាស្ត្រខ្មែរ     [...Actions ▼]                 │  │
│  │                              └─────────────┐                │  │
│  │                                            │                │  │
│  │                         ┌──────────────────┴─────────────┐  │  │
│  │                         │ • ប្រៀបធៀបឯកសារ              │  │  │
│  │                         │ • ពេញអេក្រង់                   │  │
│  │                         │ • បោះពុម្ពឯកសារ                 │  │
│  │                         │ • គ្លីដកាត់                     │  │
│  │                         │ ──────────────                 │  │
│  │                         │ 🔊 អានឮសៀង (TTS) ⬅ CLICK      │  │
│  │                         │ ──────────────                 │  │
│  │                         │ • ពន្លឺយប់                      │  │
│  │                         └────────────────────────────────┘  │
│  └───────────────────────────────────────────────────────────┘  │
│                                                                  │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │                                                            │  │
│  │                    PDF Content Here                        │  │
│  │                                                            │  │
│  │              [Exam paper content displayed]                │  │
│  │                                                            │  │
│  └───────────────────────────────────────────────────────────┘  │
│                                                                  │
│                                      ┌──────────────────────┐   │
│                                      │ 🔊 អានឮសៀង (TTS)    │   │
│                                      │                    ✕ │   │
│                                      ├──────────────────────┤   │
│  TTS Panel appears here ────────────▶│ [📄 ស្កេនអត្ថបទ...] │   │
│                                      │                      │   │
│                                      │ ░░░░░░░ 65%         │   │
│                                      │                      │   │
│                                      │ ┌──────────────────┐ │   │
│                                      │ │ អត្ថបទស្កេនបាន:  │ │   │
│                                      │ │ ឯកសារប្រឡងខ្មែរ  │ │   │
│                                      │ │ មុខវិជ្ជា...      │ │   │
│                                      │ └──────────────────┘ │   │
│                                      │                      │   │
│                                      │ Voice: [Khmer ▼]    │   │
│                                      │                      │   │
│                                      │ [▶️ ចាប់ផ្តើម] [🗑️]  │   │
│                                      └──────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
```

## Feature State Flow

```
┌─────────────┐
│   Initial   │
│   State     │
└──────┬──────┘
       │
       │ User clicks TTS in menu
       ▼
┌─────────────┐
│ TTS Panel   │
│  Visible    │
└──────┬──────┘
       │
       │ User clicks "ស្កេនអត្ថបទ"
       ▼
┌─────────────┐     ┌──────────────┐
│ Extracting  │────▶│  Progress:   │
│    Text     │     │  0% → 100%   │
└──────┬──────┘     └──────────────┘
       │
       │ OCR Complete
       ▼
┌─────────────┐     ┌──────────────┐
│   Text      │────▶│ Extracted    │
│  Displayed  │     │ Text in      │
│             │     │ Textarea     │
└──────┬──────┘     └──────────────┘
       │
       │ User clicks "ចាប់ផ្តើម"
       ▼
┌─────────────┐     ┌──────────────┐
│  Playing    │────▶│  [⏸️ ផ្អាក]   │
│   Audio     │     │  [⏹️ បញ្ឈប់]   │
└──────┬──────┘     └──────────────┘
       │
       │ Playback controls
       ▼
┌─────────────┐
│   Paused    │◀──▶ Resume
│   Stopped   │
└─────────────┘
```

## Technical Architecture

```
┌────────────────────────────────────────────────────────────┐
│                      User Interface                         │
│         (TextToSpeech.vue Component)                       │
└────────────┬───────────────────────────┬───────────────────┘
             │                           │
             │ UI Events                 │ Display State
             ▼                           ▲
┌────────────────────────────────────────────────────────────┐
│              useTextToSpeech Composable                     │
│  ┌──────────────┐         ┌──────────────┐                │
│  │   OCR Logic  │         │   TTS Logic  │                │
│  │              │         │              │                │
│  │ • Extract    │         │ • Speak      │                │
│  │ • Progress   │         │ • Pause      │                │
│  │ • Cleanup    │         │ • Resume     │                │
│  └──────┬───────┘         └───────┬──────┘                │
└─────────┼─────────────────────────┼────────────────────────┘
          │                         │
          │ API Calls               │ API Calls
          ▼                         ▼
┌──────────────────┐      ┌──────────────────┐
│  Tesseract.js    │      │ Web Speech API   │
│                  │      │                  │
│ • createWorker() │      │ • speak()        │
│ • recognize()    │      │ • pause()        │
│ • terminate()    │      │ • resume()       │
└────────┬─────────┘      └────────┬─────────┘
         │                         │
         │ Canvas Input            │ Audio Output
         ▼                         ▼
┌──────────────────┐      ┌──────────────────┐
│   PDF Canvas     │      │  Device Speaker  │
│  (from PDF.js)   │      │                  │
└──────────────────┘      └──────────────────┘
```

## Data Flow

```
PDF Document
     │
     │ 1. Load PDF
     ▼
PDF.js Render
     │
     │ 2. Create Canvas (2x scale)
     ▼
Canvas Element
     │
     │ 3. Pass to Tesseract
     ▼
Tesseract OCR
     │
     │ 4. Extract Text (khm+eng)
     │    ├─ Progress updates (0-100%)
     │    └─ Error handling
     ▼
Raw Text String
     │
     │ 5. Clean & Trim
     ▼
extractedText (Ref)
     │
     │ 6. Display in Textarea
     │    └─ User can edit
     ▼
User-Edited Text
     │
     │ 7. Create Speech Utterance
     ▼
SpeechSynthesisUtterance
     │
     │ 8. Set voice, rate, pitch
     ▼
Web Speech API
     │
     │ 9. Play Audio
     ▼
Device Speakers
```

## Component Hierarchy

```
app.vue
│
├─ SidebarMain
│
├─ PdfViewerHeader
│  └─ HeaderActionsDropdown
│     └─ [TTS Menu Item]
│
├─ PdfContainer
│  └─ VuePdfEmbed
│     └─ [Emits pdfDocumentLoaded]
│
└─ Teleport (to body)
   └─ TextToSpeech (Floating Panel)
      └─ useTextToSpeech() composable
         ├─ OCR extraction
         └─ TTS playback
```

## Event Flow

```
User Action            Component              Composable           API
──────────            ─────────              ──────────           ───
                                                                   
Click "TTS"    ───▶   Toggle panel                                
                      showTTS = true                               
                                                                   
Click "Scan"   ───▶   @click event    ───▶   extractText()  ───▶  Tesseract
                                             progress++             recognize()
                                                                   
                      Display progress  ◀───  progress: 50%  ◀───  
                                                                   
                      Show text area    ◀───  extractedText  ◀───  Result
                                                                   
Click "Play"   ───▶   @click event    ───▶   speak()        ───▶  Web Speech
                                             isPlaying=true         speak()
                                                                   
                      Update UI         ◀───  State change   ◀───  onstart
                                                                   
Click "Pause"  ───▶   @click event    ───▶   pause()        ───▶  pause()
                                             isPaused=true          
                                                                   
Click "Stop"   ───▶   @click event    ───▶   stop()         ───▶  cancel()
                      Reset UI          ◀───  isPlaying=false ◀───  onend
```

## Error Handling Flow

```
┌──────────────┐
│ Try Extract  │
└──────┬───────┘
       │
   ┌───▼────┐
   │Success?│
   └───┬────┘
       │
   ┌───▼────┐         ┌────────────┐
   │  Yes   │────────▶│ Show Text  │
   └────────┘         └────────────┘
       │
   ┌───▼────┐         ┌────────────┐
   │   No   │────────▶│ Show Error │
   └────────┘         │  Message   │
                      │            │
                      │ • No PDF   │
                      │ • OCR fail │
                      │ • Network  │
                      └────────────┘
```

---

**Legend**
- ▶ : Data flow direction
- ◀ : Callback/Event
- │ : Sequential flow
- └─ : Branch/Component child
