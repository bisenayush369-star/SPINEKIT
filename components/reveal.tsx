import * as React from "react"

import { cn } from "@/lib/utils"

type RevealProps = React.HTMLAttributes<HTMLDivElement> & {
  delay?: number
}

export function Reveal({
  className,
  children,
  delay,
  style,
  ...props
}: RevealProps) {
  return (
    <div
      className={cn("transition-all duration-300 ease-out", className)}
      style={{ ...style, transitionDelay: delay ? `${delay}ms` : undefined }}
      {...props}
    >
      {children}
    </div>
  )
}
