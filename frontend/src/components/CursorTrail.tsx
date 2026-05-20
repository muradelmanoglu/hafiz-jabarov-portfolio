'use client'

import { useEffect, useRef } from 'react'

export default function CursorTrail() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)

    const points: { x: number; y: number }[] = []
    const MAX_POINTS = 18
    let lastMoveTime = 0
    let animFrame: number

    const onMouseMove = (e: MouseEvent) => {
      lastMoveTime = Date.now()
      points.push({ x: e.clientX, y: e.clientY })
      if (points.length > MAX_POINTS) points.shift()
    }

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      const idle = Date.now() - lastMoveTime > 80

      if (!idle && points.length > 1) {
        for (let i = 1; i < points.length; i++) {
          const t = i / points.length
          ctx.beginPath()
          ctx.moveTo(points[i - 1].x, points[i - 1].y)
          ctx.lineTo(points[i].x, points[i].y)
          ctx.strokeStyle = `rgba(0, 180, 255, ${t * 0.75})`
          ctx.lineWidth = t * 1.8
          ctx.lineCap = 'round'
          ctx.lineJoin = 'round'
          ctx.stroke()
        }
      } else if (idle) {
        points.length = 0
      }

      animFrame = requestAnimationFrame(draw)
    }

    window.addEventListener('mousemove', onMouseMove)
    draw()

    return () => {
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('resize', resize)
      cancelAnimationFrame(animFrame)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 9999, mixBlendMode: 'screen' }}
    />
  )
}
