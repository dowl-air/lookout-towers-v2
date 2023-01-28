import { Tower } from "@/typings";

export const normalizeTowerObject = (tower: Tower) => {
    if ("toDate" in tower["created"]) {
        tower["created"] = tower["created"].toDate()
    }
    if ("toDate" in tower["modified"]) {
        tower["modified"] = tower["modified"].toDate()
    }
    if ("toDate" in tower["opened"]) {
        tower["opened"] = tower["opened"].toDate()
    }
    if ("toJSON" in tower["gps"]) {
        tower["gps"] = tower.gps.toJSON()
    }
    return tower
}