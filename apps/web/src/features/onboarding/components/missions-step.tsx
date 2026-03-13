"use client"

import { useState } from "react"
import { useOnboardingStore } from "../stores/use-onboarding-store"
import { Field, FieldLabel, FieldError, FieldContent } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Briefcase, Trash2, PlusCircle, FileUp, X, FileText } from "lucide-react"
import { toast } from "sonner"

export function MissionsStep() {
  const { values, addMissionProof, removeMissionProof, errors } = useOnboardingStore()
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [newMission, setNewMission] = useState({ clientName: "", description: "", year: new Date().getFullYear() })

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0])
    }
  }

  const handleAddMission = async () => {
    if (newMission.clientName.length < 2 || newMission.description.length < 10) {
      toast.error("Veuillez remplir correctement les informations de la mission")
      return
    }

    if (!selectedFile) {
      toast.error("Veuillez joindre une preuve de mission (Livrable, Facture anonymisée, etc.)")
      return
    }

    setIsUploading(true)
    setUploadProgress(0)

    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 95) {
          clearInterval(interval)
          return prev
        }
        return prev + 5
      })
    }, 50)

    await new Promise((resolve) => setTimeout(resolve, 1500))
    clearInterval(interval)
    setUploadProgress(100)

    addMissionProof({
      id: crypto.randomUUID(),
      clientName: newMission.clientName,
      description: newMission.description,
      year: newMission.year,
      fileName: selectedFile.name,
    })
    
    setTimeout(() => {
      setNewMission({ clientName: "", description: "", year: new Date().getFullYear() })
      setSelectedFile(null)
      setIsUploading(false)
      setUploadProgress(0)
      toast.success("Mission ajoutée avec succès")
    }, 200)
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="space-y-1">
        <h2 className="text-xl font-bold text-[#2d4f44]">Preuves de missions</h2>
        <p className="text-sm text-zinc-500">Listez vos missions passées pour rassurer les entreprises.</p>
      </div>

      <div className="rounded-[24px] border-[1.5px] border-zinc-100 bg-zinc-50/50 p-6 space-y-4">
        {isUploading && (
          <div className="space-y-2 mb-4">
            <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-[#2d4f44]">
              <span>Upload du livrable : {selectedFile?.name}...</span>
              <span>{uploadProgress}%</span>
            </div>
            <Progress value={uploadProgress} className="h-1.5" />
          </div>
        )}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="md:col-span-3">
            <FieldLabel htmlFor="client-name" className="text-[12px] font-bold uppercase tracking-widest text-zinc-500 mb-2">
              Nom du client / Entreprise
            </FieldLabel>
            <Input
              id="client-name"
              placeholder="Ex: Coca-Cola, EDF, PME Industrielle..."
              value={newMission.clientName}
              onChange={(e) => setNewMission({ ...newMission, clientName: e.target.value })}
              className="h-12 rounded-sm border-zinc-200 focus:ring-[#2d4f44]"
            />
          </div>
          <div>
            <FieldLabel htmlFor="mission-year" className="text-[12px] font-bold uppercase tracking-widest text-zinc-500 mb-2">
              Année
            </FieldLabel>
            <Input
              id="mission-year"
              type="number"
              value={newMission.year}
              onChange={(e) => setNewMission({ ...newMission, year: parseInt(e.target.value) || new Date().getFullYear() })}
              className="h-12 rounded-sm border-zinc-200 focus:ring-[#2d4f44]"
            />
          </div>
          <div className="md:col-span-4">
            <FieldLabel htmlFor="mission-desc" className="text-[12px] font-bold uppercase tracking-widest text-zinc-500 mb-2">
              Description de la mission
            </FieldLabel>
            <Textarea
              id="mission-desc"
              placeholder="Décrivez brièvement votre rôle et les résultats obtenus..."
              className="min-h-25 rounded-sm border-zinc-200 focus:ring-[#2d4f44] resize-none"
              value={newMission.description}
              onChange={(e) => setNewMission({ ...newMission, description: e.target.value })}
            />
          </div>

          <div className="md:col-span-4">
             <FieldLabel className="text-[12px] font-bold uppercase tracking-widest text-zinc-500 mb-2">
              Preuve de mission (PDF, Livrable, Rapport anonymisé)
            </FieldLabel>
            {!selectedFile ? (
              <div className="relative group">
                <input
                  type="file"
                  onChange={handleFileChange}
                  accept=".pdf,.png,.jpg,.jpeg"
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                />
                <div className="h-24 flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-zinc-200 bg-white group-hover:border-[#2d4f44]/30 transition-all">
                  <FileUp className="h-6 w-6 text-zinc-400 group-hover:text-[#2d4f44] mb-2" />
                  <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 group-hover:text-[#2d4f44]">
                    Cliquez ou déposez la preuve de mission
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-between p-4 rounded-xl border border-zinc-200 bg-white">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-full bg-[#2d4f44]/10 text-[#2d4f44] flex items-center justify-center">
                    <FileText className="h-4 w-4" />
                  </div>
                  <div className="overflow-hidden">
                    <p className="text-xs font-bold text-[#2d4f44] truncate max-w-62.5">{selectedFile.name}</p>
                    <p className="text-[9px] text-zinc-400 uppercase tracking-widest">
                      {(selectedFile.size / 1024).toFixed(0)} KB
                    </p>
                  </div>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => setSelectedFile(null)}
                  className="h-8 w-8 text-zinc-400 hover:text-destructive"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>

          <div className="md:col-span-4 mt-2">
            <Button
              type="button"
              onClick={handleAddMission}
              disabled={isUploading || !newMission.clientName || newMission.description.length < 10 || !selectedFile}
              className="w-full h-12 rounded-full bg-[#2d4f44] text-white hover:bg-[#1e352d] text-[11px] font-bold uppercase tracking-widest transition-all"
            >
              {isUploading ? (
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  Upload en cours...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <PlusCircle className="h-4 w-4" />
                  Ajouter cette mission
                </div>
              )}
            </Button>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        {values.missionProofs.length > 0 ? (
          values.missionProofs.map((mission) => (
            <div
              key={mission.id}
              className="group flex items-start justify-between p-4 rounded-2xl border border-zinc-100 bg-white hover:border-[#2d4f44]/20 transition-all"
            >
              <div className="flex items-start gap-4">
                <div className="h-10 w-10 flex items-center justify-center rounded-full bg-[#2d4f44]/10 text-[#2d4f44] shrink-0">
                  <Briefcase className="h-5 w-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-[#2d4f44]">{mission.clientName}</h4>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">
                      — {mission.year} {mission.fileName && `• ${mission.fileName}`}
                    </span>
                  </div>
                  <p className="text-sm text-zinc-500 mt-1 leading-relaxed">{mission.description}</p>
                </div>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => removeMissionProof(mission.id)}
                className="text-zinc-400 hover:text-destructive hover:bg-destructive/5 shrink-0"
              >
                <Trash2 className="h-5 w-5" />
              </Button>
            </div>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center p-12 rounded-[24px] border-2 border-dashed border-zinc-100 text-zinc-400">
            <Briefcase className="h-10 w-10 mb-4 opacity-20" />
            <p className="text-sm font-medium">Aucune mission ajoutée pour le moment.</p>
            {errors.missionProofs && (
              <p className="text-destructive text-sm mt-2">{errors.missionProofs}</p>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
