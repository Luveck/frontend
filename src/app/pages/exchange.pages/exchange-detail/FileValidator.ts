export class FileValidator {
  private readonly acceptType = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'];

  validateType(fileType: string): boolean {
    return fileType === '' || fileType === undefined
      ? false
      : this.acceptType.includes(fileType);
  }

  checkDropped(fileName: string, files: File[]): boolean {
    for (const file of files) {
      if (file.name === fileName) {
        return true;
      }
    }
    return false;
  }
}
