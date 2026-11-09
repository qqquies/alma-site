import './Illustrations.css'

// Минималистичные линейные иллюстрации. Никаких градиентов:
// только тонкие линии, бумага и зелёный акцент Alma.

export function HeroArt() {
  return (
    <svg
      viewBox="0 0 520 440"
      className="art art--hero"
      aria-hidden="true"
      focusable="false"
    >
      {/* Орбита вокруг книги — намёк на любопытство и движение мысли */}
      <ellipse
        cx="260"
        cy="238"
        rx="214"
        ry="132"
        fill="none"
        stroke="var(--color-accent)"
        strokeOpacity="0.4"
        strokeWidth="1.4"
        strokeDasharray="2 9"
        transform="rotate(-11 260 238)"
      />
      <circle cx="72" cy="288" r="4.5" className="art-accent-fill" />
      <circle cx="456" cy="166" r="3" className="art-accent-fill" opacity="0.7" />

      {/* Карточка с галочкой */}
      <g transform="translate(330 74)">
        <rect
          width="140"
          height="76"
          rx="12"
          className="art-surface art-ink"
          strokeWidth="1.5"
        />
        <circle cx="26" cy="26" r="11" fill="var(--color-accent-soft)" />
        <path
          d="m21 26 3.6 3.6L32 22"
          fill="none"
          stroke="var(--color-accent-strong)"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <line x1="48" y1="22" x2="116" y2="22" className="art-dim" strokeWidth="1.6" strokeLinecap="round" />
        <line x1="48" y1="32" x2="92" y2="32" className="art-dim" strokeWidth="1.6" strokeLinecap="round" />
        <line x1="20" y1="52" x2="120" y2="52" className="art-dim" strokeWidth="1.2" strokeLinecap="round" />
        <line x1="20" y1="61" x2="98" y2="61" className="art-dim" strokeWidth="1.2" strokeLinecap="round" />
      </g>

      {/* Небольшая записка слева */}
      <g transform="translate(46 128)">
        <rect
          width="102"
          height="70"
          rx="10"
          className="art-surface art-ink"
          strokeWidth="1.4"
        />
        <rect width="5" height="70" rx="2.5" className="art-accent-fill" />
        <line x1="22" y1="24" x2="84" y2="24" className="art-dim" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="22" y1="36" x2="72" y2="36" className="art-dim" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="22" y1="48" x2="80" y2="48" className="art-dim" strokeWidth="1.5" strokeLinecap="round" />
      </g>

      {/* Раскрытая книга */}
      <path
        d="M105 262c45-22 100-20 155 4v92c-55-24-110-24-155 0v-96Z"
        className="art-surface art-ink"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
      <path
        d="M260 266c55-24 110-26 155-4v96c-45-24-100-24-155 0v-92Z"
        className="art-surface art-ink"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
      <line x1="260" y1="266" x2="260" y2="358" className="art-ink" strokeWidth="1.7" />

      <g className="art-dim" strokeWidth="1.4" strokeLinecap="round">
        <line x1="128" y1="288" x2="214" y2="300" />
        <line x1="128" y1="306" x2="198" y2="318" />
        <line x1="128" y1="324" x2="206" y2="336" />
        <line x1="306" y1="300" x2="392" y2="288" />
        <line x1="322" y1="318" x2="392" y2="306" />
        <line x1="314" y1="336" x2="392" y2="324" />
      </g>

      {/* Линейка под книгой */}
      <g className="art-dim" strokeWidth="1.2" strokeLinecap="round">
        <line x1="84" y1="402" x2="436" y2="402" />
        <line x1="120" y1="396" x2="120" y2="408" />
        <line x1="196" y1="398" x2="196" y2="406" />
        <line x1="260" y1="394" x2="260" y2="410" />
        <line x1="324" y1="398" x2="324" y2="406" />
        <line x1="400" y1="396" x2="400" y2="408" />
      </g>

      {/* Искры */}
      <g className="art-accent-stroke" strokeWidth="1.8" strokeLinecap="round">
        <path d="M420 300v14M413 307h14" />
        <path d="M92 76v10M87 81h10" />
      </g>
      <circle cx="310" cy="406" r="3" className="art-accent-fill" opacity="0.55" />
    </svg>
  )
}

export function StudentArt() {
  return (
    <svg
      viewBox="0 0 220 180"
      className="art art--card"
      aria-hidden="true"
      focusable="false"
    >
      <circle cx="112" cy="94" r="72" fill="var(--color-accent-soft)" />

      <g transform="rotate(-4 108 94)">
        <rect
          x="48"
          y="26"
          width="120"
          height="134"
          rx="10"
          className="art-surface art-ink"
          strokeWidth="1.6"
        />
        <line x1="66" y1="52" x2="150" y2="52" className="art-dim" strokeWidth="1.4" strokeLinecap="round" />
        <line x1="66" y1="70" x2="132" y2="70" className="art-dim" strokeWidth="1.4" strokeLinecap="round" />
        <line x1="66" y1="88" x2="144" y2="88" className="art-dim" strokeWidth="1.4" strokeLinecap="round" />
        <line x1="66" y1="106" x2="124" y2="106" className="art-dim" strokeWidth="1.4" strokeLinecap="round" />

        <g className="art-accent-stroke" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="m66 126 4 4 8-9" />
          <path d="m66 142 4 4 8-9" />
        </g>
        <line x1="86" y1="130" x2="140" y2="130" className="art-dim" strokeWidth="1.4" strokeLinecap="round" />
        <line x1="86" y1="146" x2="126" y2="146" className="art-dim" strokeWidth="1.4" strokeLinecap="round" />
      </g>

      {/* Кольцо прогресса */}
      <circle cx="167" cy="49" r="21" fill="var(--color-surface)" stroke="var(--color-border-strong)" strokeWidth="1.4" />
      <path
        d="M167 28a21 21 0 0 1 14.8 35.8"
        fill="none"
        stroke="var(--color-accent)"
        strokeWidth="3.2"
        strokeLinecap="round"
      />
      <circle cx="167" cy="28" r="2.4" className="art-accent-fill" />

      <path d="M34 44v11M28.5 49.5h11" className="art-accent-stroke" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  )
}

export function TeacherArt() {
  return (
    <svg
      viewBox="0 0 220 180"
      className="art art--card"
      aria-hidden="true"
      focusable="false"
    >
      <circle cx="110" cy="96" r="72" fill="var(--color-accent-soft)" />

      {/* Задний лист */}
      <g transform="rotate(6 110 94)">
        <rect
          x="60"
          y="30"
          width="108"
          height="130"
          rx="9"
          className="art-surface art-ink"
          strokeWidth="1.4"
          opacity="0.6"
        />
      </g>

      {/* Передний лист */}
      <g transform="rotate(-3 108 94)">
        <rect
          x="46"
          y="24"
          width="112"
          height="132"
          rx="9"
          className="art-surface art-ink"
          strokeWidth="1.6"
        />
        <line x1="64" y1="50" x2="140" y2="50" className="art-dim" strokeWidth="1.4" strokeLinecap="round" />
        <line x1="64" y1="66" x2="122" y2="66" className="art-dim" strokeWidth="1.4" strokeLinecap="round" />
        <line x1="64" y1="82" x2="134" y2="82" className="art-dim" strokeWidth="1.4" strokeLinecap="round" />
        <line x1="64" y1="98" x2="112" y2="98" className="art-dim" strokeWidth="1.4" strokeLinecap="round" />
        <line x1="64" y1="114" x2="128" y2="114" className="art-dim" strokeWidth="1.4" strokeLinecap="round" />
      </g>

      {/* Мини-слайд */}
      <g transform="translate(138 20)">
        <rect
          width="58"
          height="38"
          rx="6"
          className="art-surface art-ink"
          strokeWidth="1.4"
        />
        <rect x="6" y="0" width="3" height="38" rx="1.5" className="art-accent-fill" />
        <line x1="16" y1="13" x2="46" y2="13" className="art-dim" strokeWidth="1.4" strokeLinecap="round" />
        <line x1="16" y1="22" x2="38" y2="22" className="art-dim" strokeWidth="1.4" strokeLinecap="round" />
      </g>

      {/* Галочка готовности */}
      <circle cx="154" cy="138" r="18" fill="var(--color-accent)" />
      <path
        d="m146 138 5.5 5.5L163 132"
        fill="none"
        stroke="var(--color-on-accent)"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      <path d="M30 116v11M24.5 121.5h11" className="art-accent-stroke" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  )
}
