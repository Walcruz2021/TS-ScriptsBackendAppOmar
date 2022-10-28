import Country from 'App/Core/Country/Infraestructure/Mongoose/Models/Country'
import CountryRepo from 'App/Core/Country/Infraestructure/Mongoose/Repositories/CountryRepository'
const CountryRepository = new CountryRepo(Country)
export default CountryRepository
