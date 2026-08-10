const STARS = '★★★★★'

/** Muestra una nota (admite decimales: 4,3 pinta 4 estrellas y un tercio). */
export function Stars({ value, size = 14 }: { value: number; size?: number }) {
  const percent = Math.max(0, Math.min(100, (value / 5) * 100))
  return (
    <span
      className="stars"
      style={{ fontSize: size }}
      aria-label={`${value.toFixed(1)} de 5`}
    >
      <span className="stars-track">{STARS}</span>
      <span className="stars-fill" style={{ width: `${percent}%` }}>
        {STARS}
      </span>
    </span>
  )
}

/** Selector de nota de 1 a 5. */
export function StarInput({
  value,
  onChange,
}: {
  value: number
  onChange: (value: number) => void
}) {
  return (
    <span className="star-input" role="radiogroup" aria-label="Puntuación">
      {[1, 2, 3, 4, 5].map((score) => (
        <button
          key={score}
          type="button"
          role="radio"
          aria-checked={value === score}
          aria-label={`${score} de 5`}
          className={`star-button${score <= value ? ' is-on' : ''}`}
          onClick={() => onChange(score)}
        >
          ★
        </button>
      ))}
    </span>
  )
}
