
"use client"

import * as React from "react"
import * as ProgressPrimitive from "@radix-ui/react-progress"

import { cn } from "@/lib/utils"

const Progress = React.forwardRef<
  React.ElementRef<typeof ProgressPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root>
>(({ className, value, ...props }, ref) => {
    const color = `hsl(${((value || 0) * 1.2)}, 80%, 45%)` // 0 = red, 120 = green

    return (
        <ProgressPrimitive.Root
            ref={ref}
            className={cn(
            "relative h-2 w-full overflow-hidden rounded-full bg-secondary",
            className
            )}
            {...props}
        >
            <ProgressPrimitive.Indicator
            className="h-full w-full flex-1 transition-all"
            style={{ 
                backgroundColor: color,
                transform: `translateX(-${100 - (value || 0)}%)` 
            }}
            />
        </ProgressPrimitive.Root>
    )
})
Progress.displayName = ProgressPrimitive.Root.displayName

export { Progress }

