import { useRef, useState } from 'react'
import { FocusTrap } from '../index'

export function Autofocus() {
  const [trapped, setTrapped] = useState(false)
  const buttonRef = useRef<HTMLButtonElement>(null)

  return (
    <div>
      <button ref={buttonRef} onClick={() => setTrapped(!trapped)}>
        {trapped ? 'End Trap' : 'Start Trap'}
      </button>
      {trapped && (
        <FocusTrap disabled={!trapped} setReturnFocus={buttonRef.current}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', paddingBlock: '1rem' }}>
            <input type="text" placeholder="Regular input" />
            <input type="text" placeholder="Autofocused input" autoFocus />
            <button onClick={() => setTrapped(false)}>End Trap</button>
          </div>
        </FocusTrap>
      )}
    </div>
  )
}
