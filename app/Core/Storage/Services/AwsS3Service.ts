import Env from '@ioc:Adonis/Core/Env'
import { S3 } from '@ioc:Aws'
import { AWS_PUBLIC_BUCKET_NAME } from 'App/utils'

export default class AwsS3Service {
  /**
   * Upload the file to s3.
   */
  public static async upload(
    Key: string,
    Body: S3.Body,
    ContentType: string,
    ContentEncoding?: string,
    ACL?: string | any
  ): Promise<S3.ManagedUpload.SendData> {
    const s3 = new S3()
    const params: S3.PutObjectRequest = {
      Bucket: Env.get(AWS_PUBLIC_BUCKET_NAME),
      Body,
      ContentType,
      ContentEncoding: ContentEncoding ?? '',
      Key
    }
    if (ACL) {
      params['ACL'] = ACL
    }

    return s3.upload(params).promise()
  }

  /**
   * Remove the file to s3.
   */
  public static async deleteObject(Key: string): Promise<void> {
    const s3 = new S3()
    const params: S3.PutObjectRequest = {
      Bucket: Env.get(AWS_PUBLIC_BUCKET_NAME),
      Key
    }
    await s3.deleteObject(params).promise()
  }
}
