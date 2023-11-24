import { createContext, useContext, useState } from 'react'

const TenantContext = createContext({})

export const TenantProvider = ({ children }) => {
  const [tenantData, setTenantData] = useState({
    name: '',
    logo: '',
    primaryColorScheme: {
      light: '',
      dark: '',
    },
    secondaryColorScheme: {
      light: '',
      dark: '',
    },
    textColorScheme: {
      light: '',
      dark: '',
    },
    fixieId: '',
  })

  // Provide a way to update the tenant data
  const updateTenantData = (data) => {
    setTenantData(data)
  }

  return (
    <TenantContext.Provider value={{ tenantData, updateTenantData }}>
      {children}
    </TenantContext.Provider>
  )
}

export const useTenant = () => useContext(TenantContext)
