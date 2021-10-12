import bcryptjs from 'bcryptjs';

const salt = bcryptjs.genSaltSync(10);

export const hash = (plainText: string) => bcryptjs.hashSync(plainText, salt);

export const compare = (plainText: string, hashedText: string) => bcryptjs.compareSync(plainText, hashedText);