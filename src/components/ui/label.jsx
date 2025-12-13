import * as React from "react";
import * as LabelPrimitive from "@radix-ui/react-label";
import { cva } from "class-variance-authority";
import { cn } from "../../resources/utils";

const labelVariants = cva(
  "text-sm font-medium leading-none text-slate-900 dark:text-slate-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
);

const Label = React.forwardRef((props, ref) => {
  const { className, ...rest } = props;

  return (
    <LabelPrimitive.Root
      ref={ref}
      className={cn(labelVariants(), className)}
      {...rest}
    />
  );
});

Label.displayName = LabelPrimitive.Root.displayName;

export { Label };