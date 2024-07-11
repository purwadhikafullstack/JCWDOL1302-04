import CardWrapper from "../../_components/card-wrapper"
import { TriangleAlert } from "lucide-react"

const AuthError = () => {
  return (
    <main className="min-h-svh px-8 flex justify-center items-center">
      <CardWrapper
        backButtonLabel="Back to signin"
        backButtonLink="/signin"
      >
        <h2 className="pb-5 font-semibold text-xl text-center">Oops!</h2>
        <div className="w-full pb-1 flex justify-center items-center gap-2 text-red-700">
          <TriangleAlert />
          <p>Email has been registered with credentials!</p>
        </div>
        <p className="text-center">Please signin using credential email and password.</p>
      </CardWrapper>
    </main>
  )
}

export default AuthError
