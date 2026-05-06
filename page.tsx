import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  Building2,
  Calendar,
  Cloud,
  Code2,
  Download,
  FileText,
  Link2,
  Lock,
  Quote,
  ShieldAlert,
  Tag,
  Users,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Parallelogram } from "@/components/brand/parallelogram";
import { formatBytes, formatDate, initials, sensitivityLabel } from "@/lib/utils";
import type { EngagementDetail } from "@/types";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost";

async function getEngagement(id: string): Promise<EngagementDetail | null> {
  try {
    const res = await fetch(`${API_BASE}/api/engagements/${id}`, { cache: "no-store" });
    if (!res.ok) return null;
    return (await res.json()) as EngagementDetail;
  } catch {
    return null;
  }
}

function sensitivityIcon(tier: string) {
  switch (tier) {
    case "confidential":
      return <Lock className="h-3.5 w-3.5" />;
    case "restricted":
    case "embargoed":
      return <ShieldAlert className="h-3.5 w-3.5" />;
    default:
      return <Tag className="h-3.5 w-3.5" />;
  }
}

export default async function EngagementPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const eng = await getEngagement(id);
  if (!eng) notFound();

  return (
    <>
      {/* Masthead */}
      <section className="border-b border-pwc-mist bg-white">
        <div className="container pt-8">
          <Link
            href="/search"
            className="inline-flex items-center gap-1 text-xs font-medium text-pwc-steel hover:text-pwc-orange"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to search
          </Link>
        </div>
        <div className="container grid gap-10 py-10 md:grid-cols-12">
          <div className="md:col-span-8">
            <div className="flex flex-wrap items-center gap-2">
              {eng.industry && <Badge variant="orange">{eng.industry}</Badge>}
              {eng.use_case && <Badge>{eng.use_case}</Badge>}
              {eng.function && <Badge variant="outline">{eng.function}</Badge>}
            </div>
            <div className="mt-4 text-sm uppercase tracking-wider text-pwc-steel">
              {eng.client_display}
            </div>
            <h1 className="mt-3 font-display text-4xl font-semibold leading-[1.05] tracking-tightest md:text-6xl">
              {eng.name}
            </h1>
            {eng.full_summary && (
              <p className="mt-6 max-w-2xl text-base leading-relaxed text-pwc-steel md:text-lg">
                {eng.full_summary}
              </p>
            )}

            {eng.business_outcomes && (
              <div className="mt-8 border-l-4 border-pwc-orange bg-pwc-cream p-6">
                <div className="text-xs font-semibold uppercase tracking-[0.18em] text-pwc-orange">
                  Business outcomes
                </div>
                <p className="mt-3 text-sm leading-relaxed text-pwc-ink">{eng.business_outcomes}</p>
              </div>
            )}
          </div>

          <aside className="md:col-span-4">
            <div className="border border-pwc-mist bg-white p-6">
              <div className="text-xs font-semibold uppercase tracking-[0.18em] text-pwc-orange">
                Engagement context
              </div>
              <dl className="mt-5 space-y-4 text-sm">
                <div>
                  <dt className="flex items-center gap-2 text-pwc-steel">
                    <Building2 className="h-3.5 w-3.5" />
                    Client
                  </dt>
                  <dd className="mt-1 font-medium text-pwc-ink">{eng.client_display}</dd>
                </div>
                <div>
                  <dt className="flex items-center gap-2 text-pwc-steel">
                    <Calendar className="h-3.5 w-3.5" />
                    Added
                  </dt>
                  <dd className="mt-1 font-medium text-pwc-ink">{formatDate(eng.created_at)}</dd>
                </div>
                {eng.platforms.length > 0 && (
                  <div>
                    <dt className="flex items-center gap-2 text-pwc-steel">
                      <Tag className="h-3.5 w-3.5" />
                      Platforms
                    </dt>
                    <dd className="mt-1 flex flex-wrap gap-1.5">
                      {eng.platforms.map((p) => (
                        <span key={p} className="rounded-full bg-pwc-cream px-2.5 py-0.5 text-xs">
                          {p}
                        </span>
                      ))}
                    </dd>
                  </div>
                )}
                {eng.tech_stack.length > 0 && (
                  <div>
                    <dt className="flex items-center gap-2 text-pwc-steel">
                      <Code2 className="h-3.5 w-3.5" />
                      Tech stack
                    </dt>
                    <dd className="mt-1 flex flex-wrap gap-1.5">
                      {eng.tech_stack.map((t) => (
                        <span key={t} className="rounded-full border border-pwc-mist px-2.5 py-0.5 text-xs">
                          {t}
                        </span>
                      ))}
                    </dd>
                  </div>
                )}
                {eng.cloud_providers.length > 0 && (
                  <div>
                    <dt className="flex items-center gap-2 text-pwc-steel">
                      <Cloud className="h-3.5 w-3.5" />
                      Cloud
                    </dt>
                    <dd className="mt-1 flex flex-wrap gap-1.5">
                      {eng.cloud_providers.map((c) => (
                        <span key={c} className="rounded-full bg-pwc-orange-soft px-2.5 py-0.5 text-xs text-pwc-burgundy">
                          {c}
                        </span>
                      ))}
                    </dd>
                  </div>
                )}
                {eng.contributors.length > 0 && (
                  <div>
                    <dt className="flex items-center gap-2 text-pwc-steel">
                      <Users className="h-3.5 w-3.5" />
                      Team ({eng.contributors.length})
                    </dt>
                    <dd className="mt-2 space-y-2">
                      {eng.contributors.map((c) => (
                        <div key={c.id} className="flex items-center gap-2">
                          <div
                            className="flex h-7 w-7 items-center justify-center rounded-full bg-pwc-orange text-[10px] font-bold uppercase text-white"
                            title={c.full_name}
                          >
                            {initials(c.full_name)}
                          </div>
                          <div className="min-w-0">
                            <div className="truncate text-sm font-medium text-pwc-ink">
                              {c.full_name}
                              {c.role_in_engagement === "creator" && (
                                <span className="ml-2 rounded-full bg-pwc-cream px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wider text-pwc-steel">
                                  Creator
                                </span>
                              )}
                            </div>
                            <div className="truncate text-[11px] text-pwc-steel">{c.email}</div>
                          </div>
                        </div>
                      ))}
                    </dd>
                  </div>
                )}
              </dl>
            </div>
            <Parallelogram variant="stack" className="mt-8 hidden h-32 md:block" />
          </aside>
        </div>
      </section>

      {/* Assets */}
      <section className="container py-16">
        <div className="flex items-end justify-between">
          <div>
            <div className="pwc-eyebrow">Collateral & assets</div>
            <h2 className="mt-3 font-display text-3xl font-semibold tracking-tighter md:text-4xl">
              {eng.assets.length} {eng.assets.length === 1 ? "asset" : "assets"}
            </h2>
          </div>
        </div>
        {eng.assets.length === 0 ? (
          <div className="mt-10 border border-dashed border-pwc-mist p-12 text-center text-pwc-steel">
            No assets uploaded yet for this engagement.
          </div>
        ) : (
          <div className="mt-10 grid gap-px bg-pwc-mist">
            {eng.assets.map((a) => {
              const isLink = a.storage_kind === "external_link";
              return (
                <div key={a.id} id={`asset-${a.id}`} className="bg-white p-6">
                  <div className="grid gap-6 md:grid-cols-12">
                    <div className="md:col-span-9">
                      <div className="flex items-center gap-2">
                        {a.asset_type && (
                          <span className="text-xs font-semibold uppercase tracking-wider text-pwc-orange">
                            {a.asset_type}
                          </span>
                        )}
                        {isLink && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-pwc-cream px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-pwc-steel">
                            <Link2 className="h-3 w-3" />
                            External link
                          </span>
                        )}
                        <span className="inline-flex items-center gap-1 rounded-full bg-pwc-cream px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-pwc-steel">
                          {sensitivityIcon(a.sensitivity_tier)}
                          {sensitivityLabel(a.sensitivity_tier)}
                        </span>
                      </div>
                      <h3 className="mt-2 font-display text-xl font-semibold tracking-tight">
                        {a.title}
                      </h3>
                      {a.description && (
                        <p className="mt-2 text-sm leading-relaxed text-pwc-steel">{a.description}</p>
                      )}
                      <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-pwc-steel">
                        {a.uploader_name && <span>Uploaded by {a.uploader_name}</span>}
                        <span>{formatDate(a.uploaded_at)}</span>
                        {a.file_size != null && a.file_size > 0 && <span>{formatBytes(a.file_size)}</span>}
                        {a.download_count > 0 && (
                          <span className="inline-flex items-center gap-1">
                            <Download className="h-3 w-3" />
                            {a.download_count}
                          </span>
                        )}
                      </div>
                      {a.tags.length > 0 && (
                        <div className="mt-3 flex flex-wrap gap-1.5">
                          {a.tags.slice(0, 8).map((t) => (
                            <Badge key={t} variant="outline" className="text-[10px]">
                              {t}
                            </Badge>
                          ))}
                          {a.tags.length > 8 && (
                            <span className="text-[10px] text-pwc-smoke">+{a.tags.length - 8}</span>
                          )}
                        </div>
                      )}
                    </div>
                    <div className="flex items-center md:col-span-3 md:justify-end">
                      <a
                        href={`/api/assets/${a.id}/download`}
                        target={isLink ? "_blank" : undefined}
                        rel={isLink ? "noreferrer" : undefined}
                        className="inline-flex items-center gap-2 border border-pwc-ink px-5 py-2.5 text-sm font-medium text-pwc-ink transition-colors hover:bg-pwc-ink hover:text-white"
                      >
                        {isLink ? <Link2 className="h-4 w-4" /> : <Download className="h-4 w-4" />}
                        {isLink ? "Open link" : "Download"}
                      </a>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Lessons learned */}
      {eng.lessons.length > 0 && (
        <section className="bg-pwc-cream py-16">
          <div className="container">
            <div className="pwc-eyebrow">Lessons learned</div>
            <h2 className="mt-3 font-display text-3xl font-semibold tracking-tighter md:text-4xl">
              What worked, what didn't
            </h2>
            <div className="mt-10 grid gap-6 md:grid-cols-2">
              {eng.lessons.map((l) => (
                <div key={l.id} className="bg-white p-7">
                  <Quote className="h-5 w-5 text-pwc-orange" />
                  <div className="mt-4 space-y-3 text-sm">
                    <div>
                      <div className="text-xs font-semibold uppercase tracking-wider text-pwc-steel">
                        Situation
                      </div>
                      <p className="mt-1 text-pwc-ink">{l.situation}</p>
                    </div>
                    <div>
                      <div className="text-xs font-semibold uppercase tracking-wider text-pwc-steel">
                        Action
                      </div>
                      <p className="mt-1 text-pwc-ink">{l.action}</p>
                    </div>
                    <div>
                      <div className="text-xs font-semibold uppercase tracking-wider text-pwc-steel">
                        Outcome
                      </div>
                      <p className="mt-1 text-pwc-ink">{l.outcome}</p>
                    </div>
                    {l.platform_specific_notes && (
                      <div>
                        <div className="text-xs font-semibold uppercase tracking-wider text-pwc-steel">
                          Platform notes
                        </div>
                        <p className="mt-1 text-pwc-ink">{l.platform_specific_notes}</p>
                      </div>
                    )}
                  </div>
                  {l.created_by_name && (
                    <div className="mt-5 border-t border-pwc-mist pt-4 text-xs text-pwc-steel">
                      — {l.created_by_name} • {formatDate(l.created_at)}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA strip */}
      <section className="container py-16">
        <div className="flex flex-col items-start justify-between gap-4 border-t border-pwc-mist pt-10 md:flex-row md:items-center">
          <div>
            <h3 className="font-display text-xl font-semibold tracking-tight">
              Working on something similar?
            </h3>
            <p className="mt-1 text-sm text-pwc-steel">
              Add your engagement to the portal so the next pursuit can build on it.
            </p>
          </div>
          <Link
            href="/upload/login"
            className="inline-flex items-center gap-2 bg-pwc-ink px-6 py-3 text-sm font-medium text-white hover:bg-pwc-orange"
          >
            Contribute
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </>
  );
}
