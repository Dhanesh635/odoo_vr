"use client";

import { useState } from "react";
import { Button, Input, Modal } from "@/components/ui";
import { userProfile } from "@/constants/settings";

export default function ProfileForm() {
  const [isOpen, setIsOpen] = useState(false);
  const [form, setForm] = useState({ ...userProfile });
  const [saved, setSaved] = useState(false);

  function handleChange(field: keyof typeof form, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
    setSaved(false);
  }

  function handleSave() {
    setSaved(true);
    setTimeout(() => {
      setSaved(false);
      setIsOpen(false);
    }, 1200);
  }

  return (
    <>
      <Button
        variant="secondary"
        size="sm"
        className="border border-slate-700 hover:border-cyan-400/40 hover:text-cyan-200"
        leftIcon={<EditIcon />}
        onClick={() => setIsOpen(true)}
      >
        Edit Profile
      </Button>

      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Edit Profile"
        className="max-w-xl"
        footer={
          <>
            <Button variant="ghost" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave}>
              {saved ? "✓ Saved" : "Save Changes"}
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <Input
            label="Full Name"
            value={form.name}
            onChange={(e) => handleChange("name", e.target.value)}
          />
          <Input
            label="Email"
            type="email"
            value={form.email}
            onChange={(e) => handleChange("email", e.target.value)}
          />
          <Input
            label="Phone"
            value={form.phone}
            onChange={(e) => handleChange("phone", e.target.value)}
          />
          <Input
            label="Designation"
            value={form.designation}
            onChange={(e) => handleChange("designation", e.target.value)}
          />
          <Input
            label="Company"
            value={form.company}
            disabled
          />
        </div>
      </Modal>
    </>
  );
}

function EditIcon() {
  return (
    <svg
      className="h-4 w-4"
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
    >
      <path
        d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.8"
      />
    </svg>
  );
}
