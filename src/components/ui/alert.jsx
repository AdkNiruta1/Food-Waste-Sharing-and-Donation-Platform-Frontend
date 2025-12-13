"use client";

import * as React from "react";
import { cva } from "class-variance-authority";
import { cn } from "../../resources/utils";

const alertVariants = cva(
  "relative w-full rounded-lg border p-4 [&>svg~*]:pl-7 [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg]:text-current",
  {
    variants: {
      variant: {
        default: "bg-white text-slate-900 border-slate-200 dark:bg-slate-900 dark:text-slate-50 dark:border-slate-700",
        destructive:
          "border-red-600/50 text-red-700 dark:border-red-500/50 dark:text-red-400 bg-red-50/50 dark:bg-red-900/20",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

const Alert = React.forwardRef((props, ref) => {
  const { className, variant, ...rest } = props;

  return (
    <div
      ref={ref}
      role="alert"
      className={cn(alertVariants({ variant }), className)}
      {...rest}
    />
  );
});
Alert.displayName = "Alert";

const AlertTitle = React.forwardRef((props, ref) => {
  const { className, ...rest } = props;

  return (
    <h5
      ref={ref}
      className={cn("mb-1 font-medium leading-none tracking-tight", className)}
      {...rest}
    />
  );
});
AlertTitle.displayName = "AlertTitle";

const AlertDescription = React.forwardRef((props, ref) => {
  const { className, ...rest } = props;

  return (
    <div
      ref={ref}
      className={cn("text-sm [&_p]:leading-relaxed text-slate-600 dark:text-slate-400", className)}
      {...rest}
    />
  );
});
AlertDescription.displayName = "AlertDescription";

export { Alert, AlertTitle, AlertDescription };