import argon2 from 'argon2'
import crypto from 'crypto'

const SALT_LENGTH = 16 // bytes

export const hashPassword = async (plain: string): Promise<string> => {
  const salt = crypto.randomBytes(SALT_LENGTH)

  return argon2.hash(plain, {
    type: argon2.argon2id,
    salt,                // pass Buffer, not saltLength
    timeCost: 3,         // iterations
    memoryCost: 1 << 16, // memory cost (KiB)
    parallelism: 1,
  })
}

export const verifyPassword = async (plain: string, hashed: string): Promise<boolean> =>{
  return argon2.verify(hashed, plain) // correct argument order
}


