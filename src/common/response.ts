export class Response {
  static withoutData(status: number, message: string) {
    return { status, message };
  }

  static withData(status: number, message: string, data: any) {
    return { status, message, data };
  }
}
