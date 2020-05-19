import * as Print from 'expo-print'
import * as Sharing from 'expo-sharing'

export const printPDF = async (html) => {
  const printOptions = {
    html,
  }

  await Print.printAsync(printOptions)
}

export const sharePDF = async (html) => {
  const printOptions = {
    html,
  }
  const pdf = await Print.printToFileAsync(printOptions)
  await Sharing.shareAsync(pdf.uri, {
    mimeType: 'application/pdf',
    uti: 'com.adobe.pdf',
  })
}

export default printPDF
