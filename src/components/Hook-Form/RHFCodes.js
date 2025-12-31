import { Stack, TextField } from "@mui/material";
import React, { useRef, useState } from "react";
import { useFormContext, Controller } from "react-hook-form";

const RHFCodes = ({
  keyName = "",
  inputs = [],
  length = 6,
  verifyButtonRef,
}) => {
  const { control, setValue, getValues } = useFormContext();
  const codesRef = useRef(null);
  const [masked, setMasked] = useState(false);

  const focusField = (index) => {
    const input = codesRef.current?.querySelector(
      `input[name="${keyName}${index}"]`
    );
    input?.focus();
  };

  const allFilled = () => {
    const values = getValues();
    return Array.from({ length }).every((_, i) => values[`${keyName}${i + 1}`]);
  };

  const handleChange = (event, onChange, index) => {
    const value = event.target.value.replace(/\D/g, "").slice(0, 1);

    onChange(value);

    if (value && index < length) {
      focusField(index + 1);
    }

    // After last digit
    if (index === length && value) {
      if (allFilled()) {
        setMasked(true);
        verifyButtonRef?.current?.focus();
      }
    }
  };

  const handleKeyDown = (event, index, value) => {
    if (event.key === "Backspace") {
      setMasked(false);
      if (!value && index > 1) {
        focusField(index - 1);
      }
    }
  };

  const handlePaste = (event) => {
    event.preventDefault();

    const pasted = event.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, length);

    pasted.split("").forEach((char, idx) => {
      setValue(`${keyName}${idx + 1}`, char, {
        shouldDirty: true,
        shouldTouch: true,
      });
    });

    if (pasted.length === length) {
      setMasked(true);
      verifyButtonRef?.current?.focus();
    } else {
      focusField(pasted.length + 1);
    }
  };

  return (
    <Stack direction="row" spacing={2} justifyContent="center" ref={codesRef}>
      {inputs.map((_, index) => (
        <Controller
          key={index}
          name={`${keyName}${index + 1}`}
          control={control}
          defaultValue=""
          render={({ field }) => (
            <TextField
              {...field}
              type={masked ? "password" : "text"}
              autoFocus={index === 0}
              placeholder="-"
              onChange={(e) => handleChange(e, field.onChange, index + 1)}
              onKeyDown={(e) => handleKeyDown(e, index + 1, field.value)}
              onPaste={handlePaste}
              onFocus={(e) => e.currentTarget.select()}
              inputProps={{
                maxLength: 1,
                inputMode: "numeric",
                pattern: "[0-9]*",
              }}
              InputProps={{
                sx: {
                  width: { xs: 36, sm: 56 },
                  height: { xs: 36, sm: 56 },
                  "& input": { p: 0, textAlign: "center" },
                },
              }}
            />
          )}
        />
      ))}
    </Stack>
  );
};

export default RHFCodes;
