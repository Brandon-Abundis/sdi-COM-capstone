import { useState } from "react";
import { createUserGoal } from "../api/userGoals";

const GOAL_TYPE_FIELDS = {
  aerobic: ["name", "type", "time", "distance", "notes"],
  strength: ["name", "type", "reps", "weight", "muscle_group", "notes"],
  hypertrophy: ["name", "type", "reps", "weight", "muscle_group", "notes"],
  amrap: ["name", "type", "time", "reps", "weight", "muscle_group", "notes"],
};

const GOAL_TYPES = Object.keys(GOAL_TYPE_FIELDS);

const FIELD_CONFIG = {
  name: {
    label: "Goal Name",
    type: "text",
    placeholder: "e.g., PR for 2 mile run!",
    required: true,
  },
  type: {
    label: "Goal Type",
    type: "select",
    required: true,
  },
  time: {
    label: "Target Time (seconds)",
    type: "number",
    placeholder: "e.g., 300",
    min: "0",
  },
  distance: {
    label: "Target Distance (miles)",
    type: "number",
    placeholder: "e.g., 5",
    min: "0",
  },
  reps: {
    label: "Target Reps",
    type: "number",
    placeholder: "e.g., 10",
    step: "1",
    min: "0",
  },
  weight: {
    label: "Target Weight (lbs)",
    type: "number",
    placeholder: "e.g., 225",
    step: "0.5",
    min: "0",
  },
  muscle_group: {
    label: "Focus Area",
    type: "text",
    placeholder: "e.g., Chest, Back, Legs",
  },
  notes: {
    label: "Notes",
    type: "textarea",
    placeholder: "Additional notes for this goal...",
  },
};

export default function AddNewGoalModal({
  isOpen,
  onClose,
  userId,
  onGoalCreated,
}) {
  const [formData, setFormData] = useState({
    name: "",
    type: "aerobic",
    time: "",
    distance: "",
    reps: "",
    weight: "",
    muscle_group: "",
    notes: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  if (!isOpen) return null;

  const selectedType = formData.type;
  const visibleFields = GOAL_TYPE_FIELDS[selectedType] || [];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      setError("Goal name is required");
      return;
    }

    if (!formData.type) {
      setError("Goal type is required");
      return;
    }

    setSubmitting(true);
    try {
      const goalPayload = {
        user_id: userId,
        name: formData.name.trim(),
        type: formData.type,
        /* Only include fields that are visible for this type */
        ...(visibleFields.includes("time") &&
          formData.time && { time: parseInt(formData.time) }),
        ...(visibleFields.includes("distance") &&
          formData.distance && { distance: parseFloat(formData.distance) }),
        ...(visibleFields.includes("reps") &&
          formData.reps && { reps: parseInt(formData.reps) }),
        ...(visibleFields.includes("weight") &&
          formData.weight && { weight: parseFloat(formData.weight) }),
        ...(visibleFields.includes("muscle_group") &&
          formData.muscle_group && {
            muscle_group: formData.muscle_group.trim(),
          }),
        ...(visibleFields.includes("notes") &&
          formData.notes && { notes: formData.notes.trim() }),
      };

      const newGoal = await createUserGoal(goalPayload);
      onGoalCreated(newGoal);
      handleClose();
    } catch (err) {
      setError(err.message || "Failed to create goal");
    } finally {
      setSubmitting(false);
    }
  };

  const handleClose = () => {
    setFormData({
      name: "",
      type: "aerobic",
      time: "",
      distance: "",
      reps: "",
      weight: "",
      muscle_group: "",
      notes: "",
    });
    setError(null);
    onClose();
  };

  const renderField = (fieldName) => {
    const config = FIELD_CONFIG[fieldName];
    if (!config) return null;

    if (config.type === "select") {
      return (
        <div key={fieldName} className="form-control">
          <label className="label">
            <span className="label-text font-semibold text-base-content">
              {config.label}
              {config.required && <span className="text-error"> *</span>}
            </span>
          </label>
          <select
            name={fieldName}
            value={formData[fieldName]}
            onChange={handleInputChange}
            className="select w-full bg-base-100 text-base-content"
          >
            {GOAL_TYPES.map((type) => (
              <option key={type} value={type} className="capitalize">
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </option>
            ))}
          </select>
        </div>
      );
    }

    if (config.type === "textarea") {
      return (
        <div key={fieldName} className="form-control">
          <label className="label">
            <span className="label-text font-semibold text-base-content">
              {config.label}
            </span>
          </label>
          <textarea
            name={fieldName}
            value={formData[fieldName]}
            onChange={handleInputChange}
            placeholder={config.placeholder}
            className="textarea w-full bg-base-100 text-base-content"
            rows="3"
          />
        </div>
      );
    }

    return (
      <div key={fieldName} className="form-control">
        <label className="label">
          <span className="label-text font-semibold text-base-content">
            {config.label}
            {config.required && <span className="text-error"> *</span>}
          </span>
        </label>
        <input
          type={config.type}
          name={fieldName}
          value={formData[fieldName]}
          onChange={handleInputChange}
          placeholder={config.placeholder}
          step={config.step}
          min={config.min}
          className="input w-full bg-base-100 text-base-content"
        />
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div className="bg-base-200 border border-base-300 rounded-2xl p-6 w-full max-w-md max-h-[90vh] flex flex-col gap-4 shadow-xl overflow-y-auto">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-primary tracking-wide">
            Add New Goal
          </h2>
          <button
            onClick={handleClose}
            className="text-base-content/50 hover:text-primary cursor-pointer text-xl transition-colors"
          >
            ✕
          </button>
        </div>

        {error && (
          <div className="alert alert-error">
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          {/* Name and Type always shown */}
          {renderField("name")}
          {renderField("type")}

          {/* Dynamic fields based on type */}
          <div className="divider my-2">
            <span className="text-xs text-base-content/60">
              {selectedType.charAt(0).toUpperCase() + selectedType.slice(1)}{" "}
              Goal Details
            </span>
          </div>

          {visibleFields.map((fieldName) => {
            if (fieldName === "name" || fieldName === "type") return null;
            return renderField(fieldName);
          })}

          <div className="flex gap-2 pt-4 border-t border-base-300">
            <button
              type="submit"
              disabled={submitting}
              className="btn btn-sm btn-primary flex-1"
            >
              {submitting ? "Creating..." : "Create Goal"}
            </button>
            <button
              type="button"
              onClick={handleClose}
              className="btn btn-sm btn-ghost flex-1"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
