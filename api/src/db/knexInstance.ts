import knex from "knex"
import knexConfig from "./knexFile"

const knexInstance = knex(knexConfig.development)

export default knexInstance
