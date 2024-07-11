import React from 'react'
import { Dialog, DialogClose, DialogContent, DialogPortal, DialogTitle, DialogDescription, DialogHeader } from "./ui/dialog"
import { Button } from "./ui/button"
import { X } from "lucide-react"

const DialogCustomAdmin = ({
  titleDialogContent,
  descripDialogContent,
  open,
  onOpenChange,
  children
}:{
  titleDialogContent: string,
  descripDialogContent?: string,
  open: boolean,
  onOpenChange: (open: boolean) => void,
  children: React.ReactNode
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogPortal>
        <DialogClose asChild>
          <button className="IconButton" aria-label="Close">
            <X />
          </button>
        </DialogClose>
      </DialogPortal>
      <DialogContent aria-describedby="">
        <DialogHeader>
          <DialogTitle>{titleDialogContent}</DialogTitle>
          {descripDialogContent && <DialogDescription>{descripDialogContent}</DialogDescription>}
        </DialogHeader>
        {children}
      </DialogContent>
    </Dialog>
  )
}

export default DialogCustomAdmin
