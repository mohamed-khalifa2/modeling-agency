"use client";

import { useState, type FormEvent } from "react";
import { toast } from "sonner";
import { updateSiteSettings } from "@/lib/actions/site-settings";
import type { SiteSettings } from "@/types";
import {
  FieldError,
  inputClass,
  labelClass,
  primaryButtonClass,
  textareaClass,
} from "@/components/admin/styles";

export function SettingsForm({ settings }: { settings: SiteSettings | null }) {
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [pending, setPending] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setFieldErrors({});

    const result = await updateSiteSettings(new FormData(event.currentTarget));
    setPending(false);

    if (result.status === "error") {
      if (result.fieldErrors) {
        setFieldErrors(result.fieldErrors);
      } else {
        toast.error(result.message ?? "Something went wrong.");
      }
      return;
    }

    toast.success(result.message ?? "Saved.");
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl space-y-10" noValidate>
      <section className="space-y-4">
        <h2 className="text-sm font-medium">Agency</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="agency_name" className={labelClass}>
              Agency name
            </label>
            <input
              id="agency_name"
              name="agency_name"
              type="text"
              defaultValue={settings?.agency_name ?? ""}
              required
              className={inputClass}
            />
            <FieldError message={fieldErrors.agency_name} />
          </div>
          <div>
            <label htmlFor="tagline" className={labelClass}>
              Tagline
            </label>
            <input
              id="tagline"
              name="tagline"
              type="text"
              defaultValue={settings?.tagline ?? ""}
              className={inputClass}
            />
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="logo_url" className={labelClass}>
              Logo URL
            </label>
            <input
              id="logo_url"
              name="logo_url"
              type="url"
              defaultValue={settings?.logo_url ?? ""}
              className={inputClass}
            />
          </div>
          <div>
            <label htmlFor="footer_text" className={labelClass}>
              Footer text
            </label>
            <input
              id="footer_text"
              name="footer_text"
              type="text"
              defaultValue={settings?.footer_text ?? ""}
              className={inputClass}
            />
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-sm font-medium">Contact</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="email" className={labelClass}>
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              defaultValue={settings?.email ?? ""}
              className={inputClass}
            />
            <FieldError message={fieldErrors.email} />
          </div>
          <div>
            <label htmlFor="phone" className={labelClass}>
              Phone
            </label>
            <input
              id="phone"
              name="phone"
              type="text"
              defaultValue={settings?.phone ?? ""}
              className={inputClass}
            />
          </div>
          <div>
            <label htmlFor="whatsapp" className={labelClass}>
              WhatsApp
            </label>
            <input
              id="whatsapp"
              name="whatsapp"
              type="text"
              defaultValue={settings?.whatsapp ?? ""}
              className={inputClass}
            />
          </div>
          <div>
            <label htmlFor="address" className={labelClass}>
              Address
            </label>
            <input
              id="address"
              name="address"
              type="text"
              defaultValue={settings?.address ?? ""}
              className={inputClass}
            />
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-sm font-medium">Social</h2>
        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <label htmlFor="instagram" className={labelClass}>
              Instagram
            </label>
            <input
              id="instagram"
              name="instagram"
              type="url"
              defaultValue={settings?.instagram ?? ""}
              className={inputClass}
            />
          </div>
          <div>
            <label htmlFor="facebook" className={labelClass}>
              Facebook
            </label>
            <input
              id="facebook"
              name="facebook"
              type="url"
              defaultValue={settings?.facebook ?? ""}
              className={inputClass}
            />
          </div>
          <div>
            <label htmlFor="tiktok" className={labelClass}>
              TikTok
            </label>
            <input
              id="tiktok"
              name="tiktok"
              type="url"
              defaultValue={settings?.tiktok ?? ""}
              className={inputClass}
            />
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-sm font-medium">SEO</h2>
        <div>
          <label htmlFor="seo_title" className={labelClass}>
            SEO title
          </label>
          <input
            id="seo_title"
            name="seo_title"
            type="text"
            defaultValue={settings?.seo_title ?? ""}
            className={inputClass}
          />
        </div>
        <div>
          <label htmlFor="seo_description" className={labelClass}>
            SEO description
          </label>
          <textarea
            id="seo_description"
            name="seo_description"
            rows={3}
            defaultValue={settings?.seo_description ?? ""}
            className={textareaClass}
          />
        </div>
      </section>

      <div>
        <button
          type="submit"
          disabled={pending}
          className={primaryButtonClass}
        >
          {pending ? "Saving…" : "Save settings"}
        </button>
      </div>
    </form>
  );
}
