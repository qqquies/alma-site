// Минималистичный знак Alma: раскрытая книга и точка-искра.
// Наследует цвет текста, поэтому работает и в светлой, и в тёмной теме.
function LogoMark({ size = 28 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      aria-hidden="true"
      className="logo-mark"
    >
      <rect
        x="1.4"
        y="1.4"
        width="29.2"
        height="29.2"
        rx="8.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <path
        d="M8.2 11.6c3.2-.9 5.7-.5 7.8.9 2.1-1.4 4.6-1.8 7.8-.9v11.3c-3.2-.9-5.7-.5-7.8.9-2.1-1.4-4.6-1.8-7.8-.9V11.6Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path
        d="M16 12.5v11.3"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <circle cx="22.9" cy="9.2" r="1.6" className="logo-spark" />
    </svg>
  )
}

export default LogoMark
