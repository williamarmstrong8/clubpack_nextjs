import { CreateClubForm } from "./ui/create-club-form"

export default function CreateClubPage() {
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <CreateClubForm />
      </div>
    </div>
  )
}
