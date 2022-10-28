import OpenTimestamps from 'javascript-opentimestamps'
// eslint-disable-next-line @typescript-eslint/naming-convention

export class Stamp {
  public static async stampHash(
    hash: string
  ): Promise<{ ots: string; fileOts: Array<any> }> {
    const buff = Buffer.from(hash, 'hex')
    const ops = new OpenTimestamps.Ops.OpSHA256()
    const detached = OpenTimestamps.DetachedTimestampFile.fromHash(ops, buff)

    await OpenTimestamps.stamp(detached)
    const fileOts = detached.serializeToBytes()

    return Promise.resolve({ ots: this.toHexString(fileOts), fileOts })
  }

  /**
   * Create Hex String.
   *
   * @param byteArray
   */
  public static toHexString(byteArray: any): string {
    return Array.from(byteArray, (byte: any) => {
      return ('0' + (byte & 0xff).toString(16)).slice(-2)
    }).join('')
  }
}
