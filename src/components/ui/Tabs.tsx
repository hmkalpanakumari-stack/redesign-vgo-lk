import { useState, ReactNode, createContext, useContext } from 'react'

interface Tab {
  id: string
  label: string
  content: ReactNode
  disabled?: boolean
}

interface TabsProps {
  tabs: Tab[]
  defaultTab?: string
  onChange?: (tabId: string) => void
  variant?: 'default' | 'pills' | 'underline'
  className?: string
}

export function Tabs({
  tabs,
  defaultTab,
  onChange,
  variant = 'default',
  className = '',
}: TabsProps) {
  const [activeTab, setActiveTab] = useState(defaultTab || tabs[0]?.id)

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId)
    onChange?.(tabId)
  }

  const variantClasses = {
    default: {
      container: 'border-b border-light-border',
      tab: 'px-4 py-2 font-medium text-dark-muted hover:text-dark border-b-2 -mb-px',
      activeTab: 'text-primary-orange border-primary-orange',
      inactiveTab: 'border-transparent',
    },
    pills: {
      container: 'bg-gray-100 p-1 rounded-lg',
      tab: 'px-4 py-2 font-medium rounded-md transition-colors',
      activeTab: 'bg-white text-dark shadow-sm',
      inactiveTab: 'text-dark-muted hover:text-dark',
    },
    underline: {
      container: '',
      tab: 'px-4 py-2 font-medium border-b-2 -mb-px',
      activeTab: 'text-primary-blue border-primary-blue',
      inactiveTab: 'text-dark-muted border-transparent hover:text-dark hover:border-gray-300',
    },
  }

  const styles = variantClasses[variant]

  return (
    <div className={className}>
      <div className={`flex ${styles.container}`} role="tablist">
        {tabs.map(tab => (
          <button
            key={tab.id}
            role="tab"
            aria-selected={activeTab === tab.id}
            aria-controls={`tabpanel-${tab.id}`}
            disabled={tab.disabled}
            onClick={() => handleTabChange(tab.id)}
            className={`
              ${styles.tab}
              ${activeTab === tab.id ? styles.activeTab : styles.inactiveTab}
              ${tab.disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
              transition-colors
            `}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="mt-4">
        {tabs.map(tab => (
          <div
            key={tab.id}
            id={`tabpanel-${tab.id}`}
            role="tabpanel"
            aria-labelledby={tab.id}
            hidden={activeTab !== tab.id}
          >
            {activeTab === tab.id && tab.content}
          </div>
        ))}
      </div>
    </div>
  )
}

// Alternative implementation using compound components
interface TabsContextType {
  activeTab: string
  setActiveTab: (id: string) => void
}

const TabsContext = createContext<TabsContextType | undefined>(undefined)

function useTabsContext() {
  const context = useContext(TabsContext)
  if (!context) {
    throw new Error('Tab components must be used within TabsRoot')
  }
  return context
}

interface TabsRootProps {
  defaultValue: string
  children: ReactNode
  className?: string
}

export function TabsRoot({ defaultValue, children, className = '' }: TabsRootProps) {
  const [activeTab, setActiveTab] = useState(defaultValue)

  return (
    <TabsContext.Provider value={{ activeTab, setActiveTab }}>
      <div className={className}>{children}</div>
    </TabsContext.Provider>
  )
}

interface TabsListProps {
  children: ReactNode
  className?: string
}

export function TabsList({ children, className = '' }: TabsListProps) {
  return (
    <div className={`flex border-b border-light-border ${className}`} role="tablist">
      {children}
    </div>
  )
}

interface TabsTriggerProps {
  value: string
  children: ReactNode
  disabled?: boolean
  className?: string
}

export function TabsTrigger({ value, children, disabled, className = '' }: TabsTriggerProps) {
  const { activeTab, setActiveTab } = useTabsContext()
  const isActive = activeTab === value

  return (
    <button
      role="tab"
      aria-selected={isActive}
      disabled={disabled}
      onClick={() => setActiveTab(value)}
      className={`
        px-4 py-2 font-medium border-b-2 -mb-px transition-colors
        ${isActive ? 'text-primary-orange border-primary-orange' : 'text-dark-muted border-transparent hover:text-dark'}
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        ${className}
      `}
    >
      {children}
    </button>
  )
}

interface TabsContentProps {
  value: string
  children: ReactNode
  className?: string
}

export function TabsContent({ value, children, className = '' }: TabsContentProps) {
  const { activeTab } = useTabsContext()

  if (activeTab !== value) return null

  return (
    <div role="tabpanel" className={`mt-4 ${className}`}>
      {children}
    </div>
  )
}
