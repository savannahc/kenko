interface ReadCheckboxProps {
  checked: boolean
  accentColor: string
  onChange: (checked: boolean) => void
  onLight?: boolean
}

export function ReadCheckbox({ checked, accentColor, onChange, onLight = false }: ReadCheckboxProps) {
  return (
    <button
      onClick={(e) => {
        e.stopPropagation()
        onChange(!checked)
      }}
      style={{
        width: 22,
        height: 22,
        borderRadius: '50%',
        border: checked
          ? 'none'
          : `1.5px solid ${onLight ? 'rgba(0,0,0,0.2)' : 'rgba(255,255,255,0.25)'}`,
        background: checked ? accentColor : 'transparent',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 0,
        transition: 'all 0.2s ease',
        flexShrink: 0,
      }}
      aria-label={checked ? 'Mark as unread' : 'Mark as read'}
    >
      {checked && (
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
          <path
            d="M2.5 6L5 8.5L9.5 3.5"
            stroke="#fff"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      )}
    </button>
  )
}
