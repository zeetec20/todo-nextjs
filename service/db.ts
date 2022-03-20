import dbConfig from '../db.config'
import {Sequelize} from 'sequelize'

export default class DB {
    db: Sequelize
    constructor() {
        this.db = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
            host: dbConfig.HOST,
            dialect: 'mysql',
            define: {
                freezeTableName: true
            }
        });
    }
}