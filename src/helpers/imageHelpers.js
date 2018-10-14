export const blobToBase64 = (blob) => {
  console.log('BLOBBB:', blob)
  const reader = new FileReader()
  blob && reader.readAsDataURL(blob)
    reader.onload = () => {
      return reader.result
    }
}
