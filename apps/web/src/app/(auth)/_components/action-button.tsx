import { Button } from '@/components/ui/button'
import React from 'react'

const ActionButton = ({
  children
} : {
  children: React.ReactNode
}) => {
  return (
    <Button className="w-full bg-gossamer-500 hover:bg-gossamer-500/90 rounded-full">
      {children}
    </Button>
  )
}

export default ActionButton
