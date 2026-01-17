import { useState, ReactNode, createContext, useContext } from 'react'

interface AccordionItem {
  id: string
  title: string
  content: ReactNode
}

interface AccordionProps {
  items: AccordionItem[]
  allowMultiple?: boolean
  defaultOpenIds?: string[]
  className?: string
}

export function Accordion({
  items,
  allowMultiple = false,
  defaultOpenIds = [],
  className = '',
}: AccordionProps) {
  const [openIds, setOpenIds] = useState<string[]>(defaultOpenIds)

  const toggleItem = (id: string) => {
    if (allowMultiple) {
      setOpenIds(prev =>
        prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
      )
    } else {
      setOpenIds(prev => (prev.includes(id) ? [] : [id]))
    }
  }

  return (
    <div className={`divide-y divide-light-border ${className}`}>
      {items.map(item => {
        const isOpen = openIds.includes(item.id)

        return (
          <div key={item.id}>
            <button
              onClick={() => toggleItem(item.id)}
              className="
                flex items-center justify-between w-full py-4 text-left
                font-medium text-dark hover:text-primary-orange
                transition-colors
              "
              aria-expanded={isOpen}
              aria-controls={`accordion-content-${item.id}`}
            >
              <span>{item.title}</span>
              <svg
                className={`
                  w-5 h-5 text-dark-muted transition-transform duration-200
                  ${isOpen ? 'rotate-180' : ''}
                `}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>

            <div
              id={`accordion-content-${item.id}`}
              className={`
                overflow-hidden transition-all duration-200
                ${isOpen ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'}
              `}
            >
              <div className="pb-4 text-dark-secondary">{item.content}</div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

// Compound component version
interface AccordionContextType {
  openIds: string[]
  toggleItem: (id: string) => void
}

const AccordionContext = createContext<AccordionContextType | undefined>(undefined)

function useAccordionContext() {
  const context = useContext(AccordionContext)
  if (!context) {
    throw new Error('Accordion components must be used within AccordionRoot')
  }
  return context
}

interface AccordionRootProps {
  children: ReactNode
  allowMultiple?: boolean
  defaultOpenIds?: string[]
  className?: string
}

export function AccordionRoot({
  children,
  allowMultiple = false,
  defaultOpenIds = [],
  className = '',
}: AccordionRootProps) {
  const [openIds, setOpenIds] = useState<string[]>(defaultOpenIds)

  const toggleItem = (id: string) => {
    if (allowMultiple) {
      setOpenIds(prev =>
        prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
      )
    } else {
      setOpenIds(prev => (prev.includes(id) ? [] : [id]))
    }
  }

  return (
    <AccordionContext.Provider value={{ openIds, toggleItem }}>
      <div className={`divide-y divide-light-border ${className}`}>{children}</div>
    </AccordionContext.Provider>
  )
}

interface AccordionItemRootProps {
  id: string
  children: ReactNode
}

export function AccordionItemRoot({ id, children }: AccordionItemRootProps) {
  return <div data-accordion-item={id}>{children}</div>
}

interface AccordionTriggerProps {
  id: string
  children: ReactNode
  className?: string
}

export function AccordionTrigger({ id, children, className = '' }: AccordionTriggerProps) {
  const { openIds, toggleItem } = useAccordionContext()
  const isOpen = openIds.includes(id)

  return (
    <button
      onClick={() => toggleItem(id)}
      className={`
        flex items-center justify-between w-full py-4 text-left
        font-medium text-dark hover:text-primary-orange transition-colors
        ${className}
      `}
      aria-expanded={isOpen}
    >
      {children}
      <svg
        className={`
          w-5 h-5 text-dark-muted transition-transform duration-200
          ${isOpen ? 'rotate-180' : ''}
        `}
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
      </svg>
    </button>
  )
}

interface AccordionContentProps {
  id: string
  children: ReactNode
  className?: string
}

export function AccordionContent({ id, children, className = '' }: AccordionContentProps) {
  const { openIds } = useAccordionContext()
  const isOpen = openIds.includes(id)

  return (
    <div
      className={`
        overflow-hidden transition-all duration-200
        ${isOpen ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'}
        ${className}
      `}
    >
      <div className="pb-4 text-dark-secondary">{children}</div>
    </div>
  )
}
