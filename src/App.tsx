import { BrowserRouter } from 'react-router-dom'
import { AppRouter } from './app/router'
import { AppProviders } from './app/providers'

function App() {
  return (
    <BrowserRouter>
      <AppProviders>
        <AppRouter />
      </AppProviders>
    </BrowserRouter>
  )
}

export default App
