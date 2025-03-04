import { useState } from 'react'
import { motion } from 'framer-motion'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { LucideHeart, LucideGithub } from 'lucide-react'
import clsx from 'clsx'

type FormData = {
  name: string
  email: string
}

function App() {
  const [count, setCount] = useState(0)
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>()
  
  const onSubmit = (data: FormData) => {
    console.log(data)
    toast.success(`Hello, ${data.name}!`)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-100 flex flex-col items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full bg-white rounded-xl shadow-lg p-8"
      >
        <header className="text-center mb-8">
          <h1 className="text-3xl font-bold text-primary-700">
            Vite + React + TypeScript
          </h1>
          <motion.div 
            className="mt-2 flex items-center justify-center gap-2 text-secondary-500"
            whileHover={{ scale: 1.05 }}
          >
            <LucideHeart className="text-red-500" />
            <span>Development Environment</span>
          </motion.div>
        </header>

        <div className="mb-8">
          <div className="flex items-center justify-center mb-4">
            <button
              className={clsx(
                "px-4 py-2 rounded-md transition-all duration-200",
                "bg-primary-600 hover:bg-primary-700 text-white",
                "focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
              )}
              onClick={() => {
                setCount(count + 1)
                toast.success(`Count increased to ${count + 1}!`)
              }}
            >
              Count is {count}
            </button>
          </div>
          <p className="text-sm text-center text-secondary-500">
            Edit <code className="font-mono bg-secondary-100 p-1 rounded">src/App.tsx</code> and save to test HMR
          </p>
        </div>

        <form 
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-4"
        >
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-secondary-700">
              Name
            </label>
            <input
              id="name"
              type="text"
              className={clsx(
                "mt-1 block w-full rounded-md border-secondary-300 shadow-sm",
                "focus:border-primary-500 focus:ring-primary-500",
                errors.name && "border-red-500"
              )}
              {...register("name", { required: "Name is required" })}
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
            )}
          </div>
          
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-secondary-700">
              Email
            </label>
            <input
              id="email"
              type="email"
              className={clsx(
                "mt-1 block w-full rounded-md border-secondary-300 shadow-sm",
                "focus:border-primary-500 focus:ring-primary-500",
                errors.email && "border-red-500"
              )}
              {...register("email", { 
                required: "Email is required",
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: "Invalid email address"
                }
              })}
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
            )}
          </div>
          
          <button
            type="submit"
            className={clsx(
              "w-full px-4 py-2 rounded-md transition-all duration-200",
              "bg-primary-600 hover:bg-primary-700 text-white",
              "focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
            )}
          >
            Submit
          </button>
        </form>
      </motion.div>
      
      <footer className="mt-8 text-secondary-500 flex items-center gap-2">
        <LucideGithub />
        <a 
          href="https://github.com"
          target="_blank"
          rel="noreferrer"
          className="hover:text-primary-600 transition-colors"
        >
          View on GitHub
        </a>
      </footer>
    </div>
  )
}

export default App 