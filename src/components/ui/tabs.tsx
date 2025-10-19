"use client"

import * as React from "react"
import * as TabsPrimitive from "@radix-ui/react-tabs"

import { cn } from "@/lib/utils"

const Tabs = TabsPrimitive.Root

const TabsList = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>
>(({ className, children, ...props }, ref) => {
  const [sliderStyle, setSliderStyle] = React.useState<{ width?: number; transform?: string }>({});
  const tabsRef = React.useRef<Array<HTMLButtonElement | null>>([]);
  
  const childrenArray = React.Children.toArray(children);
  const activeTabValue = props.value;

  React.useEffect(() => {
    tabsRef.current = tabsRef.current.slice(0, childrenArray.length);
  }, [childrenArray.length]);

  React.useEffect(() => {
    const activeTabIndex = childrenArray.findIndex(
      (child) => (child as React.ReactElement).props.value === activeTabValue
    );

    const activeTabNode = tabsRef.current[activeTabIndex];

    if (activeTabNode) {
      setSliderStyle({
        width: activeTabNode.offsetWidth,
        transform: `translateX(${activeTabNode.offsetLeft}px)`,
      });
    }
  }, [activeTabValue, childrenArray]);

  return (
    <TabsPrimitive.List
      ref={ref}
      className={cn(
        "relative inline-flex h-10 items-center justify-center rounded-lg bg-muted p-1 text-muted-foreground",
        className
      )}
      {...props}
    >
      <div
          className="absolute left-1 top-1 bottom-1 h-auto bg-background rounded-md shadow-sm transition-transform duration-200 ease-in-out"
          style={sliderStyle}
        />
      {childrenArray.map((child, index) => {
         if (React.isValidElement(child)) {
            return React.cloneElement(child, { ref: (el: HTMLButtonElement) => (tabsRef.current[index] = el) } as React.RefAttributes<HTMLButtonElement>);
         }
         return child;
      })}
    </TabsPrimitive.List>
  )
})
TabsList.displayName = TabsPrimitive.List.displayName

const TabsTrigger = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Trigger
    ref={ref}
    className={cn(
      "relative z-10 inline-flex items-center justify-center whitespace-nowrap rounded-md px-4 py-1.5 text-sm font-medium transition-colors duration-200 ease-in-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
      "data-[state=active]:text-foreground data-[state=inactive]:text-muted-foreground data-[state=inactive]:hover:text-foreground",
      className
    )}
    {...props}
  />
))
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName

const TabsContent = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Content
    ref={ref}
    className={cn(
      "mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
      className
    )}
    {...props}
  />
))
TabsContent.displayName = TabsPrimitive.Content.displayName

export { Tabs, TabsList, TabsTrigger, TabsContent }
