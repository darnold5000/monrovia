"use client";

import { useState } from "react";

type LocationListFieldProps = {
  name: string;
  label: string;
  help?: string;
  defaultValues: string[];
};

export function LocationListField({ name, label, help, defaultValues }: LocationListFieldProps) {
  const [locations, setLocations] = useState(defaultValues.length ? defaultValues : [""]);

  function updateLocation(index: number, value: string) {
    setLocations((current) => current.map((location, locationIndex) => locationIndex === index ? value : location));
  }

  function removeLocation(index: number) {
    setLocations((current) => current.length === 1 ? [""] : current.filter((_, locationIndex) => locationIndex !== index));
  }

  return (
    <fieldset>
      <legend className="text-sm font-semibold text-barn-navy">{label}</legend>
      {help ? <p className="mt-1.5 text-xs text-stone">{help}</p> : null}
      <div className="mt-3 space-y-3">
        {locations.map((location, index) => (
          <div key={index} className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <input
              name={name}
              value={location}
              onChange={(event) => updateLocation(index, event.target.value)}
              placeholder="Facility, city, state"
              aria-label={`Location ${index + 1}`}
              className="admin-input"
            />
            <button
              type="button"
              onClick={() => removeLocation(index)}
              className="min-h-11 shrink-0 border border-gunmetal px-4 text-sm font-semibold text-barn-navy hover:border-red-500 hover:text-red-700"
              aria-label={`Remove location ${index + 1}`}
            >
              Remove
            </button>
          </div>
        ))}
      </div>
      <button
        type="button"
        onClick={() => setLocations((current) => [...current, ""])}
        className="mt-3 inline-flex min-h-11 items-center border border-gold px-4 py-2 text-sm font-bold text-barn-navy hover:bg-gold/10"
      >
        + Add location
      </button>
    </fieldset>
  );
}
