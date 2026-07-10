import * as XLSX from 'xlsx';
import { isNative } from '../hooks/usePlatform';

export async function exportToExcel(workbook, fileName) {
  if (isNative) {
    const { Filesystem, Directory } = await import('@capacitor/filesystem');
    const { Share } = await import('@capacitor/share');

    const wbout = XLSX.write(workbook, { bookType: 'xlsx', type: 'base64' });

    await Filesystem.writeFile({
      path: fileName,
      data: wbout,
      directory: Directory.Cache
    });

    const { uri } = await Filesystem.getUri({
      path: fileName,
      directory: Directory.Cache
    });

    await Share.share({
      title: fileName,
      url: uri,
      dialogTitle: 'Guardar o compartir'
    });
  } else {
    XLSX.writeFile(workbook, fileName);
  }
}