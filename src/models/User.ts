import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../instances/mysql';

export interface UserInstance extends Model {
    id: number;
    email: string;
    password: string;
    name: string;
    discipline: string;

}

export const User = sequelize.define<UserInstance>('User', {
    id: {
        primaryKey: true,
        autoIncrement: true,
        type: DataTypes.INTEGER
    },
    email: {
        type: DataTypes.STRING,
        unique: true
    },
    password: {
        type: DataTypes.STRING
    },
    name: {
        type: DataTypes.STRING,
        unique: true
    },
    discipline: {
        type: DataTypes.STRING,
        unique: true
    },
}, {
    tableName: 'users',
    timestamps: true,
    paranoid: true,
});