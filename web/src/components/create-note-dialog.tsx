import { useState } from 'react'
import { Button } from './ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
  DialogFooter,
} from './ui/dialog'

export function CreateNoteDialog() {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    // TODO: submit note
    console.log({ title, content })
  }

  return (
    <Dialog>
      <DialogTrigger render={<Button />}>Create Note</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Note</DialogTitle>
          <DialogDescription>Add a new note to your collection.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="note-title" className="text-sm font-medium">
                            Title
            </label>
            <input
              id="note-title"
              type="text"
              placeholder="Note title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="rounded-md border border-input bg-background px-3 py-2 text-sm outline-none ring-offset-background placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label htmlFor="note-content" className="text-sm font-medium">
                            Content
            </label>
            <textarea
              id="note-content"
              placeholder="Write your note…"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={4}
              className="rounded-md border border-input bg-background px-3 py-2 text-sm outline-none ring-offset-background placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 resize-none"
            />
          </div>
          <DialogFooter showCloseButton>
            <Button type="submit">Create Note</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
