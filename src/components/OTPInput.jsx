import { useRef, useEffect } from "react";
import { Input } from "./ui/input";


export function OTPInput({ value, onChange, length = 6 }) {
  const inputRefs = useRef([]);

  useEffect(() => {
    // Focus first input on mount
    inputRefs.current[0]?.focus();
  }, []);

  const handleChange = (index, val) => {
    // Only allow single digit
    if (!/^\d*$/.test(val)) return;

    const newValue = value.split("");
    newValue[index] = val;
    const updatedValue = newValue.join("").slice(0, length);

    onChange(updatedValue);

    // Move to next input if digit entered
    if (val && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace") {
      if (value[index]) {
        // Clear current input
        const newValue = value.split("");
        newValue[index] = "";
        onChange(newValue.join(""));
      } else if (index > 0) {
        // Move to previous input
        inputRefs.current[index - 1]?.focus();
      }
    } else if (e.key === "ArrowLeft" && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === "ArrowRight" && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    const pastedData = e.clipboardData.getData("text").slice(0, length);
    if (/^\d+$/.test(pastedData)) {
      onChange(pastedData);
      e.preventDefault();
    }
  };

  return (
    <div className="flex gap-2">
      {Array.from({ length }).map((_, index) => (
        <Input
          key={index}
          ref={(el) => {
            inputRefs.current[index] = el;
          }}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={value[index] || ""}
          onChange={(e) => handleChange(index, e.target.value)}
          onKeyDown={(e) => handleKeyDown(index, e)}
          onPaste={handlePaste}
          className="w-12 h-12 text-center text-lg font-bold"
        />
      ))}
    </div>
  );
}
