"use client"

import { useOnboardingStore } from "../stores/use-onboarding-store"
import { CheckCircle2, FileUp, Briefcase, Award } from "lucide-react"
import { Star1 } from "iconsax-react"

export function ReviewStep() {
  const { values } = useOnboardingStore()

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="space-y-1">
        <h2 className="text-xl font-bold text-[#2d4f44]">Récapitulatif</h2>
        <p className="text-sm text-zinc-500">Vérifiez vos informations avant de finaliser votre profil.</p>
      </div>

      <div className="space-y-4">
        {/* Profile Summary */}
        <div className="p-6 rounded-[24px] border border-zinc-100 bg-white">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-8 w-8 rounded-full bg-[#2d4f44]/10 text-[#2d4f44] flex items-center justify-center">
              <Award className="h-4 w-4" />
            </div>
            <h3 className="font-bold text-[#2d4f44] uppercase tracking-widest text-[11px]">Expertise & Bio</h3>
          </div>
          <div className="space-y-3">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Domaine principal</p>
              <p className="font-bold text-[#2d4f44]">{values.expertise}</p>
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Biographie</p>
              <p className="text-sm text-zinc-500 leading-relaxed italic">&quot;{values.bio}&quot;</p>
            </div>
          </div>
        </div>

        {/* Certifications Summary */}
        <div className="p-6 rounded-[24px] border border-zinc-100 bg-white">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-8 w-8 rounded-full bg-[#2d4f44]/10 text-[#2d4f44] flex items-center justify-center">
              <FileUp className="h-4 w-4" />
            </div>
            <h3 className="font-bold text-[#2d4f44] uppercase tracking-widest text-[11px]">
              Certifications ({values.certifications.length})
            </h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {values.certifications.map((cert) => (
              <div key={cert.id} className="flex items-center gap-2 p-3 rounded-xl bg-zinc-50 border border-zinc-100">
                <CheckCircle2 className="h-4 w-4 text-[#2d4f44]" />
                <div className="overflow-hidden">
                  <p className="text-xs font-bold text-[#2d4f44] truncate">{cert.name}</p>
                  <p className="text-[9px] text-zinc-400 uppercase tracking-tighter">Année {cert.year}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Missions Summary */}
        <div className="p-6 rounded-[24px] border border-zinc-100 bg-white">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-8 w-8 rounded-full bg-[#2d4f44]/10 text-[#2d4f44] flex items-center justify-center">
              <Briefcase className="h-4 w-4" />
            </div>
            <h3 className="font-bold text-[#2d4f44] uppercase tracking-widest text-[11px]">
              Expériences ({values.missionProofs.length})
            </h3>
          </div>
          <div className="space-y-3">
            {values.missionProofs.map((mission) => (
              <div key={mission.id} className="border-l-2 border-zinc-100 pl-4 py-1">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-bold text-[#2d4f44]">{mission.clientName}</p>
                  <span className="text-[9px] text-zinc-400 font-bold uppercase tracking-widest">— {mission.year} {mission.fileName && `• ${mission.fileName}`}</span>
                </div>
                <p className="text-xs text-zinc-500 line-clamp-1">{mission.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="p-4 rounded-[24px] bg-[#2d4f44]/5 border border-[#2d4f44]/10 text-center">
        <p className="flex flex-col items-center text-sm text-[#2d4f44] font-medium italic">
          <Star1 size={20} color="#2d4f44" className="mb-3" />
          Votre profil sera visible par nos entreprises partenaires une fois validé par nos experts.
        </p>
      </div>
    </div>
  )
}
