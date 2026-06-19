import { SignOutButton } from "@clerk/nextjs"

const Home = () => {
  return (
    <div className="flex justify-center items-center w-full">
        <SignOutButton/>
    </div>
  )
}

export default Home