// Session storage utilities for file persistence
export const fileStorageKey = 'usepdf_file'
export const resultsStorageKey = 'usepdf_results'

export async function saveFileToSession(file: File): Promise<void> {
  try {
    const arrayBuffer = await file.arrayBuffer()
    const uint8Array = new Uint8Array(arrayBuffer)
    const base64String = btoa(String.fromCharCode.apply(null, Array.from(uint8Array)))
    
    sessionStorage.setItem(fileStorageKey, JSON.stringify({
      name: file.name,
      type: file.type,
      size: file.size,
      data: base64String,
      timestamp: Date.now()
    }))
  } catch (error) {
    console.log('Could not save file to session storage')
  }
}

export async function getFileFromSession(): Promise<File | null> {
  try {
    const stored = sessionStorage.getItem(fileStorageKey)
    if (!stored) return null
    
    const { name, type, data, timestamp } = JSON.parse(stored)
    
    // Expire session storage after 30 minutes
    if (Date.now() - timestamp > 30 * 60 * 1000) {
      sessionStorage.removeItem(fileStorageKey)
      sessionStorage.removeItem(resultsStorageKey)
      return null
    }
    
    const uint8Array = new Uint8Array(atob(data).split('').map(c => c.charCodeAt(0)))
    const blob = new Blob([uint8Array], { type })
    return new File([blob], name, { type })
  } catch (error) {
    console.log('Could not restore file from session storage')
    return null
  }
}

export function clearFileSession(): void {
  sessionStorage.removeItem(fileStorageKey)
  sessionStorage.removeItem(resultsStorageKey)
}
