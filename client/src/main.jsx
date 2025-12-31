import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { UserProvider } from './context/UserContext.jsx'
import { ContractorProvider } from './context/ContractorContext.jsx'
import { ContractorListProvider } from './context/ContractorListContext.jsx';


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ContractorProvider>
    <UserProvider>
       <ContractorListProvider>
    <App />
    </ContractorListProvider>
    </UserProvider>
    </ContractorProvider>
  </StrictMode>,
)
