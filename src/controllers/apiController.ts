import { Request, Response } from 'express';
import { User } from '../models/User';
import nodemailer, { SendMailOptions } from 'nodemailer';
import JWT from 'jsonwebtoken'
const bcrypt = require('bcrypt');

export const ping = (req: Request, res: Response) => {
    res.json({ pong: true });
}

export const register = async (req: Request, res: Response) => {

    const { email, password, name, discipline } = req.body;

    if (email && password && name && discipline) {

        try{
            let hasUser = await User.findOne({ where: { email } });

            if(!hasUser) {
                const saltRounds = 10;
                const hashedPassword = await bcrypt.has(password, saltRounds);
        
                let newUser = await User.create({
                    email,
                    password: hashedPassword,
                    name,
                    discipline
                })

                res.status(201).json({ message: 'Usuário cadastrado com sucesso.', newUser });
            }
        }catch(error) {
            console.error('Erro ao cadastrar usuário: ', error);
            res.status(500).json({ error: 'Erro interno ao processar o registro.' });
        }
        
    }

    return res.json({ error: 'E-mail, senha, nome e/ou disciplina não fornecidos.' });
}

export const login = async (req: Request, res: Response) => {
    if (req.body.email && req.body.password) {
        let email: string = req.body.email;
        let password: string = req.body.password;

        let user = await User.findOne({
            where: { email, password }
        });

        if (user) {
            res.json({ status: true });
            return;
        }
    }

    res.json({ status: false });
}




export const listAll = async (req: Request, res: Response) => {
    let users = await User.findAll();

    res.json({ users });
}


export const forgotPassword = async (req: Request, res: Response) => {
    const { email } = req.params;

    if (!email) {
        return res.json({ error: 'E-mail não fornecido.' });
    }

    try {
        const user = await User.findOne({ where: { email } });

        if (!user) {
            return res.status(404).json({ error: 'Usuário não encontrado.' });
        }

        const randomPassword = Math.random().toString(36).slice(-8);

        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(randomPassword, saltRounds);

        user.password = hashedPassword;
        await user.save();

    } catch (error) {
        console.error(error);
        return res.json({ error: 'Ocorreu um erro ao processar a solicitação.' });
    }
};