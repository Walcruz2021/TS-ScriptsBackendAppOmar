import Env from '@ioc:Adonis/Core/Env'
import { ApplicationContract } from '@ioc:Adonis/Core/Application'
import Aws from 'aws-sdk'
import { AWS_ACCESS_KEY_ID, AWS_REGION, AWS_SECRET_ACCESS_KEY } from 'App/utils'

/*
|--------------------------------------------------------------------------
| Provider
|--------------------------------------------------------------------------
|
| Your application is not ready when this file is loaded by the framework.
| Hence, the top level imports relying on the IoC container will not work.
| You must import them inside the life-cycle methods defined inside
| the provider class.
|
| @example:
|
| public async ready () {
|   const Database = this.app.container.resolveBinding('Adonis/Lucid/Database')
|   const Event = this.app.container.resolveBinding('Adonis/Core/Event')
|   Event.on('db:query', Database.prettyPrint)
| }
|
*/
export default class AwsProvider {
  constructor(protected app: ApplicationContract) {}

  public register() {
    Aws.config.update({
      accessKeyId: Env.get(AWS_ACCESS_KEY_ID),
      secretAccessKey: Env.get(AWS_SECRET_ACCESS_KEY),
      region: Env.get(AWS_REGION)
    })
    this.app.container.singleton('Aws', () => Aws)
  }

  public async boot() {
    // All bindings are ready, feel free to use them
  }

  public async ready() {
    // App is ready
  }

  public async shutdown() {}
}
