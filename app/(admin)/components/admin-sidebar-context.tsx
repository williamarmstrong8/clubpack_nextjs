"use client"

import * as React from "react"

/**
 * When set (e.g. in tour), sidebar uses this path for active state instead of pathname.
 */
const AdminSidebarActiveContext = React.createContext<string | null>(null)

export function AdminSidebarActiveProvider({
  activePath,
  children,
}: {
  activePath: string | null
  children: React.ReactNode
}) {
  return (
    <AdminSidebarActiveContext.Provider value={activePath}>
      {children}
    </AdminSidebarActiveContext.Provider>
  )
}

export function useAdminSidebarActive() {
  return React.useContext(AdminSidebarActiveContext)
}
