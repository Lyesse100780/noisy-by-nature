"use client";

import { type FormEvent, type ReactNode, useMemo, useState } from "react";
import SiteNav from "@/components/SiteNav";

type Format = "3U" | "6U" | "7U" | "9U";
type Tolex = "coral-dust" | "sagebloom" | "ash-trail" | "oxblood-mesa" | "frontier-green" | "burnt-leather" | "deep-black";
type Rails = "silver" | "black" | "gold" | "red";
type CaseHeight = "slim" | "classic";

const formats: Format[] = ["3U", "6U", "7U", "9U"];

const tolexOptions: Array<{
  id: Tolex;
  label: string;
  texture?: string;
  accent: string;
}> = [
  {
    id: "coral-dust",
    label: "Coral Dust",
    texture: "/images/tolex-samples/coral-dust.jpeg",
    accent: "#c88375",
  },
  {
    id: "sagebloom",
    label: "Sagebloom",
    texture: "/images/tolex-samples/sagebloom.jpeg",
    accent: "#b99468",
  },
  {
    id: "ash-trail",
    label: "Ash Trail",
    texture: "/images/tolex-samples/ash-trail.jpeg",
    accent: "#cfc2aa",
  },
  {
    id: "oxblood-mesa",
    label: "Oxblood Mesa",
    texture: "/images/tolex-samples/oxblood-mesa.jpeg",
    accent: "#6d2526",
  },
  {
    id: "frontier-green",
    label: "Frontier Green",
    texture: "/images/tolex-samples/frontier-green.jpeg",
    accent: "#314a36",
  },
  {
    id: "burnt-leather",
    label: "Burnt Leather",
    texture: "/images/tolex-samples/burnt-leather.jpeg",
    accent: "#8b4b2d",
  },
  {
    id: "deep-black",
    label: "Back to Black",
    texture: "/images/tolex-samples/back-to-black.jpeg",
    accent: "#14110f",
  },
];

const railOptions: Array<{ id: Rails; label: string; color: string }> = [
  { id: "silver", label: "Silver", color: "#b8b3aa" },
  { id: "black", label: "Black", color: "#11100f" },
  { id: "gold", label: "Gold", color: "#c79b48" },
  { id: "red", label: "Red", color: "#8c2024" },
];

const heightOptions: Array<{ id: CaseHeight; label: string; detail: string }> = [
  { id: "slim", label: "Height slim", detail: "6.5cm / 2.6in" },
  { id: "classic", label: "Height classic", detail: "9cm / 3.5in" },
];

const clampBusboards = (value: number) => Math.max(0, Math.min(4, value));

const calculatePrice = ({
  format,
  hp,
  rows3U,
  rails,
  has1U,
  vesa,
  feet,
  lid,
  powerSupply,
  busboards,
}: {
  format: Format;
  hp: number;
  rows3U: number;
  rails: Rails;
  has1U: boolean;
  vesa: boolean;
  feet: boolean;
  lid: boolean;
  powerSupply: boolean;
  busboards: number;
}) => {
  const rowBase = format === "3U" ? (hp < 84 ? 80 + hp : 100 + hp) : hp > 80 ? 80 + hp * 0.9 : 50 + hp * 0.8;
  const rowMultiplier = format === "9U" ? 2.5 : rows3U;
  const rowsPrice = rowMultiplier * rowBase;
  const large = hp >= 84;

  const railsPerRow =
    rails === "silver" ? 0 : rails === "black" ? (large ? 10 : 5) : large ? 20 : 10;

  const oneUPrice = has1U ? (large ? 50 : 30) : 0;
  const lidPrice = lid ? (large ? 160 : 120) : 0;
  const optionPrice = lidPrice + (vesa ? 20 : 0) + (feet ? 20 : 0) + (powerSupply ? 50 : 0) + busboards * 45;

  return Math.round(rowsPrice + rows3U * railsPerRow + oneUPrice + optionPrice);
};

export default function BespokePage() {
  const [format, setFormat] = useState<Format>("6U");
  const [hp, setHp] = useState(62);
  const [rows3U, setRows3U] = useState(2);
  const [has1U, setHas1U] = useState(false);
  const [tolex, setTolex] = useState<Tolex>("oxblood-mesa");
  const [rails, setRails] = useState<Rails>("black");
  const [caseHeight, setCaseHeight] = useState<CaseHeight>("classic");
  const [lid, setLid] = useState(false);
  const [vesa, setVesa] = useState(false);
  const [feet, setFeet] = useState(false);
  const [powerSupply, setPowerSupply] = useState(false);
  const [busboards, setBusboards] = useState(0);
  const [email, setEmail] = useState("");
  const [notes, setNotes] = useState("");
  const [submitStatus, setSubmitStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [submitMessage, setSubmitMessage] = useState("");
  const [previewPicker, setPreviewPicker] = useState<"tolex" | "rails" | "power" | null>(null);
  const [tolexOpen, setTolexOpen] = useState(false);

  const selectedTolex = tolexOptions.find((option) => option.id === tolex) || tolexOptions[0];
  const selectedRails = railOptions.find((option) => option.id === rails) || railOptions[0];
  const hardwareColor = "#c59a55";
  const compactOnly = hp <= 72;
  const hpProgress = ((hp - 40) / (126 - 40)) * 100;
  const powerAvailable = (format === "6U" || format === "7U" || format === "9U") && hp >= 72;
  const activePowerSupply = powerAvailable && powerSupply;
  const activeBusboards = activePowerSupply ? busboards : 0;

  const estimatedPrice = useMemo(
    () =>
      calculatePrice({
        format,
        hp,
        rows3U,
        rails,
        has1U,
        vesa: compactOnly && vesa,
        feet: compactOnly && feet,
        lid,
        powerSupply: activePowerSupply,
        busboards: activeBusboards,
      }),
    [format, hp, rows3U, rails, has1U, vesa, feet, compactOnly, lid, activePowerSupply, activeBusboards],
  );

  const previewBands = useMemo(() => {
    if (has1U && rows3U === 2) return ["3U", "1U", "3U"] as const;
    if (has1U) return ["1U", "3U"] as const;
    return Array.from({ length: rows3U }, () => "3U" as const);
  }, [has1U, rows3U]);
  const rackWidthCm = hp * 0.5;
  const rackHeightCm = rows3U * 13 + (has1U ? 4.35 : 0);
  const caseFrameCm = 4;
  const previewWidth = `${58 + ((hp - 40) / 86) * 42}%`;
  const previewAspectRatio = `${rackWidthCm + caseFrameCm} / ${rackHeightCm + caseFrameCm}`;

  const handleHpChange = (value: number) => {
    const stepped = Math.round(value / 2) * 2;
    const nextHp = Math.max(40, Math.min(126, stepped));
    setHp(nextHp);

    if (nextHp > 72) {
      setVesa(false);
      setFeet(false);
    }
  };

  const handleFormatChange = (nextFormat: Format) => {
    setFormat(nextFormat);
    if (nextFormat === "3U") {
      setRows3U(1);
      setHas1U(false);
    }
    if (nextFormat === "6U") {
      setRows3U(2);
      setHas1U(false);
    }
    if (nextFormat === "7U") {
      setRows3U(2);
      setHas1U(true);
    }
    if (nextFormat === "9U") {
      setRows3U(3);
      setHas1U(false);
    }
  };

  const openPreviewPicker = (section: "tolex" | "rails" | "power") => {
    setPreviewPicker((current) => (current === section ? null : section));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitStatus("sending");
    setSubmitMessage("");

    try {
      const response = await fetch("/api/bespoke-request", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          notes,
          estimatedPrice,
          configuration: {
            format,
            hp,
            rows3U,
            has1U,
            tolex: selectedTolex.label,
            rails: selectedRails.label,
            caseHeight: heightOptions.find((option) => option.id === caseHeight)?.detail,
            lid,
            vesa: compactOnly && vesa,
            feet: compactOnly && feet,
            powerSupply: activePowerSupply,
            busboards: activeBusboards,
          },
        }),
      });

      const result = (await response.json().catch(() => null)) as { mailtoUrl?: string } | null;

      if (!response.ok || !result?.mailtoUrl) {
        throw new Error("Unable to send request.");
      }

      setSubmitStatus("sent");
      setSubmitMessage("Your request is ready. Please send it from your email client.");
      window.location.href = result.mailtoUrl;
    } catch {
      setSubmitStatus("error");
      setSubmitMessage("Unable to send the request right now. Please try again or email the workshop directly.");
    }
  };

  return (
    <main className="topographic-surface min-h-screen bg-[#1A1410] text-[#F5EBDD]">
      <section className="site-hero relative overflow-hidden bg-[#100b08] text-[#f4ead8] [--hero-desktop-height:24vh] [--hero-mobile-height:8.75rem]">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-100"
          style={{ backgroundImage: "url('/images/brand/background-topography-v2.png')" }}
        />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_44%,rgba(177,105,48,0.09),transparent_32%),linear-gradient(90deg,rgba(8,5,4,0.92),rgba(17,11,8,0.56)_48%,rgba(7,5,4,0.92)),linear-gradient(180deg,rgba(5,4,3,0.62),rgba(15,10,7,0.32)_54%,#1A1410_100%)]" />
        <div className="absolute inset-x-0 bottom-0 h-12 bg-gradient-to-b from-transparent to-[#1A1410]" />

        <SiteNav />

        <div className="site-hero__content relative z-10 mx-auto flex w-full max-w-7xl items-center justify-center px-6 md:px-10 lg:px-14">
          <div className="text-center">
            <h1
              className="[font-family:var(--font-playfair)] text-[clamp(2.35rem,5.2vw,4.85rem)] font-medium uppercase leading-none tracking-[0.18em]"
              style={{
                color: "rgba(219, 198, 168, 0.92)",
                WebkitTextStroke: "0.18px rgba(255, 236, 202, 0.08)",
                textShadow:
                  "0 1px 0 rgba(255, 238, 207, 0.08), 0 -1px 0 rgba(0, 0, 0, 0.72), 0 10px 26px rgba(0, 0, 0, 0.45)",
              }}
            >
              Bespoke
            </h1>
            <div className="mx-auto mt-3 flex w-full max-w-[min(76vw,32rem)] items-center justify-center gap-3 text-[#c38a50]/70 md:mt-4 md:gap-4">
              <span className="hidden h-px flex-1 bg-current opacity-36 sm:block" />
              <p className="[font-family:var(--font-inter)] whitespace-nowrap text-[clamp(0.52rem,1.25vw,0.68rem)] font-medium uppercase leading-none tracking-[0.24em] text-[#d5a06a]/86">
                Workshop configurator
              </p>
              <span className="hidden h-px flex-1 bg-current opacity-36 sm:block" />
            </div>
            <p className="mx-auto mt-3 max-w-[34rem] text-sm font-light leading-6 text-[#e6d9c5]/64 md:text-base">
              Shape the case around your system. Design format, materials, color and options.
            </p>
          </div>
        </div>
      </section>

      <section className="px-6 py-10 md:px-10 md:py-14 lg:px-14">
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.44fr_0.56fr] lg:items-start">
          <form onSubmit={handleSubmit} className="order-2 space-y-8 lg:order-1">
            <ConfigSection title="Format">
              <div className="grid grid-cols-4 gap-2">
                {formats.map((option) => (
                  <button
                    key={option}
                    type="button"
                    onClick={() => handleFormatChange(option)}
                    className={`border px-3 py-3 text-[0.62rem] uppercase tracking-[0.2em] transition ${
                      format === option
                        ? "border-[#d5a06a]/72 bg-[#d5a06a]/10 text-[#efd1a2]"
                        : "border-[#8f5c32]/18 bg-[#120c08]/20 text-[#d5a06a]/68 hover:border-[#d5a06a]/46 hover:text-[#efd1a2]"
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>

              <div className="mt-5">
                <div className="mb-2 flex items-end justify-between gap-4">
                  <label className="[font-family:var(--font-inter)] text-[0.62rem] font-medium uppercase tracking-[0.24em] text-[#d5a06a]/76">
                    Width
                  </label>
                  <span className="text-sm text-[#e6d9c5]/76">{hp}hp</span>
                </div>
                <div className="relative pb-5 pt-6">
                  <span
                    className="pointer-events-none absolute top-0 -translate-x-1/2 [font-family:var(--font-inter)] text-[0.62rem] font-medium uppercase tracking-[0.16em] text-[#efd1a2]"
                    style={{ left: `${hpProgress}%` }}
                  >
                    {hp}hp
                  </span>
                  <input
                    type="range"
                    min={40}
                    max={126}
                    step={2}
                    value={hp}
                    onChange={(event) => handleHpChange(Number(event.target.value))}
                    className="bespoke-range w-full"
                  />
                </div>
                <div className="mt-2 flex justify-between text-[0.62rem] uppercase tracking-[0.18em] text-[#8a7965]">
                  <span>40hp</span>
                  <span>126hp</span>
                </div>
              </div>

              <div className="mt-5 grid grid-cols-2 gap-2">
                {heightOptions.map((option) => (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => setCaseHeight(option.id)}
                    className={`border px-3 py-2.5 text-left transition ${
                      caseHeight === option.id
                        ? "border-[#d5a06a]/72 bg-[#d5a06a]/10"
                        : "border-[#8f5c32]/18 bg-[#120c08]/20 hover:border-[#d5a06a]/46"
                    }`}
                  >
                    <span className="block text-[0.62rem] uppercase tracking-[0.22em] text-[#d5a06a]/76">
                      {option.label}
                    </span>
                    <span className="mt-2 block text-sm text-[#e6d9c5]/70">{option.detail}</span>
                  </button>
                ))}
              </div>
            </ConfigSection>

            <ConfigSection title="Tolex">
              <button
                type="button"
                onClick={() => setTolexOpen((current) => !current)}
                className="flex w-full items-center justify-between gap-4 border border-[#8f5c32]/18 bg-[#120c08]/20 p-2.5 text-left transition hover:border-[#d5a06a]/46"
              >
                <span className="flex min-w-0 items-center gap-3">
                  <span
                    className="block h-10 w-10 shrink-0 border border-[#d5a06a]/20"
                    style={{
                      backgroundColor: selectedTolex.accent,
                      backgroundImage: selectedTolex.texture
                        ? `linear-gradient(135deg,rgba(255,238,207,0.035),rgba(28,18,13,0.08)),linear-gradient(180deg,rgba(26,20,16,0.12),rgba(26,20,16,0.18)),url("${selectedTolex.texture}")`
                        : "linear-gradient(135deg,rgba(255,238,207,0.08),transparent 38%,rgba(0,0,0,0.18))",
                      backgroundPosition: "center",
                      backgroundRepeat: "no-repeat",
                      backgroundSize: "cover",
                    }}
                  />
                  <span>
                    <span className="[font-family:var(--font-inter)] block text-[0.58rem] font-medium uppercase tracking-[0.22em] text-[#d5a06a]/78">
                      Selected finish
                    </span>
                    <span className="mt-1 block truncate text-sm text-[#e6d9c5]/76">{selectedTolex.label}</span>
                  </span>
                </span>
                <span className="[font-family:var(--font-inter)] shrink-0 text-[0.56rem] uppercase tracking-[0.2em] text-[#d5a06a]/70">
                  {tolexOpen ? "Close" : "Change"}
                </span>
              </button>

              {tolexOpen ? (
                <div className="mt-3 grid grid-cols-3 gap-2 sm:grid-cols-4">
                  {tolexOptions.map((option) => (
                    <button
                      key={option.id}
                      type="button"
                      onClick={() => {
                        setTolex(option.id);
                        setTolexOpen(false);
                      }}
                      className={`group border p-1.5 text-left transition duration-300 ${
                        tolex === option.id
                          ? "border-[#d5a06a]/72 bg-[#d5a06a]/10"
                          : "border-[#8f5c32]/18 bg-[#120c08]/20 hover:border-[#d5a06a]/46"
                      }`}
                    >
                      <span
                        className="block aspect-square transition duration-300 group-hover:scale-[1.02]"
                        style={{
                          backgroundColor: option.accent,
                          backgroundImage: option.texture
                            ? `linear-gradient(135deg,rgba(255,238,207,0.035),rgba(28,18,13,0.08)),linear-gradient(180deg,rgba(26,20,16,0.12),rgba(26,20,16,0.18)),url("${option.texture}")`
                            : "linear-gradient(135deg,rgba(255,238,207,0.08),transparent 38%,rgba(0,0,0,0.18))",
                          backgroundPosition: "center",
                          backgroundRepeat: "no-repeat",
                          backgroundSize: "cover",
                        }}
                      />
                      <span className="mt-2 block text-[0.54rem] uppercase leading-tight tracking-[0.14em] text-[#e6d9c5]/76">
                        {option.label}
                      </span>
                    </button>
                  ))}
                </div>
              ) : null}
            </ConfigSection>

            <ConfigSection title="Rails">
              <ChoiceRow label="Rail finish">
                {railOptions.map((option) => (
                  <MaterialButton
                    key={option.id}
                    active={rails === option.id}
                    label={option.label}
                    color={option.color}
                    onClick={() => setRails(option.id)}
                  />
                ))}
              </ChoiceRow>
            </ConfigSection>

            <ConfigSection title="Options">
              <div className="grid gap-2.5">
                <Toggle label="1U row" checked={has1U} onChange={setHas1U} hint={hp >= 84 ? "+EUR 50" : "+EUR 30"} />
                <Toggle label="Lid" checked={lid} onChange={setLid} hint={hp >= 84 ? "+EUR 160" : "+EUR 120"} />
                <Toggle
                  label="VESA 75 mount"
                  checked={compactOnly && vesa}
                  onChange={setVesa}
                  hint={compactOnly ? "+EUR 20 (available until 72hp)" : "available until 72hp"}
                  disabled={!compactOnly}
                />
                <Toggle
                  label="Retractable feet"
                  checked={compactOnly && feet}
                  onChange={setFeet}
                  hint={compactOnly ? "+EUR 20 (available until 72hp)" : "available until 72hp"}
                  disabled={!compactOnly}
                />
                <Toggle
                  label="Meanwell RT-65B power supply"
                  checked={activePowerSupply}
                  onChange={setPowerSupply}
                  hint={powerAvailable ? "+EUR 50" : "available for 6U, 7U and 9U cases from 72hp"}
                  disabled={!powerAvailable}
                />
                <div
                  className={`flex items-center justify-between border px-3 py-3 transition ${
                    activePowerSupply
                      ? "border-[#8f5c32]/18 bg-[#120c08]/20"
                      : "border-[#8f5c32]/10 bg-[#120c08]/12 opacity-46"
                  }`}
                >
                  <div>
                    <p className="[font-family:var(--font-inter)] text-[0.68rem] font-medium uppercase tracking-[0.2em] text-[#e6d9c5]/78">
                      Bus board (20 slots)
                    </p>
                    <p className="mt-1 text-xs text-[#8a7965]">
                      {activePowerSupply ? "+EUR 45 each" : "available with 6U / 7U / 9U power supply from 72hp"}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      disabled={!activePowerSupply}
                      onClick={() => setBusboards((value) => clampBusboards(value - 1))}
                      className="h-9 w-9 border border-[#8f5c32]/24 text-[#d5a06a]/78 transition hover:border-[#d5a06a]/52 hover:text-[#efd1a2] disabled:cursor-not-allowed disabled:hover:border-[#8f5c32]/24 disabled:hover:text-[#d5a06a]/78"
                    >
                      -
                    </button>
                    <span className="w-6 text-center text-sm text-[#e6d9c5]/78">{activeBusboards}</span>
                    <button
                      type="button"
                      disabled={!activePowerSupply}
                      onClick={() => setBusboards((value) => clampBusboards(value + 1))}
                      className="h-9 w-9 border border-[#8f5c32]/24 text-[#d5a06a]/78 transition hover:border-[#d5a06a]/52 hover:text-[#efd1a2] disabled:cursor-not-allowed disabled:hover:border-[#8f5c32]/24 disabled:hover:text-[#d5a06a]/78"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            </ConfigSection>

            <ConfigSection title="Summary">
              <div className="border border-[#8f5c32]/18 bg-[#120c08]/20 px-3 py-3">
                <dl className="grid grid-cols-2 gap-x-4 gap-y-2.5">
                  <SummaryItem label="Format" value={`${format} / ${hp}hp`} />
                  <SummaryItem
                    label="Height"
                    value={heightOptions.find((option) => option.id === caseHeight)?.detail || "-"}
                  />
                  <SummaryItem label="Tolex" value={selectedTolex.label} />
                  <SummaryItem label="Rails" value={selectedRails.label} />
                  <SummaryItem label="1U row" value={has1U ? "Yes" : "No"} />
                  <SummaryItem label="Lid" value={lid ? "Yes" : "No"} />
                  <SummaryItem label="Power" value={activePowerSupply ? "Meanwell RT-65B" : "No"} />
                  <SummaryItem label="Bus board" value={activeBusboards ? `${activeBusboards} x 20 slots` : "No"} />
                  <SummaryItem label="VESA 75 mount" value={compactOnly && vesa ? "Yes" : "No"} />
                  <SummaryItem label="Retractable feet" value={compactOnly && feet ? "Yes" : "No"} />
                </dl>
                <div className="mt-3 flex items-end justify-between border-t border-[#8f5c32]/18 pt-3">
                  <p className="[font-family:var(--font-inter)] text-[0.58rem] font-medium uppercase tracking-[0.28em] text-[#d5a06a]/74">
                    Estimated price
                  </p>
                  <p className="[font-family:var(--font-playfair)] text-2xl font-medium tracking-[0.04em] text-[#e6d3b7]">
                    EUR {estimatedPrice}
                  </p>
                </div>
                <p className="mt-3 border-t border-[#8f5c32]/18 pt-3 text-xs leading-5 text-[#8a7965]">
                  Final quote confirmed manually after workshop review.
                </p>
              </div>
            </ConfigSection>

            <ConfigSection title="Workshop notes">
              <div className="grid gap-4">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="Email"
                  className="border border-[#8f5c32]/20 bg-[#120c08]/24 px-4 py-3 text-sm text-[#F5EBDD] outline-none transition placeholder:text-[#8a7965] focus:border-[#d5a06a]/52"
                />
                <textarea
                  value={notes}
                  onChange={(event) => setNotes(event.target.value)}
                  placeholder="If you have a specific color, pattern, or detail in mind that is not mentioned in the configurator, feel free to ask — almost anything is possible."
                  rows={5}
                  className="resize-none border border-[#8f5c32]/20 bg-[#120c08]/24 px-4 py-3 text-sm leading-7 text-[#F5EBDD] outline-none transition placeholder:text-[#8a7965] focus:border-[#d5a06a]/52"
                />
              </div>
            </ConfigSection>

            <button
              type="submit"
              disabled={submitStatus === "sending"}
              className="[font-family:var(--font-inter)] w-full border border-[#c69054]/46 bg-[#d5a06a]/8 px-6 py-4 text-[0.7rem] font-medium uppercase tracking-[0.24em] text-[#d5a06a] transition hover:border-[#d5a06a]/76 hover:bg-[#d5a06a]/12 hover:text-[#efd1a2]"
            >
              {submitStatus === "sending" ? "Sending Request" : "Submit for Review"}
            </button>
            {submitMessage ? (
              <p
                className={`text-center text-sm leading-6 ${
                  submitStatus === "sent" ? "text-[#d5a06a]/86" : "text-[#d2a08e]"
                }`}
              >
                {submitMessage}
              </p>
            ) : null}
          </form>

          <aside className="order-1 lg:sticky lg:top-8 lg:order-2">
            <div className="sticky top-0 z-20 -mx-6 border-y border-[#8f5c32]/18 bg-[#1A1410]/92 px-6 py-5 backdrop-blur-md md:mx-0 md:border lg:top-8 lg:bg-[#120c08]/34 lg:p-7">
              <div className="bespoke-preview-stage min-h-[20rem] overflow-visible bg-[#0f0a07]/56 px-4 py-8 md:min-h-[28rem] md:px-8 lg:min-h-[34rem]">
                <div className="mx-auto flex h-full min-h-[17rem] max-w-3xl items-center justify-center">
                  <div
                    className="bespoke-case relative transition-[width,transform] duration-500 ease-out"
                    style={{ width: previewWidth, ["--tolex" as string]: selectedTolex.accent }}
                  >
                    {previewPicker ? (
                      <PreviewPicker
                        type={previewPicker}
                        tolex={tolex}
                        rails={rails}
                        powerAvailable={powerAvailable}
                        activePowerSupply={activePowerSupply}
                        activeBusboards={activeBusboards}
                        onClose={() => setPreviewPicker(null)}
                        onSelectTolex={(nextTolex) => {
                          setTolex(nextTolex);
                          setPreviewPicker(null);
                        }}
                        onSelectRails={(nextRails) => {
                          setRails(nextRails);
                          setPreviewPicker(null);
                        }}
                        onTogglePower={() => {
                          if (powerAvailable) setPowerSupply((current) => !current);
                        }}
                        onChangeBusboards={(nextBusboards) => setBusboards(clampBusboards(nextBusboards))}
                      />
                    ) : null}
                    <div
                      className="absolute -inset-4 opacity-70 blur-xl"
                      style={{ background: `radial-gradient(circle at 50% 42%, ${selectedTolex.accent}55, transparent 64%)` }}
                    />
                    <div
                      key={`${tolex}-${rails}-${format}-${has1U}-${activePowerSupply}-${activeBusboards}-${lid}`}
                      className="bespoke-case-shell relative overflow-hidden border transition-colors duration-500"
                      style={{
                        aspectRatio: previewAspectRatio,
                        borderColor: `${hardwareColor}AA`,
                        backgroundColor: selectedTolex.accent,
                        backgroundImage: selectedTolex.texture
                          ? `linear-gradient(135deg,rgba(255,238,207,0.02),rgba(20,12,8,0.08)),linear-gradient(180deg,rgba(20,14,10,0.08),rgba(20,14,10,0.18)),url("${selectedTolex.texture}")`
                          : "linear-gradient(135deg,rgba(255,238,207,0.06),transparent 36%,rgba(0,0,0,0.2)),linear-gradient(180deg,rgba(255,255,255,0.04),rgba(0,0,0,0.16))",
                        backgroundPosition: "center, center, center",
                        backgroundRepeat: selectedTolex.texture ? "no-repeat, no-repeat, repeat" : "no-repeat",
                        backgroundSize: selectedTolex.texture ? "cover, cover, 70% auto" : "cover",
                        boxShadow: `0 34px 90px rgba(0,0,0,0.42), 0 2px 0 rgba(0,0,0,0.5), inset 0 0 0 1px ${hardwareColor}42`,
                      }}
                    >
                      <button
                        type="button"
                        aria-label="Choose tolex finish"
                        onClick={() => openPreviewPicker("tolex")}
                        className="bespoke-preview-hotspot absolute inset-x-0 top-0 z-[34] h-4"
                      />
                      <button
                        type="button"
                        aria-label="Choose tolex finish"
                        onClick={() => openPreviewPicker("tolex")}
                        className="bespoke-preview-hotspot absolute inset-x-0 bottom-0 z-[34] h-4"
                      />
                      <button
                        type="button"
                        aria-label="Choose tolex finish"
                        onClick={() => openPreviewPicker("tolex")}
                        className="bespoke-preview-hotspot absolute inset-y-0 left-0 z-[34] w-4"
                      />
                      <button
                        type="button"
                        aria-label="Choose tolex finish"
                        onClick={() => openPreviewPicker("tolex")}
                        className="bespoke-preview-hotspot absolute inset-y-0 right-0 z-[34] w-4"
                      />
                      <span className="pointer-events-none absolute left-2 top-2 z-[35] border border-[#d5a06a]/22 bg-[#120c08]/58 px-2 py-1 [font-family:var(--font-inter)] text-[0.48rem] font-medium uppercase tracking-[0.18em] text-[#d5a06a]/72 backdrop-blur-sm">
                        click frame / tolex
                      </span>
                      <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,238,207,0.018),transparent_38%,rgba(0,0,0,0.06)),linear-gradient(180deg,rgba(20,14,10,0.04),rgba(20,14,10,0.1))]" />
                      <div className="bespoke-rack-cavity absolute inset-4 overflow-hidden bg-[#0c0a08]/92">
                        <button
                          type="button"
                          aria-label="Choose power and bus board options"
                          onClick={() => openPreviewPicker("power")}
                          className="bespoke-preview-hotspot absolute inset-0 z-[3]"
                        />
                        <span className="pointer-events-none absolute right-2 top-2 z-[29] border border-[#d5a06a]/18 bg-[#070504]/54 px-2 py-1 [font-family:var(--font-inter)] text-[0.48rem] font-medium uppercase tracking-[0.18em] text-[#d5a06a]/68 backdrop-blur-sm">
                          rails
                        </span>
                        <span className="pointer-events-none absolute bottom-2 right-2 z-[29] border border-[#d5a06a]/18 bg-[#070504]/54 px-2 py-1 [font-family:var(--font-inter)] text-[0.48rem] font-medium uppercase tracking-[0.18em] text-[#d5a06a]/68 backdrop-blur-sm">
                          power
                        </span>
                        <div className="relative z-[1] flex h-full flex-col">
                          {compactOnly && vesa ? <VesaMountPattern hardwareColor={hardwareColor} /> : null}
                          {activePowerSupply ? <PowerSupplyBlock rows={previewBands.length} /> : null}
                          {activePowerSupply && activeBusboards > 0 ? (
                            <PowerCableHarness rows={previewBands.length} busboards={activeBusboards} />
                          ) : null}
                          {previewBands.map((band, index) => {
                            const isOneU = band === "1U";
                            const isFirstBand = index === 0;
                            const isLastBand = index === previewBands.length - 1;
                            const hasNextBand = index < previewBands.length - 1;
                            const busboardIndex = previewBands.slice(0, index + 1).filter((previewBand) => previewBand === "3U").length;
                            return (
                              <div
                                key={`${band}-${index}-${previewBands.length}`}
                                className="relative min-h-0 overflow-visible bg-[#080706]/92 shadow-[inset_0_0_18px_rgba(0,0,0,0.68)]"
                                style={{ flex: isOneU ? "4.35 1 0" : "13 1 0" }}
                              >
                                {!isOneU && activeBusboards >= busboardIndex ? (
                                  <BusBoardBlock bandIndex={index} />
                                ) : null}
                                {isFirstBand ? (
                                  <RailBar color={selectedRails.color} position="top" variant="single" onClick={() => openPreviewPicker("rails")} />
                                ) : null}
                                {hasNextBand ? (
                                  <RailBar color={selectedRails.color} position="bottom" variant="double" onClick={() => openPreviewPicker("rails")} />
                                ) : null}
                                {isLastBand ? (
                                  <RailBar color={selectedRails.color} position="bottom" variant="single" onClick={() => openPreviewPicker("rails")} />
                                ) : null}
                                {isOneU ? (
                                  <WitnessModule
                                    kind="1U"
                                    hardwareColor={hardwareColor}
                                    bandIndex={index}
                                    totalBands={previewBands.length}
                                  />
                                ) : (
                                  <>
                                    <div className="absolute inset-x-8 top-1/2 h-px bg-[#f1d9b3]/12" />
                                    <WitnessModule
                                      kind="3U"
                                      hardwareColor={hardwareColor}
                                      bandIndex={index}
                                      totalBands={previewBands.length}
                                    />
                                  </>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                      {lid ? (
                        <div className="absolute -right-3 top-1/2 h-16 w-2 -translate-y-1/2 rounded-full" style={{ background: hardwareColor }} />
                      ) : null}
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-[#8f5c32]/18 pt-3">
                <p className="[font-family:var(--font-inter)] text-[0.62rem] font-medium uppercase tracking-[0.2em] text-[#d5a06a]/74">
                  Estimated price: <span className="text-[#e6d3b7]/90">EUR {estimatedPrice}</span>
                </p>
                <div className="text-[0.62rem] uppercase tracking-[0.2em] text-[#d5a06a]/64">
                  {hp}hp / {rows3U}x3U{has1U ? " + 1U" : ""}
                </div>
              </div>
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}

function ConfigSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="border-t border-[#8f5c32]/18 pt-5">
      <h3 className="[font-family:var(--font-inter)] mb-4 text-[0.62rem] font-medium uppercase tracking-[0.28em] text-[#c69054]/82">
        {title}
      </h3>
      {children}
    </section>
  );
}

function PreviewPicker({
  type,
  tolex,
  rails,
  powerAvailable,
  activePowerSupply,
  activeBusboards,
  onClose,
  onSelectTolex,
  onSelectRails,
  onTogglePower,
  onChangeBusboards,
}: {
  type: "tolex" | "rails" | "power";
  tolex: Tolex;
  rails: Rails;
  powerAvailable: boolean;
  activePowerSupply: boolean;
  activeBusboards: number;
  onClose: () => void;
  onSelectTolex: (tolex: Tolex) => void;
  onSelectRails: (rails: Rails) => void;
  onTogglePower: () => void;
  onChangeBusboards: (busboards: number) => void;
}) {
  return (
    <div className="absolute left-1/2 top-3 z-50 w-[min(22rem,92vw)] -translate-x-1/2 border border-[#8f5c32]/34 bg-[#120c08]/96 p-3 shadow-[0_18px_50px_rgba(0,0,0,0.54)] backdrop-blur-md">
      <div className="mb-3 flex items-center justify-between gap-4">
        <p className="[font-family:var(--font-inter)] text-[0.56rem] font-medium uppercase tracking-[0.24em] text-[#d5a06a]/78">
          {type === "tolex" ? "Tolex finish" : type === "rails" ? "Rail finish" : "Power"}
        </p>
        <button
          type="button"
          onClick={onClose}
          className="[font-family:var(--font-inter)] text-[0.56rem] uppercase tracking-[0.2em] text-[#8a7965] transition hover:text-[#d5a06a]"
        >
          Close
        </button>
      </div>

      {type === "tolex" ? (
        <div className="grid grid-cols-4 gap-2">
          {tolexOptions.map((option) => (
            <button
              key={option.id}
              type="button"
              onClick={() => onSelectTolex(option.id)}
              title={option.label}
              className={`border p-1 transition hover:border-[#d5a06a]/58 ${
                tolex === option.id ? "border-[#d5a06a]/72 bg-[#d5a06a]/10" : "border-[#8f5c32]/20"
              }`}
            >
              <span
                className="block aspect-square"
                style={{
                  backgroundColor: option.accent,
                  backgroundImage: option.texture
                    ? `linear-gradient(135deg,rgba(255,238,207,0.035),rgba(28,18,13,0.08)),linear-gradient(180deg,rgba(26,20,16,0.12),rgba(26,20,16,0.18)),url("${option.texture}")`
                    : "linear-gradient(135deg,rgba(255,238,207,0.08),transparent 38%,rgba(0,0,0,0.18))",
                  backgroundPosition: "center",
                  backgroundRepeat: "no-repeat",
                  backgroundSize: "cover",
                }}
              />
            </button>
          ))}
        </div>
      ) : type === "rails" ? (
        <div className="grid grid-cols-4 gap-2">
          {railOptions.map((option) => (
            <button
              key={option.id}
              type="button"
              onClick={() => onSelectRails(option.id)}
              className={`flex h-11 items-center justify-center border transition hover:border-[#d5a06a]/58 ${
                rails === option.id ? "border-[#d5a06a]/72 bg-[#d5a06a]/10" : "border-[#8f5c32]/20"
              }`}
              title={option.label}
            >
              <span className="h-4 w-10 border border-white/12" style={{ background: option.color }} />
            </button>
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          <button
            type="button"
            disabled={!powerAvailable}
            onClick={onTogglePower}
            className={`flex w-full items-center justify-between border px-3 py-3 text-left transition ${
              activePowerSupply
                ? "border-[#d5a06a]/72 bg-[#d5a06a]/10"
                : "border-[#8f5c32]/20 hover:border-[#d5a06a]/46 disabled:cursor-not-allowed disabled:opacity-45"
            }`}
          >
            <span>
              <span className="[font-family:var(--font-inter)] block text-[0.62rem] font-medium uppercase tracking-[0.18em] text-[#e6d9c5]/78">
                Meanwell RT-65B
              </span>
              <span className="mt-1 block text-xs text-[#8a7965]">
                {powerAvailable ? "+EUR 50" : "Available for 6U / 7U / 9U from 72hp"}
              </span>
            </span>
            <span className="text-xs uppercase tracking-[0.18em] text-[#d5a06a]/78">
              {activePowerSupply ? "Yes" : "No"}
            </span>
          </button>

          <div
            className={`flex items-center justify-between border px-3 py-3 ${
              activePowerSupply ? "border-[#8f5c32]/20" : "border-[#8f5c32]/10 opacity-45"
            }`}
          >
            <div>
              <p className="[font-family:var(--font-inter)] text-[0.62rem] font-medium uppercase tracking-[0.18em] text-[#e6d9c5]/78">
                Bus board
              </p>
              <p className="mt-1 text-xs text-[#8a7965]">20 slots / +EUR 45 each</p>
            </div>
            <div className="flex items-center gap-3">
              <button
                type="button"
                disabled={!activePowerSupply}
                onClick={() => onChangeBusboards(activeBusboards - 1)}
                className="h-8 w-8 border border-[#8f5c32]/24 text-[#d5a06a]/78 disabled:cursor-not-allowed"
              >
                -
              </button>
              <span className="w-5 text-center text-sm text-[#e6d9c5]/78">{activeBusboards}</span>
              <button
                type="button"
                disabled={!activePowerSupply}
                onClick={() => onChangeBusboards(activeBusboards + 1)}
                className="h-8 w-8 border border-[#8f5c32]/24 text-[#d5a06a]/78 disabled:cursor-not-allowed"
              >
                +
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function ChoiceRow({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div>
      <p className="[font-family:var(--font-inter)] mb-3 text-[0.62rem] font-medium uppercase tracking-[0.22em] text-[#e6d9c5]/56">
        {label}
      </p>
      <div className="grid grid-cols-4 gap-2">{children}</div>
    </div>
  );
}

function SummaryItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="[font-family:var(--font-inter)] text-[0.5rem] font-medium uppercase tracking-[0.18em] text-[#8a7965]">
        {label}
      </dt>
      <dd className="mt-0.5 text-xs text-[#e6d9c5]/78">{value}</dd>
    </div>
  );
}

function MaterialButton({
  active,
  label,
  color,
  onClick,
}: {
  active: boolean;
  label: string;
  color: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex min-w-0 items-center gap-2 border px-2.5 py-2.5 text-left transition ${
        active
          ? "border-[#d5a06a]/72 bg-[#d5a06a]/10"
          : "border-[#8f5c32]/18 bg-[#120c08]/20 hover:border-[#d5a06a]/46"
      }`}
    >
      <span className="h-3.5 w-3.5 shrink-0 rounded-full border border-white/12" style={{ background: color }} />
      <span className="truncate text-[0.56rem] uppercase tracking-[0.14em] text-[#e6d9c5]/76">{label}</span>
    </button>
  );
}

function Toggle({
  label,
  checked,
  onChange,
  hint,
  disabled = false,
}: {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  hint?: string;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className={`flex items-center justify-between gap-4 border px-3 py-3 text-left transition ${
        disabled
          ? "cursor-not-allowed border-[#8f5c32]/10 bg-[#120c08]/12 opacity-46"
          : checked
            ? "border-[#d5a06a]/72 bg-[#d5a06a]/10"
            : "border-[#8f5c32]/18 bg-[#120c08]/20 hover:border-[#d5a06a]/46"
      }`}
    >
      <span>
        <span className="[font-family:var(--font-inter)] block text-[0.68rem] font-medium uppercase tracking-[0.2em] text-[#e6d9c5]/78">
          {label}
        </span>
        {hint ? <span className="mt-1 block text-xs text-[#8a7965]">{hint}</span> : null}
      </span>
      <span
        className={`flex h-5 w-5 items-center justify-center border transition ${
          checked && !disabled ? "border-[#d5a06a]/72 bg-[#d5a06a]/20" : "border-[#8f5c32]/28"
        }`}
      >
        {checked && !disabled ? <span className="h-2 w-2 bg-[#d5a06a]" /> : null}
      </span>
    </button>
  );
}

function RailBar({
  color,
  position,
  variant,
  onClick,
}: {
  color: string;
  position: "top" | "bottom";
  variant: "single" | "double";
  onClick?: () => void;
}) {
  const placement =
    variant === "double"
      ? position === "top"
        ? "-top-[11px]"
        : "-bottom-[11px]"
      : position === "top"
        ? "top-0"
        : "bottom-0";
  const nuts = Array.from({ length: 28 }, (_, index) => 3.5 + index * (93 / 27));
  const railShadow = `0 1px 5px rgba(0,0,0,0.62), inset 0 1px 0 rgba(255,255,255,0.18), inset 0 -1px 0 rgba(0,0,0,0.72)`;

  const nutRow = (top: string, keyPrefix: string) => (
    <div className={`absolute left-1.5 right-1.5 ${top} h-[5px] overflow-hidden`}>
      <div className="absolute inset-0 rounded-full bg-black/62 shadow-[inset_0_1px_3px_rgba(0,0,0,0.9)]" />
      {nuts.map((nut) => (
        <span
          key={`${keyPrefix}-${nut.toFixed(2)}`}
          className="absolute top-1/2 h-[3px] w-[3px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-black/45 bg-[#d8d1c4]/88 shadow-[0_0_3px_rgba(255,255,255,0.14)]"
          style={{ left: `${nut}%` }}
        />
      ))}
    </div>
  );

  return (
    <button
      type="button"
      aria-label="Choose rail finish"
      onClick={onClick}
      className={`bespoke-preview-hotspot absolute left-0 right-0 z-10 ${placement} ${variant === "double" ? "h-[22px]" : "h-[14px]"}`}
    >
      {variant === "double" ? (
        <div
          className="bespoke-rail absolute inset-x-0 top-0 h-[22px] overflow-hidden rounded-[2px]"
          style={{ background: color, boxShadow: railShadow }}
        >
          <div className="absolute inset-x-2 top-1 h-px bg-white/18" />
          <div className="absolute inset-x-2 bottom-1 h-px bg-black/62" />
          <div className="absolute left-0 top-1/2 h-px w-full -translate-y-1/2 bg-black/72" />
          <div className="absolute left-0 top-1/2 h-[3px] w-full -translate-y-1/2 bg-white/8" />
          {nutRow("top-[4px]", "upper")}
          {nutRow("bottom-[4px]", "lower")}
          <div className="absolute left-2 top-0 h-full w-3 bg-[linear-gradient(90deg,rgba(255,255,255,0.2),transparent)] opacity-45" />
          <div className="absolute right-2 top-0 h-full w-3 bg-[linear-gradient(270deg,rgba(0,0,0,0.55),transparent)] opacity-65" />
        </div>
      ) : (
        <div
          className="bespoke-rail absolute inset-x-0 top-0 h-[14px] overflow-hidden rounded-[2px]"
          style={{ background: color, boxShadow: railShadow }}
        >
          <div className="absolute inset-x-2 top-1 h-px bg-white/18" />
          <div className="absolute inset-x-2 bottom-1 h-px bg-black/62" />
          {nutRow("top-[5px]", "single")}
          <div className="absolute left-2 top-0 h-full w-3 bg-[linear-gradient(90deg,rgba(255,255,255,0.2),transparent)] opacity-45" />
          <div className="absolute right-2 top-0 h-full w-3 bg-[linear-gradient(270deg,rgba(0,0,0,0.55),transparent)] opacity-65" />
        </div>
      )}
    </button>
  );
}

function PowerSupplyBlock({ rows }: { rows: number }) {
  return (
    <div
      className={`absolute bottom-4 left-4 z-[11] overflow-hidden border border-[#d8d1c4]/36 bg-[#b8b2a8] shadow-[0_10px_24px_rgba(0,0,0,0.42),inset_0_1px_0_rgba(255,255,255,0.5)] ${
        rows >= 3 ? "h-9 w-[22%]" : "h-8 w-[24%]"
      }`}
    >
      <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.28),transparent_32%,rgba(0,0,0,0.18)),repeating-linear-gradient(90deg,rgba(0,0,0,0.28)_0_2px,transparent_2px_6px)]" />
      <div className="absolute left-2 right-2 top-2 h-px bg-white/42" />
      <div className="absolute bottom-2 left-2 right-2 h-px bg-black/26" />
    </div>
  );
}

function PowerCableHarness({ rows, busboards }: { rows: number; busboards: number }) {
  const rowCount = Math.max(1, rows);
  const boardCount = Math.min(busboards, rowCount);

  return (
    <svg
      className="pointer-events-none absolute inset-0 z-[5] h-full w-full"
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      {Array.from({ length: boardCount }).map((_, index) => {
        const targetY = ((index + 0.5) / rowCount) * 100;
        const sourceY = rows >= 3 ? 84 : 82;
        const controlY = (sourceY + targetY) / 2;
        const stagger = index % 2 === 0 ? 0 : 3;

        return (
          <g key={index} opacity="0.82">
            <path
              d={`M 20 ${sourceY} C ${30 + stagger} ${controlY + 8}, ${34 + stagger} ${controlY - 6}, ${index % 2 === 0 ? 26 : 36} ${targetY}`}
              fill="none"
              stroke="rgba(210, 188, 138, 0.72)"
              strokeWidth="0.65"
              strokeLinecap="round"
            />
            <path
              d={`M 22 ${sourceY + 1.5} C ${32 + stagger} ${controlY + 10}, ${37 + stagger} ${controlY - 4}, ${index % 2 === 0 ? 28 : 38} ${targetY + 1.5}`}
              fill="none"
              stroke="rgba(174, 70, 52, 0.68)"
              strokeWidth="0.58"
              strokeLinecap="round"
            />
            <path
              d={`M 24 ${sourceY - 1.5} C ${34 + stagger} ${controlY + 6}, ${39 + stagger} ${controlY - 8}, ${index % 2 === 0 ? 30 : 40} ${targetY - 1.5}`}
              fill="none"
              stroke="rgba(40, 36, 30, 0.9)"
              strokeWidth="0.58"
              strokeLinecap="round"
            />
          </g>
        );
      })}
    </svg>
  );
}

function BusBoardBlock({ bandIndex }: { bandIndex: number }) {
  const offset = bandIndex % 2 === 0 ? "left-[24%]" : "left-[34%]";

  return (
    <div
      className={`absolute top-1/2 z-[4] h-4 w-[50%] -translate-y-1/2 overflow-hidden border border-[#2a2a24] bg-[#11130f] shadow-[0_5px_14px_rgba(0,0,0,0.48),inset_0_1px_0_rgba(255,255,255,0.05)] ${offset}`}
    >
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(255,255,255,0.04),transparent_18%,rgba(0,0,0,0.25))]" />
      <div className="absolute left-3 right-8 top-1/2 h-[7px] -translate-y-1/2">
        {Array.from({ length: 12 }).map((_, index) => (
          <span
            key={index}
            className="absolute top-0 h-[7px] w-[4px] rounded-[1px] border border-black/50 bg-[#1f241c] shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]"
            style={{ left: `${index * 8}%` }}
          />
        ))}
      </div>
      <span className="absolute right-3 top-1/2 h-1.5 w-1.5 -translate-y-1/2 rounded-full bg-[#5fa5ff] shadow-[0_0_8px_rgba(95,165,255,0.72)]" />
    </div>
  );
}

function VesaMountPattern({ hardwareColor }: { hardwareColor: string }) {
  const holes = [
    "left-[calc(50%-18px)] top-[calc(50%-18px)]",
    "left-[calc(50%+18px)] top-[calc(50%-18px)]",
    "left-[calc(50%-18px)] top-[calc(50%+18px)]",
    "left-[calc(50%+18px)] top-[calc(50%+18px)]",
  ];

  return (
    <div className="pointer-events-none absolute inset-0 z-[2]" aria-hidden="true">
      {holes.map((position) => (
        <span
          key={position}
          className={`absolute h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full border border-black/42 shadow-[0_0_8px_rgba(213,160,106,0.2),inset_0_1px_0_rgba(255,238,207,0.32)] ${position}`}
          style={{
            background: `radial-gradient(circle at 38% 34%, rgba(255,238,207,0.72), ${hardwareColor} 42%, rgba(80,48,20,0.92) 100%)`,
          }}
        />
      ))}
    </div>
  );
}

function WitnessModule({
  kind,
  hardwareColor,
  bandIndex,
  totalBands,
}: {
  kind: "3U" | "1U";
  hardwareColor: string;
  bandIndex: number;
  totalBands: number;
}) {
  const threeUPositions =
    totalBands === 1
      ? ["left-[42%]"]
      : totalBands === 2
        ? ["left-[18%]", "left-[62%]"]
        : ["left-[16%]", "left-[56%]", "left-[32%]"];
  const oneUPositions =
    totalBands === 2 ? ["left-[50%]", "left-[30%]"] : ["left-[38%]", "left-[52%]", "left-[30%]"];
  const threeULeft = threeUPositions[bandIndex] || "left-[44%]";
  const oneULeft = oneUPositions[bandIndex] || "left-[42%]";

  if (kind === "1U") {
    return (
      <div className={`absolute bottom-[3px] top-[3px] z-[12] w-[24%] border border-[#d5a06a]/30 bg-[#14110e] shadow-[0_8px_18px_rgba(0,0,0,0.52),inset_0_1px_0_rgba(255,255,255,0.08)] ${oneULeft}`}>
        <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,238,207,0.08),transparent_38%,rgba(0,0,0,0.24))]" />
        <div className="absolute left-1.5 top-1/2 h-1.5 w-1.5 -translate-y-1/2 rounded-full shadow-[0_1px_4px_rgba(0,0,0,0.55)]" style={{ background: hardwareColor }} />
        <div className="absolute right-1.5 top-1/2 h-1.5 w-1.5 -translate-y-1/2 rounded-full bg-[#e6d9c5]/42 shadow-[0_1px_4px_rgba(0,0,0,0.55)]" />
        <div className="absolute left-[18%] top-1/2 h-[34%] w-px -translate-y-1/2 bg-[#e6d9c5]/20" />
        <div className="absolute left-[32%] right-[18%] top-1/2 h-px -translate-y-1/2 bg-[#e6d9c5]/24" />
        <div className="absolute right-[16%] top-1/2 h-2 w-2 -translate-y-1/2 rounded-full border border-[#e6d9c5]/22" />
      </div>
    );
  }

  return (
    <div className={`absolute bottom-[3px] top-[3px] z-[12] w-[10%] border border-[#d5a06a]/28 bg-[#14110e] shadow-[0_12px_24px_rgba(0,0,0,0.56),inset_0_1px_0_rgba(255,255,255,0.08)] ${threeULeft}`}>
      <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,238,207,0.08),transparent_35%,rgba(0,0,0,0.3))]" />
      <div className="absolute left-1/2 top-1.5 h-1.5 w-1.5 -translate-x-1/2 rounded-full shadow-[0_1px_4px_rgba(0,0,0,0.55)]" style={{ background: hardwareColor }} />
      <div className="absolute left-1/2 top-[24%] h-3 w-3 -translate-x-1/2 rounded-full border border-[#e6d9c5]/24 bg-black/18" />
      <div className="absolute bottom-[18%] left-1/2 h-[34%] w-px -translate-x-1/2 bg-[#e6d9c5]/22" />
      <div className="absolute bottom-1.5 left-1/2 h-1.5 w-1.5 -translate-x-1/2 rounded-full bg-[#e6d9c5]/42 shadow-[0_1px_4px_rgba(0,0,0,0.55)]" />
    </div>
  );
}
