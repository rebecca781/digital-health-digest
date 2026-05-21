"use client";

import { useState } from "react";

type FormState = "idle" | "submitting" | "success";

const SUBJECTS = [
  { value: "", label: "Select a subject" },
  { value: "general", label: "General question" },
  { value: "suggestion", label: "Review suggestion" },
  { value: "press", label: "Press inquiry" },
  { value: "other", label: "Other" },
];

export default function ContactForm() {
  const [state, setState] = useState<FormState>("idle");

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setState("submitting");
    // Simulate network delay; replace with real API call when backend is wired up.
    setTimeout(() => setState("success"), 800);
  }

  if (state === "success") {
    return (
      <div
        className="border border-[#d4e8c0] bg-[#EAF3DE] px-8 py-10"
        style={{ borderWidth: "0.5px" }}
      >
        <p className="font-serif text-xl text-[#111111] mb-2">Message sent</p>
        <p className="text-sm text-[#555555] leading-relaxed">
          Thanks for reaching out. We typically respond within 2 business days.
        </p>
      </div>
    );
  }

  const inputClass =
    "w-full border border-[#d0d0d0] bg-white px-4 py-2.5 text-sm text-[#111111] placeholder-[#bbbbbb] focus:outline-none focus:border-[#3B6D11] transition-colors";

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-6">
      {/* Name */}
      <div className="flex flex-col gap-1.5">
        <label htmlFor="name" className="text-xs font-medium text-[#444444] uppercase tracking-wider">
          Name
        </label>
        <input
          id="name"
          name="name"
          type="text"
          required
          autoComplete="name"
          placeholder="Your name"
          className={inputClass}
          style={{ borderWidth: "0.5px" }}
        />
      </div>

      {/* Email */}
      <div className="flex flex-col gap-1.5">
        <label htmlFor="email" className="text-xs font-medium text-[#444444] uppercase tracking-wider">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          autoComplete="email"
          placeholder="you@example.com"
          className={inputClass}
          style={{ borderWidth: "0.5px" }}
        />
      </div>

      {/* Subject */}
      <div className="flex flex-col gap-1.5">
        <label htmlFor="subject" className="text-xs font-medium text-[#444444] uppercase tracking-wider">
          Subject
        </label>
        <div className="relative">
          <select
            id="subject"
            name="subject"
            required
            defaultValue=""
            className={`${inputClass} appearance-none pr-8 cursor-pointer`}
            style={{ borderWidth: "0.5px" }}
          >
            {SUBJECTS.map((s) => (
              <option key={s.value} value={s.value} disabled={s.value === ""}>
                {s.label}
              </option>
            ))}
          </select>
          {/* chevron */}
          <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#aaaaaa] text-xs">
            ▾
          </span>
        </div>
      </div>

      {/* Message */}
      <div className="flex flex-col gap-1.5">
        <label htmlFor="message" className="text-xs font-medium text-[#444444] uppercase tracking-wider">
          Message
        </label>
        <textarea
          id="message"
          name="message"
          required
          rows={6}
          placeholder="Your message…"
          className={`${inputClass} resize-y`}
          style={{ borderWidth: "0.5px" }}
        />
      </div>

      {/* Submit */}
      <div className="flex flex-col gap-3">
        <button
          type="submit"
          disabled={state === "submitting"}
          className="self-start bg-[#3B6D11] text-white text-sm font-medium px-6 py-2.5 hover:bg-[#27500A] transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {state === "submitting" ? "Sending…" : "Send message"}
        </button>
        <p className="text-xs text-[#999999]">
          We typically respond within 2 business days.
        </p>
      </div>
    </form>
  );
}
