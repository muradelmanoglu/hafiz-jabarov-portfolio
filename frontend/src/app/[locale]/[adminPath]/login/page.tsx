'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { adminApi, setTokens } from '@/lib/api'
import { Lock, Eye, EyeOff } from 'lucide-react'
import { useTranslations } from 'next-intl'

export default function AdminLoginPage({ params }: { params: { locale: string; adminPath: string } }) {
  const t = useTranslations('admin.login')
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [showPassword, setShowPassword] = useState(false)

  const schema = z.object({
    username: z.string().min(1, t('errors.usernameRequired')),
    password: z.string().min(1, t('errors.passwordRequired')),
  })

  type FormData = z.infer<typeof schema>

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  const onSubmit = async (data: FormData) => {
    setError(null)
    try {
      const res = await adminApi.login(data.username, data.password)
      const { accessToken, refreshToken } = res.data.data!
      setTokens(accessToken, refreshToken)
      router.push(`/${params.locale}/${params.adminPath}/dashboard`)
    } catch (err: unknown) {
      const axiosErr = err as { response?: { status?: number } }
      if (axiosErr?.response?.status === 401) {
        setError(t('errors.invalid'))
      } else if (axiosErr?.response?.status === 423) {
        setError(t('errors.locked'))
      } else if (axiosErr?.response?.status === 429) {
        setError(t('errors.rateLimit'))
      } else {
        setError(t('errors.generic'))
      }
    }
  }

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-blue-900/50 rounded-2xl mb-4">
            <Lock className="text-blue-400" size={26} />
          </div>
          <h1 className="text-2xl font-bold text-white">{t('title')}</h1>
          <p className="text-gray-500 text-sm mt-1">{t('subtitle')}</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="card space-y-5">
          <div>
            <label className="block text-sm text-gray-400 mb-1.5">{t('username')}</label>
            <input
              {...register('username')}
              className="input-field"
              placeholder="admin"
              autoComplete="username"
            />
            {errors.username && <p className="text-red-400 text-xs mt-1">{errors.username.message}</p>}
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-1.5">{t('password')}</label>
            <div className="relative">
              <input
                {...register('password')}
                type={showPassword ? 'text' : 'password'}
                className="input-field pr-10"
                placeholder="••••••••"
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {errors.password && <p className="text-red-400 text-xs mt-1">{errors.password.message}</p>}
          </div>

          {error && (
            <div className="bg-red-950/50 border border-red-900 text-red-400 text-sm px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          <button type="submit" disabled={isSubmitting} className="btn-primary w-full">
            {isSubmitting ? t('loading') : t('submit')}
          </button>
        </form>
      </div>
    </div>
  )
}
