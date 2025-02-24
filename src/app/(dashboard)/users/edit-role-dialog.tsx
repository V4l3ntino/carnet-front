import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface EditRoleDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  currentRole: string
  onSubmit: (newRole: string) => void
}

const availableRoles = [
  { id: "1", name: "Admin" },
  { id: "2", name: "Profesor" },
  { id: "3", name: "Alumno" },
  { id: "4", name: "Sin rol" },
]

export function EditRoleDialog({ open, onOpenChange, currentRole, onSubmit }: EditRoleDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit User Role</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <label htmlFor="role" className="text-sm font-medium">
              Select Role
            </label>
            <Select
              defaultValue={currentRole}
              onValueChange={(value) => {
                onSubmit(value)
                onOpenChange(false)
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a role" />
              </SelectTrigger>
              <SelectContent>
                {availableRoles.map((role) => (
                  <SelectItem key={role.id} value={role.name}>
                    {role.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

