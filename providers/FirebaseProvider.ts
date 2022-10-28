import Env from '@ioc:Adonis/Core/Env'
import { ApplicationContract } from '@ioc:Adonis/Core/Application'
import Firebase from 'firebase'

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
export default class FirebaseProvider {
  constructor(protected app: ApplicationContract) {}

  public register() {
    const config = {
      apiKey: Env.get('FIREBASE_API_KEY'),
      authDomain: Env.get('FIREBASE_AUTH_DOMAIN'),
      projectId: Env.get('FIREBASE_PROJECT_ID'),
      storageBucket: Env.get('FIREBASE_STORAGE_BUCKET'),
      messagingSenderId: Env.get('FIREBASE_MESSAGING_SENDER_ID'),
      appId: Env.get('FIREBASE_APP_ID'),
      measurementId: Env.get('FIREBASE_MEASUREMENT_ID'),
      databaseURL: Env.get('FIREBASE_DATABASE_URL')
    }

    Firebase.initializeApp(config)

    Firebase.firestore().settings({
      merge: true,
      cacheSizeBytes: Firebase.firestore.CACHE_SIZE_UNLIMITED,
      ignoreUndefinedProperties: true
    })

    this.app.container.singleton('Firebase', () => Firebase)
  }

  public async boot() {
    // All bindings are ready, feel free to use them
  }

  public async ready() {
    // App is ready
  }

  public async shutdown() {}
}
